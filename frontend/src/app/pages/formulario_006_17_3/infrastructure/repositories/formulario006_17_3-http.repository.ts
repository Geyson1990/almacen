import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario006_17_3Repository } from '../../application/repositories/formulario006_17_3.repository';
import { Formulario006_17_3Request } from '../../domain/formulario006_17_3/formulario006_17_3Request';
import { Formulario006_17_3Response } from '../../domain/formulario006_17_3/formulario006_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario006_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario006_17_3Request, Formulario006_17_3Response>
  implements Formulario006_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario6_17_3}/`;
    super(http, urlApi);
  }
}