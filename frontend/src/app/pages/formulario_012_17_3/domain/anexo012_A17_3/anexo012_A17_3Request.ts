import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo012_A17_3Request extends Anexo {
    formularioId: number;
    anexoId: number;
    codigo: string;
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
  
    Documento_Identidad: string;
    Nombres_Apellidos: string;
    Domicilio_Legal: string;
    Region:string;
    Provincia:string;
    Distrito:string;
    Grado_Militar: string;
    Vigencia_Licencia_Conducir: string;
    Fecha_Caducidad: string;
    telefono: string;
    celular: string;
    correo: string;
    Numero_Certificado_Salud: string;
    Fecha_Certificado: string;


    nro_resolucion: string;
    fecha_resolucion: string;

}

export class Seccion2 {
    Vehiculo_Transmision_automatica: boolean;
    Vehiculo_acondicionado: boolean;
    Con_lentes: boolean;
    Con_Audifonos: boolean;
    Con_espejos_laterales: boolean;
    Sin_restricciones: boolean;
}

export class Seccion3 {
    Factor_grupo_sanguineo: string;
    PostulaLicencia:boolean;
}

export class Seccion4 {
    aceptacion: boolean;
}