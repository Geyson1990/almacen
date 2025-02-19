import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnexoRequestPost } from '../../models/Anexos/Anexo012_A17_3/AnexoRequestPost';

@Injectable({
  providedIn: 'root'
})
export class Anexo012A173Service {

  urlApi: string = '';
  urlApiPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo12_a173}/`;
    this.urlApiPdf = `${environment.baseUrlAPI}/`;
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


  readPostFie(id:number): Observable<any> {
    let htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(this.urlApiPdf + `anexo012_a173?id=${id}`, htmlOptions);
  }


}
