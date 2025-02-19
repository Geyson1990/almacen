import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private lastPage: string | null = null;

  // Establece la última página visitada
  setLastPage(url: string): void {
    this.lastPage = url;
  }

  // Obtiene la última página visitada
  getLastPage(): string | null {
    return this.lastPage;
  }
}