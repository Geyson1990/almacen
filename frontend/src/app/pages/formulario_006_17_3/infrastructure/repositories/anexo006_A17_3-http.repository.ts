import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo006_A17_3Repository } from '../../application/repositories/anexo006_A17_3.repository';
import { Anexo006_A17_3Request } from '../../domain/anexo006_A17_3/anexo006_A17_3Request';
import { Anexo006_A17_3Response } from '../../domain/anexo006_A17_3/anexo006_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo006_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo006_A17_3Request, Anexo006_A17_3Response>
  implements Anexo006_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo6_a173}/`;
    super(http, urlApi);
  }
}