import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response';
import { ProductosRequest, UnidadMedidaResponse } from '../../models/Inventario/Producto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private urlListarInventario: string = '';
  private urlListarUnidadesMedida: string = '';
  private urlGrabarProductos: string = '';
  private urlArchivo: string = '';
  private urlVisorPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlListarInventario = `${environment.baseUrlAPI}${environment.endPoint.listarInventario}`;
    this.urlListarUnidadesMedida = `${environment.baseUrlAPI}${environment.endPoint.listarUnidadesMedida}`;
    this.urlGrabarProductos = `${environment.baseUrlAPI}${environment.endPoint.grabarProductos}`;
  }

  getAll<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarInventario}`);
  }

  getUnidadesMedida(): Observable<ApiResponse<UnidadMedidaResponse[]>> {
    return this.httpClient.get<ApiResponse<UnidadMedidaResponse[]>>(`${this.urlListarUnidadesMedida}`);
  }

  postGrabarProducto<T>(data: ProductosRequest): Observable<T> {
    return this.httpClient.post<T>(`${this.urlListarUnidadesMedida}`, data);
  }

}
