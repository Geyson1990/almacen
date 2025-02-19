import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo003_A28Request } from '../../domain/anexo003_A28/anexo003_A28Request';
import { Anexo003_A28Response } from '../../domain/anexo003_A28/anexo003_A28Response';
import { Anexo003_A28Repository } from '../repositories/anexo003_A28.repository';

@Injectable()
export class Anexo003_A28Service extends FormularioElectronicoUseCase<
  Anexo003_A28Request,
  Anexo003_A28Response
> {
  constructor(readonly repository: Anexo003_A28Repository) {
    super(repository);
  }
}
