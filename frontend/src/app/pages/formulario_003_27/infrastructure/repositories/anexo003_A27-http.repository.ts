import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo003_A27Repository } from '../../application/repositories/anexo003_A27.repository';
import { Anexo003_A27Request } from '../../domain/anexo003_A27/anexo003_A27Request';
import { Anexo003_A27Response } from '../../domain/anexo003_A27/anexo003_A27Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo003_A27HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo003_A27Request, Anexo003_A27Response>
  implements Anexo003_A27Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo3_a27}/`;
    super(http, urlApi);
  }
}