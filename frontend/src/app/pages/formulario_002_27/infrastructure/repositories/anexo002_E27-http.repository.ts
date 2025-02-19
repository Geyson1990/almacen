import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Anexo002_E27Repository } from '../../application/repositories/anexo002_E27.repository';
import { Anexo002_E27Request } from '../../domain/anexo002_E27/anexo002_E27Request';
import { Anexo002_E27Response } from '../../domain/anexo002_E27/anexo002_E27Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo002_E27HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_E27Request, Anexo002_E27Response>
  implements Anexo002_E27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_e27}/`;
    super(http, urlApi);
  }
}
