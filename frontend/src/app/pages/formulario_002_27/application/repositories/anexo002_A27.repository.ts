import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Anexo002_A27Request } from "../../domain/anexo002_A27/anexo002_A27Request";
import { Anexo002_A27Response } from "../../domain/anexo002_A27/anexo002_A27Response";

export abstract class Anexo002_A27Repository extends FormularioElectronicoRepository<Anexo002_A27Request, Anexo002_A27Response> { }
