export function toArray<T>(value: T | T[]): T[] {
  return [].concat(value);
}

export function flatten<T>(value: Array<T | T[]>): T[] {
  return [].concat.apply([], value);
}

export function unique<T>(value: T[]): T[] {
  return [...new Set(value)];
}
