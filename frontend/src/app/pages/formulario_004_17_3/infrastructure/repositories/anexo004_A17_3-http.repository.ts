import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo004_A17_3Repository } from '../../application/repositories/anexo004_A17_3.repository';
import { Anexo004_A17_3Request } from '../../domain/anexo004_A17_3/anexo004_A17_3Request';
import { Anexo004_A17_3Response } from '../../domain/anexo004_A17_3/anexo004_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo004_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo004_A17_3Request, Anexo004_A17_3Response>
  implements Anexo004_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo4_a173}/`;
    super(http, urlApi);
  }
}