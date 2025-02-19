import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario002_27Request } from '../../domain/formulario002_27/formulario002_27Request';
import { Formulario002_27Response } from '../../domain/formulario002_27/formulario002_27Response';
import { Formulario002_27Repository } from '../repositories/formulario002_27.repository';

@Injectable()
export class Formulario002_27Service extends FormularioElectronicoUseCase<Formulario002_27Request, Formulario002_27Response> {
  constructor(readonly repository: Formulario002_27Repository) {
    super(repository)
  }
}
