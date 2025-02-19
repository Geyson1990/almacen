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
    telefonoFax:        string;
    celular:            string;
    correoElectronico:  string;
    marcadoObligatorio: number;
    representanteLegal: RepresentanteLegal;

    constructor(){
        this.tipoPersona = new TipoPersona();
        this.tipoDocumento = new TipoDocumentoModel();
        this.representanteLegal = new RepresentanteLegal();

    }
  }

  export class RepresentanteLegal {
    nombres:                     string;
    apellidoPaterno:             string;
    apellidoMaterno:             string;
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

  export class OficinaRegistral {
    id:          number;
    descripcion: string;
  }


  export class TipoPersona {
    id:          number;
    descripcion: string;
  }

  export class DeclaracionJurada {
    flgAutorizacion: number;
  }

  export class ServicioSolicitado {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa:   string;
  }
