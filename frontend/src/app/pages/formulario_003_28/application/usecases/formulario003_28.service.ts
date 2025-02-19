import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario003_28Repository } from '../repositories/formulario003-28.repository';
import { Formulario003_28Request } from '../../domain/formulario003_28/formulario003_28Request';
import { Formulario003_28Response } from '../../domain/formulario003_28/formulario003_28Response';

@Injectable()
export class Formulario003_28Service extends FormularioElectronicoUseCase<
  Formulario003_28Request,
  Formulario003_28Response
> {
  constructor(readonly repository: Formulario003_28Repository) {
    super(repository);
  }
}
