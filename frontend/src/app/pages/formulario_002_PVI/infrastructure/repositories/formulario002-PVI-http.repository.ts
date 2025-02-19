import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formulario002PVIRepository } from '../../application'
import { Formulario002_PVIRequest, Formulario002_PVIResponse } from '../../domain'
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';

@Injectable({
  providedIn: 'root'
})
export class Formulario002PVIHttpRepository extends FormularioElectronicoHttpRepository<Formulario002_PVIRequest, Formulario002_PVIResponse>
  implements Formulario002PVIRepository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario2_PVI}/`;
    super(http, urlApi);
  }
}
