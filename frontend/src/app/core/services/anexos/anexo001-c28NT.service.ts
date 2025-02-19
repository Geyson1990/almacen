import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Anexo001C28NTService {

  urlApi: string;
  urlAnexoRead: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo1_c28NT}/`;
  }

  get<T>(id: string): Observable<T> {
    return this.httpClient.get<T>(this.urlAnexoRead + id);
  }

  post<T>(data: any): Observable<T> {
    return this.httpClient.post<T>(this.urlApi, data);
  }

  put<T>(data: any): Observable<T> {
    return this.httpClient.put<T>(this.urlApi, data);
  }
}
