import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SelectItemModel } from '../../models/SelectItemModel';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  urlApi: string;
  urlDepartamentos: string;
  urlProvincias: string;
  urlDistritos: string;

  constructor(private httpClient: HttpClient) {
    this.urlDepartamentos = `${environment.baseUrlAPI}${environment.endPoint.maestros.departamentos}`;
    this.urlProvincias = `${environment.baseUrlAPI}${environment.endPoint.maestros.provincias}`;
    this.urlDistritos = `${environment.baseUrlAPI}${environment.endPoint.maestros.distritos}`;

  }

  // get<T>(parametros: string): Observable<T> {
  //   return this.httpClient.get<T>(`${this.urlApi}?iso=${parametros}`);
  // }
  departamento(): Observable<SelectItemModel[]> {
    return this.httpClient.get<SelectItemModel[]>(`${this.urlDepartamentos}`);
  }

  provincia(idDepartamento: number): Observable<SelectItemModel[]> {
    return this.httpClient.get<SelectItemModel[]>(`${this.urlProvincias}?coddep=${idDepartamento}`);
  }

  distrito(idDepartamento: number, idProvincia: number): Observable<SelectItemModel[]> {
    return this.httpClient.get<SelectItemModel[]>(`${this.urlDistritos}?coddep=${idDepartamento}&codprov=${idProvincia}`);
  }
}
