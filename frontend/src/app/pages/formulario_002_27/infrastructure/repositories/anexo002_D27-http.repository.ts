import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Anexo002_D27Repository } from '../../application/repositories/anexo002_D27.repository';
import { Anexo002_D27Request } from '../../domain/anexo002_D27/anexo002_D27Request';
import { Anexo002_D27Response } from '../../domain/anexo002_D27/anexo002_D27Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo002_D27HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_D27Request, Anexo002_D27Response>
  implements Anexo002_D27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_d27}/`;
    super(http, urlApi);
  }
}
