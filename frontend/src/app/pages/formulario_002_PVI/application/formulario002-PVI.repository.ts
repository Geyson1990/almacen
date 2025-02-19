import { Observable } from "rxjs";
import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Formulario002_PVIRequest, Formulario002_PVIResponse } from "../domain";

export abstract class Formulario002PVIRepository extends FormularioElectronicoRepository<Formulario002_PVIRequest, Formulario002_PVIResponse> {

}
