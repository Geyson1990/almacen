import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PERMISO_VUELO_INT } from '../../models/SiidgacPviModel'

@Injectable({
  providedIn: 'root'
})
export class SiidgacService {

  private urlApiObtenerPais;
  private urlApiObtenerMotivoPermiso;
  private urlApiListarTipoTripulante;
  private urlApiListarNacionalidad;
  private urlApiListarDesignadorOACI;
  private urlApiObtenerPVI;

  constructor(private httpClient: HttpClient) {
    this.urlApiObtenerPais = `${environment.baseUrlAPI}${environment.endPoint.siidgac.obtenerPais}`;
    this.urlApiObtenerMotivoPermiso = `${environment.baseUrlAPI}${environment.endPoint.siidgac.obtenerMotivoPermiso}`;
    this.urlApiListarTipoTripulante = `${environment.baseUrlAPI}${environment.endPoint.siidgac.listarTipoTripulante}`;
    this.urlApiListarNacionalidad = `${environment.baseUrlAPI}${environment.endPoint.siidgac.listarNacionalidad}`;
    this.urlApiListarDesignadorOACI = `${environment.baseUrlAPI}${environment.endPoint.siidgac.listarDesignadorOACI}`;
    this.urlApiObtenerPVI = `${environment.baseUrlAPI}${environment.endPoint.siidgac.obtenerPVI}`;
  }

  getPaises(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlApiObtenerPais}`);
  }
  getMotivoSobrevuelo(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlApiObtenerMotivoPermiso}${'?idPermisoAmbito=8BJpVqPrPnb4f87utPfM5g..'}`);
  }
  getTipoTripulante(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlApiListarTipoTripulante}`);
  }

  getNacionalidad(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlApiListarNacionalidad}`);
  }

  getDesignadorOaci(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlApiListarDesignadorOACI}`);
  }
  getPVI(permisoVuelo: string, nombreORazonSocial: string): Observable<PERMISO_VUELO_INT> {
    return this.httpClient.get<PERMISO_VUELO_INT>(`${this.urlApiObtenerPVI}?idPermisoVuelo=${permisoVuelo}&razonSocial=${nombreORazonSocial}`);
  }
}
