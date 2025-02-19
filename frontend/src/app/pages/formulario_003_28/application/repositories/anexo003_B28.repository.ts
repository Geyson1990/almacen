import { FormularioElectronicoRepository } from '../../../../core/base/formulario-electronico.repository';
import { Anexo003_B28Request } from '../../domain/anexo003_B28/anexo003_B28Request';
import { Anexo003_B28Response } from '../../domain/anexo003_B28/anexo003_B28Response';

export abstract class Anexo003_B28Repository extends FormularioElectronicoRepository<
  Anexo003_B28Request,
  Anexo003_B28Response
> {}
