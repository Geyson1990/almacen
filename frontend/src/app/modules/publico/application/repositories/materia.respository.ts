import { Observable } from "rxjs";
import { Materia } from "../../domain";

export abstract class MateriaRepository{
  abstract listar(): Observable<Array<Materia>>;
}
