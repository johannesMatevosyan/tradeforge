import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MarketSymbol } from "../models/market-symbol.model";

@Injectable({
  providedIn: 'root',
})
export class SymbolsApiService {
  private readonly http = inject(HttpClient);

  getSymbols(): Observable<MarketSymbol[]> {
    return this.http.get<MarketSymbol[]>('/api/symbols');
  }
}
