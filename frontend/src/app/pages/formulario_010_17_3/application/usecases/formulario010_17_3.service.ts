import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario010_17_3Request } from '../../domain/formulario010_17_3/formulario010_17_3Request';
import { Formulario010_17_3Response } from '../../domain/formulario010_17_3/formulario010_17_3Response';
import { Formulario010_17_3Repository } from '../repositories/formulario010_17_3.repository';


@Injectable()
export class Formulario010_17_3Service extends FormularioElectronicoUseCase<Formulario010_17_3Request, Formulario010_17_3Response> {
  constructor(readonly repository: Formulario010_17_3Repository) {
    super(repository)
  }
}