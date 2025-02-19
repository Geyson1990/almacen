import { FormularioElectronicoRepository } from '../../../../core/base/formulario-electronico.repository';
import { Anexo003_A28Request } from '../../domain/anexo003_A28/anexo003_A28Request';
import { Anexo003_A28Response } from '../../domain/anexo003_A28/anexo003_A28Response';

export abstract class Anexo003_A28Repository extends FormularioElectronicoRepository<
  Anexo003_A28Request,
  Anexo003_A28Response
> {}
