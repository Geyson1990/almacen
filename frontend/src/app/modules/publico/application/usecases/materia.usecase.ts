import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Materia } from "../../domain";
import { MateriaRepository } from "../repositories";

@Injectable()
export class MateriaUseCase {
  constructor(
    readonly repository: MateriaRepository
  ) { }

  listar(): Observable<Array<Materia>> {
    return this.repository.listar();
  }
}
