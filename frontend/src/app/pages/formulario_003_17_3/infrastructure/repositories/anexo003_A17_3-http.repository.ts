import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo003_A17_3Repository } from '../../application/repositories/anexo003_A17_3.repository';
import { Anexo003_A17_3Request } from '../../domain/anexo003_A17_3/anexo003_A17_3Request';
import { Anexo003_A17_3Response } from '../../domain/anexo003_A17_3/anexo003_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo003_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo003_A17_3Request, Anexo003_A17_3Response>
  implements Anexo003_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo3_a173}/`;
    super(http, urlApi);
  }
}