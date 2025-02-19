/**
 * Formulario 001/04.02 utilizado por los procedimientos OACGD-001
 * @author André Bernabé Pérez
 * @version 1.0 10.03.2023
 */
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbAccordionDirective ,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import {
  exactLengthValidator,
  noWhitespaceValidator,
} from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { OficinaRegistralService } from '../../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { Formulario001_04_2Service } from '../../../application/usecases';
import { CONSTANTES } from 'src/app/enums/constants';
import { Formulario001_04_2Response } from '../../../domain/formulario001_04_2/formulario001_04_2Response';
import {
  Formulario001_04_2Request,
  MetaData,
} from '../../../domain/formulario001_04_2/formulario001_04_2Request';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmpPerNatJur') ubigeoPerNatJurComponent: UbigeoComponent;

  txtTitulo =
    'FORMULARIO 001/04.02 SOLICITUD DE ACCESO A LA INFORMACIÓN PÚBLICA';

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

  disableGuardar = true;

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
    private formularioService: Formulario001_04_2Service,
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

    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario

    console.log('dataInput: ', this.dataInput);

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    this.formularioFG = this.fb.group({
      f_Seccion1FG: this.fb.group({
        f_s1_UnidadOrgFC: [
          '',
          [noWhitespaceValidator(), Validators.maxLength(100)],
        ],
      }),
      f_Seccion2FG: this.fb.group({
        f_s2_PerNatJurFG: this.fb.group({
          f_s2_pnj_NombresFC: ['', [Validators.required]],
          f_s2_pnj_ApePaternoFC: ['', [Validators.required]],
          f_s2_pnj_ApeMaternoFC: [''],
          f_s2_pnj_RazonSocialFC: ['', [Validators.required]],
          f_s2_pnj_DomicilioFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(200),
            ],
          ],
          f_s2_pnj_DepartamentoFC: ['', [Validators.required]],
          f_s2_pnj_ProvinciaFC: ['', [Validators.required]],
          f_s2_pnj_DistritoFC: ['', [Validators.required]],
          f_s2_pnj_TipoDocumentoFC: ['', [Validators.required]],
          f_s2_pnj_NumeroDocumentoFC: ['', [Validators.required]],
          f_s2_pnj_TelefonoFC: ['', [Validators.maxLength(9)]],
          f_s2_pnj_CelularFC: [
            '',
            [Validators.required, exactLengthValidator([9])],
          ],
          f_s2_pnj_CorreoFC: [
            '',
            [
              Validators.required,
              Validators.email,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s2_RucFC:['']
        }),
        f_s2_RepLegalFG: this.fb.group({
          f_s2_rl_NombresFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(100),
            ],
          ],
          f_s2_rl_ApePaternoFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s2_rl_ApeMaternoFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(50),
            ],
          ],
          f_s2_rl_DomicilioFC: [
            '',
            [
              Validators.required,
              noWhitespaceValidator(),
              Validators.maxLength(200),
            ],
          ],
          f_s2_rl_TipoDocumentoFC: ['', [Validators.required]],
          f_s2_rl_NumeroDocumentoFC: ['', [Validators.required]], // at runtime maxlength
          f_s2_rl_OficinaFC: ['', [Validators.required]],
          f_s2_rl_PartidaFC: [
            '',
            [Validators.required, Validators.maxLength(15)],
          ],
        }),
      }),
      f_Seccion3FG: this.fb.group({
        f_s3_NotificaCorreoFC: ['', [Validators.required]],
      }),
      f_Seccion4FG: this.fb.group({
        f_s4_InfoSolicitaFC: [
          '',
          [Validators.required, Validators.maxLength(500)],
        ],
      }),
      f_Seccion5FG: this.fb.group({
        f_s5_formaEntregaFC: ['', [Validators.required]],
        f_s5_FormatoA0FC: [false],
        f_s5_FormatoA1FC: [false],
        f_s5_FormatoA2FC: [false],
      }),
      f_Seccion6FG: this.fb.group({
        f_s6_declaracion1FC: [false, [Validators.requiredTrue]],
      }),
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.cargarOficinaRegistral();

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName(); // nombre de usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc(); // nro de documento usuario login

    console.log('tipoDocumento: ', this.seguridadService.getNameId());

    // tipo de documento usuario login
    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.f_s2_pnj_TipoDocumentoFC.setValue('01'); // 01 DNI  03 CI  04 CE

        this.f_s2_pnj_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s2_pnj_NombresFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApePaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApeMaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_RazonSocialFC.disable({ emitEvent: false });

        this.f_s2_RepLegalFG.disable({ emitEvent: false });
        break;

      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        this.f_s2_pnj_TipoDocumentoFC.setValue('02'); // 01 DNI  03 CI  04 CE

        this.f_s2_pnj_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s2_pnj_NombresFC.disable({ emitEvent: false });
        this.f_s2_pnj_ApePaternoFC.disable({ emitEvent: false });
        this.f_s2_pnj_ApeMaternoFC.disable({ emitEvent: false });
        this.f_s2_pnj_RazonSocialFC.enable({ emitEvent: false });

        this.f_s2_RepLegalFG.enable({ emitEvent: false });
        break;

      case '00005':
        console.log(this.nroRuc);
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.f_s2_pnj_TipoDocumentoFC.setValue('01'); // 01 DNI  03 CI  04 CE
        this.f_s2_RucFC.setValue(this.nroRuc);

        this.f_s2_pnj_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s2_pnj_NombresFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApePaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApeMaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_RazonSocialFC.disable({ emitEvent: false });

        this.f_s2_RepLegalFG.disable({ emitEvent: false });
        break;

      case '00004' :

        this.tipoSolicitante = 'PE'; // persona extranjera
        this.f_s2_pnj_TipoDocumentoFC.setValue('04'); // 01 DNI  03 CI  04 CE

        this.f_s2_pnj_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s2_pnj_NombresFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApePaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApeMaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_RazonSocialFC.disable({ emitEvent: false });

        this.f_s2_RepLegalFG.disable({ emitEvent: false });
        
        /*this.nombreSolicitante = this.seguridadService.getUserName();



        switch(this.seguridadService.getTipoDocumento()){
          case "00003": this.tipoDocumentoSolicitante = "04";
                        this.nombreTipoDocumentoSolicitante = "CE";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNET DE EXTRANJERIA');
                        break;
          case "00101": this.tipoDocumentoSolicitante = "05";
                        this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ SOLICITANTE DE REFUGIO');
                        break;
          case "00102": this.tipoDocumentoSolicitante = "06";
                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA');
                        break;
          case "00103": this.tipoDocumentoSolicitante = "07";
                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ DE IDENTIFICACION');
                        break;
        }*/
        break;

      /*case '00103':
        this.tipoSolicitante = 'PN'; // persona natural
        this.f_s2_pnj_TipoDocumentoFC.setValue('03'); // 01 DNI  03 CI  04 CE

        this.f_s2_pnj_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s2_pnj_NombresFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApePaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_ApeMaternoFC.enable({ emitEvent: false });
        this.f_s2_pnj_RazonSocialFC.disable({ emitEvent: false });

        this.f_s2_RepLegalFG.disable({ emitEvent: false });
        break;*/
    }

    this.onChangeTipoDocumentoRepLeg();
    this.onChangeNumeroDocumentoRepLeg();
    this.onChangeNotificaCorreo();

    await this.cargarDatos();
  }

  // GET FORM formularioFG
  get f_Seccion1FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion1FG') as UntypedFormGroup;
  }
  get f_s1_UnidadOrgFC(): UntypedFormControl {
    return this.f_Seccion1FG.get('f_s1_UnidadOrgFC') as UntypedFormControl;
  }

  get f_Seccion2FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion2FG') as UntypedFormGroup;
  }
  get f_s2_PerNatJurFG(): UntypedFormGroup {
    return this.f_Seccion2FG.get(['f_s2_PerNatJurFG']) as UntypedFormGroup;
  }
  get f_s2_pnj_NombresFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_NombresFC') as UntypedFormControl;
  }
  get f_s2_pnj_ApePaternoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_ApePaternoFC') as UntypedFormControl;
  }
  get f_s2_pnj_ApeMaternoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_ApeMaternoFC') as UntypedFormControl;
  }
  get f_s2_pnj_RazonSocialFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_RazonSocialFC') as UntypedFormControl;
  }
  get f_s2_pnj_DomicilioFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_DomicilioFC') as UntypedFormControl;
  }
  get f_s2_pnj_DepartamentoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_DepartamentoFC') as UntypedFormControl;
  }
  get f_s2_pnj_ProvinciaFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_ProvinciaFC') as UntypedFormControl;
  }
  get f_s2_pnj_DistritoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_DistritoFC') as UntypedFormControl;
  }
  get f_s2_pnj_TipoDocumentoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_TipoDocumentoFC') as UntypedFormControl;
  }
  get f_s2_pnj_NumeroDocumentoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get(
      'f_s2_pnj_NumeroDocumentoFC'
    ) as UntypedFormControl;
  }

  get f_s2_RucFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_RucFC') as UntypedFormControl;
  }
  get f_s2_pnj_TelefonoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_TelefonoFC') as UntypedFormControl;
  }
  get f_s2_pnj_CelularFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_CelularFC') as UntypedFormControl;
  }
  get f_s2_pnj_CorreoFC(): UntypedFormControl {
    return this.f_s2_PerNatJurFG.get('f_s2_pnj_CorreoFC') as UntypedFormControl;
  }
  get f_s2_RepLegalFG(): UntypedFormGroup {
    return this.f_Seccion2FG.get(['f_s2_RepLegalFG']) as UntypedFormGroup;
  }
  get f_s2_rl_NombresFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_NombresFC') as UntypedFormControl;
  }
  get f_s2_rl_ApePaternoFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_ApePaternoFC') as UntypedFormControl;
  }
  get f_s2_rl_ApeMaternoFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_ApeMaternoFC') as UntypedFormControl;
  }
  get f_s2_rl_DomicilioFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_DomicilioFC') as UntypedFormControl;
  }
  get f_s2_rl_TipoDocumentoFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_TipoDocumentoFC') as UntypedFormControl;
  }
  get f_s2_rl_NumeroDocumentoFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_NumeroDocumentoFC') as UntypedFormControl;
  }
  get f_s2_rl_OficinaFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_OficinaFC') as UntypedFormControl;
  }
  get f_s2_rl_PartidaFC(): UntypedFormControl {
    return this.f_s2_RepLegalFG.get('f_s2_rl_PartidaFC') as UntypedFormControl;
  }

  get f_Seccion3FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup;
  }
  get f_s3_NotificaCorreoFC(): UntypedFormControl {
    return this.f_Seccion3FG.get('f_s3_NotificaCorreoFC') as UntypedFormControl;
  }

  get f_Seccion4FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion4FG') as UntypedFormGroup;
  }
  get f_s4_InfoSolicitaFC(): UntypedFormControl {
    return this.f_Seccion4FG.get('f_s4_InfoSolicitaFC') as UntypedFormControl;
  }

  get f_Seccion5FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion5FG') as UntypedFormGroup;
  }
  get f_s5_formaEntregaFC(): UntypedFormControl {
    return this.f_Seccion5FG.get('f_s5_formaEntregaFC') as UntypedFormControl;
  }
  get f_s5_FormatoA0FC(): UntypedFormControl {
    return this.f_Seccion5FG.get('f_s5_FormatoA0FC') as UntypedFormControl;
  }
  get f_s5_FormatoA1FC(): UntypedFormControl {
    return this.f_Seccion5FG.get('f_s5_FormatoA1FC') as UntypedFormControl;
  }
  get f_s5_FormatoA2FC(): UntypedFormControl {
    return this.f_Seccion5FG.get('f_s5_FormatoA2FC') as UntypedFormControl;
  }

  get f_Seccion6FG(): UntypedFormGroup {
    return this.formularioFG.get('f_Seccion6FG') as UntypedFormGroup;
  }
  get f_s6_declaracion1FC(): UntypedFormControl {
    return this.f_Seccion6FG.get('f_s6_declaracion1FC') as UntypedFormControl;
  }
  // FIN GET FORM formularioFG

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

  onChangeTipoDocumentoRepLeg(): void {
    this.f_s2_rl_TipoDocumentoFC.valueChanges.subscribe(
      (tipoDocumento: string) => {
        console.log('SE CAMBIO EL TIPO DE DOCUMENTO: ', tipoDocumento);

        if (tipoDocumento?.trim() === '04') {
          // Carnet de Extranjeria
          this.f_s2_rl_ApeMaternoFC.setValidators([
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ]);

          this.f_s2_rl_NumeroDocumentoFC.setValidators([
            Validators.required,
            exactLengthValidator([9]),
          ]);
        } else {
          this.f_s2_rl_ApeMaternoFC.setValidators([
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ]);

          this.f_s2_rl_NumeroDocumentoFC.setValidators([
            Validators.required,
            exactLengthValidator([8]),
          ]);
        }

        this.f_s2_rl_ApeMaternoFC.updateValueAndValidity({
          emitEvent: false,
        });
        this.f_s2_rl_NumeroDocumentoFC.updateValueAndValidity({
          emitEvent: false,
        });

        this.f_s2_rl_NumeroDocumentoFC.reset('', { emitEvent: false });
        this.f_s2_rl_NombresFC.reset('', { emitEvent: false });
        this.f_s2_rl_ApePaternoFC.reset('', { emitEvent: false });
        this.f_s2_rl_ApeMaternoFC.reset('', { emitEvent: false });
        this.f_s2_rl_DomicilioFC.reset('', { emitEvent: false });
      }
    );
  }

  onChangeNumeroDocumentoRepLeg(): void {
    this.f_s2_rl_NumeroDocumentoFC.valueChanges.subscribe(
      (numeroDoc: string) => {
        console.log('SE CAMBIO EL NUMERO DE DOCUMENTO: ', numeroDoc);
        this.f_s2_rl_NombresFC.reset('', { emitEvent: false });
        this.f_s2_rl_ApePaternoFC.reset('', { emitEvent: false });
        this.f_s2_rl_ApeMaternoFC.reset('', { emitEvent: false });
        this.f_s2_rl_DomicilioFC.reset('', { emitEvent: false });
      }
    );
  }

  onChangeNotificaCorreo(): void {
    this.f_s3_NotificaCorreoFC.valueChanges.subscribe((notifica: string) => {
      if (notifica === '1') {
        this.f_s5_formaEntregaFC.setValue('3');
        this.f_s5_formaEntregaFC.disable();
      } else {
        this.f_s5_formaEntregaFC.enable();
      }
    });
  }

  async buscarNumeroDocumentoPerNat(cargarDatos = false): Promise<void> {
    const tipoDocumento: string = this.f_s2_pnj_TipoDocumentoFC.value.trim();
    const numeroDocumento: string =
      this.f_s2_pnj_NumeroDocumentoFC.value.trim();

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
      this.f_s2_pnj_NombresFC.setValue(nombres);
      this.f_s2_pnj_ApePaternoFC.setValue(apPaterno);
      this.f_s2_pnj_ApeMaternoFC.setValue(apMaterno);
      this.f_s2_pnj_DomicilioFC.setValue(direccion);

      await this.ubigeoPerNatJurComponent?.setUbigeoByText(
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
          this.f_s2_pnj_NombresFC.setValue(nombres);
          this.f_s2_pnj_ApePaternoFC.setValue(apPaterno);
          this.f_s2_pnj_ApeMaternoFC.setValue(apMaterno);
          this.f_s2_pnj_DomicilioFC.setValue(direccion);

          await this.ubigeoPerNatJurComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito
          );
        });
    }
  }

  async buscarNumeroDocumentoRepLeg(cargarDatos = false): Promise<void> {
    const tipoDocumento: string = this.f_s2_rl_TipoDocumentoFC.value.trim();
    const numeroDocumento: string = this.f_s2_rl_NumeroDocumentoFC.value.trim();

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

          const { prenombres, apPrimer, apSegundo, direccion } =
            respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

          this.setRepLegal(
            tipoDocumento,
            prenombres,
            apPrimer,
            apSegundo,
            direccion,
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
    cargarDatos = false
  ): Promise<void> {
    if (cargarDatos) {
      this.f_s2_rl_NombresFC.setValue(nombres);
      this.f_s2_rl_ApePaternoFC.setValue(apPaterno);
      this.f_s2_rl_ApeMaternoFC.setValue(apMaterno);
      this.f_s2_rl_DomicilioFC.setValue(direccion);
    } else {
      this.funcionesMtcService
        .mensajeConfirmar(
          `Los datos ingresados fueron validados por ${
            tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'
          } corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`
        )
        .then(async () => {
          this.f_s2_rl_NombresFC.setValue(nombres);
          this.f_s2_rl_ApePaternoFC.setValue(apPaterno);
          this.f_s2_rl_ApeMaternoFC.setValue(apMaterno);
          this.f_s2_rl_DomicilioFC.setValue(direccion);
        });
    }
  }

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput != null && this.dataInput.movId > 0) {
      try {
        const dataFormulario = await this.formularioTramiteService
          .get<Formulario001_04_2Response>(this.dataInput.tramiteReqId)
          .toPromise();

        this.funcionesMtcService.ocultarCargando();
        console.log(JSON.parse(dataFormulario.metaData));

        const {
          seccion1,
          seccion2,
          seccion3,
          seccion4,
          seccion5,
          seccion6,
          seccion7,
        } = JSON.parse(dataFormulario.metaData) as MetaData;

        this.id = dataFormulario.formularioId;

        if (this.f_Seccion1FG.enabled) {
          this.f_s1_UnidadOrgFC.setValue(seccion1.unidadOrg);
        }

        if (this.f_Seccion2FG.enabled) {
          if (this.f_s2_PerNatJurFG.enabled) {
            this.f_s2_pnj_NombresFC.setValue(seccion2.nombres);
            this.f_s2_pnj_ApePaternoFC.setValue(seccion2.apellidoPaterno);
            this.f_s2_pnj_ApeMaternoFC.setValue(seccion2.apellidoMaterno);
            this.f_s2_pnj_RazonSocialFC.setValue(seccion2.razonSocial);
            this.f_s2_pnj_DomicilioFC.setValue(seccion2.domicilioLegal);

            if(this.tipoSolicitante === 'PNR'){
              this.f_s2_RucFC.setValue(seccion2.ruc);
            }

            if (this.tipoSolicitante === 'PJ') {
              this.f_s2_pnj_DepartamentoFC.setValue(seccion2.departamento);
              this.f_s2_pnj_ProvinciaFC.setValue(seccion2.provincia);
              this.f_s2_pnj_DistritoFC.setValue(seccion2.distrito);
            } else {
              await this.ubigeoPerNatJurComponent?.setUbigeoByText(
                seccion2.departamento,
                seccion2.provincia,
                seccion2.distrito
              );
            }
            this.f_s2_pnj_TipoDocumentoFC.setValue(seccion2.tipoDocumento?.id);
            this.f_s2_pnj_NumeroDocumentoFC.setValue(seccion2.numeroDocumento);
            this.f_s2_pnj_TelefonoFC.setValue(seccion2.telefono);
            this.f_s2_pnj_CelularFC.setValue(seccion2.celular);
            this.f_s2_pnj_CorreoFC.setValue(seccion2.email);
          }
          if (this.f_s2_RepLegalFG.enabled) {
            const { representanteLegal } = seccion2;
            this.f_s2_rl_NombresFC.setValue(representanteLegal?.nombres);
            this.f_s2_rl_ApePaternoFC.setValue(
              representanteLegal?.apellidoPaterno
            );
            this.f_s2_rl_ApeMaternoFC.setValue(
              representanteLegal?.apellidoMaterno
            );
            this.f_s2_rl_DomicilioFC.setValue(
              representanteLegal?.domicilioLegal
            );
            this.f_s2_rl_TipoDocumentoFC.setValue(
              representanteLegal?.tipoDocumento.id,
              { emitEvent: false }
            );
            this.f_s2_rl_NumeroDocumentoFC.setValue(
              representanteLegal?.numeroDocumento,
              { emitEvent: false }
            );
            this.f_s2_rl_OficinaFC.setValue(
              representanteLegal?.oficinaRegistral.id
            );
            this.f_s2_rl_PartidaFC.setValue(representanteLegal?.partida);
          }
        }

        if (this.f_Seccion3FG.enabled) {
          this.f_s3_NotificaCorreoFC.setValue(
            seccion3.notificaCorreo ? '1' : '0'
          );
        }

        if (this.f_Seccion4FG.enabled) {
          this.f_s4_InfoSolicitaFC.setValue(seccion4.infoSolicita);
        }

        if (this.f_Seccion5FG.enabled) {
          this.f_s5_formaEntregaFC.setValue(seccion5.formaEntrega?.toString());
          this.f_s5_FormatoA0FC.setValue(seccion5.formatoA0);
          this.f_s5_FormatoA1FC.setValue(seccion5.formatoA1);
          this.f_s5_FormatoA2FC.setValue(seccion5.formatoA2);
        }

        if (this.f_Seccion6FG.enabled) {
          this.f_s6_declaracion1FC.setValue(seccion6.declaracion_1);
        }
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados');
      }
    } else {
      // NO HAY DATOS GUARDADOS
      if (
        this.tipoSolicitante === 'PN' ||
        this.tipoSolicitante === 'PE' ||
        this.tipoSolicitante === 'PNR' 
      ) {
        this.f_s2_pnj_NumeroDocumentoFC.setValue(this.nroDocumentoLogin);
        await this.buscarNumeroDocumentoPerNat(true);
        this.f_s2_pnj_TipoDocumentoFC.disable({ emitEvent: false });
        this.f_s2_pnj_NumeroDocumentoFC.disable({ emitEvent: false });

        this.f_s2_pnj_CorreoFC.setValue(this.datosUsuarioLogin.correo);
        this.f_s2_pnj_CelularFC.setValue(this.datosUsuarioLogin.celular);

        if(this.tipoSolicitante == "PNR"){
          this.f_s2_RucFC.setValue(this.nroRuc);
        }
      }
      if (this.tipoSolicitante === 'PJ') {
        try {
          this.funcionesMtcService.mostrarCargando();
          const response = await this.sunatService
            .getDatosPrincipales(this.nroRuc)
            .toPromise();
          console.log('SUNAT: ', response);
          this.f_s2_pnj_RazonSocialFC.setValue(response.razonSocial.trim());
          this.f_s2_pnj_NumeroDocumentoFC.setValue(
            response.nroDocumento.trim()
          );
          this.f_s2_pnj_DomicilioFC.setValue(response.domicilioLegal.trim());

          // await this.ubigeoPerJurComponent?.setUbigeoByText(
          //   response.nombreDepartamento.trim(),
          //   response.nombreProvincia.trim(),
          //   response.nombreDistrito.trim());

          this.f_s2_pnj_DepartamentoFC.setValue(
            response.nombreDepartamento.trim()
          );
          this.f_s2_pnj_ProvinciaFC.setValue(response.nombreProvincia.trim());
          this.f_s2_pnj_DistritoFC.setValue(response.nombreDistrito.trim());

          this.f_s2_pnj_TelefonoFC.setValue(response.telefono.trim());
          this.f_s2_pnj_CelularFC.setValue(response.celular.trim());
          this.f_s2_pnj_CorreoFC.setValue(response.correo.trim());

          this.representanteLegal = response.representanteLegal;

          // Cargamos el Representante Legal
          for (const repLegal of this.representanteLegal) {
            if (repLegal.nroDocumento === this.nroDocumentoLogin) {
              if (repLegal.tipoDocumento === '1') {
                // DNI
                this.f_s2_rl_TipoDocumentoFC.setValue('01', {
                  emitEvent: false,
                });

                this.f_s2_rl_ApeMaternoFC.setValidators([
                  Validators.required,
                  noWhitespaceValidator(),
                  Validators.maxLength(50),
                ]);
                this.f_s2_rl_NumeroDocumentoFC.setValidators([
                  Validators.required,
                  exactLengthValidator([8]),
                ]);
                // this.maxLengthNumeroDocumentoRepLeg = 8;
                this.showNroDocCEPerNat = false;
                // this.f_s2_rl_DepartamentoFC.enable({ emitEvent: false });
                // this.f_s2_rl_ProvinciaFC.enable({ emitEvent: false });
                // this.f_s2_rl_DistritoFC.enable({ emitEvent: false });

                this.f_s2_rl_NumeroDocumentoFC.setValue(repLegal.nroDocumento, {
                  emitEvent: false,
                });
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
    console.log(this.ubigeoPerNatJurComponent?.getDistritoText());
    const dataGuardar = new Formulario001_04_2Request();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F001-04-2';
    dataGuardar.formularioId = 4;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.estado = 1;

    const {
      seccion1,
      seccion2,
      seccion3,
      seccion4,
      seccion5,
      seccion6,
      seccion7,
    } = dataGuardar.metaData;

    seccion1.unidadOrg = this.f_s1_UnidadOrgFC.value;

    seccion2.tipoSolicitante = this.tipoSolicitante;

    seccion2.tipoDocumento.id = this.f_s2_pnj_TipoDocumentoFC.value ?? '';
    seccion2.tipoDocumento.documento =
      this.listaTiposDocumentos.filter(
        (item) => item.id === this.f_s2_pnj_TipoDocumentoFC.value
      )[0]?.documento ?? '';
    seccion2.numeroDocumento = this.f_s2_pnj_NumeroDocumentoFC.value;
    seccion2.nombres = this.f_s2_pnj_NombresFC.value;
    seccion2.apellidoPaterno = this.f_s2_pnj_ApePaternoFC.value;
    seccion2.apellidoMaterno = this.f_s2_pnj_ApeMaternoFC.value;
    seccion2.razonSocial = this.f_s2_pnj_RazonSocialFC.value;
    seccion2.domicilioLegal = this.f_s2_pnj_DomicilioFC.value;
    seccion2.ruc = this.f_s2_RucFC.value ?? '';
    seccion2.departamento =
      this.tipoSolicitante === 'PJ'
        ? this.f_s2_pnj_DepartamentoFC.value
        : this.ubigeoPerNatJurComponent?.getDepartamentoText() ?? '';
    seccion2.provincia =
      this.tipoSolicitante === 'PJ'
        ? this.f_s2_pnj_ProvinciaFC.value
        : this.ubigeoPerNatJurComponent?.getProvinciaText() ?? '';
    seccion2.distrito =
      this.tipoSolicitante === 'PJ'
        ? this.f_s2_pnj_DistritoFC.value
        : this.ubigeoPerNatJurComponent?.getDistritoText() ?? '';
    seccion2.telefono = this.f_s2_pnj_TelefonoFC.value;
    seccion2.celular = this.f_s2_pnj_CelularFC.value;
    seccion2.email = this.f_s2_pnj_CorreoFC.value;

    const { representanteLegal } = seccion2;
    representanteLegal.tipoDocumento.id =
      this.f_s2_rl_TipoDocumentoFC.value ?? '';
    representanteLegal.tipoDocumento.documento =
      this.listaTiposDocumentos.filter(
        (item) => item.id === this.f_s2_rl_TipoDocumentoFC.value
      )[0]?.documento ?? '';
    representanteLegal.numeroDocumento = this.f_s2_rl_NumeroDocumentoFC.value;
    representanteLegal.nombres = this.f_s2_rl_NombresFC.value;
    representanteLegal.apellidoPaterno = this.f_s2_rl_ApePaternoFC.value;
    representanteLegal.apellidoMaterno = this.f_s2_rl_ApeMaternoFC.value;
    representanteLegal.domicilioLegal = this.f_s2_rl_DomicilioFC.value;
    representanteLegal.oficinaRegistral.id = this.f_s2_rl_OficinaFC.value;
    representanteLegal.oficinaRegistral.descripcion =
      this.oficinasRegistral?.filter(
        (item) => item.value === this.f_s2_rl_OficinaFC.value
      )[0]?.text ?? '';
    representanteLegal.partida = this.f_s2_rl_PartidaFC.value;

    seccion3.notificaCorreo = this.f_s3_NotificaCorreoFC.value === '1';

    seccion4.infoSolicita = this.f_s4_InfoSolicitaFC.value;

    seccion5.formaEntrega = Number(this.f_s5_formaEntregaFC.value) ?? null;
    seccion5.formatoA0 = this.f_s5_FormatoA0FC.value;
    seccion5.formatoA1 = this.f_s5_FormatoA1FC.value;
    seccion5.formatoA2 = this.f_s5_FormatoA2FC.value;

    seccion6.declaracion_1 = this.f_s6_declaracion1FC.value;

    seccion7.dni =
      this.tipoSolicitante === 'PJ'
        ? this.f_s2_rl_NumeroDocumentoFC.value
        : this.f_s2_pnj_NumeroDocumentoFC.value;
    seccion7.nombre =
      this.tipoSolicitante === 'PJ'
        ? this.f_s2_rl_NombresFC.value +
          ' ' +
          this.f_s2_rl_ApePaternoFC.value +
          ' ' +
          this.f_s2_rl_ApeMaternoFC.value
        : this.f_s2_pnj_NombresFC.value +
          ' ' +
          this.f_s2_pnj_ApePaternoFC.value +
          ' ' +
          this.f_s2_pnj_ApeMaternoFC.value;

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
        'Vista Previa - Formulario 001/04.02';
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
