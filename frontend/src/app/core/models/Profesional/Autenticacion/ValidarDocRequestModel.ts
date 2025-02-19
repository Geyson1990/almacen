import { ItemValidadorDocModel } from './ItemValidadorDocModel';

export class ValidarDocRequestModel {
    tipoDoc: string;
    numDocumento: string;
    listaItemValidador: ItemValidadorDocModel[];
}
