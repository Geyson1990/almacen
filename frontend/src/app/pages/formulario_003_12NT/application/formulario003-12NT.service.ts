import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { environment } from 'src/environments/environment';
import { Formulario003_12NTRequest } from '../domain/formulario003_12NTRequest';
import { Formulario003_12NTResponse } from '../domain/formulario003_12NTResponse';
import { Formulario00312NTRepository } from './formulario003-12NT.repository';

@Injectable()
export class Formulario00312NTService extends FormularioElectronicoUseCase<Formulario003_12NTRequest, Formulario003_12NTResponse> {

  constructor(readonly repository: Formulario00312NTRepository) {
    super(repository)
  }

  // get(id: string): Observable<Formulario003_12NTResponse> {
  //   return this.repository.get(id);
  // }

  // post(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest> {
  //   return this.repository.post(data);
  // }

  // put(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest> {
  //   return this.repository.put(data);
  // }
}
