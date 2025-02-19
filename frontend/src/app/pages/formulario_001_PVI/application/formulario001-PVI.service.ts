import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario001_PVIRequest, Formulario001_PVIResponse } from '../domain';
import { Formulario001PVIRepository } from './formulario001-PVI.repository';

@Injectable()
export class Formulario001PVIService extends FormularioElectronicoUseCase<Formulario001_PVIRequest, Formulario001_PVIResponse> {

  constructor(readonly repository: Formulario001PVIRepository) {
    super(repository)
  }
}
