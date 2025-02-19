import { Observable } from "rxjs";
import { Encuesta, EncuestaPlantilla } from "../../domain";

export abstract class EncuestaRepository{
  abstract obtenerPlantilla(idEncuesta: number, codigoIdentificador: string): Observable<EncuestaPlantilla>;
  abstract finalizar(encuesta: Encuesta): Observable<void>;
}
