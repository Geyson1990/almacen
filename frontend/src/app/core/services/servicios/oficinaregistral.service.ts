import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OficinaRegistralModel } from '../../models/OficinaRegistralModel';

@Injectable({
  providedIn: 'root'
})
export class OficinaRegistralService {

  urlApi: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.maestros.oficinaRegistral}`;
  }

  oficinaRegistral(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlApi}`);
  }

}
