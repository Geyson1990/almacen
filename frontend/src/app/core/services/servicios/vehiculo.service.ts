import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlacaRodajeModel } from '../../models/PlacaRodajeModel';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.servicios.vehiculo}`;
  }

  getPlacaRodaje(placa: string): Observable<PlacaRodajeModel> {
    return this.httpClient.get<PlacaRodajeModel>(`${this.urlApi}${placa?.toUpperCase()}`);
  }

}
