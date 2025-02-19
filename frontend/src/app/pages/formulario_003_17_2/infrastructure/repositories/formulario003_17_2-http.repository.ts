import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario003_17_2Repository } from '../../application/repositories/formulario003_17_2.repository';
import { Formulario003_17_2Request } from '../../domain/formulario003_17_2/formulario003_17_2Request';
import { Formulario003_17_2Response } from '../../domain/formulario003_17_2/formulario003_17_2Response';


@Injectable({
    providedIn: 'root',
})
export class Formulario003_17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario003_17_2Request, Formulario003_17_2Response>
  implements Formulario003_17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario3_17_2}/`;
    super(http, urlApi);
  }
}