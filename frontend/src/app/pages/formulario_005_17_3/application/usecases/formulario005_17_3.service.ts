import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario005_17_3Request } from '../../domain/formulario005_17_3/formulario005_17_3Request';
import { Formulario005_17_3Response } from '../../domain/formulario005_17_3/formulario005_17_3Response';
import { Formulario005_17_3Repository } from '../repositories/formulario005_17_3.repository';


@Injectable()
export class Formulario005_17_3Service extends FormularioElectronicoUseCase<Formulario005_17_3Request, Formulario005_17_3Response> {
  constructor(readonly repository: Formulario005_17_3Repository) {
    super(repository)
  }
}