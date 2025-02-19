import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Formulario001_03Request } from '../../domain/formulario001_03/formulario001_03Request';
import { Formulario001_03Response } from '../../domain/formulario001_03/formulario001_03Response';
import { Formulario001_03Repository } from '../repositories/formulario001_03.repository';



@Injectable()
export class Formulario001_03Service extends FormularioElectronicoUseCase<Formulario001_03Request, Formulario001_03Response> {
    constructor(readonly repository: Formulario001_03Repository) {
        super(repository)
    }
}