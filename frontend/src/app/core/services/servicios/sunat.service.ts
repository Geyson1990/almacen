import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SunatDatosPrincipalesModel, SunatRepresentantesModel } from '../../models/SunatModel';

@Injectable({
  providedIn: 'root'
})
export class SunatService {

  private urlApiDatosPrincipales: string = '';
  private urlApiRepresentantes: string = '';
  urlOauthSunat: string;
  urlOauthSunatClientId: string;

  constructor(private httpClient: HttpClient) {
    this.urlApiDatosPrincipales = `${environment.baseUrlAPI}${environment.endPoint.servicios.sunat}DatosPrincipales/`;
    this.urlApiRepresentantes = `${environment.baseUrlAPI}${environment.endPoint.servicios.sunat}DatosRepresentantesLegales/`;
    this.urlOauthSunat = `${environment.endPoint.urlOauthSunat}`;
    this.urlOauthSunatClientId = `${environment.endPoint.urlOauthSunatClientId}`;
  }

  getDatosPrincipales(ruc: string): Observable<SunatDatosPrincipalesModel> {
    return this.httpClient.get<SunatDatosPrincipalesModel>(`${this.urlApiDatosPrincipales}${ruc}`);
  }

  getRepresentantesLegales(ruc: string): Observable<SunatRepresentantesModel> {
    return this.httpClient.get<SunatRepresentantesModel>(`${this.urlApiRepresentantes}${ruc}`);
  }

  getUrlOauth(codTipoPersona: string, urlRedirect: string): string {
    return `${this.urlOauthSunat}/${this.urlOauthSunatClientId}/oauth2/authen?client_id=${this.urlOauthSunatClientId}&response_type=code&&state=${codTipoPersona}&redirect_uri=${urlRedirect}`;
  }

}
