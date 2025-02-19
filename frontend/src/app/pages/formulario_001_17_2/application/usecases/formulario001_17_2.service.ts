import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario001_17_2Request } from '../../domain/formulario001_17_2/formulario001_17_2Request';
import { Formulario001_17_2Response } from '../../domain/formulario001_17_2/formulario001_17_2Response';
import { Formulario001_17_2Repository } from '../repositories/formulario001_17_2.repository';

@Injectable()
export class Formulario001_17_2Service extends FormularioElectronicoUseCase<Formulario001_17_2Request, Formulario001_17_2Response> {
  constructor(readonly repository: Formulario001_17_2Repository) {
    super(repository)
  }
}
