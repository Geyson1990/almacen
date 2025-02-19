import { A002_D17_Seccion_Declaracion_Juarada, A002_D17_Seccion_Documento_Adjuntar } from './Secciones';

export class MetaData {
    declaracionJuarada: A002_D17_Seccion_Declaracion_Juarada;
    documentoAdjuntar: A002_D17_Seccion_Documento_Adjuntar;
    archivoAdjuntoGeneral: File;

    constructor() {
        this.declaracionJuarada = new A002_D17_Seccion_Declaracion_Juarada();
        this.documentoAdjuntar = new A002_D17_Seccion_Documento_Adjuntar();
    }
}