import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AsignarProfRequest } from '../../models/Profesional/AsignarProfRequestModel';
import { ItemValidadorDocModel } from '../../models/Profesional/Autenticacion/ItemValidadorDocModel';
import { ValidarDocRequestModel } from '../../models/Profesional/Autenticacion/ValidarDocRequestModel';
import { ValidarDocResponseModel } from '../../models/Profesional/Autenticacion/ValidarDocResponseModel';
import { DocFirmadoRequestModel } from '../../models/Profesional/DocFirmadoRequestModel';
import { ObtDocToFirmaResponseModel } from '../../models/Profesional/ObtDocToFirmaResponseModel';
import { ProfesionalModel } from '../../models/Profesional/ProfesionalModel';
import { ProfesionModel } from '../../models/ProfesionModel';
import { ResponseComunModel } from '../../models/Tramite/ResponseComunModel';
import { TramiteModel } from '../../models/Tramite/TramiteModel';
import { ApiResponse } from '../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {

  urlObtenerValidador: string;
  urlValidarDocumento: string;
  urlObtenerProfesiones: string;
  urlObtenerProfesional: string;
  urlAsignarprofesional: string;
  urlObtenerRequisitoParaFirma: string;
  urlObtenerDocumentoParaFirma: string;
  urlDocumentoFirmado: string;
  urlLimpiarDocumentos: string;

  constructor(private httpClient: HttpClient) {
    this.urlObtenerValidador = `${environment.baseUrlAPI}${environment.endPoint.profesional.obtenerValidador}/`;
    this.urlValidarDocumento = `${environment.baseUrlAPI}${environment.endPoint.profesional.validarDocumento}/`;
    this.urlObtenerProfesiones = `${environment.baseUrlTramiteAPI}${environment.endPoint.profesional.obtenerProfesiones}/`;
    this.urlObtenerProfesional = `${environment.baseUrlTramiteAPI}${environment.endPoint.profesional.obtenerProfesional}/`;
    this.urlAsignarprofesional = `${environment.baseUrlAPI}${environment.endPoint.profesional.asignarProfesional}/`;
    this.urlObtenerRequisitoParaFirma = `${environment.baseUrlTramiteAPI}${environment.endPoint.profesional.obtenerRequisitoParaFirma}`;
    this.urlObtenerDocumentoParaFirma = `${environment.baseUrlTramiteAPI}${environment.endPoint.profesional.obtenerDocumentoParaFirma}`;
    this.urlDocumentoFirmado = `${environment.baseUrlTramiteAPI}${environment.endPoint.profesional.documentoFirmado}`;
    this.urlLimpiarDocumentos = `${environment.baseUrlTramiteAPI}${environment.endPoint.profesional.limpiardocumentos}`;
  }

  getObtenerValidadorList(tipoDoc: string): Observable<ItemValidadorDocModel[]> {
    return this.httpClient.get<ItemValidadorDocModel[]>(`${this.urlObtenerValidador}?tipoDoc=${tipoDoc}`);
  }

  postValidarDocumento(request: ValidarDocRequestModel): Observable<ValidarDocResponseModel> {
    return this.httpClient.post<ValidarDocResponseModel>(this.urlValidarDocumento, request);
  }

  getObtenerProfesiones(): Observable<ApiResponse<ProfesionModel[]>> {
    return this.httpClient.get<ApiResponse<ProfesionModel[]>>(this.urlObtenerProfesiones);
  }

  getObtenerProfesional(tipoDoc: string, numDoc: string): Observable<ProfesionalModel> {
    const params = new HttpParams()
      .set('tipoDoc', tipoDoc)
      .set('numDoc', numDoc);
    return this.httpClient.get<ProfesionalModel>(this.urlObtenerProfesional, { params });
  }

  postAsignarProfesional(request: AsignarProfRequest): Observable<ResponseComunModel<string>> {
    return this.httpClient.post<ResponseComunModel<string>>(this.urlAsignarprofesional, request);
  }

  getRequisitoParaFirma(idTramiteReqUrlEncode: string): Observable<ResponseComunModel<TramiteModel>> {
    const params = new HttpParams().set('idurlencode', idTramiteReqUrlEncode);
    return this.httpClient.get<ResponseComunModel<TramiteModel>>(this.urlObtenerRequisitoParaFirma, { params });
  }

  getDocumentoParaFirma(idTramiteReqUrlEncode: string): Observable<ResponseComunModel<ObtDocToFirmaResponseModel>> {
    const params = new HttpParams().set('idurlencode', idTramiteReqUrlEncode);
    return this.httpClient.get<ResponseComunModel<ObtDocToFirmaResponseModel>>(this.urlObtenerDocumentoParaFirma, { params });
  }

  postDocumentoFirmado(request: DocFirmadoRequestModel): Observable<ResponseComunModel<string>> {
    return this.httpClient.post<ResponseComunModel<string>>(this.urlDocumentoFirmado, request);
  }

  deleteLimpiarDocumentos(fileName: string): Observable<ResponseComunModel<string>> {
    const params = new HttpParams().set('fileName', fileName);
    return this.httpClient.delete<ResponseComunModel<string>>(this.urlLimpiarDocumentos, { params });
  }

}
