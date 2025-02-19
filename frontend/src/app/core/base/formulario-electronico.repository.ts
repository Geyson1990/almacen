import { Observable } from "rxjs";

export abstract class FormularioElectronicoRepository<TRequest, TResponse> {
  abstract get(id: string): Observable<TResponse>;
  abstract post(data: TRequest|FormData): Observable<any>;
  abstract put(data: TRequest|FormData): Observable<any>;
}
