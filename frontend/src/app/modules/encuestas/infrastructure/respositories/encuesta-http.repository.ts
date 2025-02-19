import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EncuestaRepository } from '../../application/repositories';
import { Observable, of } from 'rxjs';
import { Encuesta, EncuestaPlantilla } from '../../domain';
import { ApiResponse } from 'src/app/core/models/api-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EncuestaHttpRepository implements EncuestaRepository {
  private urlApi: string = '';

  constructor(
    private readonly http: HttpClient
  ) {
    this.urlApi = `${environment.baseUrlAPI}`;
  }

  obtenerPlantilla(idEncuesta: number, codigoIdentificador: string): Observable<EncuestaPlantilla> {
    const ENDPOINT = `${this.urlApi}/${environment.endPoint.encuestas.encuestaPlantilla}`;
    return this.http.get<ApiResponse<EncuestaPlantilla>>(`${ENDPOINT}/${idEncuesta}/${codigoIdentificador}`)
    .pipe(map(x => x.data));
  }

  finalizar(data: Encuesta): Observable<void> {
    const ENDPOINT = `${this.urlApi}/${environment.endPoint.encuestas.finalizar}`;
    return this.http.post<void>(`${ENDPOINT}`, data);
  }

}
