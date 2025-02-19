import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExtranjeriaModel } from '../../models/ExtranjeriaModel';

@Injectable({
  providedIn: 'root'
})
export class ExtranjeriaService {
  
  private urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.servicios.extranjeria}`;
  }

  getCE(ce: string): Observable<ExtranjeriaModel> {
    return this.httpClient.get<ExtranjeriaModel>(`${this.urlApi}CE/${ce}`);
  }
}
