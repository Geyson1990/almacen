import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo005_A17_3Request } from '../../domain/anexo005_A17_3/anexo005_A17_3Request';
import { Anexo005_A17_3Response } from '../../domain/anexo005_A17_3/anexo005_A17_3Response';
import { Anexo005_A17_3Repository } from '../repositories/anexo005_A17_3.repository';

@Injectable()
export class Anexo005_A17_3Service extends FormularioElectronicoUseCase<Anexo005_A17_3Request, Anexo005_A17_3Response> {
  constructor(
    readonly repository: Anexo005_A17_3Repository
    ) {
    super(repository)
  }
}