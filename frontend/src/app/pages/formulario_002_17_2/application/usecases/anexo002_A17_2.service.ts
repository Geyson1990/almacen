import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo002_A17_2Request } from '../../domain/anexo002_A17_2/anexo002_A17_2Request';
import { Anexo002_A17_2Response } from '../../domain/anexo002_A17_2/anexo002_A17_2Response';
import { Anexo002_A17_2Repository } from '../repositories/anexo002_A17_2.repository';

@Injectable()
export class Anexo002_A17_2Service extends FormularioElectronicoUseCase<Anexo002_A17_2Request, Anexo002_A17_2Response> {
  constructor(
    readonly repository: Anexo002_A17_2Repository
    ) {
    super(repository)
  }
}



