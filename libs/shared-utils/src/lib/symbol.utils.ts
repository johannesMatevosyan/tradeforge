export function normalizeSymbol(symbol: string): string {
  return symbol.replace('/', '').toUpperCase();
}

export function formatSymbolValue(symbol: string): string {
  const value = symbol.toUpperCase();

  if (value.includes('/')) return value;

  if (value.endsWith('USD')) {
    return `${value.slice(0, -3)}/USD`;
  }

  return value;
}
