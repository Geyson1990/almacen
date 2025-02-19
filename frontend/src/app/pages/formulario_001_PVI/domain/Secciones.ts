export class Seccion1 {
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoFormulario: string;
  tipoSolicitud: TipoSolicitud;
  datosOperador: DatosOperador;
  datosSolicitante: DatosSolicitante;
  facturarA: FacturarA;
  datosSolicitud: DatosSolicitud;
  constructor() {
    this.tipoSolicitud = new TipoSolicitud();
    this.datosOperador = new DatosOperador();
    this.datosSolicitante = new DatosSolicitante();
    this.facturarA = new FacturarA();
    this.datosSolicitud = new DatosSolicitud();
  }
}

export class TipoSolicitud {
  opcionSeleccionada: string;
  esActualizacion: boolean;
  permisoVuelo: string;
}

export class DatosOperador {
  nombre: string;
  pais: string;
  idPais: string;
  domicilioLegal: string;
  telefono: string;
  email: string;
}

export class DatosSolicitante {
  nombre: string;
  fbo: string;
  cargo: string;
  telefono: string;
  email: string;
  notificar: boolean;
}

export class FacturarA {
  nombreORazonSocial: string;
  domicilioLegal: string;
  telefono: string;
  email: string;
}

export class DatosSolicitud {
  idAmbito: string;
  idTipoPermiso: string;
  idPermisoAmbito: string;
  tipoVuelo: string;
  idTipoVuelo: string;
  fechaPermisoInicio: string;
  fechaPermisoFin: string;
  cantidadDiasOperacion: number;
  numeroPasajero: string;
  adelantoDemora: string;
}

export class Seccion2 {
  flotaAutorizada: boolean;
  listaAeronave: Aeronave[];

  constructor() {
    this.listaAeronave = [];
  }
}

export class Aeronave {
  tipoAeronave: string;
  matricula: string;
  callSign: string;
  numeroVuelo: string;
}

export class Seccion3 {
  tripulacionAutorizada: boolean;
}

export class Seccion4 {
  listaInfoVuelo: InformacionVuelo[];

  constructor() {
    this.listaInfoVuelo = [];
  }
}

export class InformacionVuelo {
  origen: string;
  destino: string;
  fechaEntrada: string;
  fechaSalida: string;
}

export class Seccion5 {
  comentarios: string;
}

export class Seccion6 {
  declaracion1: boolean;
  declaracion2: boolean;
}
