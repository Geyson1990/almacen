import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Formulario001191Service {

  urlApi = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_19_1}/`;
  }

  get<T>(id: string): Observable<T> {
    return this.httpClient.get<T>(this.urlApi + id);
  }

  post<T>(data: any): Observable<T> {
    return this.httpClient.post<T>(this.urlApi, data);
  }

  put<T>(data: any): Observable<T> {
    return this.httpClient.put<T>(this.urlApi, data);
  }

  getPdf<T>(id: number): Observable<T> {
    return this.httpClient.get<T>(this.urlApi + id);
  }
}
