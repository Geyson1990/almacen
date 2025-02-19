
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa: string;
    especificacion: string;
    listaAeronave: Aeronave[];
    datosOma: DatosOma;

    constructor() {
        this.listaAeronave = [];
        this.datosOma = new DatosOma();
    }
}

export class Aeronave {
    modelo: string;
    matricula: string;
    nroSerie: string;
}

export class DatosOma {
    domicilioLegal: string;
    distrito: string;
    provincia: string;
    departamento: string;
}

export class Seccion2 {
    notificaCorreo: boolean;
}

export class Seccion3 {
    tipoSolicitante: string;
    nombresApellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    ruc: string;
    razonSocial: string;
    domicilioLegal: string;
    distrito: string;
    provincia: string;
    departamento: string;
    telefono: string;
    celular: string;
    email: string;
    representanteLegal: RepresentanteLegal;

    constructor() {
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class RepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    domicilioLegal: string;
    oficinaRegistral: OficinaRegistralModel;
    partida: string;
    asiento: string;
    distrito: string;
    provincia: string;
    departamento: string;
    cargo: string;

    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class Seccion5 {
    declaracion1: boolean;
    declaracion2: boolean;
}

export class Seccion6 {
    dni: string;
    nombre: string;
}

export class Seccion7 {
    itinerario: string;
}
