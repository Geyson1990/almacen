import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ReporteKardexRequest } from '../../models/Inventario/Reporte';
import { ApiResponse } from '../../models/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private urlReporteKardex: string = '';
  private urlReporteKardexPdf: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlReporteKardex = `${environment.baseUrlAPI}${environment.endPoint.reporteKardex}`;
    this.urlReporteKardexPdf = `${environment.baseUrlAPI}${environment.endPoint.reporteKardexPdf}`;
  }

  postReporteKardex<T>(data: ReporteKardexRequest, idTipoReporte:number): void {
    
    let nombreReporte:string = 'KardexReporte.xlsx';
    if(idTipoReporte === 1){
      this.urlReporteKardex = `${environment.baseUrlAPI}${environment.endPoint.reporteKardex}`;
      nombreReporte = 'KardexReporte.xlsx';
    }
    else if(idTipoReporte === 2){
      this.urlReporteKardex = `${environment.baseUrlAPI}${environment.endPoint.reporteKardexSalida}`;
      nombreReporte = 'KardexSalidaReporte.xlsx';
    }
    else if(idTipoReporte === 3){
      this.urlReporteKardex = `${environment.baseUrlAPI}${environment.endPoint.reporteKardexEntrada}`;
      nombreReporte = 'KardexEntradaReporte.xlsx';
    }

    this.httpClient.post(`${this.urlReporteKardex}`, data, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, nombreReporte);
    });
  }

  postReporteKardexPdf(data: ReporteKardexRequest, idTipoReporte: number): Observable<ApiResponse<string>> {
    debugger;
    if(idTipoReporte === 1){
      this.urlReporteKardexPdf = `${environment.baseUrlAPI}${environment.endPoint.reporteKardexPdf}`;
    }
    else if(idTipoReporte === 2){
      this.urlReporteKardexPdf = `${environment.baseUrlAPI}${environment.endPoint.reporteIngresoPdf}`;
    }
    else if(idTipoReporte === 3){
      this.urlReporteKardexPdf = `${environment.baseUrlAPI}${environment.endPoint.reporteSalidaPdf}`;
    }
    return this.httpClient.post<ApiResponse<string>>(`${this.urlReporteKardexPdf}`, data);
  }

}
