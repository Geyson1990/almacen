import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
export class DatosSolicitante {
    tipoPersona:        TipoPersona;
    tipoDocumento:      TipoDocumentoModel;
    numeroDocumento:    string;
    nomRazNomCom:       string;
    domicilio:          string;
    distrito:           string;
    provincia:          string;
    departamento:       string;
    telefono:           string;
    celular:            string;
    correoElectronico:  string;
    marcadoObligatorio: number;
    representanteLegal: RepresentanteLegal;
    listaAeronave:      ListaAeronave[];

    constructor(){
        this.tipoPersona = new TipoPersona();
        this.tipoDocumento = new TipoDocumentoModel();
        this.representanteLegal = new RepresentanteLegal();
        this.listaAeronave = [];
    }
}

export class ListaAeronave {
    // idAeronave: number;
    modelo:     string;
    matricula:  string;
    nroSerie:   string;
}

export class RepresentanteLegal {
    nombres:                     string;
    apellidoPaterno:             string;
    apellidoMaterno:             string;
    tipoDocumento:               TipoDocumentoModel;
    numeroDocumento:             string;
    domicilioRepresentanteLegal: string;
    telefonoFax:                 string;
    celularR:                    string;
    correoElectronicoR:          string;
    nroPartida:                  string;
    oficinaRegistral:            OficinaRegistralModel;
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class OficinaRegistral {
    id:          number;
    descripcion: string;
}


export class TipoPersona {
    id:          number;
    descripcion: string;
}

export class ServicioSolicitado {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa:   string;
    especificacionRequerida: string;
    datosInspeccion:         DatosInspeccion;
    constructor(){
        this.datosInspeccion = new DatosInspeccion();
    }
}

export class DatosInspeccion {
    itinerarioVuelo: string;
}
