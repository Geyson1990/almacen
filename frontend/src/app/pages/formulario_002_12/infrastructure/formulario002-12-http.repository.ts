import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Formulario002_12Request, Formulario002_12Response } from '../domain';
import { Formulario00212Repository } from '../application';

@Injectable({
  providedIn: 'root',
})
export class Formulario00212HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario002_12Request, Formulario002_12Response>
  implements Formulario00212Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario2_12}/`;
    super(http, urlApi);
  }
}
