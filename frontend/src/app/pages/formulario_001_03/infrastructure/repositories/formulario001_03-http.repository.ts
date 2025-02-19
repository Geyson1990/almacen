import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from '../../../../core/base/formulario-electronico-http.repository';
import { Formulario001_03Repository } from '../../application/repositories/formulario001_03.repository';
import { Formulario001_03Request } from '../../domain/formulario001_03/formulario001_03Request';
import { Formulario001_03Response } from '../../domain/formulario001_03/formulario001_03Response';




@Injectable({
    providedIn: 'root',
})

export class Formulario001_03HttpRepository
    extends FormularioElectronicoHttpRepository<Formulario001_03Request, Formulario001_03Response>
    implements Formulario001_03Repository {

    constructor(http: HttpClient) {
        const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_03}/`;
        super(http, urlApi);
    }
}