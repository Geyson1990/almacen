import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario006_17_3Request } from '../../domain/formulario006_17_3/formulario006_17_3Request';
import { Formulario006_17_3Response } from '../../domain/formulario006_17_3/formulario006_17_3Response';
import { Formulario006_17_3Repository } from '../repositories/formulario006_17_3.repository';


@Injectable()
export class Formulario006_17_3Service extends FormularioElectronicoUseCase<Formulario006_17_3Request, Formulario006_17_3Response> {
  constructor(readonly repository: Formulario006_17_3Repository) {
    super(repository)
  }
}