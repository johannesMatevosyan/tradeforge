import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

@Injectable({ providedIn: 'root' })
export class PositionsApi {
  private http = inject(HttpClient);

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>('/api/positions');
  }
}
