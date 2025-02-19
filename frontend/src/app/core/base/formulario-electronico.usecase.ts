import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FormularioElectronicoRepository } from "./formulario-electronico.repository";

export interface IFormularioElectronicoUseCase<S, T> {
  get(id: string): Observable<T>;
  post(data: S): Observable<any>;
  put(data: S): Observable<any>;
}

@Injectable()
export class FormularioElectronicoUseCase<S, T> implements IFormularioElectronicoUseCase<S, T> {

  constructor(
    protected readonly repository: FormularioElectronicoRepository<S, T>
  ) {}

  get(id: string): Observable<T> {
    return this.repository.get(id);
  }

  post(data: S|FormData): Observable<any> {
    return this.repository.post(data);
  }

  put(data: S|FormData): Observable<any> {
    return this.repository.put(data);
  }
}
