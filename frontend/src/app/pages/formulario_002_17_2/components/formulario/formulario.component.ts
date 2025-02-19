/**
 * Formulario 002/17.2 utilizado por los procedimientos DSTT-006, DSTT-007, DSTT-008, DSTT-009, DSTT-010, DSTT-011, DSTT-012, DSTT-013
 * DSTT-014, DSTT-015, DSTT-016, DSTT-017, DSTT-018, DSTT-019, DSTT-020, DSTT-021, DSTT-022, DSTT-023 Y DSTT-024
 * @author André Bernabé Pérez
 * @version 1.0 08.11.2021
 * @modify Alicia Toquila Q.
 * @version 2.0 19.07.2022
 * 
 * Se agregó las secciones de placas, pasajeros y conductores
 */

import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { TouchSequence } from 'selenium-webdriver';
import { Formulario002_17_2Request } from 'src/app/core/models/Formularios/Formulario002_17_2/Formulario002_17_2Request';
import { Formulario002_17_2Response } from 'src/app/core/models/Formularios/Formulario002_17_2/Formulario002_17_2Response';
import { Formulario003_17_2Response } from 'src/app/core/models/Formularios/Formulario003_17_2/Formulario003_17_2Response';
import { Flota, Conductor, Pasajero, Tripulante } from 'src/app/core/models/Formularios/Formulario002_17_2/Secciones';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Formulario002172Service } from 'src/app/core/services/formularios/formulario002-17-2.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
  // @ViewChild('ubigeoCmpPerJur') ubigeoPerJurComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

  formularioFG: UntypedFormGroup;
  visibleButtonCarf = false;
  visibleButtonVin = false;

  graboUsuario = false;

  id = 0;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;

  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];
  representanteLegal: Array<RepresentanteLegal>;
  txtTitulo = 'FORMULARIO 002-17.02 TRANSPORTE INTERNACIONAL TERRESTRE CONO SUR - COMUNIDAD ANDINA';
  oficinasRegistral: Array<any>;

  nroDocumentoLogin: string;
  nroRuc = '';
  razonSocial: string;
  cargoRepresentanteLegal = '';

  disableBtnBuscarRepLegal = false;

  maxLengthNumeroDocumentoRepLeg: number;

  tipoSolicitante: string;
  //codTipoDocSolicitante: string; // 01 DNI  03 CI  04 CE

  tipoDocumentoSolicitante: string;
  nombreTipoDocumentoSolicitante: string;
  numeroDocumentoSolicitante:string;
  nombreSolicitante:string;
  datosUsuarioLogin: DatosUsuarioLogin;

  listaFlotaVehicular: Flota[] = [];
  indexEditTabla = -1;

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  filePdfVinSeleccionado: any = null;
  filePdfVinPathName: string = null;

  public conductores: Conductor[] = [];
  public recordIndexToEditConductores: number;

  public tripulantes: Tripulante[] = [];
  public recordIndexToEditTripulantes: number;

  public pasajeros: Pasajero[] = [];
  public recordIndexToEditPasajeros: number;

  permisoInternacional: string[] = []; //DSTT-022
  paDJ42: string[] = ['DSTT-021'];
  paDJ43: string[] = ['DSTT-019', 'DSTT-020', 'DSTT-021', 'DSTT-022', 'DSTT-023'];
  paDJ44: string[] = ['DSTT-019', 'DSTT-022', 'DSTT-023', 'DSTT-025', 'DSTT-027'];
  paDJ45: string[] = ['DSTT-023', 'DSTT-025'];
  paDJ46: string[] = ['DSTT-026'];
  paDJ47: string[] = ['DSTT-026'];
  paDJ49: string[] = ['DSTT-006','DSTT-008','DSTT-010','DSTT-011','DSTT-012','DSTT-016','DSTT-019','DSTT-020'];

  paTipoServicio = [
    { pa: 'DSTT-006', tipoServicio: '23' }, //CONO SUR (ATIT)
    { pa: 'DSTT-007', tipoServicio: '22' }, //CONO SUR (ATIT)
    { pa: 'DSTT-008', tipoServicio: '23' }, //CONO SUR (ATIT)
    { pa: 'DSTT-009', tipoServicio: '22' }, //CONO SUR (ATIT)
    { pa: 'DSTT-010', tipoServicio: '23' }, //CONO SUR (ATIT)
    { pa: 'DSTT-011', tipoServicio: '23' }, //CONO SUR (ATIT)
    { pa: 'DSTT-012', tipoServicio: '23' }, //CONO SUR (ATIT)
    { pa: 'DSTT-013', tipoServicio: '22' }, //CONO SUR (ATIT)
    { pa: 'DSTT-014', tipoServicio: '9'  }, //CONO SUR (ATIT)
    { pa: 'DSTT-014', tipoServicio: '22' }, //CONO SUR (ATIT)
    { pa: 'DSTT-014', tipoServicio: '23' }, //CONO SUR (ATIT)

    { pa: 'DSTT-015', tipoServicio: '9' }, //CONO SUR (ATIT)
    { pa: 'DSTT-015', tipoServicio: '16' }, //CONO SUR (ATIT)
    { pa: 'DSTT-015', tipoServicio: '22' }, //CONO SUR (ATIT)
    { pa: 'DSTT-015', tipoServicio: '23' }, //CONO SUR (ATIT)
    
    { pa: 'DSTT-016', tipoServicio: '16' }, //COMUNIDAD ANDINA
    { pa: 'DSTT-017', tipoServicio: '15' }, //COMUNIDAD ANDINA
    { pa: 'DSTT-018', tipoServicio: '15' }, //COMUNIDAD ANDINA EMPRESA EXTRANJERA
    { pa: 'DSTT-019', tipoServicio: '16' }, //COMUNIDAD ANDINA EMPRESA NACIONAL
    { pa: 'DSTT-020', tipoServicio: '16' }, //COMUNIDAD ANDINA 

    { pa: 'DSTT-022', tipoServicio: '9' }, //COMUNIDAD ANDINA EMPRESA NACIONAL
    { pa: 'DSTT-022', tipoServicio: '10' }, //COMUNIDAD ANDINA EMPRESA NACIONAL
    { pa: 'DSTT-022', tipoServicio: '15' }, //COMUNIDAD ANDINA EMPRESA NACIONAL
    { pa: 'DSTT-022', tipoServicio: '16' }, //COMUNIDAD ANDINA EMPRESA NACIONAL

    { pa: 'DSTT-023', tipoServicio: '15' }, //COMUNIDAD ANDINA EMPRESA NACIONAL y EMPRESA EXTRANJERA

    { pa: 'DSTT-024', tipoServicio: '15' }, //COMUNIDAD ANDINA 
    { pa: 'DSTT-024', tipoServicio: '16' }, //COMUNIDAD ANDINA 
  ];

  tipoServicio = '';

  paSeccion4: string[] = ['DSTT-015','DSTT-022','DSTT-023'];
  paSeccion5: string[] = ['DSTT-023'];
  paSeccion6: string[] = ['DSTT-023'];

  paRelacionConductores: string[] = ['DSTT-023'];
  paRelacionPlacas: string[] = ['DSTT-015','DSTT-022','DSTT-023'];
  paRelacionPasajeros: string[] = ['DSTT-023'];
  paCategoriaM3: string[] = ['DSTT-027'];
  paValidaLicenciaConductor: string[] = ['DSTT-027'];
  RelacionConductores:boolean=false;
  RelacionPlacas:boolean=false;
  RelacionPasajeros: boolean=false;

  habilitarSeccion4 = true; // Sección de placas
  habilitarSeccion5 = true; // Sección de conductores
  habilitarSeccion6 = true; // Seccion de pasajeros

  habilitarPN:boolean = false;
  habilitarPJ:boolean = false;

  disabled = false
  ubigeo:boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private oficinaRegistralService: OficinaRegistralService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario002172Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private vehiculoService: VehiculoService,
    private renatService: RenatService,
    private mtcService: MtcService) {

      this.conductores = [];
      this.tripulantes = [];
      this.pasajeros = [];
      this.listaFlotaVehicular = [];
  }

  ngOnInit(): void {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    this.recordIndexToEditConductores = -1;
    this.recordIndexToEditPasajeros = -1;

    console.log('dataInput: ', this.dataInput);

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    this.formularioFG = this.formBuilder.group({
      f_Seccion2FG: this.formBuilder.group({
        f_s2_PerNatFG: this.formBuilder.group({
          f_s2_pn_NombresFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
          f_s2_pn_TipoDocSolicitanteFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          f_s2_pn_NroDocSolicitanteFC: ['', [Validators.required, exactLengthValidator([8, 9])]],
          f_s2_pn_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
          f_s2_pn_TelefonoFC: ['', [Validators.maxLength(9)]],
          f_s2_pn_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
          f_s2_pn_CorreoFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
          f_s2_pn_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s2_pn_DepartamentoFC: ['', [Validators.required]],
          f_s2_pn_ProvinciaFC: ['', [Validators.required]],
          f_s2_pn_DistritoFC: ['', [Validators.required]],
        }),
        f_s2_PerJurFG: this.formBuilder.group({
          f_s2_pj_RazonSocialFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s2_pj_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
          f_s2_pj_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s2_pj_DepartamentoFC: ['', [Validators.required]],
          f_s2_pj_ProvinciaFC: ['', [Validators.required]],
          f_s2_pj_DistritoFC: ['', [Validators.required]],
          f_s2_pj_RepLegalFG: this.formBuilder.group({
            f_s2_pj_rl_TipoDocumentoFC: ['', [Validators.required]],
            f_s2_pj_rl_NumeroDocumentoFC: ['', [Validators.required]], // at runtime maxlength
            f_s2_pj_rl_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
            f_s2_pj_rl_ApePaternoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
            f_s2_pj_rl_ApeMaternoFC: ['', [noWhitespaceValidator(), Validators.maxLength(50)]],
            f_s2_pj_rl_TelefonoFC: ['', [Validators.maxLength(9)]],
            f_s2_pj_rl_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
            f_s2_pj_rl_CorreoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.email, Validators.maxLength(50)]],
            f_s2_pj_rl_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
            f_s2_pj_rl_DepartamentoFC: ['', [Validators.required]],
            f_s2_pj_rl_ProvinciaFC: ['', [Validators.required]],
            f_s2_pj_rl_DistritoFC: ['', [Validators.required]],
            f_s2_pj_rl_OficinaFC: ['', [Validators.required]],
            f_s2_pj_rl_PartidaFC: ['', [Validators.required, Validators.maxLength(15)]],
            f_s2_pj_rl_AsientoFC: ['', [Validators.required, Validators.maxLength(15)]],
          }),
        }),
      }),
      f_Seccion3FG: this.formBuilder.group({
        f_s3_declaracion_41: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_42: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_43: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_44: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_45: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_46: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_47: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_48: [{value:false, disabled:false}, [Validators.requiredTrue]],
        f_s3_declaracion_49: [{value:false, disabled:false}, [Validators.requiredTrue]],
      }),
      f_Seccion4FG: this.formBuilder.group({
        f_s4_PlacaRodajeFC: this.formBuilder.control(''),
        f_s4_SoatFC: this.formBuilder.control(''),
        f_s4_CitvFC: this.formBuilder.control(''),
        f_s4_CafFC: this.formBuilder.control(false),
        f_s4_Vin: this.formBuilder.control(false),
        f_s4_NroVinculado: this.formBuilder.control('')
      }),
      f_Seccion5FG: this.formBuilder.group({
        f_s5_TipoDocumentoConductor: this.formBuilder.control(''),
        f_s5_NumeroDocumentoConductor: this.formBuilder.control(''),
        f_s5_NombresApellidos: this.formBuilder.control(''),
        f_s5_NumeroLicencia: this.formBuilder.control(''),
        f_s5_ClaseCategoria: this.formBuilder.control('')
      }),
      f_Seccion6FG: this.formBuilder.group({
        f_s6_TipoDocumentoPasajero: this.formBuilder.control(''),
        f_s6_NumeroDocumentoPasajero: this.formBuilder.control(''),
        f_s6_NombresApellidos: this.formBuilder.control(''),
      })
    });

    if (this.paSeccion4.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion4 = true; else this.habilitarSeccion4 = false;
    if (this.paSeccion5.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion5 = true; else this.habilitarSeccion5 = false;
    if (this.paSeccion6.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion6 = true; else this.habilitarSeccion6 = false;
    if (this.paRelacionConductores.indexOf(this.codigoProcedimientoTupa) > -1) this.RelacionConductores = true; else this.RelacionConductores = false;
    if (this.paRelacionPlacas.indexOf(this.codigoProcedimientoTupa) > -1) this.RelacionPlacas = true; else this.RelacionPlacas = false;
    if (this.paRelacionPasajeros.indexOf(this.codigoProcedimientoTupa) > -1) this.RelacionPasajeros = true; else this.RelacionPasajeros = false;
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.paDJ42.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_42.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_42.disable({ emitEvent: false });
    }
    if (this.paDJ43.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_43.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_43.disable({ emitEvent: false });
    }
    if (this.paDJ44.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_44.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_44.disable({ emitEvent: false });
    }
    if (this.paDJ45.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_45.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_45.disable({ emitEvent: false });
    }
    if (this.paDJ46.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_46.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_46.disable({ emitEvent: false });
    }
    if (this.paDJ47.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_47.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_47.disable({ emitEvent: false });
    }

    if (this.paDJ49.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s3_declaracion_49.enable({ emitEvent: false });
    } else {
      this.f_s3_declaracion_49.disable({ emitEvent: false });
    }

    await this.cargarOficinaRegistral();

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       // nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   // tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    // nro de documento usuario login
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // datos del usuario

    console.log(tipoDocumento);
    console.log(this.razonSocial);
    switch (tipoDocumento) {
      case '00001':
        this.f_s2_PerNatFG.enable({ emitEvent: false });
        this.f_s2_PerJurFG.disable({ emitEvent: false });
        this.habilitarPJ =  false;
        this.habilitarPN = true;
        this.ubigeo = false;
        break;
      case '00004':
        this.f_s2_PerNatFG.enable({ emitEvent: false });
        this.f_s2_PerJurFG.disable({ emitEvent: false });
        this.habilitarPJ =  false;
        this.habilitarPN = true;
        this.ubigeo = true;
        break;
      case '00005':
      case '00002':
        this.f_s2_PerNatFG.disable({ emitEvent: false });
        this.f_s2_PerJurFG.enable({ emitEvent: false });

        this.habilitarPJ =  true;
        this.habilitarPN = false;
        this.ubigeo = false;
        break;
    }

    this.onChangeTipoDocumento();

    await this.cargarDatos();

    // Permiso Empresa Internacional DSTT-022
    if (this.permisoInternacional.indexOf(this.codigoProcedimientoTupa) > -1) {
      await this.verificarPermisoInternacional();
    }
  }

  async verificarPermisoInternacional(): Promise<void> {
    try {
      const resp: any = await this.renatService.EmpresaServicio(this.nroRuc).toPromise();
      if (!resp) {
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('No hay permisos vigentes registrados para esta empresa.');
        this.formularioFG.disable();
        return;
      } else {
        const partidas = JSON.parse(JSON.stringify(resp));
        console.log(partidas.indexOf('CIR'));

        if (partidas.indexOf('CIR') === -1) {
          this.funcionesMtcService.mensajeError('La empresa no cuenta con autorización para el transporte terrestre internacional.');
          this.formularioFG.disable();
          return;
        }
      }
    } catch (error) {
      console.log(error);
      this.funcionesMtcService.mensajeError('Error al consultar los permisos para esta empresa');
      this.formularioFG.disable();
    }
  }

  // GET FORM formularioFG
  get f_Seccion2FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion2FG') as UntypedFormGroup; }
  get f_s2_PerNatFG(): UntypedFormGroup { return this.f_Seccion2FG.get('f_s2_PerNatFG') as UntypedFormGroup; }
  get f_s2_pn_NombresFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_NombresFC']); }
  get f_s2_pn_TipoDocSolicitanteFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_TipoDocSolicitanteFC']); }
  get f_s2_pn_NroDocSolicitanteFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_NroDocSolicitanteFC']); }
  get f_s2_pn_RucFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_RucFC']); }
  get f_s2_pn_TelefonoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_TelefonoFC']); }
  get f_s2_pn_CelularFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_CelularFC']); }
  get f_s2_pn_CorreoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_CorreoFC']); }
  get f_s2_pn_DomicilioFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_DomicilioFC']); }
  get f_s2_pn_DepartamentoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_DepartamentoFC']); }
  get f_s2_pn_ProvinciaFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_ProvinciaFC']); }
  get f_s2_pn_DistritoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_DistritoFC']); }
  get f_s2_PerJurFG(): UntypedFormGroup { return this.f_Seccion2FG.get('f_s2_PerJurFG') as UntypedFormGroup; }
  get f_s2_pj_RazonSocialFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_RazonSocialFC']); }
  get f_s2_pj_RucFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_RucFC']); }
  get f_s2_pj_DomicilioFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_DomicilioFC']); }
  get f_s2_pj_DepartamentoFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_DepartamentoFC']); }
  get f_s2_pj_ProvinciaFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_ProvinciaFC']); }
  get f_s2_pj_DistritoFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_DistritoFC']); }
  get f_s2_pj_RepLegalFG(): UntypedFormGroup { return this.f_s2_PerJurFG.get('f_s2_pj_RepLegalFG') as UntypedFormGroup; }
  get f_s2_pj_rl_TipoDocumentoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_TipoDocumentoFC']); }
  get f_s2_pj_rl_NumeroDocumentoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_NumeroDocumentoFC']); }
  get f_s2_pj_rl_NombreFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_NombreFC']); }
  get f_s2_pj_rl_ApePaternoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_ApePaternoFC']); }
  get f_s2_pj_rl_ApeMaternoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_ApeMaternoFC']); }
  get f_s2_pj_rl_TelefonoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_TelefonoFC']); }
  get f_s2_pj_rl_CelularFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_CelularFC']); }
  get f_s2_pj_rl_CorreoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_CorreoFC']); }
  get f_s2_pj_rl_DomicilioFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_DomicilioFC']); }
  get f_s2_pj_rl_DepartamentoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_DepartamentoFC']); }
  get f_s2_pj_rl_ProvinciaFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_ProvinciaFC']); }
  get f_s2_pj_rl_DistritoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_DistritoFC']); }
  get f_s2_pj_rl_OficinaFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_OficinaFC']); }
  get f_s2_pj_rl_PartidaFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_PartidaFC']); }
  get f_s2_pj_rl_AsientoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_AsientoFC']); }
  get f_Seccion3FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup; }
  get f_s3_declaracion_41(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_41']); }
  get f_s3_declaracion_42(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_42']); }
  get f_s3_declaracion_43(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_43']); }
  get f_s3_declaracion_44(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_44']); }
  get f_s3_declaracion_45(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_45']); }
  get f_s3_declaracion_46(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_46']); }
  get f_s3_declaracion_47(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_47']); }
  get f_s3_declaracion_48(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_48']); }
  get f_s3_declaracion_49(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_declaracion_49']); }
  get f_Seccion4FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion4FG') as UntypedFormGroup; }
  get f_s4_PlacaRodajeFC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_PlacaRodajeFC']); }
  get f_s4_SoatFC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_SoatFC']); }
  get f_s4_CitvFC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_CitvFC']); }
  get f_s4_CafFC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_CafFC']); }
  get f_s4_Vin(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Vin']); }
  get f_s4_NroVinculado(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_NroVinculado']); }
  get f_Seccion5FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion5FG') as UntypedFormGroup; }
  get f_s5_TipoDocumentoConductor(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_TipoDocumentoConductor']); }
  get f_s5_NumeroDocumentoConductor(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NumeroDocumentoConductor']); }
  get f_s5_NombresApellidos(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NombresApellidos']); }
  get f_s5_NumeroLicencia(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NumeroLicencia']); }
  get f_s5_ClaseCategoria(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_ClaseCategoria']); }
  get f_Seccion6FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion6FG') as UntypedFormGroup; }
  get f_s6_TipoDocumentoPasajero(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_TipoDocumentoPasajero']); }
  get f_s6_NumeroDocumentoPasajero(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_NumeroDocumentoPasajero']); }
  get f_s6_NombresApellidos(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_NombresApellidos']); }

  // FIN GET FORM formularioFG

  // validaAutorizacion(): void {
  //   this.renatService.EmpresaServicioVigencia(this.nroRuc, parseInt(this.codigoTipoSolicitudTupa)).subscribe((data: any) => {
  //     console.log('infoautorizacion = ', data.length);
  //     console.log('infoautorizacion = ', data);
  //     if (data.length == 0) {
  //       this.funcionesMtcService
  //         .ocultarCargando()
  //         .mensajeError('La empresa no cuenta con autorización vigente para el ' + this.descTipoSolicitudTupa);
  //     } else {
  //       this.formulario.controls['autorizacion'].setValue(true);
  //       this.formulario.updateValueAndValidity();
  //     }
  //   }, error => {
  //     this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para verificar la autorización de la Empresa.');
  //   });
  // }

  async cargarOficinaRegistral(): Promise<void> {
    try {
      const dataOficinaRegistral = await this.oficinaRegistralService.oficinaRegistral().toPromise();
      this.oficinasRegistral = dataOficinaRegistral;
      this.funcionesMtcService.ocultarCargando();
    }
    catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
    }
  }

  onChangeTipoDocumento(): void {
    this.f_s2_pj_rl_TipoDocumentoFC.valueChanges.subscribe((tipoDocumento: string) => {
      if (tipoDocumento?.trim() === '04') {
        this.f_s2_pj_rl_ApeMaternoFC.clearValidators();
        this.f_s2_pj_rl_ApeMaternoFC.updateValueAndValidity();

        this.f_s2_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([9])]);
        this.f_s2_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.f_s2_pj_rl_ApeMaternoFC.setValidators([Validators.required]);
        this.f_s2_pj_rl_ApeMaternoFC.updateValueAndValidity();

        this.f_s2_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([8])]);
        this.f_s2_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }

      this.f_s2_pj_rl_NumeroDocumentoFC.reset('', { emitEvent: false });
      this.inputNumeroDocumento();
    });
  }

  inputNumeroDocumento(event?): void {
    if (event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    this.f_s2_pj_rl_NombreFC.reset('', { emitEvent: false });
    this.f_s2_pj_rl_ApePaternoFC.reset('', { emitEvent: false });
    this.f_s2_pj_rl_ApeMaternoFC.reset('', { emitEvent: false });
  }

  async buscarNumeroDocumento(): Promise<void> {
    const tipoDocumento: string = this.f_s2_pj_rl_TipoDocumentoFC.value.trim();
    const numeroDocumento: string = this.f_s2_pj_rl_NumeroDocumentoFC.value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      return;
    }
    if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
      this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      return;
    }

    const resultado = this.representanteLegal?.find(
      representante => (
        '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
        representante.nroDocumento.trim() === numeroDocumento
    );

    if (resultado || this.tipoSolicitante === 'PNR') {
      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '01') {// DNI
        try {
          const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          const ubigeo = datosPersona.ubigeo.split('/');
          const cargo = resultado?.cargo?.split('-');
          if (cargo) {
            this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
          }
          this.addPersona(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion,
            ubigeo[2],
            ubigeo[1],
            ubigeo[0]);
        }
        catch (e) {
          console.error(e);

          this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de RENIEC no se encuentra disponible. Vuelva a intentarlo más tarde.');
          this.f_s2_pj_rl_NombreFC.enable();
          this.f_s2_pj_rl_ApePaternoFC.enable();
          this.f_s2_pj_rl_ApeMaternoFC.enable();
        }
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
        try {
          const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }

          this.addPersona(tipoDocumento,
            respuesta.CarnetExtranjeria.nombres,
            respuesta.CarnetExtranjeria.primerApellido,
            respuesta.CarnetExtranjeria.segundoApellido,
            '',
            '',
            '',
            '');
        }
        catch (e) {
          console.error(e);

          this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de MIGRACIONES no se encuentra disponible. Vuelva a intentarlo más tarde.');
          this.f_s2_pj_rl_NombreFC.enable();
          this.f_s2_pj_rl_ApePaternoFC.enable();
          this.f_s2_pj_rl_ApeMaternoFC.enable();
        }
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }

  async addPersona(
    tipoDocumento: string,
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string): Promise<void> {

    if (this.tipoSolicitante === 'PNR') {
      this.f_s2_pj_rl_NombreFC.setValue(nombres);
      this.f_s2_pj_rl_ApePaternoFC.setValue(apPaterno);
      this.f_s2_pj_rl_ApeMaternoFC.setValue(apMaterno);
      this.f_s2_pj_rl_DomicilioFC.setValue(direccion);

      this.f_s2_pj_rl_NombreFC.disable({ emitEvent: false });
      this.f_s2_pj_rl_ApePaternoFC.disable({ emitEvent: false });
      this.f_s2_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

      await this.ubigeoRepLegComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito);
    }
    else {
      this.funcionesMtcService
        .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
        .then(async () => {
          this.f_s2_pj_rl_NombreFC.setValue(nombres);
          this.f_s2_pj_rl_ApePaternoFC.setValue(apPaterno);
          this.f_s2_pj_rl_ApeMaternoFC.setValue(apMaterno);
          this.f_s2_pj_rl_DomicilioFC.setValue(direccion);

          this.f_s2_pj_rl_NombreFC.disable({ emitEvent: false });
          this.f_s2_pj_rl_ApePaternoFC.disable({ emitEvent: false });
          this.f_s2_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

          await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito);
        });
    }
  }

  async cargarDatos(): Promise<void> {
    
    this.funcionesMtcService.mostrarCargando();

    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.f_s2_pn_TipoDocSolicitanteFC.setValue('DNI');

        this.tipoDocumentoSolicitante = "01";
        this.nombreTipoDocumentoSolicitante = "DNI";
        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
        this.nombreSolicitante = this.seguridadService.getUserName();
        
        break;

      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        this.f_s2_pn_TipoDocSolicitanteFC.setValue('DNI');

        break;

      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.nombreSolicitante = this.seguridadService.getUserName();
        
        switch(this.seguridadService.getTipoDocumento()){
          case "00003": this.tipoDocumentoSolicitante = "04";
                        this.nombreTipoDocumentoSolicitante = "CE";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNET DE EXTRANJERIA');
                        break;
          case "00101": this.tipoDocumentoSolicitante = "05";
                        this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNÉ SOLICITANTE DE REFUGIO');
                        break;
          case "00102": this.tipoDocumentoSolicitante = "06";
                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA');
                        break;
          case "00103": this.tipoDocumentoSolicitante = "07";
                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNÉ DE IDENTIFICACION');
                        break;
        }
        break;

      case '00005':
                    this.tipoSolicitante = 'PNR'; // persona natural con ruc
                    this.f_s2_pn_TipoDocSolicitanteFC.setValue('DNI');
                    this.tipoDocumentoSolicitante = "01";
                    this.nombreTipoDocumentoSolicitante = "DNI";
                    this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                    break;
                }

    if (this.dataInput != null && this.dataInput.movId > 0) {
      try {
        const dataFormulario = await this.formularioTramiteService.get<Formulario002_17_2Response>(this.dataInput.tramiteReqId).toPromise();

        this.funcionesMtcService.ocultarCargando();
        const metaData = JSON.parse(dataFormulario.metaData);
        console.log(metaData);
        this.id = dataFormulario.formularioId;

        if (this.f_s2_PerNatFG.enabled) {
          this.f_s2_pn_NombresFC.setValue(metaData.seccion3.nombresApellidos);
          this.f_s2_pn_NroDocSolicitanteFC.setValue(metaData.seccion3.numeroDocumento);
          this.f_s2_pn_DomicilioFC.setValue(metaData.seccion3.domicilioLegal);
          this.f_s2_pn_CelularFC.setValue(metaData.seccion3.celular);
          this.f_s2_pn_TelefonoFC.setValue(metaData.seccion3.telefono);
          this.f_s2_pn_CorreoFC.setValue(metaData.seccion3.email);
          this.f_s2_pn_RucFC.clearValidators();
          this.f_s2_pn_RucFC.updateValueAndValidity();

          if(this.tipoSolicitante=="PE"){
            this.ubigeo = true;
            await this.ubigeoPerNatComponent?.setUbigeoByText(
              metaData.seccion3.departamento,
              metaData.seccion3.provincia,
              metaData.seccion3.distrito);
          }

          if(this.tipoSolicitante=="PN"){
            this.f_s2_pn_DepartamentoFC.setValue(metaData.seccion3.departamento);
            this.f_s2_pn_ProvinciaFC.setValue(metaData.seccion3.provincia);
            this.f_s2_pn_DistritoFC.setValue(metaData.seccion3.distrito);
          }
          this.f_s2_pn_TipoDocSolicitanteFC.disable();
          this.f_s2_pn_RucFC.disable();
          this.f_s2_pn_NombresFC.disable();
          this.f_s2_pn_NroDocSolicitanteFC.disable();
          this.f_s2_pn_DomicilioFC.disable();
          this.f_s2_pn_RucFC.clearValidators();
          this.f_s2_pn_DepartamentoFC.disable();
          this.f_s2_pn_ProvinciaFC.disable();
          this.f_s2_pn_DistritoFC.disable();
        }

        if (this.f_s2_PerJurFG.enabled) {
          this.f_s2_pj_RucFC.setValue(metaData.seccion3.numeroDocumento);
          this.f_s2_pj_RazonSocialFC.setValue(metaData.seccion3.razonSocial);
          this.f_s2_pj_DomicilioFC.setValue(metaData.seccion3.domicilioLegal);

          this.f_s2_pj_DepartamentoFC.setValue(metaData.seccion3.departamento.trim());
          this.f_s2_pj_ProvinciaFC.setValue(metaData.seccion3.provincia.trim());
          this.f_s2_pj_DistritoFC.setValue(metaData.seccion3.distrito.trim());

          this.f_s2_pj_rl_TelefonoFC.setValue(metaData.seccion3.telefono);
          this.f_s2_pj_rl_CelularFC.setValue(metaData.seccion3.celular);
          this.f_s2_pj_rl_CorreoFC.setValue(metaData.seccion3.email);
          this.f_s2_pj_rl_TipoDocumentoFC.setValue(metaData.seccion3.RepresentanteLegal.tipoDocumento.id);
          this.f_s2_pj_rl_NumeroDocumentoFC.setValue(metaData.seccion3.RepresentanteLegal.numeroDocumento);
          this.f_s2_pj_rl_NombreFC.setValue(metaData.seccion3.RepresentanteLegal.nombres);
          this.f_s2_pj_rl_ApePaternoFC.setValue(metaData.seccion3.RepresentanteLegal.apellidoPaterno);
          this.f_s2_pj_rl_ApeMaternoFC.setValue(metaData.seccion3.RepresentanteLegal.apellidoMaterno);
          this.f_s2_pj_rl_DomicilioFC.setValue(metaData.seccion3.RepresentanteLegal.domicilioLegal);

          await this.ubigeoRepLegComponent?.setUbigeoByText(
            metaData.seccion3.RepresentanteLegal.departamento,
            metaData.seccion3.RepresentanteLegal.provincia,
            metaData.seccion3.RepresentanteLegal.distrito);

          this.f_s2_pj_rl_OficinaFC.setValue(metaData.seccion3.RepresentanteLegal.oficinaRegistral.id);
          this.f_s2_pj_rl_PartidaFC.setValue(metaData.seccion3.RepresentanteLegal.partida);
          this.f_s2_pj_rl_AsientoFC.setValue(metaData.seccion3.RepresentanteLegal.asiento);

          this.f_s2_pj_RazonSocialFC.disable();
          this.f_s2_pj_RucFC.disable();
          this.f_s2_pj_DomicilioFC.disable();
          this.f_s2_pj_DistritoFC.disable({ emitEvent: false });
          this.f_s2_pj_ProvinciaFC.disable({ emitEvent: false });
          this.f_s2_pj_DepartamentoFC.disable({ emitEvent: false });

          if (this.tipoSolicitante === 'PNR') {
            this.f_s2_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
            this.f_s2_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });

            this.f_s2_pj_RucFC.clearValidators();
            this.f_s2_pj_RucFC.updateValueAndValidity();
            this.f_s2_pj_RucFC.disable({ emitEvent: false });

            this.f_s2_pj_DepartamentoFC.clearValidators();
            this.f_s2_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
            this.f_s2_pj_DepartamentoFC.disable({ emitEvent: false });
            this.f_s2_pj_ProvinciaFC.clearValidators();
            this.f_s2_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
            this.f_s2_pj_ProvinciaFC.disable({ emitEvent: false });
            this.f_s2_pj_DistritoFC.clearValidators();
            this.f_s2_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
            this.f_s2_pj_DistritoFC.disable({ emitEvent: false });

            this.f_s2_pj_rl_NombreFC.disable({ emitEvent: false });
            this.f_s2_pj_rl_ApePaternoFC.disable({ emitEvent: false });
            this.f_s2_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

            this.disableBtnBuscarRepLegal = true;
          }
        }
        if(metaData.seccion7 != null){
            for (const item of metaData.seccion7.FlotaVehicular) {
              this.listaFlotaVehicular.push({
                placaRodaje: item.placaRodaje,
                soat: item.soat,
                citv: item.citv,
                caf: item.caf === true || item.caf === 'true' ? true : false,
                pathName: item.pathName,
                file: null,
                vin:item.vin === true || item.vin === 'true' ? true : false,
                nroVinculado: item.nroVinculado,
                pathNameVin: item.pathNameVin,
                fileVin:null
              });
            }

          for (const item of metaData.seccion7.RelacionConductores) {
            this.conductores.push({
              tipoDocumentoConductor: item.tipoDocumentoConductor,
              numeroDocumentoConductor: item.numeroDocumentoConductor,
              nombresApellidos: item.nombresApellidos,
              numeroLicencia: item.numeroLicencia,
              edad:item.edad,
              categoria: item.categoria,
              subcategoria: item.subCategoria
            });
          }

          for (const item of metaData.seccion7.RelacionPasajeros) {
            this.pasajeros.push({
              tipoDocumentoPasajero: item.tipoDocumentoPasajero,
              nombreTipoDocumentoPasajero: item.nombreTipoDocumentoPasajero,
              numeroDocumentoPasajero: item.numeroDocumentoPasajero,
              nombresApellidos: item.nombresApellidos
            });
          }
        }
        this.f_s3_declaracion_41.setValue(metaData.seccion4.declaracion_41);
        this.f_s3_declaracion_42.setValue(metaData.seccion4.declaracion_42);
        this.f_s3_declaracion_43.setValue(metaData.seccion4.declaracion_43);
        this.f_s3_declaracion_44.setValue(metaData.seccion4.declaracion_44);
        this.f_s3_declaracion_45.setValue(metaData.seccion4.declaracion_45);
        this.f_s3_declaracion_46.setValue(metaData.seccion4.declaracion_46);
        this.f_s3_declaracion_47.setValue(metaData.seccion4.declaracion_47);
        this.f_s3_declaracion_48.setValue(metaData.seccion4.declaracion_48);
        this.f_s3_declaracion_49.setValue(metaData.seccion4.declaracion_49);
      }
      catch (e) {
        console.error(e);
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }
    } else {
      switch(this.tipoSolicitante){
        case "PNR": 
          this.f_s2_pj_rl_TipoDocumentoFC.setValue('01');
          this.f_s2_pj_rl_NumeroDocumentoFC.setValue(this.nroDocumentoLogin);
          await this.buscarNumeroDocumento();
          this.f_s2_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
          this.f_s2_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });
          this.disableBtnBuscarRepLegal = true;

          this.f_s2_pj_RucFC.clearValidators();
          this.f_s2_pj_RucFC.updateValueAndValidity();
          this.f_s2_pj_RucFC.disable({ emitEvent: false });

          this.f_s2_pj_DepartamentoFC.clearValidators();
          this.f_s2_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
          this.f_s2_pj_DepartamentoFC.disable({ emitEvent: false });
          this.f_s2_pj_ProvinciaFC.clearValidators();
          this.f_s2_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
          this.f_s2_pj_ProvinciaFC.disable({ emitEvent: false });
          this.f_s2_pj_DistritoFC.clearValidators();
          this.f_s2_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
          this.f_s2_pj_DistritoFC.disable({ emitEvent: false });
          break;
          
        case "PN": 
          try{
            
            
            const respuesta = await this.reniecService.getDni(this.numeroDocumentoSolicitante).toPromise();
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
            } 

            const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
            let ubigeoPersona:any[] = [];
            this.f_s2_pn_NombresFC.setValue(datosPersona.prenombres + ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo);
            
            this.f_s2_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante);
            this.f_s2_pn_DomicilioFC.setValue(datosPersona.direccion);
            ubigeoPersona = datosPersona.ubigeo.split('/'),
            this.f_s2_pn_DepartamentoFC.setValue(ubigeoPersona[0].trim());
            this.f_s2_pn_ProvinciaFC.setValue(ubigeoPersona[1].trim());
            this.f_s2_pn_DistritoFC.setValue(ubigeoPersona[2].trim());

            this.f_s2_pn_NombresFC.disable();
            this.f_s2_pn_NroDocSolicitanteFC.disable();
            this.f_s2_pn_TipoDocSolicitanteFC.disable();
            this.f_s2_pn_DomicilioFC.disable();
            this.f_s2_pn_DepartamentoFC.disable();
            this.f_s2_pn_ProvinciaFC.disable();
            this.f_s2_pn_DistritoFC.disable();

            this.f_s2_pn_RucFC.clearValidators();
            this.f_s2_pn_RucFC.updateValueAndValidity();
            this.f_s2_pn_RucFC.disable();

          }
          catch(e){
            console.error(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('El servicio de la RENIEC no se encuentra disponible, deberá ingresar los datos completos.');
            this.f_s2_pn_NombresFC.enable();
            this.f_s2_pn_DomicilioFC.enable();
            this.f_s2_pn_DepartamentoFC.enable();
            this.f_s2_pn_ProvinciaFC.enable();
            this.f_s2_pn_DistritoFC.enable();
          }
          break;
        
        case "PJ":
          try {
          const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
          this.funcionesMtcService.ocultarCargando();
          this.f_s2_pj_RazonSocialFC.setValue(response.razonSocial.trim());
          this.f_s2_pj_RucFC.setValue(response.nroDocumento.trim());
          this.f_s2_pj_DomicilioFC.setValue(response.domicilioLegal.trim());
          this.f_s2_pj_DepartamentoFC.setValue(response.nombreDepartamento.trim());
          this.f_s2_pj_ProvinciaFC.setValue(response.nombreProvincia.trim());
          this.f_s2_pj_DistritoFC.setValue(response.nombreDistrito.trim());

          this.f_s2_pj_rl_TelefonoFC.setValue(response.telefono.trim());
          this.f_s2_pj_rl_CelularFC.setValue(response.celular.trim());
          this.f_s2_pj_rl_CorreoFC.setValue(response.correo.trim());

          this.f_s2_pj_RazonSocialFC.disable();
          this.f_s2_pj_RucFC.disable();
          this.f_s2_pj_DomicilioFC.disable();
          this.f_s2_pj_DistritoFC.disable({ emitEvent: false });
          this.f_s2_pj_ProvinciaFC.disable({ emitEvent: false });
          this.f_s2_pj_DepartamentoFC.disable({ emitEvent: false });

          this.representanteLegal = response.representanteLegal;
          }catch (e){
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio ');
  
            this.f_s2_pj_RazonSocialFC.setValue(this.razonSocial);
            this.f_s2_pj_RucFC.setValue(this.nroRuc);
  
            this.f_s2_pj_DomicilioFC.enable();
            this.f_s2_pj_DistritoFC.enable();
            this.f_s2_pj_ProvinciaFC.enable();
            this.f_s2_pj_DepartamentoFC.enable();
          }
          break;
        case "PE":
            this.funcionesMtcService.ocultarCargando();
            this.f_s2_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante);
            this.f_s2_pn_NombresFC.setValue(this.nombreSolicitante);
            this.f_s2_pn_DomicilioFC.enable();
            this.ubigeo=true;
            this.f_s2_pn_DistritoFC.enable();
            this.f_s2_pn_ProvinciaFC.enable();
            this.f_s2_pn_DepartamentoFC.enable();

            this.f_s2_pn_RucFC.clearValidators();
            this.f_s2_pn_RucFC.updateValueAndValidity();
            this.f_s2_pn_RucFC.disable();

            this.f_s2_pn_NroDocSolicitanteFC.disable();
            this.f_s2_pn_NombresFC.disable();
            this.f_s2_pn_TipoDocSolicitanteFC.disable();
            break;
      }
    }
  }

  soloNumeros(event): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  guardarFormulario(): void {
    if (this.formularioFG.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    if(this.RelacionConductores && this.conductores.length===0){
      this.funcionesMtcService.mensajeError('Debe ingresar la relación de CONDUCTORES.');
      return;
    }

    if(this.RelacionPasajeros && this.pasajeros.length===0){
      this.funcionesMtcService.mensajeError('Debe ingresar la relación de PASAJEROS.');
      return;
    }

    if(this.RelacionPlacas && this.listaFlotaVehicular.length===0){
      this.funcionesMtcService.mensajeError('Debe ingresar la relación de FLOTA VEHICULAR.');
      return;
    }

    const oficinaRepresentante = this.f_s2_pj_rl_OficinaFC.value;

    const dataGuardar = new Formulario002_17_2Request();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F002-17.2';
    dataGuardar.formularioId = 2;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    (dataGuardar.idTramiteReq = this.dataInput.tramiteReqId),
      (dataGuardar.estado = 1);

    dataGuardar.metaData.seccion1.dstt_006 =
      this.codigoProcedimientoTupa === 'DSTT-006';
    dataGuardar.metaData.seccion1.dstt_007 =
      this.codigoProcedimientoTupa === 'DSTT-007';
    dataGuardar.metaData.seccion1.dstt_008 =
      this.codigoProcedimientoTupa === 'DSTT-008';
    dataGuardar.metaData.seccion1.dstt_009 =
      this.codigoProcedimientoTupa === 'DSTT-009';
    dataGuardar.metaData.seccion1.dstt_010 =
      this.codigoProcedimientoTupa === 'DSTT-010';
    dataGuardar.metaData.seccion1.dstt_011 =
      this.codigoProcedimientoTupa === 'DSTT-011';
    dataGuardar.metaData.seccion1.dstt_012 =
      this.codigoProcedimientoTupa === 'DSTT-012';
    dataGuardar.metaData.seccion1.dstt_013 =
      this.codigoProcedimientoTupa === 'DSTT-013';
    dataGuardar.metaData.seccion1.dstt_014 =
      this.codigoProcedimientoTupa === 'DSTT-014';
    dataGuardar.metaData.seccion1.dstt_015 =
      this.codigoProcedimientoTupa === 'DSTT-015';
    dataGuardar.metaData.seccion1.dstt_016 =
      this.codigoProcedimientoTupa === 'DSTT-016';
    dataGuardar.metaData.seccion1.dstt_017 =
      this.codigoProcedimientoTupa === 'DSTT-017';
    dataGuardar.metaData.seccion1.dstt_018 =
      this.codigoProcedimientoTupa === 'DSTT-018';
    dataGuardar.metaData.seccion1.dstt_019 =
      this.codigoProcedimientoTupa === 'DSTT-019';
    dataGuardar.metaData.seccion1.dstt_020 =
      this.codigoProcedimientoTupa === 'DSTT-020';
    dataGuardar.metaData.seccion1.dstt_021 =
      this.codigoProcedimientoTupa === 'DSTT-021';
    dataGuardar.metaData.seccion1.dstt_022 =
      this.codigoProcedimientoTupa === 'DSTT-022';
    dataGuardar.metaData.seccion1.dstt_023 =
      this.codigoProcedimientoTupa === 'DSTT-023';
    dataGuardar.metaData.seccion1.dstt_024 =
      this.codigoProcedimientoTupa === 'DSTT-024';

    dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;
    dataGuardar.metaData.seccion3.nombresApellidos =
      this.tipoSolicitante === 'PN' ||
        this.tipoSolicitante === 'PE'
        ? this.f_s2_pn_NombresFC.value
        : '';
    dataGuardar.metaData.seccion3.tipoDocumento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_rl_TipoDocumentoFC.value
        : this.tipoDocumentoSolicitante; // codDocumento
    dataGuardar.metaData.seccion3.numeroDocumento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_RucFC.value
        : this.f_s2_pn_NroDocSolicitanteFC.value; // nroDocumento
    dataGuardar.metaData.seccion3.ruc =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR' ? '' : this.f_s2_pn_RucFC.value;
    dataGuardar.metaData.seccion3.razonSocial =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR' ? this.f_s2_pj_RazonSocialFC.value : '';
    dataGuardar.metaData.seccion3.domicilioLegal =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_DomicilioFC.value
        : this.f_s2_pn_DomicilioFC.value;
    // dataGuardar.metaData.seccion3.distrito =
    //   this.tipoSolicitante === 'PJ' ||
    //     this.tipoSolicitante === 'PNR'
    //     ? this.ubigeoPerJurComponent?.getDistritoText() ?? ''
    //     : this.ubigeoPerNatComponent?.getDistritoText() ?? '';
    // dataGuardar.metaData.seccion3.provincia =
    //   this.tipoSolicitante === 'PJ' ||
    //     this.tipoSolicitante === 'PNR'
    //     ? this.ubigeoPerJurComponent?.getProvinciaText() ?? ''
    //     : this.ubigeoPerNatComponent?.getProvinciaText() ?? '';
    // dataGuardar.metaData.seccion3.departamento =
    //   this.tipoSolicitante === 'PJ' ||
    //     this.tipoSolicitante === 'PNR'
    //     ? this.ubigeoPerJurComponent?.getDepartamentoText() ?? ''
    //     : this.ubigeoPerNatComponent?.getDepartamentoText() ?? '';
    dataGuardar.metaData.seccion3.distrito =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_DistritoFC.value ?? ''
        : this.tipoSolicitante === 'PN' ? this.f_s2_pn_DistritoFC.value :  this.ubigeoPerNatComponent?.getDistritoText() ?? '';
    dataGuardar.metaData.seccion3.provincia =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_ProvinciaFC.value ?? ''
        : this.tipoSolicitante === 'PN' ? this.f_s2_pn_ProvinciaFC.value : this.ubigeoPerNatComponent?.getProvinciaText() ?? '';
    dataGuardar.metaData.seccion3.departamento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_DepartamentoFC.value ?? ''
        : this.tipoSolicitante === 'PN' ? this.f_s2_pn_DepartamentoFC.value : this.ubigeoPerNatComponent?.getDepartamentoText() ?? '';
    dataGuardar.metaData.seccion3.representanteLegal.nombres =
      this.f_s2_pj_rl_NombreFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno =
      this.f_s2_pj_rl_ApePaternoFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno =
      this.f_s2_pj_rl_ApeMaternoFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id =
      this.f_s2_pj_rl_TipoDocumentoFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.listaTiposDocumentos.filter(
          (item) => item.id === this.f_s2_pj_rl_TipoDocumentoFC.value
        )[0].documento
        : '';
    dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento =
      this.f_s2_pj_rl_NumeroDocumentoFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal =
      this.f_s2_pj_rl_DomicilioFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id =
      oficinaRepresentante;
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.oficinasRegistral.filter(
          (item) => item.value === oficinaRepresentante
        )[0].text
        : '';
    dataGuardar.metaData.seccion3.representanteLegal.partida =
      this.f_s2_pj_rl_PartidaFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.asiento =
      this.f_s2_pj_rl_AsientoFC.value;
    dataGuardar.metaData.seccion3.representanteLegal.distrito =
      this.ubigeoRepLegComponent?.getDistritoText() ?? '';
    dataGuardar.metaData.seccion3.representanteLegal.provincia =
      this.ubigeoRepLegComponent?.getProvinciaText() ?? '';
    dataGuardar.metaData.seccion3.representanteLegal.departamento =
      this.ubigeoRepLegComponent?.getDepartamentoText() ?? '';
    dataGuardar.metaData.seccion3.representanteLegal.cargo =
      this.cargoRepresentanteLegal;
    dataGuardar.metaData.seccion3.telefono =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_rl_TelefonoFC.value
        : this.f_s2_pn_TelefonoFC.value;
    dataGuardar.metaData.seccion3.celular =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_rl_CelularFC.value
        : this.f_s2_pn_CelularFC.value;
    dataGuardar.metaData.seccion3.email =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_rl_CorreoFC.value
        : this.f_s2_pn_CorreoFC.value;
    dataGuardar.metaData.seccion4.declaracion_41 =
      this.f_s3_declaracion_41.value;
    dataGuardar.metaData.seccion4.declaracion_42 =
      this.f_s3_declaracion_42.value;
    dataGuardar.metaData.seccion4.declaracion_43 =
      this.f_s3_declaracion_43.value;
    dataGuardar.metaData.seccion4.declaracion_44 =
      this.f_s3_declaracion_44.value;
    dataGuardar.metaData.seccion4.declaracion_45 =
      this.f_s3_declaracion_45.value;
    dataGuardar.metaData.seccion4.declaracion_46 =
      this.f_s3_declaracion_46.value;
    dataGuardar.metaData.seccion4.declaracion_47 =
      this.f_s3_declaracion_47.value;
    dataGuardar.metaData.seccion4.declaracion_48 =
      this.f_s3_declaracion_48.value;
    dataGuardar.metaData.seccion4.declaracion_49 =
      this.f_s3_declaracion_49.value;
    dataGuardar.metaData.seccion5.nombreTipoDocumentoSolicitante = 
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'? (this.f_s2_pj_rl_TipoDocumentoFC.value == "01" ? "DNI":"CE")
        :this.nombreTipoDocumentoSolicitante;
    dataGuardar.metaData.seccion5.numeroDocumentoSolicitante =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_rl_NumeroDocumentoFC.value
        : this.f_s2_pn_NroDocSolicitanteFC.value;
    dataGuardar.metaData.seccion5.nombresApellidosSolicitante =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s2_pj_rl_NombreFC.value +
        ' ' +
        this.f_s2_pj_rl_ApePaternoFC.value +
        ' ' +
        this.f_s2_pj_rl_ApeMaternoFC.value
        : this.f_s2_pn_NombresFC.value;
    
    // SECCION (Relación de Conductores)
    const relacionConductores: Conductor[] = this.conductores.map(conductor => {
      return {
        tipoDocumentoConductor:conductor.tipoDocumentoConductor,
        numeroDocumentoConductor: conductor.numeroDocumentoConductor,
        nombresApellidos: conductor.nombresApellidos,
        edad: '',
        numeroLicencia: conductor.numeroLicencia,
        categoria: conductor.categoria,
        subcategoria: conductor.subcategoria
      } as Conductor;
    });

    dataGuardar.metaData.seccion7.RelacionConductores = relacionConductores;

    const flotaVehicular : Flota[] = this.listaFlotaVehicular.map(item => {
      return {
        placaRodaje: item.placaRodaje,
        soat: item.soat,
        citv: item.citv,
        caf: item.caf,
        file: item.file,
        pathName: item.pathName,
        vin: item.vin,
        nroVinculado: item.nroVinculado,
        fileVin: item.fileVin,
        pathNameVin: item.pathNameVin
      } as Flota;
    });

    dataGuardar.metaData.seccion7.FlotaVehicular = flotaVehicular;

    const relacionPasajeros: Pasajero[] = this.pasajeros.map(pasajero => {
      return {
        tipoDocumentoPasajero:pasajero.tipoDocumentoPasajero,
        numeroDocumentoPasajero: pasajero.numeroDocumentoPasajero,
        nombresApellidos: pasajero.nombresApellidos,
        nombreTipoDocumentoPasajero: pasajero.nombreTipoDocumentoPasajero
      } as Pasajero;
    });

    dataGuardar.metaData.seccion7.RelacionPasajeros = relacionPasajeros;

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          // GUARDAR:
          try {
            console.log(JSON.stringify(dataGuardar));   
            const data = await this.formularioService.post<any>(dataGuardarFormData).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.id = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
          }
          catch (e) {
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
                  const data = await this.formularioService.put<any>(dataGuardarFormData).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.id = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;
                  this.funcionesMtcService.ocultarCargando();
                  this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

                  for (const requisito of listarequisitos) {
                    if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
                      if (requisito.movId > 0) {
                        console.log('Actualizando Anexos');
                        console.log(requisito.tramiteReqRefId);
                        console.log(requisito.movId);
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
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              });
          } else {
            // actualiza formulario
            this.funcionesMtcService.mostrarCargando();
            try {
              const data = await this.formularioService.put<any>(dataGuardarFormData).toPromise();
              console.log("Guardar");
              console.log(data);
              this.funcionesMtcService.ocultarCargando();
              this.id = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;
              this.funcionesMtcService.ocultarCargando();
              this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
            }
            catch (e) {
              this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
            }
          }
        }
      });
  }

  async descargarPdf(): Promise<void> { // OK
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 002/17.02';
    }
    catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar Pdf');
    }
  }

  /*************SECCION PLACAS***************** */
  async verPdfCafGrilla(item: Flota): Promise<void> {
    if (this.indexEditTabla !== -1) {
      return;
    }

    if (item.pathName) {
      this.funcionesMtcService.mostrarCargando();
      try {
        const file: Blob = await this.visorPdfArchivosService.get(item.pathName).toPromise();
        this.funcionesMtcService.ocultarCargando();

        item.file = (file as File);
        item.pathName = null;

        this.visualizarGrillaPdf(item.file, item.placaRodaje);
      }
      catch (e) {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    } else {
      this.visualizarGrillaPdf(item.file, item.placaRodaje);
    }
  }

  async vistaPreviaCaf(): Promise<void> {
    if (this.filePdfCafPathName) {
      this.funcionesMtcService.mostrarCargando();
      try {
        const file: Blob = await this.visorPdfArchivosService.get(this.filePdfCafPathName).toPromise();
        this.funcionesMtcService.ocultarCargando();

        this.filePdfCafSeleccionado = (file as File);
        this.filePdfCafPathName = null;

        this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.f_s4_PlacaRodajeFC.value);
      }
      catch (e) {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    } else {
      this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.f_s4_PlacaRodajeFC.value);
    }
  }

  onChangeInputCaf(event: any): void {
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
    this.filePdfCafPathName = null;
    event.target.value = '';
  }

  onChangeCaf(event: boolean): void {
    this.visibleButtonCarf = event;

    if (this.visibleButtonCarf === true) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
        .catch(() => {
          this.visibleButtonCarf = false;
          this.f_s4_CafFC.setValue(false);
        });
    } else {
      this.filePdfCafSeleccionado = null;
      this.filePdfCafPathName = null;
    }
  }

  changePlacaRodaje(): void {
    this.f_s4_SoatFC?.reset('');
    this.f_s4_CitvFC?.reset('');
    this.f_s4_NroVinculado?.reset('');
  }

  async verPdfVinGrilla(item: Flota): Promise<void> {
    if (this.indexEditTabla !== -1) {
      return;
    }

    if (item.pathNameVin) {
      this.funcionesMtcService.mostrarCargando();
      try {
        const file: Blob = await this.visorPdfArchivosService.get(item.pathNameVin).toPromise();
        this.funcionesMtcService.ocultarCargando();

        item.fileVin = (file as File);
        item.pathNameVin = null;

        this.visualizarGrillaPdf(item.fileVin, item.placaRodaje);
      }
      catch (e) {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    } else {
      this.visualizarGrillaPdf(item.fileVin, item.placaRodaje);
    }
  }

  async vistaPreviaVin(): Promise<void> {
    if (this.filePdfVinPathName) {
      this.funcionesMtcService.mostrarCargando();
      try {
        const file: Blob = await this.visorPdfArchivosService.get(this.filePdfVinPathName).toPromise();
        this.funcionesMtcService.ocultarCargando();

        this.filePdfVinSeleccionado = (file as File);
        this.filePdfVinPathName = null;

        this.visualizarGrillaPdf(this.filePdfVinSeleccionado, this.f_s4_PlacaRodajeFC.value);
      }
      catch (e) {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    } else {
      this.visualizarGrillaPdf(this.filePdfVinSeleccionado, this.f_s4_PlacaRodajeFC.value);
    }
  }

  onChangeInputVin(event: any): void {
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

    this.filePdfVinSeleccionado = event.target.files[0];
    this.filePdfVinPathName = null;
    event.target.value = '';
  }

  onChangeVin(event: boolean): void {
    this.visibleButtonVin = event;

    if (this.visibleButtonVin === true) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
        .catch(() => {
          this.visibleButtonVin = false;
          this.f_s4_Vin.setValue(false);
        });
    } else {
      this.filePdfVinSeleccionado = null;
      this.filePdfVinPathName = null;
    }
  }

  async buscarPlacaRodaje(): Promise<void> {
    const placaRodaje = this.f_s4_PlacaRodajeFC.value.trim();
    if (placaRodaje.length !== 6) {
      return this.funcionesMtcService.mensajeError('La placa de rodaje debe tener 6 caracteres');
    }

    this.changePlacaRodaje();

    this.funcionesMtcService.mostrarCargando();

    try {
      const respuesta = await this.vehiculoService.getPlacaRodaje(placaRodaje).toPromise();
      console.log(respuesta);
      this.funcionesMtcService.ocultarCargando();
      if(respuesta.anioFabricacion==null && respuesta.anioModelo==null){
        return this.funcionesMtcService.mensajeError('No se encontraron resultados.');
      }
      
      if (respuesta.categoria === '' || respuesta.categoria === '-') {
        this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
        return;
      }

      if (respuesta.categoria.charAt(0) === 'N' || respuesta.categoria.charAt(0) === 'M') {
        if (respuesta.soat.estado === '') {
          this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
          return;
        }
        if (respuesta.soat.estado !== 'VIGENTE' && respuesta.soat.estado !== 'FUTURO') {
          this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
          return;
        }
      }

      this.f_s4_SoatFC.setValue(respuesta.soat.numero || '-');

      let band = false;
      let placaNumero = '';

      if (respuesta.citvs.length > 0) {
        for (const placa of respuesta.citvs) {
          if (this.paTipoServicio.find(i =>
            i.pa === this.codigoProcedimientoTupa &&
            i.tipoServicio === placa.tipoId)) {
            placaNumero = placa.numero;
            band = true;
            console.log('placa numero: ', placaNumero);
          }
        }
        if (respuesta.nuevo) {
          this.f_s4_CitvFC.setValue(placaNumero || '-');
        } else {
          if (!band) {
            return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
          }
          else {
            this.f_s4_CitvFC.setValue(placaNumero || '(FALTANTE)');
          }
        }
      } else {
        if (respuesta.nuevo) {
          this.f_s4_CitvFC.setValue('-');
        } else {
          return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');
        }
      }
    }
    catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Error al consultar al servicio');
    }
  }

  cancelarFlotaVehicular(): void {
    this.indexEditTabla = -1;

    this.f_s4_PlacaRodajeFC.reset('', { emitEvent: false });
    this.f_s4_SoatFC?.reset('');
    this.f_s4_CitvFC?.reset('');
    this.f_s4_CafFC.reset(false);
    this.f_s4_NroVinculado?.reset('');
    this.f_s4_Vin.reset(false);

    this.filePdfCafSeleccionado = null;
    this.filePdfCafPathName = null;
    this.visibleButtonCarf = false;
    this.filePdfVinSeleccionado = null;
    this.filePdfVinPathName = null;
    this.visibleButtonVin = false;
  }

  agregarFlotaVehicular(): void {
    if (this.tipoSolicitante !== 'PNR') {
      if (
        this.f_s4_PlacaRodajeFC.value.trim() === '' ||
        this.f_s4_SoatFC.value.trim() === '' ||
        this.f_s4_CitvFC.value.trim() === ''
      ) {
        this.funcionesMtcService.mensajeError('La placa de rodaje no es válida o no cuenta con SOAT y/o CITV');
        return;
      }
    }
    else {
      if (this.f_s4_PlacaRodajeFC.value.trim() === '') {
        this.funcionesMtcService.mensajeError('Debe ingresar la placa de rodaje');
        return;
      }
    }

    if (this.f_s4_CafFC.value === true && (!this.filePdfCafSeleccionado && !this.filePdfCafPathName)) {
      this.funcionesMtcService.mensajeError('A seleccionado C.A.F, debe cargar un archivo PDF');
      return;
    }

    if (this.f_s4_NroVinculado.value?.trim().length>0 && this.f_s4_Vin.value === true && (!this.filePdfVinSeleccionado && !this.filePdfVinPathName)) {
      this.funcionesMtcService.mensajeError('A seleccionado Vinculado, debe cargar un archivo PDF');
      return;
    }

    const placaRodaje = this.f_s4_PlacaRodajeFC.value.trim().toUpperCase();
    const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

    // Validamos que la placa de rodaje no esté incluida en la grilla
    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla) {
        this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
        return;
      }
    }

    if (this.indexEditTabla === -1) {
      this.listaFlotaVehicular.push({
        placaRodaje,
        soat: this.f_s4_SoatFC?.value ?? '',
        citv: this.f_s4_CitvFC?.value ?? '',
        caf: this.f_s4_CafFC.value,
        file: this.filePdfCafSeleccionado,
        vin: this.f_s4_Vin.value,
        nroVinculado:this.f_s4_NroVinculado.value,
        fileVin: this.filePdfVinSeleccionado
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.f_s4_SoatFC?.value ?? '',
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.f_s4_CitvFC?.value ?? '',
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.f_s4_CafFC.value;
      this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
    }

    this.cancelarFlotaVehicular();
  }

  modificarFlotaVehicular(item: Flota, index): void {
    if (this.indexEditTabla !== -1) {
      return;
    }

    this.indexEditTabla = index;

    this.f_s4_PlacaRodajeFC.setValue(item.placaRodaje);
    this.f_s4_SoatFC.setValue(item.soat);
    this.f_s4_CitvFC.setValue(item.citv);

    this.f_s4_CafFC.setValue(item.caf);
    this.visibleButtonCarf = item.caf;

    this.filePdfCafSeleccionado = item.file;
    this.filePdfCafPathName = item.pathName;
  }

  eliminarFlotaVehicular(item: Flota, index): void {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
  }

  visualizarGrillaPdf(file: File, placaRodaje: string): void {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + placaRodaje;
  }
  /***********Seccion de conductores*************/

  getMaxLengthNumeroDocumento() {
    let tipoDocumento: string=""; 
    tipoDocumento = this.f_s5_TipoDocumentoConductor.value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    return 0
  }

  onChangeNumeroDocumentoConductor(opcion : string = 'RepresentanteLegal') {
    if(opcion=="RepresentanteLegal"){
      const tipoDocumento: string = this.f_s2_pj_rl_TipoDocumentoFC.value.trim();
      const apellMatR =   this.f_s2_pj_rl_ApeMaternoFC.value.trim();

      if(tipoDocumento ==='04'){
        this.disabled = false;
        apellMatR.setValidators(null);
        apellMatR.updateValueAndValidity();
      }else{
        apellMatR.setValidators([Validators.required]);
        apellMatR.updateValueAndValidity();
        this.disabled = true;
      }

      this.f_s5_NumeroDocumentoConductor.setValue('');
      this.inputNumeroDocumento();
    }else{
      if(opcion=="Conductor"){
        const tipoDocumentoConductor: string = this.f_s5_TipoDocumentoConductor.value.trim();
        this.f_s5_NombresApellidos.setValue('');
        this.f_s5_NumeroLicencia.setValue('');
        this.f_s5_ClaseCategoria.setValue('');
      }
    }
  }

  private confirmarConductor(datos: string, licencia: string, claseCategoria:string): void {
    this.funcionesMtcService
      .mensajeConfirmar(`Los datos fueron validados por el SNC y corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.f_s5_NombresApellidos.setValue(datos);
        this.f_s5_NumeroLicencia.setValue(licencia);
        this.f_s5_ClaseCategoria.setValue(claseCategoria);
      });
  }

  async buscarNumeroLicencia(dato: DatosPersona): Promise<void> {

    const tipoDocumento = 2;
    const numeroDocumento: string = this.f_s5_NumeroDocumentoConductor.value.trim();

    if (tipoDocumento === 2 && numeroDocumento.length !== 8) {
      this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      return;
    }

    this.funcionesMtcService.mostrarCargando();
    try {
      const respuesta = await this.mtcService.getLicenciasConducir(tipoDocumento, numeroDocumento).toPromise();
      this.funcionesMtcService.ocultarCargando();
      const datos: any = respuesta[0];
      console.log('DATOS getLicenciasConducir:', JSON.stringify(datos, null, 10));

      if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ01') {
        return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
      }

      if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ02' || datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ03') {
        return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
      }

      if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Vencida') {
        return this.funcionesMtcService.mensajeError('Su licencia esta  Vencida');
      }

      if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Bloqueado') {
        return this.funcionesMtcService.mensajeError('Su licencia esta  Bloqueado');
      }

      // VALIDAMOS LA CATEGORIA DE LAS LICENCIAS DE CONDUCIR
      if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
        let categoriaValida = true;
        const categoriaConductor = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim() ?? '';
        console.log('categoriaConductor:', categoriaConductor);
        if (categoriaConductor !== 'A IIIa' && categoriaConductor !== 'A IIIb' && categoriaConductor !== 'A IIIc') {
          categoriaValida = false;
        }
        /*  
        if (!categoriaValida) {
          this.funcionesMtcService.mensajeError('La licencia de conducir de clase/categoría '+ categoriaConductor + ' no corresponde al servicio solicitado.');
          return;
        }*/
      }
      const ApellidoPaterno = datos.GetDatosLicenciaMTCResult.Licencia.ApellidoPaterno.trim();
      const ApellidoMaterno = datos.GetDatosLicenciaMTCResult.Licencia.ApellidoMaterno.trim();
      const Nombres = datos.GetDatosLicenciaMTCResult.Licencia.Nombre.trim();
      const Licencia = datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim();
      const ClaseCategoria = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim();

      this.confirmarConductor(`${ApellidoPaterno} ${ApellidoMaterno} ${Nombres}`, Licencia, ClaseCategoria);
    } catch (error) {
      console.error(error);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Error al consultar el Servicio MTC Licencias Conducir');
    }
  }

  async addConductor(): Promise<void> {
    if (
      this.f_s5_NumeroDocumentoConductor.value.trim() === '' ||
      this.f_s5_NombresApellidos.value.trim() === '' ||
      this.f_s5_NumeroLicencia.value.trim() === ''
    ) {
      this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
      return;
    }
    const numeroDocumentoConductor = this.f_s5_NumeroDocumentoConductor.value;
    const indexFound = this.conductores.findIndex(item => item.numeroDocumentoConductor === numeroDocumentoConductor);

    if (indexFound !== -1) {
      if (indexFound !== this.recordIndexToEditConductores) {
        this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
        return;
      }
    }
    const tipoDocumentoConductor = this.f_s5_TipoDocumentoConductor.value;
    const nombresApellidos = this.f_s5_NombresApellidos.value;
    const edad = '';
    const numeroLicencia = this.f_s5_NumeroLicencia.value;
    const categoria = this.f_s5_ClaseCategoria.value;
    const subcategoria = '';

    if (this.recordIndexToEditConductores === -1) {
      console.log("nuevo");
      this.conductores.push({
        nombresApellidos,
        tipoDocumentoConductor,
        numeroDocumentoConductor,
        edad,
        numeroLicencia,
        categoria,
        subcategoria
      });
    } else {
      this.conductores[this.recordIndexToEditConductores].nombresApellidos = nombresApellidos;
      this.conductores[this.recordIndexToEditConductores].tipoDocumentoConductor = tipoDocumentoConductor;
      this.conductores[this.recordIndexToEditConductores].numeroDocumentoConductor = numeroDocumentoConductor;
      this.conductores[this.recordIndexToEditConductores].edad = edad;
      this.conductores[this.recordIndexToEditConductores].numeroLicencia = numeroLicencia;
      this.conductores[this.recordIndexToEditConductores].categoria = categoria;
      this.conductores[this.recordIndexToEditConductores].subcategoria = subcategoria;
    }
    
    this.clearConductorData();
    this.findInvalidControls();
  }

  private clearConductorData(): void {
    this.recordIndexToEditConductores = -1;

    this.f_s5_NombresApellidos.setValue('');
    this.f_s5_NumeroDocumentoConductor.setValue('');
    this.f_s5_NumeroLicencia.setValue('');
    this.f_s5_ClaseCategoria.setValue('');
  }

  editConductor(conductor: any, i: number): void {
    if (this.recordIndexToEditConductores !== -1) {
      return;
    }
    this.recordIndexToEditConductores = i;
    this.f_s5_NombresApellidos.setValue(conductor.nombresApellidos);
    this.f_s5_TipoDocumentoConductor.setValue(conductor.tipoDocumentoConductor);
    this.f_s5_NumeroDocumentoConductor.setValue(conductor.numeroDocumentoConductor);
    this.f_s5_NumeroLicencia.setValue(conductor.numeroLicencia);
    this.f_s5_ClaseCategoria.setValue(conductor.categoria);
  }

  deleteConductor(conductor: any, i: number): void {
    if (this.recordIndexToEditConductores === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.conductores.splice(i, 1);
        });
    }
  }

  /***********Seccion de pasajeros*************/

  getMaxLengthNumeroDocumentoPasajero() {
    let tipoDocumento: string=""; 
    let maxLength=0;
    tipoDocumento = this.f_s6_TipoDocumentoPasajero.value.trim();
    switch(tipoDocumento){
      case "01":maxLength=8;break;
      case "04":maxLength=12;break;

    }
    return maxLength;
  }
  
  onChangeTipoDocumentoPasajeros (){
    this.f_s6_NombresApellidos.setValue('');
    this.f_s6_NombresApellidos.disable();
  }

  async buscarNumeroDocumentoPasajero(dato: DatosPersona): Promise<void> {
    const tipoDocumento: string = this.f_s6_TipoDocumentoPasajero.value.trim();
    const numeroDocumento: string = this.f_s6_NumeroDocumentoPasajero.value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      return;
    }
    if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
      this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      return;
    }

    switch(tipoDocumento){
      case "01": try{
                  const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
                  this.funcionesMtcService.ocultarCargando();

                  if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                    return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                  } 
                  const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                  this.funcionesMtcService
                  .mensajeConfirmar(`Los datos fueron validados por RENIEC y corresponden a la persona ${datosPersona.prenombres} ${datosPersona.apPrimer} ${datosPersona.apSegundo}. ¿Está seguro de agregarlo?`)
                  .then(async () => {
                    this.f_s6_NombresApellidos.setValue(datosPersona.prenombres + ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo)
                  });
                }
                catch(e){
                  console.error(e);
                  this.funcionesMtcService.ocultarCargando().mensajeError('El servicio de la RENIEC no se encuentra disponible, deberá ingresar los datos completos.');
                  this.f_s6_NombresApellidos.enable();
                }
                break;
      case "04":try {
                  const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

                  this.funcionesMtcService.ocultarCargando();

                  if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
                    return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
                  }
                  this.funcionesMtcService
                  .mensajeConfirmar(`Los datos fueron validados por MIGRACIONES y corresponden a la persona ${respuesta.CarnetExtranjeria.nombres} ${respuesta.CarnetExtranjeria.primerApellido} ${respuesta.CarnetExtranjeria.segundoApellido}. ¿Está seguro de agregarlo?`)
                  .then(async () => {
                    this.f_s6_NombresApellidos.setValue(respuesta.CarnetExtranjeria.nombres + ' ' + respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido);
                  });
                  
                }
                catch (e) {
                  console.error(e);
                  this.funcionesMtcService.ocultarCargando().mensajeError('El servicio de la MIGRACIONES no se encuentra disponible, deberá ingresar los datos completos.');
                  this.f_s6_NombresApellidos.enable();
                }
                break;
    }
  }
  
  async addPasajero(): Promise<void> {
    if (
      this.f_s6_NumeroDocumentoPasajero.value.trim() === '' ||
      this.f_s6_NombresApellidos.value.trim() === ''
    ) {
      this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
      return;
    }
    const numeroDocumentoPasajero = this.f_s6_NumeroDocumentoPasajero.value;
    const indexFound = this.pasajeros.findIndex(item => item.numeroDocumentoPasajero === numeroDocumentoPasajero);

    if (indexFound !== -1) {
      if (indexFound !== this.recordIndexToEditPasajeros) {
        this.funcionesMtcService.mensajeError('El pasajero ya se encuentra registrado');
        return;
      }
    }
    const tipoDocumentoPasajero = this.f_s6_TipoDocumentoPasajero.value;
    const nombresApellidos = this.f_s6_NombresApellidos.value;
    const nombreTipoDocumentoPasajero = this.listaTiposDocumentos.filter(
        (item) => item.id === this.f_s6_TipoDocumentoPasajero.value.trim()
      )[0].documento;
      

    if (this.recordIndexToEditPasajeros === -1) {
      this.pasajeros.push({
        nombresApellidos,
        tipoDocumentoPasajero,
        nombreTipoDocumentoPasajero,
        numeroDocumentoPasajero
      });
    } else {
      this.pasajeros[this.recordIndexToEditPasajeros].nombresApellidos = nombresApellidos;
      this.pasajeros[this.recordIndexToEditPasajeros].tipoDocumentoPasajero = tipoDocumentoPasajero;
      this.pasajeros[this.recordIndexToEditPasajeros].numeroDocumentoPasajero = numeroDocumentoPasajero;
      this.pasajeros[this.recordIndexToEditPasajeros].nombreTipoDocumentoPasajero = nombreTipoDocumentoPasajero;
    }
    
    this.clearPasajeroData();
    this.findInvalidControls();
  }

  private clearPasajeroData(): void {
    this.recordIndexToEditPasajeros = -1;

    this.f_s6_NombresApellidos.setValue('');
    this.f_s6_NumeroDocumentoPasajero.setValue('');
  }

  deletePasajero(pasajero: any, i: number): void {
    if (this.recordIndexToEditPasajeros === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.pasajeros.splice(i, 1);
        });
    }
  }

  formInvalid(control: AbstractControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.formularioFG.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid); 
  }
}
