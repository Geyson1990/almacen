import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response';
import { EliminarProductoRequest, ProductosRequest, UnidadMedidaResponse } from '../../models/Inventario/Producto';
import { IngresoRequest } from '../../models/Inventario/Ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private urlListarIngreso: string = '';
  private urlGrabarIngreso: string = '';
  private urlObtenerIngreso: string = '';
  private urlEliminarIngreso: string = '';
  private urlArchivo: string = '';
  private urlVisorPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlListarIngreso = `${environment.baseUrlAPI}${environment.endPoint.listarIngreso}`;
    this.urlGrabarIngreso = `${environment.baseUrlAPI}${environment.endPoint.grabarIngreso}`;
    // this.urlObtenerIngreso = `${environment.baseUrlAPI}${environment.endPoint.obtenerProducto}`;
    // this.urlEliminarIngreso = `${environment.baseUrlAPI}${environment.endPoint.eliminarProducto}`;
  }

  getAll<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarIngreso}`);
  }

  // getUnidadesMedida(): Observable<ApiResponse<UnidadMedidaResponse[]>> {
  //   return this.httpClient.get<ApiResponse<UnidadMedidaResponse[]>>(`${this.urlListarUnidadesMedida}`);
  // }

  postGrabarIngreso<T>(data: IngresoRequest): Observable<ApiResponse<T>> {
    return this.httpClient.post<ApiResponse<T>>(`${this.urlGrabarIngreso}`, data);
  }

  // obtenerProducto<T>(id: number): Observable<ApiResponse<T>> {
  //   return this.httpClient.get<ApiResponse<T>>(`${this.urlObtenerProducto}`,{
  //     params: { id: id.toString() }
  //   });
  // }

  // eliminarProducto<T>(data: EliminarProductoRequest): Observable<ApiResponse<T>> {
  //   debugger;
  //   return this.httpClient.post<ApiResponse<T>>(`${this.urlEliminarProducto}`, data);
  // }

}
