import { MetaData } from './MetaData';

export class AnexoRequestPost {
    formularioId: number;
    anexoId: number;
    codigo: string;
    metaData: MetaData;

    constructor() {
        this.metaData = new MetaData();
      }
}



