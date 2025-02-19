import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario002_12Request, Formulario002_12Response } from '../domain';
import { Formulario00212Repository } from './formulario002-12.repository';

@Injectable()
export class Formulario00212Service extends FormularioElectronicoUseCase<Formulario002_12Request, Formulario002_12Response> {
  constructor(readonly repository: Formulario00212Repository) {
    super(repository)
  }
}
