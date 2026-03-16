# OXC + Rolldown Modernization Plan for ng-packagr

## Lessons from vite-tsconfig-paths v7

We modernized [vite-tsconfig-paths](https://github.com/aleclarson/vite-tsconfig-paths) from a traditional JS toolchain to a fully OXC/Rust-native stack. The results:

- **oxc-resolver** replaced custom regex path matching + Vite resolver delegation (28x faster)
- **Rolldown** replaced tsup (esbuild) for bundling — dropped 101 transitive deps, 8ms builds
- **oxc-transform** replaced tsc for `.d.ts` generation via `isolatedDeclarations`
- **oxlint** replaced nothing (added type-aware linting + type-checking in one tool)
- **oxfmt** replaced Prettier
- **TypeScript 6.0 RC** — stricter branded types, `isolatedDeclarations` support

The key insight: OXC tools are drop-in replacements that share a Rust core. Each swap is low-risk individually, and the cumulative effect is a dramatically faster, simpler toolchain.

---

## Current ng-packagr Toolchain

| Layer                   | Current Tool                                                                 | Role                                                     |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| ~~**Linting**~~         | ~~ESLint + @typescript-eslint + eslint-plugin-import + header~~ → **oxlint** | Type-aware linting, import ordering                      |
| ~~**Formatting**~~      | ~~Prettier 3.8~~ → **oxfmt**                                                 | Code formatting                                          |
| **Bundling (output)**   | Rollup 4 + @rollup/plugin-json + rollup-plugin-dts                           | Flat ESM bundles + .d.ts bundling for packaged libraries |
| **Style processing**    | esbuild (CSS bundler context)                                                | CSS/SCSS/LESS bundling and tree-shaking                  |
| **CSS preprocessing**   | Sass (via piscina workers), PostCSS, LESS                                    | Stylesheet compilation                                   |
| **Angular compilation** | @angular/compiler-cli (NgtscProgram)                                         | Template compilation, metadata, type-checking            |
| **Build (self)**        | tsc + postbuild.js                                                           | Compiles ng-packagr itself                               |
| **Testing**             | Jasmine + jasmine-ts                                                         | Unit + integration tests                                 |
| **CI**                  | GitHub Actions (ubuntu + windows)                                            | Check (fmt + lint) + Build/Test                          |

---

## Modernization Targets

### Phase 1: Developer Tooling (Low Risk, High Value) — COMPLETE ✅

These changes affect only the development experience — not ng-packagr's output or runtime behavior. Zero regression risk.

#### 1.1 Prettier → oxfmt ✅

- [x] Install oxfmt (`pnpm add -Dw oxfmt@latest`)
- [x] Remove prettier (`pnpm remove prettier`)
- [x] Migrate config (`npx oxfmt --migrate=prettier` → `.oxfmtrc.json`)
- [x] Remove `.prettierrc` and `.prettierignore`
- [x] Run `oxfmt --write` to reformat codebase (348ms on 438 files)
- [x] Add `fmt` and `fmt:check` scripts to package.json
- [x] Verify `pnpm fmt:check` passes clean

**Config migrated:**

- `.prettierrc` → `.oxfmtrc.json` (printWidth: 120, singleQuote, trailingComma: all, arrowParens: avoid)
- `.prettierignore` → `ignorePatterns` in `.oxfmtrc.json`

#### 1.2 ESLint → oxlint ✅

- [x] Install oxlint + oxlint-tsgolint (`pnpm add -Dw oxlint@latest oxlint-tsgolint@latest`)
- [x] Remove eslint ecosystem (eslint, @typescript-eslint/\*, eslint-config-prettier, eslint-plugin-header, eslint-plugin-import)
- [x] Create `.oxlintrc.json` with migrated rules
- [x] Remove `.eslintrc.json` and `.eslintcache`
- [x] Update `lint` script to `oxlint src/`
- [x] Fix `no-useless-rename` violation in `compile-ngc.transform.ts`
- [x] Disable `typeCheck` (was effectively off in old config — all `no-unsafe-*` rules were disabled)
- [x] Disable `max-lines-per-function` (old ESLint override `!modules/**` effectively disabled it for all `src/` files)
- [x] Disable `unbound-method` and `restrict-template-expressions` (explicitly off in old config)
- [x] Verify `pnpm lint` passes clean (0 errors, 69 files, 93 rules, 256ms)

**Rules migrated:** consistent-type-assertions, no-non-null-assertion, no-unnecessary-qualifier, no-unused-expressions, import/first, import/newline-after-import, import/no-absolute-path, import/no-duplicates, import/no-unassigned-import, import/order, no-caller, no-console, no-empty, no-eval, no-multiple-empty-lines, no-throw-literal, sort-imports, curly

**Not migrated (accepted gaps):**

- `eslint-plugin-header` — license headers enforced by convention
- `padding-line-between-statements` — no oxlint equivalent
- `spaced-comment` — formatting concern, handled by oxfmt
- `max-len: 140` — handled by oxfmt `printWidth: 120`

#### 1.3 CI Workflow Updates ✅

- [x] Split `ci.yml` into `check` (fmt:check + lint) and `build-and-test` jobs
- [x] Split `pr.yml` into `check` (fmt:check + lint) and `build-and-test` jobs
- [x] Preserved existing action SHAs for checkout, pnpm, node setup
- [x] Preserved windows test job

---

### Phase 2: Build Tooling — ng-packagr Itself (Medium Risk)

These changes affect how ng-packagr is compiled/distributed, not what it produces for users.

#### 2.1 tsc → Rolldown + oxc-transform (self-build)

- [ ] Install oxc-transform (`pnpm add -D oxc-transform@latest`)
- [ ] Enable `isolatedDeclarations: true` in `tsconfig.json`
- [ ] Add explicit return types to all exported functions (~66 TS files)
- [ ] Replace `.d.ts` generation step with `oxc-transform` `isolatedDeclarationSync()`
- [ ] Verify `pnpm build` passes

**Note:** Keep `tsc` for JS compilation since ng-packagr emits CommonJS with preserved directory structure (not a single bundle). Only replace the `.d.ts` generation step.

---

### Phase 3: Output Bundling — Rollup → Rolldown (Medium-High Risk)

This is the highest-value change but requires the most validation because it affects what ng-packagr produces for its users (Angular library bundles).

#### 3.1 Rollup → Rolldown for Flat ESM Bundles

- [ ] Install rolldown (`pnpm add rolldown@latest`)
- [ ] Update `src/lib/flatten/rollup.ts` — change `import { rollup } from 'rollup'` → `'rolldown'`
- [ ] Verify `file-loader-plugin.ts` works with Rolldown plugin API
- [ ] Run all 21 integration sample libraries
- [ ] Verify FESM bundle structure matches Angular Package Format spec
- [ ] Verify source maps are valid
- [ ] Verify secondary entry points resolve correctly
- [ ] Verify watch mode works

#### 3.2 rollup-plugin-dts compatibility

- [ ] Test if `rollup-plugin-dts` works under Rolldown (Rollup-API-compatible)
- [ ] If not, investigate Angular compiler's own `.d.ts` output as alternative
- [ ] Verify flat declaration files are correct

#### 3.3 @rollup/plugin-json → Rolldown Built-in

- [ ] Remove `@rollup/plugin-json` dependency
- [ ] Verify Rolldown's built-in JSON module support works

---

### Phase 4: Style Processing (Lower Priority)

#### 4.1 esbuild CSS Context → Rolldown/OXC

- [ ] Evaluate Rolldown native CSS bundling as esbuild replacement
- [ ] Plan migration of `bundler-context.ts`, `stylesheet-plugin-factory.ts`, `css-language.ts`, `sass-language.ts`, `less-language.ts`
- [ ] Verify Sass worker (piscina) integration
- [ ] Verify PostCSS integration
- [ ] Run style processing tests (SCSS, LESS, PostCSS, Tailwind)

**Recommendation:** Defer until Phase 3 is stable.

---

## What NOT to Replace

| Tool                      | Reason to Keep                                                          |
| ------------------------- | ----------------------------------------------------------------------- |
| **@angular/compiler-cli** | Core Angular compilation. No OXC replacement exists or makes sense.     |
| **Sass / PostCSS / LESS** | CSS preprocessors are domain-specific. OXC doesn't replace these.       |
| **piscina**               | Worker thread pool for Sass. Good architecture, no reason to change.    |
| **RxJS**                  | Transformation pipeline architecture. This is ng-packagr's core design. |
| **injection-js**          | DI framework for build pipeline. Orthogonal to tooling.                 |
| **Jasmine**               | Test framework. Vitest would be an upgrade but is unrelated to OXC.     |
| **chokidar**              | File watching. Works well, no OXC alternative.                          |
| **Commander**             | CLI framework. Irreplaceable.                                           |

---

## Implementation Order

```
Phase 1.1: Prettier → oxfmt                    [DONE ✅]  [zero risk]
Phase 1.2: ESLint → oxlint                     [DONE ✅]  [zero risk]
Phase 1.3: CI workflow updates                  [DONE ✅]  [zero risk]
Phase 2.1: oxc-transform for self .d.ts         [TODO]     [low risk]
Phase 3.1: Rollup → Rolldown for FESM bundles   [TODO]     [medium risk]
Phase 3.2: rollup-plugin-dts compatibility      [TODO]     [medium risk]
Phase 3.3: Remove @rollup/plugin-json           [TODO]     [low risk]
Phase 4.1: esbuild CSS → Rolldown (deferred)    [TODO]     [high risk]
```

---

## Dependency Impact

### Phase 1 Results (Actual)

**Removed (7 packages, -153 transitive):**
| Package | Version | Reason |
|---------|---------|--------|
| `prettier` | ~3.8.0 | Replaced by oxfmt |
| `eslint` | 8.57.1 | Replaced by oxlint |
| `@typescript-eslint/eslint-plugin` | 8.56.1 | Replaced by oxlint |
| `@typescript-eslint/parser` | 8.56.1 | Replaced by oxlint |
| `eslint-config-prettier` | 10.1.8 | No longer needed |
| `eslint-plugin-header` | 3.1.1 | No direct replacement |
| `eslint-plugin-import` | 2.32.0 | Replaced by oxlint |

**Added (3 packages):**
| Package | Version | Reason |
|---------|---------|--------|
| `oxfmt` | ^0.40.0 | Formatting (348ms on 438 files) |
| `oxlint` | ^1.55.0 | Linting (256ms on 69 files, 93 rules) |
| `oxlint-tsgolint` | ^0.16.0 | Type-aware linting support |

### Remaining (Phase 2-3)

| Package               | Action | Reason                       |
| --------------------- | ------ | ---------------------------- |
| `@rollup/plugin-json` | Remove | Rolldown built-in            |
| `rolldown`            | Add    | Bundling (Phase 3)           |
| `oxc-transform`       | Add    | `.d.ts` generation (Phase 2) |

---

## Validation Strategy

Each phase has its own verification:

- **Phase 1:** `pnpm fmt:check && pnpm lint` — formatting and lint pass ✅
- **Phase 2:** `pnpm build` — ng-packagr builds itself correctly
- **Phase 3:** Full integration test suite — all 21 sample libraries + watch mode + consumer tests must pass on both ubuntu and windows
- **Phase 4:** Style processing tests — SCSS, LESS, PostCSS, Tailwind integration samples

The 21 integration sample libraries are the ultimate regression test. If they all produce valid Angular Package Format output, the migration is safe.
