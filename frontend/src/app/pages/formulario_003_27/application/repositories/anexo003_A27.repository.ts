import { FormularioElectronicoRepository } from '../../../../core/base/formulario-electronico.repository';
import { Anexo003_A27Request } from '../../domain/anexo003_A27/anexo003_A27Request';
import { Anexo003_A27Response } from '../../domain/anexo003_A27/anexo003_A27Response';

export abstract class Anexo003_A27Repository extends FormularioElectronicoRepository<Anexo003_A27Request, Anexo003_A27Response> { }