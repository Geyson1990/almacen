import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Anexo002_H17Request } from '../../models/Anexos/Anexo002H17/Anexo002_H17Request';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class Anexo002H17Service {

  urlApi: string = '';
  urlApiPdf: string = '';

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_h17}/`;
   // this.urlApiPdf = `${environment.baseUrlPdfAPI}/`;
  }

  saveInfo<T>(dat: Anexo002_H17Request): Observable<T> {
    
    return this.http.post<T>(this.urlApi, dat);
  }

  put<T>(data: any): Observable<T> {
    return this.http.put<T>(this.urlApi, data);
  }

}
