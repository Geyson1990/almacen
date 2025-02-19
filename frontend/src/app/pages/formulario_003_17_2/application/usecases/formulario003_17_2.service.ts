import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario003_17_2Request } from '../../domain/formulario003_17_2/formulario003_17_2Request';
import { Formulario003_17_2Response } from '../../domain/formulario003_17_2/formulario003_17_2Response';
import { Formulario003_17_2Repository } from '../repositories/formulario003_17_2.repository';

@Injectable()
export class Formulario003_17_2Service extends FormularioElectronicoUseCase<Formulario003_17_2Request, Formulario003_17_2Response> {
  constructor(readonly repository: Formulario003_17_2Repository) {
    super(repository)
  }
}
