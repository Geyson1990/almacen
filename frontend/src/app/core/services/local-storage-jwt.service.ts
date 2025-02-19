import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const keyStore = 'jwtTokenTupa';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageJwtService {
  getItem(): Observable<string | null> {
    const data = localStorage.getItem(keyStore);

    if (data) {
      return of(data);
    }

    return of(null);
  }

  setItem(data: string): Observable<string> {
    localStorage.setItem(keyStore, data);
    return of(data);
  }

  removeItem(): Observable<boolean> {
    localStorage.removeItem(keyStore);
    return of(true);
  }
}
