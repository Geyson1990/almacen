import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EncuestaPlantilla } from "../../domain";
import { EncuestaRepository } from "../repositories";

@Injectable()
export class EncuestaUseCase {
  constructor(
    readonly repository: EncuestaRepository
  ) { }

  obtenerPlantilla(idEncuesta: number, codigoIdentificador: string): Observable<EncuestaPlantilla> {
    return this.repository.obtenerPlantilla(idEncuesta, codigoIdentificador);
  }
}
