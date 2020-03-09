export function camelize(str: string): string {
  return str
    .replace(/(-|_|\.|\s)+(.)?/g, (_match, _separator, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^([A-Z])/, match => match.toLowerCase());
}
