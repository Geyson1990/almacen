export class Seccion1 {
    nro_solicitud: string;
    fecha_registro: string;
    nro_licencia: string;
    centro_emision: string;
    nombres: string;
    domicilio: string;
    distrito: string;
    provincia: string;
    region: string;
    documentoidentidad: string;
    numero: string;
    correo: string;
    telefono: string;   
    licenciaTipoA:string; 
}

export class Seccion2 {
    canjeDiplomatico: string;
    canjeMilitar: string;
    canjeExtranjero: string;
    modificacion:string;
}

export class Seccion3 {
    nombreES: string;
    certificadoES: string;
    fechaES: string;
    
    nombreEC: string;
    certificadoEC: string;
    fechaEC: string;
    
    nombreCE: string;
    certificadoCE: string;
    fechaCE: string;

    nombreHC: string;
    notaHC: string;
    fechaHC: string;
}

export class Seccion4 {
    acepto: boolean;
}