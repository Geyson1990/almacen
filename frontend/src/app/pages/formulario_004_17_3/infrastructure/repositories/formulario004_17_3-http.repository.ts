import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario004_17_3Repository } from '../../application/repositories/formulario004_17_3.repository';
import { Formulario004_17_3Request } from '../../domain/formulario004_17_3/formulario004_17_3Request';
import { Formulario004_17_3Response } from '../../domain/formulario004_17_3/formulario004_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario004_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario004_17_3Request, Formulario004_17_3Response>
  implements Formulario004_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario4_17_3}/`;
    super(http, urlApi);
  }
}