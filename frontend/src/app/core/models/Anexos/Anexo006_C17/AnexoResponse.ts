//export class AnexoResponse {
 //   formularioId: number;
 //   codigo: string;
 //   anexoId: number;
 //   metaData: string;
//}


import { Anexo } from '../AnexoMain';

export class AnexoResponse extends Anexo {
    metaData: string;
}
