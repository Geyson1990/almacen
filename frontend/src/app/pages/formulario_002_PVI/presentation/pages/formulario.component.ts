/**
 * Formulario 002/PVI
 * @author Hugo Cano
 * @version 1.0 10.20.2023
 */

import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray, ValidationErrors, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Formulario002_PVIRequest } from 'src/app/pages/formulario_002_PVI/domain/Formulario002_PVIRequest';
import { Formulario002_PVIResponse } from 'src/app/pages/formulario_002_PVI/domain/Formulario002_PVIResponse';
import { MetaData } from 'src/app/pages/formulario_002_PVI/domain/MetaData';
import { Aeronave, Tripulacion, InformacionVuelo } from 'src/app/pages/formulario_002_PVI/domain/Secciones';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Formulario002PVIService } from 'src/app/pages/formulario_002_PVI/application';
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
  aeronaveFG: UntypedFormGroup;
  tripulacionFG: UntypedFormGroup;
  infoVueloFG: UntypedFormGroup;
  fechaActual: Date = new Date();
  fechaPermisoInicio: Date | null = null;
  fechaPermisoFin: Date | null = null;
  fechaDeEntrada: Date | null = null;
  fechaTopeFin: Date | null = null;
  fechaTopeInicio: Date | null = null;
  contadorRutaPlanificada: number = 0;

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
  listaRutaPlanificada: string[] = [];

  listaOpcionesHoras: { id: string; descripcion: string }[] = [
    { id: '24', descripcion: '24 HORAS / HOURS' },
    { id: '48', descripcion: '48 HORAS / HOURS' },
    { id: '72', descripcion: '72 HORAS / HOURS' }
  ];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];

  txtTitulo = 'FORMULARIO 002-PVI SOLICITUD DE PERMISO INTERNACIONAL DE ATERRIZAJE/DESPEGUE AVIACION GENERAL (PRIVADOS, TRASLADOS)';
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
    private formularioService: Formulario002PVIService,
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
        f_s1_DatosOperadorFG: this.formBuilder.group({
          f_s1_do_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.pattern(/^([A-Za-záéíóúÁÉÍÓÚÑñ]{2,}\s?){1}([A-Za-záéíóúÁÉÍÓÚÑñ\.]{2,}\s?){2,7}$/)]],
          f_s1_do_PaisFC: ['', [Validators.required]],
          f_s1_do_DomicilioLegalFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_do_TelefonoFC: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?\d{3,15}$/)]],
          f_s1_do_EmailFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
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
          f_s1_sol_AmbitoFC: ['INTERNACIONAL', [Validators.required]],
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

    this.f_s1_FacturarAFG.patchValue({
      f_s1_fa_OpcionesRadioButtonFC: '3'
    });

    this.f_s1_sol_AmbitoFC.disable({ emitEvent: false });
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
      iv_EntradaRutaPlanificadaFC: ['', [noWhitespaceValidator(), Validators.pattern(/^[A-Za-z]{4}$/)]],
      iv_RutaPlanificadaFC: ['', [Validators.required, noWhitespaceValidator()]],
      iv_FechaEntradaFC: [null, [Validators.required]],
      iv_FechaSalidaFC: [null, [Validators.required]],
    });

    this.iv_RutaPlanificadaFC.disable({ emitEvent: false });
  }

  async ngAfterViewInit(): Promise<void> {

    await this.obtenerListas();
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
  get f_s1_DatosOperadorFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_DatosOperadorFG') as UntypedFormGroup; }
  get f_s1_do_NombreFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_NombreFC']) as UntypedFormControl; }
  get f_s1_do_PaisFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_PaisFC']) as UntypedFormControl; }
  get f_s1_do_DomicilioLegalFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_DomicilioLegalFC']) as UntypedFormControl; }
  get f_s1_do_TelefonoFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_TelefonoFC']) as UntypedFormControl; }
  get f_s1_do_EmailFC(): UntypedFormControl { return this.f_s1_DatosOperadorFG.get(['f_s1_do_EmailFC']) as UntypedFormControl; }

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

  get iv_EntradaRutaPlanificadaFC(): UntypedFormControl { return this.infoVueloFG.get('iv_EntradaRutaPlanificadaFC') as UntypedFormControl; }
  get iv_RutaPlanificadaFC(): UntypedFormControl { return this.infoVueloFG.get('iv_RutaPlanificadaFC') as UntypedFormControl; }
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

  f_s4_iv_EntradaRutaPlanificadaFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_EntradaRutaPlanificadaFC']) as UntypedFormControl; }
  f_s4_iv_RutaPlanificadaFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_RutaPlanificadaFC']) as UntypedFormControl; }
  f_s4_iv_FechaEntradaFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_FechaEntradaFC']) as UntypedFormControl; }
  f_s4_iv_FechaSalidaFC(index: number): UntypedFormControl { return this.f_s4_InfoVueloFA.get([index, 'iv_FechaSalidaFC']) as UntypedFormControl; }

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

    const longitudcadena = this.listaRutaPlanificada.length;
    const elemento = this.listaRutaPlanificada[longitudcadena-1];

    const infoVuelo: InformacionVuelo = {
      rutaPlanificada: this.iv_RutaPlanificadaFC.value,
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

        /*if (this.iv_FechaSalidaFC.value > this.fechaTopeFin) {
          return this.funcionesMtcService.mensajeError(`La fecha máxima no debe de exceder del 31 de diciembre de ${this.fechaDeEntrada.getFullYear()}, si desea ingresar operaciones para el próximo año, deberá de realizarse en otro permiso de vuelo.`);
        }

        if (this.iv_FechaEntradaFC.value < this.fechaTopeInicio) {
          return this.funcionesMtcService.mensajeError(`La fecha míxima no debe ser menor del 01 de enero de ${this.fechaDeEntrada.getFullYear()}.`);
        }*/

        if (elemento == 'Y/O' || elemento == 'O' || elemento == '-') {
          return this.funcionesMtcService.mensajeError(`La ruta planificada no debe de terminar con -, O, Y/O. La ruta planificada debe de terminar con un designador OACI`);
        }

        const exist = !!this.f_s4_InfoVueloFA.controls
          .find((r: UntypedFormGroup, index: number) => r.get('iv_RutaPlanificadaFC').value === infoVuelo.rutaPlanificada && this.indexEditInfoVuelo !== index);
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
    this.listaRutaPlanificada = [];
    this.contadorRutaPlanificada = this.listaRutaPlanificada.length;
    this.infoVueloFG.controls['iv_FechaEntradaFC'].setValue(this.convertDateStringToDate(this.fechaActual.toString()));
    this.infoVueloFG.controls['iv_FechaSalidaFC'].setValue(this.convertDateStringToDate(this.fechaActual.toString()));
    this.indexEditInfoVuelo = -1;
    this.infoVueloFG.reset();
  }

  editInfoVuelo(index: number): void {
    this.indexEditInfoVuelo = index;

    const rutaPlanificada = this.f_s4_iv_RutaPlanificadaFC(index).value;
    this.listaRutaPlanificada = rutaPlanificada.split(' ');
    this.contadorRutaPlanificada = this.listaRutaPlanificada.length;
    const fechaEntrada = this.f_s4_iv_FechaEntradaFC(index).value;
    const fechaSalida = this.f_s4_iv_FechaSalidaFC(index).value;

    this.iv_RutaPlanificadaFC.setValue(rutaPlanificada);
    this.iv_FechaEntradaFC.setValue(this.convertDateStringToDate(fechaEntrada));
    this.iv_FechaSalidaFC.setValue(this.convertDateStringToDate(fechaSalida));
  }

  private addEditInfoVueloFG({ rutaPlanificada, fechaEntrada, fechaSalida }: InformacionVuelo, index: number = -1): void {
    const newInfoVueloFG = this.formBuilder.group({
      iv_RutaPlanificadaFC: [rutaPlanificada, [Validators.required]],
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

  agregarRuta(): void {
    const index = this.listaRutaPlanificada.indexOf(this.iv_EntradaRutaPlanificadaFC.value);
    const longitudcadena = this.listaRutaPlanificada.length;
    const elemento = this.listaRutaPlanificada[longitudcadena-1];
    console.log(elemento, longitudcadena);

    if (index !== -1) {
      this.funcionesMtcService.mensajeError('El designador OACI ya ha sido ingresado con anterioridad');
    } else {
      if (elemento == 'Y/O' || elemento == 'O' || elemento == '-' || longitudcadena == 0) {
        this.listaRutaPlanificada.push(this.iv_EntradaRutaPlanificadaFC.value);
        this.iv_RutaPlanificadaFC.setValue(this.listaRutaPlanificada.join(' '));
        this.contadorRutaPlanificada = this.listaRutaPlanificada.length;
        this.iv_EntradaRutaPlanificadaFC.setValue('');
      } else {
        this.funcionesMtcService.mensajeError('Debe de ingresar -, O, Y/O antes de volver a ingresar un designador OACI');
      }
    }
  }

  agregarYO(): void {
    const index = this.listaRutaPlanificada.length;
    const elemento = this.listaRutaPlanificada[index-1];

    if (elemento == 'Y/O' || elemento == 'O' || elemento == '-') {
      this.funcionesMtcService.mensajeError('Debe de ingresar un designador OACI primero');
    } else {
      this.listaRutaPlanificada.push('Y/O');
      this.iv_RutaPlanificadaFC.setValue(this.listaRutaPlanificada.join(' '));
      this.iv_EntradaRutaPlanificadaFC.setValue('');
    }
  }

  agregarO(): void {
    const index = this.listaRutaPlanificada.length;
    const elemento = this.listaRutaPlanificada[index-1];

    if (elemento == 'Y/O' || elemento == 'O' || elemento == '-') {
      this.funcionesMtcService.mensajeError('Debe de ingresar un designador OACI primero');
    } else {
      this.listaRutaPlanificada.push('O');
      this.iv_RutaPlanificadaFC.setValue(this.listaRutaPlanificada.join(' '));
      this.iv_EntradaRutaPlanificadaFC.setValue('');
    }
  }

  agregarGuion(): void {
    const index = this.listaRutaPlanificada.length;
    const elemento = this.listaRutaPlanificada[index-1];

    if (elemento == 'Y/O' || elemento == 'O' || elemento == '-') {
      this.funcionesMtcService.mensajeError('Debe de ingresar un designador OACI primero');
    } else {
      this.listaRutaPlanificada.push('-');
      this.iv_RutaPlanificadaFC.setValue(this.listaRutaPlanificada.join(' '));
      this.iv_EntradaRutaPlanificadaFC.setValue('');
    }
  }

  eliminarRuta(): void {
    this.listaRutaPlanificada.pop();
    this.iv_RutaPlanificadaFC.setValue(this.listaRutaPlanificada.join(' '));
    this.contadorRutaPlanificada = this.listaRutaPlanificada.length;
    this.iv_EntradaRutaPlanificadaFC.setValue('');
  }

  // endregion: InfoVuelo

  async obtenerListas(): Promise<void> {
    this.listaPais = await this.SiidgacService.getPaises().toPromise();
    //console.log(this.listaPais);
    this.listaTipoVuelo = await this.SiidgacService.getMotivoSobrevuelo().toPromise();
    //console.log(this.listaTipoVuelo);
    this.listaTipoTripulante = await this.SiidgacService.getTipoTripulante().toPromise();
    console.log(this.listaTipoTripulante);
    this.listaNacionalidad = await this.SiidgacService.getNacionalidad().toPromise();
    console.log(this.listaNacionalidad);
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
        const dataFormulario = await this.formularioTramiteService.get<Formulario002_PVIResponse>(this.dataInput.tramiteReqId).toPromise();

        const { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6 } = JSON.parse(dataFormulario.metaData) as MetaData;
        //console.log(JSON.parse(dataFormulario.metaData));
        this.id = dataFormulario.formularioId;

        if (this.f_Seccion1FG.enabled) {

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
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }
    } else {
      // NO HAY DATOS GUARDADOS
      if (this.tipoSolicitante === 'PN') {
        try {
          const respuesta = await this.reniecService.getDni(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

          this.f_s1_ds_NombreFC.setValue(`${datosPersona.prenombres} ${datosPersona.apPrimer} ${datosPersona.apSegundo}`);
          this.f_s1_ds_NombreFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
          this.f_s1_ds_NombreFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PE') {
        try {
          const respuesta = await this.extranjeriaService.getCE(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }

          this.f_s1_ds_NombreFC.setValue(`${respuesta.CarnetExtranjeria.nombres} ${respuesta.CarnetExtranjeria.primerApellido} ${respuesta.CarnetExtranjeria.segundoApellido}`);
          this.f_s1_ds_NombreFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.f_s1_ds_NombreFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PNR') {
        try {
          const respuesta = await this.reniecService.getDni(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

          this.f_s1_ds_NombreFC.setValue(`${datosPersona.prenombres} ${datosPersona.apPrimer} ${datosPersona.apSegundo}`);
          this.f_s1_ds_NombreFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
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

    const dataGuardar = new Formulario002_PVIRequest();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F002-PVI';
    dataGuardar.formularioId = 2;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.estado = 1;

    const { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6 } = dataGuardar.metaData;
    const { datosOperador, datosSolicitante, facturarA, datosSolicitud } = seccion1;
    const { listaAeronave } = seccion2;
    const { listaTripulacion } = seccion3;
    const { listaInfoVuelo } = seccion4;

    seccion1.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
    seccion1.descProcedimientoTupa = this.descProcedimientoTupa;
    seccion1.codigoFormulario = dataGuardar.codigo;
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

    datosSolicitud.idAmbito = 2;
    datosSolicitud.idTipoPermiso = 361;
    datosSolicitud.idPermisoAmbito = 21;
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
        rutaPlanificada: controlFG.get('iv_RutaPlanificadaFC').value,
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 001-PVI';
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
