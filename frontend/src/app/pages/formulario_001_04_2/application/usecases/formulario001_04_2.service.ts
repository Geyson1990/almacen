import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario001_04_2Request } from '../../domain/formulario001_04_2/formulario001_04_2Request';
import { Formulario001_04_2Repository } from '../repositories';
import { Formulario001_04_2Response } from '../../domain/formulario001_04_2/formulario001_04_2Response';

@Injectable()
export class Formulario001_04_2Service extends FormularioElectronicoUseCase<
  Formulario001_04_2Request,
  Formulario001_04_2Response
> {
  constructor(readonly repository: Formulario001_04_2Repository) {
    super(repository);
  }
}
