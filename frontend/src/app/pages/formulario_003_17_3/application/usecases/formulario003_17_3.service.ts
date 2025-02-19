import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario003_17_3Request } from '../../domain/formulario003_17_3/formulario003_17_3Request';
import { Formulario003_17_3Response } from '../../domain/formulario003_17_3/formulario003_17_3Response';
import { Formulario003_17_3Repository } from '../repositories/formulario003_17_3.repository';


@Injectable()
export class Formulario003_17_3Service extends FormularioElectronicoUseCase<Formulario003_17_3Request, Formulario003_17_3Response> {
  constructor(readonly repository: Formulario003_17_3Repository) {
    super(repository)
  }
}