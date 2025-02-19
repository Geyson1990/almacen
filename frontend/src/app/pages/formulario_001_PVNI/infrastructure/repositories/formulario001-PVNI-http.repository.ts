import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formulario001PVNIRepository } from '../../application'
import { Formulario001_PVNIRequest, Formulario001_PVNIResponse } from '../../domain'
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';

@Injectable({
  providedIn: 'root'
})
export class Formulario001PVNIHttpRepository extends FormularioElectronicoHttpRepository<Formulario001_PVNIRequest, Formulario001_PVNIResponse>
  implements Formulario001PVNIRepository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_PVNI}/`;
    super(http, urlApi);
  }
}
