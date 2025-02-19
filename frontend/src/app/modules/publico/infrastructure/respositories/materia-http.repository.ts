import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MateriaRepository } from '../../application/repositories';
import { Observable, of } from 'rxjs';
import { Materia } from '../../domain';
import { ApiResponse } from 'src/app/core/models/api-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MateriaHttpRepository implements MateriaRepository {
  private urlApi: string = '';

  constructor(
    private readonly http: HttpClient
  ) {
    this.urlApi = `${environment.baseUrlAPI}`;
  }

  listar(): Observable<Array<Materia>> {
    return this.http.get<ApiResponse<Array<Materia>>>(`${this.urlApi}${environment.endPoint.maestros.materias}`)
    .pipe(map(x => x.data));
  }

}
