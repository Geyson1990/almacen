import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormularioElectronicoRepository } from "./formulario-electronico.repository";

export class FormularioElectronicoHttpRepository<S, T> implements FormularioElectronicoRepository<S, T> {
  // private urlApi: string;
  constructor(
    protected readonly http: HttpClient,
    protected readonly urlApi: string
  ) {
    this.urlApi = urlApi;
  }
  get(id: string): Observable<T> {
    return this.http.get<T>(this.urlApi + id);
  }
  post(data: S|FormData): Observable<any> {
    return this.http.post<S>(this.urlApi, data);
  }
  put(data: S|FormData): Observable<any> {
    return this.http.put<S>(this.urlApi, data);
  }

  // get(id: string): Observable<Formulario003_12NTResponse> {
  //   return this.http.get<Formulario003_12NTResponse>(this.urlApi + id);
  // }
  // post(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest> {
  //   return this.http.post<Formulario003_12NTRequest>( this.urlApi, data);
  // }
  // put(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest> {
  //   return this.http.put<Formulario003_12NTRequest>(this.urlApi, data);
  // }
}
