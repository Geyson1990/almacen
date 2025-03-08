import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComboGenerico, ComboGenericoString } from '../../models/Maestros/ComboGenerico';
import { ApiResponseModel } from '../../models/Autenticacion/TipoPersonaResponseModel';
import { ParametroMonitoreo } from '../../models/Externos/ParametroMonitoreo';
import { EmpresaConsultoraResponse } from '../../models/Externos/EmpresaConsultora';
import { ProfesionalesConsultoraResponse } from '../../models/Externos/ProfesionalesConsultora';
import { OtroProfesional, TipoDocumento } from '../../models/Externos/OtroProfesional';
import { TipoMineral, RecursoExplorar } from '../../models/Externos/Mineral';
import { Zona } from '../../models/Externos/Zona';
import { Datum } from '../../models/Externos/Datum';
import { FuenteAgua } from '../../models/Externos/FuenteAgua';
import { TipoComponente } from '../../models/Externos/TipoComponente';
import { ClasificacionResiduo, FrecuenciaPeso, TipoResiduo, UnidadPeso } from '../../models/Externos/Residuo';
import { FaseResponse } from '../../models/Externos/fase-response';
import { ApiResponse, ApiResponseCase } from '../../models/api-response';
import { EtapaAbastecimientoResponse } from '../../models/Externos/etapa-abastecimiento-response';
import { FuenteAguaResponse } from '../../models/Externos/fuente-agua-response';
import { ZonaResponse } from '../../models/Externos/zona-response';
import { DatumResponse } from '../../models/Externos/datum-response';
import { InsumoResponse } from '../../models/Externos/insumo-response';
import { GenerarEstudio } from '../../models/Externos/Estudio';
import { SubTipoPasivoResponse, TipoPasivoResponse } from '../../models/Externos/tipo-pasivo';
import { UnidadMinera } from '../../models/Externos/UnidadMinera';
import { AreasNaturalesProtegidas } from '../../models/Externos/areas-protegidas';
import { DatosGeneralesEmpresa, DerechosMineros, RepresentanteAcreditado } from '../../models/Tramite/FormularioSolicitudDIA';
import { UbicacionGeograficaResponse } from '../../models/Externos/ubicacion-geografica';
import { UnidadMedidaResponse } from '../../models/Inventario/Producto';
@Injectable({
    providedIn: 'root'
})
export class ExternoService {

    urlComboGenerico: string = '';
    urlParametrosMonitoreo: string = '';
    urlEmpresaConsultora: string = '';
    urlProfesionalesConsultora: string = '';
    urlOtroProfesionalesConsultora: string = '';
    urlTipoDocumento: string = '';
    urlTipoMineral: string = '';
    urlRecursoExplorar: string = '';
    urlFaseRequerimientoAgua: string = '';
    urlEtapaAbastecimientoRequerimientoAgua: string = '';
    urlFuenteAbastecimientoRequerimientoAgua: string = '';
    urlZona: string = '';
    urlDatum: string = '';
    urlTipoViaExistente: string = '';
    urlTipoViaNueva: string = '';
    urlOrigenTipoManoObra: string = '';
    urlInsumo: string = '';
    urlUnidadMedidaInsumo: string = '';
    urlFuenteAgua: string = '';
    urlTipoComponente: string = '';
    urlClasificacionResiduo: string = '';
    urlTipoResiduo: string = '';
    urlResiduo: string = '';
    urlUnidadesPeso: string = '';
    urlFrecuenciaPeso: string = '';
    urlComboGenericoDiaw: string = '';
    urlComboGenericoStringDiaw: string = '';
    urlGenerarEstudio: string = '';
    urlEnviarTramiteDocumentario: string = '';
    urlTipoPasivo: string = '';
    urlSubTipoPasivo: string = '';
    urlComboGenericoEiaw: string = '';
    urlUnidadMinera: string = '';

    urlDatosTitularRepresentanteEmpresa: string = '';
    urlRepresentantesPorcliente: string = '';
    urlAreasProtegidas: string = '';

    urlDerechosMinerosSolicitante: string = '';
    urlDerechosMinerosTercero: string = '';

