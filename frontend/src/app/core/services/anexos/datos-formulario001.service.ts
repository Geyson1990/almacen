import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosFormulario001Service {

  urlApi: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlAPI}${environment.endPoint.anexos.datos_formulario}/`;
  }

  get<T>(id: string): Observable<T> {
    return this.httpClient.get<T>(this.urlApi + id);
  }

}
