import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo001_A17_03Repository } from '../../application/repositories/anexo001_A17_03.repository';
import { Anexo001_A17_03Request } from '../../domain/anexo001_A17_03/anexo001_A17_03Request';
import { Anexo001_A17_03Response } from '../../domain/anexo001_A17_03/anexo001_A17_03Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo001_A17_03HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo001_A17_03Request, Anexo001_A17_03Response>
  implements Anexo001_A17_03Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo1_a1703}/`;
    super(http, urlApi);
  }
}
