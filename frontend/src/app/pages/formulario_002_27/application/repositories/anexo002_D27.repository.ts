import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Anexo002_D27Request } from "../../domain/anexo002_D27/anexo002_D27Request";
import { Anexo002_D27Response } from "../../domain/anexo002_D27/anexo002_D27Response";

export abstract class Anexo002_D27Repository extends FormularioElectronicoRepository<Anexo002_D27Request, Anexo002_D27Response> { }
