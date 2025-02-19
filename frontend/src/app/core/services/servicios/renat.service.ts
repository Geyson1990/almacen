import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServTempEmp } from '../../models/renat';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RenatService {
  private URL_SERVICIOS: string = '';
  //responseSunarp: ResponseSunarp = new ResponseSunarp();
  constructor(private http: HttpClient) {
    this.URL_SERVICIOS = `${environment.baseUrlAPI}${environment.endPoint.servicios.renat}`;
  }

  ObtenerCantAutorizacion(ruc: string,fechinicio:string) { //al momento de inicio
    const url = this.URL_SERVICIOS + 'obtenerAutorizaEmpAnio/' + ruc+'/'+fechinicio;
    return this.http.get(url);
  }

  borrarTramptempxemp(idsolicitudTramite: string) {
    const url = this.URL_SERVICIOS + 'eliminarTramite/' + idsolicitudTramite;
    return this.http.get(url);
  }

  obtainCitv(placa: string, fecha: string ) {
    const url = this.URL_SERVICIOS + 'obtenerCitv/' + placa + '/' + fecha ;
    return this.http.get(url);
  }

  listarDepartamentos(): Observable<any> {
    return this.http.get<any>(this.URL_SERVICIOS + 'obtenerDepartamentos', httpOptions)
    .pipe(map(res => res));
    }

  listarProvincias(departamento:string): Observable<any> {
    return this.http.get<any>(this.URL_SERVICIOS + 'obtenerProvinciasporDept/' + departamento, httpOptions)
    .pipe(map(res => res));
  }

  listarDistritos(provincia: string, departamento: string): Observable<any> {
    return this.http.get<any>(this.URL_SERVICIOS + 'obtenerDistritoxProvDept/' + provincia + '/' + departamento, httpOptions)
    .pipe(map(res => res));
  }

  obtainFlotaReserva(ruc:string) {//utilizar//
    const url = this.URL_SERVICIOS + 'obtenerFlotaReserva/' + ruc ;
    return this.http.get(url);
  }

  estaEnNomina(ruc: string, documento: string) {//utilizar
    const url = this.URL_SERVICIOS + 'obtenerNominaConductores/' + ruc + '/' + documento;
    return this.http.get(url);
  }

  GetVehiculo(placa:string) { //utilizar para citv
    const url = this.URL_SERVICIOS + 'ObtenerVehiculo/' + placa;
    return this.http.get(url)
  }

  validarEsDeFlotaOperativa(ruc: string, placa: string) {//valida que la placa pertenece a la flota operativa
    const url = this.URL_SERVICIOS + 'esDeFlotaOperativa/' + ruc + '/' + placa;
    return this.http.get(url);
  }

  GetVehiculoSuspendido(placa: string) {//utilizar
    const url = this.URL_SERVICIOS + 'obtenerVehiculoSuspendido/' + placa;
    return this.http.get(url)
  }

  ObtenerVigenciaAutorizacion(ruc: string) {// la autorizaciónn de la empresa está vencida.
    const url = this.URL_SERVICIOS + 'obtenerVigenciaAutorizacion/' + ruc ;
    return this.http.get(url)
  }

  addServTemEmp(servTemEmp: ServTempEmp) {//paralelo al guardar el anexo
    const url = this.URL_SERVICIOS + 'InsesrtarServTempxEmp';
    return this.http.post(url, servTemEmp)
  }

  GetRutas(ruc: string){
    const url = this.URL_SERVICIOS + 'ListarRutas/' + ruc;
    return this.http.get(url)
  }

  EmpresaServicio(ruc:string){
    const url = this.URL_SERVICIOS + 'EmpresaServicio/'+ ruc;
    return this.http.get(url)
  }

  EmpresaServicioVigencia(ruc:string,servicio:number,diasPrevios:number, maxDiasPrevios:number, exonerarFechaFin : boolean){
    const url =  this.URL_SERVICIOS + 'EmpresaServicioVigencia/'+ruc+'/'+servicio+'/'+diasPrevios+'/'+maxDiasPrevios+'/'+exonerarFechaFin;
    return this.http.get(url)
  }

  validarConductorPerteneceNominaConductores(ruc: string, tipoDocumento: string, numeroDocumento:string){
    const params = {
      ruc: ruc,
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento
    };
    return this.http.post(this.URL_SERVICIOS + 'validarConductorPerteneceNominaConductores', params)
  }

  validarPlacaPerteneceFlotaVehicularEmpresa(ruc: string, idServicio: number, placa:string){
    const params = {
      ruc: ruc,
      idServicio: idServicio,
      placa: placa
    };
    return this.http.post(this.URL_SERVICIOS + 'validarPlacaPerteneceFlotaVehicularEmpresa', params)
  }

  validarPlacaPerteneceRutaEmpresa(ruc: string, nroRuta: string, placa:string){
    const params = {
      ruc: ruc,
      nroRuta: nroRuta,
      placa: placa
    };
    return this.http.post(this.URL_SERVICIOS + 'validarPlacaPerteneceRutaEmpresa', params)
  }
  /** */

  // obtainEmpresa(ruc: string) {
  //   const url = this.URL_SERVICIOS + 'obtenerFlota/' + ruc;
  //   return this.http.get(url);
  // }

  // obtainIDMetadata(idTramite: string) {
  //   const url = this.URL_SERVICIOS + 'obtenerIDMetadata/' + idTramite;
  //   return this.http.get(url);
  // }
/*
  listarDepartamentos() {
    const url = this.URL_SERVICIOS + '/renat/listarDepartamentos';
    return this.http.get(url);
  }
  */

  /*
  listarProvincias(departamento: string) {
    const url = this.URL_SERVICIOS + '/renat/listarProvincias/' + departamento;
    return this.http.get(url).pipe(map(res => res));
  }

  listarDistritos(provincia: string, departamento: string) {
    const url = this.URL_SERVICIOS + '/renat/listarDistritos/' + provincia + '/' + departamento;
    return this.http.get(url);
  }
*/

  // rutaCancelada(ruc: string, origen: string, destino: string) {
  //   let model = {
  //     'ruc': ruc,
  //     'origen': origen,
  //     'destino': destino
  //   };
  //   const url = this.URL_SERVICIOS + 'rutaEstaCancelada/';
  //   return this.http.post(url, model);
  // }

  // validarLicencia(requestLicense: RequestLicense) {
  //   const url = this.URL_SERVICIOS + '/renat/getLicense';
  //   return this.http.post(url, requestLicense);
  // }

  // obtainSoat(placa: string, fecha: string) {
  //   const url = this.URL_SERVICIOS + 'obtenerSoat/' + placa + '/' + fecha;
  //   return this.http.get(url);
  // }

  // insert(itinerario: ItinerarioPost) {
  //   const url = this.URL_SERVICIOS + '/metadata';
  //   return this.http.post(url, itinerario)
  // }

  // loadRenat(id: string) {
  //   const url = this.URL_SERVICIOS + 'metadataDSTT032/' + id;
  //   return this.http.get(url)
  // }

  // obtenerDatosTramite(id: string, enumTupas: string) {
  //   const url = this.URL_SERVICIOS + 'metadataDSTT032/' + id + '/' + enumTupas;
  //   return this.http.get(url)
  // }

 // obtaintSunarp(plate: string) {
  //   return this.http.get<ResponseSunarp>(this.URL_SERVICIOS + '/ConsultaPorPlaca/' + plate, httpOptions).
  //     pipe(
  //       tap(resp => {
  //         Object.assign(this.responseSunarp, resp);

  //       })
  //     );
  // }
}
