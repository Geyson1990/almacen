import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Anexo007_C17_3Repository } from '../../application/repositories/anexo007_C17_3.repository';
import { Anexo007_C17_3Request } from '../../domain/anexo007_C17_3/anexo007_C17_3Request';
import { Anexo007_C17_3Response } from '../../domain/anexo007_C17_3/anexo007_C17_3Response';

@Injectable({
    providedIn: 'root',
})
export class Anexo007_C17_3HttpRepository
  extends FormularioElectronicoHttpRepository<Anexo007_C17_3Request, Anexo007_C17_3Response>
  implements Anexo007_C17_3Repository {

  constructor(http: HttpClient) {
    const urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.anexo7_c173}/`;
    super(http, urlApi);
  }
}