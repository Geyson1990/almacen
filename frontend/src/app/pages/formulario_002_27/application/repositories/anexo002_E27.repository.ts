import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Anexo002_E27Request } from "../../domain/anexo002_E27/anexo002_E27Request";
import { Anexo002_E27Response } from "../../domain/anexo002_E27/anexo002_E27Response";

export abstract class Anexo002_E27Repository extends FormularioElectronicoRepository<Anexo002_E27Request, Anexo002_E27Response> { }
