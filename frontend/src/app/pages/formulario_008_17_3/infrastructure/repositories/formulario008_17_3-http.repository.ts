import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario008_17_3Repository } from '../../application/repositories/formulario008_17_3.repository';
import { Formulario008_17_3Request } from '../../domain/formulario008_17_3/formulario008_17_3Request';
import { Formulario008_17_3Response } from '../../domain/formulario008_17_3/formulario008_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario008_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario008_17_3Request, Formulario008_17_3Response>
  implements Formulario008_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario8_17_3}/`;
    super(http, urlApi);
  }
}