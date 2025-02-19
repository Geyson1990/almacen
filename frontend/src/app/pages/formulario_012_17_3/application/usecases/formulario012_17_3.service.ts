import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario012_17_3Request } from '../../domain/formulario012_17_3/formulario012_17_3Request';
import { Formulario012_17_3Response } from '../../domain/formulario012_17_3/formulario012_17_3Response';
import { Formulario012_17_3Repository } from '../repositories/formulario012_17_3.repository';


@Injectable()
export class Formulario012_17_3Service extends FormularioElectronicoUseCase<Formulario012_17_3Request, Formulario012_17_3Response> {
  constructor(readonly repository: Formulario012_17_3Repository) {
    super(repository)
  }
}