import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario003_17_3Repository } from '../../application/repositories/formulario003_17_3.repository';
import { Formulario003_17_3Request } from '../../domain/formulario003_17_3/formulario003_17_3Request';
import { Formulario003_17_3Response } from '../../domain/formulario003_17_3/formulario003_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario003_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario003_17_3Request, Formulario003_17_3Response>
  implements Formulario003_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario3_17_3}/`;
    super(http, urlApi);
  }
}