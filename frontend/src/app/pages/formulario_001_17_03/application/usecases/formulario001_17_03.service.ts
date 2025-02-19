import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario001_17_03Request } from '../../domain/formulario001_17_03/formulario001_17_03Request';
import { Formulario001_17_03Response } from '../../domain/formulario001_17_03/formulario001_17_03Response';
import { Formulario001_17_03Repository } from '../repositories/formulario001_17_03.repository';

@Injectable()
export class Formulario001_17_03Service extends FormularioElectronicoUseCase<Formulario001_17_03Request, Formulario001_17_03Response> {
  constructor(readonly repository: Formulario001_17_03Repository) {
    super(repository)
  }
}
