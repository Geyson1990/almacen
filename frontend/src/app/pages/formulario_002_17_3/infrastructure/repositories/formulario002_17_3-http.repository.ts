import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario002_17_3Repository } from '../../application/repositories/formulario002_17_3.repository';
import { Formulario002_17_3Request } from '../../domain/formulario002_17_3/formulario002_17_3Request';
import { Formulario002_17_3Response } from '../../domain/formulario002_17_3/formulario002_17_3Response';


@Injectable({
    providedIn: 'root',
})
export class Formulario002_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario002_17_3Request, Formulario002_17_3Response>
  implements Formulario002_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario2_17_3}/`;
    super(http, urlApi);
  }
}