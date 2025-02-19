import { Observable } from "rxjs";
import { FormularioElectronicoRepository } from "src/app/core/base/formulario-electronico.repository";
import { Formulario003_12NTRequest } from "../domain/formulario003_12NTRequest";
import { Formulario003_12NTResponse } from "../domain/formulario003_12NTResponse";

export abstract class Formulario00312NTRepository extends FormularioElectronicoRepository<Formulario003_12NTRequest, Formulario003_12NTResponse> {
  // abstract get(id: string): Observable<Formulario003_12NTResponse>
  // abstract post(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest>
  // abstract put(data: Formulario003_12NTRequest): Observable<Formulario003_12NTRequest>
}
