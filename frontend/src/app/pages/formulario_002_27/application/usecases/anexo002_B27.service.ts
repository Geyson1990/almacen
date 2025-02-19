import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Anexo002_B27Request } from '../../domain/anexo002_B27/anexo002_B27Request';
import { Anexo002_B27Response } from '../../domain/anexo002_B27/anexo002_B27Response';
import { Anexo002_B27Repository } from '../repositories/anexo002_B27.repository';

@Injectable()
export class Anexo002_B27Service extends FormularioElectronicoUseCase<Anexo002_B27Request, Anexo002_B27Response> {
  constructor(readonly repository: Anexo002_B27Repository) {
    super(repository)
  }
}
