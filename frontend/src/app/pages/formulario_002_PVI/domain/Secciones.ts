export class Seccion1 {
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoFormulario: string;
  datosOperador: DatosOperador;
  datosSolicitante: DatosSolicitante;
  facturarA: FacturarA;
  datosSolicitud: DatosSolicitud;
  constructor() {
    this.datosOperador = new DatosOperador();
    this.datosSolicitante = new DatosSolicitante();
    this.facturarA = new FacturarA();
    this.datosSolicitud = new DatosSolicitud();
  }
}

export class DatosOperador {
  nombre: string;
  pais: string;
  idPais: number;
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
  idAmbito: number;
  idTipoPermiso: number;
  idPermisoAmbito: number;
  tipoVuelo: string;
  idTipoVuelo: number;
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
  listaTripulacion: Tripulacion[];

  constructor() {
    this.listaTripulacion = [];
  }
}

export class Tripulacion {
  nombre: string;
  cargo: string;
  nacionalidad: string;
}

export class Seccion4 {
  listaInfoVuelo: InformacionVuelo[];

  constructor() {
    this.listaInfoVuelo = [];
  }
}

export class InformacionVuelo {
  rutaPlanificada: string;
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
