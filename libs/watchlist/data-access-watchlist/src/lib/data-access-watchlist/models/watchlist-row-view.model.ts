export interface WatchlistRowView {
  id: string;
  symbolCode: string;
  displayName: string;
  label: string;
  isActive: boolean;

  price: number;
  previousPrice: number | null;
  direction: 'up' | 'down' | 'neutral';
  percentageChange: number;
}
