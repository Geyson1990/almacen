/**
 * Formulario 005/12
 * @author André Bernabé Pérez
 * @version 1.0 18.02.2022
 */

import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Formulario005_12Request } from 'src/app/core/models/Formularios/Formulario005_12/Formulario005_12Request';
import { Formulario005_12Response } from 'src/app/core/models/Formularios/Formulario005_12/Formulario005_12Response';
import { MetaData } from 'src/app/core/models/Formularios/Formulario005_12/MetaData';
import { Aeronave } from 'src/app/core/models/Formularios/Formulario005_12/Secciones';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Formulario00512Service } from 'src/app/core/services/formularios/formulario005-12.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { AeronaveService } from 'src/app/core/services/servicios/aeronave.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpDatOma') ubigeoDatOmaComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

  formularioFG: UntypedFormGroup;
  aeronaveFG: UntypedFormGroup;

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
  txtTitulo = 'FORMULARIO 005-12 SEGURIDAD DE VUELO - INSPECCIÓN TÉCNICA INTERNACIONAL';
  oficinasRegistral: Array<any>;

  nroDocumentoLogin: string;
  nroRuc = '';
  razonSocial: string;
  cargoRepresentanteLegal = '';

  disableBtnBuscarRepLegal = false;

  maxLengthNumeroDocumentoRepLeg: number;

  tipoSolicitante: string;
  codTipoDocSolicitante: string; // 01 DNI  03 CI  04 CE

  indexEditAeronave = -1;

  // SECCION AERONAVES
  paSeccion12: string[] = ['S-DGAC-003'];
  // SECCION DATOS OMA / OMAE
  paSeccion13: string[] = ['S-DGAC-007'];

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
    private formularioService: Formulario00512Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private renatService: RenatService,
    private aeronaveService: AeronaveService) {
  }

  ngOnInit(): void {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    console.log('dataInput: ', this.dataInput);

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    this.formularioFG = this.formBuilder.group({
      f_Seccion1FG: this.formBuilder.group({
        f_s1_EspecificacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]],
        f_s1_AeronaveFA: this.formBuilder.array([], [Validators.required]),
        f_s1_DatosOmaFG: this.formBuilder.group({
          f_s1_do_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s1_do_DepartamentoFC: ['', [Validators.required]],
          f_s1_do_ProvinciaFC: ['', [Validators.required]],
          f_s1_do_DistritoFC: ['', [Validators.required]],
        }),
      }),
      f_Seccion2FG: this.formBuilder.group({
        f_s2_notificaCorreoFC: [false, [Validators.requiredTrue]],
      }),
      f_Seccion3FG: this.formBuilder.group({
        f_s3_PerNatFG: this.formBuilder.group({
          f_s3_pn_NombresFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
          f_s3_pn_TipoDocSolicitanteFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          f_s3_pn_NroDocSolicitanteFC: ['', [Validators.required, exactLengthValidator([8, 9])]],
          f_s3_pn_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
          f_s3_pn_TelefonoFC: ['', [Validators.maxLength(11)]],
          f_s3_pn_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
          f_s3_pn_CorreoFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
          f_s3_pn_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s3_pn_DepartamentoFC: ['', [Validators.required]],
          f_s3_pn_ProvinciaFC: ['', [Validators.required]],
          f_s3_pn_DistritoFC: ['', [Validators.required]],
        }),
        f_s3_PerJurFG: this.formBuilder.group({
          f_s3_pj_RazonSocialFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s3_pj_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
          f_s3_pj_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          f_s3_pj_DepartamentoFC: ['', [Validators.required]],
          f_s3_pj_ProvinciaFC: ['', [Validators.required]],
          f_s3_pj_DistritoFC: ['', [Validators.required]],
          f_s3_pj_RepLegalFG: this.formBuilder.group({
            f_s3_pj_rl_TipoDocumentoFC: ['', [Validators.required]],
            f_s3_pj_rl_NumeroDocumentoFC: ['', [Validators.required]], // at runtime maxlength
            f_s3_pj_rl_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
            f_s3_pj_rl_ApePaternoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
            f_s3_pj_rl_ApeMaternoFC: ['', [noWhitespaceValidator(), Validators.maxLength(50)]],
            f_s3_pj_rl_TelefonoFC: ['', [Validators.maxLength(11)]],
            f_s3_pj_rl_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
            f_s3_pj_rl_CorreoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.email, Validators.maxLength(50)]],
            f_s3_pj_rl_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
            f_s3_pj_rl_DepartamentoFC: ['', [Validators.required]],
            f_s3_pj_rl_ProvinciaFC: ['', [Validators.required]],
            f_s3_pj_rl_DistritoFC: ['', [Validators.required]],
            f_s3_pj_rl_OficinaFC: ['', [Validators.required]],
            f_s3_pj_rl_PartidaFC: ['', [Validators.required, Validators.maxLength(15)]],
            f_s3_pj_rl_AsientoFC: ['', [Validators.required, Validators.maxLength(15)]],
          }),
        }),
      }),
      // Seccion 4 pertenece a derecho de tramite
      f_Seccion5FG: this.formBuilder.group({
        f_s5_declaracion1FC: [false, [Validators.requiredTrue]],
        f_s5_declaracion2FC: [false, [Validators.requiredTrue]],
      }),
      // Seccion 6 pertenece a la firma del solicitante
      f_Seccion7FG: this.formBuilder.group({
        f_s7_ItinerarioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(2000)]],
      }),
    });

    this.aeronaveFG = this.formBuilder.group({
      a_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      a_NroSerieFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      a_MatriculaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });
  }

  async ngAfterViewInit(): Promise<void> {

    // SECCION AERONAVES
    if (this.paSeccion12.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s1_AeronaveFA.enable();
    } else {
      this.f_s1_AeronaveFA.disable();
    }

    // SECCION DATOS OMA / OMAE
    if (this.paSeccion13.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.f_s1_DatosOmaFG.enable();
    } else {
      this.f_s1_DatosOmaFG.disable();
    }

    await this.cargarOficinaRegistral();

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();          // nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();         // tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();      // nro de documento usuario login

    console.log('tipoDocumento: ', tipoDocumento);

    switch (tipoDocumento) {
      case '00001':
      case '00004':
        this.f_s3_PerNatFG.enable({ emitEvent: false });
        this.f_s3_PerJurFG.disable({ emitEvent: false });
        break;
      case '00005':
      case '00002':
        this.f_s3_PerNatFG.disable({ emitEvent: false });
        this.f_s3_PerJurFG.enable({ emitEvent: false });
        break;
    }

    this.onChangeTipoDocumento();

    await this.cargarDatos();
  }

  async verificarPermisoInternacional(): Promise<void> {
    try {
      const resp: any = await this.renatService.EmpresaServicio(this.nroRuc).toPromise();
      if (!resp) {
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('No hay permisos vigentes registradas para esta empresa');
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
  get f_Seccion1FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion1FG') as UntypedFormGroup; }
  get f_s1_EspecificacionFC(): UntypedFormControl { return this.f_Seccion1FG.get('f_s1_EspecificacionFC') as UntypedFormControl; }
  get f_s1_AeronaveFA(): UntypedFormArray { return this.f_Seccion1FG.get('f_s1_AeronaveFA') as UntypedFormArray; }
  get f_s1_DatosOmaFG(): UntypedFormGroup { return this.f_Seccion1FG.get('f_s1_DatosOmaFG') as UntypedFormGroup; }
  get f_s1_do_DomicilioFC(): UntypedFormControl { return this.f_s1_DatosOmaFG.get('f_s1_do_DomicilioFC') as UntypedFormControl; }
  get f_s1_do_DepartamentoFC(): UntypedFormControl { return this.f_s1_DatosOmaFG.get('f_s1_do_DepartamentoFC') as UntypedFormControl; }
  get f_s1_do_ProvinciaFC(): UntypedFormControl { return this.f_s1_DatosOmaFG.get('f_s1_do_ProvinciaFC') as UntypedFormControl; }
  get f_s1_do_DistritoFC(): UntypedFormControl { return this.f_s1_DatosOmaFG.get('f_s1_do_DistritoFC') as UntypedFormControl; }
  get f_Seccion2FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion2FG') as UntypedFormGroup; }
  get f_s2_notificaCorreoFC(): UntypedFormControl { return this.f_Seccion2FG.get(['f_s2_notificaCorreoFC']) as UntypedFormControl; }
  get f_Seccion3FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup; }
  get f_s3_PerNatFG(): UntypedFormGroup { return this.f_Seccion3FG.get('f_s3_PerNatFG') as UntypedFormGroup; }
  get f_s3_pn_NombresFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_NombresFC']) as UntypedFormControl; }
  get f_s3_pn_TipoDocSolicitanteFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_TipoDocSolicitanteFC']) as UntypedFormControl; }
  get f_s3_pn_NroDocSolicitanteFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_NroDocSolicitanteFC']) as UntypedFormControl; }
  get f_s3_pn_RucFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_RucFC']) as UntypedFormControl; }
  get f_s3_pn_TelefonoFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_TelefonoFC']) as UntypedFormControl; }
  get f_s3_pn_CelularFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_CelularFC']) as UntypedFormControl; }
  get f_s3_pn_CorreoFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_CorreoFC']) as UntypedFormControl; }
  get f_s3_pn_DomicilioFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_DomicilioFC']) as UntypedFormControl; }
  get f_s3_pn_DepartamentoFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_DepartamentoFC']) as UntypedFormControl; }
  get f_s3_pn_ProvinciaFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_ProvinciaFC']) as UntypedFormControl; }
  get f_s3_pn_DistritoFC(): UntypedFormControl { return this.f_s3_PerNatFG.get(['f_s3_pn_DistritoFC']) as UntypedFormControl; }
  get f_s3_PerJurFG(): UntypedFormGroup { return this.f_Seccion3FG.get('f_s3_PerJurFG') as UntypedFormGroup; }
  get f_s3_pj_RazonSocialFC(): UntypedFormControl { return this.f_s3_PerJurFG.get(['f_s3_pj_RazonSocialFC']) as UntypedFormControl; }
  get f_s3_pj_RucFC(): UntypedFormControl { return this.f_s3_PerJurFG.get(['f_s3_pj_RucFC']) as UntypedFormControl; }
  get f_s3_pj_DomicilioFC(): UntypedFormControl { return this.f_s3_PerJurFG.get(['f_s3_pj_DomicilioFC']) as UntypedFormControl; }
  get f_s3_pj_DepartamentoFC(): UntypedFormControl { return this.f_s3_PerJurFG.get(['f_s3_pj_DepartamentoFC']) as UntypedFormControl; }
  get f_s3_pj_ProvinciaFC(): UntypedFormControl { return this.f_s3_PerJurFG.get(['f_s3_pj_ProvinciaFC']) as UntypedFormControl; }
  get f_s3_pj_DistritoFC(): UntypedFormControl { return this.f_s3_PerJurFG.get(['f_s3_pj_DistritoFC']) as UntypedFormControl; }
  get f_s3_pj_RepLegalFG(): UntypedFormGroup { return this.f_s3_PerJurFG.get('f_s3_pj_RepLegalFG') as UntypedFormGroup; }
  get f_s3_pj_rl_TipoDocumentoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_TipoDocumentoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_NumeroDocumentoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_NumeroDocumentoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_NombreFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_NombreFC']) as UntypedFormControl; }
  get f_s3_pj_rl_ApePaternoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ApePaternoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_ApeMaternoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ApeMaternoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_TelefonoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_TelefonoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_CelularFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_CelularFC']) as UntypedFormControl; }
  get f_s3_pj_rl_CorreoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_CorreoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_DomicilioFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_DomicilioFC']) as UntypedFormControl; }
  get f_s3_pj_rl_DepartamentoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_DepartamentoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_ProvinciaFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ProvinciaFC']) as UntypedFormControl; }
  get f_s3_pj_rl_DistritoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_DistritoFC']) as UntypedFormControl; }
  get f_s3_pj_rl_OficinaFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_OficinaFC']) as UntypedFormControl; }
  get f_s3_pj_rl_PartidaFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_PartidaFC']) as UntypedFormControl; }
  get f_s3_pj_rl_AsientoFC(): UntypedFormControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_AsientoFC']) as UntypedFormControl; }
  get f_Seccion5FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion5FG') as UntypedFormGroup; }
  get f_s5_declaracion1FC(): UntypedFormControl { return this.f_Seccion5FG.get(['f_s5_declaracion1FC']) as UntypedFormControl; }
  get f_s5_declaracion2FC(): UntypedFormControl { return this.f_Seccion5FG.get(['f_s5_declaracion2FC']) as UntypedFormControl; }
  get f_Seccion7FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion7FG') as UntypedFormGroup; }
  get f_s7_ItinerarioFC(): UntypedFormControl { return this.f_Seccion7FG.get(['f_s7_ItinerarioFC']) as UntypedFormControl; }

  get a_ModeloFC(): UntypedFormControl { return this.aeronaveFG.get('a_ModeloFC') as UntypedFormControl; }
  get a_NroSerieFC(): UntypedFormControl { return this.aeronaveFG.get('a_NroSerieFC') as UntypedFormControl; }
  get a_MatriculaFC(): UntypedFormControl { return this.aeronaveFG.get('a_MatriculaFC') as UntypedFormControl; }

  f_s1_an_MatriculaFC(index: number): UntypedFormControl { return this.f_s1_AeronaveFA.get([index, 'a_MatriculaFC']) as UntypedFormControl; }
  f_s1_an_ModeloFC(index: number): UntypedFormControl { return this.f_s1_AeronaveFA.get([index, 'a_ModeloFC']) as UntypedFormControl; }
  f_s1_an_NroSerieFC(index: number): UntypedFormControl { return this.f_s1_AeronaveFA.get([index, 'a_NroSerieFC']) as UntypedFormControl; }

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
    this.f_s3_pj_rl_TipoDocumentoFC.valueChanges.subscribe((tipoDocumento: string) => {
      if (tipoDocumento?.trim() === '04') {
        this.f_s3_pj_rl_ApeMaternoFC.clearValidators();
        this.f_s3_pj_rl_ApeMaternoFC.updateValueAndValidity();

        this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([9])]);
        this.f_s3_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.f_s3_pj_rl_ApeMaternoFC.setValidators([Validators.required]);
        this.f_s3_pj_rl_ApeMaternoFC.updateValueAndValidity();

        this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([8])]);
        this.f_s3_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }

      this.f_s3_pj_rl_NumeroDocumentoFC.reset('', { emitEvent: false });
      this.inputNumeroDocumento();
    });
  }

  inputNumeroDocumento(event?): void {
    if (event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    this.f_s3_pj_rl_NombreFC.reset('', { emitEvent: false });
    this.f_s3_pj_rl_ApePaternoFC.reset('', { emitEvent: false });
    this.f_s3_pj_rl_ApeMaternoFC.reset('', { emitEvent: false });
  }

  async buscarNumeroDocumentoRepLeg(): Promise<void> {
    const tipoDocumento: string = this.f_s3_pj_rl_TipoDocumentoFC.value.trim();
    const numeroDocumento: string = this.f_s3_pj_rl_NumeroDocumentoFC.value.trim();

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
          this.setPersonaRepLegal(tipoDocumento,
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

          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.f_s3_pj_rl_NombreFC.enable();
          this.f_s3_pj_rl_ApePaternoFC.enable();
          this.f_s3_pj_rl_ApeMaternoFC.enable();
        }
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
        try {
          const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }

          this.setPersonaRepLegal(tipoDocumento,
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

          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.f_s3_pj_rl_NombreFC.enable();
          this.f_s3_pj_rl_ApePaternoFC.enable();
          this.f_s3_pj_rl_ApeMaternoFC.enable();
        }
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }

  // region: Aeronave
  async buscarMatricula(): Promise<void> {
    const matricula: string = this.a_MatriculaFC.value.trim();
    this.funcionesMtcService.mostrarCargando();
    try {
      const datos = await this.aeronaveService.getAeronave(matricula).toPromise();
      this.funcionesMtcService.ocultarCargando();
      console.log(datos);

      if (datos[0].mensaje === 'E0003') {
        this.funcionesMtcService.mensajeError('Problemas para conectar con el Servicio de Datos de Aeronave');
        return;
      }
      this.a_ModeloFC.setValue(datos[0].modelo.trim());
      this.a_NroSerieFC.setValue(datos[0].numeroSerie.trim());
    } catch (error) {
      console.log(error);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Error al consultar el Servicio de Datos de Aeronave');
    }
  }

  saveAeronave(): void {
    const aeronave: Aeronave = {
      matricula: this.a_MatriculaFC.value,
      modelo: this.a_ModeloFC.value,
      nroSerie: this.a_NroSerieFC.value
    };

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditAeronave === -1 ? 'guardar' : 'modificar'} la información de la aeronave?`)
      .then(() => {
        const exist = !!this.f_s1_AeronaveFA.controls
          .find((r: UntypedFormGroup, index: number) => r.get('a_MatriculaFC').value === aeronave.matricula && this.indexEditAeronave !== index);
        if (exist) {
          this.funcionesMtcService.mensajeError('La matrícula de la aeronave ya ha sido registrada.');
          return;
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

    const matricula = this.f_s1_an_MatriculaFC(index).value;
    const modelo = this.f_s1_an_ModeloFC(index).value;
    const nroSerie = this.f_s1_an_NroSerieFC(index).value;

    this.a_MatriculaFC.setValue(matricula);
    this.a_ModeloFC.setValue(modelo);
    this.a_NroSerieFC.setValue(nroSerie);
  }

  private addEditAeronaveFG({ matricula, modelo, nroSerie }: Aeronave, index: number = -1): void {
    const newAeronaveFG = this.formBuilder.group({
      a_MatriculaFC: [matricula, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      a_ModeloFC: [modelo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      a_NroSerieFC: [nroSerie, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });

    if (index === -1) {
      this.f_s1_AeronaveFA.push(newAeronaveFG);
    }
    else {
      this.f_s1_AeronaveFA.setControl(index, newAeronaveFG);
    }
  }

  removeAeronave(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información de la aeronave seleccionada?')
      .then(
        () => {
          this.f_s1_AeronaveFA.removeAt(index);
        });
  }
  // endregion: Aeronave

  async setPersonaRepLegal(
    tipoDocumento: string,
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string): Promise<void> {

    if (this.tipoSolicitante === 'PNR') {
      this.f_s3_pj_rl_NombreFC.setValue(nombres);
      this.f_s3_pj_rl_ApePaternoFC.setValue(apPaterno);
      this.f_s3_pj_rl_ApeMaternoFC.setValue(apMaterno);
      this.f_s3_pj_rl_DomicilioFC.setValue(direccion);

      this.f_s3_pj_rl_NombreFC.disable({ emitEvent: false });
      this.f_s3_pj_rl_ApePaternoFC.disable({ emitEvent: false });
      this.f_s3_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

      await this.ubigeoRepLegComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito);
    }
    else {
      this.funcionesMtcService
        .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
        .then(async () => {
          this.f_s3_pj_rl_NombreFC.setValue(nombres);
          this.f_s3_pj_rl_ApePaternoFC.setValue(apPaterno);
          this.f_s3_pj_rl_ApeMaternoFC.setValue(apMaterno);
          this.f_s3_pj_rl_DomicilioFC.setValue(direccion);

          this.f_s3_pj_rl_NombreFC.disable({ emitEvent: false });
          this.f_s3_pj_rl_ApePaternoFC.disable({ emitEvent: false });
          this.f_s3_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

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
        this.f_s3_pn_TipoDocSolicitanteFC.setValue('DNI');
        this.codTipoDocSolicitante = '01';
        break;

      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        this.f_s3_pn_TipoDocSolicitanteFC.setValue('DNI');
        break;

      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.f_s3_pn_TipoDocSolicitanteFC.setValue('CARNET DE EXTRANJERIA');
        this.codTipoDocSolicitante = '04';
        break;

      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.f_s3_pn_TipoDocSolicitanteFC.setValue('DNI');
        this.codTipoDocSolicitante = '01';
        break;
    }

    if (this.dataInput != null && this.dataInput.movId > 0) {
      // TRAEMOS LOS DATOS GUARDADOS
      try {
        const dataFormulario = await this.formularioTramiteService.get<Formulario005_12Response>(this.dataInput.tramiteReqId).toPromise();

        const { seccion1, seccion2, seccion3, seccion5, seccion7 } = JSON.parse(dataFormulario.metaData) as MetaData;
        console.log(JSON.parse(dataFormulario.metaData));
        this.id = dataFormulario.formularioId;

        if (this.f_Seccion1FG.enabled) {

          this.f_s1_EspecificacionFC.setValue(seccion1.especificacion);

          const { datosOma, listaAeronave } = seccion1;
          if (this.f_s1_AeronaveFA.enabled) {
            for (const aeronave of listaAeronave) {
              this.addEditAeronaveFG(aeronave);
            }
          }

          if (this.f_s1_DatosOmaFG.enabled) {
            this.f_s1_do_DomicilioFC.setValue(datosOma.domicilioLegal);
            await this.ubigeoDatOmaComponent.setUbigeoByText(
              datosOma.departamento,
              datosOma.provincia,
              datosOma.distrito
            );
          }
        }

        if (this.f_Seccion2FG.enabled) {
          this.f_s2_notificaCorreoFC.setValue(seccion2.notificaCorreo);
        }

        if (this.f_Seccion3FG.enabled) {
          if (this.f_s3_PerNatFG.enabled) {
            this.f_s3_pn_NombresFC.setValue(seccion3.nombresApellidos);
            this.f_s3_pn_NroDocSolicitanteFC.setValue(seccion3.numeroDocumento);
          }

          if (this.f_s3_PerJurFG.enabled) {
            this.f_s3_pj_RucFC.setValue(seccion3.numeroDocumento);
            this.f_s3_pj_RazonSocialFC.setValue(seccion3.razonSocial);
            this.f_s3_pj_DomicilioFC.setValue(seccion3.domicilioLegal);

            // await this.ubigeoPerJurComponent?.setUbigeoByText(
            //   seccion3.departamento.trim(),
            //   seccion3.provincia.trim(),
            //   seccion3.distrito.trim());

            this.f_s3_pj_DepartamentoFC.setValue(seccion3.departamento.trim());
            this.f_s3_pj_ProvinciaFC.setValue(seccion3.provincia.trim());
            this.f_s3_pj_DistritoFC.setValue(seccion3.distrito.trim());

            this.f_s3_pj_rl_TelefonoFC.setValue(seccion3.telefono);
            this.f_s3_pj_rl_CelularFC.setValue(seccion3.celular);
            this.f_s3_pj_rl_CorreoFC.setValue(seccion3.email);

            const { representanteLegal } = seccion3;
            this.f_s3_pj_rl_TipoDocumentoFC.setValue(representanteLegal.tipoDocumento.id);
            this.f_s3_pj_rl_NumeroDocumentoFC.setValue(representanteLegal.numeroDocumento);
            this.f_s3_pj_rl_NombreFC.setValue(representanteLegal.nombres);
            this.f_s3_pj_rl_ApePaternoFC.setValue(representanteLegal.apellidoPaterno);
            this.f_s3_pj_rl_ApeMaternoFC.setValue(representanteLegal.apellidoMaterno);
            this.f_s3_pj_rl_DomicilioFC.setValue(representanteLegal.domicilioLegal);

            await this.ubigeoRepLegComponent?.setUbigeoByText(
              representanteLegal.departamento,
              representanteLegal.provincia,
              representanteLegal.distrito);

            this.f_s3_pj_rl_OficinaFC.setValue(representanteLegal.oficinaRegistral.id);
            this.f_s3_pj_rl_PartidaFC.setValue(representanteLegal.partida);
            this.f_s3_pj_rl_AsientoFC.setValue(representanteLegal.asiento);

            this.f_s3_pj_RazonSocialFC.disable();
            this.f_s3_pj_RucFC.disable();
            this.f_s3_pj_DomicilioFC.disable();
            this.f_s3_pj_DistritoFC.disable({ emitEvent: false });
            this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
            this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });

            if (this.tipoSolicitante === 'PNR') {
              this.f_s3_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
              this.f_s3_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });

              this.f_s3_pj_RucFC.clearValidators();
              this.f_s3_pj_RucFC.updateValueAndValidity();
              this.f_s3_pj_RucFC.disable({ emitEvent: false });

              this.f_s3_pj_DepartamentoFC.clearValidators();
              this.f_s3_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
              this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });
              this.f_s3_pj_ProvinciaFC.clearValidators();
              this.f_s3_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
              this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
              this.f_s3_pj_DistritoFC.clearValidators();
              this.f_s3_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
              this.f_s3_pj_DistritoFC.disable({ emitEvent: false });

              this.f_s3_pj_rl_NombreFC.disable({ emitEvent: false });
              this.f_s3_pj_rl_ApePaternoFC.disable({ emitEvent: false });
              this.f_s3_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

              this.disableBtnBuscarRepLegal = true;
            }
          }
        }

        if (this.f_Seccion5FG.enabled) {
          this.f_s5_declaracion1FC.setValue(seccion5.declaracion1);
          this.f_s5_declaracion2FC.setValue(seccion5.declaracion2);
        }

        if (this.f_Seccion7FG.enabled) {
          this.f_s7_ItinerarioFC.setValue(seccion7.itinerario);
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
          const ubigeo = datosPersona.ubigeo.split('/');

          this.f_s3_pn_NombresFC.setValue(`${datosPersona.prenombres} ${datosPersona.apPrimer} ${datosPersona.apSegundo}`);
          this.f_s3_pn_NroDocSolicitanteFC.setValue(this.nroDocumentoLogin);
          this.f_s3_pn_DomicilioFC.setValue(datosPersona.direccion);

          this.f_s3_pn_NombresFC.disable({ emitEvent: false });
          this.f_s3_pn_TipoDocSolicitanteFC.disable({ emitEvent: false });
          this.f_s3_pn_NroDocSolicitanteFC.disable({ emitEvent: false });
          this.f_s3_pn_DomicilioFC.disable({ emitEvent: false });

          await this.ubigeoPerNatComponent?.setUbigeoByText(
            ubigeo[0],
            ubigeo[1],
            ubigeo[2]);
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
          this.f_s3_pn_NombresFC.enable();
          this.f_s3_pn_TipoDocSolicitanteFC.enable();
          this.f_s3_pn_NroDocSolicitanteFC.enable();
          this.f_s3_pn_DomicilioFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PE') {
        try {
          const respuesta = await this.extranjeriaService.getCE(this.nroDocumentoLogin).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }

          this.f_s3_pn_NombresFC.setValue(`${respuesta.CarnetExtranjeria.nombres} ${respuesta.CarnetExtranjeria.primerApellido} ${respuesta.CarnetExtranjeria.segundoApellido}`);
          this.f_s3_pn_NroDocSolicitanteFC.setValue(this.nroDocumentoLogin);

          this.f_s3_pn_NombresFC.disable({ emitEvent: false });
          this.f_s3_pn_TipoDocSolicitanteFC.disable({ emitEvent: false });
          this.f_s3_pn_NroDocSolicitanteFC.disable({ emitEvent: false });
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.f_s3_pn_NombresFC.enable();
          this.f_s3_pn_TipoDocSolicitanteFC.enable();
          this.f_s3_pn_NroDocSolicitanteFC.enable();
        }
      }
      if (this.tipoSolicitante === 'PNR') {
        this.f_s3_pj_rl_TipoDocumentoFC.setValue('01');
        this.f_s3_pj_rl_NumeroDocumentoFC.setValue(this.nroDocumentoLogin);
        await this.buscarNumeroDocumentoRepLeg();
        this.f_s3_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s3_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });
        this.disableBtnBuscarRepLegal = true;

        this.f_s3_pj_RucFC.clearValidators();
        this.f_s3_pj_RucFC.updateValueAndValidity();
        this.f_s3_pj_RucFC.disable({ emitEvent: false });

        this.f_s3_pj_DepartamentoFC.clearValidators();
        this.f_s3_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
        this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });
        this.f_s3_pj_ProvinciaFC.clearValidators();
        this.f_s3_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
        this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
        this.f_s3_pj_DistritoFC.clearValidators();
        this.f_s3_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
        this.f_s3_pj_DistritoFC.disable({ emitEvent: false });
      }
      if (this.tipoSolicitante === 'PJ') {
        try {
          const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
          this.f_s3_pj_RazonSocialFC.setValue(response.razonSocial.trim());
          this.f_s3_pj_RucFC.setValue(response.nroDocumento.trim());
          this.f_s3_pj_DomicilioFC.setValue(response.domicilioLegal.trim());

          console.log('nombreDepartamento: ', response.nombreDepartamento.trim(),
            'nombreProvincia: ', response.nombreProvincia.trim(),
            'nombreDistrito: ', response.nombreDistrito.trim());

          // await this.ubigeoPerJurComponent?.setUbigeoByText(
          //   response.nombreDepartamento.trim(),
          //   response.nombreProvincia.trim(),
          //   response.nombreDistrito.trim());

          this.f_s3_pj_DepartamentoFC.setValue(response.nombreDepartamento.trim());
          this.f_s3_pj_ProvinciaFC.setValue(response.nombreProvincia.trim());
          this.f_s3_pj_DistritoFC.setValue(response.nombreDistrito.trim());

          this.f_s3_pj_rl_TelefonoFC.setValue(response.telefono.trim());
          this.f_s3_pj_rl_CelularFC.setValue(response.celular.trim());
          this.f_s3_pj_rl_CorreoFC.setValue(response.correo.trim());

          this.f_s3_pj_RazonSocialFC.disable();
          this.f_s3_pj_RucFC.disable();
          this.f_s3_pj_DomicilioFC.disable();
          this.f_s3_pj_DistritoFC.disable({ emitEvent: false });
          this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
          this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });

          this.representanteLegal = response.representanteLegal;

          this.funcionesMtcService.ocultarCargando();
        }
        catch (e) {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');

          this.f_s3_pj_RazonSocialFC.setValue(this.razonSocial);
          this.f_s3_pj_RucFC.setValue(this.nroRuc);

          this.f_s3_pj_DomicilioFC.enable();
          this.f_s3_pj_DistritoFC.enable();
          this.f_s3_pj_ProvinciaFC.enable();
          this.f_s3_pj_DepartamentoFC.enable();
        }
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

    const oficinaRepresentante = this.f_s3_pj_rl_OficinaFC.value;

    const dataGuardar = new Formulario005_12Request();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F005-12';
    dataGuardar.formularioId = 2;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.estado = 1;

    const { seccion1, seccion2, seccion3, seccion5, seccion6, seccion7 } = dataGuardar.metaData;
    const { datosOma, listaAeronave } = seccion1;
    const { representanteLegal } = seccion3;

    seccion1.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
    seccion1.descProcedimientoTupa = this.descProcedimientoTupa;
    seccion1.especificacion = this.f_s1_EspecificacionFC.value;

    datosOma.domicilioLegal = this.f_s1_do_DomicilioFC.value;
    datosOma.distrito = this.ubigeoDatOmaComponent?.getDistritoText() ?? '';
    datosOma.provincia = this.ubigeoDatOmaComponent?.getProvinciaText() ?? '';
    datosOma.departamento = this.ubigeoDatOmaComponent?.getDepartamentoText() ?? '';

    for (const controlFG of this.f_s1_AeronaveFA.controls) {
      const aeronave: Aeronave = {
        matricula: controlFG.get('a_MatriculaFC').value,
        nroSerie: controlFG.get('a_NroSerieFC').value,
        modelo: controlFG.get('a_ModeloFC').value
      };
      listaAeronave.push(aeronave);
    }

    seccion2.notificaCorreo = this.f_s2_notificaCorreoFC.value;

    seccion3.tipoSolicitante = this.tipoSolicitante;
    seccion3.nombresApellidos =
      this.tipoSolicitante === 'PN' ||
        this.tipoSolicitante === 'PE'
        ? this.f_s3_pn_NombresFC.value
        : '';
    seccion3.tipoDocumento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_rl_TipoDocumentoFC.value
        : this.codTipoDocSolicitante; // codDocumento
    seccion3.numeroDocumento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_RucFC.value
        : this.f_s3_pn_NroDocSolicitanteFC.value; // nroDocumento
    seccion3.ruc = this.tipoSolicitante === 'PJ' || this.tipoSolicitante === 'PNR' ? '' : this.f_s3_pn_RucFC.value;
    seccion3.razonSocial = this.tipoSolicitante === 'PJ' || this.tipoSolicitante === 'PNR' ? this.f_s3_pj_RazonSocialFC.value : '';
    seccion3.domicilioLegal = this.tipoSolicitante === 'PJ' || this.tipoSolicitante === 'PNR'
      ? this.f_s3_pj_DomicilioFC.value
      : this.f_s3_pn_DomicilioFC.value;
    // seccion3.distrito =
    //   this.tipoSolicitante === 'PJ' ||
    //     this.tipoSolicitante === 'PNR'
    //     ? this.ubigeoPerJurComponent?.getDistritoText() ?? ''
    //     : this.ubigeoPerNatComponent?.getDistritoText() ?? '';
    // seccion3.provincia =
    //   this.tipoSolicitante === 'PJ' ||
    //     this.tipoSolicitante === 'PNR'
    //     ? this.ubigeoPerJurComponent?.getProvinciaText() ?? ''
    //     : this.ubigeoPerNatComponent?.getProvinciaText() ?? '';
    // seccion3.departamento =
    //   this.tipoSolicitante === 'PJ' ||
    //     this.tipoSolicitante === 'PNR'
    //     ? this.ubigeoPerJurComponent?.getDepartamentoText() ?? ''
    //     : this.ubigeoPerNatComponent?.getDepartamentoText() ?? '';
    seccion3.distrito =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_DistritoFC.value ?? ''
        : this.ubigeoPerNatComponent?.getDistritoText() ?? '';
    seccion3.provincia =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_ProvinciaFC.value ?? ''
        : this.ubigeoPerNatComponent?.getProvinciaText() ?? '';
    seccion3.departamento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_DepartamentoFC.value ?? ''
        : this.ubigeoPerNatComponent?.getDepartamentoText() ?? '';
    representanteLegal.nombres = this.f_s3_pj_rl_NombreFC.value;
    representanteLegal.apellidoPaterno = this.f_s3_pj_rl_ApePaternoFC.value;
    representanteLegal.apellidoMaterno = this.f_s3_pj_rl_ApeMaternoFC.value;
    representanteLegal.tipoDocumento.id = this.f_s3_pj_rl_TipoDocumentoFC.value;
    representanteLegal.tipoDocumento.documento =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.listaTiposDocumentos.filter(
          (item) => item.id === this.f_s3_pj_rl_TipoDocumentoFC.value
        )[0].documento
        : '';
    representanteLegal.numeroDocumento = this.f_s3_pj_rl_NumeroDocumentoFC.value;
    representanteLegal.domicilioLegal = this.f_s3_pj_rl_DomicilioFC.value;
    representanteLegal.oficinaRegistral.id = oficinaRepresentante;
    representanteLegal.oficinaRegistral.descripcion =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.oficinasRegistral.filter(
          (item) => item.value === oficinaRepresentante
        )[0].text
        : '';
    representanteLegal.partida = this.f_s3_pj_rl_PartidaFC.value;
    representanteLegal.asiento = this.f_s3_pj_rl_AsientoFC.value;
    representanteLegal.distrito = this.ubigeoRepLegComponent?.getDistritoText() ?? '';
    representanteLegal.provincia = this.ubigeoRepLegComponent?.getProvinciaText() ?? '';
    representanteLegal.departamento = this.ubigeoRepLegComponent?.getDepartamentoText() ?? '';
    representanteLegal.cargo = this.cargoRepresentanteLegal;
    seccion3.telefono =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_rl_TelefonoFC.value
        : this.f_s3_pn_TelefonoFC.value;
    seccion3.celular =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_rl_CelularFC.value
        : this.f_s3_pn_CelularFC.value;
    seccion3.email =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_rl_CorreoFC.value
        : this.f_s3_pn_CorreoFC.value;

    seccion5.declaracion1 = this.f_s5_declaracion1FC.value;
    seccion5.declaracion2 = this.f_s5_declaracion2FC.value;

    seccion6.dni =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_rl_NumeroDocumentoFC.value
        : this.f_s3_pn_NroDocSolicitanteFC.value;
    seccion6.nombre =
      this.tipoSolicitante === 'PJ' ||
        this.tipoSolicitante === 'PNR'
        ? this.f_s3_pj_rl_NombreFC.value +
        ' ' +
        this.f_s3_pj_rl_ApePaternoFC.value +
        ' ' +
        this.f_s3_pj_rl_ApeMaternoFC.value
        : this.f_s3_pn_NombresFC.value;

    seccion7.itinerario = this.f_s7_ItinerarioFC.value;

    console.log('dataGuardar: ', JSON.stringify(dataGuardar));

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          // GUARDAR:
          try {
            const data = await this.formularioService.post<any>(dataGuardar).toPromise();
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
                  const data = await this.formularioService.put<any>(dataGuardar).toPromise();
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
                  console.log(e);
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              });
          } else {
            // actualiza formulario
            this.funcionesMtcService.mostrarCargando();
            try {
              const data = await this.formularioService.put<any>(dataGuardar).toPromise();
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 005/12';
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

  onInputEvent(event: any, formControl: UntypedFormControl): void {
    if (event?.target?.value) {
      const position = event.target.selectionStart;
      formControl.setValue(event.target.value.toUpperCase(), { emitEvent: false });
      event.target.selectionEnd = position;
    }
  }
}