    urlMecanismoParticipacionCiudadana: string = '';
    urlFaseParticipacionCiudadana: string = '';
    urlRegionParticipacionCiudadana: string = '';
    urlProvinciaParticipacionCiudadana: string = '';
    urlDistritoParticipacionCiudadana: string = '';
    urlLocalidadParticipacionCiudadana: string = '';
    urlHoraParticipacionCiudadana: string = '';
    urlMinutoParticipacionCiudadana: string = '';
    urlTipoAdjuntoParticipacionCiudadana: string = '';
    urlUbicacionGeografica: string = '';

    constructor(private httpClient: HttpClient) {
        this.urlComboGenerico = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_ftaw.comboGenerico}`;
        this.urlParametrosMonitoreo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.ParametrosMonitoreo}`;
        this.urlEmpresaConsultora = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.EmpresaConsultora}`;
        this.urlProfesionalesConsultora = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.ProfesionalesConsultora}`;
        this.urlOtroProfesionalesConsultora = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.OtroProfesionalConsultora}`;
        this.urlTipoDocumento = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.TipoDocumento}`;
        this.urlTipoMineral = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.TipoMineral}`;
        this.urlRecursoExplorar = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.RecursoExplorar}`;
        this.urlZona = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_simen.Zona}`;
        this.urlDatum = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_simen.Datum}`;
        this.urlFuenteAgua = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.FuenteAgua}`
        this.urlTipoComponente = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.TipoComponente}`
        this.urlClasificacionResiduo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.ClasificacionResiduo}`
        this.urlTipoResiduo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.TipoResiduo}`
        this.urlResiduo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.Residuo}`
        this.urlUnidadesPeso = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.UnidadesPeso}`
        this.urlFrecuenciaPeso = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.FrecuenciaPeso}`

        this.urlFaseRequerimientoAgua = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.Fase}`;
        this.urlEtapaAbastecimientoRequerimientoAgua = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.EtapaAbastecimiento}`;
        this.urlFuenteAbastecimientoRequerimientoAgua = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.FuenteAbastecimiento}`;

        this.urlTipoViaExistente = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_ftaw.tipoViaExistente}`;
        this.urlTipoViaNueva = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_ftaw.tipoViaNueva}`;

        this.urlOrigenTipoManoObra = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_ftaw.origenTipoManoObra}`;

        this.urlInsumo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.Insumo}`;
        this.urlUnidadMedidaInsumo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.UnidadMedidaInsumo}`;
        this.urlComboGenericoDiaw = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_diaw.ComboGenerico}`;
        this.urlComboGenericoStringDiaw = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_diaw.ComboGenericoString}`;
        this.urlGenerarEstudio = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_diaw.Estudio}`;
        this.urlTipoPasivo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_simen.TipoPasivo}`;
        this.urlSubTipoPasivo = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.SubTipo}`;

        this.urlEnviarTramiteDocumentario = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_solicitud.Solicitud}`;
        this.urlComboGenericoEiaw = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eiaw.ComboGenerico}`;
        this.urlUnidadMinera = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eam.UnidadMinera}`;

        this.urlDatosTitularRepresentanteEmpresa = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_simen.DatosTitularRepresentanteEmpresa}`;
        this.urlRepresentantesPorcliente = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_simen.RepresentantesPorcliente}`;
        this.urlAreasProtegidas = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.AreasProtegidas}`;
        this.urlDerechosMinerosSolicitante = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_general_seal.DerechosMinerosSolicitante}`;
        this.urlDerechosMinerosTercero = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_general_seal.DerechosMinerosTercero}`;

        this.urlMecanismoParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.MecanismosParticipacionCiudadana}`;
        this.urlFaseParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.FaseParticipacionCuidadana}`;
        this.urlRegionParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.RegionParticipacionCiudadana}`;
        this.urlProvinciaParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.ProvinciaParticipacionCiudadana}`;
        this.urlDistritoParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.DistritoParticipacionCiudadana}`;
        this.urlLocalidadParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.LocalidadParticipacionCiudadana}`;
        this.urlHoraParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.HoraParticipacionCiudadana}`;
        this.urlMinutoParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.MinutoParticipacionCiudadana}`;
        this.urlTipoAdjuntoParticipacionCiudadana = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_csp.TipoAdjuntoParticipacionCiudadana}`;
        this.urlUbicacionGeografica = `${environment.baseUrServicioExternoAPI}${environment.endPoint.package_eamw.UbicacionGeografica}`;
    }

    getComboGenerico(tipo: string): Observable<ApiResponseModel<ComboGenerico[]>> {
        return this.httpClient.get<ApiResponseModel<ComboGenerico[]>>(`${this.urlComboGenerico}?tipo=${tipo}`);
    }

    getParametrosMonitoreo(tipoMuestra: number): Observable<ApiResponseModel<ParametroMonitoreo[]>> {
        return this.httpClient.get<ApiResponseModel<ParametroMonitoreo[]>>(`${this.urlParametrosMonitoreo}?tipoMuestra=${tipoMuestra}`);
    }

    getEmpresaConsultora(nombre?: string, ruc?: string, nombreComercial?: string): Observable<ApiResponseModel<EmpresaConsultoraResponse[]>> {
        const params = new HttpParams({
            fromObject: {
                nombre: nombre ?? '',
                ruc: ruc ?? '',
                nombreComercial: nombreComercial ?? ''
            }
        });
        return this.httpClient.get<ApiResponseModel<EmpresaConsultoraResponse[]>>(`${this.urlEmpresaConsultora}`, { params });
    }

    getProfesionalesConsultora(idConsultora: number): Observable<ApiResponseModel<ProfesionalesConsultoraResponse[]>> {
        return this.httpClient.get<ApiResponseModel<ProfesionalesConsultoraResponse[]>>(`${this.urlProfesionalesConsultora}?idConsultora=${idConsultora}`);
    }

    getComboTipoDocumento(): Observable<ApiResponseModel<TipoDocumento[]>> {
        return this.httpClient.get<ApiResponseModel<TipoDocumento[]>>(`${this.urlTipoDocumento}`);
    }

    getOtroProfesionalesConsultora(idEstudio?: number, idDocumentoIdentidad?: number, nroDocumento?: string, idCliente?: number, colegiatura?: string): Observable<ApiResponseModel<OtroProfesional>> {
        let queryParam = new HttpParams();
        if (idEstudio !== null && idEstudio > 0) queryParam = queryParam.set("Ln_IdEstudio", idEstudio);
        if (idDocumentoIdentidad !== null && idDocumentoIdentidad > 0) queryParam = queryParam.set("Ln_IdDocumentoIdentidad", idDocumentoIdentidad);
        if ((nroDocumento || "").trim().length !== 0) queryParam = queryParam.set("Ls_NroDocumento", nroDocumento);
        if (idCliente !== null && idCliente > 0) queryParam = queryParam.set("Ln_IdClienteCons", idCliente);
        if ((colegiatura || "").trim().length !== 0) queryParam = queryParam.set("Ls_Colegiatura", colegiatura);

        return this.httpClient.get<ApiResponseModel<OtroProfesional>>(`${this.urlOtroProfesionalesConsultora}`, { params: queryParam });
    }
    getComboTipoMineral(idEstudio: number): Observable<ApiResponseModel<TipoMineral[]>> {
        return this.httpClient.get<ApiResponseModel<TipoMineral[]>>(`${this.urlTipoMineral}/${idEstudio}`);
    }
    getComboRecursoExplorar(tipoMineral: string): Observable<ApiResponseModel<RecursoExplorar[]>> {
        return this.httpClient.get<ApiResponseModel<RecursoExplorar[]>>(`${this.urlRecursoExplorar}/${tipoMineral}`);
    }
    getZona(): Observable<ApiResponseModel<Zona[]>> {
        return this.httpClient.get<ApiResponseModel<Zona[]>>(`${this.urlZona}`);
    }
    getDatum(): Observable<ApiResponseModel<Datum[]>> {
        return this.httpClient.get<ApiResponseModel<Datum[]>>(`${this.urlDatum}`);
    }
    getFuenteAgua(): Observable<ApiResponseModel<FuenteAgua[]>> {
        return this.httpClient.get<ApiResponseModel<FuenteAgua[]>>(`${this.urlFuenteAgua}`);
    }
    getTipoComponente(): Observable<ApiResponseModel<TipoComponente[]>> {
        return this.httpClient.get<ApiResponseModel<TipoComponente[]>>(`${this.urlTipoComponente}`);
    }
    getClasificacionResiduo(): Observable<ApiResponseModel<ClasificacionResiduo[]>> {
        return this.httpClient.get<ApiResponseModel<ClasificacionResiduo[]>>(`${this.urlClasificacionResiduo}`);
    }
    getTipoResiduo(idClasificacionResiduo: number): Observable<ApiResponseModel<TipoResiduo[]>> {
        return this.httpClient.get<ApiResponseModel<TipoResiduo[]>>(`${this.urlTipoResiduo}/${idClasificacionResiduo}`);
    }
    getResiduo(idTipoResiduo: number): Observable<ApiResponseModel<TipoResiduo[]>> {
        return this.httpClient.get<ApiResponseModel<TipoResiduo[]>>(`${this.urlResiduo}/${idTipoResiduo}`);
    }
    getUnidadPeso(): Observable<ApiResponseModel<UnidadPeso[]>> {
        return this.httpClient.get<ApiResponseModel<UnidadPeso[]>>(`${this.urlUnidadesPeso}`);
    }
    getFrecuenciaPeso(): Observable<ApiResponseModel<FrecuenciaPeso[]>> {
        return this.httpClient.get<ApiResponseModel<FrecuenciaPeso[]>>(`${this.urlFrecuenciaPeso}`);
    }

    getComboFaseRequerimientoAgua(): Observable<ApiResponse<FaseResponse[]>> {
        return this.httpClient.get<ApiResponse<FaseResponse[]>>(`${this.urlFaseRequerimientoAgua}`);
    }

    getComboEtapaAbastecimientoRequerimientoAgua(): Observable<ApiResponse<EtapaAbastecimientoResponse[]>> {
        return this.httpClient.get<ApiResponse<EtapaAbastecimientoResponse[]>>(`${this.urlEtapaAbastecimientoRequerimientoAgua}`);
    }

    getComboFuenteAbastecimientoRequerimientoAgua(): Observable<ApiResponse<FuenteAguaResponse[]>> {
        return this.httpClient.get<ApiResponse<FuenteAguaResponse[]>>(`${this.urlFuenteAbastecimientoRequerimientoAgua}`);
    }

    getComboZonaRequerimientoAgua(): Observable<ApiResponse<ZonaResponse[]>> {
        return this.httpClient.get<ApiResponse<ZonaResponse[]>>(`${this.urlZona}`);
    }

    getComboDatumRequerimientoAgua(): Observable<ApiResponse<DatumResponse[]>> {
        return this.httpClient.get<ApiResponse<DatumResponse[]>>(`${this.urlDatum}`);
    }


    getComboTipoViaExistente(): Observable<ApiResponse<ComboGenerico[]>> {
        return this.httpClient.get<ApiResponse<ComboGenerico[]>>(`${this.urlTipoViaExistente}`);
    }

    getComboTipoViaNueva(): Observable<ApiResponse<ComboGenerico[]>> {
        return this.httpClient.get<ApiResponse<ComboGenerico[]>>(`${this.urlTipoViaNueva}`);
    }

    getComboOrigenTipoManoObra(): Observable<ApiResponse<ComboGenerico[]>> {
        return this.httpClient.get<ApiResponse<ComboGenerico[]>>(`${this.urlOrigenTipoManoObra}`);
    }

    getComboInsumo(): Observable<ApiResponse<InsumoResponse[]>> {
        return this.httpClient.get<ApiResponse<InsumoResponse[]>>(`${this.urlInsumo}`);
    }

    getComboUnidadMedidaInsumo(): Observable<ApiResponse<UnidadMedidaResponse[]>> {
        return this.httpClient.get<ApiResponse<UnidadMedidaResponse[]>>(`${this.urlUnidadMedidaInsumo}`);
    }

    getComboGenericoDiaw(tipo: string): Observable<ApiResponse<ComboGenerico[]>> {
        return this.httpClient.get<ApiResponse<ComboGenerico[]>>(`${this.urlComboGenericoDiaw}?tipo=${tipo}`);
    }
    postGenerarEstudio(data: any): Observable<ApiResponse<GenerarEstudio>> {
        return this.httpClient.post<ApiResponse<GenerarEstudio>>(this.urlGenerarEstudio, data);
    }
    postExpedienteTramite(data: any): Observable<ApiResponse<number>> {
        return this.httpClient.post<ApiResponse<number>>(this.urlEnviarTramiteDocumentario, data);
    }

    getComboGenericoStringDiaw(tipo: string): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlComboGenericoStringDiaw}?tipo=${tipo}`);
    }

    getComboTipoPasivo(tipoFormulario: number): Observable<ApiResponse<TipoPasivoResponse[]>> {
        return this.httpClient.get<ApiResponse<TipoPasivoResponse[]>>(`${this.urlTipoPasivo}/${tipoFormulario}`);
    }

    getComboSubTipoPasivo(tipoPasivo: number): Observable<ApiResponse<SubTipoPasivoResponse[]>> {
        return this.httpClient.get<ApiResponse<SubTipoPasivoResponse[]>>(`${this.urlSubTipoPasivo}?idTipoPasivo=${tipoPasivo}`);
    }

    getComboGenericoEiaw(tipo: string): Observable<ApiResponseModel<ComboGenerico[]>> {
        return this.httpClient.get<ApiResponseModel<ComboGenerico[]>>(`${this.urlComboGenericoEiaw}?tipo=${tipo}`);
    }

    getUnidadMinera(idEstudio: number, idCliente: number): Observable<ApiResponseModel<UnidadMinera[]>> {
        return this.httpClient.get<ApiResponseModel<UnidadMinera[]>>(`${this.urlUnidadMinera}/${idEstudio}/${idCliente}`);
    }
    getDatosTitularRepresentante(idCliente: number): Observable<ApiResponseCase<DatosGeneralesEmpresa>> {
        return this.httpClient.get<ApiResponseCase<DatosGeneralesEmpresa>>(`${this.urlDatosTitularRepresentanteEmpresa}/${idCliente}`);
    }

    getRepresentantes(idCliente: number): Observable<ApiResponse<RepresentanteAcreditado[]>> {
        return this.httpClient.get<ApiResponse<RepresentanteAcreditado[]>>(`${this.urlRepresentantesPorcliente}/${idCliente}`);
    }

    getDerechosMinerosSolicitante(idEstudio: number): Observable<ApiResponseCase<DerechosMineros[]>> {
        return this.httpClient.get<ApiResponseCase<DerechosMineros[]>>(`${this.urlDerechosMinerosSolicitante}/${idEstudio}`);
    }

    getDerechosMinerosTercero(idEstudio: number): Observable<ApiResponseCase<DerechosMineros[]>> {
        return this.httpClient.get<ApiResponseCase<DerechosMineros[]>>(`${this.urlDerechosMinerosTercero}/${idEstudio}`);
    }

    getAreasNaturalesProtegidas(idEstudio: number): Observable<ApiResponse<AreasNaturalesProtegidas[]>> {
        return this.httpClient.get<ApiResponse<AreasNaturalesProtegidas[]>>(`${this.urlAreasProtegidas}?idEstudio=${idEstudio}`);
    }

    getComboMecanismoParticipacionCiudadana(): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlMecanismoParticipacionCiudadana}`);
    }

    getComboFaseParticipacionCiudadana(idMecanismo: number): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlFaseParticipacionCiudadana}/${idMecanismo}`);
    }

    getComboRegionParticipacionCiudadana(idEstudio: number): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlRegionParticipacionCiudadana}/${idEstudio}`);
    }

    getComboProvinciaParticipacionCiudadana(idEstudio: number, idDepartamento: number): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlProvinciaParticipacionCiudadana}/${idEstudio}/${idDepartamento}`);
    }

    getComboDistritoParticipacionCiudadana(idEstudio: number, idProvincia: number): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlDistritoParticipacionCiudadana}/${idEstudio}/${idProvincia}`);
    }

    getComboLocalidadParticipacionCiudadana(): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlLocalidadParticipacionCiudadana}`);
    }

    getComboHorasParticipacionCiudadana(): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlHoraParticipacionCiudadana}`);
    }

    getComboMinutosParticipacionCiudadana(): Observable<ApiResponse<ComboGenericoString[]>> {
        return this.httpClient.get<ApiResponse<ComboGenericoString[]>>(`${this.urlMinutoParticipacionCiudadana}`);
    }

    getUbicacionGeografica(idEstudio: number): Observable<ApiResponse<UbicacionGeograficaResponse>> {
        return this.httpClient.get<ApiResponse<UbicacionGeograficaResponse>>(`${this.urlUbicacionGeografica}?idEstudio=${idEstudio}`);
    }
}
