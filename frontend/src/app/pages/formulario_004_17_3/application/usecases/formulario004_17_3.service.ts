import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario004_17_3Request } from '../../domain/formulario004_17_3/formulario004_17_3Request';
import { Formulario004_17_3Response } from '../../domain/formulario004_17_3/formulario004_17_3Response';
import { Formulario004_17_3Repository } from '../repositories/formulario004_17_3.repository';


@Injectable()
export class Formulario004_17_3Service extends FormularioElectronicoUseCase<Formulario004_17_3Request, Formulario004_17_3Response> {
  constructor(readonly repository: Formulario004_17_3Repository) {
    super(repository)
  }
}