import { MetaData } from './MetaData';

export class FormularioRequestPost {
    codigo: number;
    formularioId: number;
    codUsuario: string;
    estado: number;
    metaData: MetaData;

    constructor() {
        this.metaData = new MetaData();
      }
}
