import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario001_17_03Repository } from '../../application/repositories/formulario001_17_03.repository';
import { Formulario001_17_03Request } from '../../domain/formulario001_17_03/formulario001_17_03Request';
import { Formulario001_17_03Response } from '../../domain/formulario001_17_03/formulario001_17_03Response';


@Injectable({
    providedIn: 'root',
})
export class Formulario001_17_03HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario001_17_03Request, Formulario001_17_03Response>
  implements Formulario001_17_03Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_17_03}/`;
    super(http, urlApi);
  }
}