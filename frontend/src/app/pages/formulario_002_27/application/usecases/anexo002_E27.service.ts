import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Anexo002_E27Request } from '../../domain/anexo002_E27/anexo002_E27Request';
import { Anexo002_E27Response } from '../../domain/anexo002_E27/anexo002_E27Response';
import { Anexo002_E27Repository } from '../repositories/anexo002_E27.repository';

@Injectable()
export class Anexo002_E27Service extends FormularioElectronicoUseCase<Anexo002_E27Request, Anexo002_E27Response> {
  constructor(readonly repository: Anexo002_E27Repository) {
    super(repository)
  }
}
