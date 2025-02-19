import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo006_A17_3Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    seccion3: Seccion3;
    seccion4: Seccion4;
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante: string;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion4 = new Seccion4();
    }
}

export class Seccion1 {
    codigoProcedimiento: string;
}

export class Seccion2 {
    listaIngeniero: Personal[];
    pathNameDocumentos: string;
    fileDocumentos: File;
}

export class Seccion3 {
    listaTecnicoAutomotriz: Personal[];
    pathNameDocumentos: string;
    fileDocumentos: File;
}

export class Seccion4 {
    listaTecnicoElectronica: Personal[];
    pathNameDocumentos: string;
    fileDocumentos: File;
}

export class Personal {
    apellidosNombres: string;
    tipoDocumento: TipoDocumentoModel;
    nroDocumento: string;
    titulo: string;
    cip: string;
    listaExperiencia: Experiencia[];
    constructor() {
        //his.titulo = new Titulo();
        this.tipoDocumento = new TipoDocumentoModel()
    }
}

export class Titulo {
    value: string;
    text: string;
}

export class Experiencia {
    lugar: string;
    fechaIni: string;
    fechaFin: string;
    folio: string;
}

