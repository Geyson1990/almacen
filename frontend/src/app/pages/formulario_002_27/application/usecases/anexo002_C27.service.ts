import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Anexo002_C27Request } from '../../domain/anexo002_C27/anexo002_C27Request';
import { Anexo002_C27Response } from '../../domain/anexo002_C27/anexo002_C27Response';
import { Anexo002_C27Repository } from '../repositories/anexo002_C27.repository';

@Injectable()
export class Anexo002_C27Service extends FormularioElectronicoUseCase<Anexo002_C27Request, Anexo002_C27Response> {
  constructor(readonly repository: Anexo002_C27Repository) {
    super(repository)
  }
}
