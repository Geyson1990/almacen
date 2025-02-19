import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormularioElectronicoHttpRepository } from 'src/app/core/base/formulario-electronico-http.repository';
import { Formulario001_16Repository } from '../../application/repositories/formulario001_16.repository';
import { Formulario001_16Request } from '../../domain/formulario001_16/formulario001_16Request';
import { Formulario001_16Response } from '../../domain/formulario001_16/formulario001_16Response';


@Injectable({
    providedIn: 'root',
})

export class Formulario001_16HttpRepository
    extends FormularioElectronicoHttpRepository<Formulario001_16Request, Formulario001_16Response>
    implements Formulario001_16Repository {

    constructor(http: HttpClient) {
        const urlApi = `${environment.baseUrlAPI}${environment.endPoint.formulario.formulario1_16}/`;
        super(http, urlApi);
    }
}