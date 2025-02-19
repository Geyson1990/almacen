import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario009_17_3Repository } from '../../application/repositories/formulario009_17_3.repository';
import { Formulario009_17_3Request } from '../../domain/formulario009_17_3/formulario009_17_3Request';
import { Formulario009_17_3Response } from '../../domain/formulario009_17_3/formulario009_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario009_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario009_17_3Request, Formulario009_17_3Response>
  implements Formulario009_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario9_17_3}/`;
    super(http, urlApi);
  }
}