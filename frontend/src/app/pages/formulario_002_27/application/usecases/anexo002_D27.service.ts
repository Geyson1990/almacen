import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Anexo002_D27Request } from '../../domain/anexo002_D27/anexo002_D27Request';
import { Anexo002_D27Response } from '../../domain/anexo002_D27/anexo002_D27Response';
import { Anexo002_D27Repository } from '../repositories/anexo002_D27.repository';

@Injectable()
export class Anexo002_D27Service extends FormularioElectronicoUseCase<Anexo002_D27Request, Anexo002_D27Response> {
  constructor(readonly repository: Anexo002_D27Repository) {
    super(repository)
  }
}
