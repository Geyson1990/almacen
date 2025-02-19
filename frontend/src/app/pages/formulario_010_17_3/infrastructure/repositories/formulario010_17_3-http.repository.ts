import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario010_17_3Repository } from '../../application/repositories/formulario010_17_3.repository';
import { Formulario010_17_3Request } from '../../domain/formulario010_17_3/formulario010_17_3Request';
import { Formulario010_17_3Response } from '../../domain/formulario010_17_3/formulario010_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario010_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario010_17_3Request, Formulario010_17_3Response>
  implements Formulario010_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario10_17_3}/`;
    super(http, urlApi);
  }
}