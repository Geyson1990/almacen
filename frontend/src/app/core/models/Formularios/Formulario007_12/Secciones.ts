
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1{
    dgac_020: string;
    dgac_021: string;
    dgac_022: string;
    dgac_023: string;
    s_dgac_009: string;

    memoria: boolean;
    estudio: boolean;
    certificado: boolean;
    pathNameMemoriaDescriptiva: string;
    pathNameImpactoAmbiental: string;
    pathNameHabilidadProfesional: string;
    fileMemoriaDescriptiva: File;
    fileImpactoAmbiental: File;
    fileHabilidadProfesional: File;
    profesional_nombre: string;
    profesional_profesion: string;
    profesional_colegiatura: string;

    aerodromo_publico: boolean;
    aerodromo_privado: boolean;
    aerodromo_partida: string;
    aerodromo_oficina: OficinaRegistralModel;
    aerodromo_asiento: string;

    aerodromo_oficio: string;
    constructor(){
        this.aerodromo_oficina = new OficinaRegistralModel();
    }
}

export class Seccion2{
  modalidadNotificacion: string;
}

export class Seccion3 {
    tipoSolicitante:    string;
    nombresApellidos:   string;
    tipoDocumento:      string;
    numeroDocumento:    string;
    ruc:                string;
    razonSocial:        string;
    domicilioLegal:     string;
    distrito:           string;
    provincia:          string;
    departamento:       string;
    telefono:           string;
    celular:            string;
    email:              string;
    representanteLegal: RepresentanteLegal;
    constructor(){
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class RepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento:string;
    domicilioLegal: string;
    oficinaRegistral:   OficinaRegistralModel;
    partida:   string;
    asiento:   string;
    distrito:  string;
    provincia: string;
    departamento:string;
    cargo: string;
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class Seccion5 {
    declaracion_1:boolean;
    declaracion_2:boolean;
}

export class Seccion6 {
    dni: string;
    nombre:string
}
