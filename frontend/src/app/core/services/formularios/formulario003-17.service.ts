import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { FormularioRequestPost } from '../../models/Formularios/Formulario003_17/FormularioRequestPost';

@Injectable({
  providedIn: 'root'
})
export class Formulario00317Service {

  urlApi: string = '';
  urlApiPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario3_17}/`;
    this.urlApiPdf = `${environment.baseUrlAPI}/Pdf/`;
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

  readPostFie(id: number): Observable<any> {
    let htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(this.urlApiPdf + `formulario003_17?id=${id}`, htmlOptions);
  }

}


