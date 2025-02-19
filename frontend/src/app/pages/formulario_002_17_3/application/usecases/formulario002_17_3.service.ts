import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario002_17_3Request } from '../../domain/formulario002_17_3/formulario002_17_3Request';
import { Formulario002_17_3Response } from '../../domain/formulario002_17_3/formulario002_17_3Response';
import { Formulario002_17_3Repository } from '../repositories/formulario002_17_3.repository';

@Injectable()
export class Formulario002_17_3Service extends FormularioElectronicoUseCase<Formulario002_17_3Request, Formulario002_17_3Response> {
  constructor(readonly repository: Formulario002_17_3Repository) {
    super(repository)
  }
}
