import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { PaisResponse } from '../../../../core/models/Maestros/PaisResponse';

export class Anexo002_A17_3Request extends Anexo {
   metaData: MetaData;

   constructor() {
      super();
      this.metaData = new MetaData();
   }
}

export class MetaData {
   secciones: Secciones[];
   seccion8: Seccion8;
   codigoProcedimiento: string;
   constructor() {
      this.secciones = [];
      this.seccion8 = new Seccion8();
   }
}

export class Secciones {
   seccion1: Seccion1;
   seccion2: Seccion2;
   seccion3: Seccion3;
   seccion4: Seccion4;
   seccion5: Seccion5;
   seccion6: Seccion6;
   seccion7: Seccion7;
   constructor() {
      this.seccion1 = new Seccion1();
      this.seccion2 = new Seccion2();
      this.seccion3 = new Seccion3();
      this.seccion4 = new Seccion4();
      this.seccion5 = new Seccion5();
      this.seccion6 = new Seccion6();
      this.seccion7 = new Seccion7();
   }
}

export class Seccion1 {
   organizacion: string;
   ambito: string;
   documento: string;
   tramite: string;
   tipoVehiculo: string;
   numeroVehiculo: number;
   fabricante: string;
   pesoBruto: string;
   trocha: string;
   anioFabricacion: string;
   capacidad: string;
}

export class Seccion2 {
   motorDiesel: string;
   marcaSistemaMecanico: string;
   anioFabricacion: string;
   potencia: string;
   modelo: string;
   cilindro: number;
   sobrealimentacion: string;
   rotacionMaxima: string;
   sobrevelocidad: string;
   bajaPresion: string;
   ultimaFechaReparacion: string;
   ultimaFechaMantenimiento: string;
   condicionGeneral: string
}

export class Seccion3 {
   marcaSistemaElectrico: string;
   modelo: string;
   numeroPolos: string;
   ultimaFechaReparacion: string;
   ultimaFechaMantenimiento: string;
   condicionGeneralAlternador: number;
   marcaMotor: string;
   modeloMotor: string;
   polosMotor: string;
   ultimaFechaReparacionMotor: string;
   ultimaFechaMantenimientoMotor: string;
   condicionGeneralMotor: string;
   mandoControl: string;
   contactoresRelay: string;
   cablesElectricos: string;
   bateria: string
   frenoDinamico: string;
   alarma: string;
   verificacionTierra: string;
   iluminacion: string;
   velocimetro: string;
   condicionGeneralMandoControl: string;
}

export class Seccion4 {
   marcaSistemaNeumatico: string;
   modelo: string;
   tipo: string;
   capacidad: string;
   velocidad: string;
   valvulaAlivio: number;
   ultimaFechaReparacion: string;
   ultimaFechaMantenimiento: string;
   condicionGeneral: string;
   valvulaFreno: string;
   controlAlerta: string;
   sobreVelocidad: string;
   pruebaFugas: string;
   estadoAire: string;
   valvulaSeguridad: string;
   ultimaFechaReparacionFreno: string;
   ultimaFechaMantenimientoFreno: string;
}

export class Seccion5 {
   estadoCabina: string;
   estadoVidrios: string;
   estadoCampana: string;
   estadoBaranda: string;
   estadoCarroceria: string;
   estadoAsiento: number;
   estadoCocina: string;
   tipoBanio: string;
   estadoBanio: string;
   estadoPuertas: string;
   extinguidores: string;
   condicionGeneral: string;
   estadoBastidor: string;
   estadoTrompa: string;
   estadoEnganche: string;
   condicionGeneralBastidor: string;
   resultadoPotencia: string;
   resultadoFrenado: string;
   resultadoAceleracion: string;
}


export class Seccion6 {
   numeroEjes: string;
   numeroBoggies: string;
   estadoPlatoCentro: string;
   estadoApoyoLateral: string;
   estadoRuedas: string;
   diametroRuedas: number;
   estadoPestanas: string;
   ultimaFechaReparacion: string;
   ultimaFechaMantenimiento: string;
   condicionGeneral: string;
}

export class Seccion7 {
   directo: string;
   automatico: string;
   independiente: string;
   parqueo: string;
   condicionGeneral: string;
   evaluacionFinal: number;
   comentario: string;
   evaluador: string
}

export class Seccion8 {
   tipoDocumentoSolicitante: string;
   nombreTipoDocumentoSolicitante: string;
   numeroDocumentoSolicitante: string;
   nombresApellidosSolicitante: string;
}