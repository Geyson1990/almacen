import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { requestExcel, responseExcel } from '../../models/ExcelModel';

@Injectable({
  providedIn: 'root'
})
export class ExcelArchivosService {

  private urlPdfs: string = '';
  private urlPlantilla: string = '';
  private urlExcel: string = "";

  constructor(private httpClient: HttpClient) {
    this.urlPlantilla = `${environment.baseUrlAPI}${environment.endPoint.plantilla}`;
    this.urlExcel = `${environment.baseUrlAPI}${environment.endPoint.leerExcel}`;
  }

  readExcel(archivoExcel: any): Observable<responseExcel> {
    const htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.post<responseExcel>(this.urlExcel, archivoExcel);
  }

  /*post<T>(data: any): Observable<T> {
    return this.httpClient.post<T>(this.urlApi, data);
  }*/
}
