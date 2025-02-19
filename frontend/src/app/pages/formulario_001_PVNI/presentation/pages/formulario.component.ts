/**
 * Formulario 001/PVNI
 * @author Hugo Cano
 * @version 1.0 21.03.2024
 */

import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray, ValidationErrors, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Formulario001_PVNIRequest } from 'src/app/pages/formulario_001_PVNI/domain/Formulario001_PVNIRequest';
import { Formulario001_PVNIResponse } from 'src/app/pages/formulario_001_PVNI/domain/Formulario001_PVNIResponse';
import { MetaData } from 'src/app/pages/formulario_001_PVNI/domain/MetaData';
import { Aeronave, Tripulacion, InformacionVuelo } from 'src/app/pages/formulario_001_PVNI/domain/Secciones';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Formulario001PVNIService } from 'src/app/pages/formulario_001_PVNI/application';
import { SiidgacService } from 'src/app/core/services/siidgac/siidgac.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  formularioFG: UntypedFormGroup;
  opcionSeleccionada: string = '1';
  esActualizacion: boolean = false;
  esVisibleCampoPermisoVuelo = true;
  errorServicioReniec: boolean = false;
  errorServicioSunat: boolean = false;
  errorServicioMigracion: boolean = false;
  errorCargandoDatos: boolean = false;
  aeronaveFG: UntypedFormGroup;
  tripulacionFG: UntypedFormGroup;
  infoVueloFG: UntypedFormGroup;
  fechaActual: Date = new Date();
  fechaPermisoInicio: Date | null = null;
  fechaPermisoFin: Date | null = null;
  fechaDeEntrada: Date | null = null;
  fechaTopeFin: Date | null = null;
  fechaTopeInicio: Date | null = null;
  contadorOrigen: number = 0;
  contadorDestino: number = 0;
  buscandoPermiso: boolean = false;
  readonlyMode: boolean = false;
  textoBusquedaPermiso: string = 'Si desea buscar un permiso de vuelo de su historico para su nueva solicitud ingrese el número de permiso / If you want to search for a flight permit from your history for your new application, enter the permit number';

  graboUsuario = false;
  id = 0;
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  listaPais: any[];
  listaTipoVuelo: any[];
  listaNacionalidad: any[];
  listaTipoTripulante: any[];
  listaOrigen: string[] = [];
  listaDestino: string[] = [];

  listaTipoVueloAUtilizar: { id: string; descripcion: string }[]; 

  listaAmbito: { id: string; descripcion: string }[] = [
    { id: '1', descripcion: 'NACIONAL' },
    { id: '2', descripcion: 'INTERNACIONAL' },
  ];

  /*listaMatriculas: { matricula: string; fabricante: string }[] = [
    { id: '1', descripcion: 'NACIONAL' },
    { id: '2', descripcion: 'INTERNACIONAL' },
  ];*/

  listaTipoVueloNacional: { id: string; descripcion: string }[] = [
    { id: '1', descripcion: 'Civico' },
    { id: '2', descripcion: 'Escala Tecnica' },
    { id: '1', descripcion: 'Exploracion' },
    { id: '2', descripcion: 'Privado' },
    { id: '1', descripcion: 'Vuelo de comprobación' },
    { id: '2', descripcion: 'Vuelo de Demostracion' },
    { id: '2', descripcion: 'Vuelo local' }
  ];

  listaTipoVueloInternacional: { id: string; descripcion: string }[] = [
    { id: '1', descripcion: 'Ayuda Humanitaria' },
    { id: '2', descripcion: 'Ambulancia Aerea' },
    { id: '3', descripcion: 'Escala Tecnica' },
    { id: '4', descripcion: 'Traslado Ferry' },
    { id: '5', descripcion: 'Traslado Posicionamiento' },
    { id: '6', descripcion: 'Otros' },
  ];

  listaOpcionesHoras: { id: string; descripcion: string }[] = [
    { id: '24', descripcion: '24 HORAS / HOURS' },
    { id: '48', descripcion: '48 HORAS / HOURS' },
    { id: '72', descripcion: '72 HORAS / HOURS' }
  ];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];

  txtTitulo = 'FORMULARIO 001-PVNI SOLICITUD DE PERMISO NACIONAL/INTERNACIONAL DE AVIACION GENERAL';
  nroDocumentoLogin: string;
  nroRuc = '';
  razonSocial: string;

  tipoSolicitante: string;
  codTipoDocSolicitante: string; // 01 DNI  03 CI  04 CE

  indexEditAeronave = -1;
  indexEditInfoVuelo = -1;
  indexEditTripulante = -1;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario001PVNIService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private SiidgacService: SiidgacService) {
  }

  ngOnInit(): void {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;
    this.txtTitulo = this.dataInput.descripcion; 

    console.log('tramite selected: ', tramiteSelected);
    console.log('dataInput: ', this.dataInput);

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    this.formularioFG = this.formBuilder.group({
      f_Seccion1FG: this.formBuilder.group({
        f_s1_TipoSolicitudFG: this.formBuilder.group({
          f_s1_ts_OpcionesRadioButtonFC: ['1'],
          f_s1_ts_PermisoVueloFC: ['', [noWhitespaceValidator(), Validators.maxLength(13)]],
        }),
        f_s1_DatosOperadorFG: this.formBuilder.group({
          f_s1_do_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.pattern(/^([A-Za-záéíóúÁÉÍÓÚÑñ]{2,}\s?){1}([A-Za-záéíóúÁÉÍÓÚÑñ\.]{2,}\s?){2,7}$/)]],
          f_s1_do_PaisFC: ['', [Validators.required]],
          f_s1_do_DomicilioLegalFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_do_TelefonoFC: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?\d{3,15}$/)]],
          f_s1_do_EmailFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
          f_s1_do_UsuarioSiidgacFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        }),
        f_s1_DatosSolicitanteFG: this.formBuilder.group({
          f_s1_ds_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.pattern(/^([A-Za-záéíóúÁÉÍÓÚÑñ]{2,}\s?){1}([A-Za-záéíóúÁÉÍÓÚÑñ\.]{2,}\s?){2,7}$/)]],
          f_s1_ds_FboFC: ['', [noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_ds_CargoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_ds_TelefonoFC: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?\d{3,15}$/)]],
          f_s1_ds_EmailFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
          f_s1_ds_NotificarFC: [false, [Validators.requiredTrue]],
        }),
        f_s1_FacturarAFG: this.formBuilder.group({
          f_s1_fa_OpcionesRadioButtonFC: ['3'],
          f_s1_fa_NombreORazonFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_fa_DomicilioLegalFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_fa_TelefonoFC: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?\d{3,15}$/)]],
          f_s1_fa_EmailFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
        }),
        f_s1_DatosSolicitudFG: this.formBuilder.group({
          f_s1_sol_AmbitoFC: ['', [Validators.required]],
          f_s1_sol_TipoPermisoFC: ['SOBREVUELO INTERNACIONAL', [Validators.required]],
          f_s1_sol_TipoVueloFC: ['', [Validators.required]],
          f_s1_sol_NumeroPasajerosFC: ['', [noWhitespaceValidator(), Validators.maxLength(4)]],
          f_s1_sol_AdelantoDemoraFC: ['',],
        }),
      }),
      f_Seccion2FG: this.formBuilder.group({
        f_s2_FlotaAutorizada: [false, [Validators.required]],
        f_s2_AeronaveFA: this.formBuilder.array([], [Validators.required]),
      }),
      f_Seccion3FG: this.formBuilder.group({
        f_s3_TripulacionCalificada: [false, [Validators.required]],
        f_s3_TripulacionFA: this.formBuilder.array([], [Validators.required]),
      }),
      f_Seccion4FG: this.formBuilder.group({
        f_s4_InfoVueloFA: this.formBuilder.array([], [Validators.required]),
      }),
      f_Seccion5FG: this.formBuilder.group({
        f_s5_ComentariosFC: ['', [Validators.maxLength(2000), noWhitespaceValidator()]],
      }),
      f_Seccion6FG: this.formBuilder.group({
        f_s6_Declaracion1FC: [false, [Validators.requiredTrue]],
        f_s6_Declaracion2FC: [false, [Validators.requiredTrue]],
      }),
    });

    this.f_s1_TipoSolicitudFG.patchValue({
      f_s1_ts_OpcionesRadioButtonFC: '1'
    });

    this.f_s1_FacturarAFG.patchValue({
      f_s1_fa_OpcionesRadioButtonFC: '3'
    });

    //this.f_s1_sol_AmbitoFC.disable({ emitEvent: false });
    this.f_s1_sol_TipoPermisoFC.disable({ emitEvent: false });

    this.aeronaveFG = this.formBuilder.group({
      a_TipoAeronaveFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      a_MatriculaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      a_CallSignFC: ['', [noWhitespaceValidator(), Validators.maxLength(30)]],
      a_NumeroVueloFC: ['', [Validators.maxLength(10)]],
    });

    this.tripulacionFG = this.formBuilder.group({
      t_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.pattern(/^([A-Za-záéíóúÁÉÍÓÚÑñ]{2,}\s?){1}([A-Za-záéíóúÁÉÍÓÚÑñ\.]{2,}\s?){2,7}$/)]],
      t_CargoFC: ['', [Validators.required]],
      t_NacionalidadFC: ['', [Validators.required]],
    });

    this.infoVueloFG = this.formBuilder.group({
      iv_EntradaOrigenFC: ['', [noWhitespaceValidator(), Validators.pattern(/^[A-Za-z]{4}$/)]],
      iv_OrigenFC: ['', [Validators.required, noWhitespaceValidator()]],
      iv_EntradaDestinoFC: ['', [noWhitespaceValidator(), Validators.pattern(/^[A-Za-z]{4}$/)]],
      iv_DestinoFC: ['', [Validators.required]],
      iv_FechaEntradaFC: [null, [Validators.required]],
      iv_FechaSalidaFC: [null, [Validators.required]],
    });

    this.iv_OrigenFC.disable({ emitEvent: false });
    this.iv_DestinoFC.disable({ emitEvent: false });
  }

  async ngAfterViewInit(): Promise<void> {

    await this.obtenerListas();
    this.onChangeAmbito();
    this.onChangeFlotaAutorizada();
    this.onChangeTripulacionCalificada();

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();
    const tipoDocumento = this.seguridadService.getNameId();
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();

    //console.log('ruc: ', this.nroRuc);
    //console.log('razon social: ', this.razonSocial);
    //console.log('tipoDocumento: ', tipoDocumento);
    //console.log('nro documento Login: ', this.nroDocumentoLogin);

    await this.cargarDatos();
  }

  // GET FORM formularioFG
  get f_Seccion1FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion1FG') as UntypedFormGroup; }  //SI VA EN MODULO
  get f_s1_TipoSolicitudFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_TipoSolicitudFG') as UntypedFormGroup; }
  get f_s1_ts_OpcionesRadioButtonFC(): UntypedFormControl { return this.f_s1_TipoSolicitudFG.get(['f_s1_ts_OpcionesRadioButtonFC']) as UntypedFormControl; }
  get f_s1_ts_PermisoVueloFC(): UntypedFormControl { return this.f_s1_TipoSolicitudFG.get(['f_s1_ts_PermisoVueloFC']) as UntypedFormControl; }

  get f_s1_DatosOperadorFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_DatosOperadorFG') as UntypedFormGroup; }
  get f_s1_do_NombreFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_NombreFC']) as UntypedFormControl; }
  get f_s1_do_PaisFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_PaisFC']) as UntypedFormControl; }
  get f_s1_do_DomicilioLegalFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_DomicilioLegalFC']) as UntypedFormControl; }
  get f_s1_do_TelefonoFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_TelefonoFC']) as UntypedFormControl; }
  get f_s1_do_EmailFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_EmailFC']) as UntypedFormControl; }
  get f_s1_do_UsuarioSiidgacFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_UsuarioSiidgacFC']) as UntypedFormControl; }

  get f_s1_DatosSolicitanteFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_DatosSolicitanteFG') as UntypedFormGroup; }
  get f_s1_ds_NombreFC(): UntypedFormControl { return this.f_s1_DatosSolicitanteFG.get(['f_s1_ds_NombreFC']) as UntypedFormControl; }
  get f_s1_ds_FboFC(): UntypedFormControl { return this.f_s1_DatosSolicitanteFG.get(['f_s1_ds_FboFC']) as UntypedFormControl; }
  get f_s1_ds_CargoFC(): UntypedFormControl { return this.f_s1_DatosSolicitanteFG.get(['f_s1_ds_CargoFC']) as UntypedFormControl; }
  get f_s1_ds_TelefonoFC(): UntypedFormControl { return this.f_s1_DatosSolicitanteFG.get(['f_s1_ds_TelefonoFC']) as UntypedFormControl; }
  get f_s1_ds_EmailFC(): UntypedFormControl { return this.f_s1_DatosSolicitanteFG.get(['f_s1_ds_EmailFC']) as UntypedFormControl; }
  get f_s1_ds_NotificarFC(): UntypedFormControl { return this.f_s1_DatosSolicitanteFG.get(['f_s1_ds_NotificarFC']) as UntypedFormControl; }

  get f_s1_FacturarAFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_FacturarAFG') as UntypedFormGroup; }
  get f_s1_fa_OpcionesRadioButtonFC(): UntypedFormControl { return this.f_s1_FacturarAFG.get(['f_s1_fa_OpcionesRadioButtonFC']) as UntypedFormControl; }
  get f_s1_fa_NombreORazonFC(): UntypedFormControl { return this.f_s1_FacturarAFG.get(['f_s1_fa_NombreORazonFC']) as UntypedFormControl; }
  get f_s1_fa_DomicilioLegalFC(): UntypedFormControl { return this.f_s1_FacturarAFG.get(['f_s1_fa_DomicilioLegalFC']) as UntypedFormControl; }
  get f_s1_fa_TelefonoFC(): UntypedFormControl { return this.f_s1_FacturarAFG.get(['f_s1_fa_TelefonoFC']) as UntypedFormControl; }
  get f_s1_fa_EmailFC(): UntypedFormControl { return this.f_s1_FacturarAFG.get(['f_s1_fa_EmailFC']) as UntypedFormControl; }

  get f_s1_DatosSolicitudFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_DatosSolicitudFG') as UntypedFormGroup; }
  get f_s1_sol_AmbitoFC(): UntypedFormControl { return this.f_s1_DatosSolicitudFG.get(['f_s1_sol_AmbitoFC']) as UntypedFormControl; }
  get f_s1_sol_TipoPermisoFC(): UntypedFormControl { return this.f_s1_DatosSolicitudFG.get(['f_s1_sol_TipoPermisoFC']) as UntypedFormControl; }
  get f_s1_sol_TipoVueloFC(): UntypedFormControl { return this.f_s1_DatosSolicitudFG.get(['f_s1_sol_TipoVueloFC']) as UntypedFormControl; }
  get f_s1_sol_NumeroPasajerosFC(): UntypedFormControl { return this.f_s1_DatosSolicitudFG.get(['f_s1_sol_NumeroPasajerosFC']) as UntypedFormControl; }
  get f_s1_sol_AdelantoDemoraFC(): UntypedFormControl { return this.f_s1_DatosSolicitudFG.get(['f_s1_sol_AdelantoDemoraFC']) as UntypedFormControl; }

  get f_Seccion2FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion2FG') as UntypedFormGroup; }
  get f_s2_FlotaAutorizada(): UntypedFormControl { return this.f_Seccion2FG.get(['f_s2_FlotaAutorizada']) as UntypedFormControl; }
  get f_s2_AeronaveFA(): UntypedFormArray { return this.f_Seccion2FG.get('f_s2_AeronaveFA') as UntypedFormArray; }

  get f_Seccion3FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup; }
  get f_s3_TripulacionCalificada(): UntypedFormControl { return this.f_Seccion3FG.get(['f_s3_TripulacionCalificada']) as UntypedFormControl; }
  get f_s3_TripulacionFA(): UntypedFormArray { return this.f_Seccion3FG.get('f_s3_TripulacionFA') as UntypedFormArray; }

  get f_Seccion4FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion4FG') as UntypedFormGroup; }
  get f_s4_InfoVueloFA(): UntypedFormArray { return this.f_Seccion4FG.get('f_s4_InfoVueloFA') as UntypedFormArray; }

  get f_Seccion5FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion5FG') as UntypedFormGroup; }
  get f_s5_ComentariosFC(): UntypedFormControl { return this.f_Seccion5FG.get(['f_s5_ComentariosFC']) as UntypedFormControl; }

  get f_Seccion6FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion6FG') as UntypedFormGroup; }
  get f_s6_Declaracion1FC(): UntypedFormControl { return this.f_Seccion6FG.get(['f_s6_Declaracion1FC']) as UntypedFormControl; }
  get f_s6_Declaracion2FC(): UntypedFormControl { return this.f_Seccion6FG.get(['f_s6_Declaracion2FC']) as UntypedFormControl; }

  get a_TipoAeronaveFC(): UntypedFormControl { return this.aeronaveFG.get('a_TipoAeronaveFC') as UntypedFormControl; }
  get a_MatriculaFC(): UntypedFormControl { return this.aeronaveFG.get('a_MatriculaFC') as UntypedFormControl; }
  get a_CallSignFC(): UntypedFormControl { return this.aeronaveFG.get('a_CallSignFC') as UntypedFormControl; }
  get a_NumeroVueloFC(): UntypedFormControl { return this.aeronaveFG.get('a_NumeroVueloFC') as UntypedFormControl; }

  get t_NombreFC(): UntypedFormControl { return this.tripulacionFG.get('t_NombreFC') as UntypedFormControl; }
  get t_CargoFC(): UntypedFormControl { return this.tripulacionFG.get('t_CargoFC') as UntypedFormControl; }
  get t_NacionalidadFC(): UntypedFormControl { return this.tripulacionFG.get('t_NacionalidadFC') as UntypedFormControl; }

  get iv_EntradaOrigenFC(): UntypedFormControl { return this.infoVueloFG.get('iv_EntradaOrigenFC') as UntypedFormControl; }
  get iv_OrigenFC(): UntypedFormControl { return this.infoVueloFG.get('iv_OrigenFC') as UntypedFormControl; }
  get iv_EntradaDestinoFC(): UntypedFormControl { return this.infoVueloFG.get('iv_EntradaDestinoFC') as UntypedFormControl; }
  get iv_DestinoFC(): UntypedFormControl { return this.infoVueloFG.get('iv_DestinoFC') as UntypedFormControl; }
  get iv_FechaEntradaFC(): UntypedFormControl { return this.infoVueloFG.get('iv_FechaEntradaFC') as UntypedFormControl; }
  get iv_FechaSalidaFC(): UntypedFormControl { return this.infoVueloFG.get('iv_FechaSalidaFC') as UntypedFormControl; }

  f_s2_a_TipoAeronaveFC(index: number): UntypedFormControl { return this.f_s2_AeronaveFA.get([index, 'a_TipoAeronaveFC']) as UntypedFormControl; }
  f_s2_a_MatriculaFC(index: number): UntypedFormControl { return this.f_s2_AeronaveFA.get([index, 'a_MatriculaFC']) as UntypedFormControl; }
  f_s2_a_CallSignFC(index: number): UntypedFormControl { return this.f_s2_AeronaveFA.get([index, 'a_CallSignFC']) as UntypedFormControl; }
  f_s2_a_NumeroVueloFC(index: number): UntypedFormControl { return this.f_s2_AeronaveFA.get([index, 'a_NumeroVueloFC']) as UntypedFormControl; }

  f_s3_t_NombreFC(index: number): UntypedFormControl { return this.f_s3_TripulacionFA.get([index, 't_NombreFC']) as UntypedFormControl; }
  f_s3_t_CargoFC(index: number): UntypedFormControl { return this.f_s3_TripulacionFA.get([index, 't_CargoFC']) as UntypedFormControl; }
  f_s3_t_CargoFCString(index: number): string {
    const cargoControl = this.f_s3_TripulacionFA.get([index, 't_CargoFC']) as UntypedFormControl;
    const cargoValor = +cargoControl.value;
    const cadena = this.listaTipoTripulante.find(item => item.idTipoFuncion == cargoValor)?.descripcion;
    console.log(cadena);
    return cadena;
  }
  f_s3_t_NacionalidadFC(index: number): UntypedFormControl { return this.f_s3_TripulacionFA.get([index, 't_NacionalidadFC']) as UntypedFormControl; }
  f_s3_t_NacionalidadFCString(index: number): string {
    const nacionalidadControl = this.f_s3_TripulacionFA.get([index, 't_NacionalidadFC']) as UntypedFormControl;
    const nacionalidadValor = +nacionalidadControl.value;
    const cadena = this.listaNacionalidad.find(item => item.idNacionalidad == nacionalidadValor)?.descripcion;
    return cadena;
  }

  f_s4_iv_EntradaOrigenFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_EntradaOrigenFC']) as UntypedFormControl; }
  f_s4_iv_OrigenFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_OrigenFC']) as UntypedFormControl; }
  f_s4_iv_EntradaDestinoFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_EntradaDestinoFC']) as UntypedFormControl; }
  f_s4_iv_DestinoFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_DestinoFC']) as UntypedFormControl; }
  f_s4_iv_FechaEntradaFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_FechaEntradaFC']) as UntypedFormControl; }
  f_s4_iv_FechaSalidaFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_FechaSalidaFC']) as UntypedFormControl; }

  tipoDeSolicitud(event: Event): void {
    const selectedOption = (event.target as HTMLInputElement).value;

    if (selectedOption === '1') {
      this.textoBusquedaPermiso = 'Si desea buscar un permiso de vuelo de su historico para su nueva solicitud ingrese el número de permiso / If you want to search for a flight permit from your history for your new application, enter the permit number';
      this.f_s1_TipoSolicitudFG.get('f_s1_ts_PermisoVueloFC').clearValidators();
      this.f_s1_ts_PermisoVueloFC.setValue('');
      this.esActualizacion = false;
      this.esVisibleCampoPermisoVuelo = true;
      this.opcionSeleccionada = selectedOption;
      this.readonlyMode = false;
      this.f_s1_do_NombreFC.setValue('');
      this.f_s1_do_PaisFC.setValue('');
      this.f_s1_do_DomicilioLegalFC.setValue('');
      this.f_s1_do_TelefonoFC.setValue('');
      this.f_s1_do_EmailFC.setValue('');
      this.f_s1_do_UsuarioSiidgacFC.setValue('');
      this.f_s1_ds_FboFC.setValue('');
      this.f_s1_ds_CargoFC.setValue('');
      this.f_s1_ds_TelefonoFC.setValue('');
      this.f_s1_ds_EmailFC.setValue('');
      this.f_s1_ds_NotificarFC.setValue(false);
      this.f_s1_fa_NombreORazonFC.setValue('');
      this.f_s1_fa_DomicilioLegalFC.setValue('');
      this.f_s1_fa_TelefonoFC.setValue('');
      this.f_s1_fa_EmailFC.setValue('');
      this.f_s1_sol_TipoVueloFC.setValue('');
      this.f_s1_sol_NumeroPasajerosFC.setValue('');
      this.f_s1_sol_AdelantoDemoraFC.setValue('');
      this.f_s2_FlotaAutorizada.setValue(false);
      this.f_s2_AeronaveFA.clear();
      this.f_s3_TripulacionCalificada.setValue(false);
      this.f_s4_InfoVueloFA.clear();
      this.f_s5_ComentariosFC.setValue('')
      this.f_s6_Declaracion1FC.setValue(false);
      this.f_s6_Declaracion2FC.setValue(false);
      this.f_s1_do_PaisFC.enable({ emitEvent: false });
      this.f_s1_sol_TipoVueloFC.enable({ emitEvent: false });
      this.f_s1_sol_AdelantoDemoraFC.enable({ emitEvent: false });
    } else if (selectedOption === '2') {
      this.textoBusquedaPermiso = 'Ingrese el permiso de vuelo. Ej: PVO-0001-2023 / Enter the flight permit. Ex: PVO-0001-2023';
      this.f_s1_TipoSolicitudFG.get('f_s1_ts_PermisoVueloFC').setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(13)]);
      this.esActualizacion = true;
      this.esVisibleCampoPermisoVuelo = true;
      this.opcionSeleccionada = selectedOption;
      this.readonlyMode = true;
      this.f_s1_do_PaisFC.disable({ emitEvent: false });
      this.f_s1_sol_TipoVueloFC.disable({ emitEvent: false });
      this.f_s1_sol_AdelantoDemoraFC.disable({ emitEvent: false });
    } else if (selectedOption === '3') {
      this.f_s1_TipoSolicitudFG.get('f_s1_ts_PermisoVueloFC').setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(13)]);
      this.esActualizacion = false;
      this.esVisibleCampoPermisoVuelo = true;
      this.opcionSeleccionada = selectedOption;
      this.readonlyMode = false;
      this.f_s1_do_PaisFC.enable({ emitEvent: false });
      this.f_s1_sol_TipoVueloFC.enable({ emitEvent: false });
      this.f_s1_sol_AdelantoDemoraFC.enable({ emitEvent: false });
    }

    this.f_s1_TipoSolicitudFG.get('f_s1_ts_PermisoVueloFC').updateValueAndValidity();
  }

  copyData(event: Event): void {
    const selectedOption = (event.target as HTMLInputElement).value;

    if (selectedOption === '1') {
      this.f_s1_fa_NombreORazonFC.setValue(this.f_s1_do_NombreFC.value);
      this.f_s1_fa_DomicilioLegalFC.setValue(this.f_s1_do_DomicilioLegalFC.value);
      this.f_s1_fa_TelefonoFC.setValue(this.f_s1_do_TelefonoFC.value);
      this.f_s1_fa_EmailFC.setValue(this.f_s1_do_EmailFC.value);
    } else if (selectedOption === '2') {
      this.f_s1_fa_NombreORazonFC.setValue(this.f_s1_ds_NombreFC.value);
      this.f_s1_fa_DomicilioLegalFC.setValue('');
      this.f_s1_fa_TelefonoFC.setValue(this.f_s1_ds_TelefonoFC.value);
      this.f_s1_fa_EmailFC.setValue(this.f_s1_ds_EmailFC.value);
    } else if (selectedOption === '3') {
      this.f_s1_fa_NombreORazonFC.setValue('');
      this.f_s1_fa_DomicilioLegalFC.setValue('');
      this.f_s1_fa_TelefonoFC.setValue('');
      this.f_s1_fa_EmailFC.setValue('');
    }
  }

  async searchPermisoVuelo(): Promise<void> {

    const permisoVuelo = this.f_s1_ts_PermisoVueloFC.value;
    const nombreORazonSocial = this.f_s1_ds_NombreFC.value;
    this.buscandoPermiso = true;

    let servicio = '';
    if (this.errorServicioReniec === true)
      servicio = 'al consultar el Servicio de RENIEC';
    if (this.errorServicioMigracion === true)
      servicio = 'al consultar el Servicio de Migraciones';
    if (this.errorServicioSunat === true)
      servicio = 'al consultar el Servicio de SUNAT';
    if (this.errorCargandoDatos === true)
      servicio = 'al intentar cargar los datos'

    if (nombreORazonSocial == '') {
      this.funcionesMtcService.mensajeError(`Debe Ingresar el nombre o Razon Social en la sección datos del solicitante. Debe de escribirlo exactamente a como fue registrado en su cuenta de usuario.`);
      //this.funcionesMtcService.mensajeError(`Debido al error ${servicio}, no es posible usar este servicio de  ${this.opcionSeleccionada === '2' ? 'actualización de Permiso de Vuelo' : 'carga de Permiso de vuelo de referencia'} temporalmente.`);
      return;
    }

    this.funcionesMtcService.mostrarCargando();

    try {
      const respuesta = await this.SiidgacService.getPVI(permisoVuelo, nombreORazonSocial).toPromise();
      //console.log(respuesta);

      if (respuesta.ouT_FLG_RESULT == "1") {

        if (this.f_Seccion1FG.enabled) {

          if (this.f_s1_DatosOperadorFG.enabled) {
            this.f_s1_do_NombreFC.setValue(respuesta.metaData.seccion1.datosOperador.nombre);
            this.f_s1_do_PaisFC.setValue(respuesta.metaData.seccion1.datosOperador.idPais);
            this.f_s1_do_DomicilioLegalFC.setValue(respuesta.metaData.seccion1.datosOperador.domicilioLegal);
            this.f_s1_do_TelefonoFC.setValue(respuesta.metaData.seccion1.datosOperador.telefono);
            this.f_s1_do_EmailFC.setValue(respuesta.metaData.seccion1.datosOperador.email);
            this.f_s1_do_UsuarioSiidgacFC.setValue(respuesta.metaData.seccion1.datosOperador.usuarioSiidgac);
          }

          if (this.f_s1_DatosSolicitanteFG.enabled) {
            this.f_s1_ds_NombreFC.setValue(respuesta.metaData.seccion1.datosSolicitante.nombre);
            this.f_s1_ds_FboFC.setValue(respuesta.metaData.seccion1.datosSolicitante.fbo);
            this.f_s1_ds_CargoFC.setValue(respuesta.metaData.seccion1.datosSolicitante.cargo);
            this.f_s1_ds_TelefonoFC.setValue(respuesta.metaData.seccion1.datosSolicitante.telefono);
            this.f_s1_ds_EmailFC.setValue(respuesta.metaData.seccion1.datosSolicitante.email);
            this.f_s1_ds_NotificarFC.setValue(respuesta.metaData.seccion1.datosSolicitante.notificar);
          }

          if (this.f_s1_FacturarAFG.enabled) {
            this.f_s1_fa_NombreORazonFC.setValue(respuesta.metaData.seccion1.facturarA.nombreORazonSocial);
            this.f_s1_fa_DomicilioLegalFC.setValue(respuesta.metaData.seccion1.facturarA.domicilioLegal);
            this.f_s1_fa_TelefonoFC.setValue(respuesta.metaData.seccion1.facturarA.telefono);
            this.f_s1_fa_EmailFC.setValue(respuesta.metaData.seccion1.facturarA.email);
          }

          if (this.f_s1_DatosSolicitudFG.enabled) {
            this.f_s1_sol_AmbitoFC.setValue('INTERNACIONAL');
            this.f_s1_sol_TipoPermisoFC.setValue('AVIACION GENERAL');
            this.f_s1_sol_TipoVueloFC.setValue(respuesta.metaData.seccion1.datosSolicitud.idTipoVuelo);
            this.f_s1_sol_NumeroPasajerosFC.setValue(respuesta.metaData.seccion1.datosSolicitud.numeroPasajero == 'TO BE ANNOUNCED' ? '' : respuesta.metaData.seccion1.datosSolicitud.numeroPasajero);
            this.f_s1_sol_AdelantoDemoraFC.setValue(respuesta.metaData.seccion1.datosSolicitud.adelantoDemora);
          }
        }

        if (this.f_Seccion2FG.enabled) {
          this.f_s2_FlotaAutorizada.setValue(respuesta.metaData.seccion2.flotaAutorizada);

          this.f_s2_AeronaveFA.clear();
          const { listaAeronave } = respuesta.metaData.seccion2;

          if (this.f_s2_AeronaveFA.enabled) {
            for (const aeronave of listaAeronave) {
              this.addEditAeronaveFG(aeronave);
            }
          }
        }

        if (this.f_Seccion3FG.enabled) {
          this.f_s3_TripulacionCalificada.setValue(respuesta.metaData.seccion3.tripulacionAutorizada);

          /*this.f_s3_TripulacionFA.clear();
          const { listaTripulacion } = respuesta.metaData.seccion3;

          if (this.f_s3_TripulacionFA.enabled) {
            for (const infoVuelo of listaTripulacion) {
              this.addEditInfoVueloFG(infoVuelo);
            }
          }*/
        }

        if (this.f_Seccion4FG.enabled) {

          this.f_s4_InfoVueloFA.clear();
          const { listaInfoVuelo } = respuesta.metaData.seccion4;

          if (this.f_s4_InfoVueloFA.enabled) {
            for (const infoVuelo of listaInfoVuelo) {
              this.addEditInfoVueloFG(infoVuelo);
            }
          }
        }

        if (this.f_Seccion5FG.enabled) {
          this.f_s5_ComentariosFC.setValue(respuesta.metaData.seccion5.comentarios);
        }

        if (this.f_Seccion6FG.enabled) {
          this.f_s6_Declaracion1FC.setValue(respuesta.metaData.seccion6.declaracion1);
          this.f_s6_Declaracion2FC.setValue(respuesta.metaData.seccion6.declaracion2);
        }

        this.buscandoPermiso = false;
        this.funcionesMtcService.ocultarCargando();
        //this.findInvalidControls();
      }
      else {
        this.funcionesMtcService.ocultarCargando().mensajeError(respuesta.ouT_MESSAGE);
      }
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de SII-DGAC');
    }
  }


  onChangeAmbito(): void {
    this.f_s1_sol_AmbitoFC.valueChanges.subscribe(value => {
      this.listaAUtilizar(value);
    });
  }
  private listaAUtilizar(value: any): void{
    if(value == "1")
      this.listaTipoVueloAUtilizar = this.listaTipoVueloNacional;
    else
      this.listaTipoVueloAUtilizar = this.listaTipoVueloInternacional;
  }

  onChangeFlotaAutorizada(): void {
    this.f_s2_FlotaAutorizada.valueChanges.subscribe(value => {
      this.disableAeronaveFGControls(value);
    });
  }

  onChangeTripulacionCalificada(): void {
    this.f_s3_TripulacionCalificada.valueChanges.subscribe(value => {
      this.disableTripulacionFGControls(value);
    });
  }

  // region: Aeronave
  saveAeronave(): void {
    const aeronave: Aeronave = {
      tipoAeronave: this.a_TipoAeronaveFC.value,
      matricula: this.a_MatriculaFC.value,
      callSign: this.a_CallSignFC.value,
      numeroVuelo: this.a_NumeroVueloFC.value,
    };

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditAeronave === -1 ? 'guardar' : 'modificar'} la información de la aeronave?`)
      .then(() => {
        if (this.f_s2_FlotaAutorizada.value) {
          const exist = !!this.f_s2_AeronaveFA.controls
            .find((r: UntypedFormGroup, index: number) => r.get('a_TipoAeronaveFC').value === aeronave.tipoAeronave && this.indexEditAeronave !== index);
          if (exist) {
            this.funcionesMtcService.mensajeError('El tipo de aeronave ya ha sido registrado.');
            return;
          }
        }
        else {
          const exist = !!this.f_s2_AeronaveFA.controls
            .find((r: UntypedFormGroup, index: number) => r.get('a_MatriculaFC').value === aeronave.matricula && this.indexEditAeronave !== index);
          if (exist) {
            this.funcionesMtcService.mensajeError('La matrícula de la aeronave ya ha sido registrada.');
            return;
          }
        }

        this.addEditAeronaveFG(aeronave, this.indexEditAeronave);
        this.indexEditAeronave = -1;
        this.aeronaveFG.reset();
      });
  }

  nosaveAeronave(): void {
    this.indexEditAeronave = -1;
    this.aeronaveFG.reset();
  }

  editAeronave(index: number): void {
    this.indexEditAeronave = index;

    const tipoAeronave = this.f_s2_a_TipoAeronaveFC(index).value;
    const matricula = this.f_s2_a_MatriculaFC(index)?.value;
    const callSign = this.f_s2_a_CallSignFC(index)?.value;
    const numeroVuelo = this.f_s2_a_NumeroVueloFC(index)?.value;

    this.a_TipoAeronaveFC.setValue(tipoAeronave);
    this.a_MatriculaFC.setValue(matricula);
    this.a_CallSignFC.setValue(callSign);
    this.a_NumeroVueloFC.setValue(numeroVuelo);

    if (matricula == '' || matricula == null) {
      this.f_s2_FlotaAutorizada.setValue(true);
    }
    else {
      this.f_s2_FlotaAutorizada.setValue(false);
    }
  }

  private addEditAeronaveFG({ tipoAeronave, matricula, callSign, numeroVuelo }: Aeronave, index: number = -1): void {
    if ((this.opcionSeleccionada == '2' || this.opcionSeleccionada == '3') && this.buscandoPermiso) {
      const newAeronaveFG = this.formBuilder.group({
        a_TipoAeronaveFC: [tipoAeronave, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
        a_MatriculaFC: [matricula],
        a_CallSignFC: [callSign],
        a_NumeroVueloFC: [numeroVuelo],
      });

      if (index === -1) {
        this.f_s2_AeronaveFA.push(newAeronaveFG);
      }
      else {
        this.f_s2_AeronaveFA.setControl(index, newAeronaveFG);
      }
    } else {
      if (this.f_s2_FlotaAutorizada.value) {
        const newAeronaveFG = this.formBuilder.group({
          a_TipoAeronaveFC: [tipoAeronave, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
          a_MatriculaFC: [''],
          a_CallSignFC: [''],
          a_NumeroVueloFC: [''],
        });

        if (index === -1) {
          this.f_s2_AeronaveFA.push(newAeronaveFG);
        }
        else {
          this.f_s2_AeronaveFA.setControl(index, newAeronaveFG);
        }
      }
      else {
        const newAeronaveFG = this.formBuilder.group({
          a_TipoAeronaveFC: [tipoAeronave, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
          a_MatriculaFC: [matricula, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
          a_CallSignFC: [callSign, [noWhitespaceValidator(), Validators.maxLength(30)]],
          a_NumeroVueloFC: [numeroVuelo, [Validators.maxLength(10)]],
        });

        if (index === -1) {
          this.f_s2_AeronaveFA.push(newAeronaveFG);
        }
        else {
          this.f_s2_AeronaveFA.setControl(index, newAeronaveFG);
        }
      }
    }
  }

  removeAeronave(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información de la aeronave seleccionada?')
      .then(
        () => {
          this.f_s2_AeronaveFA.removeAt(index);
          this.indexEditAeronave = -1;
          this.aeronaveFG.reset();
        });
  }

  private disableAeronaveFGControls(disable: boolean): void {
    if (disable) {
      this.aeronaveFG.get('a_MatriculaFC').clearValidators();
      this.aeronaveFG.get('a_CallSignFC').clearValidators();
      this.aeronaveFG.get('a_NumeroVueloFC').clearValidators();
    } else {
      this.aeronaveFG.get('a_MatriculaFC').setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]);
      this.aeronaveFG.get('a_CallSignFC').setValidators([noWhitespaceValidator(), Validators.maxLength(30)]);
      this.aeronaveFG.get('a_NumeroVueloFC').setValidators([Validators.maxLength(10)]);
    }

    this.aeronaveFG.get('a_MatriculaFC').updateValueAndValidity();
    this.aeronaveFG.get('a_CallSignFC').updateValueAndValidity();
    this.aeronaveFG.get('a_NumeroVueloFC').updateValueAndValidity();
  }
  // endregion: Aeronave

  // region: Tripulacion
  saveTripulacion(): void {
    const tripulacion: Tripulacion = {
      nombre: this.t_NombreFC.value,
      cargo: this.t_CargoFC.value,
      nacionalidad: this.t_NacionalidadFC.value,
    };

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditTripulante === -1 ? 'guardar' : 'modificar'} la información del tripulante?`)
      .then(() => {
        const exist = !!this.f_s3_TripulacionFA.controls
          .find((r: UntypedFormGroup, index: number) => r.get('t_NombreFC').value === tripulacion.nombre && this.indexEditTripulante !== index);
        if (exist) {
          this.funcionesMtcService.mensajeError('El tripulante ya ha sido registrado.');
          return;
        }

        this.addEditTripulacionFG(tripulacion, this.indexEditTripulante);
        this.indexEditTripulante = -1;
        this.tripulacionFG.reset();
      });
  }

  nosaveTripulacion(): void {
    this.indexEditTripulante = -1;
    this.tripulacionFG.reset();
  }

  editTripulacion(index: number): void {
    this.indexEditTripulante = index;

    const nombre = this.f_s3_t_NombreFC(index).value;
    const cargo = this.f_s3_t_CargoFC(index)?.value;
    const nacionalidad = this.f_s3_t_NacionalidadFC(index).value;

    this.t_NombreFC.setValue(nombre);
    this.t_CargoFC.setValue(cargo);
    this.t_NacionalidadFC.setValue(nacionalidad);
  }

  private addEditTripulacionFG({ nombre, cargo, nacionalidad }: Tripulacion, index: number = -1): void {
    const newTripulacionFG = this.formBuilder.group({
      t_NombreFC: [nombre, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.pattern(/^([A-Za-záéíóúÁÉÍÓÚÑñ]{2,}\s?){1}([A-Za-záéíóúÁÉÍÓÚÑñ\.]{2,}\s?){2,7}$/)]],
      t_CargoFC: [cargo, [Validators.required]],
      t_NacionalidadFC: [nacionalidad, [Validators.required]],
    });

    if (index === -1) {
      this.f_s3_TripulacionFA.push(newTripulacionFG);
      console.log(this.f_s3_TripulacionFA);
    }
    else {
      this.f_s3_TripulacionFA.setControl(index, newTripulacionFG);
    }
  }

  removeTripulacion(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información del tripulante seleccionado?')
      .then(
        () => {
          this.f_s3_TripulacionFA.removeAt(index);
        });
  }

  private disableTripulacionFGControls(disable: boolean): void {
    const controls = this.tripulacionFG.controls;
    Object.keys(controls).forEach((controlName) => {
      const control = controls[controlName];
      if (disable) {
        control.disable();
      } else {
        control.enable();
      }
      console.log(control);
    });

    if (disable) {
      this.f_s3_TripulacionFA.clearValidators();
      this.tripulacionFG.clearValidators();
    } else {
      this.f_s3_TripulacionFA.setValidators([Validators.required]);
      this.tripulacionFG.get('t_NombreFC').setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.pattern(/^([A-Za-záéíóúÁÉÍÓÚÑñ]{2,}\s?){1}([A-Za-záéíóúÁÉÍÓÚÑñ\.]{2,}\s?){2,7}$/)]);
      this.tripulacionFG.get('t_CargoFC').setValidators([Validators.required]);
      this.tripulacionFG.get('t_NacionalidadFC').setValidators([Validators.required]);
    }

    this.f_s3_TripulacionFA.updateValueAndValidity();
    this.tripulacionFG.updateValueAndValidity();
  }
  // endregion: Tripulacion

  // region: InfoVuelo
  saveInfoVuelo(): void {

    const infoVuelo: InformacionVuelo = {
      origen: this.iv_OrigenFC.value,
      destino: this.iv_DestinoFC.value,
      fechaEntrada: this.iv_FechaEntradaFC.value.toStringFechaDGAC(),
      fechaSalida: this.iv_FechaSalidaFC.value.toStringFechaDGAC(),
    };

    if (this.f_s4_InfoVueloFA.length == 0) {
      this.fechaDeEntrada = this.iv_FechaEntradaFC.value;
      this.fechaTopeInicio = new Date(this.fechaDeEntrada.getFullYear(), 0, 1)
      this.fechaTopeFin = new Date(this.fechaDeEntrada.getFullYear(), 11, 31)
    }

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditInfoVuelo === -1 ? 'guardar' : 'modificar'} la información del vuelo?`)
      .then(() => {

        if (this.iv_FechaSalidaFC.value < this.iv_FechaEntradaFC.value) {
          return this.funcionesMtcService.mensajeError('Fecha de salida debe ser menor que fecha de llegada');
        }

        if (this.iv_FechaSalidaFC.value && this.iv_FechaSalidaFC.value.getTime() - this.iv_FechaEntradaFC.value.getTime() > 31622400000/*31536000000*/) {
          return this.funcionesMtcService.mensajeError('No debe de haber más de un año de diferencia entre la fecha de entrada y la fecha de salida');
        }

        const exist = !!this.f_s4_InfoVueloFA.controls
          .find((r: UntypedFormGroup, index: number) => r.get('iv_OrigenFC').value === infoVuelo.origen && r.get('iv_DestinoFC').value === infoVuelo.destino && this.indexEditInfoVuelo !== index);
        if (exist) {
          this.funcionesMtcService.mensajeError('La ruta ya ha sido registrada.');
          return;
        }

        this.addEditInfoVueloFG(infoVuelo, this.indexEditInfoVuelo);
        this.reiniciarInfoVuelo();
      });
  }

  nosaveInfoVuelo(): void {
    this.reiniciarInfoVuelo();
  }

  reiniciarInfoVuelo(): void {
    this.listaOrigen = [];
    this.listaDestino = [];
    this.contadorOrigen = this.listaOrigen.length;
    this.contadorDestino = this.listaDestino.length;
    this.infoVueloFG.controls['iv_FechaEntradaFC'].setValue(this.convertDateStringToDate(this.fechaActual.toString()));
    this.infoVueloFG.controls['iv_FechaSalidaFC'].setValue(this.convertDateStringToDate(this.fechaActual.toString()));
    this.indexEditInfoVuelo = -1;
    this.infoVueloFG.reset();
  }

  editInfoVuelo(index: number): void {
    this.indexEditInfoVuelo = index;

    const origen = this.f_s4_iv_OrigenFC(index).value;
    this.listaOrigen = origen.split(' ');
    this.contadorOrigen = this.listaOrigen.length;
    const destino = this.f_s4_iv_DestinoFC(index)?.value;
    this.listaDestino = destino.split(' ');
    this.contadorDestino = this.listaDestino.length;
    const fechaEntrada = this.f_s4_iv_FechaEntradaFC(index).value;
    const fechaSalida = this.f_s4_iv_FechaSalidaFC(index).value;

    this.iv_OrigenFC.setValue(origen);
    this.iv_DestinoFC.setValue(destino);
    this.iv_FechaEntradaFC.setValue(this.convertDateStringToDate(fechaEntrada));
    this.iv_FechaSalidaFC.setValue(this.convertDateStringToDate(fechaSalida));
  }

  private addEditInfoVueloFG({ origen, destino, fechaEntrada, fechaSalida }: InformacionVuelo, index: number = -1): void {
    const newInfoVueloFG = this.formBuilder.group({
      iv_OrigenFC: [origen, [Validators.required]],
      iv_DestinoFC: [destino, [Validators.required]],
      iv_FechaEntradaFC: [fechaEntrada, [Validators.required]],
      iv_FechaSalidaFC: [fechaSalida, [Validators.required]],
    });

    if (index === -1) {
      this.f_s4_InfoVueloFA.push(newInfoVueloFG);
    }
    else {

      this.f_s4_InfoVueloFA.setControl(index, newInfoVueloFG);
    }
  }

  removeInfoVuelo(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información de la ruta seleccionada?')
      .then(
        () => {
          this.f_s4_InfoVueloFA.removeAt(index);
          this.reiniciarInfoVuelo();
        });
  }

  agregarOrigen(): void {
    const index = this.listaOrigen.indexOf(this.iv_EntradaOrigenFC.value);

    if (index !== -1) {
      this.funcionesMtcService.mensajeError('El designador OACI ya ha sido ingresado con anterioridad');
    } else {
      this.listaOrigen.push(this.iv_EntradaOrigenFC.value);
      this.iv_OrigenFC.setValue(this.listaOrigen.join(' '));
      this.contadorOrigen = this.listaOrigen.length;
      this.iv_EntradaOrigenFC.setValue('');
    }
  }

  eliminarOrigen(): void {
    const index = this.listaOrigen.indexOf(this.iv_EntradaOrigenFC.value);

    if (index !== -1) {
      this.listaOrigen.splice(index, 1);
      this.iv_OrigenFC.setValue(this.listaOrigen.join(' '));
      this.contadorOrigen = this.listaOrigen.length;
      this.iv_EntradaOrigenFC.setValue('');
    } else {
      this.funcionesMtcService.mensajeError('El designador OACI que intenta eliminar no se encuentra en su lista');
    }
  }

  agregarDestino(): void {
    const index = this.listaDestino.indexOf(this.iv_EntradaDestinoFC.value);

    if (index !== -1) {
      this.funcionesMtcService.mensajeError('El designador OACI ya ha sido ingresado con anterioridad');
    } else {
      this.listaDestino.push(this.iv_EntradaDestinoFC.value);
      this.iv_DestinoFC.setValue(this.listaDestino.join(' '));
      this.contadorDestino = this.listaDestino.length;
      this.iv_EntradaDestinoFC.setValue('');
    }
  }

  eliminarDestino(): void {
    const index = this.listaDestino.indexOf(this.iv_EntradaDestinoFC.value);

    if (index !== -1) {
      this.listaDestino.splice(index, 1);
      this.iv_DestinoFC.setValue(this.listaDestino.join(' '));
      this.contadorDestino = this.listaDestino.length;
      this.iv_EntradaDestinoFC.setValue('');
    } else {
      this.funcionesMtcService.mensajeError('El designador OACI que intenta eliminar no se encuentra en su lista');
    }
  }

  // endregion: InfoVuelo

  async obtenerListas(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    this.listaPais = await this.SiidgacService.getPaises().toPromise();
    //console.log(this.listaPais);
    this.listaTipoVuelo = await this.SiidgacService.getMotivoSobrevuelo().toPromise();
    //console.log(this.listaTipoVuelo);
    this.listaTipoTripulante = await this.SiidgacService.getTipoTripulante().toPromise();
    console.log(this.listaTipoTripulante);
    this.listaNacionalidad = await this.SiidgacService.getNacionalidad().toPromise();
    console.log(this.listaNacionalidad);
    this.funcionesMtcService.ocultarCargando();
  }

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.codTipoDocSolicitante = '01';
        break;

      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        break;

      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.codTipoDocSolicitante = '04';
        break;

      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.codTipoDocSolicitante = '01';
        break;
    }

    if (this.dataInput != null && this.dataInput.movId > 0) {
      // TRAEMOS LOS DATOS GUARDADOS
      try {
        const dataFormulario = await this.formularioTramiteService.get<Formulario001_PVNIResponse>(this.dataInput.tramiteReqId).toPromise();

        const { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6 } = JSON.parse(dataFormulario.metaData) as MetaData;
        //console.log(JSON.parse(dataFormulario.metaData));
        this.id = dataFormulario.formularioId;

        if (this.f_Seccion1FG.enabled) {

          if (this.f_s1_TipoSolicitudFG.enabled) {
            this.f_s1_ts_OpcionesRadioButtonFC.setValue(seccion1.tipoSolicitud.opcionSeleccionada);
            this.f_s1_ts_PermisoVueloFC.setValue(seccion1.tipoSolicitud.permisoVuelo);
          }

          if (this.f_s1_DatosOperadorFG.enabled) {
            this.f_s1_do_NombreFC.setValue(seccion1.datosOperador.nombre);
            this.f_s1_do_PaisFC.setValue(seccion1.datosOperador.idPais);
            this.f_s1_do_DomicilioLegalFC.setValue(seccion1.datosOperador.domicilioLegal);
            this.f_s1_do_TelefonoFC.setValue(seccion1.datosOperador.telefono);
            this.f_s1_do_EmailFC.setValue(seccion1.datosOperador.email);
          }

          if (this.f_s1_DatosSolicitanteFG.enabled) {
            this.f_s1_ds_NombreFC.setValue(seccion1.datosSolicitante.nombre);
            this.f_s1_ds_FboFC.setValue(seccion1.datosSolicitante.fbo);
            this.f_s1_ds_CargoFC.setValue(seccion1.datosSolicitante.cargo);
            this.f_s1_ds_TelefonoFC.setValue(seccion1.datosSolicitante.telefono);
            this.f_s1_ds_EmailFC.setValue(seccion1.datosSolicitante.email);
            this.f_s1_ds_NotificarFC.setValue(seccion1.datosSolicitante.notificar);
          }

          if (this.f_s1_FacturarAFG.enabled) {
            this.f_s1_fa_NombreORazonFC.setValue(seccion1.facturarA.nombreORazonSocial);
            this.f_s1_fa_DomicilioLegalFC.setValue(seccion1.facturarA.domicilioLegal);
            this.f_s1_fa_TelefonoFC.setValue(seccion1.facturarA.telefono);
            this.f_s1_fa_EmailFC.setValue(seccion1.facturarA.email);
          }

          if (this.f_s1_DatosSolicitudFG.enabled) {
            this.f_s1_sol_AmbitoFC.setValue(seccion1.datosSolicitud.idAmbito);
            this.f_s1_sol_TipoPermisoFC.setValue(seccion1.datosSolicitud.idTipoPermiso);
            this.f_s1_sol_TipoVueloFC.setValue(seccion1.datosSolicitud.idTipoVuelo);
            this.f_s1_sol_NumeroPasajerosFC.setValue(seccion1.datosSolicitud.numeroPasajero);
            this.f_s1_sol_AdelantoDemoraFC.setValue(seccion1.datosSolicitud.adelantoDemora);
          }
        }

        if (this.f_Seccion2FG.enabled) {
          this.f_s2_FlotaAutorizada.setValue(seccion2.flotaAutorizada);

          const { listaAeronave } = seccion2;

          if (this.f_s2_AeronaveFA.enabled) {
            for (const aeronave of listaAeronave) {
              this.addEditAeronaveFG(aeronave);
            }
          }
        }

        if (this.f_Seccion3FG.enabled) {
          this.f_s3_TripulacionCalificada.setValue(seccion3.tripulacionAutorizada);

          const { listaTripulacion } = seccion3;

          if (this.f_s3_TripulacionFA.enabled) {
            for (const tripulante of listaTripulacion) {
              this.addEditTripulacionFG(tripulante);
            }
          }
        }

        if (this.f_Seccion4FG.enabled) {

          const { listaInfoVuelo } = seccion4;

          if (this.f_s4_InfoVueloFA.enabled) {
            for (const infoVuelo of listaInfoVuelo) {
              this.addEditInfoVueloFG(infoVuelo);
            }
          }
        }

        if (this.f_Seccion5FG.enabled) {
          this.f_s5_ComentariosFC.setValue(seccion5.comentarios);
        }

        if (this.f_Seccion6FG.enabled) {
          this.f_s6_Declaracion1FC.setValue(seccion6.declaracion1);
          this.f_s6_Declaracion2FC.setValue(seccion6.declaracion2);
        }

        this.funcionesMtcService.ocultarCargando();
      }
      catch (e) {
        console.error(e);
        this.errorCargandoDatos = true;
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }
    } else {
      // NO HAY DATOS GUARDADOS
      if (this.tipoSolicitante === 'PN') {
        try {
          const respuesta = await this.reniecService.getDni(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            this.errorServicioReniec = true;
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

          this.f_s1_ds_NombreFC.setValue(`${datosPersona.prenombres} ${datosPersona.apPrimer} ${datosPersona.apSegundo}`);
          this.f_s1_ds_NombreFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
          this.errorServicioReniec = true;
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
          this.f_s1_ds_NombreFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PE') {
        try {
          const respuesta = await this.extranjeriaService.getCE(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
            this.errorServicioMigracion = true;
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }

          this.f_s1_ds_NombreFC.setValue(`${respuesta.CarnetExtranjeria.nombres} ${respuesta.CarnetExtranjeria.primerApellido} ${respuesta.CarnetExtranjeria.segundoApellido}`);
          this.f_s1_ds_NombreFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
          this.errorServicioMigracion = true;
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.f_s1_ds_NombreFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PNR') {
        try {
          const respuesta = await this.reniecService.getDni(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            this.errorServicioReniec = true;
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

          this.f_s1_ds_NombreFC.setValue(`${datosPersona.prenombres} ${datosPersona.apPrimer} ${datosPersona.apSegundo}`);
          this.f_s1_ds_NombreFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
          this.errorServicioReniec = true;
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
          this.f_s1_ds_NombreFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PJ') {
        try {
          const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
          this.f_s1_ds_NombreFC.setValue(response.razonSocial.trim());
          this.f_s1_ds_TelefonoFC.setValue(response.celular.trim());
          this.f_s1_ds_EmailFC.setValue(response.correo.trim());
          this.f_s1_ds_NombreFC.disable();
          //this.f_s1_ds_TelefonoFC.disable();
          //this.f_s1_ds_EmailFC.disable();

          this.funcionesMtcService.ocultarCargando();
        }
        catch (e) {
          this.errorServicioSunat = true;
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
          this.f_s1_ds_NombreFC.setValue(this.razonSocial);
          this.f_s1_ds_NombreFC.disable();
        }
      }
    }
  }

  soloNumeros(event): void {
    const inputElement = event.target;
    let inputValue = inputElement.value.trim();

    if (inputValue.startsWith('+')) {
      inputValue = '+' + inputValue.replace(/[^0-9]/g, '');
    } else {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

    inputElement.value = inputValue;
  }

  guardarFormulario(): void {
    //this.findInvalidControls();
    if (this.formularioFG.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    this.fechaPermisoInicio = null;
    this.fechaPermisoFin = null;

    const dataGuardar = new Formulario001_PVNIRequest();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F001-PVnI';
    dataGuardar.formularioId = 2;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.estado = 1;

    const { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6 } = dataGuardar.metaData;
    const { tipoSolicitud, datosOperador, datosSolicitante, facturarA, datosSolicitud } = seccion1;
    const { listaAeronave } = seccion2;
    const { listaTripulacion } = seccion3;
    const { listaInfoVuelo } = seccion4;

    seccion1.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
    seccion1.descProcedimientoTupa = this.descProcedimientoTupa;
    seccion1.codigoFormulario = dataGuardar.codigo;

    tipoSolicitud.opcionSeleccionada = this.opcionSeleccionada;
    tipoSolicitud.esActualizacion = this.esActualizacion;
    tipoSolicitud.permisoVuelo = this.f_s1_ts_PermisoVueloFC.value;

    datosOperador.nombre = this.f_s1_do_NombreFC.value;
    datosOperador.idPais = this.f_s1_do_PaisFC.value;
    datosOperador.pais = this.listaPais.find(item => item.idPais === datosOperador.idPais)?.descripcion;
    datosOperador.domicilioLegal = this.f_s1_do_DomicilioLegalFC.value;
    datosOperador.telefono = this.f_s1_do_TelefonoFC.value;
    datosOperador.email = this.f_s1_do_EmailFC.value;

    datosSolicitante.nombre = this.f_s1_ds_NombreFC.value;
    datosSolicitante.fbo = this.f_s1_ds_FboFC.value;
    datosSolicitante.cargo = this.f_s1_ds_CargoFC.value;
    datosSolicitante.telefono = this.f_s1_ds_TelefonoFC.value;
    datosSolicitante.email = this.f_s1_ds_EmailFC.value;
    datosSolicitante.notificar = this.f_s1_ds_NotificarFC.value;

    facturarA.nombreORazonSocial = this.f_s1_fa_NombreORazonFC.value;
    facturarA.domicilioLegal = this.f_s1_fa_DomicilioLegalFC.value;
    facturarA.telefono = this.f_s1_fa_TelefonoFC.value;
    facturarA.email = this.f_s1_fa_EmailFC.value;

    datosSolicitud.idAmbito = this.f_s1_sol_AmbitoFC.value;
    datosSolicitud.idTipoPermiso = '4v_rmNNmsKsAtzwaka9RKw..';
    datosSolicitud.idPermisoAmbito = '8BJpVqPrPnb4f87utPfM5g..';
    datosSolicitud.idTipoVuelo = this.f_s1_sol_TipoVueloFC.value;
    datosSolicitud.tipoVuelo = this.listaTipoVuelo.find(item => item.idMotivoVuelo === datosSolicitud.idTipoVuelo)?.descripcionEspMotivo;
    datosSolicitud.numeroPasajero = this.f_s1_sol_NumeroPasajerosFC.value == '' ? 'TO BE ANNOUNCED' : this.f_s1_sol_NumeroPasajerosFC.value;


    datosSolicitud.adelantoDemora = this.f_s1_sol_AdelantoDemoraFC.value;

    seccion2.flotaAutorizada = this.f_s2_FlotaAutorizada.value;

    for (const controlFG of this.f_s2_AeronaveFA.controls) {
      const aeronave: Aeronave = {
        tipoAeronave: controlFG.get('a_TipoAeronaveFC').value,
        matricula: controlFG.get('a_MatriculaFC').value,
        callSign: controlFG.get('a_CallSignFC').value,
        numeroVuelo: controlFG.get('a_NumeroVueloFC').value
      };
      listaAeronave.push(aeronave);
    }

    seccion3.tripulacionAutorizada = this.f_s3_TripulacionCalificada.value;

    for (const controlFG of this.f_s3_TripulacionFA.controls) {
      const tripulacion: Tripulacion = {
        nombre: controlFG.get('t_NombreFC').value,
        cargo: controlFG.get('t_CargoFC').value,
        nacionalidad: controlFG.get('t_NacionalidadFC').value,
      };
      listaTripulacion.push(tripulacion);
    }

    for (const controlFG of this.f_s4_InfoVueloFA.controls) {
      const infoVuelo: InformacionVuelo = {
        origen: controlFG.get('iv_OrigenFC').value,
        destino: controlFG.get('iv_DestinoFC').value,
        fechaEntrada: controlFG.get('iv_FechaEntradaFC').value,
        fechaSalida: controlFG.get('iv_FechaSalidaFC').value,
      };
      listaInfoVuelo.push(infoVuelo);
    }

    for (const infoVuelo of listaInfoVuelo) {
      const fechaEntrada = new Date(this.convertDateStringToDate(infoVuelo.fechaEntrada));
      const fechaSalida = new Date(this.convertDateStringToDate(infoVuelo.fechaSalida));

      if (!this.fechaPermisoInicio || fechaEntrada < this.fechaPermisoInicio) {
        this.fechaPermisoInicio = fechaEntrada;
      }

      if (!this.fechaPermisoFin || fechaSalida > this.fechaPermisoFin) {
        this.fechaPermisoFin = fechaSalida;
      }
    }

    datosSolicitud.fechaPermisoInicio = this.fechaPermisoInicio.toLocaleDateString("es-ES");
    datosSolicitud.fechaPermisoFin = this.fechaPermisoFin.toLocaleDateString("es-ES");
    datosSolicitud.cantidadDiasOperacion = (((this.fechaPermisoFin.getTime() - this.fechaPermisoInicio.getTime()) / (1000 * 3600 * 24)) + 1);

    seccion5.comentarios = this.f_s5_ComentariosFC.value;
    seccion6.declaracion1 = this.f_s6_Declaracion1FC.value;
    seccion6.declaracion2 = this.f_s6_Declaracion2FC.value;

    console.log('dataGuardar: ', JSON.stringify(dataGuardar));

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          // GUARDAR:
          try {
            const data = await this.formularioService.post(dataGuardar).toPromise();
            //console.log(data);
            this.funcionesMtcService.ocultarCargando();
            this.id = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
          }
          catch (e) {
            console.log(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // Evalua anexos a actualizar
          const listarequisitos = this.dataRequisitosInput;
          let cadenaAnexos = '';
          for (const requisito of listarequisitos) {
            if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
              if (requisito.movId > 0) {
                const nombreAnexo = requisito.codigoFormAnexo.split('_');
                cadenaAnexos += nombreAnexo[0] + ' ' + nombreAnexo[1] + '-' + nombreAnexo[2] + ' ';
              }
            }
          }
          if (cadenaAnexos.length > 0) {
            // ACTUALIZA FORMULARIO Y ANEXOS
            this.funcionesMtcService.mensajeConfirmar('Deberá volver a grabar los anexos ' + cadenaAnexos + '¿Desea continuar?')
              .then(async () => {
                this.funcionesMtcService.mostrarCargando();

                try {
                  const data = await this.formularioService.put(dataGuardar).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.id = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;
                  this.funcionesMtcService.ocultarCargando();
                  this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

                  for (const requisito of listarequisitos) {
                    if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
                      if (requisito.movId > 0) {
                        //console.log('Actualizando Anexos');
                        //console.log(requisito.tramiteReqRefId);
                        //console.log(requisito.movId);
                        // ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
                        try {
                          await this.formularioTramiteService.uriArchivo<number>(requisito.movId).toPromise();
                        }
                        catch (e) {
                          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                        }
                      }
                    }
                  }
                }
                catch (e) {
                  console.log(e);
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              });
          } else {
            // actualiza formulario
            this.funcionesMtcService.mostrarCargando();
            try {
              const data = await this.formularioService.put(dataGuardar).toPromise();
              this.funcionesMtcService.ocultarCargando();
              this.id = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;
              this.funcionesMtcService.ocultarCargando();
              this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
            }
            catch (e) {
              console.log(e);
              this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
            }
          }
        }
      });
  }

  async descargarPdf(): Promise<void> {

    if (this.id === 0) {
      this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
      return;
    }

    if (!this.uriArchivo || this.uriArchivo === '' || this.uriArchivo == null) {
      this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');
      return;
    }

    this.funcionesMtcService.mostrarCargando();

    try {
      const file: Blob = await this.visorPdfArchivosService.get(this.uriArchivo).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 001-PVNI';
    }
    catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar Pdf');
    }
  }

  formInvalid(control: UntypedFormControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }

  formInvalidFecha(control: string) {
    return this.infoVueloFG.get(control).invalid &&
      (this.infoVueloFG.get(control).dirty || this.infoVueloFG.get(control).touched);
  }

  onInputEvent(event: any, UntypedFormControl: UntypedFormControl): void {
    if (event?.target?.value) {
      const position = event.target.selectionStart;
      UntypedFormControl.setValue(event.target.value.toUpperCase(), { emitEvent: false });
      event.target.selectionEnd = position;
    }
  }

  convertDateStringToDate(fechaString: string): Date {
    const partesFecha = fechaString.split('/');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1;
    const anio = parseInt(partesFecha[2], 10);

    const fechaDate = new Date(anio, mes, dia);
    return fechaDate;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.formularioFG.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    //console.log(invalid);
  }
}
