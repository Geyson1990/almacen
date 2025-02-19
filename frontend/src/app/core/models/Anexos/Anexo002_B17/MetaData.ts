import { A002_B17_Seccion_Declaracion_Jurada, A002_B17_Seccion_Documento_Adjuntar } from './Secciones';

export class MetaData {
    declaracionJurada: A002_B17_Seccion_Declaracion_Jurada;
    documentoAdjuntar: A002_B17_Seccion_Documento_Adjuntar;

    constructor() {
        this.declaracionJurada = new A002_B17_Seccion_Declaracion_Jurada();
        this.documentoAdjuntar = new A002_B17_Seccion_Documento_Adjuntar();
    }
}