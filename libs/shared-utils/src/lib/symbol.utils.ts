export function normalizeSymbol(symbol: string): string {
  return symbol.replace('/', '').toUpperCase();
}
