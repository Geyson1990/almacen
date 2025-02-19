import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo008_A17_3Request } from '../../domain/anexo008_A17_3/anexo008_A17_3Request';
import { Anexo008_A17_3Response } from '../../domain/anexo008_A17_3/anexo008_A17_3Response';
import { Anexo008_A17_3Repository } from '../repositories/anexo008_A17_3.repository';

@Injectable()
export class Anexo008_A17_3Service extends FormularioElectronicoUseCase<Anexo008_A17_3Request, Anexo008_A17_3Response> {
  constructor(
    readonly repository: Anexo008_A17_3Repository
    ) {
    super(repository)
  }
}