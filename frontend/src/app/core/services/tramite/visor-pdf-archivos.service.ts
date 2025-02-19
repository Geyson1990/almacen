import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisorPdfArchivosService {

  private urlPdfs: string = '';
  private urlPlantilla: string = '';
  private urlExcel: string = "";

  constructor(private httpClient: HttpClient) {
    this.urlPdfs = `${environment.baseUrlAPI}${environment.endPoint.visorPdf}`;
    this.urlPlantilla = `${environment.baseUrlAPI}${environment.endPoint.plantilla}`;
    this.urlExcel = `${environment.baseUrlAPI}${environment.endPoint.archivoExcel}`;
  }

  get(pathName: string): Observable<any> {
    const htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(`${this.urlPdfs}?fileName=${pathName}`, htmlOptions);
  }

  getPlantilla(pathName: string): Observable<any> {
    const htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(`${this.urlPlantilla}?fileName=${pathName}`, htmlOptions);
  }

  getFromURL(url: string): Observable<any> {
    const htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(`${url}`, htmlOptions);
  }

  getExcel(pathName: string): Observable<any> {
    const htmlOptions = {
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get(`${this.urlExcel}?fileName=${pathName}`, htmlOptions);
  }
}
