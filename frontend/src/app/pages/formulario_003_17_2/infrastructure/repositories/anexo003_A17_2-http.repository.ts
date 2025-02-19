import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo003_A17_2Repository } from '../../application/repositories/anexo003_A17_2.repository';
import { Anexo003_A17_2Request } from '../../domain/anexo003_A17_2/anexo003_A17_2Request';
import { Anexo003_A17_2Response } from '../../domain/anexo003_A17_2/anexo003_A17_2Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo003_A17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo003_A17_2Request, Anexo003_A17_2Response>
  implements Anexo003_A17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo3_a172}/`;
    super(http, urlApi);
  }
}
