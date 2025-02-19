import { Observable } from 'rxjs';
import { FormularioElectronicoRepository } from 'src/app/core/base/formulario-electronico.repository';
import { Formulario003_28Request } from '../../domain/formulario003_28/formulario003_28Request';
import { Formulario003_28Response } from '../../domain/formulario003_28/formulario003_28Response';

export abstract class Formulario003_28Repository extends FormularioElectronicoRepository<
  Formulario003_28Request,
  Formulario003_28Response
> {}
