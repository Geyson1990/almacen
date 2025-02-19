import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo009_A17_3Request extends Anexo {
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
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante: string;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
    }
}

export class Seccion1 {
    codigoProcedimiento: string;
    listaDirector: Director[];
}

export class Seccion2 {
    listaInstructorConocimientos: InstructorConocimientos[];
}

export class Seccion3 {
    listaInstructorHabilidades: InstructorHabilidades[];
}

export class Director {
    tipoDocumento: TipoDocumentoModel;
    nroDocumento: string;
    apellidosNombres: string;
    grado: string;
    experiencia_1: boolean;
    experiencia_2: boolean;
    fileDirector?: File;
    pathNameDirector?: string;
    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        this.experiencia_1 = false;
        this.experiencia_2 = false;
    }
}

export class InstructorConocimientos {
    tipoDocumento: TipoDocumentoModel;
    nroDocumento: string;
    apellidosNombres: string;
    educacionSuperior: EducacionSuperior;
    licenciaVigente: boolean;
    experiencia: boolean;
    fileInstructorConocimientos?: File;
    pathNameInstructorConocimientos?: string;
    constructor() {
        this.educacionSuperior = new EducacionSuperior();
        this.tipoDocumento = new TipoDocumentoModel();
        this.licenciaVigente = false;
        this.experiencia = false;
    }
}

export class InstructorHabilidades {
    tipoDocumento: TipoDocumentoModel;
    nroDocumento: string;
    apellidosNombres: string;
    secundariaCompleta: boolean;
    licenciaVigente: boolean;
    categoria: string;
    sancionado: boolean;
    fileInstructorHabilidades?: File;
    pathNameInstructorHabilidades?: string;
    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        //this.categoria = new CategoriasLicencias();
        this.secundariaCompleta = false;
        this.licenciaVigente = false;
        this.sancionado = false;
    }
}

export class Opciones {
    value: string;
    text: string;
    id: number
}

export class CategoriasLicencias {
    AIIa: boolean;
    AIIb: boolean;
    AIIIa: boolean;
    AIIIb: boolean;
    AIIIc: boolean;
    BIIc: boolean;
}

export class EducacionSuperior {
    tecnico: boolean;
    profesional: boolean;
    constructor() {
        this.tecnico = false;
        this.profesional = false;
    }
}