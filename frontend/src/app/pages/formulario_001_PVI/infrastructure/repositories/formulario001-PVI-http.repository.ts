import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formulario001PVIRepository } from '../../application'
import { Formulario001_PVIRequest, Formulario001_PVIResponse } from '../../domain'
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';

@Injectable({
  providedIn: 'root'
})
export class Formulario001PVIHttpRepository extends FormularioElectronicoHttpRepository<Formulario001_PVIRequest, Formulario001_PVIResponse>
  implements Formulario001PVIRepository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_PVI}/`;
    super(http, urlApi);
  }
}
