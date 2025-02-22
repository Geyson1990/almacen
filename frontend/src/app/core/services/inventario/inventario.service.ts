import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response';
import { FormularioResponseModel } from '../../models/Tramite/FormularioResponseModel';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private urlListarInventario: string = '';
  private urlArchivo: string = '';
  private urlVisorPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlListarInventario = `${environment.baseUrlAPI}${environment.endPoint.listarInventario}`;
  }

  getAll<T>(): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${this.urlListarInventario}`);
  }

}
