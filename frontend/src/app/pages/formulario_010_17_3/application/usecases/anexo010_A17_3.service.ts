import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo010_A17_3Request } from '../../domain/anexo010_A17_3/anexo010_A17_3Request';
import { Anexo010_A17_3Response } from '../../domain/anexo010_A17_3/anexo010_A17_3Response';
import { Anexo010_A17_3Repository } from '../repositories/anexo010_A17_3.repository';

@Injectable()
export class Anexo010_A17_3Service extends FormularioElectronicoUseCase<Anexo010_A17_3Request, Anexo010_A17_3Response> {
  constructor(
    readonly repository: Anexo010_A17_3Repository
    ) {
    super(repository)
  }
}