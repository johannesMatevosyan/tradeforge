export function normalizeSymbol(symbol: string): string {
  return symbol.replace('/', '').toUpperCase();
}

export function formatSymbolValue(symbol: string): string {
  if (symbol.includes('/')) return symbol;

  if (symbol.endsWith('USD')) {
    return `${symbol.replace('USD', '')}/USD`;
  }

  return symbol;
}
