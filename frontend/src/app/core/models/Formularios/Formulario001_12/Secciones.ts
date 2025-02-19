
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1{
    Dsa_001_1: string;
    Dsa_001_2: string;
    Dsa_003: string;
    Dsa_005: string;
    S_dgac_001: string;
    S_dsa_001: string;
    TipoSolicitud: string;
    TipoLicencia: string;

    NroOficioEvalTeorica: string;
    NroOficioEvalPractica: string;
    NroOficioEvalCompetencia: string;
}

export class Seccion2 {
  modalidadNotificacion:string
}

export class Seccion3 {
    TipoSolicitante:    string;
    NombresApellidos:   string;
    TipoDocumento:      string;
    NumeroDocumento:    string;
    Ruc:                string;
    DomicilioLegal:     string;
    Distrito:           string;
    Provincia:          string;
    Departamento:       string;
    Telefono:           string;
    Celular:            string;
    Email:              string;
    Peso:               string;
    Estatura:           string;
    ColorOjos:          string;
    ColorCabello:       string;
    Nacionalidad:       string;
    FechaNacimiento:    string;
    RegistroLicencia:   string;
    NumeroLicencia:     string;
    Notificacion:       string;
}

export class Seccion5 {
    declaracion_1:boolean;
    declaracion_2:boolean;
}

export class Seccion6 {
    dni: string;
    nombre:string
}
