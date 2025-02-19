import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Anexo002_B27Request } from "../../domain/anexo002_B27/anexo002_B27Request";
import { Anexo002_B27Response } from "../../domain/anexo002_B27/anexo002_B27Response";

export abstract class Anexo002_B27Repository extends FormularioElectronicoRepository<Anexo002_B27Request, Anexo002_B27Response> { }
