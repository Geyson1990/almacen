import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario009_17_3Request } from '../../domain/formulario009_17_3/formulario009_17_3Request';
import { Formulario009_17_3Response } from '../../domain/formulario009_17_3/formulario009_17_3Response';
import { Formulario009_17_3Repository } from '../repositories/formulario009_17_3.repository';


@Injectable()
export class Formulario009_17_3Service extends FormularioElectronicoUseCase<Formulario009_17_3Request, Formulario009_17_3Response> {
  constructor(readonly repository: Formulario009_17_3Repository) {
    super(repository)
  }
}