import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo010_A17_3Repository } from '../../application/repositories/anexo010_A17_3.repository';
import { Anexo010_A17_3Request } from '../../domain/anexo010_A17_3/anexo010_A17_3Request';
import { Anexo010_A17_3Response } from '../../domain/anexo010_A17_3/anexo010_A17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo010_A17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo010_A17_3Request, Anexo010_A17_3Response>
  implements Anexo010_A17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo10_a173}/`;
    super(http, urlApi);
  }
}