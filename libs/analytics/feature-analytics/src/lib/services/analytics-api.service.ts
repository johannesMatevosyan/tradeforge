import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    AnalyticsActivity,
    AnalyticsOverview,
    SymbolAnalytics,
} from '../models/analytics.models';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsApiService {
  private readonly http = inject(HttpClient);

  getOverview() {
    return this.http.get<AnalyticsOverview>('/api/analytics/overview');
  }

  getActivity() {
    return this.http.get<AnalyticsActivity>('/api/analytics/activity');
  }

  getSymbols() {
    return this.http.get<SymbolAnalytics[]>('/api/analytics/symbols');
  }
}
