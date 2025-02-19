import { Anexo } from '../../../../core/models/Anexos/AnexoMain';

export class Anexo007_C17_3Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
    }
}

export class Seccion1 {
    listaUbigeos:ListaUbigeos[];
}

export class Seccion2 {
    listaCronograma:ListaCronograma[];
}

export class ListaUbigeos {
    departamento: Ubigeo;
    provincia: Ubigeo;
    distrito: Ubigeo ;
    constructor() {
        this.departamento = new Ubigeo();
        this.provincia = new Ubigeo();
        this.distrito = new Ubigeo()
    }
} 

export class ListaCronograma {
    departamento: Ubigeo;
    provincia: Ubigeo;
    distrito: Ubigeo;
    desde: string;
    hasta: string;
    constructor() {
        this.departamento = new Ubigeo();
        this.provincia = new Ubigeo();
        this.distrito = new Ubigeo()
    }
} 

export class Ubigeo  {
    id: string="";
    descripcion: string ="";
}