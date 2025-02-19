import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario012_17_3Repository } from '../../application/repositories/formulario012_17_3.repository';
import { Formulario012_17_3Request } from '../../domain/formulario012_17_3/formulario012_17_3Request';
import { Formulario012_17_3Response } from '../../domain/formulario012_17_3/formulario012_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario012_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario012_17_3Request, Formulario012_17_3Response>
  implements Formulario012_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario12_17_3}/`;
    super(http, urlApi);
  }
}