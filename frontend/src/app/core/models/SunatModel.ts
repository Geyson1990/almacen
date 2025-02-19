export class RepresentanteLegal {
    tipoDocumento: string;
    descDocumento: string;
    nroDocumento: string;
    nombresApellidos: string;
    cargo: string;
}

export class SunatDatosPrincipalesModel {
    nroDocumento: string;
    razonSocial: string;
    domicilioLegal: string;
    codDepartamento: string;
    codProvincia: string;
    codDistrito: string;
    codUbigeo: string;
    nombreDepartamento: string;
    nombreProvincia: string;
    nombreDistrito: string;
    telefono: string;
    celular: string;
    correo: string;
    desc_estado: string;
    esActivo: boolean;
    esHabido: boolean;
    CIIU: string;
    ActividadPrincipal: string;
    tipoEmpresa: string;
    ciiu2: string;
    ciiu3: string;
    ciiu2_desc: string;
    ciiu3_desc: string;
    representanteLegal: RepresentanteLegal[];
    constructor(){
        this.representanteLegal = [];
    }
}

export class ListaRepLegal {
    cod_cargo: string;
    cod_depar: string;
    desc_docide: string;
    num_ord_suce: string;
    rso_cargoo: string;
    rso_docide: string;
    rso_fecact: string;
    rso_fecnac: string;
    rso_nombre: string;
    rso_nrodoc: string;
    rso_numruc: string;
    rso_userna: string;
    rso_vdesde: string;
}

export class getRepLegalesResponse {
    ListaRepLegal: ListaRepLegal[];
    constructor(){
        this.ListaRepLegal = [];
    }
}

export class SunatRepresentantesModel {
    getRepLegalesResponse: getRepLegalesResponse;
}
