import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompletarReqRequestModel } from '../../models/Tramite/CompletarReqRequest';
import { GenerarTramiteRequestModel, TramiteRequestModel, UpdateIdEstudioModel } from '../../models/Tramite/TramiteRequest';
import { VoucherRequestModel } from '../../models/Tramite/VoucherRequestModel';
import { PagoRequestModel } from '../../models/Tramite/PagoRequestModel';
import { VoucherAddResponseModel } from '../../models/Tramite/VoucherAddResponseModel';
import { IncidenciaRequestModel } from '../../models/Tramite/IncidenciaRequestModel';
import { ResponseComunModel } from '../../models/Tramite/ResponseComunModel';
import { UnidadOrganicaModel } from '../../models/Tramite/UnidadOrganicaModel';
import { ProcedimientoModel } from '../../models/Tramite/ProcedimientoModel';
import { ProfesionModel } from '../../models/ProfesionModel';
import { EnviarSolicitudModel, EnviarTramiteAdicionalModel, TramiteModel } from '../../models/Tramite/TramiteModel';
import { ApiResponse } from '../../models/api-response';
import { map } from 'rxjs/operators';
import { SectorModel } from '../../models/Tramite/SectorModel';
import { DonwloadDocument, TupaModel } from '../../models/Tramite/TupaModel';
import { FormularioSolicitudDIA } from '../../models/Tramite/FormularioSolicitudDIA';
import { FormularioDIA, FormularioDIAResponse } from '../../models/Formularios/FormularioMain';
import { TipoComunicacionModel } from '../../models/Tramite/TipoComunicacionModel'
import { TipoDocumentoModel } from '../../models/Tramite/TipoDocumentoModel'
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {

  urlTramite = '';
  urlGenerar = '';
  urlCompletarReq = '';
  urlEnviar = '';
  urlSubsanar = '';
  urlAdjuntar = '';
  urlDescargar = '';
  urlAdjuntarAdicional = '';
  urlAdjuntarReq = '';
  urlBandeja = '';
  urlTupa = '';
  urlListaTupas = '';
  urlComprobarPago = '';
  urlComprobarVoucher = '';
  urlComprobarVoucherAdd = '';
  urlVerificarVoucher = '';
  urlIncidencia = '';
  urlIncidenciaOtro = '';
  urlEliminarDocAdicional = '';
  urlObtenerPago = '';
  urlVerificarPago = '';
  urlAnular = '';
  urlEliminarDoc = '';
  urlEliminarPagoAdd = '';
  urlProcedimientoNotas = '';
  urlObtenerPagosAdd = '';
  urlDocumentosAdicionales = '';
  urlAcuseObservado = '';
  urlAcuseAtendido = '';
  urlGrupos: string;
  urlTupaBuscar: string;
  urlTupasPorGrupo: string;
  urlSectores: string;
  urlTupaBuscarPorCodigo: string;
  urlGuardarFormulario: string = '';
  urlObtenerFormularioDia: string = '';
  urlTramiteIniciado: string = "";
  urlTemplateFile: string = "";
  urlValidarNombreProyecto: string = '';
  urlUpdateIdEstudio: string = "";
  urlTipoComunicacion: string = "";
  urlTipoDocumento: string = "";
  urlRegistrarNombreProyecto: string = "";
  urlEnviarSolicitudes = '';

  constructor(private httpClient: HttpClient) {
    this.urlTramite = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.tramite}`;
    this.urlGenerar = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.generar}`;
    this.urlCompletarReq = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.completarReq}`;
    this.urlEnviar = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.enviar}`;
    this.urlSubsanar = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.subsanar}`;
    this.urlAdjuntar = `${environment.baseUrlLaserFicheAPI}${environment.endPoint.laserfiche.upload}`;
    this.urlDescargar = `${environment.baseUrlLaserFicheAPI}${environment.endPoint.laserfiche.download}`;
    this.urlAdjuntarAdicional = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.adjuntarAdicional}`;
    this.urlEliminarDocAdicional = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.eliminarAdicional}`;
    this.urlEliminarPagoAdd = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.eliminarPagoAdd}`;
    this.urlAdjuntarReq = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.adjuntarUrl}`;
    this.urlBandeja = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.bandeja}`;
    this.urlTupa = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.tupa}`;
    this.urlListaTupas = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.listatotal}`;
    this.urlComprobarPago = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.comprobarPago}`;
    this.urlComprobarVoucher = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.comprobarVoucher}`;
    this.urlComprobarVoucherAdd = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.comprobarVoucherAdd}`;
    this.urlVerificarVoucher = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.verificarVoucher}`;
    this.urlIncidencia = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.incidencia}`;
    this.urlIncidenciaOtro = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.incidenciaOtro}`;
    this.urlObtenerPago = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.obtenerPago}`;
    this.urlVerificarPago = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.verificarPago}`;
    this.urlAnular = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.anular}`;
    this.urlEliminarDoc = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.eliminarDoc}`;
    this.urlProcedimientoNotas = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.procedimientoNotas}`;
    this.urlObtenerPagosAdd = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.obtenerPagosAdd}`;
    this.urlDocumentosAdicionales = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.obtenerDocumentosAdicionales}`;
    this.urlAcuseObservado = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.acuseObservado}`;
    this.urlAcuseAtendido = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.acuseAtendido}`;
    this.urlGrupos = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.grupos}`;
    this.urlTupaBuscar = `${environment.baseUrlTramiteAPI}${environment.endPoint.tupas.tupabuscar}`;
    this.urlTupasPorGrupo = `${environment.baseUrlAdministradoAPI}${environment.endPoint.tupas.tupasporgrupo}`;
    this.urlSectores = `${environment.baseUrlAdministradoAPI}${environment.endPoint.administrado.sector}`;
    this.urlTupaBuscarPorCodigo = `${environment.baseUrlAdministradoAPI}${environment.endPoint.administrado.tupaByCode}`;
    this.urlGuardarFormulario = `${environment.baseUrlTramiteAPI}${environment.endPoint.formularios.guardar}`;
    this.urlObtenerFormularioDia = `${environment.baseUrlTramiteAPI}${environment.endPoint.formularios.obtener}`;
    this.urlTramiteIniciado = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.tramiteIniciado}`;
    this.urlTemplateFile = `${environment.baseUrlTramiteAPI}${environment.endPoint.plantillas.Plataformas}`;
    this.urlValidarNombreProyecto = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.validarNombreProyecto}`;
    this.urlUpdateIdEstudio = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.actualizarIdEstudio}`;
    this.urlTipoComunicacion = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.tipoComunicacion}`;
    this.urlTipoDocumento = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.tipoDocumento}`;
    this.urlRegistrarNombreProyecto = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.registrarNombreProyecto}`;
    this.urlEnviarSolicitudes = `${environment.baseUrlTramiteAPI}${environment.endPoint.tramite.enviarSolicitudes}`;
  }

  // getTramite() {
  getTramite<T>(idTramite: number, codigoTupa: string): Observable<T> {
    return this.httpClient.get<T>(`${this.urlTramite}?IdTramite=${idTramite}&CodigoTupa=${codigoTupa}`);
    // return this.httpClient.get<T>('assets/data/listadoTramite.json');
  }

  putGenerar(data: GenerarTramiteRequestModel): Observable<ApiResponse<number>> {
    return this.httpClient.put<ApiResponse<number>>(this.urlGenerar, data);
  }

  putCompletarReq(data: CompletarReqRequestModel): Observable<number> {
    return this.httpClient.put<number>(this.urlCompletarReq, data);
  }

  putEnviar<T>(data: EnviarSolicitudModel): Observable<T> {
    return this.httpClient.put<T>(this.urlEnviar, data);
  }

  putSubsanar<T>(idTramite: number): Observable<T> {
    return this.httpClient.put<T>(`${this.urlSubsanar}?idtramite=${idTramite}`, null);
  }

  putVerificarPago(idTramite: number): Observable<number> {
    return this.httpClient.put<number>(`${this.urlVerificarPago}?idtramite=${idTramite}`, null);
  }

  postAdjuntar(data: any): Observable<number> {
    return this.httpClient.post<number>(this.urlAdjuntar, data);
  }

  getDescargar(idDocument: any): Observable<DonwloadDocument> {
    let params = new HttpParams();
    params = params.append('idDocument', idDocument);
    //return this.httpClient.get<DonwloadDocument>(this.urlDescargar, { params });
    return this.httpClient.get<DonwloadDocument>(`${this.urlDescargar}?idDocument=${idDocument}`);
  }

  postAdjuntarAdicional(data: any): Observable<ApiResponse<number>> {
    return this.httpClient.post<ApiResponse<number>>(this.urlAdjuntarAdicional, data);
  }

  putAdjuntarReq(data: any): Observable<number> {
    return this.httpClient.put<number>(`${this.urlAdjuntarReq}?tramiteid=${data.tramiteid}&tramitereqid=${data.tramitereqid}&urladjunto=${data.urladjunto}`, null);
  }

  putAnular(data: any): Observable<ApiResponse<number>> {
    return this.httpClient.put<ApiResponse<number>>(this.urlAnular, data);
  }

  putAcuseObservado(idTramite: number): Observable<number> {
    return this.httpClient.put<number>(`${this.urlAcuseObservado}?idtramite=${idTramite}`, null);
  }

  putAcuseAtendido(idTramite: number): Observable<number> {
    return this.httpClient.put<number>(`${this.urlAcuseAtendido}?idtramite=${idTramite}`, null);
  }


  putEliminarDoc(idTramiteReq: number, idFile: string): Observable<number> {
    return this.httpClient.put<number>(`${this.urlEliminarDoc}?idtramitereq=${idTramiteReq}&idFile=${idFile}`, null);
  }

  putEliminarPagoAdd(idTramiteReq: number, tasaId: number, voucher: string): Observable<number> {
    return this.httpClient.put<number>(`${this.urlEliminarPagoAdd}?idtramitereq=${idTramiteReq}&tasaid=${tasaId}&voucher=${voucher}`, null);
  }

  getTramiteBandeja<T>(tipopersona: string, tipodoc: string, numdoc: string): Observable<T> {

    let params = new HttpParams();
    params = params.append('tipopersona', tipopersona);
    params = params.append('tipodoc', tipodoc);
    params = params.append('numdoc', numdoc);
    return this.httpClient.get<T>(this.urlBandeja, { params });
  }

  getTramiteBandejaAdministrado<T>(): Observable<T> {

    let params = new HttpParams();
    return this.httpClient.get<T>(this.urlBandeja, { params });
  }

  getTupa<T>(idtupa: number): Observable<T> {
    let params = new HttpParams();
    params = params.append('procid', String(idtupa));
    return this.httpClient.get<T>(this.urlTupa, { params });
  }

  getListaTupas<T>(): Observable<T> {
    const params = new HttpParams();
    return this.httpClient.get<T>(this.urlListaTupas);
  }

  putComprobarPago(data: VoucherRequestModel): Observable<number> {
    return this.httpClient.put<number>(this.urlComprobarPago, data);
  }

  putComprobarVoucher(data: VoucherRequestModel): Observable<number> {
    return this.httpClient.put<number>(this.urlComprobarVoucher, data);
  }

  putComprobarVoucherAdd(data: VoucherRequestModel): Observable<number> {
    return this.httpClient.put<number>(this.urlComprobarVoucherAdd, data);
  }

  putVerificarVoucher<T>(data: VoucherRequestModel): Observable<T> {
    return this.httpClient.put<T>(this.urlVerificarVoucher, data);
  }

  postRegistrarIncidencia(data: FormData): Observable<ResponseComunModel<string>> {
    return this.httpClient.post<ResponseComunModel<string>>(this.urlIncidencia, data);
  }

  postRegistrarIncidenciaOtro(data: FormData): Observable<ResponseComunModel<string>> {
    return this.httpClient.post<ResponseComunModel<string>>(this.urlIncidenciaOtro, data);
  }

  getPago<T>(idTramite: number): Observable<PagoRequestModel> {
    return this.httpClient.get<PagoRequestModel>(`${this.urlObtenerPago}?idtramite=${idTramite}`);
  }

  getObtenerNotas<T>(idProcedimiento: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlProcedimientoNotas}?IdProcedimiento=${idProcedimiento}`);
  }

  getObtenerDocumentos<T>(idTramite: number): Observable<T> {
    return this.httpClient.get<T>(`${this.urlDocumentosAdicionales}?IdTramite=${idTramite}`);
  }

  putEliminarDocAdicional(docId: number): Observable<ApiResponse<number>> {
    return this.httpClient.put<ApiResponse<number>>(`${this.urlEliminarDocAdicional}?request=${docId}`, null);
  }

  getObtenerPagosAdd(idTramiteReq: number): Observable<Array<VoucherAddResponseModel>> {
    return this.httpClient.get<Array<VoucherAddResponseModel>>(`${this.urlObtenerPagosAdd}?tramitereqid=${idTramiteReq}`);
  }

  getUnidadesOrganicas(tipoPersona: string): Observable<Array<UnidadOrganicaModel>> {
    return this.httpClient.get<Array<UnidadOrganicaModel>>(`${this.urlGrupos}?tipopersona=${tipoPersona}`);
  }

  getProcedimientos(buscar: string, tipoPersona: string): Observable<Array<ProcedimientoModel>> {
    return this.httpClient.get<Array<ProcedimientoModel>>(`${this.urlTupaBuscar}?buscar=${buscar}&tipopersona=${tipoPersona}`);
  }

  getTupasPorGrupo(idGrupo: number, tipoPersona: string): Observable<ApiResponse<Array<ProcedimientoModel>>> {
    return this.httpClient.get<ApiResponse<Array<ProcedimientoModel>>>(`${this.urlTupasPorGrupo}?idSector=${idGrupo}&tipopersona=${tipoPersona}`);
  }

  getSectores(): Observable<ApiResponse<Array<SectorModel>>> {
    return this.httpClient.get<ApiResponse<Array<SectorModel>>>(`${this.urlSectores}`);
  }

  getTupaByCode(codigoTupa: string): Observable<ApiResponse<TupaModel>> {
    return this.httpClient.get<ApiResponse<TupaModel>>(`${this.urlTupaBuscarPorCodigo}?codigoTupa=${codigoTupa}`);
  }

  getJsonData(): Observable<FormularioSolicitudDIA> {
    //return this.httpClient.get<FormularioSolicitudDIA>('../../../../helpers/solicitudVirtualDIA.json');
    return this.httpClient.get<FormularioSolicitudDIA>('assets/data/solicitudVirtualDIA.json');
  }

  postGuardarFormulario(data: FormularioDIAResponse): Observable<ApiResponse<number>> {
    return this.httpClient.post<ApiResponse<number>>(this.urlGuardarFormulario, data);
  }

  getFormularioDia(codigoSolicitud: number): Observable<ApiResponse<FormularioDIAResponse>> {
    return this.httpClient.get<ApiResponse<FormularioDIAResponse>>(`${this.urlObtenerFormularioDia}?CodMaeSolicitud=${codigoSolicitud}`);
  }

  downloadTemplateFile(fileName: string) {
    return this.httpClient.get(`${this.urlTemplateFile}/${fileName}`, { responseType: 'blob' });
  }

  getValidarNombreProyecto(idTramite: number, nombreProyecto: string): Observable<ApiResponse<number>> {
    return this.httpClient.get<ApiResponse<number>>(`${this.urlValidarNombreProyecto}?idTramite=${idTramite}&nombreProyecto=${nombreProyecto}`);
  }

  putActualizarIdEstudio(data: UpdateIdEstudioModel): Observable<ApiResponse<number>> {
    return this.httpClient.put<ApiResponse<number>>(this.urlUpdateIdEstudio, data);
  }
    
  getObtenerTipoComunicacion(): Observable<ApiResponse<TipoComunicacionModel[]>> {
    return this.httpClient.get<ApiResponse<TipoComunicacionModel[]>>(`${this.urlTipoComunicacion}`);
  }

  getObtenerTipoDocumento(): Observable<ApiResponse<TipoDocumentoModel[]>> {
    return this.httpClient.get<ApiResponse<TipoDocumentoModel[]>>(`${this.urlTipoDocumento}`);
  }

  postRegistrarNombreProyecto(data: any): Observable<ApiResponse<number>> {
    return this.httpClient.post<ApiResponse<number>>(this.urlRegistrarNombreProyecto, data);
  }
  
  putEnviarSolicitudes<T>(data: EnviarTramiteAdicionalModel): Observable<T> {
    return this.httpClient.put<T>(this.urlEnviarSolicitudes, data);
  }
}
