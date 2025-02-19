import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo005_A17_3Repository } from '../../application/repositories/anexo005_A17_3.repository';
import { Anexo005_A17_3Request } from '../../domain/anexo005_A17_3/anexo005_A17_3Request';
import { Anexo005_A17_3Response } from '../../domain/anexo005_A17_3/anexo005_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo005_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo005_A17_3Request, Anexo005_A17_3Response>
  implements Anexo005_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo5_a173}/`;
    super(http, urlApi);
  }
}