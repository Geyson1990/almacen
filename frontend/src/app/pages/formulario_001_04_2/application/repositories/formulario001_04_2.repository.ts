import { FormularioElectronicoRepository } from '../../../../core/base/formulario-electronico.repository';
import { Formulario001_04_2Request } from '../../domain/formulario001_04_2/formulario001_04_2Request';
import { Formulario001_04_2Response } from '../../domain/formulario001_04_2/formulario001_04_2Response';

export abstract class Formulario001_04_2Repository extends FormularioElectronicoRepository<
  Formulario001_04_2Request,
  Formulario001_04_2Response
> {}
