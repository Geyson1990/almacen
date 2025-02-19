import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Formulario002_27Repository } from '../../application/repositories/formulario002_27.repository';
import { Formulario002_27Request } from '../../domain/formulario002_27/formulario002_27Request';
import { Formulario002_27Response } from '../../domain/formulario002_27/formulario002_27Response';

@Injectable({
  providedIn: 'root',
})
export class Formulario002_27HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario002_27Request, Formulario002_27Response>
  implements Formulario002_27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario2_27}/`;
    super(http, urlApi);
  }
}
