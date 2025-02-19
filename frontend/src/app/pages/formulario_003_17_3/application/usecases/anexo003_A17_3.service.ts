import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo003_A17_3Request } from '../../domain/anexo003_A17_3/anexo003_A17_3Request';
import { Anexo003_A17_3Response } from '../../domain/anexo003_A17_3/anexo003_A17_3Response';
import { Anexo003_A17_3Repository } from '../repositories/anexo003_A17_3.repository';

@Injectable()
export class Anexo003_A17_3Service extends FormularioElectronicoUseCase<Anexo003_A17_3Request, Anexo003_A17_3Response> {
  constructor(
    readonly repository: Anexo003_A17_3Repository
    ) {
    super(repository)
  }
}