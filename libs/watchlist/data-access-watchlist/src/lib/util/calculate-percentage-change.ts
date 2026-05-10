export function calculatePercentageChange(
  previousPrice: number | null | undefined,
  currentPrice: number | null | undefined
): number {
  if (!previousPrice || !currentPrice) {
    return 0;
  }

  return ((currentPrice - previousPrice) / previousPrice) * 100;
}
