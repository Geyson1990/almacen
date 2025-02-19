import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo003_A28Repository } from '../../application/repositories/anexo003_A28.repository';
import { Anexo003_A28Request } from '../../domain/anexo003_A28/anexo003_A28Request';
import { Anexo003_A28Response } from '../../domain/anexo003_A28/anexo003_A28Response';

@Injectable({
  providedIn: 'root',
})
export class Anexo003_A28HttpRepository
  extends FormularioElectronicoHttpRepository<
    Anexo003_A28Request,
    Anexo003_A28Response
  >
  implements Anexo003_A28Repository
{
  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo3_a28NT}/`;
    super(http, urlApi);
  }
}
