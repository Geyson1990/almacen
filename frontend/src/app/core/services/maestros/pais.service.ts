import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.maestros.pais}/`;
  }

  get<T>(parametros: string): Observable<T> {
    return this.httpClient.get<T>(`${this.urlApi}?iso=${parametros}`);
  }

  getAll<T>(): Observable<T> {
    return this.httpClient.get<T>('assets/data/listadoPaises.json');
  }
}
