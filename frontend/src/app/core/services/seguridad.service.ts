import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginRequestModel } from '../models/Autenticacion/LoginRequestModel';
import { LoginResponseModel } from '../models/Autenticacion/LoginResponseModel';
import { ApiResponseModel, TipoPersonaResponseModel } from '../models/Autenticacion/TipoPersonaResponseModel';
import { RegistroUsuarioModel } from '../models/Autenticacion/RegistroUsuarioModel';
import { ResponseComunModel } from '../models/Tramite/ResponseComunModel';
import { UsuarioModel } from '../models/Autenticacion/UsuarioModel';
import { LoginSunatRequestModel } from '../models/Autenticacion/LoginSunatRequestModel';
import { TipoDocumentoPersonaExtranjeraModel } from '../models/Autenticacion/TipoDocumentoPersonaExtranjeraModel';
import { DatosUsuarioLogin } from '../models/Autenticacion/DatosUsuarioLogin';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  urlApi: string;
  urlLogin: string;
  urlTipoPersona: string;
  urlTipoDocumentoPersonaExtranjera: string;
  urlLogout: string;
  urlRecuperarPass: string;
  urlRegistrar: string;
  urlCambiarPass: string;
  urlActualizar: string;
  urlLoginSunat: string;

  constructor(private httpClient: HttpClient) {
    this.urlApi = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.autenticacion}`;
    this.urlLogin = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.login}`;
    this.urlTipoPersona = `${environment.baseUrlPersonaAPI}${environment.endPoint.tupas.tipopersona}`;
    this.urlTipoDocumentoPersonaExtranjera = `${environment.baseUrlPersonaAPI}${environment.endPoint.maestros.tipoDocumentoPersonaExtranjera}`;
    this.urlLogout = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.logout}`;
    this.urlRecuperarPass = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.recuperarpass}`;
    this.urlRegistrar = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.registrar}`;
    this.urlCambiarPass = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.cambiarpass}`;
    this.urlActualizar = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.actualizar}`;
    this.urlLoginSunat = `${environment.baseUrlSeguridadAPI}${environment.endPoint.autenticacion.loginsunat}`;
  }

  postLogin(data: LoginRequestModel): Observable<ApiResponse<LoginResponseModel>> {
    return this.httpClient.post<ApiResponse<LoginResponseModel>>(this.urlLogin, data);
  }
  
  postLogout(): void {
    try {
      this.httpClient.post(this.urlLogout, null);
    }
    catch (e) { }
    sessionStorage.removeItem('accessToken');
  }

  postRecuperarPass(usuarioModel: UsuarioModel): Observable<ResponseComunModel<string>> {
    return this.httpClient.post<ResponseComunModel<string>>(this.urlRecuperarPass, usuarioModel);
  }

  postRegistrar(data: RegistroUsuarioModel): Observable<ResponseComunModel<string>> {
    return this.httpClient.put<ResponseComunModel<string>>(this.urlRegistrar, data);
  }

  postCambiarPass(usuarioModel: UsuarioModel): Observable<ResponseComunModel<string>> {
    return this.httpClient.post<ResponseComunModel<string>>(this.urlCambiarPass, usuarioModel);
  }

  postActualizar(data: RegistroUsuarioModel): Observable<ResponseComunModel<string>> {
    return this.httpClient.put<ResponseComunModel<string>>(this.urlActualizar, data);
  }

  
  getTipoPersonas(): Observable<ApiResponseModel<Array<TipoPersonaResponseModel>>> {
    return this.httpClient.get<ApiResponseModel<Array<TipoPersonaResponseModel>>>(this.urlTipoPersona)
    .pipe(map(resp=>resp));
  }

  getTipoDocumentosPersonaExtranjera(): Observable<ApiResponseModel<Array<TipoDocumentoPersonaExtranjeraModel>>> {
    return this.httpClient.get<ApiResponseModel<Array<TipoDocumentoPersonaExtranjeraModel>>>(this.urlTipoDocumentoPersonaExtranjera);
    // return of([
    //   {
    //       "codigo": "00003",
    //       "descripcion": "CARNET DE EXTRANJERÍA",
    //   },
    //   {
    //       "codigo": "00101",
    //       "descripcion": "CARNET SOLICITANTE DE REFUGIO",
    //   },
    //   {
    //       "codigo": "00102",
    //       "descripcion": "CARNET DE PERMISO TEMPORAL DE PERMANENCIA",
    //   },
    //   {
    //       "codigo": "00103",
    //       "descripcion": "CARNET DE IDENTIFICACIÓN",
    //   },
    //   {
    //       "codigo": "00105",
    //       "descripcion": "PASAPORTE",
    //   }
    // ]);
  }

  // LOCAL
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
    try {
      return this.jwtHelper.isTokenExpired(token) === false;
    } catch (error) {
      return false;
    }
  }

  getToken(): string {
    return sessionStorage.getItem('accessToken');
  }

  getTokenExpirationDate(): Date {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    try {
      return this.jwtHelper.getTokenExpirationDate(token);
    } catch (error) {
      return null;
    }
  }

  getUserName(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.nombre;
    } catch (error) {
      return '';
    }
  }

  getUserId(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.userid;
    } catch (error) {
      return '';
    }
  }

  getNameId(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.tipoPersona;
    } catch (error) {
      return '';
    }
  }

  getTipoPersona(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.tipoPersona;
    } catch (error) {
      return '';
    }
  }

  getTipoDocumento(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.tipoDoc;
    } catch (error) {
      return '';
    }
  }

  getNumDoc(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.nroDoc;
    } catch (error) {
      return '';
    }
  }

  getCompanyCode(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.ruc;
    } catch (error) {
      return '';
    }
  }

  getIdCliente(): string {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return '';
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.idCliente;
    } catch (error) {
      return '';
    }
  }

  getDatosUsuarioLogin(): DatosUsuarioLogin {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const data = (decodedToken.userdata===undefined ? decodedToken : decodedToken.userdata) as DatosUsuarioLogin;
      data.ruc = decodedToken.ruc;
      data.razonSocial = decodedToken.razonSocial ?? '';
      data.nombreCompleto = `${data.nombres ?? ''} ${data.apePaterno ?? ''} ${data.apeMaterno ?? ''}`
        ?.trim();
      return data;
    } catch (error) {
      return null;
    }
  }

  getDecodedToken(token: string): any {
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  isTokenValid(token: string): boolean {
    if (!token) {
      return false;
    }
    try {
      return this.jwtHelper.isTokenExpired(token) === false;
    } catch (error) {
      return false;
    }
  }

  get<T>(parametro: string): Observable<T> {
    return this.httpClient.get<T>(`${this.urlApi}?token=${parametro}`);
  }

}
