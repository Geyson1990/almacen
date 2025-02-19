import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo003_A27Request } from '../../domain/anexo003_A27/anexo003_A27Request';
import { Anexo003_A27Response } from '../../domain/anexo003_A27/anexo003_A27Response';
import { Anexo003_A27Repository } from '../repositories/anexo003_A27.repository';

@Injectable()
export class Anexo003_A27Service extends FormularioElectronicoUseCase<Anexo003_A27Request, Anexo003_A27Response> {
  constructor(
    readonly repository: Anexo003_A27Repository
    ) {
    super(repository)
  }
}