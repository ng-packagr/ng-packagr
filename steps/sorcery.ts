const sorcery = require('sorcery');
import { info } from '../util/log';


/**
 * Re-maps the source `.map` file for the given `sourceFile`. This keeps source maps intact over
 * a series of transpilations!
 *
 * @param sourceFile Source file
 */
export const remapSourcemap = (sourceFile: string, base?: string): Promise<any> => {
    info(`re-mapping sources for ${sourceFile}`);
    const opts: any = {
        inline: false,
        includeContent: true,
    };
    if (base) {
        opts.base = base;
    }

    // Once sorcery loaded the chain of sourcemaps, the new sourcemap will be written asynchronously.
    return sorcery.load(sourceFile)
        .then((chain) => chain.write(opts));
}
