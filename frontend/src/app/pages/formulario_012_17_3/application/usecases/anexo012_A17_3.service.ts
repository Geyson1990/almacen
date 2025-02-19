import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo012_A17_3Request } from '../../domain/anexo012_A17_3/anexo012_A17_3Request';
import { Anexo012_A17_3Response } from '../../domain/anexo012_A17_3/anexo012_A17_3Response';
import { Anexo012_A17_3Repository } from '../repositories/anexo012_A17_3.repository';

@Injectable()
export class Anexo012_A17_3Service extends FormularioElectronicoUseCase<Anexo012_A17_3Request, Anexo012_A17_3Response> {
  constructor(
    readonly repository: Anexo012_A17_3Repository
    ) {
    super(repository)
  }
}