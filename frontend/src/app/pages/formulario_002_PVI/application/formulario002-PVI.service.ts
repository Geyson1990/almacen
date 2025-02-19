import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario002_PVIRequest, Formulario002_PVIResponse } from '../domain';
import { Formulario002PVIRepository } from './formulario002-PVI.repository';

@Injectable()
export class Formulario002PVIService extends FormularioElectronicoUseCase<Formulario002_PVIRequest, Formulario002_PVIResponse> {

  constructor(readonly repository: Formulario002PVIRepository) {
    super(repository)
  }
}
