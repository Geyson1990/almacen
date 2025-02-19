import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario002_17_2Request } from '../../domain/formulario002_17_2/formulario002_17_2Request';
import { Formulario002_17_2Response } from '../../domain/formulario002_17_2/formulario002_17_2Response';
import { Formulario002_17_2Repository } from '../repositories/formulario002_17_2.repository';

@Injectable()
export class Formulario002_17_2Service extends FormularioElectronicoUseCase<Formulario002_17_2Request, Formulario002_17_2Response> {
  constructor(readonly repository: Formulario002_17_2Repository) {
    super(repository)
  }
}
