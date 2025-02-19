import { Observable } from "rxjs";
import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Formulario001_PVNIRequest, Formulario001_PVNIResponse } from "../domain";

export abstract class Formulario001PVNIRepository extends FormularioElectronicoRepository<Formulario001_PVNIRequest, Formulario001_PVNIResponse> {

}
