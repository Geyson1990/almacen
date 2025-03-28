import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response';
import { EliminarProductoRequest, ProductosRequest, UnidadMedidaResponse } from '../../models/Inventario/Producto';
import { EliminarIngresoRequest, IngresoRequest } from '../../models/Inventario/Ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private urlListarIngreso: string = '';
  private urlGrabarIngreso: string = '';
  private urlObtenerIngreso: string = '';
  private urlEliminarIngreso: string = '';
  private urlListarTipoIngreso: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlListarIngreso = `${environment.baseUrlAPI}${environment.endPoint.listarIngreso}`;
    this.urlGrabarIngreso = `${environment.baseUrlAPI}${environment.endPoint.grabarIngreso}`;
    this.urlObtenerIngreso = `${environment.baseUrlAPI}${environment.endPoint.obtenerIngreso}`;
    this.urlEliminarIngreso = `${environment.baseUrlAPI}${environment.endPoint.eliminarIngreso}`;
    this.urlListarTipoIngreso = `${environment.baseUrlAPI}${environment.endPoint.listarTipoIngreso}`;
  }

  getAll<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarIngreso}`);
  }

  postGrabarIngreso<T>(data: IngresoRequest): Observable<ApiResponse<T>> {
    return this.httpClient.post<ApiResponse<T>>(`${this.urlGrabarIngreso}`, data);
  }

  obtenerIngreso<T>(id: number): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlObtenerIngreso}`,{
      params: { id: id.toString() }
    });
  }

  eliminarIngreso<T>(data: EliminarIngresoRequest): Observable<ApiResponse<T>> {
    return this.httpClient.post<ApiResponse<T>>(`${this.urlEliminarIngreso}`, data);
  }

  listarTipoIngreso<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarTipoIngreso}`);
  }

}
