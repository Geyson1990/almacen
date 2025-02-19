import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario003_27Request } from '../../domain/formulario003_27/formulario003_27Request';
import { Formulario003_27Response } from '../../domain/formulario003_27/formulario003_27Response';
import { Formulario003_27Repository } from '../repositories/formulario003_27.repository';


@Injectable()
export class Formulario003_27Service extends FormularioElectronicoUseCase<Formulario003_27Request, Formulario003_27Response> {
  constructor(readonly repository: Formulario003_27Repository) {
    super(repository)
  }
}