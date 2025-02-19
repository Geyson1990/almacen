import { Injectable } from '@angular/core';
import { FormularioElectronicoUseCase } from 'src/app/core/base/formulario-electronico.usecase';
import { Formulario001_16Request } from '../../domain/formulario001_16/formulario001_16Request';
import { Formulario001_16Response } from '../../domain/formulario001_16/formulario001_16Response';
import { Formulario001_16Repository } from '../repositories/formulario001_16.repository';

@Injectable()
export class Formulario001_16Service extends FormularioElectronicoUseCase<Formulario001_16Request, Formulario001_16Response> {
    constructor(readonly repository: Formulario001_16Repository) {
        super(repository)
    }
}