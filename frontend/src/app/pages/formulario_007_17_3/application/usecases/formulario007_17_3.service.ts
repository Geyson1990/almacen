import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario007_17_3Request } from '../../domain/formulario007_17_3/formulario007_17_3Request';
import { Formulario007_17_3Response } from '../../domain/formulario007_17_3/formulario007_17_3Response';
import { Formulario007_17_3Repository } from '../repositories/formulario007_17_3.repository';


@Injectable()
export class Formulario007_17_3Service extends FormularioElectronicoUseCase<Formulario007_17_3Request, Formulario007_17_3Response> {
  constructor(readonly repository: Formulario007_17_3Repository) {
    super(repository)
  }
}