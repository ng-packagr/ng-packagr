export function toArray<T>(value: T | T[]): T[] {
  return [].concat(value);
}

export function unique<T>(value: T[]): T[] {
  return [...new Set(value)];
}
