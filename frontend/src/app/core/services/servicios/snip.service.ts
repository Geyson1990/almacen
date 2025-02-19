import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { responseSnip } from '../../models/SnipModel';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnipService {
  private urlApiSnip: string='';
  private urlApiSnipFe: string='https://ofi5.mef.gob.pe/inviertews/Dashboard/traeDetInvSSI';

  constructor(private httpClient: HttpClient) {
    this.urlApiSnip = `${environment.baseUrlAPI}${environment.endPoint.servicios.snip}`;
  }

  getSnip(codSnip: string): Observable<responseSnip> {
    return this.httpClient.get<responseSnip>(`${this.urlApiSnip}${codSnip}`);
  }

}

