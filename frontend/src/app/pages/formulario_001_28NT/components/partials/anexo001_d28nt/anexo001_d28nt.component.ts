/**
 * Formulario 001/28
 * @author André Bernabé Pérez
 * @version 1.0 21.04.2022
 */

import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo001_D28NTResponse } from '../../../../../core/models/Anexos/Anexo001_d28NT/Anexo001_d28NTResponse';
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_d28NT/MetaData';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { Anexo001_D28NTRequest } from 'src/app/core/models/Anexos/Anexo001_d28NT/Anexo001_d28NTRequest';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Anexo001D28NTService } from 'src/app/core/services/anexos/anexo001-d28nt.service';
import { Antena, Equipo, Satelite } from 'src/app/core/models/Anexos/Anexo001_d28NT/Secciones';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo001_d28',
  templateUrl: './anexo001_d28nt.component.html',
  styleUrls: ['./anexo001_d28nt.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo001_d28nt_Component implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;
  @ViewChild('ubigeoCmpEstFija2') ubigeoEstFija2Component: UbigeoComponent;

  txtTitulo = 'ANEXO 001-D/28 PERFIL DEL PROYECTO TÉCNICO Teleservicio privado satelital';

  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFG: UntypedFormGroup;
  sateliteFG: UntypedFormGroup;
  equipoFG: UntypedFormGroup;
  antenaFG: UntypedFormGroup;

  tipoSolicitante: string;

  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  tipoDocumento = '';
  nroDocumento = '';
  nroRuc = '';
  nombreCompleto = '';
  razonSocial = '';

  indexEditSatelite = -1;
  indexEditEquipo = -1;
  indexEditAntena = -1;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001D28NTService,
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
      a_Seccion2FG: this.fb.group(
        {
          a_s2_SateliteFG: this.fb.group({
            a_s2_sa_FijoFC: [false],
            a_s2_sa_MovilFC: [false],
          }, {
            validators: [
              requireCheckboxesToBeCheckedValidator(0, 1)
            ],
          } as AbstractControlOptions),
          a_s2_EstacionFG: this.fb.group({
            a_s2_es_FijoFC: [false],
            a_s2_es_MovilFC: [false],
          }, {
            validators: [
              requireCheckboxesToBeCheckedValidator(0, 1)
            ],
          } as AbstractControlOptions),
          a_s2_AuxiliarRadFC: [false],
          a_s2_DireccionalFG: this.fb.group({
            a_s2_di_UnidirFC: [false],
            a_s2_di_BidirFC: [false],
          }, {
            validators: [
              requireCheckboxesToBeCheckedValidator(0, 1)
            ],
          } as AbstractControlOptions),
        }, {
          validators: [
            requireCheckboxesToBeCheckedValidator()
          ],
        } as AbstractControlOptions
      ),
      a_Seccion3FG: this.fb.group({
        a_s3_UbicacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s3_DepartamentoFC: ['', [Validators.required]],
        a_s3_ProvinciaFC: ['', [Validators.required]],
        a_s3_DistritoFC: ['', [Validators.required]],
        a_s3_LOGraFC: ['', [Validators.required, Validators.max(90)]],
        a_s3_LOMinFC: ['', [Validators.required, Validators.max(59)]],
        a_s3_LOSegFC: ['', [Validators.required, Validators.max(59)]],
        a_s3_LSGraFC: ['', [Validators.required, Validators.max(90)]],
        a_s3_LSMinFC: ['', [Validators.required, Validators.max(59)]],
        a_s3_LSSegFC: ['', [Validators.required, Validators.max(59)]],
        a_s3_TipoEstacionFG: this.fb.group({
          a_s3_te_TransRecepFC: [false],
          a_s3_te_SoloTransFC: [false],
        }, {
          validators: [
            requireCheckboxesToBeCheckedValidator(1, 1)
          ],
        } as AbstractControlOptions),
      }),
      a_Seccion3aFG: this.fb.group({
        a_s3a_ProveeSatFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s3a_NombSatFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(80)]],
        a_s3a_SateliteFA: this.fb.array([], [Validators.required]),
      }),
      a_Seccion3bFG: this.fb.group({
        a_s3b_EquipoFA: this.fb.array([], [Validators.required]),
        a_s3b_AntenaFA: this.fb.array([], [Validators.required]),
        a_s3b_AlturaAntFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s3b_AlturaEdiFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s3b_AcimutRadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s3b_ElevacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],

      }),
      a_Seccion4FG: this.fb.group({
        a_s4_ColegioProfFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s4_NroColegiaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
      }),
      a_Seccion5FG: this.fb.group({
        a_s5_declaracion1FC: [false, [Validators.requiredTrue]],
      })
    });

    this.sateliteFG = this.fb.group({
      sa_TranspoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_FrecSubFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_FrecBajFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_PolarizFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_AnchoBaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_TasaSimFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_ModulacFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_FecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });

    this.equipoFG = this.fb.group({
      eq_TipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_NroSerieFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_PotenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
      eq_CodHomoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });

    this.antenaFG = this.fb.group({
      an_TipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_DiametroFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
      an_GananciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_CodHomoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
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

    await this.cargarDatos();
  }

  // GET FORM anexoFG
  get a_Seccion2FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup; }
  get a_s2_SateliteFG(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_SateliteFG') as UntypedFormGroup; }
  get a_s2_sa_FijoFC(): UntypedFormControl { return this.a_s2_SateliteFG.get('a_s2_sa_FijoFC') as UntypedFormControl; }
  get a_s2_sa_MovilFC(): UntypedFormControl { return this.a_s2_SateliteFG.get('a_s2_sa_MovilFC') as UntypedFormControl; }
  get a_s2_EstacionFG(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_EstacionFG') as UntypedFormGroup; }
  get a_s2_es_FijoFC(): UntypedFormControl { return this.a_s2_EstacionFG.get('a_s2_es_FijoFC') as UntypedFormControl; }
  get a_s2_es_MovilFC(): UntypedFormControl { return this.a_s2_EstacionFG.get('a_s2_es_MovilFC') as UntypedFormControl; }
  get a_s2_AuxiliarRadFC(): UntypedFormControl { return this.a_Seccion2FG.get('a_s2_AuxiliarRadFC') as UntypedFormControl; }
  get a_s2_DireccionalFG(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_DireccionalFG') as UntypedFormGroup; }
  get a_s2_di_UnidirFC(): UntypedFormControl { return this.a_s2_DireccionalFG.get('a_s2_di_UnidirFC') as UntypedFormControl; }
  get a_s2_di_BidirFC(): UntypedFormControl { return this.a_s2_DireccionalFG.get('a_s2_di_BidirFC') as UntypedFormControl; }
  get a_Seccion3FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3FG') as UntypedFormGroup; }
  get a_s3_UbicacionFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_UbicacionFC') as UntypedFormControl; }
  get a_s3_DepartamentoFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_DepartamentoFC') as UntypedFormControl; }
  get a_s3_ProvinciaFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_ProvinciaFC') as UntypedFormControl; }
  get a_s3_DistritoFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_DistritoFC') as UntypedFormControl; }
  get a_s3_LOGraFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_LOGraFC') as UntypedFormControl; }
  get a_s3_LOMinFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_LOMinFC') as UntypedFormControl; }
  get a_s3_LOSegFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_LOSegFC') as UntypedFormControl; }
  get a_s3_LSGraFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_LSGraFC') as UntypedFormControl; }
  get a_s3_LSMinFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_LSMinFC') as UntypedFormControl; }
  get a_s3_LSSegFC(): UntypedFormControl { return this.a_Seccion3FG.get('a_s3_LSSegFC') as UntypedFormControl; }
  get a_s3_TipoEstacionFG(): UntypedFormGroup { return this.a_Seccion3FG.get('a_s3_TipoEstacionFG') as UntypedFormGroup; }
  get a_s3_te_TransRecepFC(): UntypedFormControl { return this.a_s3_TipoEstacionFG.get('a_s3_te_TransRecepFC') as UntypedFormControl; }
  get a_s3_te_SoloTransFC(): UntypedFormControl { return this.a_s3_TipoEstacionFG.get('a_s3_te_SoloTransFC') as UntypedFormControl; }
  get a_Seccion3aFG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3aFG') as UntypedFormGroup; }
  get a_s3a_ProveeSatFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_ProveeSatFC') as UntypedFormControl; }
  get a_s3a_NombSatFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_NombSatFC') as UntypedFormControl; }
  get a_s3a_SateliteFA(): UntypedFormArray { return this.a_Seccion3aFG.get('a_s3a_SateliteFA') as UntypedFormArray; }
  get a_Seccion3bFG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3bFG') as UntypedFormGroup; }
  get a_s3b_EquipoFA(): UntypedFormArray { return this.a_Seccion3bFG.get('a_s3b_EquipoFA') as UntypedFormArray; }
  get a_s3b_AntenaFA(): UntypedFormArray { return this.a_Seccion3bFG.get('a_s3b_AntenaFA') as UntypedFormArray; }
  get a_s3b_AlturaAntFC(): UntypedFormControl { return this.a_Seccion3bFG.get('a_s3b_AlturaAntFC') as UntypedFormControl; }
  get a_s3b_AlturaEdiFC(): UntypedFormControl { return this.a_Seccion3bFG.get('a_s3b_AlturaEdiFC') as UntypedFormControl; }
  get a_s3b_AcimutRadFC(): UntypedFormControl { return this.a_Seccion3bFG.get('a_s3b_AcimutRadFC') as UntypedFormControl; }
  get a_s3b_ElevacionFC(): UntypedFormControl { return this.a_Seccion3bFG.get('a_s3b_ElevacionFC') as UntypedFormControl; }
  get a_Seccion4FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion4FG') as UntypedFormGroup; }
  get a_s4_ColegioProfFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_ColegioProfFC') as UntypedFormControl; }
  get a_s4_NroColegiaFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_NroColegiaFC') as UntypedFormControl; }
  get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
  get a_s5_declaracion1FC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_declaracion1FC') as UntypedFormControl; }

  get sa_TranspoFC(): UntypedFormControl { return this.sateliteFG.get('sa_TranspoFC') as UntypedFormControl; }
  get sa_FrecSubFC(): UntypedFormControl { return this.sateliteFG.get('sa_FrecSubFC') as UntypedFormControl; }
  get sa_FrecBajFC(): UntypedFormControl { return this.sateliteFG.get('sa_FrecBajFC') as UntypedFormControl; }
  get sa_PolarizFC(): UntypedFormControl { return this.sateliteFG.get('sa_PolarizFC') as UntypedFormControl; }
  get sa_AnchoBaFC(): UntypedFormControl { return this.sateliteFG.get('sa_AnchoBaFC') as UntypedFormControl; }
  get sa_TasaSimFC(): UntypedFormControl { return this.sateliteFG.get('sa_TasaSimFC') as UntypedFormControl; }
  get sa_ModulacFC(): UntypedFormControl { return this.sateliteFG.get('sa_ModulacFC') as UntypedFormControl; }
  get sa_FecFC(): UntypedFormControl { return this.sateliteFG.get('sa_FecFC') as UntypedFormControl; }

  get eq_TipoFC(): UntypedFormControl { return this.equipoFG.get('eq_TipoFC') as UntypedFormControl; }
  get eq_MarcaFC(): UntypedFormControl { return this.equipoFG.get('eq_MarcaFC') as UntypedFormControl; }
  get eq_ModeloFC(): UntypedFormControl { return this.equipoFG.get('eq_ModeloFC') as UntypedFormControl; }
  get eq_NroSerieFC(): UntypedFormControl { return this.equipoFG.get('eq_NroSerieFC') as UntypedFormControl; }
  get eq_PotenciaFC(): UntypedFormControl { return this.equipoFG.get('eq_PotenciaFC') as UntypedFormControl; }
  get eq_CodHomoFC(): UntypedFormControl { return this.equipoFG.get('eq_CodHomoFC') as UntypedFormControl; }

  get an_TipoFC(): UntypedFormControl { return this.antenaFG.get('an_TipoFC') as UntypedFormControl; }
  get an_MarcaFC(): UntypedFormControl { return this.antenaFG.get('an_MarcaFC') as UntypedFormControl; }
  get an_ModeloFC(): UntypedFormControl { return this.antenaFG.get('an_ModeloFC') as UntypedFormControl; }
  get an_DiametroFC(): UntypedFormControl { return this.antenaFG.get('an_DiametroFC') as UntypedFormControl; }
  get an_GananciaFC(): UntypedFormControl { return this.antenaFG.get('an_GananciaFC') as UntypedFormControl; }
  get an_CodHomoFC(): UntypedFormControl { return this.antenaFG.get('an_CodHomoFC') as UntypedFormControl; }

  a_s3a_sa_TranspoFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_TranspoFC']) as UntypedFormControl; }
  a_s3a_sa_FrecSubFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_FrecSubFC']) as UntypedFormControl; }
  a_s3a_sa_FrecBajFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_FrecBajFC']) as UntypedFormControl; }
  a_s3a_sa_PolarizFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_PolarizFC']) as UntypedFormControl; }
  a_s3a_sa_AnchoBaFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_AnchoBaFC']) as UntypedFormControl; }
  a_s3a_sa_TasaSimFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_TasaSimFC']) as UntypedFormControl; }
  a_s3a_sa_ModulacFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_ModulacFC']) as UntypedFormControl; }
  a_s3a_sa_FecFC(index: number): UntypedFormControl { return this.a_s3a_SateliteFA.get([index, 'sa_FecFC']) as UntypedFormControl; }

  a_s3b_eq_TipoFC(index: number): UntypedFormControl { return this.a_s3b_EquipoFA.get([index, 'eq_TipoFC']) as UntypedFormControl; }
  a_s3b_eq_MarcaFC(index: number): UntypedFormControl { return this.a_s3b_EquipoFA.get([index, 'eq_MarcaFC']) as UntypedFormControl; }
  a_s3b_eq_ModeloFC(index: number): UntypedFormControl { return this.a_s3b_EquipoFA.get([index, 'eq_ModeloFC']) as UntypedFormControl; }
  a_s3b_eq_NroSerieFC(index: number): UntypedFormControl { return this.a_s3b_EquipoFA.get([index, 'eq_NroSerieFC']) as UntypedFormControl; }
  a_s3b_eq_PotenciaFC(index: number): UntypedFormControl { return this.a_s3b_EquipoFA.get([index, 'eq_PotenciaFC']) as UntypedFormControl; }
  a_s3b_eq_CodHomoFC(index: number): UntypedFormControl { return this.a_s3b_EquipoFA.get([index, 'eq_CodHomoFC']) as UntypedFormControl; }

  a_s3b_an_TipoFC(index: number): UntypedFormControl { return this.a_s3b_AntenaFA.get([index, 'an_TipoFC']) as UntypedFormControl; }
  a_s3b_an_MarcaFC(index: number): UntypedFormControl { return this.a_s3b_AntenaFA.get([index, 'an_MarcaFC']) as UntypedFormControl; }
  a_s3b_an_ModeloFC(index: number): UntypedFormControl { return this.a_s3b_AntenaFA.get([index, 'an_ModeloFC']) as UntypedFormControl; }
  a_s3b_an_DiametroFC(index: number): UntypedFormControl { return this.a_s3b_AntenaFA.get([index, 'an_DiametroFC']) as UntypedFormControl; }
  a_s3b_an_PotenciaFC(index: number): UntypedFormControl { return this.a_s3b_AntenaFA.get([index, 'an_GananciaFC']) as UntypedFormControl; }
  a_s3b_an_CodHomoFC(index: number): UntypedFormControl { return this.a_s3b_AntenaFA.get([index, 'an_CodHomoFC']) as UntypedFormControl; }

  // FIN GET FORM anexoFG

  // region: Satelite
  saveSatelite(): void {
    const satelite: Satelite = {
      transponder: this.sa_TranspoFC.value,
      frecSubida: this.sa_FrecSubFC.value,
      frecBajada: this.sa_FrecBajFC.value,
      polarizacion: this.sa_PolarizFC.value,
      anchoBanda: this.sa_AnchoBaFC.value,
      tasaSimbolo: this.sa_TasaSimFC.value,
      modulacion: this.sa_ModulacFC.value,
      fec: this.sa_FecFC.value
    };

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditSatelite === -1 ? 'guardar' : 'modificar'} la información del satélite?`)
      .then(() => {
        this.addEditSateliteFG(satelite, this.indexEditSatelite);
        this.indexEditSatelite = -1;
        this.sateliteFG.reset();
      });
  }

  nosaveSatelite(): void {
    this.indexEditSatelite = -1;
    this.sateliteFG.reset();
  }

  editSatelite(index: number): void {
    this.indexEditSatelite = index;

    const transponder = this.a_s3a_sa_TranspoFC(index).value;
    const frecSubida = this.a_s3a_sa_FrecSubFC(index).value;
    const frecBajada = this.a_s3a_sa_FrecBajFC(index).value;
    const polarizacion = this.a_s3a_sa_PolarizFC(index).value;
    const anchoBanda = this.a_s3a_sa_AnchoBaFC(index).value;
    const tasaSimbolo = this.a_s3a_sa_TasaSimFC(index).value;
    const modulacion = this.a_s3a_sa_ModulacFC(index).value;
    const fec = this.a_s3a_sa_FecFC(index).value;

    this.sa_TranspoFC.setValue(transponder);
    this.sa_FrecSubFC.setValue(frecSubida);
    this.sa_FrecBajFC.setValue(frecBajada);
    this.sa_PolarizFC.setValue(polarizacion);
    this.sa_AnchoBaFC.setValue(anchoBanda);
    this.sa_TasaSimFC.setValue(tasaSimbolo);
    this.sa_ModulacFC.setValue(modulacion);
    this.sa_FecFC.setValue(fec);
  }

  private addEditSateliteFG(satelite: Satelite, index: number = -1): void {
    const { transponder, frecSubida, frecBajada, polarizacion, anchoBanda, tasaSimbolo, modulacion, fec } = satelite;

    const newSateliteFG = this.fb.group({
      sa_TranspoFC: [transponder, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_FrecSubFC: [frecSubida, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_FrecBajFC: [frecBajada, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_PolarizFC: [polarizacion, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_AnchoBaFC: [anchoBanda, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_TasaSimFC: [tasaSimbolo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_ModulacFC: [modulacion, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      sa_FecFC: [fec, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });

    if (index === -1) {
      this.a_s3a_SateliteFA.push(newSateliteFG);
    }
    else {
      this.a_s3a_SateliteFA.setControl(index, newSateliteFG);
    }
  }

  removeSatelite(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información del satélite seleccionado?')
      .then(
        () => {
          this.a_s3a_SateliteFA.removeAt(index);
        });
  }
  // endregion: Satelite

  // region: Equipo
  saveEquipo(): void {
    const equipo: Equipo = {
      tipo: this.eq_TipoFC.value,
      marca: this.eq_MarcaFC.value,
      modelo: this.eq_ModeloFC.value,
      nroSerie: this.eq_NroSerieFC.value,
      potencia: this.eq_PotenciaFC.value,
      codHomologa: this.eq_CodHomoFC.value
    };

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditEquipo === -1 ? 'guardar' : 'modificar'} la información del equipo?`)
      .then(() => {
        this.addEditEquipoFG(equipo, this.indexEditEquipo);
        this.indexEditEquipo = -1;
        this.equipoFG.reset();
      });
  }

  nosaveEquipo(): void {
    this.indexEditEquipo = -1;
    this.equipoFG.reset();
  }

  editEquipo(index: number): void {
    this.indexEditEquipo = index;

    const tipo = this.a_s3b_eq_TipoFC(index).value;
    const marca = this.a_s3b_eq_MarcaFC(index).value;
    const modelo = this.a_s3b_eq_ModeloFC(index).value;
    const nroSerie = this.a_s3b_eq_NroSerieFC(index).value;
    const potencia = this.a_s3b_eq_PotenciaFC(index).value;
    const codHomologa = this.a_s3b_eq_CodHomoFC(index).value;

    this.eq_TipoFC.setValue(tipo);
    this.eq_MarcaFC.setValue(marca);
    this.eq_ModeloFC.setValue(modelo);
    this.eq_NroSerieFC.setValue(nroSerie);
    this.eq_PotenciaFC.setValue(potencia);
    this.eq_CodHomoFC.setValue(codHomologa);
  }

  private addEditEquipoFG(equipo: Equipo, index: number = -1): void {
    const { tipo, marca, modelo, nroSerie, potencia, codHomologa } = equipo;

    const newEquipoFG = this.fb.group({
      eq_TipoFC: [tipo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_MarcaFC: [marca, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_ModeloFC: [modelo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_NroSerieFC: [nroSerie, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_PotenciaFC: [potencia, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      eq_CodHomoFC: [codHomologa, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });

    if (index === -1) {
      this.a_s3b_EquipoFA.push(newEquipoFG);
    }
    else {
      this.a_s3b_EquipoFA.setControl(index, newEquipoFG);
    }
  }

  removeEquipo(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información del equipo seleccionado?')
      .then(
        () => {
          this.a_s3b_EquipoFA.removeAt(index);
        });
  }
  // endregion: Equipo

  // region: Antena
  saveAntena(): void {
    const antena: Antena = {
      tipo: this.an_TipoFC.value,
      marca: this.an_MarcaFC.value,
      modelo: this.an_ModeloFC.value,
      diametro: this.an_DiametroFC.value,
      ganancia: this.an_GananciaFC.value,
      codHomologa: this.an_CodHomoFC.value
    };

    this.funcionesMtcService.mensajeConfirmar(`Desea ${this.indexEditAntena === -1 ? 'guardar' : 'modificar'} la información de la antena?`)
      .then(() => {
        this.addEditAntenaFG(antena, this.indexEditAntena);
        this.indexEditAntena = -1;
        this.antenaFG.reset();
      });
  }

  nosaveAntena(): void {
    this.indexEditAntena = -1;
    this.antenaFG.reset();
  }

  editAntena(index: number): void {
    this.indexEditAntena = index;

    const tipo = this.a_s3b_an_TipoFC(index).value;
    const marca = this.a_s3b_an_MarcaFC(index).value;
    const modelo = this.a_s3b_an_ModeloFC(index).value;
    const diametro = this.a_s3b_an_DiametroFC(index).value;
    const ganancia = this.a_s3b_an_PotenciaFC(index).value;
    const codHomologa = this.a_s3b_an_CodHomoFC(index).value;

    this.an_TipoFC.setValue(tipo);
    this.an_MarcaFC.setValue(marca);
    this.an_ModeloFC.setValue(modelo);
    this.an_DiametroFC.setValue(diametro);
    this.an_GananciaFC.setValue(ganancia);
    this.an_CodHomoFC.setValue(codHomologa);
  }

  private addEditAntenaFG(antena: Antena, index: number = -1): void {
    const { tipo, marca, modelo, diametro, ganancia, codHomologa } = antena;

    const newAntenaFG = this.fb.group({
      an_TipoFC: [tipo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_MarcaFC: [marca, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_ModeloFC: [modelo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_DiametroFC: [diametro, [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
      an_GananciaFC: [ganancia, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
      an_CodHomoFC: [codHomologa, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
    });

    if (index === -1) {
      this.a_s3b_AntenaFA.push(newAntenaFG);
    }
    else {
      this.a_s3b_AntenaFA.setControl(index, newAntenaFG);
    }
  }

  removeAntena(index: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información de la antena seleccionado?')
      .then(
        () => {
          this.a_s3b_AntenaFA.removeAt(index);
        });
  }
  // endregion: Antena


  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo001_D28NTResponse>(this.dataInput.tramiteReqId).toPromise();
        console.log(JSON.parse(dataAnexo.metaData));
        const {
          seccion2,
          seccion3,
          seccion3a,
          seccion3b,
          seccion4,
          seccion5,
          seccion6,
        } = JSON.parse(dataAnexo.metaData) as MetaData;

        this.idAnexo = dataAnexo.anexoId;

        if (this.a_Seccion2FG.enabled) {
          this.a_s2_sa_FijoFC.setValue(seccion2.estacionFijo);
          this.a_s2_sa_MovilFC.setValue(seccion2.estacionMovil);
          this.a_s2_es_FijoFC.setValue(seccion2.sateliteFijo);
          this.a_s2_es_MovilFC.setValue(seccion2.sateliteMovil);
          this.a_s2_AuxiliarRadFC.setValue(seccion2.auxiliarRadio);
          this.a_s2_di_UnidirFC.setValue(seccion2.unidireccional);
          this.a_s2_di_BidirFC.setValue(seccion2.bidireccional);
        }

        if (this.a_Seccion3FG.enabled) {
          const { departamento, provincia, distrito, lonOeste, latSur } = seccion3;
          this.a_s3_UbicacionFC.setValue(seccion3.ubicacion);

          await this.ubigeoEstFija1Component?.setUbigeoByText(
            departamento,
            provincia,
            distrito);

          this.a_s3_LOGraFC.setValue(lonOeste.grados);
          this.a_s3_LOMinFC.setValue(lonOeste.minutos);
          this.a_s3_LOSegFC.setValue(lonOeste.segundos);
          this.a_s3_LSGraFC.setValue(latSur.grados);
          this.a_s3_LSMinFC.setValue(latSur.minutos);
          this.a_s3_LSSegFC.setValue(latSur.segundos);
          this.a_s3_te_TransRecepFC.setValue(seccion3.estacionTransRecep);
          this.a_s3_te_SoloTransFC.setValue(seccion3.estacionSoloTrans);
        }

        if (this.a_Seccion3aFG.enabled) {
          const { listaSatelite } = seccion3a;
          this.a_s3a_ProveeSatFC.setValue(seccion3a.proveedorSat);
          this.a_s3a_NombSatFC.setValue(seccion3a.nombreSat);

          if (this.a_s3a_SateliteFA.enabled) {
            for (const satelite of listaSatelite) {
              this.addEditSateliteFG(satelite);
            }
          }
        }

        if (this.a_Seccion3bFG.enabled) {
          const { listaEquipo, listaAntena } = seccion3b;

          if (this.a_s3b_EquipoFA.enabled) {
            for (const equipo of listaEquipo) {
              this.addEditEquipoFG(equipo);
            }
          }

          if (this.a_s3b_AntenaFA.enabled) {
            for (const antena of listaAntena) {
              this.addEditAntenaFG(antena);
            }
          }

          this.a_s3b_AlturaAntFC.setValue(seccion3b.alturaAntena);
          this.a_s3b_AlturaEdiFC.setValue(seccion3b.alturaEdificio);
          this.a_s3b_AcimutRadFC.setValue(seccion3b.acimutRadiacion);
          this.a_s3b_ElevacionFC.setValue(seccion3b.elevacion);
        }

        if (this.a_Seccion4FG.enabled) {
          const { colegioPro, nroColegiatura } = seccion4;
          this.a_s4_ColegioProfFC.setValue(colegioPro);
          this.a_s4_NroColegiaFC.setValue(nroColegiatura);
        }

        if (this.a_Seccion5FG.enabled) {
          const { declaracion1 } = seccion5;
          this.a_s5_declaracion1FC.setValue(declaracion1);
        }

        this.nroDocumento = seccion6.nroDocumento;
        this.nombreCompleto = seccion6.nombreCompleto;
        this.razonSocial = seccion6.razonSocial;
      }
      catch (e) {
        console.error(e);
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    } else {  // SI ES NUEVO
      await this.cargarDatosSolicitante();
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 001-D/28';
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
  }

  async cargarDatosSolicitante(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    // Obtenemos los datos del Solicitante
    if (this.tipoSolicitante === 'PJ') {
      try {
        const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
        console.log('SUNAT: ', response);

        this.razonSocial = response.razonSocial?.trim() ?? '';

        // Cargamos el Representante Legal
        for (const repLegal of response.representanteLegal) {
          if (repLegal.nroDocumento === this.nroDocumento) {
            if (repLegal.tipoDocumento === '1') {  // DNI
              this.tipoDocumento = '01';
              this.nroDocumento = repLegal.nroDocumento;
            }
            break;
          }
        }
      }
      catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Sunat);
      }
    }
    if (this.tipoDocumento === '01') {// DNI
      try {
        const respuesta = await this.reniecService.getDni(this.nroDocumento).toPromise();
        console.log(respuesta);

        if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
        }

        const { prenombres, apPrimer, apSegundo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        this.nombreCompleto = `${prenombres} ${apPrimer} ${apSegundo}`;
      }
      catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Reniec);
      }
    } else if (this.tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
      try {
        const { CarnetExtranjeria } = await this.extranjeriaService.getCE(this.nroDocumento).toPromise();
        console.log(CarnetExtranjeria);
        const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

        if (numRespuesta !== '0000') {
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
        }

        this.nombreCompleto = `${nombres} ${primerApellido} ${segundoApellido}`;
      }
      catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Migraciones);
      }
    }
    this.funcionesMtcService.ocultarCargando();
  }

  async guardarAnexo(): Promise<void> {
    if (this.anexoFG.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    const dataGuardar = new Anexo001_D28NTRequest();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'A';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // -------------------------------------

    const {
      seccion2,
      seccion3,
      seccion3a,
      seccion3b,
      seccion4,
      seccion5,
      seccion6
    } = dataGuardar.metaData;

    // SECCION 2:
    seccion2.estacionFijo = this.a_s2_sa_FijoFC.value ?? false;
    seccion2.estacionMovil = this.a_s2_sa_MovilFC.value ?? false;
    seccion2.sateliteFijo = this.a_s2_es_FijoFC.value ?? false;
    seccion2.sateliteMovil = this.a_s2_es_MovilFC.value ?? false;
    seccion2.auxiliarRadio = this.a_s2_AuxiliarRadFC.value ?? false;
    seccion2.unidireccional = this.a_s2_di_UnidirFC.value ?? false;
    seccion2.bidireccional = this.a_s2_di_BidirFC.value ?? false;
    // -------------------------------------
    // SECCION 3:
    const { lonOeste: s3lonOeste, latSur: s3latSur } = seccion3;
    seccion3.ubicacion = this.a_s3_UbicacionFC.value ?? '';
    seccion3.departamento = this.ubigeoEstFija1Component?.getDepartamentoText() ?? '';
    seccion3.provincia = this.ubigeoEstFija1Component?.getProvinciaText() ?? '';
    seccion3.distrito = this.ubigeoEstFija1Component?.getDistritoText() ?? '';
    s3lonOeste.grados = this.a_s3_LOGraFC.value ?? '';
    s3lonOeste.minutos = this.a_s3_LOMinFC.value ?? '';
    s3lonOeste.segundos = this.a_s3_LOSegFC.value ?? '';
    s3latSur.grados = this.a_s3_LSGraFC.value ?? '';
    s3latSur.minutos = this.a_s3_LSMinFC.value ?? '';
    s3latSur.segundos = this.a_s3_LSSegFC.value ?? '';
    seccion3.estacionTransRecep = this.a_s3_te_TransRecepFC.value ?? '';
    seccion3.estacionSoloTrans = this.a_s3_te_SoloTransFC.value ?? '';
    // -------------------------------------
    // SECCION 3a:
    const { listaSatelite } = seccion3a;
    seccion3a.proveedorSat = this.a_s3a_ProveeSatFC.value ?? '';
    seccion3a.nombreSat = this.a_s3a_NombSatFC.value ?? '';

    for (const controlFG of this.a_s3a_SateliteFA.controls) {
      const satelite: Satelite = {
        transponder: controlFG.get('sa_TranspoFC').value,
        frecSubida: controlFG.get('sa_FrecSubFC').value,
        frecBajada: controlFG.get('sa_FrecBajFC').value,
        polarizacion: controlFG.get('sa_PolarizFC').value,
        anchoBanda: controlFG.get('sa_AnchoBaFC').value,
        tasaSimbolo: controlFG.get('sa_TasaSimFC').value,
        modulacion: controlFG.get('sa_ModulacFC').value,
        fec: controlFG.get('sa_FecFC').value
      };
      listaSatelite.push(satelite);
    }
    // -------------------------------------
    // SECCION 3b:
    const { listaEquipo, listaAntena } = seccion3b;

    for (const controlFG of this.a_s3b_EquipoFA.controls) {
      const equipo: Equipo = {
        tipo: controlFG.get('eq_TipoFC').value,
        marca: controlFG.get('eq_MarcaFC').value,
        modelo: controlFG.get('eq_ModeloFC').value,
        nroSerie: controlFG.get('eq_NroSerieFC').value,
        potencia: controlFG.get('eq_PotenciaFC').value,
        codHomologa: controlFG.get('eq_CodHomoFC').value
      };
      listaEquipo.push(equipo);
    }

    for (const controlFG of this.a_s3b_AntenaFA.controls) {
      const antena: Antena = {
        tipo: controlFG.get('an_TipoFC').value,
        marca: controlFG.get('an_MarcaFC').value,
        modelo: controlFG.get('an_ModeloFC').value,
        diametro: controlFG.get('an_DiametroFC').value,
        ganancia: controlFG.get('an_GananciaFC').value,
        codHomologa: controlFG.get('an_CodHomoFC').value
      };
      listaAntena.push(antena);
    }

    seccion3b.alturaAntena = this.a_s3b_AlturaAntFC.value ?? '';
    seccion3b.alturaEdificio = this.a_s3b_AlturaEdiFC.value ?? '';
    seccion3b.acimutRadiacion = this.a_s3b_AcimutRadFC.value ?? '';
    seccion3b.elevacion = this.a_s3b_ElevacionFC.value ?? '';
    // -------------------------------------
    // SECCION 4:
    seccion4.colegioPro = this.a_s4_ColegioProfFC.value ?? '';
    seccion4.nroColegiatura = this.a_s4_NroColegiaFC.value ?? '';
    // -------------------------------------
    // SECCION 5:
    seccion5.declaracion1 = this.a_s5_declaracion1FC.value ?? false;
    // -------------------------------------
    // SECCION 6:
    seccion6.nroDocumento = this.nroDocumento;
    seccion6.nombreCompleto = this.nombreCompleto;
    seccion6.razonSocial = this.razonSocial;
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
