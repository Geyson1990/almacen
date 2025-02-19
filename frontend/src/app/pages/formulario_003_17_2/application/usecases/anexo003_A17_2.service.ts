import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo003_A17_2Request } from '../../domain/anexo003_A17_2/anexo003_A17_2Request';
import { Anexo003_A17_2Response } from '../../domain/anexo003_A17_2/anexo003_A17_2Response';
import { Anexo003_A17_2Repository } from '../repositories/anexo003_A17_2.repository';

@Injectable()
export class Anexo003_A17_2Service extends FormularioElectronicoUseCase<Anexo003_A17_2Request, Anexo003_A17_2Response> {
  constructor(
    readonly repository: Anexo003_A17_2Repository
    ) {
    super(repository)
  }
}



