import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnexoTramiteService {

  private urlAnexoTramite: string = '';

  constructor(private httpClient: HttpClient) {
    this.urlAnexoTramite = `${environment.baseUrlAPI}${environment.endPoint.anexoTramite}`;
  }

  get<T>(tramiteReqId: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlAnexoTramite}/${tramiteReqId}`);
  }
}
