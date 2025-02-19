/**
 * Formulario 001/28
 * @author André Bernabé Pérez
 * @version 1.0 21.04.2022
 */

import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo001_E28NTResponse } from '../../../../../core/models/Anexos/Anexo001_E28NT/Anexo001_E28NTResponse';
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_E28NT/MetaData';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { Anexo001_E28NTRequest } from 'src/app/core/models/Anexos/Anexo001_E28NT/Anexo001_E28NTRequest';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Anexo001E28NTService } from 'src/app/core/services/anexos/anexo001-e28NT.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo001_e28',
  templateUrl: './anexo001_e28nt.component.html',
  styleUrls: ['./anexo001_e28nt.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo001_e28nt_Component implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;

  txtTitulo = 'ANEXO 001-E/28 MODIFICACIÓN DE CARACTERÍSTICAS TÉCNICAS';

  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFG: UntypedFormGroup;

  tipoSolicitante: string;

  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  tipoDocumento = '';
  nroDocumento = '';
  nroRuc = '';
  nombreCompleto = '';
  razonSocial = '';


  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001E28NTService,
    private seguridadService: SeguridadService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService
  ) { }

  ngOnInit(): void {
    // ==================================================================================
    // RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    // ==================================================================================

    this.uriArchivo = this.dataInput.rutaDocumento;

    this.anexoFG = this.fb.group({
      a_Seccion0FG: this.fb.group(
        {
          a_s0_CambioUbicaFC: [false],
          a_s0_AmpliaFrecFC: [false],
          a_s0_CambioFrecFC: [false],
          a_s0_CancelaFrecFC: [false],
          a_s0_AmpliaHoraFC: [false],
          a_s0_CambioHoraFC: [false],
          a_s0_CancelaHoraFC: [false],
          a_s0_OtrosFC: [false],
        }, {
          validators: [
            requireCheckboxesToBeCheckedValidator()
          ],
        } as AbstractControlOptions
      ),
      a_Seccion1FG: this.fb.group({
        a_s1_IndicativoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        a_s1_UbicacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        a_s1_FrecOperaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        a_s1_HoraOperaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
      }),
      a_Seccion2FG: this.fb.group({
        a_s2_EstaFijaFG: this.fb.group({
          a_s2_ef_UbicacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          a_s2_ef_DepartamentoFC: ['', [Validators.required]],
          a_s2_ef_ProvinciaFC: ['', [Validators.required]],
          a_s2_ef_DistritoFC: ['', [Validators.required]],
          a_s2_ef_LOGraFC: ['', [Validators.required, Validators.max(90)]],
          a_s2_ef_LOMinFC: ['', [Validators.required, Validators.max(59)]],
          a_s2_ef_LOSegFC: ['', [Validators.required, Validators.max(59)]],
          a_s2_ef_LSGraFC: ['', [Validators.required, Validators.max(90)]],
          a_s2_ef_LSMinFC: ['', [Validators.required, Validators.max(59)]],
          a_s2_ef_LSSegFC: ['', [Validators.required, Validators.max(59)]],
        }),
        a_s2_EstaMovilFG: this.fb.group({
          a_s2_em_PortZonaOperFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
          a_s2_em_VehiZonaOperFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
          a_s2_em_EmbarMatriFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
          a_s2_em_AeroMatriFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
        }),
      }),
      a_Seccion3FG: this.fb.group({
        a_s3_AmpliaFrecFG: this.fb.group({
          a_s3_af_FrecAdicionaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
          a_s3_af_HoraOperaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
        }),
        a_s3_CambioFrecFG: this.fb.group({
          a_s3_cf_FrecCambioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
          a_s3_cf_NuevaFrecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
        }),
        a_s3_CancelaFrecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
      }),
      a_Seccion4FG: this.fb.group({
        a_s4_AmpliaHoraFG: this.fb.group({
          a_s4_ah_HoraAdicionaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
          a_s4_ah_FrecuenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
        }),
        a_s4_CambioHoraFG: this.fb.group({
          a_s4_ch_HoraCambioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
          a_s4_ch_NuevaHoraFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4_ch_FrecuenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
        }),
        a_s4_CancelaHoraFG: this.fb.group({
          a_s4_cah_HoraCancelaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
          a_s4_cah_FrecuenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
        }),
      }),
      a_Seccion5FG: this.fb.group({
        a_s5_IndicaModifFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s5_CaracActualFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s5_NuevaCaracFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
      }),
      a_Seccion6FG: this.fb.group({
        a_s6_declaracion1FC: [false, [Validators.requiredTrue]],
      })
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.nombreCompleto = this.seguridadService.getUserName();          // nombre de usuario login
    this.nroDocumento = this.seguridadService.getNumDoc();      // nro de documento usuario login

    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.tipoDocumento = '01';  // 01 DNI  03 CI  04 CE

        break;
      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        break;
      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.tipoDocumento = '04';  // 01 DNI  03 CI  04 CE
        break;
      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.tipoDocumento = '01';  // 01 DNI  03 CI  04 CE
        break;
    }

    this.a_Seccion2FG.disable({ emitEvent: false });
    this.a_s3_AmpliaFrecFG.disable({ emitEvent: false });
    this.a_s3_CambioFrecFG.disable({ emitEvent: false });
    this.a_s3_CancelaFrecFC.disable({ emitEvent: false });
    this.a_s4_AmpliaHoraFG.disable({ emitEvent: false });
    this.a_s4_CambioHoraFG.disable({ emitEvent: false });
    this.a_s4_CancelaHoraFG.disable({ emitEvent: false });
    this.a_Seccion5FG.disable({ emitEvent: false });

    this.onChangeCambioUbic();
    this.onChangeAmpliaFrec();
    this.onChangeCambioFrec();
    this.onChangeCancelaFrec();
    this.onChangeAmpliaHora();
    this.onChangeCambioHora();
    this.onChangeCancelaHora();
    this.onChangeOtros();

    await this.cargarDatos();
  }

  // GET FORM anexoFG
  get a_Seccion0FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion0FG') as UntypedFormGroup; }
  get a_s0_CambioUbicaFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_CambioUbicaFC') as UntypedFormControl; }
  get a_s0_AmpliaFrecFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_AmpliaFrecFC') as UntypedFormControl; }
  get a_s0_CambioFrecFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_CambioFrecFC') as UntypedFormControl; }
  get a_s0_CancelaFrecFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_CancelaFrecFC') as UntypedFormControl; }
  get a_s0_AmpliaHoraFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_AmpliaHoraFC') as UntypedFormControl; }
  get a_s0_CambioHoraFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_CambioHoraFC') as UntypedFormControl; }
  get a_s0_CancelaHoraFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_CancelaHoraFC') as UntypedFormControl; }
  get a_s0_OtrosFC(): UntypedFormControl { return this.a_Seccion0FG.get('a_s0_OtrosFC') as UntypedFormControl; }
  get a_Seccion1FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1FG') as UntypedFormGroup; }
  get a_s1_IndicativoFC(): UntypedFormControl { return this.a_Seccion1FG.get('a_s1_IndicativoFC') as UntypedFormControl; }
  get a_s1_UbicacionFC(): UntypedFormControl { return this.a_Seccion1FG.get('a_s1_UbicacionFC') as UntypedFormControl; }
  get a_s1_FrecOperaFC(): UntypedFormControl { return this.a_Seccion1FG.get('a_s1_FrecOperaFC') as UntypedFormControl; }
  get a_s1_HoraOperaFC(): UntypedFormControl { return this.a_Seccion1FG.get('a_s1_HoraOperaFC') as UntypedFormControl; }
  get a_Seccion2FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup; }
  get a_s2_EstaFijaFG(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_EstaFijaFG') as UntypedFormGroup; }
  get a_s2_ef_UbicacionFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_UbicacionFC') as UntypedFormControl; }
  get a_s2_ef_DepartamentoFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_DepartamentoFC') as UntypedFormControl; }
  get a_s2_ef_ProvinciaFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_ProvinciaFC') as UntypedFormControl; }
  get a_s2_ef_DistritoFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_DistritoFC') as UntypedFormControl; }
  get a_s2_ef_LOGraFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_LOGraFC') as UntypedFormControl; }
  get a_s2_ef_LOMinFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_LOMinFC') as UntypedFormControl; }
  get a_s2_ef_LOSegFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_LOSegFC') as UntypedFormControl; }
  get a_s2_ef_LSGraFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_LSGraFC') as UntypedFormControl; }
  get a_s2_ef_LSMinFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_LSMinFC') as UntypedFormControl; }
  get a_s2_ef_LSSegFC(): UntypedFormControl { return this.a_s2_EstaFijaFG.get('a_s2_ef_LSSegFC') as UntypedFormControl; }
  get a_s2_EstaMovilFG(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_EstaMovilFG') as UntypedFormGroup; }
  get a_s2_em_PortZonaOperFC(): UntypedFormControl { return this.a_s2_EstaMovilFG.get('a_s2_em_PortZonaOperFC') as UntypedFormControl; }
  get a_s2_em_VehiZonaOperFC(): UntypedFormControl { return this.a_s2_EstaMovilFG.get('a_s2_em_VehiZonaOperFC') as UntypedFormControl; }
  get a_s2_em_EmbarMatriFC(): UntypedFormControl { return this.a_s2_EstaMovilFG.get('a_s2_em_EmbarMatriFC') as UntypedFormControl; }
  get a_s2_em_AeroMatriFC(): UntypedFormControl { return this.a_s2_EstaMovilFG.get('a_s2_em_AeroMatriFC') as UntypedFormControl; }
  get a_Seccion3FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3FG') as UntypedFormGroup; }
  get a_s3_AmpliaFrecFG(): UntypedFormGroup { return this.a_Seccion3FG.get('a_s3_AmpliaFrecFG') as UntypedFormGroup; }
  get a_s3_af_FrecAdicionaFC(): UntypedFormControl { return this.a_s3_AmpliaFrecFG.get('a_s3_af_FrecAdicionaFC') as UntypedFormControl; }
  get a_s3_af_HoraOperaFC(): UntypedFormControl { return this.a_s3_AmpliaFrecFG.get('a_s3_af_HoraOperaFC') as UntypedFormControl; }
  get a_s3_CambioFrecFG(): UntypedFormGroup { return this.a_Seccion3FG.get('a_s3_CambioFrecFG') as UntypedFormGroup; }
  get a_s3_cf_FrecCambioFC(): UntypedFormControl { return this.a_s3_CambioFrecFG.get('a_s3_cf_FrecCambioFC') as UntypedFormControl; }
  get a_s3_cf_NuevaFrecFC(): UntypedFormControl { return this.a_s3_CambioFrecFG.get('a_s3_cf_NuevaFrecFC') as UntypedFormControl; }
  get a_s3_CancelaFrecFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_CancelaFrecFC') as UntypedFormControl; }
  get a_Seccion4FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion4FG') as UntypedFormGroup; }
  get a_s4_AmpliaHoraFG(): UntypedFormGroup { return this.a_Seccion4FG.get('a_s4_AmpliaHoraFG') as UntypedFormGroup; }
  get a_s4_ah_HoraAdicionaFC(): UntypedFormControl { return this.a_s4_AmpliaHoraFG.get('a_s4_ah_HoraAdicionaFC') as UntypedFormControl; }
  get a_s4_ah_FrecuenciaFC(): UntypedFormControl { return this.a_s4_AmpliaHoraFG.get('a_s4_ah_FrecuenciaFC') as UntypedFormControl; }
  get a_s4_CambioHoraFG(): UntypedFormGroup { return this.a_Seccion4FG.get('a_s4_CambioHoraFG') as UntypedFormGroup; }
  get a_s4_ch_HoraCambioFC(): UntypedFormControl { return this.a_s4_CambioHoraFG.get('a_s4_ch_HoraCambioFC') as UntypedFormControl; }
  get a_s4_ch_NuevaHoraFC(): UntypedFormControl { return this.a_s4_CambioHoraFG.get('a_s4_ch_NuevaHoraFC') as UntypedFormControl; }
  get a_s4_ch_FrecuenciaFC(): UntypedFormControl { return this.a_s4_CambioHoraFG.get('a_s4_ch_FrecuenciaFC') as UntypedFormControl; }
  get a_s4_CancelaHoraFG(): UntypedFormGroup { return this.a_Seccion4FG.get('a_s4_CancelaHoraFG') as UntypedFormGroup; }
  get a_s4_cah_HoraCancelaFC(): UntypedFormControl { return this.a_s4_CancelaHoraFG.get('a_s4_cah_HoraCancelaFC') as UntypedFormControl; }
  get a_s4_cah_FrecuenciaFC(): UntypedFormControl { return this.a_s4_CancelaHoraFG.get('a_s4_cah_FrecuenciaFC') as UntypedFormControl; }
  get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
  get a_s5_IndicaModifFC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_IndicaModifFC') as UntypedFormControl; }
  get a_s5_CaracActualFC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_CaracActualFC') as UntypedFormControl; }
  get a_s5_NuevaCaracFC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_NuevaCaracFC') as UntypedFormControl; }
  get a_Seccion6FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion6FG') as UntypedFormGroup; }
  get a_s6_declaracion1FC(): UntypedFormControl { return this.a_Seccion6FG.get('a_s6_declaracion1FC') as UntypedFormControl; }
  // FIN GET FORM anexoFG

  onChangeCambioUbic(): void {
    this.a_s0_CambioUbicaFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_Seccion2FG.enable({ emitEvent: false });
      }
      else {
        this.a_Seccion2FG.disable({ emitEvent: false });
      }
      this.a_Seccion2FG.reset({ emitEvent: false });
    });
  }

  onChangeAmpliaFrec(): void {
    this.a_s0_AmpliaFrecFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_s3_AmpliaFrecFG.enable({ emitEvent: false });
      }
      else {
        this.a_s3_AmpliaFrecFG.disable({ emitEvent: false });
      } 
      this.a_s3_AmpliaFrecFG.reset({ emitEvent: false });
    });
  }

  onChangeCambioFrec(): void {
    this.a_s0_CambioFrecFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_s3_CambioFrecFG.enable({ emitEvent: false });
      }
      else {
        this.a_s3_CambioFrecFG.disable({ emitEvent: false });
      }
      this.a_s3_CambioFrecFG.reset({ emitEvent: false });
    });
  }

  onChangeCancelaFrec(): void {
    this.a_s0_CancelaFrecFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_s3_CancelaFrecFC.enable({ emitEvent: false });
      }
      else {
        this.a_s3_CancelaFrecFC.disable({ emitEvent: false });
      }
      this.a_s3_CancelaFrecFC.reset('', { emitEvent: false });
    });
  }

  onChangeAmpliaHora(): void {
    this.a_s0_AmpliaHoraFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_s4_AmpliaHoraFG.enable({ emitEvent: false });
      }
      else {
        this.a_s4_AmpliaHoraFG.disable({ emitEvent: false });
      }
      this.a_s4_AmpliaHoraFG.reset({ emitEvent: false });
    });
  }

  onChangeCambioHora(): void {
    this.a_s0_CambioHoraFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_s4_CambioHoraFG.enable({ emitEvent: false });
      }
      else {
        this.a_s4_CambioHoraFG.disable({ emitEvent: false });
      }
      this.a_s4_CambioHoraFG.reset({ emitEvent: false });
    });
  }

  onChangeCancelaHora(): void {
    this.a_s0_CancelaHoraFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_s4_CancelaHoraFG.enable({ emitEvent: false });
      }
      else {
        this.a_s4_CancelaHoraFG.disable({ emitEvent: false });
      }
      this.a_s4_CancelaHoraFG.reset({ emitEvent: false });
    });
  }

  onChangeOtros(): void {
    this.a_s0_OtrosFC.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.a_Seccion5FG.enable({ emitEvent: false });
      }
      else {
        this.a_Seccion5FG.disable({ emitEvent: false });
      }
      this.a_Seccion5FG.reset({ emitEvent: false });
    });
  }

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo001_E28NTResponse>(this.dataInput.tramiteReqId).toPromise();
        console.log(JSON.parse(dataAnexo.metaData));
        const {
          seccion0,
          seccion1,
          seccion2,
          seccion3,
          seccion4,
          seccion5,
          seccion6,
          seccion7
        } = JSON.parse(dataAnexo.metaData) as MetaData;

        this.idAnexo = dataAnexo.anexoId;

        if (this.a_Seccion0FG.enabled) {
          this.a_s0_CambioUbicaFC.setValue(seccion0.cambioUbicacion);
          this.a_s0_AmpliaFrecFC.setValue(seccion0.ampliaFrecuencia);
          this.a_s0_CambioFrecFC.setValue(seccion0.cambioFrecuencia);
          this.a_s0_CancelaFrecFC.setValue(seccion0.cancelaFrecuencia);
          this.a_s0_AmpliaHoraFC.setValue(seccion0.ampliaHorario);
          this.a_s0_CambioHoraFC.setValue(seccion0.cambioHorario);
          this.a_s0_CancelaHoraFC.setValue(seccion0.cancelaHorario);
          this.a_s0_OtrosFC.setValue(seccion0.otros);
        }

        if (this.a_Seccion1FG.enabled) {
          this.a_s1_IndicativoFC.setValue(seccion1.indicativo);
          this.a_s1_UbicacionFC.setValue(seccion1.ubicacion);
          this.a_s1_FrecOperaFC.setValue(seccion1.frecuenciaOpera);
          this.a_s1_HoraOperaFC.setValue(seccion1.horarioOpera);
        }

        if (this.a_Seccion2FG.enabled) {
          const { estacionFija, estacionMovil } = seccion2;

          if (this.a_s2_EstaFijaFG.enabled) {
            const { departamento, provincia, distrito, lonOeste, latSur } = estacionFija;
            this.a_s2_ef_UbicacionFC.setValue(estacionFija.ubicacion);

            await this.ubigeoEstFija1Component?.setUbigeoByText(
              departamento,
              provincia,
              distrito);

            this.a_s2_ef_LOGraFC.setValue(lonOeste.grados);
            this.a_s2_ef_LOMinFC.setValue(lonOeste.minutos);
            this.a_s2_ef_LOSegFC.setValue(lonOeste.segundos);
            this.a_s2_ef_LSGraFC.setValue(latSur.grados);
            this.a_s2_ef_LSMinFC.setValue(latSur.minutos);
            this.a_s2_ef_LSSegFC.setValue(latSur.segundos);
          }

          if (this.a_s2_EstaMovilFG.enabled) {
            this.a_s2_em_PortZonaOperFC.setValue(estacionMovil.portZonaOperacion);
            this.a_s2_em_VehiZonaOperFC.setValue(estacionMovil.vehiZonaOperacion);
            this.a_s2_em_EmbarMatriFC.setValue(estacionMovil.embarMatricula);
            this.a_s2_em_AeroMatriFC.setValue(estacionMovil.aeroMatricula);
          }
        }

        if (this.a_Seccion3FG.enabled) {
          const { ampliaFrecuencia, cambioFrecuencia, cancelaFrecuencia } = seccion3;

          if (this.a_s3_AmpliaFrecFG.enabled) {
            this.a_s3_af_FrecAdicionaFC.setValue(ampliaFrecuencia.frecAdicional);
            this.a_s3_af_HoraOperaFC.setValue(ampliaFrecuencia.horaOperacion);
          }
          if (this.a_s3_CambioFrecFG.enabled) {
            this.a_s3_cf_FrecCambioFC.setValue(cambioFrecuencia.frecCambio);
            this.a_s3_cf_NuevaFrecFC.setValue(cambioFrecuencia.nuevaFrec);
          }
          if (this.a_s3_CancelaFrecFC.enabled) {
            this.a_s3_CancelaFrecFC.setValue(cancelaFrecuencia);
          }
        }

        if (this.a_Seccion4FG.enabled) {
          const { ampliaHorario, cambioHorario, cancelaHorario } = seccion4;

          if (this.a_s4_AmpliaHoraFG.enabled) {
            this.a_s4_ah_HoraAdicionaFC.setValue(ampliaHorario.horaAdicional);
            this.a_s4_ah_FrecuenciaFC.setValue(ampliaHorario.frecuencia);
          }
          if (this.a_s4_CambioHoraFG.enabled) {
            this.a_s4_ch_HoraCambioFC.setValue(cambioHorario.horaCambio);
            this.a_s4_ch_NuevaHoraFC.setValue(cambioHorario.nuevoHorario);
            this.a_s4_ch_FrecuenciaFC.setValue(cambioHorario.frecuencia);
          }
          if (this.a_s4_CancelaHoraFG.enabled) {
            this.a_s4_cah_HoraCancelaFC.setValue(cancelaHorario.horaCancela);
            this.a_s4_cah_FrecuenciaFC.setValue(cancelaHorario.frecuencia);
          }
        }

        if (this.a_Seccion5FG.enabled) {
          this.a_s5_IndicaModifFC.setValue(seccion5.indicaModifica);
          this.a_s5_CaracActualFC.setValue(seccion5.caractActual);
          this.a_s5_NuevaCaracFC.setValue(seccion5.nuevaCaract);
        }

        if (this.a_Seccion6FG.enabled) {
          const { declaracion1 } = seccion6;
          this.a_s6_declaracion1FC.setValue(declaracion1);
        }

        this.nroDocumento = seccion7.nroDocumento;
        this.nombreCompleto = seccion7.nombreCompleto;
      }
      catch (e) {
        console.error(e);
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }
    this.funcionesMtcService.ocultarCargando();
  }

  async vistaPreviaAdjunto(fileAdjuntoFC: UntypedFormControl, pathNameAdjuntoFC: UntypedFormControl): Promise<void> {
    const pathNameAdjunto = pathNameAdjuntoFC.value;
    if (pathNameAdjunto) {
      this.funcionesMtcService.mostrarCargando();
      try {
        const file: Blob = await this.visorPdfArchivosService.get(pathNameAdjunto).toPromise();
        this.funcionesMtcService.ocultarCargando();
        this.visualizarPdf(file as File);
      }
      catch (e) {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    } else {
      this.visualizarPdf(fileAdjuntoFC.value);
    }
  }

  visualizarPdf(file: File): void {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = 'Vista Previa Documento Adjunto';
  }

  eliminarAdjunto(fileAdjuntoFC: UntypedFormControl, pathNameAdjuntoFC: UntypedFormControl): void {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el archivo adjunto?')
      .then(() => {
        fileAdjuntoFC.setValue(null);
        pathNameAdjuntoFC.setValue(null);
      });
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 001-E/28';
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
  }

  async guardarAnexo(): Promise<void> {
    if (this.anexoFG.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    const dataGuardar = new Anexo001_E28NTRequest();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'A';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // -------------------------------------

    const { seccion0, seccion1, seccion2, seccion3, seccion4, seccion5, seccion6, seccion7 } = dataGuardar.metaData;

    // SECCION 0:
    seccion0.cambioUbicacion = this.a_s0_CambioUbicaFC.value ?? false;
    seccion0.ampliaFrecuencia = this.a_s0_AmpliaFrecFC.value ?? false;
    seccion0.cambioFrecuencia = this.a_s0_CambioFrecFC.value ?? false;
    seccion0.cancelaFrecuencia = this.a_s0_CancelaFrecFC.value ?? false;
    seccion0.ampliaHorario = this.a_s0_AmpliaHoraFC.value ?? false;
    seccion0.cambioHorario = this.a_s0_CambioHoraFC.value ?? false;
    seccion0.cancelaHorario = this.a_s0_CancelaHoraFC.value ?? false;
    seccion0.otros = this.a_s0_OtrosFC.value ?? false;
    // -------------------------------------
    // SECCION 1:
    seccion1.indicativo = this.a_s1_IndicativoFC.value ?? '';
    seccion1.ubicacion = this.a_s1_UbicacionFC.value ?? '';
    seccion1.frecuenciaOpera = this.a_s1_FrecOperaFC.value ?? '';
    seccion1.horarioOpera = this.a_s1_HoraOperaFC.value ?? '';
    // -------------------------------------
    // SECCION 2:
    const { estacionFija, estacionMovil } = seccion2;
    const { lonOeste, latSur } = estacionFija;

    estacionFija.ubicacion = this.a_s2_ef_UbicacionFC.value ?? '';
    estacionFija.departamento = this.ubigeoEstFija1Component?.getDepartamentoText() ?? '';
    estacionFija.provincia = this.ubigeoEstFija1Component?.getProvinciaText() ?? '';
    estacionFija.distrito = this.ubigeoEstFija1Component?.getDistritoText() ?? '';
    lonOeste.grados = this.a_s2_ef_LOGraFC.value ?? '';
    lonOeste.minutos = this.a_s2_ef_LOMinFC.value ?? '';
    lonOeste.segundos = this.a_s2_ef_LOSegFC.value ?? '';
    latSur.grados = this.a_s2_ef_LSGraFC.value ?? '';
    latSur.minutos = this.a_s2_ef_LSMinFC.value ?? '';
    latSur.segundos = this.a_s2_ef_LSSegFC.value ?? '';

    estacionMovil.portZonaOperacion = this.a_s2_em_PortZonaOperFC.value ?? '';
    estacionMovil.vehiZonaOperacion = this.a_s2_em_VehiZonaOperFC.value ?? '';
    estacionMovil.embarMatricula = this.a_s2_em_EmbarMatriFC.value ?? '';
    estacionMovil.aeroMatricula = this.a_s2_em_AeroMatriFC.value ?? '';
    // -------------------------------------
    // SECCION 3:
    const { ampliaFrecuencia, cambioFrecuencia } = seccion3;
    ampliaFrecuencia.frecAdicional = this.a_s3_af_FrecAdicionaFC.value ?? '';
    ampliaFrecuencia.horaOperacion = this.a_s3_af_HoraOperaFC.value ?? '';
    cambioFrecuencia.frecCambio = this.a_s3_cf_FrecCambioFC.value ?? '';
    cambioFrecuencia.nuevaFrec = this.a_s3_cf_NuevaFrecFC.value ?? '';
    seccion3.cancelaFrecuencia = this.a_s3_CancelaFrecFC.value ?? '';
    // -------------------------------------
    // SECCION 4:
    const { ampliaHorario, cambioHorario, cancelaHorario } = seccion4;
    ampliaHorario.horaAdicional = this.a_s4_ah_HoraAdicionaFC.value ?? '';
    ampliaHorario.frecuencia = this.a_s4_ah_FrecuenciaFC.value ?? '';
    cambioHorario.horaCambio = this.a_s4_ch_HoraCambioFC.value ?? '';
    cambioHorario.nuevoHorario = this.a_s4_ch_NuevaHoraFC.value ?? '';
    cambioHorario.frecuencia = this.a_s4_ch_FrecuenciaFC.value ?? '';
    cancelaHorario.horaCancela = this.a_s4_cah_HoraCancelaFC.value ?? '';
    cancelaHorario.frecuencia = this.a_s4_cah_FrecuenciaFC.value ?? '';
    // -------------------------------------
    // SECCION 5:
    seccion5.indicaModifica = this.a_s5_IndicaModifFC.value ?? '';
    seccion5.caractActual = this.a_s5_CaracActualFC.value ?? '';
    seccion5.nuevaCaract = this.a_s5_NuevaCaracFC.value ?? '';
    // -------------------------------------
    // SECCION 6:
    seccion6.declaracion1 = this.a_s6_declaracion1FC.value ?? false;
    // -------------------------------------
    // SECCION 7:
    seccion7.nroDocumento = this.nroDocumento;
    seccion7.nombreCompleto = this.nombreCompleto;
    // -------------------------------------

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        this.funcionesMtcService.mostrarCargando();
        if (this.idAnexo === 0) {
          // GUARDAR:
          try {
            const data = await this.anexoService.post<any>(dataGuardarFormData).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;

            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
          }
          catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // MODIFICAR
          try {
            const data = await this.anexoService.put<any>(dataGuardarFormData).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;

            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
          }
          catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
          }
        }
      });
  }

}
