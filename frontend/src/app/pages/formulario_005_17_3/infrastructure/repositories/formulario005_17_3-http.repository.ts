import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario005_17_3Repository } from '../../application/repositories/formulario005_17_3.repository';
import { Formulario005_17_3Request } from '../../domain/formulario005_17_3/formulario005_17_3Request';
import { Formulario005_17_3Response } from '../../domain/formulario005_17_3/formulario005_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario005_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario005_17_3Request, Formulario005_17_3Response>
  implements Formulario005_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario5_17_3}/`;
    super(http, urlApi);
  }
}