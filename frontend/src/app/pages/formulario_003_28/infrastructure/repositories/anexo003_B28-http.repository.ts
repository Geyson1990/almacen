import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo003_B28Repository } from '../../application/repositories/anexo003_B28.repository';
import { Anexo003_B28Request } from '../../domain/anexo003_B28/anexo003_B28Request';
import { Anexo003_B28Response } from '../../domain/anexo003_B28/anexo003_B28Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo003_B28HttpRepository
  extends FormularioElectronicoHttpRepository<
    Anexo003_B28Request,
    Anexo003_B28Response
  >
  implements Anexo003_B28Repository
{
  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo3_b28NT}/`;
    super(http, urlApi);
  }
}
