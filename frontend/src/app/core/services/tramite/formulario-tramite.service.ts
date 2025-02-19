import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response';
import { FormularioResponseModel } from '../../models/Tramite/FormularioResponseModel';

@Injectable({
  providedIn: 'root'
})
export class FormularioTramiteService {

  private urlFormularioTramite: string = '';
  private urlArchivo: string = '';
  private urlVisorPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlFormularioTramite = `${environment.baseUrlAPI}${environment.endPoint.formularioTramite}`;
    this.urlArchivo = `${environment.baseUrlAPI}${environment.endPoint.uriArchivoUpdate}`;
    this.urlVisorPdf = `${environment.baseUrlAPI}${environment.endPoint.uriDownloadTemplateDia}`;
  }

  get<T>(tramiteReqId: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlFormularioTramite}/${tramiteReqId}`);
  }
  uriArchivo<T>(idAnexo: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlArchivo}?id=${idAnexo}`);
  }
  visorPdf(data: any): Observable<ApiResponse<FormularioResponseModel>>{
    return this.httpClient.post<ApiResponse<FormularioResponseModel>>(this.urlVisorPdf, data);
  }
}
