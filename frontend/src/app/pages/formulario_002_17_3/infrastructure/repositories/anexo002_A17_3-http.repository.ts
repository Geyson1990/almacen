import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo002_A17_3Repository } from '../../application/repositories/anexo002_A17_3.repository';
import { Anexo002_A17_3Request } from '../../domain/anexo002_A17_3/anexo002_A17_3Request';
import { Anexo002_A17_3Response } from '../../domain/anexo002_A17_3/anexo002_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo002_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_A17_3Request, Anexo002_A17_3Response>
  implements Anexo002_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_a173}/`;
    super(http, urlApi);
  }
}
