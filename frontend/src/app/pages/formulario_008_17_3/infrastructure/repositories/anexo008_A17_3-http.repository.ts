import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo008_A17_3Repository } from '../../application/repositories/anexo008_A17_3.repository';
import { Anexo008_A17_3Request } from '../../domain/anexo008_A17_3/anexo008_A17_3Request';
import { Anexo008_A17_3Response } from '../../domain/anexo008_A17_3/anexo008_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo008_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo008_A17_3Request, Anexo008_A17_3Response>
  implements Anexo008_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo8_a173}/`;
    super(http, urlApi);
  }
}