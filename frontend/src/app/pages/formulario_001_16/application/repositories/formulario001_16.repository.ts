import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Formulario001_16Request } from '../../domain/formulario001_16/formulario001_16Request';
import { Formulario001_16Response } from '../../domain/formulario001_16/formulario001_16Response';

export abstract class Formulario001_16Repository extends FormularioElectronicoRepository<Formulario001_16Request, Formulario001_16Response> { }
