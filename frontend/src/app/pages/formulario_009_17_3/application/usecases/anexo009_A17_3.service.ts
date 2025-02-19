import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo009_A17_3Request } from '../../domain/anexo009_A17_3/anexo009_A17_3Request';
import { Anexo009_A17_3Response } from '../../domain/anexo009_A17_3/anexo009_A17_3Response';
import { Anexo009_A17_3Repository } from '../repositories/anexo009_A17_3.repository';

@Injectable()
export class Anexo009_A17_3Service extends FormularioElectronicoUseCase<Anexo009_A17_3Request, Anexo009_A17_3Response> {
  constructor(
    readonly repository: Anexo009_A17_3Repository
    ) {
    super(repository)
  }
}