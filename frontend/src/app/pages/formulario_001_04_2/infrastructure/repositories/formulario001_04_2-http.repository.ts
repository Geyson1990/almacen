import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario001_04_2Request } from '../../domain/formulario001_04_2/formulario001_04_2Request';
import { Formulario001_04_2Response } from '../../domain/formulario001_04_2/formulario001_04_2Response';
import { Formulario001_04_2Repository } from '../../application/repositories/formulario001_04_2.repository';

@Injectable({
  providedIn: 'root',
})
export class Formulario001_04_2HttpRepository
  extends FormularioElectronicoHttpRepository<
    Formulario001_04_2Request,
    Formulario001_04_2Response
  >
  implements Formulario001_04_2Repository
{
  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_04_2}/`;
    super(http, urlApi);
  }
}
