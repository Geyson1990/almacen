import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Formulario003_28Repository } from '../../application/repositories/formulario003-28.repository';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Formulario003_28Response } from '../../domain/formulario003_28/formulario003_28Response';
import { Formulario003_28Request } from '../../domain/formulario003_28/formulario003_28Request';

@Injectable({
  providedIn: 'root',
})
export class Formulario003_28HttpRepository
  extends FormularioElectronicoHttpRepository<
    Formulario003_28Request,
    Formulario003_28Response
  >
  implements Formulario003_28Repository
{
  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario3_28NT}/`;
    super(http, urlApi);
  }
}
