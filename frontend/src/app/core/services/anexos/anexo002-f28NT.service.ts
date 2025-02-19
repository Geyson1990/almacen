import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Anexo002F28NTService {

  urlApi: string = '';
  urlApiPdf: string = '';
  urlLocal: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_f28NT}/`;
    // this.urlLocal = `${environment.baseUrlLocal}${environment.endPoint.anexos.anexo2_f28}/`;

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

  readPostFie(): Observable<any> {
    let htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(this.urlApiPdf + 'anexo002_f28NT', htmlOptions);
  }


}
