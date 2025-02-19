import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo005_B17_3Request } from '../../domain/anexo005_B17_3/anexo005_B17_3Request';
import { Anexo005_B17_3Response } from '../../domain/anexo005_B17_3/anexo005_B17_3Response';
import { Anexo005_B17_3Repository } from '../repositories/anexo005_B17_3.repository';

@Injectable()
export class Anexo005_B17_3Service extends FormularioElectronicoUseCase<Anexo005_B17_3Request, Anexo005_B17_3Response> {
  constructor(
    readonly repository: Anexo005_B17_3Repository
    ) {
    super(repository)
  }
}