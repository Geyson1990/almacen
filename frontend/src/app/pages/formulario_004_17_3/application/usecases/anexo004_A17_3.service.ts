import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo004_A17_3Request } from '../../domain/anexo004_A17_3/anexo004_A17_3Request';
import { Anexo004_A17_3Response } from '../../domain/anexo004_A17_3/anexo004_A17_3Response';
import { Anexo004_A17_3Repository } from '../repositories/anexo004_A17_3.repository';

@Injectable()
export class Anexo004_A17_3Service extends FormularioElectronicoUseCase<Anexo004_A17_3Request, Anexo004_A17_3Response> {
  constructor(
    readonly repository: Anexo004_A17_3Repository
    ) {
    super(repository)
  }
}