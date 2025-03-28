import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response';
import { EliminarProductoRequest } from '../../models/Inventario/Producto';
import { IngresoRequest } from '../../models/Inventario/Ingreso';
import { AreaSolicitanteResponse, EliminarSalidaRequest, SalidaRequest, TipoSalidaResponse } from '../../models/Inventario/Salida';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private urlListarSalida: string = '';
  private urlGrabarSalida: string = '';
  private urlObtenerSalida: string = '';
  private urlEliminarSalida: string = '';
  private urlAreasSolicitantes:string = '';
  private urlListarTipoSalida: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlListarSalida = `${environment.baseUrlAPI}${environment.endPoint.listarSalida}`;
    this.urlGrabarSalida= `${environment.baseUrlAPI}${environment.endPoint.grabarSalida}`;
    this.urlObtenerSalida = `${environment.baseUrlAPI}${environment.endPoint.obtenerSalida}`;
    this.urlEliminarSalida = `${environment.baseUrlAPI}${environment.endPoint.eliminarSalida}`;
    this.urlAreasSolicitantes = `${environment.baseUrlAPI}${environment.endPoint.areasSolicitantes}`;
    this.urlListarTipoSalida = `${environment.baseUrlAPI}${environment.endPoint.listarTipoSalida}`;
  }

  getAll<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarSalida}`);
  }

  // getUnidadesMedida(): Observable<ApiResponse<UnidadMedidaResponse[]>> {
  //   return this.httpClient.get<ApiResponse<UnidadMedidaResponse[]>>(`${this.urlListarUnidadesMedida}`);
  // }

  postGrabarSalida<T>(data: SalidaRequest): Observable<ApiResponse<T>> {
    return this.httpClient.post<ApiResponse<T>>(`${this.urlGrabarSalida}`, data);
  }

  obtenerSalida<T>(id: number): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlObtenerSalida}`,{
      params: { id: id.toString() }
    });
  }

  eliminarSalida<T>(data: EliminarSalidaRequest): Observable<ApiResponse<T>> {
    return this.httpClient.post<ApiResponse<T>>(`${this.urlEliminarSalida}`, data);
  }

  areasSolicitantes(): Observable<ApiResponse<AreaSolicitanteResponse[]>> {
    return this.httpClient.get<ApiResponse<AreaSolicitanteResponse[]>>(`${this.urlAreasSolicitantes}`);
  }

  listarTipoSalida<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarTipoSalida}`);
  }

  getTipoSalida(): Observable<ApiResponse<TipoSalidaResponse[]>> {
      return this.httpClient.get<ApiResponse<TipoSalidaResponse[]>>(`${this.urlListarTipoSalida}`);
    }
}
