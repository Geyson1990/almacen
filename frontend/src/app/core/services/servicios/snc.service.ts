import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SncModel } from '../../models/SncModel';

@Injectable({
  providedIn: 'root'
})
export class SncService {
  
  private urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.servicios.snc}`;
  }

getDni(tipo:string,dni: string): Observable<SncModel> {
   return this.httpClient.get<SncModel>(`${this.urlApi}${tipo}/${dni}`);
  }




}
