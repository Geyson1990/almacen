/**
 * Formulario 003/28
 * @author André Bernabé Pérez
 * @version 1.0 18.05.2022
 */

import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { CONSTANTES } from 'src/app/enums/constants';
import {
  noWhitespaceValidator,
  exactLengthValidator,
} from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Formulario003_28Service } from '../../../application/usecases';
import {
  Formulario003_28Request,
  MetaData,
} from '../../../domain/formulario003_28/formulario003_28Request';
import { Formulario003_28Response } from '../../../domain/formulario003_28/formulario003_28Response';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpDatOma') ubigeoDatOmaComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

  txtTitulo = 'FORMULARIO 003/28 SERVICIOS RADIOAFICIONADOS';

  formularioFG: UntypedFormGroup;

  graboUsuario = false;

  id = 0;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;

  datosUsuarioLogin: DatosUsuarioLogin;

  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];
  representanteLegal: RepresentanteLegal[];

  oficinasRegistral: any[];

  nroDocumentoLogin: string;
  nroRuc = '';
  razonSocial: string;
  cargoRepresentanteLegal = '';

  disableBtnBuscarRepLegal = false;

  showNroDocCERepLeg = false;
  showNroDocCEPerNat = false;

  tipoSolicitante: string;

  disableGuardar = false;

  tipoDocumentoSolicitante: string = '';
  nombreTipoDocumentoSolicitante: string = '';
  numeroDocumentoSolicitante: string = '';
  nombreSolicitante: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private oficinaRegistralService: OficinaRegistralService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario003_28Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService
  ) {}

  ngOnInit(): void {
    const tramiteSelected: any = JSON.parse(
      localStorage.getItem('tramite-selected')
    );
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa =
      this.dataInput.tipoSolicitudTupaCod === ''
        ? '0'
        : this.dataInput.tipoSolicitudTupaCod;
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    console.log('dataInput: ', this.dataInput);

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    this.formularioFG = this.fb.group({
      f_Seccion2FG: this.fb.group({
        f_s2_notificaCorreoFC: ['', [Validators.required]],
      }),
      f_Seccion3FG: this.fb.group({
        f_s3_PerNatFG: this.fb.group({
          f_s3_pn_TipoDocumentoFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(20),
            ],
          ],
          f_s3_pn_NumeroDocumentoFC: [
            '',
            [Validators.required, exactLengthValidator([8, 9])],
          ],
          f_s3_pn_RucFC: [
            '',
            [Validators.required, exactLengthValidator([11])],
          ],
          f_s3_pn_NombreFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s3_pn_ApePaternoFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s3_pn_ApeMaternoFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s3_pn_TelefonoFC: ['', [Validators.maxLength(9)]],
          f_s3_pn_CelularFC: [
            '',
            [Validators.required, exactLengthValidator([9])],
          ],
          f_s3_pn_CorreoFC: [
            '',
            [
              Validators.required,
              Validators.email,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s3_pn_DomicilioFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(100),
            ],
          ],
          f_s3_pn_DepartamentoFC: ['', [Validators.required]],
          f_s3_pn_ProvinciaFC: ['', [Validators.required]],
          f_s3_pn_DistritoFC: ['', [Validators.required]],
          f_s3_pn_DiscapacidadFG: this.fb.group({
            f_s3_pn_di_ResConadisFC: [
              '',
              [noWhitespaceValidator(), Validators.maxLength(50)],
            ],
            f_s3_pn_di_VisualFC: [false],
            f_s3_pn_di_AuditivaFC: [false],
            f_s3_pn_di_MentalFC: [false],
            f_s3_pn_di_FisicaFC: [false],
            f_s3_pn_di_LenguajeFC: [false],
            f_s3_pn_di_IntelectualFC: [false],
            f_s3_pn_di_MultipleFC: [false],
          }),
        }),
        f_s3_PerJurFG: this.fb.group({
          f_s3_pj_RazonSocialFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(100),
            ],
          ],
          f_s3_pj_RucFC: [
            '',
            [Validators.required, exactLengthValidator([11])],
          ],
          f_s3_pj_DomicilioFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(100),
            ],
          ],
          f_s3_pj_DepartamentoFC: ['', [Validators.required]],
          f_s3_pj_ProvinciaFC: ['', [Validators.required]],
          f_s3_pj_DistritoFC: ['', [Validators.required]],
          f_s3_pj_RepLegalFG: this.fb.group({
            f_s3_pj_rl_TipoDocumentoFC: ['', [Validators.required]],
            f_s3_pj_rl_NumeroDocumentoFC: ['', [Validators.required]], // at runtime maxlength
            f_s3_pj_rl_NombreFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(50),
              ],
            ],
            f_s3_pj_rl_ApePaternoFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(50),
              ],
            ],
            f_s3_pj_rl_ApeMaternoFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(50),
              ],
            ],
            f_s3_pj_rl_TelefonoFC: ['', [Validators.maxLength(9)]],
            f_s3_pj_rl_CelularFC: [
              '',
              [Validators.required, exactLengthValidator([9])],
            ],
            f_s3_pj_rl_CorreoFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.email,
                Validators.maxLength(50),
              ],
            ],
            f_s3_pj_rl_DomicilioFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(100),
              ],
            ],
            f_s3_pj_rl_DepartamentoFC: ['', [Validators.required]],
            f_s3_pj_rl_ProvinciaFC: ['', [Validators.required]],
            f_s3_pj_rl_DistritoFC: ['', [Validators.required]],
            f_s3_pj_rl_OficinaFC: ['', [Validators.required]],
            f_s3_pj_rl_PartidaFC: [
              '',
              [Validators.required, Validators.maxLength(15)],
            ],
            f_s3_pj_rl_AsientoFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(15),
              ],
            ],
            f_s3_pj_rl_ObjSocialFC: [
              '',
              [
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(15),
              ],
            ],
          }),
        }),
      }),
      f_Seccion4FG: this.fb.group({
        f_s4_declaracion1FC: [true],
        f_s4_declaracion2FC: [true],
      }),
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.cargarOficinaRegistral();

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName(); // nombre de usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc(); // nro de documento usuario login
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario

    console.log('tipoDocumento: ', this.seguridadService.getNameId());

    // tipo de documento usuario login
    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.f_s3_pn_TipoDocumentoFC.setValue('01'); // 01 DNI  03 CI  04 CE

        this.f_s3_PerNatFG.enable({ emitEvent: false });
        this.f_s3_PerJurFG.disable({ emitEvent: false });

        this.f_s3_pn_RucFC.disable();
        // this.f_s3_pn_DepartamentoFC.enable({ emitEvent: false });
        // this.f_s3_pn_ProvinciaFC.enable({ emitEvent: false });
        // this.f_s3_pn_DistritoFC.enable({ emitEvent: false });

        break;
      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica

        this.f_s3_PerNatFG.disable({ emitEvent: false });
        this.f_s3_PerJurFG.enable({ emitEvent: false });
        break;
      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.f_s3_pn_TipoDocumentoFC.setValue('04'); // 01 DNI  03 CI  04 CE

        this.f_s3_PerNatFG.enable({ emitEvent: false });
        this.f_s3_PerJurFG.disable({ emitEvent: false });

        this.f_s3_pn_RucFC.disable();
        this.f_s3_pn_DepartamentoFC.disable({ emitEvent: false });
        this.f_s3_pn_ProvinciaFC.disable({ emitEvent: false });
        this.f_s3_pn_DistritoFC.disable({ emitEvent: false });
        break;
      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.f_s3_pn_TipoDocumentoFC.setValue('01'); // 01 DNI  03 CI  04 CE

        this.f_s3_PerNatFG.enable({ emitEvent: false });
        this.f_s3_PerJurFG.disable({ emitEvent: false });

        // this.f_s3_pn_RucFC.enable();
        break;
    }

    this.onChangeTipoDocumentoPerNat();
    this.onChangeTipoDocumentoRepLeg();
    this.onChangeNumeroDocumentoRepLeg();

    await this.cargarDatos();
  }

  // GET FORM formularioFG
  get f_Seccion2FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion2FG') as UntypedFormGroup;
  }
  get f_s2_notificaCorreoFC(): UntypedFormControl {
    return this.f_Seccion2FG.get(['f_s2_notificaCorreoFC']) as UntypedFormControl;
  }
  get f_Seccion3FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup;
  }
  get f_s3_PerNatFG(): UntypedFormGroup {
    return this.f_Seccion3FG.get('f_s3_PerNatFG') as UntypedFormGroup;
  }
  get f_s3_pn_TipoDocumentoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_TipoDocumentoFC']) as UntypedFormControl;
  }
  get f_s3_pn_NumeroDocumentoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_NumeroDocumentoFC']) as UntypedFormControl;
  }
  get f_s3_pn_RucFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_RucFC']) as UntypedFormControl;
  }
  get f_s3_pn_NombreFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_NombreFC']) as UntypedFormControl;
  }
  get f_s3_pn_ApePaternoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_ApePaternoFC']) as UntypedFormControl;
  }
  get f_s3_pn_ApeMaternoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_ApeMaternoFC']) as UntypedFormControl;
  }
  get f_s3_pn_TelefonoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_TelefonoFC']) as UntypedFormControl;
  }
  get f_s3_pn_CelularFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_CelularFC']) as UntypedFormControl;
  }
  get f_s3_pn_CorreoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_CorreoFC']) as UntypedFormControl;
  }
  get f_s3_pn_DomicilioFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_DomicilioFC']) as UntypedFormControl;
  }
  get f_s3_pn_DepartamentoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_DepartamentoFC']) as UntypedFormControl;
  }
  get f_s3_pn_ProvinciaFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_ProvinciaFC']) as UntypedFormControl;
  }
  get f_s3_pn_DistritoFC(): UntypedFormControl {
    return this.f_s3_PerNatFG.get(['f_s3_pn_DistritoFC']) as UntypedFormControl;
  }
  get f_s3_pn_DiscapacidadFG(): UntypedFormGroup {
    return this.f_s3_PerNatFG.get('f_s3_pn_DiscapacidadFG') as UntypedFormGroup;
  }
  get f_s3_pn_di_ResConadisFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_ResConadisFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_VisualFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_VisualFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_AuditivaFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_AuditivaFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_MentalFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_MentalFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_FisicaFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_FisicaFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_LenguajeFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_LenguajeFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_IntelectualFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_IntelectualFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pn_di_MultipleFC(): UntypedFormControl {
    return this.f_s3_pn_DiscapacidadFG.get([
      'f_s3_pn_di_MultipleFC',
    ]) as UntypedFormControl;
  }
  get f_s3_PerJurFG(): UntypedFormGroup {
    return this.f_Seccion3FG.get('f_s3_PerJurFG') as UntypedFormGroup;
  }
  get f_s3_pj_RazonSocialFC(): UntypedFormControl {
    return this.f_s3_PerJurFG.get(['f_s3_pj_RazonSocialFC']) as UntypedFormControl;
  }
  get f_s3_pj_RucFC(): UntypedFormControl {
    return this.f_s3_PerJurFG.get(['f_s3_pj_RucFC']) as UntypedFormControl;
  }
  get f_s3_pj_DomicilioFC(): UntypedFormControl {
    return this.f_s3_PerJurFG.get(['f_s3_pj_DomicilioFC']) as UntypedFormControl;
  }
  get f_s3_pj_DepartamentoFC(): UntypedFormControl {
    return this.f_s3_PerJurFG.get(['f_s3_pj_DepartamentoFC']) as UntypedFormControl;
  }
  get f_s3_pj_ProvinciaFC(): UntypedFormControl {
    return this.f_s3_PerJurFG.get(['f_s3_pj_ProvinciaFC']) as UntypedFormControl;
  }
  get f_s3_pj_DistritoFC(): UntypedFormControl {
    return this.f_s3_PerJurFG.get(['f_s3_pj_DistritoFC']) as UntypedFormControl;
  }
  get f_s3_pj_RepLegalFG(): UntypedFormGroup {
    return this.f_s3_PerJurFG.get('f_s3_pj_RepLegalFG') as UntypedFormGroup;
  }
  get f_s3_pj_rl_TipoDocumentoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_TipoDocumentoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_NumeroDocumentoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_NumeroDocumentoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_NombreFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_NombreFC']) as UntypedFormControl;
  }
  get f_s3_pj_rl_ApePaternoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_ApePaternoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_ApeMaternoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_ApeMaternoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_TelefonoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_TelefonoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_CelularFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_CelularFC']) as UntypedFormControl;
  }
  get f_s3_pj_rl_CorreoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_CorreoFC']) as UntypedFormControl;
  }
  get f_s3_pj_rl_DomicilioFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_DomicilioFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_DepartamentoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_DepartamentoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_ProvinciaFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_ProvinciaFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_DistritoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_DistritoFC',
    ]) as UntypedFormControl;
  }
  get f_s3_pj_rl_OficinaFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_OficinaFC']) as UntypedFormControl;
  }
  get f_s3_pj_rl_PartidaFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_PartidaFC']) as UntypedFormControl;
  }
  get f_s3_pj_rl_AsientoFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_AsientoFC']) as UntypedFormControl;
  }
  get f_s3_pj_rl_ObjSocialFC(): UntypedFormControl {
    return this.f_s3_pj_RepLegalFG.get([
      'f_s3_pj_rl_ObjSocialFC',
    ]) as UntypedFormControl;
  }
  get f_Seccion4FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion4FG') as UntypedFormGroup;
  }
  get f_s4_declaracion1FC(): UntypedFormControl {
    return this.f_Seccion4FG.get(['f_s4_declaracion1FC']) as UntypedFormControl;
  }
  get f_s4_declaracion2FC(): UntypedFormControl {
    return this.f_Seccion4FG.get(['f_s4_declaracion2FC']) as UntypedFormControl;
  }
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
      const dataOficinaRegistral = await this.oficinaRegistralService
        .oficinaRegistral()
        .toPromise();
      this.oficinasRegistral = dataOficinaRegistral;
      this.funcionesMtcService.ocultarCargando();
    } catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError(
          'Problemas para conectarnos con el servicio y recuperar datos de la oficina registral'
        );
    }
  }

  onChangeTipoDocumentoPerNat(): void {
    this.f_s3_pn_TipoDocumentoFC.valueChanges.subscribe(
      (tipoDocumento: string) => {
        if (tipoDocumento?.trim() === '04') {
          // Carnet de Extranjeria
          this.f_s3_pn_ApeMaternoFC.setValidators([
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ]);
          this.f_s3_pn_ApeMaternoFC.updateValueAndValidity();

          this.f_s3_pn_NumeroDocumentoFC.setValidators([
            Validators.required,
            exactLengthValidator([9]),
          ]);
          this.showNroDocCEPerNat = true;

          this.f_s3_pn_DepartamentoFC.disable({ emitEvent: false });
          this.f_s3_pn_ProvinciaFC.disable({ emitEvent: false });
          this.f_s3_pn_DistritoFC.disable({ emitEvent: false });
        } else {
          this.f_s3_pn_ApeMaternoFC.setValidators([
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ]);
          this.f_s3_pn_ApeMaternoFC.updateValueAndValidity();

          this.f_s3_pn_NumeroDocumentoFC.setValidators([
            Validators.required,
            exactLengthValidator([8]),
          ]);
          this.showNroDocCEPerNat = false;

          this.f_s3_pn_DepartamentoFC.enable({ emitEvent: false });
          this.f_s3_pn_ProvinciaFC.enable({ emitEvent: false });
          this.f_s3_pn_DistritoFC.enable({ emitEvent: false });
        }

        this.f_s3_pn_ApeMaternoFC.updateValueAndValidity({ emitEvent: false });
        this.f_s3_pn_NumeroDocumentoFC.updateValueAndValidity({
          emitEvent: false,
        });

        this.f_s3_pn_NumeroDocumentoFC.reset('', { emitEvent: false });
        this.f_s3_pn_NombreFC.reset('', { emitEvent: false });
        this.f_s3_pn_ApePaternoFC.reset('', { emitEvent: false });
        this.f_s3_pn_ApeMaternoFC.reset('', { emitEvent: false });
        this.f_s3_pn_DomicilioFC.reset('', { emitEvent: false });
        this.f_s3_pn_DepartamentoFC.reset('');
      }
    );
  }

  onChangeTipoDocumentoRepLeg(): void {
    this.f_s3_pj_rl_TipoDocumentoFC.valueChanges.subscribe(
      (tipoDocumento: string) => {
        console.log('SE CAMBIO EL TIPO DE DOCUMENTO: ', tipoDocumento);
        if (tipoDocumento?.trim() === '04') {
          // Carnet de Extranjeria
          this.f_s3_pj_rl_ApeMaternoFC.setValidators([
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ]);

          this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([
            Validators.required,
            exactLengthValidator([9]),
          ]);
          this.showNroDocCERepLeg = true;

          this.f_s3_pj_rl_DepartamentoFC.disable({ emitEvent: false });
          this.f_s3_pj_rl_ProvinciaFC.disable({ emitEvent: false });
          this.f_s3_pj_rl_DistritoFC.disable({ emitEvent: false });
        } else {
          this.f_s3_pj_rl_ApeMaternoFC.setValidators([
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ]);

          this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([
            Validators.required,
            exactLengthValidator([8]),
          ]);
          this.showNroDocCERepLeg = false;

          this.f_s3_pj_rl_DepartamentoFC.enable({ emitEvent: false });
          this.f_s3_pj_rl_ProvinciaFC.enable({ emitEvent: false });
          this.f_s3_pj_rl_DistritoFC.enable({ emitEvent: false });
        }

        this.f_s3_pj_rl_ApeMaternoFC.updateValueAndValidity({
          emitEvent: false,
        });
        this.f_s3_pj_rl_NumeroDocumentoFC.updateValueAndValidity({
          emitEvent: false,
        });

        this.f_s3_pj_rl_NumeroDocumentoFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_NombreFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_ApePaternoFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_ApeMaternoFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_DomicilioFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_DepartamentoFC.reset('');
      }
    );
  }

  onChangeNumeroDocumentoRepLeg(): void {
    this.f_s3_pj_rl_NumeroDocumentoFC.valueChanges.subscribe(
      (numeroDoc: string) => {
        console.log('SE CAMBIO EL NUMERO DE DOCUMENTO: ', numeroDoc);
        this.f_s3_pj_rl_NombreFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_ApePaternoFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_ApeMaternoFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_DomicilioFC.reset('', { emitEvent: false });
        this.f_s3_pj_rl_DepartamentoFC.reset('');
      }
    );
  }

  async buscarNumeroDocumentoPerNat(cargarDatos = false): Promise<void> {
    const tipoDocumento: string = this.f_s3_pn_TipoDocumentoFC.value.trim();
    const numeroDocumento: string = this.f_s3_pn_NumeroDocumentoFC.value.trim();

    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '01') {
      // DNI
      try {
        const respuesta = await this.reniecService
          .getDni(numeroDocumento)
          .toPromise();
        console.log(respuesta);
        this.funcionesMtcService.ocultarCargando();

        if (
          respuesta.reniecConsultDniResponse.listaConsulta.coResultado !==
          '0000'
        ) {
          return this.funcionesMtcService.mensajeError(
            'Número de documento no registrado en RENIEC'
          );
        }

        const { prenombres, apPrimer, apSegundo, direccion, ubigeo } =
          respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        const [departamento, provincia, distrito] = ubigeo.split('/');

        this.setPerNat(
          tipoDocumento,
          prenombres,
          apPrimer,
          apSegundo,
          direccion,
          departamento,
          provincia,
          distrito,
          cargarDatos
        );
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Reniec);
      }
    } else if (tipoDocumento === '04') {
      // CARNÉ DE EXTRANJERÍA
      try {
        const { CarnetExtranjeria } = await this.extranjeriaService
          .getCE(numeroDocumento)
          .toPromise();
        console.log(CarnetExtranjeria);
        const { numRespuesta, nombres, primerApellido, segundoApellido } =
          CarnetExtranjeria;

        this.funcionesMtcService.ocultarCargando();

        if (numRespuesta !== '0000') {
          return this.funcionesMtcService.mensajeError(
            'Número de documento no registrado en Migraciones'
          );
        }

        this.setPerNat(
          tipoDocumento,
          nombres,
          primerApellido,
          segundoApellido,
          '',
          '',
          '',
          '',
          cargarDatos
        );
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Migraciones);
      }
    }
  }

  async setPerNat(
    tipoDocumento: string,
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    direccion: string,
    departamento: string,
    provincia: string,
    distrito: string,
    cargarDatos = false
  ): Promise<void> {
    if (cargarDatos) {
      this.funcionesMtcService.ocultarCargando();
      this.f_s3_pn_NombreFC.setValue(nombres);
      this.f_s3_pn_ApePaternoFC.setValue(apPaterno);
      this.f_s3_pn_ApeMaternoFC.setValue(apMaterno);
      this.f_s3_pn_DomicilioFC.setValue(direccion);

      await this.ubigeoPerNatComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito
      );
    } else {
      this.funcionesMtcService
        .mensajeConfirmar(
          `Los datos ingresados fueron validados por ${
            tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'
          } corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`
        )
        .then(async () => {
          this.f_s3_pn_NombreFC.setValue(nombres);
          this.f_s3_pn_ApePaternoFC.setValue(apPaterno);
          this.f_s3_pn_ApeMaternoFC.setValue(apMaterno);
          this.f_s3_pn_DomicilioFC.setValue(direccion);

          await this.ubigeoPerNatComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito
          );
        });
    }
  }

  async buscarNumeroDocumentoRepLeg(cargarDatos = false): Promise<void> {
    const tipoDocumento: string = this.f_s3_pj_rl_TipoDocumentoFC.value.trim();
    const numeroDocumento: string =
      this.f_s3_pj_rl_NumeroDocumentoFC.value.trim();

    const resultado = this.representanteLegal?.find(
      (representante) =>
        ('0' + representante.tipoDocumento.trim()).toString() ===
          tipoDocumento && representante.nroDocumento.trim() === numeroDocumento
    );

    if (resultado) {
      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '01') {
        // DNI
        try {
          const respuesta = await this.reniecService
            .getDni(numeroDocumento)
            .toPromise();
          console.log(respuesta);

          this.funcionesMtcService.ocultarCargando();

          if (
            respuesta.reniecConsultDniResponse.listaConsulta.coResultado !==
            '0000'
          ) {
            return this.funcionesMtcService.mensajeError(
              'Número de documento no registrado en RENIEC'
            );
          }

          const { prenombres, apPrimer, apSegundo, direccion, ubigeo } =
            respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          const [departamento, provincia, distrito] = ubigeo.split('/');

          this.setRepLegal(
            tipoDocumento,
            prenombres,
            apPrimer,
            apSegundo,
            direccion,
            departamento,
            provincia,
            distrito,
            cargarDatos
          );

          const cargo = resultado?.cargo?.split('-');
          if (cargo) {
            this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
          }
        } catch (e) {
          console.error(e);
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError(CONSTANTES.MensajeError.Reniec);
        }
      } else if (tipoDocumento === '04') {
        // CARNÉ DE EXTRANJERÍA
        try {
          const { CarnetExtranjeria } = await this.extranjeriaService
            .getCE(numeroDocumento)
            .toPromise();
          console.log(CarnetExtranjeria);
          const { numRespuesta, nombres, primerApellido, segundoApellido } =
            CarnetExtranjeria;

          this.funcionesMtcService.ocultarCargando();

          if (numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError(
              'Número de documento no registrado en MIGRACIONES'
            );
          }

          this.setRepLegal(
            tipoDocumento,
            nombres,
            primerApellido,
            segundoApellido,
            '',
            '',
            '',
            '',
            cargarDatos
          );
        } catch (e) {
          console.error(e);
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError(CONSTANTES.MensajeError.Migraciones);
        }
      }
    } else {
      return this.funcionesMtcService.mensajeError(
        CONSTANTES.MensajeError.RepLegNotFound
      );
    }
  }

  async setRepLegal(
    tipoDocumento: string,
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    direccion: string,
    departamento: string,
    provincia: string,
    distrito: string,
    cargarDatos = false
  ): Promise<void> {
    if (cargarDatos) {
      this.f_s3_pj_rl_NombreFC.setValue(nombres);
      this.f_s3_pj_rl_ApePaternoFC.setValue(apPaterno);
      this.f_s3_pj_rl_ApeMaternoFC.setValue(apMaterno);
      this.f_s3_pj_rl_DomicilioFC.setValue(direccion);

      await this.ubigeoRepLegComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito
      );
    } else {
      this.funcionesMtcService
        .mensajeConfirmar(
          `Los datos ingresados fueron validados por ${
            tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'
          } corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`
        )
        .then(async () => {
          this.f_s3_pj_rl_NombreFC.setValue(nombres);
          this.f_s3_pj_rl_ApePaternoFC.setValue(apPaterno);
          this.f_s3_pj_rl_ApeMaternoFC.setValue(apMaterno);
          this.f_s3_pj_rl_DomicilioFC.setValue(direccion);

          await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito
          );
        });
    }
  }

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput != null && this.dataInput.movId > 0) {
      try {
        const dataFormulario = await this.formularioTramiteService
          .get<Formulario003_28Response>(this.dataInput.tramiteReqId)
          .toPromise();

        this.funcionesMtcService.ocultarCargando();
        console.log(JSON.parse(dataFormulario.metaData));
        const { seccion2, seccion3, seccion4 } = JSON.parse(
          dataFormulario.metaData
        ) as MetaData;
        this.id = dataFormulario.formularioId;

        if (this.f_Seccion2FG.enabled) {
          this.f_s2_notificaCorreoFC.setValue(seccion2.notificaCorreo);
        }

        if (this.f_Seccion3FG.enabled) {
          const { perNatural, perJuridica } = seccion3;

          if (this.f_s3_PerNatFG.enabled) {
            this.f_s3_pn_TipoDocumentoFC.setValue(perNatural.tipoDocumento.id);
            this.f_s3_pn_NumeroDocumentoFC.setValue(perNatural.numeroDocumento);
            this.f_s3_pn_NombreFC.setValue(perNatural.nombres);
            this.f_s3_pn_ApePaternoFC.setValue(perNatural.apellidoPaterno);
            this.f_s3_pn_ApeMaternoFC.setValue(perNatural.apellidoMaterno);
            this.f_s3_pn_TelefonoFC.setValue(perNatural.telefono);
            this.f_s3_pn_CelularFC.setValue(perNatural.celular);
            this.f_s3_pn_CorreoFC.setValue(perNatural.email);
            this.f_s3_pn_DomicilioFC.setValue(perNatural.domicilioLegal);

            await this.ubigeoPerNatComponent?.setUbigeoByText(
              perNatural.departamento,
              perNatural.provincia,
              perNatural.distrito
            );

            this.f_s3_pn_TipoDocumentoFC.disable({ emitEvent: false });
            this.f_s3_pn_NumeroDocumentoFC.disable({ emitEvent: false });

            if (this.f_s3_pn_DiscapacidadFG.enabled) {
              const {
                resConadis,
                visual,
                auditiva,
                mental,
                fisica,
                lenguaje,
                intelectual,
                multiple,
              } = perNatural.discapacidad;
              this.f_s3_pn_di_ResConadisFC.setValue(resConadis);
              this.f_s3_pn_di_VisualFC.setValue(visual);
              this.f_s3_pn_di_AuditivaFC.setValue(auditiva);
              this.f_s3_pn_di_MentalFC.setValue(mental);
              this.f_s3_pn_di_FisicaFC.setValue(fisica);
              this.f_s3_pn_di_LenguajeFC.setValue(lenguaje);
              this.f_s3_pn_di_IntelectualFC.setValue(intelectual);
              this.f_s3_pn_di_MultipleFC.setValue(multiple);
            }

            if (this.tipoSolicitante === 'PNR') {
              this.f_s3_pn_RucFC.setValue(perNatural.ruc);

              this.f_s3_pn_RucFC.disable({ emitEvent: false });
            }
          }

          if (this.f_s3_PerJurFG.enabled) {
            this.f_s3_pj_RucFC.setValue(perJuridica.ruc);
            this.f_s3_pj_RazonSocialFC.setValue(perJuridica.razonSocial);
            this.f_s3_pj_DomicilioFC.setValue(perJuridica.domicilioLegal);

            // await this.ubigeoPerJurComponent?.setUbigeoByText(
            //   seccion3.departamento.trim(),
            //   seccion3.provincia.trim(),
            //   seccion3.distrito.trim());

            this.f_s3_pj_DepartamentoFC.setValue(
              perJuridica.departamento.trim()
            );
            this.f_s3_pj_ProvinciaFC.setValue(perJuridica.provincia.trim());
            this.f_s3_pj_DistritoFC.setValue(perJuridica.distrito.trim());

            const { representanteLegal } = perJuridica;
            this.f_s3_pj_rl_TelefonoFC.setValue(representanteLegal.telefono);
            this.f_s3_pj_rl_CelularFC.setValue(representanteLegal.celular);
            this.f_s3_pj_rl_CorreoFC.setValue(representanteLegal.email);

            this.f_s3_pj_rl_TipoDocumentoFC.setValue(
              representanteLegal.tipoDocumento.id,
              { emitEvent: false }
            );
            if (representanteLegal.tipoDocumento.id === '04') {
              // Carnet de Extranjeria
              this.f_s3_pj_rl_ApeMaternoFC.setValidators([
                noWhitespaceValidator(),
                Validators.maxLength(50),
              ]);
              this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([
                Validators.required,
                exactLengthValidator([9]),
              ]);
              this.showNroDocCEPerNat = true;
              this.f_s3_pj_rl_DepartamentoFC.disable({ emitEvent: false });
              this.f_s3_pj_rl_ProvinciaFC.disable({ emitEvent: false });
              this.f_s3_pj_rl_DistritoFC.disable({ emitEvent: false });
            } else {
              this.f_s3_pj_rl_ApeMaternoFC.setValidators([
                Validators.required,
                noWhitespaceValidator(),
                Validators.maxLength(50),
              ]);
              this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([
                Validators.required,
                exactLengthValidator([8]),
              ]);
              this.showNroDocCEPerNat = false;
              this.f_s3_pj_rl_DepartamentoFC.enable({ emitEvent: false });
              this.f_s3_pj_rl_ProvinciaFC.enable({ emitEvent: false });
              this.f_s3_pj_rl_DistritoFC.enable({ emitEvent: false });
            }

            this.f_s3_pj_rl_ApeMaternoFC.updateValueAndValidity({
              emitEvent: false,
            });
            this.f_s3_pj_rl_NumeroDocumentoFC.updateValueAndValidity({
              emitEvent: false,
            });

            this.f_s3_pj_rl_NumeroDocumentoFC.setValue(
              representanteLegal.numeroDocumento,
              { emitEvent: false }
            );
            this.f_s3_pj_rl_NombreFC.setValue(representanteLegal.nombres);
            this.f_s3_pj_rl_ApePaternoFC.setValue(
              representanteLegal.apellidoPaterno
            );
            this.f_s3_pj_rl_ApeMaternoFC.setValue(
              representanteLegal.apellidoMaterno
            );
            this.f_s3_pj_rl_DomicilioFC.setValue(
              representanteLegal.domicilioLegal
            );

            await this.ubigeoRepLegComponent?.setUbigeoByText(
              representanteLegal.departamento,
              representanteLegal.provincia,
              representanteLegal.distrito
            );

            this.f_s3_pj_rl_OficinaFC.setValue(
              representanteLegal.oficinaRegistral.id
            );
            this.f_s3_pj_rl_PartidaFC.setValue(representanteLegal.partida);
            this.f_s3_pj_rl_AsientoFC.setValue(representanteLegal.asiento);
            this.f_s3_pj_rl_ObjSocialFC.setValue(
              representanteLegal.objetoSocial
            );

            // Traemos los Representantes Legales desde la SUNAT
            try {
              this.funcionesMtcService.mostrarCargando();
              const response = await this.sunatService
                .getDatosPrincipales(this.nroRuc)
                .toPromise();
              this.funcionesMtcService.ocultarCargando();
              this.representanteLegal = response.representanteLegal;
            } catch (e) {
              console.error(e);
              this.f_s3_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
              this.f_s3_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeWarn(CONSTANTES.MensajeError.UpdateRepLegSunat);
            }
          }
        }

        if (this.f_Seccion4FG.enabled) {
          this.f_s4_declaracion1FC.setValue(seccion4.declaracion1);
          this.f_s4_declaracion2FC.setValue(seccion4.declaracion2);
        }
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados');
      }
    } else {
      // NO HAY DATOS GUARDADOS
      switch (this.tipoSolicitante) {
        case 'PN':
        case 'PE':
        case 'PNR':
          this.f_s3_pn_NumeroDocumentoFC.setValue(this.nroDocumentoLogin);
          //await this.buscarNumeroDocumentoPerNat(true);

          this.setPerNat(
            this.f_s3_pn_TipoDocumentoFC.value.trim(),
            this.datosUsuarioLogin.nombres,
            this.datosUsuarioLogin.apePaterno,
            this.datosUsuarioLogin.apeMaterno,
            this.datosUsuarioLogin.direccion,
            this.datosUsuarioLogin.departamento,
            this.datosUsuarioLogin.provincia,
            this.datosUsuarioLogin.distrito,
            true
          );
          this.f_s3_pn_TipoDocumentoFC.disable({ emitEvent: false });
          this.f_s3_pn_NumeroDocumentoFC.disable({ emitEvent: false });
          this.f_s3_pn_TelefonoFC.setValue(this.datosUsuarioLogin.telefono);
          this.f_s3_pn_CelularFC.setValue(this.datosUsuarioLogin.celular);
          this.f_s3_pn_CorreoFC.setValue(this.datosUsuarioLogin.correo);

          if (this.tipoSolicitante === 'PNR') {
            try {
              this.f_s3_pn_RucFC.setValue(this.datosUsuarioLogin.ruc);
              this.f_s3_pn_RucFC.disable();
              //this.funcionesMtcService.ocultarCargando();
            } catch (e) {
              console.error(e);
              //this.funcionesMtcService.ocultarCargando().mensajeWarn(CONSTANTES.MensajeError.Sunat);

              this.f_s3_pn_RucFC.setValue(this.datosUsuarioLogin.ruc);
              this.f_s3_pn_RucFC.disable();
            }
          }
          break;
        case 'PJ':
          try {
            this.funcionesMtcService.mostrarCargando();
            const response = await this.sunatService
              .getDatosPrincipales(this.nroRuc)
              .toPromise();
            console.log('SUNAT: ', response);

            this.f_s3_pj_RazonSocialFC.setValue(
              this.datosUsuarioLogin.razonSocial
            );
            this.f_s3_pj_RucFC.setValue(this.datosUsuarioLogin.ruc);
            this.f_s3_pj_DomicilioFC.setValue(this.datosUsuarioLogin.direccion);

            // await this.ubigeoPerJurComponent?.setUbigeoByText(
            //   response.nombreDepartamento.trim(),
            //   response.nombreProvincia.trim(),
            //   response.nombreDistrito.trim());

            this.f_s3_pj_DepartamentoFC.setValue(
              this.datosUsuarioLogin.departamento.trim()
            );
            this.f_s3_pj_ProvinciaFC.setValue(
              this.datosUsuarioLogin.provincia.trim()
            );
            this.f_s3_pj_DistritoFC.setValue(
              this.datosUsuarioLogin.distrito.trim()
            );

            this.f_s3_pj_rl_TelefonoFC.setValue(
              this.datosUsuarioLogin.telefono.trim()
            );
            this.f_s3_pj_rl_CelularFC.setValue(
              this.datosUsuarioLogin.celular.trim()
            );
            this.f_s3_pj_rl_CorreoFC.setValue(
              this.datosUsuarioLogin.correo.trim()
            );

            this.representanteLegal = response.representanteLegal;

            // Cargamos el Representante Legal
            for (const repLegal of this.representanteLegal) {
              if (repLegal.nroDocumento === this.nroDocumentoLogin) {
                if (repLegal.tipoDocumento === '1') {
                  // DNI
                  this.f_s3_pj_rl_TipoDocumentoFC.setValue('01', {
                    emitEvent: false,
                  });

                  this.f_s3_pj_rl_ApeMaternoFC.setValidators([
                    Validators.required,
                    noWhitespaceValidator(),
                    Validators.maxLength(50),
                  ]);
                  this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([
                    Validators.required,
                    exactLengthValidator([8]),
                  ]);
                  // this.maxLengthNumeroDocumentoRepLeg = 8;
                  this.showNroDocCEPerNat = false;
                  // this.f_s3_pj_rl_DepartamentoFC.enable({ emitEvent: false });
                  // this.f_s3_pj_rl_ProvinciaFC.enable({ emitEvent: false });
                  // this.f_s3_pj_rl_DistritoFC.enable({ emitEvent: false });

                  this.f_s3_pj_rl_NumeroDocumentoFC.setValue(
                    repLegal.nroDocumento,
                    { emitEvent: false }
                  );
                  this.buscarNumeroDocumentoRepLeg(true);
                }
                break;
              }
            }
            // Cargamos el Representante Legal

            // this.setDisableDefaultPerJur();

            this.funcionesMtcService.ocultarCargando();
          } catch (e) {
            console.error(e);
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError(CONSTANTES.MensajeError.Sunat);

            this.formularioFG.disable();
            this.disableGuardar = true;
          }
          break;
      }
    }
  }

  soloNumeros(event): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  guardarFormulario(): void {
    if (this.formularioFG.invalid === true) {
      this.funcionesMtcService.mensajeError(
        'Debe ingresar todos los campos obligatorios'
      );
      return;
    }

    const dataGuardar = new Formulario003_28Request();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F003-28';
    dataGuardar.formularioId = 2;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.estado = 1;

    const { seccion1, seccion2, seccion3, seccion4, seccion5 } =
      dataGuardar.metaData;

    // SECCION 1:
    seccion1.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
    seccion1.descProcedimientoTupa = this.descProcedimientoTupa;
    // -------------------------------------
    // SECCION 2:
    seccion2.notificaCorreo = this.f_s2_notificaCorreoFC.value;
    // -------------------------------------
    // SECCION 3:
    seccion3.tipoSolicitante = this.tipoSolicitante;

    const { perNatural, perJuridica } = seccion3;
    perNatural.tipoDocumento.id = this.f_s3_pn_TipoDocumentoFC.value ?? '';
    perNatural.tipoDocumento.documento =
      this.listaTiposDocumentos.filter(
        (item) => item.id === this.f_s3_pn_TipoDocumentoFC.value
      )[0]?.documento ?? '';
    perNatural.numeroDocumento = this.f_s3_pn_NumeroDocumentoFC.value;
    perNatural.ruc = this.f_s3_pn_RucFC.value;
    perNatural.nombres = this.f_s3_pn_NombreFC.value;
    perNatural.apellidoPaterno = this.f_s3_pn_ApePaternoFC.value;
    perNatural.apellidoMaterno = this.f_s3_pn_ApeMaternoFC.value;
    perNatural.telefono = this.f_s3_pn_TelefonoFC.value;
    perNatural.celular = this.f_s3_pn_CelularFC.value;
    perNatural.email = this.f_s3_pn_CorreoFC.value;
    perNatural.domicilioLegal = this.f_s3_pn_DomicilioFC.value;
    perNatural.departamento =
      this.ubigeoPerNatComponent?.getDepartamentoText() ?? '';
    perNatural.provincia = this.ubigeoPerNatComponent?.getProvinciaText() ?? '';
    perNatural.distrito = this.ubigeoPerNatComponent?.getDistritoText() ?? '';

    const { discapacidad } = perNatural;
    discapacidad.resConadis = this.f_s3_pn_di_ResConadisFC.value;
    discapacidad.visual = this.f_s3_pn_di_VisualFC.value;
    discapacidad.auditiva = this.f_s3_pn_di_AuditivaFC.value;
    discapacidad.mental = this.f_s3_pn_di_MentalFC.value;
    discapacidad.fisica = this.f_s3_pn_di_FisicaFC.value;
    discapacidad.lenguaje = this.f_s3_pn_di_LenguajeFC.value;
    discapacidad.intelectual = this.f_s3_pn_di_IntelectualFC.value;
    discapacidad.multiple = this.f_s3_pn_di_MultipleFC.value;

    perJuridica.razonSocial = this.f_s3_pj_RazonSocialFC.value;
    perJuridica.ruc = this.f_s3_pj_RucFC.value;
    perJuridica.domicilioLegal = this.f_s3_pj_DomicilioFC.value;
    perJuridica.departamento = this.f_s3_pj_DepartamentoFC.value;
    perJuridica.provincia = this.f_s3_pj_ProvinciaFC.value;
    perJuridica.distrito = this.f_s3_pj_DistritoFC.value;

    const { representanteLegal } = perJuridica;
    representanteLegal.tipoDocumento.id =
      this.f_s3_pj_rl_TipoDocumentoFC.value ?? '';
    representanteLegal.tipoDocumento.documento =
      this.listaTiposDocumentos.filter(
        (item) => item.id === this.f_s3_pj_rl_TipoDocumentoFC.value
      )[0]?.documento ?? '';
    representanteLegal.numeroDocumento =
      this.f_s3_pj_rl_NumeroDocumentoFC.value;
    representanteLegal.nombres = this.f_s3_pj_rl_NombreFC.value;
    representanteLegal.apellidoPaterno = this.f_s3_pj_rl_ApePaternoFC.value;
    representanteLegal.apellidoMaterno = this.f_s3_pj_rl_ApeMaternoFC.value;
    representanteLegal.telefono = this.f_s3_pj_rl_TelefonoFC.value;
    representanteLegal.celular = this.f_s3_pj_rl_CelularFC.value;
    representanteLegal.email = this.f_s3_pj_rl_CorreoFC.value;
    representanteLegal.domicilioLegal = this.f_s3_pj_rl_DomicilioFC.value;
    representanteLegal.departamento =
      this.ubigeoRepLegComponent?.getDepartamentoText() ?? '';
    representanteLegal.provincia =
      this.ubigeoRepLegComponent?.getProvinciaText() ?? '';
    representanteLegal.distrito =
      this.ubigeoRepLegComponent?.getDistritoText() ?? '';
    representanteLegal.oficinaRegistral.id = this.f_s3_pj_rl_OficinaFC.value;
    representanteLegal.oficinaRegistral.descripcion =
      this.oficinasRegistral?.filter(
        (item) => item.value === this.f_s3_pj_rl_OficinaFC.value
      )[0]?.text ?? '';
    representanteLegal.partida = this.f_s3_pj_rl_PartidaFC.value;
    representanteLegal.asiento = this.f_s3_pj_rl_AsientoFC.value;
    representanteLegal.objetoSocial = this.f_s3_pj_rl_ObjSocialFC.value;
    representanteLegal.cargo = this.cargoRepresentanteLegal;
    // -------------------------------------
    // SECCION 4:
    seccion4.declaracion1 = this.f_s4_declaracion1FC.value;
    seccion4.declaracion2 = this.f_s4_declaracion2FC.value;
    // -------------------------------------
    // SECCION 5:
    seccion5.tipoDocumentoSolicitante =
      this.tipoSolicitante === 'PJ'
        ? this.f_s3_pj_rl_TipoDocumentoFC.value
        : this.f_s3_pn_TipoDocumentoFC.value;

    seccion5.nombreTipoDocumentoSolicitante =
      this.tipoSolicitante === 'PJ'
        ? this.listaTiposDocumentos.filter(
            (item) => item.id === this.f_s3_pj_rl_TipoDocumentoFC.value
          )[0]?.documento ?? ''
        : this.listaTiposDocumentos.filter(
            (item) => item.id === this.f_s3_pn_TipoDocumentoFC.value
          )[0]?.documento ?? '';

    seccion5.numeroDocumentoSolicitante =
      this.tipoSolicitante === 'PJ'
        ? this.f_s3_pj_rl_NumeroDocumentoFC.value
        : this.f_s3_pn_NumeroDocumentoFC.value;

    seccion5.nombresApellidosSolicitante =
      this.tipoSolicitante === 'PJ'
        ? this.f_s3_pj_rl_NombreFC.value +
          ' ' +
          this.f_s3_pj_rl_ApePaternoFC.value +
          ' ' +
          this.f_s3_pj_rl_ApeMaternoFC.value
        : this.f_s3_pn_NombreFC.value +
          ' ' +
          this.f_s3_pn_ApePaternoFC.value +
          ' ' +
          this.f_s3_pn_ApeMaternoFC.value;

    console.log('dataGuardar: ', dataGuardar);

    this.funcionesMtcService
      .mensajeConfirmar(
        `¿Está seguro de ${
          this.id === 0 ? 'guardar' : 'modificar'
        } los datos ingresados?`
      )
      .then(async () => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          // GUARDAR:
          try {
            const data = await this.formularioService
              .post(dataGuardar)
              .toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.id = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(
              'Los datos fueron guardados exitosamente '
            );
          } catch (e) {
            console.log(e);
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // Evalua anexos a actualizar
          const listarequisitos = this.dataRequisitosInput;
          let cadenaAnexos = '';
          for (const requisito of listarequisitos) {
            if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
              if (requisito.movId > 0) {
                const nombreAnexo = requisito.codigoFormAnexo.split('_');
                cadenaAnexos +=
                  nombreAnexo[0] +
                  ' ' +
                  nombreAnexo[1] +
                  '-' +
                  nombreAnexo[2] +
                  ' ';
              }
            }
          }
          if (cadenaAnexos.length > 0) {
            // ACTUALIZA FORMULARIO Y ANEXOS
            this.funcionesMtcService
              .mensajeConfirmar(
                'Deberá volver a grabar los anexos ' +
                  cadenaAnexos +
                  '¿Desea continuar?'
              )
              .then(async () => {
                this.funcionesMtcService.mostrarCargando();

                try {
                  const data = await this.formularioService
                    .put(dataGuardar)
                    .toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.id = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;
                  this.funcionesMtcService.ocultarCargando();
                  this.funcionesMtcService.mensajeOk(
                    `Los datos fueron modificados exitosamente`
                  );

                  for (const requisito of listarequisitos) {
                    if (
                      this.dataInput.tramiteReqId === requisito.tramiteReqRefId
                    ) {
                      if (requisito.movId > 0) {
                        console.log('Actualizando Anexos');
                        console.log(requisito.tramiteReqRefId);
                        console.log(requisito.movId);
                        // ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
                        try {
                          await this.formularioTramiteService
                            .uriArchivo<number>(requisito.movId)
                            .toPromise();
                        } catch (e) {
                          this.funcionesMtcService
                            .ocultarCargando()
                            .mensajeError(
                              'Problemas para realizar la modificación de los anexos'
                            );
                        }
                      }
                    }
                  }
                } catch (e) {
                  console.log(e);
                  this.funcionesMtcService
                    .ocultarCargando()
                    .mensajeError(
                      'Problemas para realizar la modificación de datos'
                    );
                }
              });
          } else {
            // actualiza formulario
            this.funcionesMtcService.mostrarCargando();
            try {
              const data = await this.formularioService
                .put(dataGuardar)
                .toPromise();
              this.funcionesMtcService.ocultarCargando();
              this.id = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;
              this.funcionesMtcService.ocultarCargando();
              this.funcionesMtcService.mensajeOk(
                `Los datos fueron modificados exitosamente`
              );
            } catch (e) {
              console.log(e);
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError(
                  'Problemas para realizar la modificación de datos'
                );
            }
          }
        }
      });
  }

  onClickNotificacion(): void {
    let correo = this.datosUsuarioLogin.correo;
    let msg =
      '<H3><b>MENSAJE</b></H3><br>Los actos derivados del presente procedimiento serán remitidas a su correo <b>' +
      correo +
      '</b> con el cual se afilió esta cuenta. <br>En caso sea un correo diferente, modifíquelo en la sección III del presente formulario';
    this.funcionesMtcService.mensajeHtml(msg);
  }

  async descargarPdf(): Promise<void> {
    // OK
    if (this.id === 0) {
      this.funcionesMtcService.mensajeError(
        'Debe guardar previamente los datos ingresados'
      );
      return;
    }

    if (!this.uriArchivo || this.uriArchivo === '' || this.uriArchivo == null) {
      this.funcionesMtcService.mensajeError(
        'No se logró ubicar el archivo PDF'
      );
      return;
    }

    this.funcionesMtcService.mostrarCargando();

    try {
      const file: Blob = await this.visorPdfArchivosService
        .get(this.uriArchivo)
        .toPromise();
      this.funcionesMtcService.ocultarCargando();

      const modalRef = this.modalService.open(VistaPdfComponent, {
        size: 'lg',
        scrollable: true,
      });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal =
        'Vista Previa - Formulario 003/28';
    } catch (e) {
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
      formControl.setValue(event.target.value.toUpperCase(), {
        emitEvent: false,
      });
      event.target.selectionEnd = position;
    }
  }
}
