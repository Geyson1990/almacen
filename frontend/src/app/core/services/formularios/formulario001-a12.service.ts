import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Formulario001A12Service {

  urlLocal : string;
  urlApi: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi  =  `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_a12}`;
  }

  get<T>(id: string): Observable<T> {
    return this.httpClient.get<T>(this.urlApi + id);
  }

  post<T>(data: any): Observable<T> {
    return this.httpClient.post<T>( this.urlApi, data);
  }

  put<T>(data: any): Observable<T> {
    return this.httpClient.put<T>(this.urlApi, data);
  }
}
