import { Observable } from "rxjs";
import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Formulario001_PVIRequest, Formulario001_PVIResponse } from "../domain";

export abstract class Formulario001PVIRepository extends FormularioElectronicoRepository<Formulario001_PVIRequest, Formulario001_PVIResponse> {

}
