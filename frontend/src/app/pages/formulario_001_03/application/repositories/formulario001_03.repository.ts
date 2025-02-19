import { FormularioElectronicoRepository } from '../../../../core/base/formulario-electronico.repository';
import { Formulario001_03Request } from '../../domain/formulario001_03/formulario001_03Request';
import { Formulario001_03Response } from '../../domain/formulario001_03/formulario001_03Response';

export abstract class Formulario001_03Repository extends FormularioElectronicoRepository<Formulario001_03Request, Formulario001_03Response> { }