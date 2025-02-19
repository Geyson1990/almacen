import { Injectable } from "@angular/core";
import { FormularioElectronicoUseCase } from '../../../../core/base/formulario-electronico.usecase';
import { Anexo007_A17_3Request } from '../../domain/anexo007_A17_3/anexo007_A17_3Request';
import { Anexo007_A17_3Response } from '../../domain/anexo007_A17_3/anexo007_A17_3Response';
import { Anexo007_A17_3Repository } from '../repositories/anexo007_A17_3.repository';

@Injectable()
export class Anexo007_A17_3Service extends FormularioElectronicoUseCase<Anexo007_A17_3Request, Anexo007_A17_3Response> {
  constructor(
    readonly repository: Anexo007_A17_3Repository
    ) {
    super(repository)
  }
}