import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Anexo002_B27Repository } from '../../application/repositories/anexo002_B27.repository';
import { Anexo002_B27Request } from '../../domain/anexo002_B27/anexo002_B27Request';
import { Anexo002_B27Response } from '../../domain/anexo002_B27/anexo002_B27Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo002_B27HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_B27Request, Anexo002_B27Response>
  implements Anexo002_B27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_b27NT}/`;
    super(http, urlApi);
  }
}
