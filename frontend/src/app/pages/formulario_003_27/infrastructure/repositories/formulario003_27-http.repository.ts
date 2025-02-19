import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario003_27Repository } from '../../application/repositories/formulario003_27.repository';
import { Formulario003_27Request } from '../../domain/formulario003_27/formulario003_27Request';
import { Formulario003_27Response } from '../../domain/formulario003_27/formulario003_27Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario003_27HttpRepository
  extends FormularioElectronicoHttpRepository<Formulario003_27Request, Formulario003_27Response>
  implements Formulario003_27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario3_27}/`;
    super(http, urlApi);
  }
}