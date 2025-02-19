import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbAccordionDirective, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { Anexo003_A17_2Request } from '../../../domain/anexo003_A17_2/anexo003_A17_2Request';
import { Anexo003_A17_2Response } from '../../../domain/anexo003_A17_2/anexo003_A17_2Response';
import { Anexo003_A17_2Service } from '../../../application/usecases';
import { A003_A172_Seccion_Itinerario, A003_A172_Seccion_Renat, ModalidadServicio, DatosLocal, Vehiculo, Conductor, Condicion, Opciones } from '../../../domain/anexo003_A17_2/anexo003_A17_2Request';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { PropietarioModel } from 'src/app/core/models/PlacaRodajeModel';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { Ruta } from 'src/app/core/models/renat';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { stringToDate } from 'src/app/helpers/functions';

@Component({
   // tslint:disable-next-line: component-selector
   selector: 'app-anexo003_a17_2',
   templateUrl: './anexo003_a17_2.component.html',
   styleUrls: ['./anexo003_a17_2.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo003_a17_2_Component implements OnInit, AfterViewInit {

   fileToUpload: File;
   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective;
   @ViewChild('ubigeoCmp') ubigeoComponent: UbigeoComponent;


   graboUsuario = false;
   uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   idAnexo: number;
   ruta: any = null;
   tipoDocumentoSolicitante: string;
   nombreTipoDocumentoSolicitante: string;
   numeroDocumentoSolicitante: string;
   nombresApellidosSolicitante: string;

   rucSolicitante: string;
   partida: string = "";

   public formAnexo: UntypedFormGroup;
   public vehiculos: Vehiculo[] = [];
   public recordIndexToEdit: number;

   public conductores: Conductor[] = [];
   public recordIndexToEditConductores: number;

   public rutas: Ruta[] = [];

   public mensajeClasificacionVehicular: string;

   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "01", documento: 'DNI' },
      { id: "04", documento: 'Carnet de Extranjería' },
      { id: "05", documento: 'Carnet de Permiso Temp. Perman.' },
      { id: "06", documento: 'Permiso Temporal de Permanencia' },
   ];

   listaCategoriaLicencias: Opciones[] = [
      { value: "A IIa", text: 'A IIa', id: 1 },
      { value: "A IIb", text: 'A IIb', id: 2 },
      { value: "A IIIa", text: 'A IIIa', id: 3 },
      { value: "A IIIb", text: 'A IIIb', id: 4 },
      { value: "A IIIc", text: 'A IIIc', id: 5 },
      { value: "B IIc", text: 'B IIc', id: 6 },
      { value: "A I", text: 'A I', id: 7 },
   ];

   filePdfCafPathName: string = null;
   filePdfCaoPathName: string = null;
   filePdfCertPathName: string = null;
   filePdfCelPathName: string = null;

   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   codigoTipoSolicitud: string;
   descTipoSolicitud: string;

   codigoTipoSolicitudTupa: string;  //usado para las validaciones
   descTipoSolicitudTupa: string;

   propietarios: PropietarioModel[];

   anexoDJ: string = "";
   filePdfCafSeleccionado: any = null;
   filePdfCaoSeleccionado: any = null;
   filePdfCertSeleccionado: any = null;
   filePdfCelSeleccionado: any = null;
   valCaf = 0;
   valCao = 0;
   valCert = 0;
   valCel = 0;
   public visibleButtonCao: boolean;
   public visibleButtonCaf: boolean;
   public visibleButtonCert: boolean;
   public visibleButtonCel: boolean;
   public visibleButtonAnexo: boolean;

   visibleControlCert: boolean;
   visibleControlCel: boolean;

   esPropietario: boolean = true;

   categoriaVehiculo: string;
   habilitarFlotaV = true;

   listaDepartamentos: any = [];
   listaProvincias: any = [];
   listaDistritos: any = [];

   fechaIni = '';
   fechaFin = '';

   tipoPersona: number;
   dniPersona: string;
   ruc: string;

   idDep: number;
   idProv: number;
   reqAnexo: number;
   movIdAnexo: number;
   codAnexo: string;

   servicioSnc: boolean = true;

   txtOpcional = '(OPCIONAL)';

   listaModalServicio: ModalidadServicio[] = [
      { id: 1, descripcion: 'Estandar' },
      { id: 2, descripcion: 'Diferenciada' },
   ];

   listaCondicion: Condicion[] = [
      { tipoCondicion: "R", nombreCondicion: 'Reserva' },
      { tipoCondicion: "O", nombreCondicion: 'Operativa' },
   ];

   listaPlacaNumero: string[] = []

   visibleControlRuta = false;
   PlacaPerteneceRuta: boolean = false;

   paRelacionConductores: string[] = ['DSTT-027', 'DSTT-026', 'DSTT-031', 'DSTT-033', 'DSTT-034', 'DSTT-035', 'DSTT-036', 'DSTT-032', 'DSTT-037', 'DSTT-038', 'DSTT-039', 'DSTT-040']; // PROCEDIMIENTOS QUE NO NECESITAN REGISTRASE
   paInstalacionAdministrativa: string[] = ['DSTT-029', 'DSTT-030', 'DSTT-031'];

   paRenat: string[] = ['DSTT-029', 'DSTT-031'];
   paValidaLicenciaConductor: string[] = ['DSTT-029'];
   paValidaContratoComunicacion: string[] = ['DSTT-025', 'DSTT-029', 'DSTT-032', 'DSTT-035'];
   paValidaFlotaVehicular: string[] = ['DSTT-027', 'DSTT-037', 'DSTT-040']; /* PA cuyas placas vehiculares deben ser validadas si pertenecen a la flota vehicular registrada en RENAT*/
   paValidarCarroceria_G1: string[] = ['DSTT-032', 'DSTT-033', 'DSTT-034', 'DSTT-035'];
   paValidarCarroceria_G2: string[] = ['DSTT-036', 'DSTT-037', 'DSTT-038', 'DSTT-039', 'DSTT-040'];
   /*Respecto a las autorizaciones de empresas que cuenta con permiso para el transporte regular con categoría M2: */
   paEmpresaM2: string[] = ['DSTT-032'];
   rucEmpresasM2: string[] = ['20368880320', '20479927619'];
   categoriaM2Personal = false;

   opcionalRelacionConductores = true;
   opcionalInstalacionAdministrativa = true;
   opcionalCategoriaM1 = true;
   opcionalRenat = true;
   opcionalValidaFlotaVehicular = true;
   opcionalValidaLicenciaConductor = true;


   paSeccion1: string[] = ['DSTT-025', 'DSTT-026', 'DSTT-027'];
   paSeccion2: string[] = ['DSTT-035'];
   paSeccion3: string[] = ['DSTT-025', 'DSTT-027', 'DSTT-028', 'DSTT-029', 'DSTT-030', 'DSTT-032', 'DSTT-033', 'DSTT-034', 'DSTT-035', 'DSTT-036', 'DSTT-037', 'DSTT-038', 'DSTT-039', 'DSTT-040'];
   paSeccion4: string[] = ['DSTT-025', 'DSTT-028', 'DSTT-029', 'DSTT-030'];
   paSeccion5: string[] = ['DSTT-031'];

   habilitarSeccion1 = true;
   habilitarSeccion2 = true;
   habilitarSeccion3 = true;
   habilitarSeccion4 = true;
   habilitarSeccion5 = true;

   /* Campos seccion 1 */
   txtItinerario: boolean = true;
   txtFechaPartida: boolean = true;
   txtFechaLlegada: boolean = true;
   txtVias: boolean = true;
   txtEscalasComerciales: boolean = true;
   txtEstaciones: boolean = true;
   txtFrecuencias: boolean = true;
   txtModalidadServicio: boolean = true;
   txtDistancia: boolean = true;
   txtHorasSalida: boolean = true;
   txtClaseServicio: boolean = true;
   txtTiempoAproxViaje: boolean = true;
   /**/

   fechaHoy: Date = new Date();

   paTipoSolicitud = [{ pa: 'DSTT-039', tipoSolicitud: '3', seccion: '1' }];

   serviciosCitv = [
      { tipoServicio: '1', nomServicio: 'TRANSPORTE REGULAR DE PERSONAS' },
      { tipoServicio: '2', nomServicio: 'TRANSPORTE PRIVADO DE PERSONAS' },
      { tipoServicio: '3', nomServicio: 'TRANSPORTE ESPECIAL DE PERSONAS - TURÍSTICO' },
      { tipoServicio: '4', nomServicio: 'TRANSPORTE ESPECIAL DE PERSONAS - TRABAJADORES' },
      { tipoServicio: '9', nomServicio: 'TRANSPORTE DE MERCANCÍAS EN GENERAL PÚBLICO' },
      { tipoServicio: '10', nomServicio: 'TRANSPORTE DE MERCANCÍAS PRIVADO' },
      { tipoServicio: '11', nomServicio: 'TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS' },
   ];

   paTipoServicio = [
      { pa: 'DSTT-025', tipoSolicitud: '0', tipoServicio: '1', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-026', tipoSolicitud: '0', tipoServicio: '1', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-027', tipoSolicitud: '0', tipoServicio: '1', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '3', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE TURISMO
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '4', anexoCopropietario: "" }, // CITV PERMISO ESPECIAL TRABAJADORES
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '2', anexoCopropietario: "" }, // CITV PERMISO PRIVADO DE PERSONAS
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '9', anexoCopropietario: "Anexo 2 - Modelo DJ Copropiedad DSTT-033.pdf" }, // CITV PERMISO MERCANCIA EN GENERAL
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '10', anexoCopropietario: "Anexo 3 - Modelo DJ Copropiedad DSTT-034.pdf" }, // CITV PERMISO MERCANCIA PRIVADO
      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '3', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE TURISMO
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '4', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE TRABAJADORES
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '6', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE SOCIAL
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '2', anexoCopropietario: "" }, // CITV PERMISO PRIVADO DE PERSONAS
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '9', anexoCopropietario: "Anexo 1 - Modelo DJ Copropiedad DSTT-032.pdf" }, // CITV PERMISO MERCANCIAS EN GENERAL
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '10', anexoCopropietario: "Anexo 4 - Modelo DJ Copropiedad DSTT-032.pdf" }, // CITV PERMISO MERCANCIAS PRIVADO

      { pa: 'DSTT-035', tipoSolicitud: '1', tipoServicio: '1', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-035', tipoSolicitud: '2', tipoServicio: '3', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE TURISMO
      { pa: 'DSTT-035', tipoSolicitud: '3', tipoServicio: '4', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE TRABAJADORES
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '6', anexoCopropietario: "" }, // CITV PERMISO REGULAR DE SOCIAL
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '2', anexoCopropietario: "" }, // CITV PERMISO PRIVADO DE PERSONAS
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '9', anexoCopropietario: "" }, // CITV PERMISO MERCANCIAS EN GENERAL
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '10', anexoCopropietario: "" }, // CITV PERMISO MERCANCIAS PRIVADO

      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '11', anexoCopropietario: "" }, // CITV PERMISO TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '11', anexoCopropietario: "" }, // CITV PERMISO TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '11', anexoCopropietario: "" }, // CITV PERMISO TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '11', anexoCopropietario: "" }, // CITV PERMISO TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '11', anexoCopropietario: "" }, // CITV PERMISO TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '11', anexoCopropietario: "" }, // CITV PERMISO TRANSPORTE DE MATERIALES Y RESIDUOS SOLIDOS
   ];
   tipoServicio = '';

   paCantidadVehiculos = [
      { pa: 'DSTT-025', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-026', tipoSolicitud: '0', cantidadMinima: 0 }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-027', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-028', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE TURISMO
      { pa: 'DSTT-029', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO ESPECIAL TRABAJADORES
      { pa: 'DSTT-030', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO PRIVADO DE PERSONAS
      { pa: 'DSTT-033', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO MERCANCIA EN GENERAL
      { pa: 'DSTT-034', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO MERCANCIA PRIVADO
      { pa: 'DSTT-032', tipoSolicitud: '1', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-032', tipoSolicitud: '2', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE TURISMO
      { pa: 'DSTT-032', tipoSolicitud: '3', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE TRABAJADORES
      { pa: 'DSTT-032', tipoSolicitud: '4', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE SOCIAL
      { pa: 'DSTT-032', tipoSolicitud: '5', cantidadMinima: 1 }, // CITV PERMISO PRIVADO DE PERSONAS
      { pa: 'DSTT-032', tipoSolicitud: '6', cantidadMinima: 1 }, // CITV PERMISO MERCANCIAS EN GENERAL
      { pa: 'DSTT-032', tipoSolicitud: '7', cantidadMinima: 1 }, // CITV PERMISO MERCANCIAS PRIVADO
      { pa: 'DSTT-035', tipoSolicitud: '1', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE PERSONAS
      { pa: 'DSTT-035', tipoSolicitud: '2', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE TURISMO
      { pa: 'DSTT-035', tipoSolicitud: '3', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE TRABAJADORES
      { pa: 'DSTT-035', tipoSolicitud: '4', cantidadMinima: 1 }, // CITV PERMISO REGULAR DE SOCIAL
      { pa: 'DSTT-035', tipoSolicitud: '5', cantidadMinima: 1 }, // CITV PERMISO PRIVADO DE PERSONAS
      { pa: 'DSTT-035', tipoSolicitud: '6', cantidadMinima: 1 }, // CITV PERMISO MERCANCIAS EN GENERAL
      { pa: 'DSTT-035', tipoSolicitud: '7', cantidadMinima: 1 }, // CITV PERMISO MERCANCIAS PRIVADO
      { pa: 'DSTT-036', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO MERCANCIAS PRIVADO
      { pa: 'DSTT-037', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO RESIDUOS PELIGROSOS
      { pa: 'DSTT-038', tipoSolicitud: '1', cantidadMinima: 1 }, // CITV PERMISO RESIDUOS PELIGROSOS
      { pa: 'DSTT-038', tipoSolicitud: '2', cantidadMinima: 1 }, // CITV PERMISO RESIDUOS PELIGROSOS
      { pa: 'DSTT-039', tipoSolicitud: '0', cantidadMinima: 1 }, // CITV PERMISO RESIDUOS PELIGROSOS
      { pa: 'DSTT-040', tipoSolicitud: '1', cantidadMinima: 1 }, // CITV PERMISO RESIDUOS PELIGROSOS
   ]
   cantidadVehiculo = 0;

   /*validacion categoria vehicular, peso y SERVICIO EMPRESA*/
   /*
   1	Servicio de Transporte de Pasajeros Nacional Regular
   2	Servicio de Transporte de Pasajeros Nacional Turístico
   5	Servicio de Transporte de Trabajadores por Carretera Nacional
   10	Servicio de Transporte de Pasajeros Nacional Privado
   12	Servicio de Transporte de Mercancías Publico
   13	Servicio de Transporte de Mercancías Privado
   14 Servicio de Transporte de Materiales y/o Residuos Peligrosos Publico
   15 Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado
   20	Servicio de Transporte de Pasajeros Nacional Social
   14	Servicio de Transporte de Materiales y/o Residuos Peligrosos Publico
   15	Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado
 
   */
   paTipoServicioEmpresa = [
      { pa: 'DSTT-027', tipoSolicitud: '0', tipoServicio: '1', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Regular', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', nomServicio: 'Servicio de Transporte Público de Mercancías en general', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: 'DSTT-034', tipoServicioExcluyente: '13', preText: 'prestar', exonerarFechaFin: false },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', nomServicio: 'Actividad Privada de Transporte de Mercancías', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: 'DSTT-033', tipoServicioExcluyente: '12', preText: 'realizar la', exonerarFechaFin: true },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Público', diasPrevios: 60, maxDiasPrevios: 120, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Público', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '15', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '15', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '15', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado', diasPrevios: 60, maxDiasPrevios: 120, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false },
   ];

   paPeso = [
      { pa: 'DSTT-025', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 8.5 },
      { pa: 'DSTT-025', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3C3', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 8.5 },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M1', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },

      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '5', servicio: '', categoria: 'M3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '5', servicio: '', categoria: 'M3C3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '20', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '20', servicio: '', categoria: 'M2C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      //{pa:'DSTT-029', tipoSolicitud:'0', tipoServicio:'20', servicio:'', categoria:'M2C2', restriccionPeso:'No', pesoMinimoBruto:0, pesoMinimoSeco:0},

      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M1', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2C1', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2C2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3C1', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3C2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },

      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M3', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 8.5 },
      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M3C3', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 8.5 },
      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M2C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },

      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M1', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M2C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M3C3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },

      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '20', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '20', servicio: '', categoria: 'M2C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M3C3', restriccionPeso: 'Si', pesoMinimoBruto: 5, pesoMinimoSeco: 0 },

      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M1', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C3', restriccionPeso: 'No', pesoMinimoBruto: 0, pesoMinimoSeco: 0 },

      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N2', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 12 },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N3', restriccionPeso: 'Si', pesoMinimoBruto: 12, pesoMinimoSeco: 0 },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O1', restriccionPeso: 'Si', pesoMinimoBruto: 0, pesoMinimoSeco: 0.75 },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O2', restriccionPeso: 'Si', pesoMinimoBruto: 0.75, pesoMinimoSeco: 3.5 },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O3', restriccionPeso: 'Si', pesoMinimoBruto: 3.5, pesoMinimoSeco: 10 },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O4', restriccionPeso: 'Si', pesoMinimoBruto: 10, pesoMinimoSeco: 0 },

   ] /* No se usa para el DSTT-036*/

   paCategoria = [
      { pa: 'DSTT-025', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-025', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3C3' },
      { pa: 'DSTT-026', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-026', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3C3' },
      { pa: 'DSTT-027', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-027', tipoSolicitud: '0', tipoServicio: '1', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M1' },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-028', tipoSolicitud: '0', tipoServicio: '2', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '5', servicio: '', categoria: 'M2' },
      //{pa:'DSTT-029', tipoSolicitud:'0', tipoServicio:'5', servicio:'', categoria:'M2C2'},
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '5', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '5', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '5', servicio: '', categoria: 'M3C3' },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '20', servicio: '', categoria: 'M2' },
      //{pa:'DSTT-029', tipoSolicitud:'0', tipoServicio:'20', servicio:'', categoria:'M2C2'},
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '20', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '20', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-029', tipoSolicitud: '0', tipoServicio: '20', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M1' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2C1' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2C2' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3C1' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3C2' },
      { pa: 'DSTT-030', tipoSolicitud: '0', tipoServicio: '10', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-033', tipoSolicitud: '0', tipoServicio: '12', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-034', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-032', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M1' },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-032', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-032', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-032', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M1' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C1' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C2' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C1' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C2' },
      { pa: 'DSTT-032', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-032', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-032', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-035', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-035', tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-035', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M1' },
      { pa: 'DSTT-035', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-035', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-035', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-035', tipoSolicitud: '2', tipoServicio: '2', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-035', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-035', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-035', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-035', tipoSolicitud: '3', tipoServicio: '5', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '5', servicio: '', categoria: 'M3C3' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-035', tipoSolicitud: '4', tipoServicio: '20', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M1' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C1' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C2' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M2C3' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C1' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C2' },
      { pa: 'DSTT-035', tipoSolicitud: '5', tipoServicio: '10', servicio: '', categoria: 'M3C3' },

      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-035', tipoSolicitud: '6', tipoServicio: '12', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-035', tipoSolicitud: '7', tipoServicio: '13', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-036', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-037', tipoSolicitud: '0', tipoServicio: '14', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-038', tipoSolicitud: '1', tipoServicio: '14', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-038', tipoSolicitud: '2', tipoServicio: '13', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-039', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O4' },

      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N1' },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N2' },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'N3' },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O1' },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O2' },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O3' },
      { pa: 'DSTT-040', tipoSolicitud: '0', tipoServicio: '13', servicio: '', categoria: 'O4' },

   ]


   constructor(
      public modalClasVehicular: NgbModal,
      private fb: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private modalService: NgbModal,
      private vehiculoService: VehiculoService,
      private anexoService: Anexo003_A17_2Service,
      public activeModal: NgbActiveModal,
      private anexoTramiteService: AnexoTramiteService,
      private formularioTramiteService: FormularioTramiteService,
      private ubigeoService: UbigeoService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private renatService: RenatService,
      private seguridadService: SeguridadService,
      private mtcService: MtcService,
   ) {
      this.propietarios = [];
      this.idAnexo = 0;
      this.vehiculos = [];
      this.recordIndexToEdit = -1;
      this.conductores = [];
      this.recordIndexToEditConductores = -1;
      this.filePdfCafSeleccionado = null;
      this.filePdfCelSeleccionado = null;
      this.visibleButtonCao = false;
      this.visibleButtonCaf = false;
      this.visibleButtonCert = false;
      this.visibleButtonCel = false;
      this.visibleButtonAnexo = false;
      this.visibleControlCert = false;
      this.visibleControlCel = false;
      this.mensajeClasificacionVehicular = `CLASIFICACIÓN VEHICULAR
    Categoría M: Vehículos automotores de cuatro ruedas o más diseñados y construidos para el transporte de pasajeros.
    M1 : Vehículos de ocho asientos o menos, sin contar el asiento del conductor.
    M2 : Vehículos de más de ocho asientos, sin contar el asiento del conductor y peso bruto vehicular de 5 toneladas o menos.
    M3 : Vehículos de más de ocho asientos, sin contar el asiento del conductor y peso bruto vehicular de más de 5 toneladas.
    Los vehículos de las categorías M2 y M3, a su vez de acuerdo a la disposición de los pasajeros se clasifican en:
    Clase I : Vehículos construidos con áreas para pasajeros de pie permitiendo el desplazamiento frecuente de éstos
    Clase II : Vehículos construidos principalmente para el transporte de pasajeros sentados y, también diseñados para permitir
    el transporte de pasajeros de pie en el pasadizo y/o en un área que no excede el espacio provisto para dos asientos dobles.
    Clase III : Vehículos construidos exclusivamente para el transporte de pasajeros sentados.
    Categoría N: Vehículos automotores de cuatro ruedas o más diseñados y construidos para el transporte de mercancía.
    N1 : Vehículos de peso bruto vehicular de 3,5 toneladas o menos.
    N2 : Vehículos de peso bruto vehicular mayor a 3,5 toneladas hasta 12 toneladas.
    N3 : Vehículos de peso bruto vehicular mayor a 12 toneladas.`;

   }

   ngOnInit(): void {
      //console.log(this.paCategoria.find(i => i.pa == 'DSTT-032' && i.tipoSolicitud=='3' && i.categoria== 'M1'));
      switch (this.seguridadService.getNameId()) {
         case '00001':
            this.tipoPersona = 1; // persona natural
            this.dniPersona = this.seguridadService.getNumDoc();
            // this.ruc;
            break;

         case '00002':
            this.tipoPersona = 2; // persona juridica
            this.dniPersona = this.seguridadService.getNumDoc();
            this.ruc = this.seguridadService.getCompanyCode();
            break;

         case '00003':
            this.tipoPersona = 3;
            this.dniPersona = this.seguridadService.getNumDoc();
            this.ruc = this.seguridadService.getCompanyCode();
            break;

         case '00004':
            this.tipoPersona = 4; // persona extranjera
            this.dniPersona = this.seguridadService.getNumDoc();
            this.ruc = '';
            break;

         case '00005':
            this.tipoPersona = 5; // persona natural con ruc
            this.dniPersona = this.seguridadService.getNumDoc();
            this.ruc = this.seguridadService.getCompanyCode();
            break;
      }

      this.formAnexo = this.fb.group({
         origenRuta: this.fb.control('', [Validators.required]),
         destinoRuta: this.fb.control('', [Validators.required]),
         itinerario: this.fb.control('', [Validators.required]),
         fechaPartida: this.fb.control(''),
         fechaLlegada: this.fb.control(''),
         vias: this.fb.control(''),
         escalasComerciales: this.fb.control(''),
         estaciones: this.fb.control(''),
         frecuencias: this.fb.control(''),
         modalidadServicio: this.fb.control('', [Validators.required]),
         distancia: this.fb.control('', [Validators.required]),
         horasSalida: this.fb.control(''),
         claseServicio: this.fb.control(''),
         tiempoAproxViaje: this.fb.control('', [Validators.required]),

         clase: this.fb.control('', [Validators.required]),

         cao: this.fb.control(false),
         caf: this.fb.control(false),
         cert: this.fb.control(false),
         cel: this.fb.control(false),
         placaRodaje: this.fb.control(''),
         soat: this.fb.control({ value: '', disabled: true }),
         aseguradora: this.fb.control({ value: '', disabled: true }),
         condicion: this.fb.control({ value: '', disabled: true }),
         celular: this.fb.control({ value: '', disabled: true }),
         citv: this.fb.control({ value: '', disabled: true }),

         numeroDni: this.fb.control(''),
         tipoDocumentoConductor: this.fb.control(''),
         numeroDocumentoConductor: this.fb.control(''),
         nombresApellidos: this.fb.control({ value: '', disabled: true }),
         numeroLicencia: this.fb.control({ value: '', disabled: true }),
         categoria: this.fb.control({ value: '', disabled: true }),

         cmbRutas: this.fb.control(''),

         // Seccion 5
         direccionInfra: this.fb.control('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
         depaInfra: this.fb.control('', [Validators.required]),
         provInfra: this.fb.control('', [Validators.required]),
         distInfra: this.fb.control('', [Validators.required]),
         posesionInfra: this.fb.control('', [Validators.required]),
         vigenciaInfra: this.fb.control('', [Validators.required]),

      });

      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitud = this.dataInput.tipoSolicitud.codigo;
      this.descTipoSolicitud = this.dataInput.tipoSolicitud.descripcion;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;
      this.anexoDJ = this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa).anexoCopropietario;
   }

   async ngAfterViewInit(): Promise<void> {
      await this.datosSolicitante(this.dataInput.tramiteReqRefId);

      if (this.paInstalacionAdministrativa.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.opcionalInstalacionAdministrativa = true;
      } else {
         this.opcionalInstalacionAdministrativa = false;
      }
      if (this.paRelacionConductores.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.opcionalRelacionConductores = true;
      } else {
         this.opcionalRelacionConductores = false;
      }

      if (this.paValidaFlotaVehicular.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.opcionalValidaFlotaVehicular = true;
      } else {
         this.opcionalValidaFlotaVehicular = false;
      }

      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.opcionalValidaLicenciaConductor = true;
      } else {
         this.opcionalValidaLicenciaConductor = false;
      }

      /* VALIDA SI LA EMPRESA ESTA HABILITADA PARA REGISTRAR VEHICULOS DE CATEGORÍA M2 EN EL PROCEDIMIENTO DE TRANSPORTE REGULAR DE PERSONAS */

      console.log(this.paCategoria);
      if (this.paEmpresaM2.indexOf(this.codigoProcedimientoTupa) > -1) {
         if (this.rucEmpresasM2.indexOf(this.ruc) > -1) {

            this.paCategoria.push(
               { pa: this.codigoProcedimientoTupa, tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M2' },
               { pa: this.codigoProcedimientoTupa, tipoSolicitud: '1', tipoServicio: '1', servicio: '', categoria: 'M2C3' }
            );
         }
      }
      console.log(this.paCategoria);

      if (this.paRenat.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.opcionalRenat = true;
      } else {
         this.opcionalRenat = false;
      }

      //habilita el botón para adjuntar el contrato de comunicaciones solo DSTT-025, DSTT-029, DSTT-032 Y DSTT-035
      if (this.paValidaContratoComunicacion.indexOf(this.codigoProcedimientoTupa) > -1) {
         if (this.codigoProcedimientoTupa == "DSTT-035" && (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3")) {
            this.visibleControlCel = true;
         } else {
            if (this.codigoProcedimientoTupa == "DSTT-032" && (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "5"))
               this.visibleControlCel = true;
            else {
               this.visibleControlCel = false;
            }
         }
      } else {
         this.visibleControlCel = false;
      }

      if (this.paSeccion1.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.habilitarSeccion1 = true;
      } else {
         this.habilitarSeccion1 = false;
      }
      if (this.paSeccion2.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.habilitarSeccion2 = true;
      } else {
         this.habilitarSeccion2 = false;
      }
      if (this.paSeccion3.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.habilitarSeccion3 = true;
      } else {
         this.habilitarSeccion3 = false;
      }
      if (this.paSeccion4.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.habilitarSeccion4 = true;
      } else {
         this.habilitarSeccion4 = false;
      }
      if (this.paSeccion5.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.habilitarSeccion5 = true;
      } else {
         this.habilitarSeccion5 = false;
      }

      if (this.codigoProcedimientoTupa == "DSTT-032" && this.codigoTipoSolicitudTupa == '1') {
         this.visibleControlRuta = true;
         this.formAnexo.controls.cmbRutas.setValidators(Validators.required);
         this.formAnexo.controls.cmbRutas.updateValueAndValidity();
      }

      if (!this.habilitarSeccion1) {
         this.formAnexo.controls.origenRuta.setValidators(null);
         this.formAnexo.controls.destinoRuta.setValidators(null);
         this.formAnexo.controls.itinerario.setValidators(null);
         this.formAnexo.controls.fechaPartida.setValidators(null);
         this.formAnexo.controls.fechaLlegada.setValidators(null);
         this.formAnexo.controls.vias.setValidators(null);
         this.formAnexo.controls.escalasComerciales.setValidators(null);
         this.formAnexo.controls.estaciones.setValidators(null);
         this.formAnexo.controls.frecuencias.setValidators(null);
         this.formAnexo.controls.modalidadServicio.setValidators(null);
         this.formAnexo.controls.distancia.setValidators(null);
         // this.formAnexo.controls['diasSalida'].setValidators(null);
         this.formAnexo.controls.horasSalida.setValidators(null);
         this.formAnexo.controls.claseServicio.setValidators(null);
         this.formAnexo.controls.tiempoAproxViaje.setValidators(null);

         this.formAnexo.controls.origenRuta.updateValueAndValidity();
         this.formAnexo.controls.destinoRuta.updateValueAndValidity();
         this.formAnexo.controls.itinerario.updateValueAndValidity();
         this.formAnexo.controls.fechaPartida.updateValueAndValidity();
         this.formAnexo.controls.fechaLlegada.updateValueAndValidity();
         this.formAnexo.controls.vias.updateValueAndValidity();
         this.formAnexo.controls.escalasComerciales.updateValueAndValidity();
         this.formAnexo.controls.estaciones.updateValueAndValidity();
         this.formAnexo.controls.frecuencias.updateValueAndValidity();
         this.formAnexo.controls.modalidadServicio.updateValueAndValidity();
         this.formAnexo.controls.distancia.updateValueAndValidity();
         // this.formAnexo.controls['diasSalida'].updateValueAndValidity();
         this.formAnexo.controls.horasSalida.updateValueAndValidity();
         this.formAnexo.controls.claseServicio.updateValueAndValidity();
         this.formAnexo.controls.tiempoAproxViaje.updateValueAndValidity();
      } else {
         if (this.codigoProcedimientoTupa == "DSTT-026") {
            this.txtItinerario = false;
            this.txtVias = false;
            this.txtEscalasComerciales = false;
            this.txtEstaciones = false;
            this.txtFrecuencias = false;
            this.txtModalidadServicio = false;
            this.txtDistancia = false;
            this.txtHorasSalida = false;
            this.txtClaseServicio = false;
            this.txtTiempoAproxViaje = false;
         }

         if (this.codigoProcedimientoTupa == "DSTT-027") {
            this.txtVias = false;
            this.txtEscalasComerciales = false;
            this.txtEstaciones = false;
            this.txtFrecuencias = false;
            this.txtModalidadServicio = false;
            this.txtDistancia = false;
            this.txtHorasSalida = false;
            this.txtClaseServicio = false;
            this.txtTiempoAproxViaje = false;

            (this.txtVias ? this.formAnexo.controls.vias.setValidators([Validators.required]) : this.formAnexo.controls.vias.setValidators(null));
            (this.txtEscalasComerciales ? this.formAnexo.controls.escalasComerciales.setValidators([Validators.required]) : this.formAnexo.controls.escalasComerciales.setValidators(null));
            (this.txtEstaciones ? this.formAnexo.controls.estaciones.setValidators([Validators.required]) : this.formAnexo.controls.estaciones.setValidators(null));
            (this.txtFrecuencias ? this.formAnexo.controls.frecuencias.setValidators([Validators.required]) : this.formAnexo.controls.frecuencias.setValidators(null));
            (this.txtModalidadServicio ? this.formAnexo.controls.modalidadServicio.setValidators([Validators.required]) : this.formAnexo.controls.modalidadServicio.setValidators(null));
            (this.txtDistancia ? this.formAnexo.controls.distancia.setValidators([Validators.required]) : this.formAnexo.controls.distancia.setValidators(null));
            (this.txtHorasSalida ? this.formAnexo.controls.horasSalida.setValidators([Validators.required]) : this.formAnexo.controls.horasSalida.setValidators(null));
            (this.txtClaseServicio ? this.formAnexo.controls.claseServicio.setValidators([Validators.required]) : this.formAnexo.controls.claseServicio.setValidators(null));
            (this.txtTiempoAproxViaje ? this.formAnexo.controls.tiempoAproxViaje.setValidators([Validators.required]) : this.formAnexo.controls.tiempoAproxViaje.setValidators(null));

            this.formAnexo.controls.vias.updateValueAndValidity();
            this.formAnexo.controls.escalasComerciales.updateValueAndValidity();
            this.formAnexo.controls.estaciones.updateValueAndValidity();
            this.formAnexo.controls.frecuencias.updateValueAndValidity();
            this.formAnexo.controls.modalidadServicio.updateValueAndValidity();
            this.formAnexo.controls.distancia.updateValueAndValidity();
            this.formAnexo.controls.horasSalida.updateValueAndValidity();
            this.formAnexo.controls.claseServicio.updateValueAndValidity();
            this.formAnexo.controls.tiempoAproxViaje.updateValueAndValidity();

         }
      }

      if (!this.habilitarSeccion2) {
         this.formAnexo.controls.clase.setValidators(null);
         this.formAnexo.controls.clase.updateValueAndValidity();
      }

      if (this.opcionalRelacionConductores) { this.txtOpcional = '(OPCIONAL)'; } else { this.txtOpcional = ''; }

      if (this.paCantidadVehiculos
         .find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa)) {
         this.cantidadVehiculo = this.paCantidadVehiculos
            .find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa).cantidadMinima;
      }
      /*
      if (this.codigoProcedimientoTupa === 'DSTT-037' || this.codigoProcedimientoTupa === 'DSTT-038') {
        console.log('Validacion: ' + this.codigoProcedimientoTupa);
        await this.validaAutorizacion();
      }*/

      if (!this.habilitarSeccion5) {
         this.formAnexo.controls.direccionInfra.setValidators(null);
         this.formAnexo.controls.direccionInfra.updateValueAndValidity();

         this.formAnexo.controls.depaInfra.setValidators(null);
         this.formAnexo.controls.depaInfra.updateValueAndValidity();

         this.formAnexo.controls.provInfra.setValidators(null);
         this.formAnexo.controls.provInfra.updateValueAndValidity();

         this.formAnexo.controls.distInfra.setValidators(null);
         this.formAnexo.controls.distInfra.updateValueAndValidity();

         this.formAnexo.controls.posesionInfra.setValidators(null);
         this.formAnexo.controls.posesionInfra.updateValueAndValidity();

         this.formAnexo.controls.vigenciaInfra.setValidators(null);
         this.formAnexo.controls.vigenciaInfra.updateValueAndValidity();
      }

      setTimeout(async () => {
         if (this.habilitarSeccion1 === true) {
            this.acc.expand('anexo003_a17_2-seccion-1');
         } else {
            this.acc.collapse('anexo003_a17_2-seccion-1');
            //document.querySelector('button[aria-controls=anexo003_a17_2-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
         }

         if (this.habilitarSeccion2 === true) {
            this.acc.expand('anexo003_a17_2-seccion-2');
         } else {
            this.acc.collapse('anexo003_a17_2-seccion-2');
            //document.querySelector('button[aria-controls=anexo003_a17_2-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
         }

         if (this.habilitarSeccion3 === true) {
            this.acc.expand('anexo003_a17_2-seccion-3');
         } else {
            this.acc.collapse('anexo003_a17_2-seccion-3');
            //document.querySelector('button[aria-controls=anexo003_a17_2-seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
         }

         if (this.habilitarSeccion4 === true) {
            this.acc.expand('anexo003_a17_2-seccion-4');
         } else {
            this.acc.collapse('anexo003_a17_2-seccion-4');
            //document.querySelector('button[aria-controls=anexo003_a17_2-seccion-4]').parentElement.parentElement.classList.add('acordeon-bloqueado');
         }

         if (this.habilitarSeccion5 === true) {
            this.acc.expand('anexo003_a17_2-seccion-5');
         } else {
            this.acc.collapse('anexo003_a17_2-seccion-5');
            //document.querySelector('button[aria-controls=anexo003_a17_2-seccion-5]').parentElement.parentElement.classList.add('acordeon-bloqueado');
         }
         await this.cargarDatos();

         if (this.codigoProcedimientoTupa === "DSTT-026" || this.codigoProcedimientoTupa === "DSTT-032") {
            this.listarRutas();
         }
      });
   }

   // GET FORM formularioFG
   get direccionInfra(): AbstractControl { return this.formAnexo.get(['direccionInfra']); }
   get depaInfra(): AbstractControl { return this.formAnexo.get(['depaInfra']); }
   get provInfra(): AbstractControl { return this.formAnexo.get(['provInfra']); }
   get distInfra(): AbstractControl { return this.formAnexo.get(['distInfra']); }
   get posesionInfra(): AbstractControl { return this.formAnexo.get(['posesionInfra']); }
   get vigenciaInfra(): AbstractControl { return this.formAnexo.get(['vigenciaInfra']); }
   // FIN GET FORM formularioFG

   get _habilitarFlotaV(): boolean {
      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
         return this.habilitarFlotaV;
      }
      return true;
   }

   get _habilitarSeccion(): boolean {
      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
         return this.habilitarFlotaV;
      }
      return true;
   }

   async datosSolicitante(FormularioId: number): Promise<void> {
      this.funcionesMtcService.mostrarCargando();
      try {
         const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
         this.funcionesMtcService.ocultarCargando();

         const metaDataForm: any = JSON.parse(dataForm.metaData);
         const seccion4 = metaDataForm.seccion4;
         const seccion3 = metaDataForm.seccion3;
         const seccion7 = metaDataForm.seccion7;
         const seccion8 = metaDataForm.seccion8;

         console.log("Datos Formulario");
         console.log(metaDataForm);

         this.tipoDocumentoSolicitante = seccion7.tipoDocumentoSolicitante;
         this.nombreTipoDocumentoSolicitante = seccion7.nombreTipoDocumentoSolicitante;
         this.numeroDocumentoSolicitante = seccion7.numeroDocumentoSolicitante;
         this.nombresApellidosSolicitante = seccion7.nombresApellidosSolicitante;

         if (seccion3.tipoSolicitante == "PJ") {
            this.partida = seccion4.partida_registral;
            this.rucSolicitante = seccion3.numeroDocumento;
         } else {
            this.partida = seccion3.numeroDocumento;
            this.rucSolicitante = seccion3.ruc;
         }

      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Debe ingresar primero el Formulario del primer requisito.');
      }
   }

   fromModel(value: string | null): NgbDateStruct | null {
      console.log(value);
      if (value !== '' && value != null) {
         const date = value.split('/');
         return {
            day: parseInt(date[2], 10),
            month: parseInt(date[1], 10),
            year: parseInt(date[0], 10)
         };
      }
      return null;
   }

   async cargarDatos(): Promise<void> {
      if (this.dataInput.movId > 0) {
         // RECUPERAMOS LOS DATOS
         this.funcionesMtcService.mostrarCargando();

         try {
            const dataAnexo = await this.anexoTramiteService.get<Anexo003_A17_2Response>(this.dataInput.tramiteReqId).toPromise();
            this.funcionesMtcService.ocultarCargando();

            const metaData: any = JSON.parse(dataAnexo.metaData);
            console.log("Metadata:");
            console.log(metaData);

            this.idAnexo = dataAnexo.anexoId;

            let i = 0;
            const fechaPartida: string = metaData.itinerario.fechaPartida ?? "";
            const fechaLlegada: string = metaData.itinerario.fechaLlegada ?? "";

            if (this.habilitarSeccion1) {
               this.formAnexo.get('origenRuta').setValue(metaData.itinerario.origenRuta || '');
               this.formAnexo.get('destinoRuta').setValue(metaData.itinerario.destinoRuta || '');
               this.formAnexo.get('itinerario').setValue(metaData.itinerario.itinerario || '');
               this.formAnexo.get('fechaPartida').setValue(this.fromModel(fechaPartida) || '');
               this.formAnexo.get('fechaLlegada').setValue(this.fromModel(fechaLlegada) || '');
               this.formAnexo.get('vias').setValue(metaData.itinerario.vias || '');
               this.formAnexo.get('escalasComerciales').setValue(metaData.itinerario.escalasComerciales || '');
               this.formAnexo.get('estaciones').setValue(metaData.itinerario.estaciones || '');
               this.formAnexo.get('frecuencias').setValue(metaData.itinerario.frecuencias || '');
               this.formAnexo.get('modalidadServicio').setValue(metaData.itinerario.modalidadServicio.id || '');
               this.formAnexo.get('distancia').setValue(metaData.itinerario.distancia || '');
               this.formAnexo.get('horasSalida').setValue(metaData.itinerario.horasSalida || '');
               this.formAnexo.get('claseServicio').setValue(metaData.itinerario.claseServicio || '');
               this.formAnexo.get('tiempoAproxViaje').setValue(metaData.itinerario.tiempoAproxViaje || '');
               // this.filePdfPolizaPathName = metaData.seccion2.pathName || null;

               console.log("Modalidad servicio:" + this.formAnexo.controls.modalidadServicio.value);
            }

            if (this.codigoProcedimientoTupa == "DSTT-032" && this.codigoTipoSolicitudTupa == "1") {
               console.log("Ruta: " + metaData.itinerario.numeroRuta);
               this.formAnexo.get('cmbRutas').setValue(metaData.itinerario.numeroRuta || '');
            }

            if (this.habilitarSeccion2) {
               this.formAnexo.get('clase').setValue(metaData.clase || '');
            }

            if (this.habilitarSeccion3) {
               for (i = 0; i < metaData.renat.listaVehiculos.length; i++) {
                  this.vehiculos.push({
                     placaRodaje: metaData.renat.listaVehiculos[i].placaRodaje,
                     soat: metaData.renat.listaVehiculos[i].soat,
                     aseguradora: metaData.renat.listaVehiculos[i].aseguradora,
                     citv: metaData.renat.listaVehiculos[i].citv,
                     caf: metaData.renat.listaVehiculos[i].caf === true || metaData.renat.listaVehiculos[i].caf === 'true' ? true : false,
                     cao: metaData.renat.listaVehiculos[i].cao === true || metaData.renat.listaVehiculos[i].cao === 'true' ? true : false,
                     cert: metaData.renat.listaVehiculos[i].cert === true || metaData.renat.listaVehiculos[i].cert === 'true' ? true : false,
                     cel: metaData.renat.listaVehiculos[i].cel === true || metaData.renat.listaVehiculos[i].cel === 'true' ? true : false,
                     pathNameCaf: metaData.renat.listaVehiculos[i].pathNameCaf,
                     pathNameCao: metaData.renat.listaVehiculos[i].pathNameCao,
                     pathNameCert: metaData.renat.listaVehiculos[i].pathNameCert,
                     pathNameCel: metaData.renat.listaVehiculos[i].pathNameCel,
                     categoria: metaData.renat.listaVehiculos[i].categoria,
                     condicion: metaData.renat.listaVehiculos[i].condicion,
                     celular: metaData.renat.listaVehiculos[i].celular,
                  } as Vehiculo);
               }
            }

            if (this.habilitarSeccion4) {
               for (i = 0; i < metaData.relacionConductores.length; i++) {
                  this.conductores.push({
                     numeroDni: metaData.relacionConductores[i].numeroDni,
                     nombresApellidos: metaData.relacionConductores[i].nombresApellidos,
                     edad: metaData.relacionConductores[i].edad,
                     numeroLicencia: metaData.relacionConductores[i].numeroLicencia,
                     categoria: metaData.relacionConductores[i].categoria,
                     subcategoria: metaData.relacionConductores[i].subCategoria
                  } as Conductor);
               }

               if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
                  this.habilitarFlotaV = this.conductores?.length <= 0;
               }
            }

            if (this.habilitarSeccion5) {
               this.direccionInfra.setValue(metaData.direccionInfra || '');

               await this.ubigeoComponent?.setUbigeoByText(
                  metaData.depaInfra || '',
                  metaData.provInfra || '',
                  metaData.distInfra || '');

               this.posesionInfra.setValue(metaData.posesionInfra || '1');
               this.vigenciaInfra.setValue(new Date(metaData.vigenciaInfra) || new Date());
            }
         } catch (error) {
            console.error('Error cargarDatos: ', error);
            // this.errorAlCargarData = true;
            this.funcionesMtcService
               .ocultarCargando();
            //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
         }
      }
   }

   public modalClasificacionVehicular(content: any): void {
      this.modalClasVehicular.open(content, { size: 'xl' });
   }

   public addVehiculo(): void {
      if (this.valCaf === 0 && !this.esPropietario) {
         if (this.tipoPersona == 2) {
            this.funcionesMtcService.mensajeError('La partida registral del vehículo no corresponde a la empresa. Deberá ingresar el contrato C.A.F. o realizar la corrección en SUNARP por un mal registro de su número de partida.');
         } else {
            this.funcionesMtcService.mensajeError('La partida registral del vehículo no corresponde al solicitante. Deberá ingresar el contrato C.A.F. o realizar la corrección en SUNARP por un mal registro de su número de partida.');
         }
         return;
      }

      if (this.visibleControlRuta) {
         if (this.formAnexo.controls.cmbRutas.value.trim() == "") {
            this.funcionesMtcService.mensajeError('Debe seleccionar la ruta');
            return;
         }
      }

      /*if(this.codigoProcedimientoTupa=="DSTT-032" && this.codigoTipoSolicitudTupa=="1"){
        if(!this.PlacaPerteneceRuta)
          this.funcionesMtcService.mensajeError('El vehículo ingresado no pertenece a la ruta seleccionada.');
        return;
      } */
      /*
      if(this.valCaf === 0 && !this.esPropietario){
        this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF C.A.F');
        return;
      }*/

      if (
         this.formAnexo.get('placaRodaje').value.trim() === '' ||
         this.formAnexo.get('soat').value.trim() === '' ||
         this.formAnexo.get('citv').value.trim() === ''
      ) {
         this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
         return;
      }

      if (this.formAnexo.get('condicion').enabled && this.formAnexo.get('condicion').value.trim() == "") {
         this.funcionesMtcService.mensajeError('Debe seleccionar la condición de la flota vehicular');
         return;
      }

      if (this.visibleControlCel) {
         if (this.formAnexo.get('celular').value.trim() === '') {
            this.funcionesMtcService.mensajeError('Debe ingresar el número de celular asociada a la placa.');
            return;
         }
         if (this.formAnexo.get('celular').value.trim().length < 9) {
            this.funcionesMtcService.mensajeError('El número de celular debe ser de 9 dígitos.');
            return;
         }
         if (!this.visibleButtonCel) {
            this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF del Contrato de Comunicaciones');
            return;
         }
         if (this.valCel === 0 && this.visibleButtonCel) {
            this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF del Contrato de Comunicaciones');
            return;
         }
      }

      if (this.valCaf === 0 && this.visibleButtonCaf) {
         this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF C.A.F');
         return;
      } /*else if (this.valCao === 0 && this.visibleButtonCao) {
      this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF C.A.O');
      return;
    }*/


      // Si es visible el control, es obligatorio que adjunte el cert. de caract.
      if (this.visibleControlCert) {
         if (!this.visibleButtonCert) {
            this.funcionesMtcService.mensajeError('Al ser un vehículo nuevo, debe cargar un archivo PDF de Certificado de Características');
            return;
         }
         if (this.valCert === 0 && this.visibleButtonCert) {
            this.funcionesMtcService.mensajeError('Al ser un vehículo nuevo, debe cargar un archivo PDF de Certificado de Características');
            return;
         }
      }

      const placaRodaje = this.formAnexo.get('placaRodaje').value.trim().toUpperCase();
      const indexFound = this.vehiculos.findIndex(item => item.placaRodaje === placaRodaje);

      if (indexFound !== -1) {
         if (indexFound !== this.recordIndexToEdit) {
            this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
            return;
         }
      }

      const soat = this.formAnexo.get('soat').value;
      const aseguradora = this.formAnexo.get('aseguradora').value;
      const citv = this.formAnexo.get('citv').value;
      const caf = this.formAnexo.get('caf').value;
      const cao = this.formAnexo.get('cao').value;
      const cert = this.formAnexo.get('cert').value;
      const cel = this.formAnexo.get('cel').value;
      const fileCaf = this.filePdfCafSeleccionado;
      const fileCao = this.filePdfCaoSeleccionado;
      const fileCert = this.filePdfCertSeleccionado;
      const fileCel = this.filePdfCelSeleccionado;
      const pathNameCaf = null;
      const pathNameCao = null;
      const pathNameCert = null;
      const pathNameCel = null;
      const categoria = this.categoriaVehiculo;
      const condicion = this.formAnexo.get('condicion').value;
      const celular = this.formAnexo.get('celular').value;

      if (this.recordIndexToEdit === -1) {
         this.vehiculos.push({
            placaRodaje,
            soat,
            aseguradora,
            citv,
            caf,
            cao,
            cert,
            cel,
            fileCaf,
            fileCao,
            fileCert,
            fileCel,
            pathNameCaf,
            pathNameCao,
            pathNameCert,
            pathNameCel,
            categoria,
            condicion,
            celular
         });
      } else {
         this.vehiculos[this.recordIndexToEdit].placaRodaje = placaRodaje;
         this.vehiculos[this.recordIndexToEdit].soat = soat;
         this.vehiculos[this.recordIndexToEdit].aseguradora = aseguradora;
         this.vehiculos[this.recordIndexToEdit].citv = citv;
         this.vehiculos[this.recordIndexToEdit].caf = caf;
         this.vehiculos[this.recordIndexToEdit].cao = cao;
         this.vehiculos[this.recordIndexToEdit].cel = cel;
         this.vehiculos[this.recordIndexToEdit].cert = cert;
         this.vehiculos[this.recordIndexToEdit].fileCaf = fileCaf;
         this.vehiculos[this.recordIndexToEdit].fileCao = fileCao;
         this.vehiculos[this.recordIndexToEdit].fileCert = fileCert;
         this.vehiculos[this.recordIndexToEdit].fileCel = fileCel;
         this.vehiculos[this.recordIndexToEdit].categoria = categoria;
         this.vehiculos[this.recordIndexToEdit].condicion = condicion;
         this.vehiculos[this.recordIndexToEdit].celular = celular;
      }
      console.log('-Vehiculos:');
      console.log(this.vehiculos);
      this.clearVehicleData();
   }

   private clearVehicleData(): void {
      this.recordIndexToEdit = -1;

      this.formAnexo.controls.placaRodaje.setValue('');
      this.formAnexo.controls.soat.setValue('');
      this.formAnexo.controls.aseguradora.setValue('');
      this.formAnexo.controls.condicion.setValue('');
      this.formAnexo.controls.celular.setValue('');
      this.formAnexo.controls.citv.setValue('');
      this.formAnexo.controls.citv.disable();
      this.formAnexo.controls.caf.setValue(false);
      this.formAnexo.controls.cao.setValue(false);
      this.formAnexo.controls.cert.setValue(false);
      this.formAnexo.controls.cel.setValue(false);
      this.filePdfCafSeleccionado = null;
      this.filePdfCaoSeleccionado = null;
      this.filePdfCertSeleccionado = null;
      this.filePdfCelSeleccionado = null;
      this.visibleButtonCao = false;
      this.visibleButtonCaf = false;
      this.visibleButtonCert = false;
      this.visibleButtonCel = false;
      this.visibleControlCert = false;
      this.visibleControlCel = false;
      this.categoriaVehiculo = '';
      this.listaPlacaNumero = []
   }

   async validatediaFecha(fechaini: string): Promise<void> {
      const mes = fechaini.substring(3, 5);
      const anio = fechaini.substring(6, 10);

      try {
         const data: any = await this.renatService.ObtenerCantAutorizacion(this.ruc, fechaini).toPromise();
         console.log('dataautorizacion', data);
         let mescount = 0;
         let aniocount = 0;
         for (const fecha of data) {

            console.log('lista fecha: ' + fecha.dte_feciniciovigencia + '  ', fecha.dte_feciniciovigencia.substring(3, 5));

            // mes count
            if (fecha.dte_feciniciovigencia.substring(3, 5) === mes) {
               mescount++;
            }
            if (mescount > 2) {
               this.funcionesMtcService.ocultarCargando().mensajeError('Excedió la cuota de permisos por mes(2)');
               this.formAnexo.get('fechaIni').setValue('');
            }

            if (fecha.dte_feciniciovigencia.substring(6, 10) === anio) {
               aniocount++;
            }
            if (mescount > 12) {
               this.funcionesMtcService.ocultarCargando().mensajeError('Excedió la cuota de permisos por año');
               this.formAnexo.get('fechaIni').setValue('');
            }
         }
      } catch (error) {
         console.error(error);
         this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener la flota de reserva');
      }
   }

   onDateSelectIni(event: any): void {
      // console.log(event);
      const year = event.year;
      const month = event.month <= 9 ? '0' + event.month : event.month;
      const day = event.day <= 9 ? '0' + event.day : event.day;
      const finalDate = day + '-' + month + '-' + year;
      this.fechaIni = finalDate;
      this.validatediaFecha(finalDate);
      // minDate ={year:this.fechaactual.getUTCFullYear() ,month:this.fechaactual.getUTCMonth()+1,day:this.fechaactual.getUTCDate()}
      // this.minDatetofin  ={year: Number(year) , month : Number(month) ,day: Number(day)}
      // console.log("fechainicio es " , this.minDatetofin ,"    " , this.minDate);
      // this.formAnexo.get("fechaIni").setValue(this.fechaIni);
   }

   onDateSelectFin(event: any): void {
      // console.log(event);
      const year = event.year;
      const month = event.month <= 9 ? '0' + event.month : event.month;
      const day = event.day <= 9 ? '0' + event.day : event.day;
      const finalDate = day + '-' + month + '-' + year;
      this.fechaFin = finalDate;
      // console.log("fechaini", finalDate);
      // this.formAnexo.get("fechaFin").setValue(this.fechaFin);
   }

   onChangeDistritos(): void {
      // this.formulario.controls['numeroDocumento'].setValue('');
      // this.inputNumeroDocumento();
      const idDepartamento: string = this.formAnexo.controls.departamento.value.trim();
      const idProvincia: string = this.formAnexo.controls.provincia.value.trim();
      this.formAnexo.controls.distrito.setValue('');
      if (idDepartamento !== '' && idProvincia !== '') {
         this.idDep = parseInt(idDepartamento, 10);
         this.idProv = parseInt(idProvincia, 10);
         this.listDistritos();
      } else {
         this.listaDistritos = [];
      }
   }

   onChangeProvincias(): void {
      const idDepartamento: string = this.formAnexo.controls.departamento.value;
      this.formAnexo.controls.provincia.setValue('');
      console.log(idDepartamento);
      // return;

      // this.listaDistritos = [];

      if (idDepartamento !== '') {
         this.listaProvincias = [];
         this.listaDistritos = [];
         this.idDep = parseInt(idDepartamento, 10);
         console.log(this.idDep);
         // this.ubigeoService.provincia(this.idDep).subscribe(
         //   (dataProvincia) => {
         //     this.funcionesMtcService.ocultarCargando();
         //     this.listaProvincias = dataProvincia;
         this.listaProvincia();
         //   },
         //   (error) => {
         //     this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
         //     // this.formulario.controls["nombreRepresentante"].enable();
         //     // this.formulario.controls["apePaternoRepresentante"].enable();
         //     // this.formulario.controls["apeMaternoRepresentante"].enable();
         //   }
         // );

      } else {
         console.log('******');
         this.listaProvincias = [];
         this.listaDistritos = [];
      }

   }

   async listaProvincia(): Promise<void> {
      console.log(this.idDep);
      try {
         const dataProvincia = await this.ubigeoService.provincia(this.idDep).toPromise();
         this.funcionesMtcService.ocultarCargando();
         this.listaProvincias = dataProvincia;
      } catch (error) {
         console.error(error);
         this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
         // this.formulario.controls["nombreRepresentante"].enable();
         // this.formulario.controls["apePaternoRepresentante"].enable();
         // this.formulario.controls["apeMaternoRepresentante"].enable();
      }
   }

   async listDistritos(): Promise<void> {
      try {
         const dataDistrito = await this.ubigeoService.distrito(this.idDep, this.idProv).toPromise();
         this.listaDistritos = dataDistrito;
         this.funcionesMtcService.ocultarCargando();
      } catch (error) {
         console.error(error);
         this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
         // this.formulario.controls["nombreRepresentante"].enable();
         // this.formulario.controls["apePaternoRepresentante"].enable();
         // this.formulario.controls["apeMaternoRepresentante"].enable();
      }
   }

   onChangeTipoDocumento() {
      const tipoDocumentoConductor: string = this.formAnexo.controls['tipoDocumentoConductor'].value.trim();
      this.formAnexo.controls['numeroDocumentoConductor'].setValue('');
      this.formAnexo.controls['nombresApellidos'].setValue('');
      this.formAnexo.controls['numeroLicencia'].setValue('');

   }

   onChangeNumeroDocumentoConductor() {
      const tipoDocumentoConductor: string = this.formAnexo.controls['tipoDocumentoConductor'].value.trim();
      this.formAnexo.controls['nombresApellidos'].setValue('');
      this.formAnexo.controls['numeroLicencia'].setValue('');

   }

   getMaxLengthNumeroDocumento() {
      let tipoDocumento: string = "";

      tipoDocumento = this.formAnexo.controls['tipoDocumentoConductor'].value.trim();


      if (tipoDocumento === '01')//N° de DNI
         return 8;
      else if (tipoDocumento === '04')//Carnet de extranjería
         return 9;
      else if (tipoDocumento === '05' || tipoDocumento === '06')//CPP/PTP
         return 9;
      return 0
   }

   public editVehiculo(vehiculo: any, i: number): void {

      console.log(vehiculo);

      // if (this.recordIndexToEdit !== -1) {
      //   return;
      // }

      this.recordIndexToEdit = i;

      this.formAnexo.controls.placaRodaje.setValue(vehiculo.placaRodaje);
      this.formAnexo.controls.soat.setValue(vehiculo.soat);
      this.formAnexo.controls.aseguradora.setValue(vehiculo.aseguradora);
      this.formAnexo.controls.condicion.setValue(vehiculo.condicion.tipoCondicion);
      this.formAnexo.controls.celular.setValue(vehiculo.celular);
      this.formAnexo.controls.citv.setValue(vehiculo.citv);
      this.formAnexo.controls.caf.setValue(vehiculo.caf);
      this.formAnexo.controls.cao.setValue(vehiculo.cao);
      this.formAnexo.controls.cert.setValue(vehiculo.cert);
      this.formAnexo.controls.cel.setValue(vehiculo.cel);
      this.visibleButtonCaf = vehiculo.caf;
      this.visibleButtonCao = vehiculo.cao;
      this.visibleButtonCert = vehiculo.cert;
      this.visibleButtonCel = vehiculo.cel;

      this.valCaf = (this.visibleButtonCaf ?? false) ? 1 : 0;
      this.valCao = (this.visibleButtonCao ?? false) ? 1 : 0;
      this.visibleControlCert = this.visibleButtonCert ?? false;
      this.valCert = (this.visibleButtonCert ?? false) ? 1 : 0;
      this.visibleControlCel = this.visibleButtonCel ?? false;
      this.valCel = (this.visibleButtonCel ?? false) ? 1 : 0;

      this.filePdfCafSeleccionado = vehiculo.fileCaf;
      this.filePdfCaoSeleccionado = vehiculo.fileCao;
      this.filePdfCertSeleccionado = vehiculo.fileCert;
      this.filePdfCelSeleccionado = vehiculo.fileCel;

      this.filePdfCafPathName = vehiculo.pathNameCaf;
      this.filePdfCaoPathName = vehiculo.pathNameCao;
      this.filePdfCertPathName = vehiculo.pathNameCert;
      this.filePdfCelPathName = vehiculo.pathNameCel;
   }

   public deleteVehiculo(vehiculo: any, i: number): void {
      console.log('recordIndexToEdit', this.recordIndexToEdit);

      this.funcionesMtcService
         .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
         .then(() => {
            this.clearVehicleData();
            this.vehiculos.splice(i, 1);
         });
   }

   async verPdfCafGrilla(item: Vehiculo): Promise<void> {
      if (item.fileCaf) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(item.fileCaf);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
      } else {
         this.funcionesMtcService.mostrarCargando();

         try {
            const file: Blob = await this.visorPdfArchivosService.get(item.pathNameCaf).toPromise();
            this.funcionesMtcService.ocultarCargando();
            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
         } catch (error) {
            console.error(error);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar PDF');
         }
      }
   }

   async verPdfCaoGrilla(item: Vehiculo): Promise<void> {
      // console.log(item.fileCao)
      if (item.fileCao) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(item.fileCao);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
      } else {
         this.funcionesMtcService.mostrarCargando();

         try {
            const file: Blob = await this.visorPdfArchivosService.get(item.pathNameCao).toPromise();
            this.funcionesMtcService.ocultarCargando();

            console.log(file);

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
         } catch (error) {
            console.error(error);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar PDF');
         }
      }
   }

   async verPdfCertGrilla(item: Vehiculo): Promise<void> {
      // console.log(item.fileCao)
      if (item.fileCert) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(item.fileCert);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
      } else {
         this.funcionesMtcService.mostrarCargando();

         try {
            const file: Blob = await this.visorPdfArchivosService.get(item.pathNameCert).toPromise();
            this.funcionesMtcService.ocultarCargando();
            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
         } catch (error) {
            console.error(error);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar PDF');
         }
      }
   }

   async verPdfCelGrilla(item: Vehiculo): Promise<void> {
      // console.log(item.fileCao)
      if (item.fileCel) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(item.fileCel);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
      } else {
         this.funcionesMtcService.mostrarCargando();

         try {
            const file: Blob = await this.visorPdfArchivosService.get(item.pathNameCel).toPromise();
            this.funcionesMtcService.ocultarCargando();
            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + item.placaRodaje;
         } catch (error) {
            console.error(error);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar PDF');
         }
      }
   }

   visualizarGrillaPdf(file: File, placaRodaje: string): void {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - PDF: ' + placaRodaje;
   }

   async buscarNumeroDocumento(): Promise<void> {

      const numeroDni: string = this.formAnexo.get('numeroDni').value.trim();

      // VALIDAMOS LA RELACION DE VEHICULOS
      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
         if (this.vehiculos?.length <= 0) {
            this.funcionesMtcService.mensajeError('Primero debe registrar la flota vehicular');
            return;
         }
      }

      this.funcionesMtcService.mostrarCargando();

      try {
         const respuesta = await this.reniecService.getDni(numeroDni).toPromise();
         this.funcionesMtcService.ocultarCargando();

         if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
         }

         const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
      }
   }

   private addPersona(datos: string, direccion: string): void {
      this.funcionesMtcService
         .mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.formAnexo.controls.nombresApellidos.setValue(datos);
         });
   }

   async addConductor(): Promise<void> {
      if (
         this.formAnexo.get('tipoDocumentoConductor').value.trim() === '' ||
         this.formAnexo.get('numeroDocumentoConductor').value.trim() === '' ||
         this.formAnexo.get('nombresApellidos').value.trim() === '' ||
         this.formAnexo.get('numeroLicencia').value.trim() === ''
      ) {
         this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
         return;
      }

      if (!this.servicioSnc) {
         // VALIDAMOS LA CATEGORIA DE LAS LICENCIAS DE CONDUC SIE EL SERVICIE SNC NO ESTÁ DISPONIBLE
         if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
            if (this.vehiculos?.length <= 0) {
               this.funcionesMtcService.mensajeError('Primero debe registrar la flota vehicular');
               return;
            } else {
               let categoriaValida = false;
               const categoriaConductor = this.formAnexo.get('categoria').value;
               for (const vehiculo of this.vehiculos) {
                  const categoriaVehiculo = vehiculo.categoria;

                  console.log('categoriaVehiculo:', categoriaVehiculo);
                  console.log('categoriaConductor:', categoriaConductor);

                  if (categoriaVehiculo === 'M2' || categoriaVehiculo === 'M2C3') {
                     if (categoriaConductor == 'A IIb' || categoriaConductor == 'A IIIa' || categoriaConductor == 'A IIIb' || categoriaConductor == 'A IIIc') {
                        categoriaValida = true;
                     }
                  }

                  if (categoriaVehiculo === 'M3' || categoriaVehiculo === 'M3C3') {
                     if (categoriaConductor == 'A IIIa' || categoriaConductor == 'A IIIb' || categoriaConductor == 'A IIIc') {
                        categoriaValida = true;
                     }
                  }
               }
               if (!categoriaValida) {
                  this.funcionesMtcService.mensajeError('La categoría ' + categoriaConductor + ' de conducir no corresponde a las categorías de los vehículos registrados');
                  return;
               }
            }
         }
      }

      let tipoDocumentoConductor: string = this.formAnexo.get('tipoDocumentoConductor').value.trim();
      let nombreTipoDocumento: string = "";

      if (tipoDocumentoConductor == "01") nombreTipoDocumento = "DNI";
      if (tipoDocumentoConductor == "04") nombreTipoDocumento = "CE";
      if (tipoDocumentoConductor == "05" || tipoDocumentoConductor == "06") nombreTipoDocumento = "PTP";

      const numeroDni = nombreTipoDocumento + ' ' + this.formAnexo.get('numeroDocumentoConductor').value;
      const indexFound = this.conductores.findIndex(item => item.numeroDni === numeroDni);

      if (indexFound !== -1) {
         if (indexFound !== this.recordIndexToEditConductores) {
            this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
            return;
         }
      }

      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
         if (this.vehiculos?.length <= 0) {
            this.funcionesMtcService.mensajeError('Primero debe registrar la flota vehicular');
            return;
         }

         if (this.conductores?.length === 0) {
            try {
               await this.funcionesMtcService
                  .mensajeWarnConfirmar('No podrá modificar la flota vehicular. ¿Está seguro de agregarlo?');
            } catch (error) {
               return;
            }
         }
         this.habilitarFlotaV = false;
      }

      const nombresApellidos = this.formAnexo.get('nombresApellidos').value;
      const edad = '';
      const numeroLicencia = this.formAnexo.get('numeroLicencia').value.toUpperCase();
      const categoria = this.formAnexo.get('categoria')?.value;
      const subcategoria = '';

      if (this.recordIndexToEditConductores === -1) {
         this.conductores.push({
            nombresApellidos,
            numeroDni,
            edad,
            numeroLicencia,
            categoria,
            subcategoria
         });
      } else {
         this.conductores[this.recordIndexToEditConductores].nombresApellidos = nombresApellidos;
         this.conductores[this.recordIndexToEditConductores].numeroDni = numeroDni;
         this.conductores[this.recordIndexToEditConductores].edad = edad;
         this.conductores[this.recordIndexToEditConductores].numeroLicencia = numeroLicencia;
         this.conductores[this.recordIndexToEditConductores].categoria = categoria;
         this.conductores[this.recordIndexToEditConductores].subcategoria = subcategoria;
      }

      this.clearConductorData();
   }

   private clearConductorData(): void {
      this.recordIndexToEditConductores = -1;

      this.formAnexo.controls.nombresApellidos.setValue('');
      this.formAnexo.controls.tipoDocumentoConductor.setValue('');
      this.formAnexo.controls.numeroDocumentoConductor.setValue('');
      this.formAnexo.controls.numeroLicencia.setValue('');
      this.formAnexo.controls.categoria.setValue('');

      this.formAnexo.controls.numeroLicencia.disable();
      this.formAnexo.controls.categoria.disable();
   }

   editConductor(conductor: any, i: number): void {
      let tipoDocumentoConductor: string = "";
      let numeroDocumentoConductor: string = "";

      if (this.recordIndexToEditConductores !== -1) {
         return;
      }
      let documento: string[] = conductor.numeroDni.split(' ');
      numeroDocumentoConductor = documento[1];
      if (documento[0] == "DNI") tipoDocumentoConductor = "01";
      if (documento[0] == "CE") tipoDocumentoConductor = "04";
      if (documento[0] == "PTP") tipoDocumentoConductor = "05";


      this.recordIndexToEditConductores = i;
      this.formAnexo.controls.nombresApellidos.setValue(conductor.nombresApellidos);
      this.formAnexo.controls.tipoDocumentoConductor.setValue(tipoDocumentoConductor);
      this.formAnexo.controls.numeroDocumentoConductor.setValue(numeroDocumentoConductor);
      this.formAnexo.controls.numeroLicencia.setValue(conductor.numeroLicencia);
   }

   deleteConductor(conductor: any, i: number): void {
      if (this.recordIndexToEditConductores === -1) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.conductores.splice(i, 1);

               if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
                  if (this.conductores?.length <= 0) {
                     this.funcionesMtcService.mensajeInfo('Ahora puede modificar la flota vehicular');
                     this.habilitarFlotaV = true;
                  }
               }
            });
      }
   }

   onChangeInputCroquis(event): void {
      if (event.target.files.length === 0) {
         return;
      }

      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }
      event.target.value = '';
   }

   onChangeInputCaf(event): void {
      if (event.target.files.length === 0) {
         return;
      }

      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }

      const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
      if (msg !== 'ok') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError(msg);
         return;
      }

      this.filePdfCafSeleccionado = event.target.files[0];
      console.log('====> ' + this.filePdfCafSeleccionado);
      event.target.value = '';
      this.valCaf = 1;
      this.esPropietario = true;
   }

   onChangeInputCao(event): void {
      if (event.target.files.length === 0) {
         return;
      }

      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }

      const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
      if (msg !== 'ok') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError(msg);
         return;
      }

      this.filePdfCaoSeleccionado = event.target.files[0];
      event.target.value = '';
      this.valCao = 1;
   }

   onChangeInputCert(event): void {
      if (event.target.files.length === 0) {
         return;
      }

      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }

      const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
      if (msg !== 'ok') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError(msg);
         return;
      }

      this.filePdfCertSeleccionado = event.target.files[0];
      event.target.value = '';
      this.valCert = 1;
   }

   onChangeInputCel(event): void {
      if (event.target.files.length === 0) {
         return;
      }

      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }

      const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
      if (msg !== 'ok') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError(msg);
         return;
      }

      this.filePdfCelSeleccionado = event.target.files[0];
      event.target.value = '';
      this.valCel = 1;
   }

   soloNumeros(event): void {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
   }

   onChangeCaf(event: boolean): void {
      this.visibleButtonCaf = event;

      if (this.visibleButtonCaf === true) {
         this.visibleButtonCao = false;
         this.filePdfCaoSeleccionado = null;
         this.formAnexo.controls.cao.setValue(false);
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonCaf = false;
               this.formAnexo.controls.caf.setValue(false);
            });
      } else {
         this.filePdfCafSeleccionado = null;
      }
   }

   onChangeCao(event: boolean): void {
      this.visibleButtonCao = event;

      if (this.visibleButtonCao === true) {
         this.visibleButtonCaf = false;
         this.filePdfCafSeleccionado = null;
         this.formAnexo.controls.caf.setValue(false);
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonCao = false;
               this.formAnexo.controls.cao.setValue(false);
            });
      } else {
         this.filePdfCaoSeleccionado = null;
      }
   }

   onChangeCert(event: boolean): void {
      this.visibleButtonCert = event;

      if (this.visibleButtonCert === true) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonCert = false;
               this.formAnexo.controls.cert.setValue(false);
            });
      } else {
         this.filePdfCertSeleccionado = null;
      }
   }

   onChangeCel(event: boolean): void {
      this.visibleButtonCel = event;

      if (this.visibleButtonCel === true) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonCel = false;
               this.formAnexo.controls.cel.setValue(false);
            });
      } else {
         this.filePdfCelSeleccionado = null;
      }
   }

   async vistaPreviaCaf(): Promise<void> {
      if (this.filePdfCafSeleccionado) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(this.filePdfCafSeleccionado);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Contrato de Arrendamiento financiero';
      } else {
         this.funcionesMtcService.mostrarCargando();

         try {
            const file: Blob = await this.visorPdfArchivosService.get(this.filePdfCafPathName).toPromise();
            this.funcionesMtcService.ocultarCargando();

            // this.visualizarGrillaPdf(file, item.placaRodaje);
            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ';
         } catch (error) {
            console.error(error);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar PDF');
         }
      }
   }

   async vistaPreviaCao(): Promise<void> {
      if (this.filePdfCaoSeleccionado) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(this.filePdfCaoSeleccionado);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Contrato de Arrendamiento';
      } else {
         this.funcionesMtcService.mostrarCargando();
         try {
            const file: Blob = await this.visorPdfArchivosService.get(this.filePdfCaoPathName).toPromise();
            this.funcionesMtcService.ocultarCargando();

            // this.visualizarGrillaPdf(file, item.placaRodaje);
            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Contrato de Arrendamiento';
         } catch (error) {
            console.error(error);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar PDF');
         }
      }
   }

   vistaPreviaCert(): void {
      if (this.filePdfCertSeleccionado) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(this.filePdfCertSeleccionado);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Certificado de Características';
      } else {
         this.funcionesMtcService.mostrarCargando();

         this.visorPdfArchivosService.get(this.filePdfCertPathName)
            .subscribe(
               (file: Blob) => {
                  this.funcionesMtcService.ocultarCargando();

                  // this.visualizarGrillaPdf(file, item.placaRodaje);
                  const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
                  const urlPdf = URL.createObjectURL(file);
                  modalRef.componentInstance.pdfUrl = urlPdf;
                  modalRef.componentInstance.titleModal = 'Vista Previa - Certificado de Características';
               },
               error => {
                  this.funcionesMtcService
                     .ocultarCargando()
                     .mensajeError('Problemas para descargar PDF');
               }
            );
      }
   }

   vistaPreviaCel(): void {
      if (this.filePdfCelSeleccionado) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(this.filePdfCelSeleccionado);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Contrato de Comunicaciones';
      } else {
         this.funcionesMtcService.mostrarCargando();

         this.visorPdfArchivosService.get(this.filePdfCelPathName)
            .subscribe(
               (file: Blob) => {
                  this.funcionesMtcService.ocultarCargando();

                  // this.visualizarGrillaPdf(file, item.placaRodaje);
                  const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
                  const urlPdf = URL.createObjectURL(file);
                  modalRef.componentInstance.pdfUrl = urlPdf;
                  modalRef.componentInstance.titleModal = 'Vista Previa - Contrato de Comunicaciones';
               },
               error => {
                  this.funcionesMtcService
                     .ocultarCargando()
                     .mensajeError('Problemas para descargar PDF');
               }
            );
      }
   }
   /* validar si la placa pertenece a la ruta de la empresa y si está activa*/
   /*if(this.codigoProcedimientoTupa=="DSTT-032" && this.codigoTipoSolicitudTupa=="1"){
     let nroRuta: string = this.formAnexo.controls.cmbRutas.value.trim();
     this.renatService.validarPlacaPerteneceRutaEmpresa(this.ruc, nroRuta, placaRodaje).subscribe((resp) => {
       const pertenece = resp;
       if(!pertenece){
         this.PlacaPerteneceRuta=false;
       }else 
         this.PlacaPerteneceRuta=true;
     },error => {
       this.funcionesMtcService
         .ocultarCargando()
         .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de las rutas vigentes');
     });
     if (!this.PlacaPerteneceRuta){
       return this.funcionesMtcService.mensajeError('El vehículo ingresado no pertenece a la ruta seleccionada.');
     }
   }*/

   buscarPlacaRodaje(): void {
      const placaRodaje = this.formAnexo.controls.placaRodaje.value.trim().toUpperCase();
      this.esPropietario = true;

      if (placaRodaje.length !== 6) {
         return;
      }

      this.changePlacaRodaje();

      this.funcionesMtcService.mostrarCargando();
      this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
         respuesta => {

            if (this.opcionalValidaFlotaVehicular) {
               this.funcionesMtcService.mostrarCargando();
               const tipoServicioEmpresa = this.paTipoServicioEmpresa.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa);
               this.renatService.validarPlacaPerteneceFlotaVehicularEmpresa(this.ruc, Number(tipoServicioEmpresa.tipoServicio), placaRodaje).subscribe(
                  (data: any) => {
                     this.funcionesMtcService.ocultarCargando();
                     if (!data) {
                        this.changePlacaRodaje();
                        return this.funcionesMtcService.mensajeError('La placa ' + placaRodaje + ' NO pertenece a la flota vehicular de la empresa o su estado es SUSPENDIDO.');

                     }
                  }
               )
            }

            console.log(respuesta);
            this.propietarios = respuesta.propietarios;

            this.funcionesMtcService.ocultarCargando();

            if (respuesta.anioFabricacion == null && respuesta.anioModelo == null) {
               return this.funcionesMtcService.mensajeError('No se encontraron resultados.');
            }

            if (respuesta.carroceria.trim() == "OMNIBUS PANORAMICO") {
               return this.funcionesMtcService.mensajeError('La habilitación del tipo de carrocería de OMNIBUS PANORAMICO, debe ser solicitado ante el Gobierno Provincial donde será prestado el servicio; solo para el caso de Lima y Callao, será ante la Autoridad de Transporte Urbano para Lima y Callao (ATU)');
            }

            if (respuesta.categoria?.trim() === '' || respuesta.categoria?.trim() === '-' || respuesta.categoria == null) {
               return this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
            }
            /* VALIDACION DE SOAT */
            if (respuesta.categoria.charAt(0) == 'N' || respuesta.categoria.charAt(0) == 'M') {
               if (respuesta.soat.estado === '') {
                  return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
               }
               if (respuesta.soat.estado !== 'VIGENTE' && respuesta.soat.estado !== 'FUTURO') {
                  return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
               }
               //  VALIDA EL TIPO DE SOAT
               if (this.codigoProcedimientoTupa == "DSTT-028") {
                  if (respuesta.soat.servicio.trim() !== "TURISMO") {
                     return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: TURISMO');
                  }
               }

               if (this.codigoProcedimientoTupa == "DSTT-029") {
                  if (respuesta.soat.servicio.trim() !== "TRANSP DE PERSONAL") {
                     return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: TRANSP DE PERSONAL');
                  }
                  if (respuesta.categoria?.trim() !== "M3" && respuesta.categoria?.trim() !== "M2" && respuesta.categoria?.trim() !== "M3C3" && respuesta.categoria?.trim() !== "M2C3") {
                     return this.funcionesMtcService.mensajeError('Solo esta permitido vehículos de categoría M2, M2C3, M3 o M3C3');
                  }
               }

               if (this.codigoProcedimientoTupa == "DSTT-025") {
                  if (respuesta.soat.servicio !== "INTERPROVINCIAL") {
                     return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: INTERPROVINCIAL');
                  }

                  if (respuesta.categoria?.trim() !== "M3" && respuesta.categoria?.trim() !== "M3C3") {
                     return this.funcionesMtcService.mensajeError('Solo esta permitido vehículos de categoría M3 o M3C3');
                  }
               }

               if (this.codigoProcedimientoTupa == "DSTT-032") {
                  console.log("SOAT:" + this.codigoTipoSolicitudTupa);
                  switch (parseInt(this.codigoTipoSolicitudTupa)) {
                     case 1: if (respuesta.soat.servicio.trim() !== "INTERPROVINCIAL") {
                        return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: INTERPROVINCIAL');
                     };
                        break;
                     case 2: if (respuesta.soat.servicio.trim() !== "TURISMO") {
                        return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: TURISMO');
                     }
                        break;
                     case 3: if (respuesta.soat.servicio.trim() !== "TRANSP DE PERSONAL") {
                        return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: TRANSP DE PERSONAL');
                     }
                        break;
                     case 5: if (respuesta.soat.servicio.trim() !== "TRANSP DE PERSONAL" && respuesta.soat.servicio.trim() !== "PARTICULAR") {
                        return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: PARTICULAR O TRANSP DE PERSONAL');
                     }
                        break;
                     case 6:
                     case 7: if (respuesta.soat.servicio.trim() !== "CARGA/TRANSPORTE") {
                        return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser:  CARGA/TRANSPORTE');
                     }
                        break;
                  }
               }

               if (this.codigoProcedimientoTupa == "DSTT-036" || this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038" || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040") {
                  if (respuesta.soat.servicio.trim() !== "CARGA/TRANSPORTE") {
                     return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: CARGA/TRANSPORTE');
                  }
               }

               if (this.codigoProcedimientoTupa == "DSTT-030") {
                  if (respuesta.soat.servicio.trim() !== "PARTICULAR" && respuesta.soat.servicio.trim() !== "TRANSP DE PERSONAL") {
                     return this.funcionesMtcService.mensajeError('Usted cuenta con el SOAT: ' + respuesta.soat.servicio.trim() + '. El SOAT para este servicio debe ser: PARTICULAR O TRANSP DE PERSONAL');
                  }
               }
            }

            this.categoriaVehiculo = respuesta.categoria?.trim() ?? '';
            /** Validación de la Carrocería */
            let carroceria = respuesta.carroceria;
            let carroceriasGrupo1: string[] = ["CISTERNA COMBUSTIBLES", "CISTERNA COMBUSTIBLE", "TANQUE GLP", "TANQUE GNC"];
            let carroceriasGrupo2: string[] = ["TANQUE CORROSIVO", "TANQUE CORROCIVO", "TANQUE CRIOGENICO", "TANQUE CRIOGÉNICO"];
            let carroceriasGrupo3: string[] = ["CISTERNA COMBUSTIBLES", "CISTERNA COMBUSTIBLE"];
            let carroceriasGrupo4: string[] = ["TANQUE GLP", "TANQUE GNC"];

            if (this.paValidarCarroceria_G1.indexOf(this.codigoProcedimientoTupa) > -1) {
               if (carroceriasGrupo1.indexOf(carroceria) > -1) {
                  return this.funcionesMtcService.mensajeError('El vehículo ' + placaRodaje?.toUpperCase() + ', por el tipo de carrocería ' + carroceria + ' no le corresponde ser habilitado por el MTC,' +
                     ' según se establece en el Decreto Supremo Nº 021-2008-MTC y sus modificatorias');
               }

               if (carroceriasGrupo2.indexOf(carroceria) > -1) {
                  return this.funcionesMtcService.mensajeError('El vehículo ' + placaRodaje?.toUpperCase() + ', por el tipo de carrocería ' + carroceria + ' no le corresponde ser habilitado para ' +
                     'el servicio de transporte de mercancía, según se establece en la Directiva N°002-2006-MTC/15 y en el artículo 21 del Decreto Supremo 017-2009-MTC, ' +
                     'donde se precisan las Condiciones técnicas específicas mínimas exigibles a los vehículos destinados a la prestación del servicio de transporte de mercancías.');
               }
            }

            if (this.paValidarCarroceria_G2.indexOf(this.codigoProcedimientoTupa) > -1) {

               if (carroceriasGrupo3.indexOf(carroceria) > -1) {
                  this.funcionesMtcService.mensajeInfo('Los vehículos con tipo de carrocería "Cisterna Combustible" podrán ser autorizados únicamente para el' +
                     ' transporte de combustibles que no sean derivados de hidrocarburos.');
               }

               if (carroceriasGrupo4.indexOf(carroceria) > -1) {
                  return this.funcionesMtcService.mensajeError('El vehículo ' + placaRodaje?.toUpperCase() + ', por el tipo de carrocería ' + carroceria + ' no le corresponde ser habilitado por el MTC,' +
                     ' según se establece en el Decreto Supremo Nº 021-2008-MTC y sus modificatorias');
               }
            }


            /*validamos el peso del vehiculo*/
            let pesoBrutoVehiculo = respuesta.pesoBruto ?? 0;
            let pesoSecoVehiculo = respuesta.pesoSeco ?? 0;
            if (this.codigoProcedimientoTupa == "DSTT-032") {
               if (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "5") {
                  if (this.paPeso
                     .find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo && i.restriccionPeso == "Si")) {
                     const pesoMinimoBruto = this.paPeso.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo).pesoMinimoBruto;
                     const pesoMinimoSeco = this.paPeso.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo).pesoMinimoSeco;
                     console.log("pesoMinimoBruto:" + pesoMinimoBruto + "pesoMinimoSeco:" + pesoMinimoSeco);
                     if (pesoMinimoBruto > 0) {
                        if (pesoBrutoVehiculo < pesoMinimoBruto) {
                           return this.funcionesMtcService.mensajeError('El peso bruto mínimo del vehículo debe ser ' + pesoMinimoBruto + ' toneladas');
                        }
                     } else {
                        if (pesoMinimoSeco > 0) {
                           if (pesoSecoVehiculo < pesoMinimoSeco) {
                              return this.funcionesMtcService.mensajeError('El peso neto mínimo del vehículo debe ser ' + pesoMinimoSeco + ' toneladas');
                           }
                        }
                     }
                  }
               }

               if (this.codigoTipoSolicitudTupa == "6" || this.codigoTipoSolicitudTupa == "7") {
                  switch (this.categoriaVehiculo) {
                     case "N1": if (pesoBrutoVehiculo > 3.5) return this.funcionesMtcService.mensajeError('El peso bruto máximo del vehículo debe ser 3.5 toneladas'); break;
                     case "N2": if (pesoBrutoVehiculo < 3.5 || pesoBrutoVehiculo > 12) return this.funcionesMtcService.mensajeError('El peso bruto del vehículo debe ser mayor a 3.5 toneladas e inferior a 12 toneladas'); break;
                     case "N3": if (pesoBrutoVehiculo < 12) return this.funcionesMtcService.mensajeError('El peso bruto mínimo del vehículo debe ser 12 toneladas'); break;
                     case "O1": if (pesoBrutoVehiculo > 0.75) return this.funcionesMtcService.mensajeError('El peso bruto máximo del vehículo debe ser 0.75 toneladas'); break;
                     case "O2": if (pesoBrutoVehiculo < 0.75 || pesoBrutoVehiculo > 3.5) return this.funcionesMtcService.mensajeError('El peso bruto del vehículo debe ser mayor a 0.75 toneladas e inferior a 3.5 toneladas'); break;
                     case "O3": if (pesoBrutoVehiculo < 3.5 || pesoBrutoVehiculo > 10) return this.funcionesMtcService.mensajeError('El peso bruto del vehículo debe ser mayor a 3.5 toneladas e inferior a 10 toneladas'); break;
                     case "O4": if (pesoBrutoVehiculo < 10) return this.funcionesMtcService.mensajeError('El peso bruto mínimo del vehículo debe ser 10 toneladas'); break;
                  }
               }
            } else {
               if (this.codigoProcedimientoTupa == "DSTT-036" || this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038" || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040") {
                  switch (this.categoriaVehiculo) {
                     case "N1": if (pesoBrutoVehiculo > 3.5) return this.funcionesMtcService.mensajeError('El peso bruto máximo del vehículo debe ser 3.5 toneladas'); break;
                     case "N2": if (pesoBrutoVehiculo < 3.5 || pesoBrutoVehiculo > 12) return this.funcionesMtcService.mensajeError('El peso bruto del vehículo debe ser mayor a 3.5 toneladas e inferior a 12 toneladas'); break;
                     case "N3": if (pesoBrutoVehiculo < 12) return this.funcionesMtcService.mensajeError('El peso bruto mínimo del vehículo debe ser 12 toneladas'); break; //corregir es 12
                     case "O1": if (pesoBrutoVehiculo > 0.75) return this.funcionesMtcService.mensajeError('El peso bruto máximo del vehículo debe ser 0.75 toneladas'); break;
                     case "O2": if (pesoBrutoVehiculo < 0.75 || pesoBrutoVehiculo > 3.5) return this.funcionesMtcService.mensajeError('El peso bruto del vehículo debe ser mayor a 0.75 toneladas e inferior a 3.5 toneladas'); break;
                     case "O3": if (pesoBrutoVehiculo < 3.5 || pesoBrutoVehiculo > 10) return this.funcionesMtcService.mensajeError('El peso bruto del vehículo debe ser mayor a 3.5 toneladas e inferior a 10 toneladas'); break;
                     case "O4": if (pesoBrutoVehiculo < 10) return this.funcionesMtcService.mensajeError('El peso bruto mínimo del vehículo debe ser 10 toneladas'); break;
                  }
               }
               else {
                  if (this.paPeso
                     .find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo && i.restriccionPeso == "Si")) {
                     const pesoMinimoBruto = this.paPeso.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo).pesoMinimoBruto;
                     const pesoMinimoSeco = this.paPeso.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo).pesoMinimoSeco;
                     console.log("pesoMinimoBruto:" + pesoMinimoBruto + "pesoMinimoSeco:" + pesoMinimoSeco);
                     if (pesoMinimoBruto > 0) {
                        if (pesoBrutoVehiculo < pesoMinimoBruto) {
                           return this.funcionesMtcService.mensajeError('El peso bruto mínimo del vehículo debe ser ' + pesoMinimoBruto + ' toneladas');
                        }
                     } else {
                        if (pesoMinimoSeco > 0) {
                           if (pesoSecoVehiculo < pesoMinimoSeco) {
                              return this.funcionesMtcService.mensajeError('El peso neto mínimo del vehículo debe ser ' + pesoMinimoSeco + ' toneladas');
                           }
                        }
                     }
                  }
               }
            }

            this.formAnexo.controls.soat.setValue(respuesta.soat.numero || '-');
            this.formAnexo.controls.aseguradora.setValue(respuesta.soat.aseguradora || '-');

            if (this.codigoProcedimientoTupa == "DSTT-025" || this.codigoProcedimientoTupa == "DSTT-029") {

               this.formAnexo.controls.condicion.enable();
               this.formAnexo.controls.celular.enable();
               this.visibleControlCel = true;
            }


            if (this.codigoProcedimientoTupa == "DSTT-032" || this.codigoProcedimientoTupa == "DSTT-035") {
               if (this.codigoTipoSolicitudTupa != "6" && this.codigoTipoSolicitudTupa != "7") {
                  this.formAnexo.controls.condicion.enable();
               }

               if (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "5") {
                  this.formAnexo.controls.celular.enable();
                  this.visibleControlCel = true;
               }

               if (this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "5") {
                  this.formAnexo.controls.condicion.setValue('O');
               }
            }


            /*VALIDAMOS LA CATEGORÍA PERMITIDA POR PROCEDIMIENTO*/
            if (this.paCategoria
               .find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo) == undefined) {
               this.formAnexo.controls.soat.setValue('');
               this.formAnexo.controls.citv.setValue('');
               this.formAnexo.controls.aseguradora.setValue('');
               console.log(this.paCategoria.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa && i.categoria == this.categoriaVehiculo));
               return this.funcionesMtcService.mensajeError('La categoría  ' + this.categoriaVehiculo + ' no está permitida para este procedimiento.');
            }


            /* Validamos el año del vehículo solo para transporte de personas*/
            if (this.codigoProcedimientoTupa == "DSTT-025" || this.codigoProcedimientoTupa == "DSTT-027" ||
               this.codigoProcedimientoTupa == "DSTT-028" || this.codigoProcedimientoTupa == "DSTT-029") {

               if (respuesta.anioModelo !== "" && parseInt(respuesta.anioModelo) != 0) {
                  if (parseInt(respuesta.anioModelo) < 1998) {
                     return this.funcionesMtcService.mensajeError('El año de fabricación del vehículo no debe ser antes de 1998');
                  }
               } else {
                  if (parseInt(respuesta.anioFabricacion) < 1998) {
                     return this.funcionesMtcService.mensajeError('El año de fabricación del vehículo no debe ser antes de 1998');
                  }
               }
            }

            if ((this.codigoProcedimientoTupa == "DSTT-032" ||
               this.codigoProcedimientoTupa == "DSTT-035") && (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" ||
                  this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "4")) {

               if (respuesta.anioModelo !== "" && parseInt(respuesta.anioModelo) != 0) {
                  if (parseInt(respuesta.anioModelo) < 1998) {
                     return this.funcionesMtcService.mensajeError('El año de fabricación del vehículo no debe ser antes de 1998');
                  }
               } else {
                  if (parseInt(respuesta.anioFabricacion) < 1998) {
                     return this.funcionesMtcService.mensajeError('El año de fabricación del vehículo no debe ser antes de 1998');
                  }
               }
            }

            /*Validamos la antiguedad del vehículo para el DSTT-036, DSTT-037, DSTT-038, DSTT-039, DSTT-040 RESIDUOS PELIGROSOS*/
            if (this.codigoProcedimientoTupa == "DSTT-036" || this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038" || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040") {
               if (respuesta.categoria.charAt(0) == 'N') {
                  if (respuesta.anioModelo !== "" && parseInt(respuesta.anioModelo) != 0) {

                     if (parseInt(respuesta.antiguedadModelo) > 20) {
                        return this.funcionesMtcService.mensajeError('No se puede registrar el vehículo porque supera los 20 años de antigüedad, conforme a los numerales 3 y 4 del Art. 43° del D.S. N° 021-MTC-2008.');
                     }
                  } else {
                     if (respuesta.anioFabricacion !== "" && parseInt(respuesta.anioFabricacion) != 0) {

                        if (parseInt(respuesta.antiguedadFabricacion) > 20) {
                           return this.funcionesMtcService.mensajeError('No se puede registrar el vehículo porque supera los 20 años de antigüedad, conforme a los numerales 3 y 4 del Art. 43° del D.S. N° 021-MTC-2008.');
                        }
                     } else {
                        return this.funcionesMtcService.mensajeError('El vehículo no cuenta con año de fabricación y/o año de modelo para validar los años de antigüedad, conforme a los numerales 3 y 4 del Art. 43° del D.S. N° 021-MTC-2008.');
                     }
                  }
               }
            }

            /********************VALIDAMOS TITULARIDAD******************************************** */
            if (this.codigoProcedimientoTupa == "DSTT-027" || this.codigoProcedimientoTupa == "DSTT-033" || this.codigoProcedimientoTupa == "DSTT-034"
               || this.codigoProcedimientoTupa == "DSTT-036" || this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038"
               || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040" || (this.codigoProcedimientoTupa == "DSTT-032" 
               && (this.codigoTipoSolicitudTupa == '5' || this.codigoTipoSolicitudTupa == '6' || this.codigoTipoSolicitudTupa == '7'))) {
               console.log(this.propietarios.find(i => i.documento.trim() == this.partida.trim()));

               if (this.propietarios.find(i => i.documento.trim() == this.partida.trim()) == undefined) {
                  if (this.tipoPersona == 2 || this.tipoPersona == 5) { //Persona Jurídica
                     if (this.propietarios.find(i => i.documento.trim() == this.rucSolicitante.trim()) == undefined) {
                        //return this.funcionesMtcService.mensajeError('La partida registral del vehículo no corresponde a la empresa. Deberá ingresar el contrato C.A.F.');
                        // this.visibleButtonAnexo = true;
                        this.esPropietario = false;
                     }
                     else {
                        if (this.propietarios.length > 1) {
                           this.visibleButtonAnexo = true;
                           this.funcionesMtcService.mensajeInfo('El vehículo tiene más de un propietario, por lo que, deberá adjuntar la Declaración Jurada de Copropiedad por cada propietario en la sección de Documentos Adicionales.');
                        }
                        this.esPropietario = true;
                     }
                  } else {
                     this.esPropietario = false;
                  }
               } else {
                  if (this.propietarios.length > 1) {
                     this.visibleButtonAnexo = true;
                     this.funcionesMtcService.mensajeInfo('El vehículo tiene más de un propietario, por lo que, deberá adjuntar la Declaración Jurada de Copropiedad por cada propietario en la sección de Documentos Adicionales.');
                  }
                  this.esPropietario = true;
               }
            }
            /* mercancías */
            /*if (this.codigoProcedimientoTupa == "DSTT-032" && (this.codigoTipoSolicitudTupa == "6" || this.codigoTipoSolicitudTupa == "7")) { 
                if (this.propietarios.find(i => i.documento.trim() == this.partida.trim()) == undefined) {
                    if (this.tipoPersona == 2 || this.tipoPersona == 5) { //Persona Jurídica
                        if (this.propietarios.find(i => i.documento.trim() == this.rucSolicitante.trim()) == undefined) {
                            //return this.funcionesMtcService.mensajeError('La partida registral del vehículo no corresponde a la empresa. Deberá ingresar el contrato C.A.F.');
                            this.esPropietario = false;
                        }
                        else {
                            if (this.propietarios.length > 1) {
                                this.funcionesMtcService.mensajeInfo('El vehículo tiene ' + this.propietarios.length + ' propietarios. Deberá adjuntar la declaración jurada del copropietario en la sección de Documentos Adicionales.');
                            }
                            this.esPropietario = true;
                        }

                    } else {
                        this.esPropietario = false;
                    }
                } else {
                    if (this.propietarios.length > 1) {
                        this.funcionesMtcService.mensajeInfo('El vehículo tiene ' + this.propietarios.length + ' propietarios. Deberá adjuntar la declaración jurada del copropietario en la sección de Documentos Adicionales.');
                    }
                    this.esPropietario = true;
                }
            }*/

            /* VALIDACION DE CITV */
            let band = false;
            let placasNumero: string[] = [];
            const citv = this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa);
            const nombreCitv = this.serviciosCitv.find(i => i.tipoServicio === citv.tipoServicio)?.nomServicio;

            if (respuesta.citvs.length > 0) {
               for (const placa of respuesta.citvs) {
                  if (this.paTipoServicio.find(i =>
                     i.pa === this.codigoProcedimientoTupa &&
                     i.tipoSolicitud == this.codigoTipoSolicitudTupa &&
                     i.tipoServicio == placa.tipoId) !== undefined
                  ) {
                     if (placa.ambito.trim() == "NACIONAL") {
                        // return this.funcionesMtcService.mensajeError('El ámbito del CITV debe ser de ámbito NACIONAL.');
                        // placaNumero = placa.numero;

                        /* DSTT-036 La fecha de vencimiento debe ser mayor de 6 meses */
                        let fechaactual = new Date();
                        let fechaVencimiento;
                        switch (this.codigoProcedimientoTupa) {
                           case "DSTT-036":
                              /*let fecha6meses = new Date(fechaactual.setMonth(fechaactual.getMonth() + 6));
                              fechaVencimiento = stringToDate(placa.fechaVencimiento);

                              if (fechaVencimiento >= fecha6meses) {*/
                              placasNumero.push(placa.numero)
                              band = true;
                              //}
                              break;

                           case "DSTT-030":
                              /*let fecha12meses = new Date(fechaactual.setMonth(fechaactual.getMonth() + 12));
                              fechaVencimiento = stringToDate(placa.fechaVencimiento);

                              if (fechaVencimiento >= fecha12meses) {*/
                              placasNumero.push(placa.numero)
                              band = true;
                              //}
                              break;

                           default: placasNumero.push(placa.numero)
                              band = true;
                              break;
                        }

                     }
                     /***/
                  }
               }

               if (respuesta.nuevo) {
                  if (this.codigoProcedimientoTupa == "DSTT-036" || this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038" || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040") {
                     if (placasNumero.length > 0) {
                        this.listaPlacaNumero = placasNumero;
                        this.formAnexo.controls.citv.setValue(this.listaPlacaNumero[0]);
                     }
                     else {
                        this.visibleControlCert = false;
                        return this.funcionesMtcService.mensajeError('Para el procedimiento ' + this.codigoProcedimientoTupa + ', los vehículos nuevos deben tener CITV');
                     }
                  } else {
                     this.listaPlacaNumero = placasNumero.length > 0 ? placasNumero : ['-']
                     this.formAnexo.controls.citv.setValue(this.listaPlacaNumero[0]);

                     if (placasNumero.length === 0) {
                        this.visibleControlCert = true;
                     } else {
                        this.visibleControlCert = false;
                     }
                  }
               } else {
                  if (!band) {
                     return this.funcionesMtcService.mensajeError('El CITV no corresponde al servicio específico solicitado. El CITV debe ser para el ' + nombreCitv + ' y de Ámbito NACIONAL.');
                  } else {
                     this.listaPlacaNumero = placasNumero.length > 0 ? placasNumero : ['-']
                     this.formAnexo.controls.citv.setValue(this.listaPlacaNumero[0]);
                  }
               }
            } else {
               if (respuesta.nuevo) {
                  // this.formAnexo.controls.citv.setValue('-');
                  /* DSTT-036 TODOS DEBEN TENER CITV  */
                  if (this.codigoProcedimientoTupa == "DSTT-036" || this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038" || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040") {
                     this.visibleControlCert = false;
                     return this.funcionesMtcService.mensajeError('Para el procedimiento ' + this.codigoProcedimientoTupa + ', los vehículos nuevos deben tener CITV');
                  } else {
                     this.listaPlacaNumero = ['-']
                     this.formAnexo.controls.citv.setValue(this.listaPlacaNumero[0]);
                     this.visibleControlCert = true;
                  }

               } else {
                  return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');
               }
            }

            if (this.listaPlacaNumero.length > 1)
               this.formAnexo.controls.citv.enable()
            else
               this.formAnexo.controls.citv.disable()
         },
         error => {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('En este momento el servicio de SUNARP no se encuentra disponible. Vuelva a intentarlo más tarde.');
         }
      );
   }

   listarRutas(): void {
      //this.ruc = "20219774207";
      this.renatService.GetRutas(this.ruc).subscribe((resp) => {
         const rutasVigentes = JSON.parse(JSON.stringify(resp));
         this.rutas = rutasVigentes;
         //console.log(this.rutas);
         this.funcionesMtcService.ocultarCargando();
      }, error => {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio de RENAT y recuperar datos de las rutas vigentes');
      });
   }

   buscarRuta(): void {

      let nroRuta = this.formAnexo.controls.cmbRutas.value.trim();
      /*nroRuta = nroRuta.padStart(4, 0);
      console.log('Nro de Ruta:' + nroRuta);
  
      this.renatService.GetRutas(this.ruc).subscribe(resp => {
        if (resp === 0) {
          console.log('error');
          this.funcionesMtcService.ocultarCargando();
          this.funcionesMtcService.mensajeError('No hay rutas registradas para esta Empresa');
          return;
        } else {
          const rutas = JSON.parse(JSON.stringify(resp));
          console.log(rutas.find(i => i.codRuta === nroRuta));*/

      const ruta = this.rutas.find(i => i.codRuta === nroRuta);
      this.formAnexo.controls.origenRuta.setValue(ruta.origen_ruta);
      this.formAnexo.controls.destinoRuta.setValue(ruta.destino_ruta);
      this.formAnexo.controls.itinerario.setValue(ruta.itinerario);
      this.formAnexo.controls.escalasComerciales.setValue(ruta.escalacomercial);
      this.formAnexo.controls.frecuencias.setValue(ruta.desc_frecuencia);
      //this.formAnexo.controls.diasSalida.setValue(ruta.horario_salida);
      this.formAnexo.controls.horasSalida.setValue(ruta.horario_salida);
      this.formAnexo.controls.modalidadServicio.setValue(ruta.cod_modalidad);
      //this.formAnexo.controls.flotaOperativa.setValue(ruta.flota_operativa);
      //this.formAnexo.controls.flotaReserva.setValue(ruta.flota_reserva);
      //this.formAnexo.controls.vigencia_fechaini.setValue(ruta.vigencia_fechaini);
      //this.formAnexo.controls.vigencia_fechafin.setValue(ruta.vigencia_fechafin);

      /*  }
      },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        });*/
   }

   changePlacaRodaje(): void {
      this.formAnexo.controls.soat.setValue('');
      this.formAnexo.controls.citv.setValue('');
      this.formAnexo.controls.citv.disable()
      this.formAnexo.controls.aseguradora.setValue('');
      this.formAnexo.controls.condicion.setValue('');
      this.formAnexo.controls.celular.setValue('');
      this.valCaf = 0;
      this.valCao = 0;
      this.valCert = 0;
      this.valCel = 0;
      this.visibleControlCert = false;
      this.categoriaVehiculo = '';
      this.formAnexo.controls.caf.setValue(false);
      this.visibleButtonCaf = false;
      this.filePdfCafSeleccionado = false;
      this.filePdfCafPathName = "";
      this.listaPlacaNumero = [];
   }

   departamentos(): void {
      this.ubigeoService.departamento().subscribe(
         (dataDepartamento) => {
            this.listaDepartamentos = dataDepartamento;
            this.funcionesMtcService.ocultarCargando();
         },
         error => {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de los departamentos');
         });
   }

   save(): void {
      let numeroRuta: string = "";
      let nombreNumeroRuta: string = "";

      if (this.formAnexo.invalid === true) {
         this.formAnexo.markAllAsTouched();
         this.findInvalidControls();
         this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
         return;
      }

      if (this.codigoProcedimientoTupa == "DSTT-032" && this.codigoTipoSolicitudTupa == "1") {
         numeroRuta = this.formAnexo.controls.cmbRutas.value;

         if (numeroRuta == "") {
            this.funcionesMtcService.mensajeError('Debe seleccionar una ruta.');
            return;
         } else {
            nombreNumeroRuta = this.rutas.filter(item => item.codRuta == numeroRuta)[0].origen_ruta + "  " + this.rutas.filter(item => item.codRuta == numeroRuta)[0].destino_ruta;
         }
      }

      if (this.codigoProcedimientoTupa == "DSTT-025") {
         if (this.formAnexo.controls.origenRuta.value.trim() == "" || this.formAnexo.controls.destinoRuta.value.trim() == "" || this.formAnexo.controls.itinerario.value.trim() == ""
            || this.formAnexo.controls.modalidadServicio.value == "" || this.formAnexo.controls.distancia.value.trim() == "" || this.formAnexo.controls.tiempoAproxViaje.value.trim() == "") {
            this.funcionesMtcService.mensajeError('Debe completar los campos obligatorios.');
            return;
         }
      }

      if (this.habilitarSeccion2) {
         const clase = this.formAnexo.controls.clase.value;
         if (clase == "") {
            this.funcionesMtcService.mensajeError('Debe ingresar la clase de servicio.');
            return;
         }
      }

      if (this.vehiculos.length < this.cantidadVehiculo) {
         this.funcionesMtcService.mensajeError('Debe ingresar al menos ' + this.cantidadVehiculo + '  flota  vehicular');
         return;
      }

      if (this.visibleControlRuta) {
         if (this.formAnexo.controls.cmbRutas.value.trim() == "") {
            this.funcionesMtcService.mensajeError('Debe seleccionar la ruta');
            return;
         }
      }

      if (this.conductores.length === 0 && !this.opcionalRelacionConductores) {
         this.funcionesMtcService.mensajeError('Debe ingresar al menos un conductor');
         return;
      }

      if (this.habilitarSeccion5) {
         if (!this.direccionInfra.valid ||
            !this.depaInfra.valid ||
            !this.provInfra.valid ||
            !this.distInfra.valid ||
            !this.posesionInfra.valid ||
            !this.vigenciaInfra.valid) {
            this.funcionesMtcService.mensajeError('Debe completar toda la información de los terminales terrestres');
            return;
         }
      }

      // if (this.conductores.length === 0)
      //   return this.funcionesMtcService.mensajeError('Debe ingresar al menos un conductor vehicular');

      const dataGuardar: Anexo003_A17_2Request = new Anexo003_A17_2Request();
      // -------------------------------------
      dataGuardar.id = this.idAnexo;
      dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
      dataGuardar.anexoId = 1;
      dataGuardar.codigo = 'A';
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

      // SECCION (itinerario):
      const itinerario: A003_A172_Seccion_Itinerario = new A003_A172_Seccion_Itinerario();
      const modalidadServicio: ModalidadServicio = new ModalidadServicio();

      const fechaPartida = (
         this.formAnexo.get('fechaPartida').value ?
            this.formAnexo.get('fechaPartida').value.year + '/' + this.formAnexo.get('fechaPartida').value.month + '/' + this.formAnexo.get('fechaPartida').value.day : '');

      let fechaLlegada
      if (this.txtFechaLlegada) {
         fechaLlegada = (
            this.formAnexo.get('fechaLlegada').value ?
               this.formAnexo.get('fechaLlegada').value.year + '/' + this.formAnexo.get('fechaLlegada').value.month + '/' + this.formAnexo.get('fechaLlegada').value.day : '');

      }

      itinerario.origenRuta = this.formAnexo.get('origenRuta').value?.toUpperCase();
      itinerario.destinoRuta = this.formAnexo.get('destinoRuta').value?.toUpperCase();
      itinerario.itinerario = this.formAnexo.get('itinerario').value?.toUpperCase();
      itinerario.fechaPartida = fechaPartida;
      itinerario.fechaLlegada = fechaLlegada;
      itinerario.vias = this.formAnexo.get('vias').value.toUpperCase();
      itinerario.escalasComerciales = this.formAnexo.get('escalasComerciales').value.toUpperCase();
      itinerario.estaciones = this.formAnexo.get('estaciones').value.toUpperCase();
      itinerario.frecuencias = this.formAnexo.get('frecuencias').value.toUpperCase();

      itinerario.distancia = this.formAnexo.get('distancia').value;
      // itinerario.diasSalida = this.formAnexo.get('diasSalida').value;
      itinerario.horasSalida = this.formAnexo.get('horasSalida').value;
      itinerario.claseServicio = this.formAnexo.get('claseServicio').value;
      itinerario.tiempoAproxViaje = this.formAnexo.get('tiempoAproxViaje').value;

      if (this.habilitarSeccion1) {
         if (this.txtModalidadServicio) {

            modalidadServicio.id = this.formAnexo.controls.modalidadServicio.value;
            modalidadServicio.descripcion = this.listaModalServicio.filter(item =>
               item.id == this.formAnexo.get('modalidadServicio').value
            )[0].descripcion
         }
         else {
            modalidadServicio.id = 0;
            modalidadServicio.descripcion = '';

         }
      } else {
         modalidadServicio.id = 0;
         modalidadServicio.descripcion = '';
      }
      itinerario.modalidadServicio = modalidadServicio;
      itinerario.numeroRuta = numeroRuta;
      itinerario.nombreNumeroRuta = nombreNumeroRuta;

      dataGuardar.metaData.itinerario = itinerario;
      dataGuardar.metaData.clase = (this.habilitarSeccion2 ? this.formAnexo.get('clase').value : '');
      dataGuardar.metaData.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
      dataGuardar.metaData.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
      dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
      dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;

      // SECCION (renat):
      const renat: A003_A172_Seccion_Renat = new A003_A172_Seccion_Renat();

      renat.listaVehiculos = this.vehiculos.map(vehiculo => {
         return {
            caf: vehiculo.caf,
            cao: vehiculo.cao,
            cert: vehiculo.cert,
            cel: vehiculo.cel,
            placaRodaje: vehiculo.placaRodaje,
            soat: vehiculo.soat,
            aseguradora: vehiculo.aseguradora,
            citv: vehiculo.citv,
            fileCaf: vehiculo.fileCaf,
            fileCao: vehiculo.fileCao,
            fileCert: vehiculo.fileCert,
            fileCel: vehiculo.fileCel,
            pathNameCaf: vehiculo.pathNameCaf,
            pathNameCao: vehiculo.pathNameCao,
            pathNameCert: vehiculo.pathNameCert,
            pathNameCel: vehiculo.pathNameCel,
            categoria: vehiculo.categoria,
            condicion: vehiculo.condicion,
            celular: vehiculo.celular
         } as Vehiculo;
      });
      console.log('renat.listaVehiculos', renat.listaVehiculos);

      const datosLocal: DatosLocal = new DatosLocal();

      renat.datosLocal = datosLocal;
      dataGuardar.metaData.renat = renat;

      // SECCION (Relación de Conductores)
      const relacionConductores: Conductor[] = this.conductores.map(conductor => {
         return {
            numeroDni: conductor.numeroDni,
            nombresApellidos: conductor.nombresApellidos,
            edad: '',
            numeroLicencia: conductor.numeroLicencia,
            categoria: conductor.categoria,
            subcategoria: conductor.subcategoria
         } as Conductor;
      });

      dataGuardar.metaData.relacionConductores = relacionConductores;

      // Seccion 5
      dataGuardar.metaData.direccionInfra = this.direccionInfra.value ?? '';
      dataGuardar.metaData.depaInfra = this.ubigeoComponent?.getDepartamentoText() ?? '';
      dataGuardar.metaData.provInfra = this.ubigeoComponent?.getProvinciaText() ?? '';
      dataGuardar.metaData.distInfra = this.ubigeoComponent?.getDistritoText() ?? '';
      dataGuardar.metaData.posesionInfra = this.posesionInfra.value ?? '';
      dataGuardar.metaData.vigenciaInfra = this.vigenciaInfra.value ? this.vigenciaInfra.value.toStringFecha() : '';

      console.log(JSON.stringify(dataGuardar, null, 10));
      console.log(JSON.stringify(dataGuardar));

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
      // console.log('dataGuardarFormData',dataGuardarFormData);

      this.funcionesMtcService
         .mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(async () => {
            this.funcionesMtcService.mostrarCargando();

            if (this.idAnexo === 0) {
               // GUARDAR:
               try {
                  const data = await this.anexoService.post(dataGuardarFormData).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.idAnexo = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;

                  this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
               } catch (error) {
                  console.error(error);
                  this.funcionesMtcService
                     .ocultarCargando()
                     .mensajeError('Problemas para realizar el guardado de datos');
               }
            } else {
               // MODIFICAR
               for (const dataRequisito of this.dataRequisitosInput) {

                  // if (this.dataInput.tramiteReqRefId === dataRequisito.tramiteReqId) {
                  // if (dataRequisito.movId === 0) {
                  //   this.activeModal.close(this.graboUsuario);
                  //   this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
                  //   return;
                  // }
                  // }

                  if (dataRequisito.codigoFormAnexo === 'ANEXO_003_B17_2') {
                     this.codAnexo = dataRequisito.codigoFormAnexo;
                     this.reqAnexo = dataRequisito.tramiteReqId;
                     console.log('======> ' + this.reqAnexo);
                     // if(dataRequisito.movId > 0){
                     this.movIdAnexo = dataRequisito.movId;
                     // this.activeModal.close(this.graboUsuario);
                     // this.funcionesMtcService.mensajeError('Debe completar el '+dataRequisito.codigoFormAnexo);
                     // return;

                     // }
                  }
               }

               if (this.movIdAnexo > 0) {
                  this.funcionesMtcService.ocultarCargando();
                  this.funcionesMtcService
                     .mensajeConfirmar('Deberá volver a grabar el anexo ' + this.codAnexo + '¿Desea continuar?')
                     .then(async () => {
                        // MODIFICAR
                        try {
                           const data = await this.anexoService.put(dataGuardarFormData).toPromise();
                           this.funcionesMtcService.ocultarCargando();
                           this.idAnexo = data.id;
                           this.uriArchivo = data.uriArchivo;
                           this.graboUsuario = true;
                           try {
                              await this.formularioTramiteService.uriArchivo<any>(this.movIdAnexo).toPromise();
                              this.funcionesMtcService.ocultarCargando();
                           } catch (error) {
                              this.funcionesMtcService
                                 .ocultarCargando()
                                 .mensajeError('Problemas para realizar la modificación de los anexos');
                           }
                           this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
                        } catch (error) {
                           console.error(error);
                           this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                        }
                     });
               } else {
                  try {
                     const data = await this.anexoService.put(dataGuardarFormData).toPromise();
                     this.funcionesMtcService.ocultarCargando();
                     this.idAnexo = data.id;
                     this.uriArchivo = data.uriArchivo;

                     this.graboUsuario = true;

                     this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
                  } catch (error) {
                     console.error(error);
                     this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('Problemas para realizar la modificación de datos del anexo');
                  }

               }
            }
         });
   }

   async buscarNumeroLicencia(): Promise<void> {
      /** Servicio de SNC
    * 1: RUC
    * 2: DNI
    * 4: CE
    * 5: CS
    * 6: Pasaporte
    * 13: TI (Tarjeta de identidad)
    * 14: PTP Permiso Temporal de permanencia
    */
      let tipoDocumento: string = this.formAnexo.controls.tipoDocumentoConductor.value;
      let nombreTipoDocumento: string = "";
      const numeroDocumento: string = this.formAnexo.controls.numeroDocumentoConductor.value.trim();

      if (tipoDocumento == "01") { tipoDocumento = "2"; nombreTipoDocumento = "L.E."; }
      if (tipoDocumento == "04") { tipoDocumento = "4"; nombreTipoDocumento = "C.E."; }
      if (tipoDocumento == "05" || tipoDocumento == "06") { tipoDocumento = "14"; nombreTipoDocumento = "P.T.P."; }

      if (tipoDocumento == "2" && numeroDocumento.length !== 8) {
         this.funcionesMtcService.mensajeError('DNI debe tener 8 dígitos');
         return;
      }

      if (tipoDocumento == "4" && numeroDocumento.length !== 9) {
         this.funcionesMtcService.mensajeError('Carnet de Extranjería debe tener 9 dígitos');
         return;
      }

      if (tipoDocumento == "14" && numeroDocumento.length !== 9) {
         this.funcionesMtcService.mensajeError('PTP debe tener 9 dígitos');
         return;
      }

      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
         if (this.vehiculos?.length <= 0) {
            this.funcionesMtcService.mensajeError('Primero debe registrar la flota vehicular');
            return;
         }
      }

      this.funcionesMtcService.mostrarCargando();
      try {
         const respuesta = await this.mtcService.getLicenciasConducir(parseInt(tipoDocumento), numeroDocumento).toPromise();
         this.funcionesMtcService.ocultarCargando();
         const datos: any = respuesta[0];
         console.log('DATOS getLicenciasConducir:', JSON.stringify(datos, null, 10));

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ01') {
            return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir.');
         }

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ02' || datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ03') {
            this.servicioSnc = false;
            if (tipoDocumento == "2") {
               this.reniecService.getDni(numeroDocumento).subscribe(
                  (respuesta) => {
                     this.funcionesMtcService.ocultarCargando();

                     if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                     }
                     const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                     if (datosPersona.restriccion.trim() == "FALLECIMIENTO") {
                        return this.funcionesMtcService.mensajeError('No puede registrar un conductor fallecido');
                     }
                     this.formAnexo.controls.nombresApellidos.setValue(datosPersona.apPrimer + " " + datosPersona.apSegundo + ", " + datosPersona.prenombres);
                  },
                  (error) => {
                     this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de RENIEC no se encuentra disponible. Debe ingresar los datos en los campos correspondientes.');
                     this.formAnexo.controls.nombresApellidos.enable();
                  }
               );
            } else {
               if (tipoDocumento == "4") {
                  this.extranjeriaService.getCE(numeroDocumento).subscribe(
                     (respuesta) => {
                        this.funcionesMtcService.ocultarCargando();

                        if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
                           return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
                        this.formAnexo.controls.nombresApellidos.setValue(respuesta.CarnetExtranjeria.primerApellido + " " + respuesta.CarnetExtranjeria.segundoApellido + ", " + respuesta.CarnetExtranjeria.nombres);
                     },
                     (error) => {
                        this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de MIGRACIONES no se encuentra disponible. Debe ingresar los datos en los campos correspondientes.');
                        this.formAnexo.controls.nombresApellidos.enable();
                     }
                  );
               } else {
                  this.formAnexo.controls.nombresApellidos.enable();
               }
            }
            this.formAnexo.controls.numeroLicencia.enable();
            this.formAnexo.controls.categoria.enable();
            return this.funcionesMtcService.mensajeError('No se encuentra información de la licencia de conducir. Deberá ingresar los datos en los campos correspondientes.');
         }

         if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Vencida') {
            return this.funcionesMtcService.mensajeError('La licencia esta  Vencida');
         }

         if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Bloqueado') {
            return this.funcionesMtcService.mensajeError('La licencia esta  Bloqueado');
         }

         // VALIDAMOS LA CATEGORIA DE LAS LICENCIAS DE CONDUCIR
         if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
            let categoriaValida = false;
            const categoriaConductor = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim() ?? '';

            for (const vehiculo of this.vehiculos) {
               const categoriaVehiculo = vehiculo.categoria;

               console.log('categoriaVehiculo:', categoriaVehiculo);
               console.log('categoriaConductor:', categoriaConductor);

               if (categoriaVehiculo === 'M2' || categoriaVehiculo === 'M2C3') {
                  if (categoriaConductor == 'A IIb' || categoriaConductor == 'A IIIa' || categoriaConductor == 'A IIIb' || categoriaConductor == 'A IIIc') {
                     this.formAnexo.controls.categoria.setValue(categoriaConductor);
                     categoriaValida = true;
                  }
               }

               if (categoriaVehiculo === 'M3' || categoriaVehiculo === 'M3C3') {
                  if (categoriaConductor == 'A IIIa' || categoriaConductor == 'A IIIb' || categoriaConductor == 'A IIIc') {
                     this.formAnexo.controls.categoria.setValue(categoriaConductor);
                     categoriaValida = true;
                  }
               }
            }
            if (!categoriaValida) {
               this.funcionesMtcService.mensajeError('La categoría ' + categoriaConductor + ' de la licencia de conducir no corresponde a las categorías de los vehículos registrados');
               return;
            }
         }
         const ApellidoPaterno = datos.GetDatosLicenciaMTCResult.Licencia.ApellidoPaterno.trim();
         const ApellidoMaterno = datos.GetDatosLicenciaMTCResult.Licencia.ApellidoMaterno.trim();
         const Nombres = datos.GetDatosLicenciaMTCResult.Licencia.Nombre.trim();
         const Licencia = datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim();


         this.confirmarConductor(`${ApellidoPaterno} ${ApellidoMaterno} ${Nombres}`, Licencia);
         this.formAnexo.controls.numeroLicencia.setValue(datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim());

      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio MTC Licencias Conducir');
      }
   }

   private confirmarConductor(datos: string, licencia: string): void {
      this.funcionesMtcService
         .mensajeConfirmar(`Los datos fueron validados por el SNC y corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.formAnexo.controls.nombresApellidos.setValue(datos);
            this.formAnexo.controls.numeroLicencia.setValue(licencia);

         });
   }

   async validaAutorizacion(): Promise<void> {
      try {
         const data: any = await this.renatService.EmpresaServicioVigencia(this.ruc, parseInt(this.codigoTipoSolicitudTupa, 10), 0, 0, false).toPromise();
         console.log('infoautorizacion = ', data.length);
         if (data.length === 0) {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('La empresa no cuenta con autorización vigente para el ' + this.descTipoSolicitudTupa);
         }
      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para verificar la autorización de la Empresa.');
      }
   }

   // validacionRenat(){
   //   //console.log("DATAINPUT" , this.dataInput);

   //   //this.validaAutorizacion();

   //   this.renatService.obtainFlotaReserva(this.ruc).subscribe((data :any) => {

   //     console.log("infoflota", data);
   //     this.formAnexo.get("flotaOperativa").setValue(data.flotaoper);

   //     this.formAnexo.get("flotaReserva").setValue(data.flotareserva);

   //   },error =>{
   //     this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener la flota de reserva');
   //   });
   // }

   async validaConductor(dato: DatosPersona): Promise<void> {
      const dni = this.formAnexo.get('numeroDni').value;
      try {
         const data: any = await this.renatService.estaEnNomina(this.ruc, dni).toPromise();
         if (data === 0) {
            this.funcionesMtcService.mensajeError('Conductor no está en nómina');
            return;
         }
         //this.buscarNumeroLicencia(dato);
      } catch (error) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas al consultar servicio.');
      }
   }

   async descargarPdf(): Promise<void> {
      if (this.idAnexo === 0) {
         this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
         return;
      }

      this.funcionesMtcService.mostrarCargando();

      try {
         const file: Blob = await this.visorPdfArchivosService.get(this.uriArchivo).toPromise();
         this.funcionesMtcService.ocultarCargando();

         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(file);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 003-A/17.02';
      } catch (error) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
      }
   }

   handleFileInput(files: FileList): void {
      this.fileToUpload = files.item(0);
   }

   formInvalid(control: string): boolean {
      if (this.formAnexo.get(control)) {
         return this.formAnexo.get(control).invalid && (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
      }
   }

   async downloadPlantilla(plantilla: string): Promise<void> {
      this.funcionesMtcService.mostrarCargando();

      try {
         if (plantilla != '') {
            const response: Blob = await this.visorPdfArchivosService.getPlantilla(plantilla).toPromise();
            this.funcionesMtcService.ocultarCargando();

            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(response);
            downloadLink.setAttribute('download', plantilla);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.parentNode.removeChild(downloadLink);
         }
      }
      catch (e) {
         console.error(e);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar el archivo PDF');
      }
   }

   public findInvalidControls() {
      const invalid = [];
      const controls = this.formAnexo.controls;
      for (const name in controls) {
         if (controls[name].invalid) {
            invalid.push(name);
         }
      }

      console.log(invalid);
   }
}
