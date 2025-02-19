import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo002_B17_2Request } from '../../domain/anexo002_B17_2/anexo002_B17_2Request';
import { Anexo002_B17_2Response } from '../../domain/anexo002_B17_2/anexo002_B17_2Response';
import { Anexo002_B17_2Repository } from '../repositories/anexo002_B17_2.repository';

@Injectable()
export class Anexo002_B17_2Service extends FormularioElectronicoUseCase<Anexo002_B17_2Request, Anexo002_B17_2Response> {
  constructor(
    readonly repository: Anexo002_B17_2Repository
    ) {
    super(repository)
  }
}



