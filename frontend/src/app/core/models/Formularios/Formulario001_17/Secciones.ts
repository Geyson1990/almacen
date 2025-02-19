
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class DatosSolicitante {
    ruc:                string;
    razonSocial:        string;
    domicilio:          string;
    distrito:           string;
    provincia:          string;
    departamento:       string;
    telefonoFax:        string;
    celular:            string;
    correoElectronico:  string;
    marcadoObligatorio: boolean;
    representanteLegal: RepresentanteLegal;
    constructor(){
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class RepresentanteLegal {
    nombres:                     string;
    apellidoPaterno:            string;
    apellidoMaterno:            string;
    tipoDocumento:               TipoDocumentoModel;
    numeroDocumento:             string;
    domicilioRepresentanteLegal: string;
    nroPartida:                  string;
    oficinaRegistral:            OficinaRegistralModel;
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

// export class OficinaRegistral {
//     id:          number;
//     descripcion: string;
// }

//SECCION 2
export class ServicioSolicitado {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa:   string;
}
//SECION 3
export class DeclaracionJurada {
    documentoSolicitante: string;
    nombreSolicitante: string;
    declaracionJurada:boolean;
}


