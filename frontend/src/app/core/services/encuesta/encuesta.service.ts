import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncuestaGeneradaResult, EncuestaPorTupaResult } from 'src/app/modules/encuestas/domain';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  urlBuscarPorProcedYDestino = '';
  urlGenerar = '';

  constructor(private httpClient: HttpClient) {
    this.urlBuscarPorProcedYDestino = `${environment.baseUrlTramiteAPI}/${environment.endPoint.encuestas.buscarPorProcedYDestino}`;
    this.urlGenerar = `${environment.baseUrlTramiteAPI}/${environment.endPoint.encuestas.generar}`;
  }

  buscarPorProcedYDestino(idProc: number, tipoEncuesta: number): Observable<EncuestaPorTupaResult> {
    return this.httpClient.get<EncuestaPorTupaResult>(`${this.urlBuscarPorProcedYDestino}/${idProc}/${tipoEncuesta}`);
  }

  generarEncuesta(idTramite: number, idEncuestaConfig: number): Observable<EncuestaGeneradaResult> {
    // const data = {idTramite: idTramite, idEncuestaConfig: idEncuestaConfig}
    return this.httpClient.post<EncuestaGeneradaResult>(`${this.urlGenerar}?idTramite=${idTramite}&idEncuestaConfig=${idEncuestaConfig}`, null);
  }
}
