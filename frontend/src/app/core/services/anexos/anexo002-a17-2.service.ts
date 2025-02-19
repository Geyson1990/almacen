import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Anexo002A172Service {

  urlApi: string;
  urlAnexoRead: string;
  urlApiPdf: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_a172}/`;
    this.urlApiPdf = `${environment.baseUrlAPI}/Pdf/`;
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

  readPostFie(id: number): Observable<any> {
    const htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(this.urlApiPdf + `anexo002_a17_2?id=${id}`, htmlOptions);
  }
}
