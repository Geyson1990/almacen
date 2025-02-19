import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Anexo002_C27Repository } from '../../application/repositories/anexo002_C27.repository';
import { Anexo002_C27Request } from '../../domain/anexo002_C27/anexo002_C27Request';
import { Anexo002_C27Response } from '../../domain/anexo002_C27/anexo002_C27Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo002_C27HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_C27Request, Anexo002_C27Response>
  implements Anexo002_C27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_c27}/`;
    super(http, urlApi);
  }
}
