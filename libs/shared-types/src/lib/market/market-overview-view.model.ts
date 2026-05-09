import { MarketRowView } from './market-row-view.model';

export interface MarketOverviewView {
  totalMarkets: number;

  topGainer: MarketRowView | null;
  topLoser: MarketRowView | null;

  watchlistCount: number | null;
}
