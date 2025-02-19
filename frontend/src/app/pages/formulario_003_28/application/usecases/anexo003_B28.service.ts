import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo003_B28Request } from '../../domain/anexo003_B28/anexo003_B28Request';
import { Anexo003_B28Response } from '../../domain/anexo003_B28/anexo003_B28Response';
import { Anexo003_B28Repository } from '../repositories/anexo003_B28.repository';

@Injectable()
export class Anexo003_B28Service extends FormularioElectronicoUseCase<
  Anexo003_B28Request,
  Anexo003_B28Response
> {
  constructor(readonly repository: Anexo003_B28Repository) {
    super(repository);
  }
}
