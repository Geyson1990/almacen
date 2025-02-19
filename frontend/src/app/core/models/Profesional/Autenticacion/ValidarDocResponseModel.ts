import { BaseResponseModel } from '../../BaseResponseModel';
import { CarnetExtranjeria } from '../../ExtranjeriaModel';
import { DatosPersona } from '../../ReniecModel';

export class ValidarDocResponseModel extends BaseResponseModel {
    reniecResponse: DatosPersona;
    migracionResponse: CarnetExtranjeria;
}
