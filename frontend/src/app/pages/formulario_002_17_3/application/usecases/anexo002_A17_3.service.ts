import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo002_A17_3Request } from '../../domain/anexo002_A17_3/anexo002_A17_3Request';
import { Anexo002_A17_3Response } from '../../domain/anexo002_A17_3/anexo002_A17_3Response';
import { Anexo002_A17_3Repository } from '../repositories/anexo002_A17_3.repository';

@Injectable()
export class Anexo002_A17_3Service extends FormularioElectronicoUseCase<Anexo002_A17_3Request, Anexo002_A17_3Response> {
  constructor(
    readonly repository: Anexo002_A17_3Repository
    ) {
    super(repository)
  }
}



