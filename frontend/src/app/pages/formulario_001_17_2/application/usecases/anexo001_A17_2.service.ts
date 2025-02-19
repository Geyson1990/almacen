import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo001_A17_2Request } from '../../domain/anexo001_A17_2/anexo001_A17_2Request';
import { Anexo001_A17_2Response } from '../../domain/anexo001_A17_2/anexo001_A17_2Response';
import { Anexo001_A17_2Repository } from '../repositories/anexo001_A17_2.repository';

@Injectable()
export class Anexo001_A17_2Service extends FormularioElectronicoUseCase<Anexo001_A17_2Request, Anexo001_A17_2Response> {
  constructor(
    readonly repository: Anexo001_A17_2Repository
    ) {
    super(repository)
  }
}



