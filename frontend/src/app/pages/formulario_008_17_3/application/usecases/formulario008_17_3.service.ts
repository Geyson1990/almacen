import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario008_17_3Request } from '../../domain/formulario008_17_3/formulario008_17_3Request';
import { Formulario008_17_3Response } from '../../domain/formulario008_17_3/formulario008_17_3Response';
import { Formulario008_17_3Repository } from '../repositories/formulario008_17_3.repository';


@Injectable()
export class Formulario008_17_3Service extends FormularioElectronicoUseCase<Formulario008_17_3Request, Formulario008_17_3Response> {
  constructor(readonly repository: Formulario008_17_3Repository) {
    super(repository)
  }
}