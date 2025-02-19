import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo001_A17_2Repository } from '../../application/repositories/anexo001_A17_2.repository';
import { Anexo001_A17_2Request } from '../../domain/anexo001_A17_2/anexo001_A17_2Request';
import { Anexo001_A17_2Response } from '../../domain/anexo001_A17_2/anexo001_A17_2Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo001_A17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo001_A17_2Request, Anexo001_A17_2Response>
  implements Anexo001_A17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo1_a172}/`;
    super(http, urlApi);
  }
}
