import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AeronaveModel } from '../../models/AeronaveModel';

@Injectable({
  providedIn: 'root'
})
export class AeronaveService {

  private urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.servicios.aeronave}`;
  }

  getAeronave(matricula: string): Observable<AeronaveModel> {
    return this.httpClient.get<AeronaveModel>(`${this.urlApi}${matricula}`);
  }
}
