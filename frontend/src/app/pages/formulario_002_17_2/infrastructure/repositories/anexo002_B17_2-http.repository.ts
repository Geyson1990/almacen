import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo002_B17_2Repository } from '../../application/repositories/anexo002_B17_2.repository';
import { Anexo002_B17_2Request } from '../../domain/anexo002_B17_2/anexo002_B17_2Request';
import { Anexo002_B17_2Response } from '../../domain/anexo002_B17_2/anexo002_B17_2Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo002_B17_2HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo002_B17_2Request, Anexo002_B17_2Response>
  implements Anexo002_B17_2Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo2_b172}/`;
    super(http, urlApi);
  }
}
