
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class DatosSolicitante {

    /************* */
    tipoPersona:    string;
    tipoDocumento:    TipoDocumentoModel;
    numeroDocumento:    string;
    nombresApellidosRazonSocial:    string;
    telefono:    string;
    celular:    string;
    correoElectronico:    string;
    domicilioLegal:    string;
    distrito:    string;
    provincia:    string;
    departamento:    string; 
    autorizacion:   string;
    representanteLegal: RepresentanteLegal;
    
    constructor(){
        this.representanteLegal = new RepresentanteLegal();
        this.tipoDocumento = new TipoDocumentoModel();
    }
}

export class RepresentanteLegal {
  
    //***********
    tipoDocumento:   TipoDocumentoModel;
    numeroDocumentoRepresentante:   string;
    apellidosyNombresRepresentante:   string;
    direccionRepresentante:    string;
    poderRegistrado:   string;
    asiento:    string;
    oficinaRegistral:    OficinaRegistral;
    
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistral();
    }
}




export class OficinaRegistral {
id:          number;
descripcion: string;
text: string;
}

export class HabilitacionProfesional {
    numeroColegiatura:                     string;
    colegioPrifesional:            string;
    

}






//SECCION 2
export class ServicioSolicitado {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa:   string;
}
//SECION 3
export class DeclaracionJurada {
   // flgAutorizacion: boolean;
    
apellidosNombresDeclaracion: string;
numeroDocumentodeclaracion: string;
tipoDocumentoDeclaracion: TipoDocumentoModel;
autorizacionDeclaracion: string;
constructor(){
    this.tipoDocumentoDeclaracion = new TipoDocumentoModel();
    // this.oficinaRegistral = new OficinaRegistral();
}

}


