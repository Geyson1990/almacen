import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FuncionesMtcService } from '../funciones-mtc.service';
import { SeguridadService } from '../seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class CasillaService {

  private urlCasilla: string;
  private urlIntegracion: string;
  private urlRegistro: string;
  private urlRecuperarPass: string;

  constructor(
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
  ) {
    this.urlCasilla = `${environment.endPoint.casilla.baseUrl}`;
    this.urlIntegracion = `${environment.endPoint.casilla.baseUrl}${environment.endPoint.casilla.integracion}`;
    this.urlRegistro = `${environment.endPoint.casilla.baseUrl}${environment.endPoint.casilla.registro}?param=admin`;
    this.urlRecuperarPass = `${environment.endPoint.casilla.baseUrl}${environment.endPoint.casilla.recuperarpass}?param=admin`;
  }

  getUrlIntegracion(): string {
    const accessToken = this.seguridadService.getToken();
    const decodeToken = this.seguridadService.getDecodedToken(accessToken);

    console.log('decodeToken: ', decodeToken);
    const tokenCasilla = decodeToken?.tokenCasilla ?? null;
    console.log('Token Casilla: ', tokenCasilla);
    if (tokenCasilla) {
      return `${this.urlIntegracion}/${tokenCasilla}`;
    }
    return this.urlCasilla;
  }

  getUrlRegistro(): string {
    return this.urlRegistro;
  }

  getUrlRecuperarPass(): string {
    return this.urlRecuperarPass;
  }

  getUrlLogin(): string {
    return this.urlCasilla;
  }
}
