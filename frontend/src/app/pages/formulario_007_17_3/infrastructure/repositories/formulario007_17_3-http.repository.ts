import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario007_17_3Repository } from '../../application/repositories/formulario007_17_3.repository';
import { Formulario007_17_3Request } from '../../domain/formulario007_17_3/formulario007_17_3Request';
import { Formulario007_17_3Response } from '../../domain/formulario007_17_3/formulario007_17_3Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario007_17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario007_17_3Request, Formulario007_17_3Response>
  implements Formulario007_17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario7_17_3}/`;
    super(http, urlApi);
  }
}