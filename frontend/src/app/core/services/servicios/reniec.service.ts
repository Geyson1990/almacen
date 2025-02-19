import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReniecModel } from '../../models/ReniecModel';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {
  
  private urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.servicios.reniec}`;
  }

  getDni(dni: string): Observable<ReniecModel> {
    return this.httpClient.get<ReniecModel>(`${this.urlApi}${dni}`);
  }
}
