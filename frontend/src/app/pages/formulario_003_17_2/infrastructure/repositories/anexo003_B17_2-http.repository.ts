import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo003_B17_2Repository } from '../../application/repositories/anexo003_B17_2.repository';
import { Anexo003_B17_2Request } from '../../domain/anexo003_B17_2/anexo003_B17_2Request';
import { Anexo003_B17_2Response } from '../../domain/anexo003_B17_2/anexo003_B17_2Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo003_B17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo003_B17_2Request, Anexo003_B17_2Response>
  implements Anexo003_B17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo3_b172}/`;
    super(http, urlApi);
  }
}
