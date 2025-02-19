import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MtcLicenciasConducirModel} from '../../models/MtcLicenciasConducirModel';

@Injectable({
  providedIn: 'root'
})
export class MtcService {
  private urlApiLicenciasConducir: string='';
  constructor(private httpClient: HttpClient) {
    this.urlApiLicenciasConducir = `${environment.baseUrlAPI}${environment.endPoint.servicios.mtc}LicenciasConducir/`;
   }

   getLicenciasConducir(tipoDocumento: number, nroDocumento: string): Observable<MtcLicenciasConducirModel>{
    return this.httpClient.get<MtcLicenciasConducirModel>(`${this.urlApiLicenciasConducir}${tipoDocumento}/${nroDocumento}`);
   }
}

