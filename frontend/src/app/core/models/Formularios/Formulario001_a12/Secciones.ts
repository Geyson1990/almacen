import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class DatosSolicitante {
    nombres:            string;
    apellidoPaterno:    string;
    apellidoMaterno:    string;
    tipoDocumento:      TipoDocumentoModel;
    numeroDocumento:    string;
    domicilio:          string;
    distrito:           string;
    provincia:          string;
    departamento:       string;
    ruc:                string;
    telefono:           string;
    celular:            string;
    correoElectronico:  string;
    marcadoObligatorio: string;
    peso:               number;
    estatura:           number;
    colorOjos:          string;
    colorCabellos:      string;
    nacionalidad:       string;
    fechaNacimiento:    string;
    tipoLicencia:       TipoLicencia;
    nroLicencia:        string;

    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.tipoLicencia = new TipoLicencia();
    }
}


export class TipoLicencia {
    id:          number;
    descripcion: string;
}

export class DeclaracionJurada {
    flgAutorizacion: number;
}

// export class DerechoTramite {
//     nroReciboAcotacion:      string;
//     nroOperacionBancoNacion: string;
//     fechaDePago:             Date;
// }

export class ServicioSolicitado {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa:   string;
    flgProcedimientoTupa:    number;
    descFlg:                 string;
    especificacionRequerida: string;
}
