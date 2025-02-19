import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Formulario00312NTRepository } from '../application/formulario003-12NT.repository';
import { Formulario003_12NTRequest } from '../domain/formulario003_12NTRequest';
import { Formulario003_12NTResponse } from '../domain/formulario003_12NTResponse';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';

@Injectable({
  providedIn: 'root',
})
export class Formulario00312NTHttpRepository extends FormularioElectronicoHttpRepository<Formulario003_12NTRequest, Formulario003_12NTResponse>
  implements Formulario00312NTRepository {

  // private urlApi: string;

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario3_12NT}/`;
    super(http, urlApi);
  }

  // get(id: string): Observable<Formulario003_12NTResponse> {
  //   return this.http.get<Formulario003_12NTResponse>(this.urlApi + id);
  // }
  // post(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest> {
  //   return this.http.post<Formulario003_12NTRequest>( this.urlApi, data);
  // }
  // put(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest> {
  //   return this.http.put<Formulario003_12NTRequest>(this.urlApi, data);
  // }
}
