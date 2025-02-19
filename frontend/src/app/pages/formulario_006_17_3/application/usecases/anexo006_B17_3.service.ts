import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo006_B17_3Request } from '../../domain/anexo006_B17_3/anexo006_B17_3Request';
import { Anexo006_B17_3Response } from '../../domain/anexo006_B17_3/anexo006_B17_3Response';
import { Anexo006_B17_3Repository } from '../repositories/anexo006_B17_3.repository';

@Injectable()
export class Anexo006_B17_3Service extends FormularioElectronicoUseCase<Anexo006_B17_3Request, Anexo006_B17_3Response> {
  constructor(
    readonly repository: Anexo006_B17_3Repository
    ) {
    super(repository)
  }
}