import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario001_17_2Repository } from '../../application/repositories/formulario001_17_2.repository';
import { Formulario001_17_2Request } from '../../domain/formulario001_17_2/formulario001_17_2Request';
import { Formulario001_17_2Response } from '../../domain/formulario001_17_2/formulario001_17_2Response';


@Injectable({
    providedIn: 'root',
})
export class Formulario001_17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario001_17_2Request, Formulario001_17_2Response>
  implements Formulario001_17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_17_2}/`;
    super(http, urlApi);
  }
}