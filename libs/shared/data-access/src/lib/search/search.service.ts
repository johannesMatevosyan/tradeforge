import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
    private readonly searchSubject = new Subject<string>();

    readonly searchTerm = toSignal(
        this.searchSubject.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
        ),
        { initialValue: '' }
    );

    setSearchTerm(value: string): void {
        this.searchSubject.next(value.trim());
    }

    clear(): void {
        this.searchSubject.next('');
    }
}

