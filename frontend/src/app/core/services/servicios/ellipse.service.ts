import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { responseDatosTecnicos, datosTecnicosResponse, DatosAdministradoModel, DatosSociosModel } from '../../models/EllipseModel';

@Injectable({
  providedIn: 'root'
})
export class EllipseService {
  private urlApiDatosTecnicos: string='';
  constructor(private httpClient: HttpClient) {
    this.urlApiDatosTecnicos = `${environment.baseUrlAPI}${environment.endPoint.servicios.ellipse}DatosTecnicos/`;
  }
  getDatosTecnicos(tipoDoc: string, numDoc: string, indicativo: string): Observable<responseDatosTecnicos> {
    return this.httpClient.get<responseDatosTecnicos>(`${this.urlApiDatosTecnicos}${tipoDoc}/${numDoc}/${indicativo}`);
  }
}

