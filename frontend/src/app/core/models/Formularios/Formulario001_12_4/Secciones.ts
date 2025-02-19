
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1{
    Dsa_002: string;
    Dsa_004: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Nombres: string;
    Pasaporte: string;
    Nacionalidad: string;
    FechaNacimiento: string;
    Licencia: string;
    Habilitacion: string;
    NumeroHabilitacion: string;
    NumeroMeses: string;
    TipoAeronave: string;
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
