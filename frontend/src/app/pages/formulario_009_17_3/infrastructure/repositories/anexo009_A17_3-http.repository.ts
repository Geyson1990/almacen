import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo009_A17_3Repository } from '../../application/repositories/anexo009_A17_3.repository';
import { Anexo009_A17_3Request } from '../../domain/anexo009_A17_3/anexo009_A17_3Request';
import { Anexo009_A17_3Response } from '../../domain/anexo009_A17_3/anexo009_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo009_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo009_A17_3Request, Anexo009_A17_3Response>
  implements Anexo009_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo9_a173}/`;
    super(http, urlApi);
  }
}