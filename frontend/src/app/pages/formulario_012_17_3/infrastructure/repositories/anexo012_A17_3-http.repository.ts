import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo012_A17_3Repository } from '../../application/repositories/anexo012_A17_3.repository';
import { Anexo012_A17_3Request } from '../../domain/anexo012_A17_3/anexo012_A17_3Request';
import { Anexo012_A17_3Response } from '../../domain/anexo012_A17_3/anexo012_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo012_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo012_A17_3Request, Anexo012_A17_3Response>
  implements Anexo012_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo12_a173}/`;
    super(http, urlApi);
  }
}