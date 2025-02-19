import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Anexo002_A27Repository } from '../../application/repositories/anexo002_A27.repository';
import { Anexo002_A27Request } from '../../domain/anexo002_A27/anexo002_A27Request';
import { Anexo002_A27Response } from '../../domain/anexo002_A27/anexo002_A27Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo002_A27HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_A27Request, Anexo002_A27Response>
  implements Anexo002_A27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_a27NT}/`;
    super(http, urlApi);
  }
}
