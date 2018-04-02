export function toArray<T>(value: T | T[]): T[] {
  return [].concat(value);
}

export function flatten<T>(value: Array<T | T[]>): T[] {
  return [].concat.apply([], value);
}
