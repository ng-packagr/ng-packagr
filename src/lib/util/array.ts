export function toArray<T>(value: T | T[]): T[] {
  return [].concat(value);
}

export function flatten<T>(value: Array<T | T[]>): T[] {
  return [].concat.apply([], value);
}

export function unique<T>(value: T[]): T[] {
  // todo: his has been fixed in TypeScript 2.8 remove the casting when updating
  return [...new Set(value) as any];
}
