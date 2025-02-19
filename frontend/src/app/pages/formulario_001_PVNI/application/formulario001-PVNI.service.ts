import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario001_PVNIRequest, Formulario001_PVNIResponse } from '../domain';
import { Formulario001PVNIRepository } from './formulario001-PVNI.repository';

@Injectable()
export class Formulario001PVNIService extends FormularioElectronicoUseCase<Formulario001_PVNIRequest, Formulario001_PVNIResponse> {

  constructor(readonly repository: Formulario001PVNIRepository) {
    super(repository)
  }
}
