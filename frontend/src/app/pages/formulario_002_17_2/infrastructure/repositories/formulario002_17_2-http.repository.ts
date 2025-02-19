import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario002_17_2Repository } from '../../application/repositories/formulario002_17_2.repository';
import { Formulario002_17_2Request } from '../../domain/formulario002_17_2/formulario002_17_2Request';
import { Formulario002_17_2Response } from '../../domain/formulario002_17_2/formulario002_17_2Response';


@Injectable({
    providedIn: 'root',
})
export class Formulario002_17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario002_17_2Request, Formulario002_17_2Response>
  implements Formulario002_17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario2_17_2}/`;
    super(http, urlApi);
  }
}