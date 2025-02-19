import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo001_A17_03Request } from '../../domain/anexo001_A17_03/anexo001_A17_03Request';
import { Anexo001_A17_03Response } from '../../domain/anexo001_A17_03/anexo001_A17_03Response';
import { Anexo001_A17_03Repository } from '../repositories/anexo001_A17_03.repository';

@Injectable()
export class Anexo001_A17_03Service extends FormularioElectronicoUseCase<Anexo001_A17_03Request, Anexo001_A17_03Response> {
  constructor(
    readonly repository: Anexo001_A17_03Repository
    ) {
    super(repository)
  }
}



