import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response';
import { ProcedimientoModel } from '../../models/Tramite/ProcedimientoModel';
import { map } from 'rxjs/operators';
import { Procedimiento } from '../../models/Portal/procedimiento';
import { DetalleProcedimiento } from '../../models/Portal/detalle-procedimiento';
import { RequisitoModel } from '../../models/Tramite/RequisitoModel';

@Injectable({
  providedIn: 'root'
})
export class RelacionTupasService {

  private urlApi: string = '';
  private urlApiAdministrado: string = '';
  urlBuscarTupasPorFiltros: string;
  urlListarProcedPortal: string;
  urlObtenerProcedPortal: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlTramiteAPI}`;
    this.urlApiAdministrado = `${environment.baseUrlAdministradoAPI}`;
    this.urlBuscarTupasPorFiltros = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.buscarTupasPorFiltros}`;
    this.urlListarProcedPortal = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.listarProcedPortal}`;
    this.urlObtenerProcedPortal = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.obtenerProcedPortal}`;
  }

  getListado<T>(): Observable<T> {
    return this.httpClient.get<T>(`${this.urlApi}${environment.endPoint.tupas.lista}`);
    // return this.httpClient.get<T>('assets/data/listado.json');
  }

  getDetalleTupa<T>(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlApi}${environment.endPoint.tupas.detalle}?id=${id}`);
    // return this.httpClient.get<T>('assets/data/detalle.json');
  }

  getTiposSolicitud<T>(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlApi}${environment.endPoint.tupas.tipossolicitud}?idProc=${id}`);
    // return this.httpClient.get<T>('assets/data/detalle.json');
  }

  buscarTupasPorFiltros(idMateria: number, tipoPersona:string, unidadOrg: number, digital: boolean|null, buscar: string): Observable<Array<ProcedimientoModel>> {
    return this.httpClient.get<ApiResponse<Array<ProcedimientoModel>>>(
      `${this.urlBuscarTupasPorFiltros}?idMateria=${idMateria??''}&tipoPersona=${tipoPersona}&unidadOrg=${unidadOrg??''}&digital=${digital??''}&buscar=${buscar}`)
    .pipe(map(x => x.data));
  }

  obtenerDatosTupa(idProc:number): Observable<ProcedimientoModel> {
    return this.httpClient.get<ApiResponse<ProcedimientoModel>>(`${this.urlApi}/ListaTupas/${idProc}/datos`)
    .pipe(map(x => x.data));
  }

  listarProcedPortal(
    buscar: string,
    idMateria: number
  ): Observable<ApiResponse<Procedimiento[]>> {
    let params = new HttpParams();
    buscar && (params = params.append('buscar', buscar));
    idMateria && (params = params.append('idMateria', idMateria.toString()));
    
    return this.httpClient.get<ApiResponse<Procedimiento[]>>(
      `${this.urlListarProcedPortal}`,
      { params }
    );
  }

  obtenerProcedPortal(
    idProc: number
  ): Observable<ApiResponse<DetalleProcedimiento>> {
    return this.httpClient.get<ApiResponse<DetalleProcedimiento>>(
      `${this.urlObtenerProcedPortal}/${idProc}`
    );
  }

  getRequisitosTupa(codigoTupa: string): Observable<ApiResponse<Array<RequisitoModel>>> {
    return this.httpClient.get<ApiResponse<Array<RequisitoModel>>>(`${this.urlApiAdministrado}${environment.endPoint.administrado.requisito}?codigoTupa=${codigoTupa}`);
  }

}
