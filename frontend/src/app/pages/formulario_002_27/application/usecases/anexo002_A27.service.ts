import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Anexo002_A27Request } from '../../domain/anexo002_A27/anexo002_A27Request';
import { Anexo002_A27Response } from '../../domain/anexo002_A27/anexo002_A27Response';
import { Anexo002_A27Repository } from '../repositories/anexo002_A27.repository';

@Injectable()
export class Anexo002_A27Service extends FormularioElectronicoUseCase<Anexo002_A27Request, Anexo002_A27Response> {
  constructor(
    readonly repository: Anexo002_A27Repository
  ) {
    super(repository)
  }
}
