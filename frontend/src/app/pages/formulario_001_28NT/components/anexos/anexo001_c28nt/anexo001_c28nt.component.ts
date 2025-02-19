/**
 * Formulario 001/28
 * @author André Bernabé Pérez
 * @version 1.0 21.04.2022
 * @author Alicia Toquila
 * @version 2.0 07.04.2023
 */

import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { fileMaxSizeValidator, noWhitespaceValidator, requireCheckboxesToBeCheckedValidator, requiredFileTypeValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo001_C28NTResponse } from '../../../../../core/models/Anexos/Anexo001_C28NT/Anexo001_C28NTResponse';
import { EnlaceSolicitado, MetaData } from 'src/app/core/models/Anexos/Anexo001_C28NT/MetaData';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { Anexo001_C28NTRequest } from 'src/app/core/models/Anexos/Anexo001_C28NT/Anexo001_C28NTRequest';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Anexo001C28NTService } from 'src/app/core/services/anexos/anexo001-c28NT.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { ExcelArchivosService } from '../../../../../core/services/tramite/excel-archivos.service';
import { requestExcel, responseExcel } from 'src/app/core/models/ExcelModel';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo001_c28',
  templateUrl: './anexo001_c28nt.component.html',
  styleUrls: ['./anexo001_c28nt.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo001_c28nt_Component implements OnInit, AfterViewInit {
  @Input() public dataInput: any;

  @ViewChildren('ubigeoCmpEstFija1') ubigeoEstFija1Component: QueryList<UbigeoComponent>;
  @ViewChildren('ubigeoCmpEstFija2') ubigeoEstFija2Component: QueryList<UbigeoComponent>;


  txtTitulo = 'ANEXO 001-C/28 PERFIL DEL PROYECTO TÉCNICO Teleservicio privado microondas';
  txtServicioSolicitado: string ="";

  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFG: UntypedFormGroup;

  tipoSolicitante: string;
  modalidadServicio:string;
  modalidadOtroServicio:string;
  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;

  tipoDocumento = '';
  nroDocumento = '';
  nroRuc = '';
  nombreCompleto = '';
  razonSocial = '';

  plantillaFijoTerrestre  = 'ExcelHomologado_FijoTerrestre.xlsx';
  plantillaMicroondas     = 'ExcelHomologado_Microondas.xlsx'; 
  plantillaMoviAeronautico= 'ExcelHomologado_MovilAeronautico.xlsx';
  plantillaMovilMaritimo  = 'ExcelHomologado_MovilMaritimo.xlsx';
  plantillaMovilTerrestre = 'ExcelHomologado_MovilTerrestre.xlsx';
  plantillaSatelital      = 'ExcelHomologado_Satelital.xlsx';

  plantilla:string ='';
  fileExcelSeleccionado: any = null;
  valExcel = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001C28NTService,
    private seguridadService: SeguridadService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService,
    private formularioTramiteService: FormularioTramiteService,
    private excelArchivosService: ExcelArchivosService
  ) { }

  ngOnInit(): void {
    // ==================================================================================
    // RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;
    // ==================================================================================

    this.uriArchivo = this.dataInput.rutaDocumento;

    /** formulario */
    this.setFormulario();
 
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

    switch(parseInt(this.codigoTipoSolicitudTupa)){
      case 6 : this.a_s2_DigitalFG(0).setValue("fijo");
               this.a_s2_DigitalFG(0).disable();

               this.a_s2_AnalogicoFG(0).clearValidators(); 
               this.a_s2_AnalogicoFG(0).disable(); 

               this.plantilla = this.plantillaMicroondas;
               break;
      
      case 15: break; // Banda ciudadana / móvil marítimo por satélite // Radionavegación aeronáutica móvil / Radionavegación Marítima
    }
  }

  setFormulario(){
    this.anexoFG = this.fb.group({
      a_AnexosFA: this.fb.array([], [Validators.required])
    });
  }

  addEnlaceSolicitado(btnSubmit: HTMLButtonElement): void {
    btnSubmit.disabled = true;

    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de agregar una nueva solicitud de enlace?')
      .then(() => {
        this.addEnlaceSolicitadoFG();
      });

    btnSubmit.disabled = false;
  }

  private addEnlaceSolicitadoFG(): void {
    let newAnexoFG = this.fb.group({
      a_Activo:[false,[Validators.requiredTrue]],
      a_Seccion2FG: this.fb.group({
          a_s2_AnalogicoFG:['', [Validators.required]],
          a_s2_DigitalFG:['', [Validators.required]],
      }),
      a_Seccion21FG:this.fb.group({
        a_s2_FileFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['pdf'])]],
        a_s2_PathNameFC: [''],
        a_s2_FileExcelFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['xlsx'])]],
        a_s2_PathNameExcelFC: [''],
      }),
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
      }),
      a_Seccion3aFG: this.fb.group({
        a_s3a_EquipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_NroSerieFC: ['', [Validators.maxLength(20)]],
        a_s3a_PotenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s3a_BandFrecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_VelocidadFC: ['', [Validators.maxLength(20)]],
        a_s3a_NroCanalesFC: ['', [Validators.maxLength(20)]],
        a_s3a_ConfiguraFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_AnchoBandFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_CodHomoFC: ['', [Validators.maxLength(20)]],
        a_s3a_AntenaFG: this.fb.group({
          a_s3a_an_TipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_CodHomoFC: ['', [Validators.maxLength(20)]],
          a_s3a_an_GananciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_DiametroFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s3a_an_AcimutRadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s3a_an_ElevacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s3a_an_DistanciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        }),
      }),
      a_Seccion4FG: this.fb.group({
        a_s4_UbicacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s4_DepartamentoFC: ['', [Validators.required]],
        a_s4_ProvinciaFC: ['', [Validators.required]],
        a_s4_DistritoFC: ['', [Validators.required]],
        a_s4_LOGraFC: ['', [Validators.required, Validators.max(90)]],
        a_s4_LOMinFC: ['', [Validators.required, Validators.max(59)]],
        a_s4_LOSegFC: ['', [Validators.required, Validators.max(59)]],
        a_s4_LSGraFC: ['', [Validators.required, Validators.max(90)]],
        a_s4_LSMinFC: ['', [Validators.required, Validators.max(59)]],
        a_s4_LSSegFC: ['', [Validators.required, Validators.max(59)]],
      }),
      a_Seccion4aFG: this.fb.group({
        a_s4a_EquipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_NroSerieFC: ['', [Validators.maxLength(20)]],
        a_s4a_PotenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s4a_BandFrecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_VelocidadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_NroCanalesFC: ['', [Validators.maxLength(20)]],
        a_s4a_ConfiguraFC: ['', [Validators.maxLength(20)]],
        a_s4a_AnchoBandFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_CodHomoFC: ['', [Validators.maxLength(20)]],
        a_s4a_AntenaFG: this.fb.group({
          a_s4a_an_TipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_CodHomoFC: ['', [Validators.maxLength(20)]],
          a_s4a_an_GananciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_DiametroFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s4a_an_AcimutRadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s4a_an_ElevacionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        }),
      }),
      a_Seccion5FG: this.fb.group({
        a_s5_ColegioProfFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        a_s5_NroColegiaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
      }),
      a_Seccion6FG: this.fb.group({
        a_s6_declaracion1FC: [false, [Validators.requiredTrue]],
      })
    });

    this.a_AnexosFA.push(newAnexoFG);
  }

  deleteEnlaceSolicitado(btnSubmit: HTMLButtonElement, index: number): void {
    btnSubmit.disabled = true;

    this.funcionesMtcService
      .mensajeConfirmar(`¿Está seguro de eliminar la solicitud de enlace #${index + 1}?`)
      .then(() => {
        this.a_AnexosFA.removeAt(index);
      });

    btnSubmit.disabled = false;
  }

  // GET FORM anexoFG
  get a_AnexosFA(): UntypedFormArray { return this.anexoFG.get(['a_AnexosFA']) as UntypedFormArray; }

  a_Activo(index: number): UntypedFormControl { return this.a_AnexosFA.get([index,'a_Activo']) as UntypedFormControl; }
  a_Seccion2FG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion2FG']) as UntypedFormGroup; }
  a_s2_AnalogicoFG(index: number): UntypedFormControl { return this.a_Seccion2FG(index).get('a_s2_AnalogicoFG') as UntypedFormControl; }
  a_s2_DigitalFG(index: number): UntypedFormControl { return this.a_Seccion2FG(index).get('a_s2_DigitalFG') as UntypedFormControl; }
  //a_s2_AnalogicoFG(index: number): FormGroup { return this.a_Seccion2FG(index).get('a_s2_AnalogicoFG') as FormGroup; }
  //a_s2_an_FijoFC(index: number): FormControl { return this.a_s2_AnalogicoFG(index).get('a_s2_an_FijoFC') as FormControl; }
  //a_s2_an_MovilFC(index: number): FormControl { return this.a_s2_AnalogicoFG(index).get('a_s2_an_MovilFC') as FormControl; }
  //a_s2_DigitalFG(index: number): FormGroup { return this.a_Seccion2FG(index).get('a_s2_DigitalFG') as FormGroup; }
  //a_s2_di_FijoFC(index: number): FormControl { return this.a_s2_DigitalFG(index).get('a_s2_di_FijoFC') as FormControl; }
  //a_s2_di_MovilFC(index: number): FormControl { return this.a_s2_DigitalFG(index).get('a_s2_di_MovilFC') as FormControl; }
  
  a_Seccion21FG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion21FG']) as UntypedFormGroup; }
  a_s2_FileFC(index: number): UntypedFormControl { return this.a_Seccion21FG(index).get('a_s2_FileFC') as UntypedFormControl; }
  a_s2_PathNameFC(index: number): UntypedFormControl { return this.a_Seccion21FG(index).get('a_s2_PathNameFC') as UntypedFormControl; }
  a_s2_FileExcelFC(index: number): UntypedFormControl { return this.a_Seccion21FG(index).get('a_s2_FileExcelFC') as UntypedFormControl; }
  a_s2_PathNameExcelFC(index: number): UntypedFormControl { return this.a_Seccion21FG(index).get('a_s2_PathNameExcelFC') as UntypedFormControl; }
  
  a_Seccion3FG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion3FG']) as UntypedFormGroup; }
  a_s3_UbicacionFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_UbicacionFC') as UntypedFormControl; }
  a_s3_DepartamentoFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_DepartamentoFC') as UntypedFormControl; }
  a_s3_ProvinciaFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_ProvinciaFC') as UntypedFormControl; }
  a_s3_DistritoFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_DistritoFC') as UntypedFormControl; }
  a_s3_LOGraFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_LOGraFC') as UntypedFormControl; }
  a_s3_LOMinFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_LOMinFC') as UntypedFormControl; }
  a_s3_LOSegFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_LOSegFC') as UntypedFormControl; }
  a_s3_LSGraFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_LSGraFC') as UntypedFormControl; }
  a_s3_LSMinFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_LSMinFC') as UntypedFormControl; }
  a_s3_LSSegFC(index: number): UntypedFormControl { return this.a_Seccion3FG(index).get('a_s3_LSSegFC') as UntypedFormControl; }
  a_Seccion3aFG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion3aFG']) as UntypedFormGroup; }
  a_s3a_EquipoFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_EquipoFC') as UntypedFormControl; }
  a_s3a_MarcaFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_MarcaFC') as UntypedFormControl; }
  a_s3a_ModeloFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_ModeloFC') as UntypedFormControl; }
  a_s3a_NroSerieFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_NroSerieFC') as UntypedFormControl; }
  a_s3a_PotenciaFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_PotenciaFC') as UntypedFormControl; }
  a_s3a_BandFrecFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_BandFrecFC') as UntypedFormControl; }
  a_s3a_VelocidadFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_VelocidadFC') as UntypedFormControl; }
  a_s3a_NroCanalesFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_NroCanalesFC') as UntypedFormControl; }
  a_s3a_ConfiguraFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_ConfiguraFC') as UntypedFormControl; }
  a_s3a_AnchoBandFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_AnchoBandFC') as UntypedFormControl; }
  a_s3a_CodHomoFC(index: number): UntypedFormControl { return this.a_Seccion3aFG(index).get('a_s3a_CodHomoFC') as UntypedFormControl; }
  a_s3a_AntenaFG(index: number): UntypedFormGroup { return this.a_Seccion3aFG(index).get('a_s3a_AntenaFG') as UntypedFormGroup; }
  a_s3a_an_TipoFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_TipoFC') as UntypedFormControl; }
  a_s3a_an_MarcaFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_MarcaFC') as UntypedFormControl; }
  a_s3a_an_ModeloFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_ModeloFC') as UntypedFormControl; }
  a_s3a_an_CodHomoFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_CodHomoFC') as UntypedFormControl; }
  a_s3a_an_GananciaFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_GananciaFC') as UntypedFormControl; }
  a_s3a_an_DiametroFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_DiametroFC') as UntypedFormControl; }
  a_s3a_an_AcimutRadFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_AcimutRadFC') as UntypedFormControl; }
  a_s3a_an_ElevacionFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_ElevacionFC') as UntypedFormControl; }
  a_s3a_an_DistanciaFC(index: number): UntypedFormControl { return this.a_s3a_AntenaFG(index).get('a_s3a_an_DistanciaFC') as UntypedFormControl; }
  a_Seccion4FG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion4FG']) as UntypedFormGroup; }
  a_s4_UbicacionFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_UbicacionFC') as UntypedFormControl; }
  a_s4_DepartamentoFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_DepartamentoFC') as UntypedFormControl; }
  a_s4_ProvinciaFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_ProvinciaFC') as UntypedFormControl; }
  a_s4_DistritoFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_DistritoFC') as UntypedFormControl; }
  a_s4_LOGraFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_LOGraFC') as UntypedFormControl; }
  a_s4_LOMinFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_LOMinFC') as UntypedFormControl; }
  a_s4_LOSegFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_LOSegFC') as UntypedFormControl; }
  a_s4_LSGraFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_LSGraFC') as UntypedFormControl; }
  a_s4_LSMinFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_LSMinFC') as UntypedFormControl; }
  a_s4_LSSegFC(index: number): UntypedFormControl { return this.a_Seccion4FG(index).get('a_s4_LSSegFC') as UntypedFormControl; }
  a_Seccion4aFG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion4aFG']) as UntypedFormGroup; }
  a_s4a_EquipoFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_EquipoFC') as UntypedFormControl; }
  a_s4a_MarcaFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_MarcaFC') as UntypedFormControl; }
  a_s4a_ModeloFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_ModeloFC') as UntypedFormControl; }
  a_s4a_NroSerieFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_NroSerieFC') as UntypedFormControl; }
  a_s4a_PotenciaFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_PotenciaFC') as UntypedFormControl; }
  a_s4a_BandFrecFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_BandFrecFC') as UntypedFormControl; }
  a_s4a_VelocidadFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_VelocidadFC') as UntypedFormControl; }
  a_s4a_NroCanalesFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_NroCanalesFC') as UntypedFormControl; }
  a_s4a_ConfiguraFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_ConfiguraFC') as UntypedFormControl; }
  a_s4a_AnchoBandFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_AnchoBandFC') as UntypedFormControl; }
  a_s4a_CodHomoFC(index: number): UntypedFormControl { return this.a_Seccion4aFG(index).get('a_s4a_CodHomoFC') as UntypedFormControl; }
  a_s4a_AntenaFG(index: number): UntypedFormGroup { return this.a_Seccion4aFG(index).get('a_s4a_AntenaFG') as UntypedFormGroup; }
  a_s4a_an_TipoFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_TipoFC') as UntypedFormControl; }
  a_s4a_an_MarcaFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_MarcaFC') as UntypedFormControl; }
  a_s4a_an_ModeloFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_ModeloFC') as UntypedFormControl; }
  a_s4a_an_CodHomoFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_CodHomoFC') as UntypedFormControl; }
  a_s4a_an_GananciaFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_GananciaFC') as UntypedFormControl; }
  a_s4a_an_DiametroFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_DiametroFC') as UntypedFormControl; }
  a_s4a_an_AcimutRadFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_AcimutRadFC') as UntypedFormControl; }
  a_s4a_an_ElevacionFC(index: number): UntypedFormControl { return this.a_s4a_AntenaFG(index).get('a_s4a_an_ElevacionFC') as UntypedFormControl; }
  a_Seccion5FG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion5FG']) as UntypedFormGroup; }
  a_s5_ColegioProfFC(index: number): UntypedFormControl { return this.a_Seccion5FG(index).get('a_s5_ColegioProfFC') as UntypedFormControl; }
  a_s5_NroColegiaFC(index: number): UntypedFormControl { return this.a_Seccion5FG(index).get('a_s5_NroColegiaFC') as UntypedFormControl; }
  a_Seccion6FG(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'a_Seccion6FG']) as UntypedFormGroup; }
  a_s6_declaracion1FC(index: number): UntypedFormControl { return this.a_Seccion6FG(index).get('a_s6_declaracion1FC') as UntypedFormControl; }
  // FIN GET FORM anexoFG

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId > 0) {

      const dataForm: any = await this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).toPromise();

      this.funcionesMtcService.ocultarCargando();

      const metaDataForm: any = JSON.parse(dataForm.metaData);
      const seccion1 = metaDataForm.seccion1;
      this.modalidadServicio = seccion1.modalidadServicio;
      this.modalidadOtroServicio = seccion1.modalidadOtroServicio;

      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo001_C28NTResponse>(this.dataInput.tramiteReqId).toPromise();
        console.log(JSON.parse(dataAnexo.metaData));
        const { enlacesSolicitados } = JSON.parse(dataAnexo.metaData) as MetaData;

        if (!enlacesSolicitados) {
          this.funcionesMtcService.mensajeError('Ha ocurrido un error al intentar obtener el anexo, por favor intentelo nuevamente o contactese con nosotros');
          return;
        }

        this.idAnexo = dataAnexo.anexoId;

        for (let i = 0; i < enlacesSolicitados.length; i++) {
          this.addEnlaceSolicitadoFG();
          const {
            seccion2,
            seccion3,
            seccion3a,
            seccion4,
            seccion4a,
            seccion5,
            seccion6,
            seccion7
          } = enlacesSolicitados[i];
          /** */
          this.a_Seccion2FG(i).enable();
          this.a_Seccion21FG(i).enable();
          this.a_Seccion3FG(i).enable();
          this.a_Seccion3aFG(i).enable();
          this.a_Seccion4FG(i).enable();
          this.a_Seccion4aFG(i).enable();
          this.a_Seccion5FG(i).enable();
          this.a_Seccion6FG(i).enable();
          console.log("Habilitado 4: " + this.a_Seccion4FG(i).enabled);
          /** */
          this.a_s2_PathNameExcelFC(i).setValue(seccion2.pathNameExcel);

          if (this.a_Seccion2FG(i).enabled) {
            /*const { analogico, digital } = seccion2;
            this.a_s2_an_FijoFC(i).setValue(analogico.fijo);
            this.a_s2_an_MovilFC(i).setValue(analogico.movil);
            this.a_s2_di_FijoFC(i).setValue(digital.fijo);
            this.a_s2_di_MovilFC(i).setValue(digital.movil);*/
            this.a_s2_AnalogicoFG(i).setValue(seccion2.analogico);
            this.a_s2_DigitalFG(i).setValue(seccion2.digital);

          }

          if (this.a_Seccion3FG(i).enabled) {
            const { departamento, provincia, distrito, lonOeste, latSur } = seccion3;
            this.a_s3_UbicacionFC(i).setValue(seccion3.ubicacion);

            setTimeout(async () => {
              await this.ubigeoEstFija1Component
                ?.find((_, indx) => indx === i)
                .setUbigeoByText(departamento, provincia, distrito);
            }, 500);

            this.a_s3_LOGraFC(i).setValue(lonOeste.grados);
            this.a_s3_LOMinFC(i).setValue(lonOeste.minutos);
            this.a_s3_LOSegFC(i).setValue(lonOeste.segundos);
            this.a_s3_LSGraFC(i).setValue(latSur.grados);
            this.a_s3_LSMinFC(i).setValue(latSur.minutos);
            this.a_s3_LSSegFC(i).setValue(latSur.segundos);
          }

          if (this.a_Seccion3aFG(i).enabled) {
            const { antena } = seccion3a;
            this.a_s3a_EquipoFC(i).setValue(seccion3a.equipo);
            this.a_s3a_MarcaFC(i).setValue(seccion3a.marca);
            this.a_s3a_ModeloFC(i).setValue(seccion3a.modelo);
            this.a_s3a_NroSerieFC(i).setValue(seccion3a.nroSerie);
            this.a_s3a_PotenciaFC(i).setValue(seccion3a.potencia);
            this.a_s3a_BandFrecFC(i).setValue(seccion3a.bandaFrec);
            this.a_s3a_VelocidadFC(i).setValue(seccion3a.velocidad);
            this.a_s3a_NroCanalesFC(i).setValue(seccion3a.nroCanales);
            this.a_s3a_ConfiguraFC(i).setValue(seccion3a.configuracion);
            this.a_s3a_AnchoBandFC(i).setValue(seccion3a.anchoBanda);
            this.a_s3a_CodHomoFC(i).setValue(seccion3a.codHomologa);

            this.a_s3a_an_TipoFC(i).setValue(antena.tipo);
            this.a_s3a_an_MarcaFC(i).setValue(antena.marca);
            this.a_s3a_an_ModeloFC(i).setValue(antena.modelo);
            this.a_s3a_an_CodHomoFC(i).setValue(antena.codHomologa);
            this.a_s3a_an_GananciaFC(i).setValue(antena.ganancia);
            this.a_s3a_an_DiametroFC(i).setValue(antena.diametro);
            this.a_s3a_an_AcimutRadFC(i).setValue(antena.acimutRadia);
            this.a_s3a_an_ElevacionFC(i).setValue(antena.elevacion);
            this.a_s3a_an_DistanciaFC(i).setValue(antena.distancia);
          }

          if (this.a_Seccion4FG(i).enabled) {
            const { departamento, provincia, distrito, lonOeste, latSur } = seccion4;
            this.a_s4_UbicacionFC(i).setValue(seccion4.ubicacion);

            setTimeout(async () => {
              await this.ubigeoEstFija2Component
                ?.find((_, indx) => indx === i)
                .setUbigeoByText(departamento, provincia, distrito);
            }, 500);

            this.a_s4_LOGraFC(i).setValue(lonOeste.grados);
            this.a_s4_LOMinFC(i).setValue(lonOeste.minutos);
            this.a_s4_LOSegFC(i).setValue(lonOeste.segundos);
            this.a_s4_LSGraFC(i).setValue(latSur.grados);
            this.a_s4_LSMinFC(i).setValue(latSur.minutos);
            this.a_s4_LSSegFC(i).setValue(latSur.segundos);
         }

          if (this.a_Seccion4aFG(i).enabled) {
            const { antena } = seccion4a;
            this.a_s4a_EquipoFC(i).setValue(seccion4a.equipo);
            this.a_s4a_MarcaFC(i).setValue(seccion4a.marca);
            this.a_s4a_ModeloFC(i).setValue(seccion4a.modelo);
            this.a_s4a_NroSerieFC(i).setValue(seccion4a.nroSerie);
            this.a_s4a_PotenciaFC(i).setValue(seccion4a.potencia);
            this.a_s4a_BandFrecFC(i).setValue(seccion4a.bandaFrec);
            this.a_s4a_VelocidadFC(i).setValue(seccion4a.velocidad);
            this.a_s4a_NroCanalesFC(i).setValue(seccion4a.nroCanales);
            this.a_s4a_ConfiguraFC(i).setValue(seccion4a.configuracion);
            this.a_s4a_AnchoBandFC(i).setValue(seccion4a.anchoBanda);
            this.a_s4a_CodHomoFC(i).setValue(seccion4a.codHomologa);

            this.a_s4a_an_TipoFC(i).setValue(antena.tipo);
            this.a_s4a_an_MarcaFC(i).setValue(antena.marca);
            this.a_s4a_an_ModeloFC(i).setValue(antena.modelo);
            this.a_s4a_an_CodHomoFC(i).setValue(antena.codHomologa);
            this.a_s4a_an_GananciaFC(i).setValue(antena.ganancia);
            this.a_s4a_an_DiametroFC(i).setValue(antena.diametro);
            this.a_s4a_an_AcimutRadFC(i).setValue(antena.acimutRadia);
            this.a_s4a_an_ElevacionFC(i).setValue(antena.elevacion);
          }

          if (this.a_Seccion5FG(i).enabled) {
            const { colegioPro, nroColegiatura } = seccion5;
            this.a_s5_ColegioProfFC(i).setValue(colegioPro);
            this.a_s5_NroColegiaFC(i).setValue(nroColegiatura);
          }

          if (this.a_Seccion6FG(i).enabled) {
            const { declaracion1 } = seccion6;
            this.a_s6_declaracion1FC(i).setValue(declaracion1);
          }

          if (i === 0) {
            this.nroDocumento = seccion7.nroDocumento;
            this.nombreCompleto = seccion7.nombreCompleto;
            this.razonSocial = seccion7.razonSocial;
          }

          this.a_Activo(i).setValue(true);
          
          setTimeout(()=>{
            /*for (const key in this.a_Seccion2FG(i).controls) {
              this.a_Seccion2FG(i).get(key).clearValidators();
              this.a_Seccion2FG(i).get(key).updateValueAndValidity();
              this.a_Seccion2FG(i).get(key).disable({onlySelf:true,emitEvent:true})
            }*/
            
            for (const key in this.a_Seccion3FG(i).controls) {
              if(key!='a_s3_DepartamentoFC' && key!='a_s3_ProvinciaFC' && key != 'a_s3_DistritoFC'){
                this.a_Seccion3FG(i).get(key).clearValidators();
                this.a_Seccion3FG(i).get(key).updateValueAndValidity();
                this.a_Seccion3FG(i).get(key).disable({onlySelf:true,emitEvent:false})
              }
            }
            
            for (const key in this.a_s3a_AntenaFG(i).controls) {
              this.a_s3a_AntenaFG(i).get(key).clearValidators();
              this.a_s3a_AntenaFG(i).get(key).updateValueAndValidity();
            }

            for (const key in this.a_Seccion3aFG(i).controls) {
              this.a_Seccion3aFG(i).get(key).clearValidators();
              this.a_Seccion3aFG(i).get(key).updateValueAndValidity();
              this.a_Seccion3aFG(i).get(key).disable({onlySelf:true,emitEvent:false});
            }
            this.a_Seccion4FG(i).enable();

            for (const key in this.a_Seccion4FG(i).controls) {
              
              if(key!='a_s4_DepartamentoFC' && key!='a_s4_ProvinciaFC' && key != 'a_s4_DistritoFC'){
                this.a_Seccion4FG(i).get(key).clearValidators();
                this.a_Seccion4FG(i).get(key).updateValueAndValidity();
                this.a_Seccion4FG(i).get(key).disable({onlySelf:true,emitEvent:false});
              }else{
                if(key == 'a_s4_DistritoFC'){
                  this.a_s4_DistritoFC(i).clearValidators();
                  this.a_s4_DistritoFC(i).updateValueAndValidity();
                  //this.a_s4_DistritoFC(i).disable({onlySelf:true,emitEvent:false});
                }
                if(key == 'a_s4_ProvinciaFC'){
                  this.a_s4_ProvinciaFC(i).clearValidators();
                  this.a_s4_ProvinciaFC(i).updateValueAndValidity();
                  //this.a_s4_ProvinciaFC(i).disable({onlySelf:true,emitEvent:false});
                }
                if(key == 'a_s4_DepartamentoFC'){
                  this.a_s4_DepartamentoFC(i).clearValidators();
                  this.a_s4_DepartamentoFC(i).updateValueAndValidity();
                  //this.a_s4_DepartamentoFC(i).disable({onlySelf:true,emitEvent:true});
                }
              }
            }
            
            
            for (const key in this.a_s4a_AntenaFG(i).controls) {
              this.a_s4a_AntenaFG(i).get(key).clearValidators();
              this.a_s4a_AntenaFG(i).get(key).updateValueAndValidity();
              this.a_s4a_AntenaFG(i).get(key).disable({onlySelf:true,emitEvent:false});
            }
            
            for (const key in this.a_Seccion4aFG(i).controls) {
              if(key!="a_s4a_AntenaFG"){
                this.a_Seccion4aFG(i).get(key).clearValidators();
                this.a_Seccion4aFG(i).get(key).updateValueAndValidity();
                this.a_Seccion4aFG(i).get(key).disable({onlySelf:true,emitEvent:false});
              }
            }

            
          });
        }

        switch(this.modalidadOtroServicio){
          case "ayudaMeteorologiaFija": this.txtServicioSolicitado = this.txtServicioSolicitado + " - " + "Ayudas a la Meteorologia (Fijo)"; 
                                        break;
          case "efmAnalogico":  this.txtServicioSolicitado = this.txtServicioSolicitado + " - " + "Enlace Fijo por Microondas (Analógico)";   
                                for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
                                  this.a_s2_DigitalFG(i).clearAsyncValidators();
                                  this.a_s2_DigitalFG(i).disable();
                                  this.a_s2_DigitalFG(i).updateValueAndValidity();
  
                                  this.a_s2_AnalogicoFG(i).setValue('fijo');
                                  this.a_s2_AnalogicoFG(i).disable();
                                }
                                break;
          case "enlaceFijoMicro": this.txtServicioSolicitado = this.txtServicioSolicitado + " - " + "Enlace fijo por microondas (Digital)";  
                                  for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
                                    this.a_s2_AnalogicoFG(i).clearValidators();
                                    this.a_s2_AnalogicoFG(i).disable();
                                    this.a_s2_AnalogicoFG(i).updateValueAndValidity();
  
                                    this.a_s2_DigitalFG(i).setValue('fijo');
                                    this.a_s2_DigitalFG(i).disable();
                                  }
                                  break;
        }
      }
      catch (e) {
        console.error(e);
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    } else {  // SI ES NUEVO
      // Por defecto se agrega un anexo
      this.addEnlaceSolicitadoFG();
      await this.cargarDatosSolicitante(this.dataInput.tramiteReqRefId);

      if(this.modalidadOtroServicio=="enlaceFijoMicro") {
        for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
          this.a_s3a_VelocidadFC(i).clearValidators();
          this.a_s4a_VelocidadFC(i).clearValidators();

          /*this.a_Seccion4aFG(i).get('a_s4a_VelocidadFC').clearValidators();
          this.a_Seccion4aFG(i).get('a_s4a_NroCanalesFC').clearValidators();*/
          //this.a_s2_AnalogicoFG(i).clearValidators();

          this.a_s3a_NroCanalesFC(i).setValidators([Validators.required]);
          this.a_s4a_NroCanalesFC(i).setValidators([Validators.required]);

          this.a_s3a_NroCanalesFC(i).updateValueAndValidity();
          this.a_s4a_NroCanalesFC(i).updateValueAndValidity();
        }
      }

      if(this.modalidadOtroServicio=="efmAnalogico") {
        for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
          this.a_s3a_NroCanalesFC(i).clearValidators();
          this.a_s4a_NroCanalesFC(i).clearValidators();
          
          this.a_s3a_VelocidadFC(i).setValidators([Validators.required]);
          this.a_s4a_VelocidadFC(i).setValidators([Validators.required]);
          this.a_s3a_VelocidadFC(i).updateValueAndValidity();
          this.a_s4a_VelocidadFC(i).updateValueAndValidity();
        }
      }

      setTimeout(()=>{
        //this.a_Seccion2FG(0).disable();
        this.a_Seccion3FG(0).disable();
        this.a_Seccion3aFG(0).disable();
        this.a_Seccion4FG(0).disable();
        this.a_Seccion4aFG(0).disable();
        this.a_Seccion5FG(0).disable();
        this.a_Seccion6FG(0).disable();
      })
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

  eliminarAdjuntoExcel(fileAdjuntoFC: UntypedFormControl, pathNameAdjuntoFC: UntypedFormControl): void {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el archivo adjunto?')
      .then(() => {
        fileAdjuntoFC.setValue(null);
        pathNameAdjuntoFC.setValue(null);
        this.fileExcelSeleccionado = null;
        this.setFormulario();
        this.addEnlaceSolicitadoFG();
        this.a_Seccion2FG(0).disable({ emitEvent: true });
        this.a_Seccion3FG(0).disable({ emitEvent: true });
        this.a_Seccion3aFG(0).disable({ emitEvent: true });
        this.a_Seccion4FG(0).disable({ emitEvent: true });
        this.a_Seccion4aFG(0).disable({ emitEvent: true });
        this.a_Seccion5FG(0).disable({ emitEvent: true });
        this.a_Seccion6FG(0).disable({ emitEvent: true });
        this.a_Activo(0).setValue(false);
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 001-C/28';
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
  }

  async downloadFileExcel(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    try {
      const response: Blob = await this.visorPdfArchivosService.getExcel(this.a_s2_PathNameExcelFC(0).value).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(response);
      downloadLink.setAttribute('download', this.a_s2_PathNameExcelFC(0).value);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.parentNode.removeChild(downloadLink);
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo EXCEL');
    }
  }

  async cargarDatosSolicitante(FormularioId:number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();

    this.funcionesMtcService.ocultarCargando();

    const metaDataForm: any = JSON.parse(dataForm.metaData);
    const seccion1 = metaDataForm.seccion1;
    this.modalidadServicio = seccion1.modalidadServicio;
    this.modalidadOtroServicio = seccion1.modalidadOtroServicio;

    switch(this.modalidadOtroServicio){
        case "ayudaMeteorologiaFija": this.txtServicioSolicitado = this.txtServicioSolicitado + " - " + "Ayudas a la Meteorologia (Fijo)"; 
                                      break;
        case "efmAnalogico":  this.txtServicioSolicitado = this.txtServicioSolicitado + " - " + "Enlace Fijo por Microondas (Analógico)";   
        
                              for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
                                this.a_s2_DigitalFG(i).clearValidators();
                                this.a_s2_DigitalFG(i).updateValueAndValidity();
                                this.a_s2_DigitalFG(i).disable();

                                this.a_s2_AnalogicoFG(i).setValue('fijo');
                                this.a_s2_AnalogicoFG(i).disable();
                              }

                              break;
        case "enlaceFijoMicro": this.txtServicioSolicitado = this.txtServicioSolicitado + " - " + "Enlace fijo por Microondas (Digital) aa";  
                                
                                for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
                                  this.a_s2_AnalogicoFG(i).clearValidators();
                                  this.a_s2_AnalogicoFG(i).updateValueAndValidity();
                                  this.a_s2_AnalogicoFG(i).disable();

                                  this.a_s2_DigitalFG(i).setValue('fijo');
                                  this.a_s2_DigitalFG(i).disable();
                                }
                                break;
    }

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

    const dataGuardar = new Anexo001_C28NTRequest();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'A';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // -------------------------------------

    const { enlacesSolicitados } = dataGuardar.metaData;

    if (!this.a_AnexosFA.controls) {
      this.funcionesMtcService.mensajeError('Debe solicitar al menos un enlace');
      return;
    }

    for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
      enlacesSolicitados[i] = new EnlaceSolicitado();
      const { seccion2, seccion3, seccion3a, seccion4, seccion4a, seccion5, seccion6, seccion7 } = enlacesSolicitados[i];

      // SECCION 2:
      /*const { analogico, digital } = seccion2;
      analogico.fijo = this.a_s2_an_FijoFC(i).value ?? false;
      analogico.movil = this.a_s2_an_MovilFC(i).value ?? false;
      digital.fijo = this.a_s2_di_FijoFC(i).value ?? false;
      digital.movil = this.a_s2_di_MovilFC(i).value ?? false;*/
      seccion2.analogico = this.a_s2_AnalogicoFG(i).value;
      seccion2.digital = this.a_s2_DigitalFG(i).value;

      //if(i==0){
        seccion2.file = this.a_s2_FileFC(i).value ?? null;
        seccion2.pathName = this.a_s2_PathNameFC(i).value ?? '';
        seccion2.fileExcel = this.fileExcelSeleccionado ?? null;
        seccion2.pathNameExcel = this.a_s2_PathNameExcelFC(i).value ?? '';
      //}
      // -------------------------------------
      // SECCION 3:
      const { lonOeste: s3lonOeste, latSur: s3latSur } = seccion3;
      seccion3.ubicacion = this.a_s3_UbicacionFC(i).value ?? '';

      const s3Departamento = this.ubigeoEstFija1Component
        ?.find((_, indx) => indx === i)
        ?.getDepartamentoText();
      const s3Provincia = this.ubigeoEstFija1Component
        ?.find((_, indx) => indx === i)
        ?.getProvinciaText();
      const s3Distrito = this.ubigeoEstFija1Component
        ?.find((_, indx) => indx === i)
        ?.getDistritoText();

      seccion3.departamento = s3Departamento ?? '';
      seccion3.provincia = s3Provincia ?? '';
      seccion3.distrito = s3Distrito ?? '';
      s3lonOeste.grados = this.a_s3_LOGraFC(i).value ?? '';
      s3lonOeste.minutos = this.a_s3_LOMinFC(i).value ?? '';
      s3lonOeste.segundos = this.a_s3_LOSegFC(i).value ?? '';
      s3latSur.grados = this.a_s3_LSGraFC(i).value ?? '';
      s3latSur.minutos = this.a_s3_LSMinFC(i).value ?? '';
      s3latSur.segundos = this.a_s3_LSSegFC(i).value ?? '';
      // -------------------------------------
      // SECCION 3a:
      const { antena: s3Antena } = seccion3a;
      seccion3a.equipo = this.a_s3a_EquipoFC(i).value ?? '';
      seccion3a.marca = this.a_s3a_MarcaFC(i).value ?? '';
      seccion3a.modelo = this.a_s3a_ModeloFC(i).value ?? '';
      seccion3a.nroSerie = this.a_s3a_NroSerieFC(i).value ?? '';
      seccion3a.potencia = this.a_s3a_PotenciaFC(i).value ?? '';
      seccion3a.bandaFrec = this.a_s3a_BandFrecFC(i).value ?? '';
      seccion3a.velocidad = this.a_s3a_VelocidadFC(i).value ?? '';
      seccion3a.nroCanales = this.a_s3a_NroCanalesFC(i).value ?? '';
      seccion3a.configuracion = this.a_s3a_ConfiguraFC(i).value ?? '';
      seccion3a.anchoBanda = this.a_s3a_AnchoBandFC(i).value ?? '';
      seccion3a.codHomologa = this.a_s3a_CodHomoFC(i).value ?? '';

      s3Antena.tipo = this.a_s3a_an_TipoFC(i).value ?? '';
      s3Antena.marca = this.a_s3a_an_MarcaFC(i).value ?? '';
      s3Antena.modelo = this.a_s3a_an_ModeloFC(i).value ?? '';
      s3Antena.codHomologa = this.a_s3a_an_CodHomoFC(i).value ?? '';
      s3Antena.ganancia = this.a_s3a_an_GananciaFC(i).value ?? '';
      s3Antena.diametro = this.a_s3a_an_DiametroFC(i).value ?? '';
      s3Antena.acimutRadia = this.a_s3a_an_AcimutRadFC(i).value ?? '';
      s3Antena.elevacion = this.a_s3a_an_ElevacionFC(i).value ?? '';
      s3Antena.distancia = this.a_s3a_an_DistanciaFC(i).value ?? '';
      // -------------------------------------
      // SECCION 4:
      const { lonOeste: s4lonOeste, latSur: s4latSur } = seccion4;
      seccion4.ubicacion = this.a_s4_UbicacionFC(i).value ?? '';

      const s4Departamento = this.ubigeoEstFija2Component
        ?.find((_, indx) => indx === i)
        ?.getDepartamentoText();
      const s4Provincia = this.ubigeoEstFija2Component
        ?.find((_, indx) => indx === i)
        ?.getProvinciaText();
      const s4Distrito = this.ubigeoEstFija2Component
        ?.find((_, indx) => indx === i)
        ?.getDistritoText();

      seccion4.departamento = s4Departamento ?? '';
      seccion4.provincia = s4Provincia ?? '';
      seccion4.distrito = s4Distrito ?? '';
      s4lonOeste.grados = this.a_s4_LOGraFC(i).value ?? '';
      s4lonOeste.minutos = this.a_s4_LOMinFC(i).value ?? '';
      s4lonOeste.segundos = this.a_s4_LOSegFC(i).value ?? '';
      s4latSur.grados = this.a_s4_LSGraFC(i).value ?? '';
      s4latSur.minutos = this.a_s4_LSMinFC(i).value ?? '';
      s4latSur.segundos = this.a_s4_LSSegFC(i).value ?? '';
      // -------------------------------------
      // SECCION 4a:
      const { antena: s4Antena } = seccion4a;
      seccion4a.equipo = this.a_s4a_EquipoFC(i).value ?? '';
      seccion4a.marca = this.a_s4a_MarcaFC(i).value ?? '';
      seccion4a.modelo = this.a_s4a_ModeloFC(i).value ?? '';
      seccion4a.nroSerie = this.a_s4a_NroSerieFC(i).value ?? '';
      seccion4a.potencia = this.a_s4a_PotenciaFC(i).value ?? '';
      seccion4a.bandaFrec = this.a_s4a_BandFrecFC(i).value ?? '';
      seccion4a.velocidad = this.a_s4a_VelocidadFC(i).value ?? '';
      seccion4a.nroCanales = this.a_s4a_NroCanalesFC(i).value ?? '';
      seccion4a.configuracion = this.a_s4a_ConfiguraFC(i).value ?? '';
      seccion4a.anchoBanda = this.a_s4a_AnchoBandFC(i).value ?? '';
      seccion4a.codHomologa = this.a_s4a_CodHomoFC(i).value ?? '';

      s4Antena.tipo = this.a_s4a_an_TipoFC(i).value ?? '';
      s4Antena.marca = this.a_s4a_an_MarcaFC(i).value ?? '';
      s4Antena.modelo = this.a_s4a_an_ModeloFC(i).value ?? '';
      s4Antena.codHomologa = this.a_s4a_an_CodHomoFC(i).value ?? '';
      s4Antena.ganancia = this.a_s4a_an_GananciaFC(i).value ?? '';
      s4Antena.diametro = this.a_s4a_an_DiametroFC(i).value ?? '';
      s4Antena.acimutRadia = this.a_s4a_an_AcimutRadFC(i).value ?? '';
      s4Antena.elevacion = this.a_s4a_an_ElevacionFC(i).value ?? '';
      // -------------------------------------
      // SECCION 5:
      seccion5.colegioPro = this.a_s5_ColegioProfFC(i).value ?? '';
      seccion5.nroColegiatura = this.a_s5_NroColegiaFC(i).value ?? '';
      // -------------------------------------
      // SECCION 6:
      seccion6.declaracion1 = this.a_s6_declaracion1FC(i).value ?? false;
      // -------------------------------------
      // SECCION 7:
      seccion7.nroDocumento = this.nroDocumento;
      seccion7.nombreCompleto = this.nombreCompleto;
      seccion7.razonSocial = this.razonSocial;
      // -------------------------------------
    }

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

  async downloadPlantilla(plantilla:string): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    try {
      if(plantilla!=''){
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

  async onChangeInputExcel(event): Promise<void> {
    if (event.target.files.length === 0) {
      return;
    }

    if (event.target.files[0].type !== 'application/vnd.ms-excel' && event.target.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos Excel');
      return;
    }

    this.fileExcelSeleccionado = event.target.files[0];
    this.a_s2_PathNameExcelFC(0).setValue(null);
    event.target.value = '';
    this.valExcel = 1;

    console.log("Plantilla:"+this.plantilla);

    let archivoExcel:requestExcel = new requestExcel();
    archivoExcel.fileExcel = this.fileExcelSeleccionado;
    archivoExcel.pathName = '';
    archivoExcel.nombrePlantilla = this.plantilla;
    
    const archivoExcelFormData = this.funcionesMtcService.jsonToFormData(archivoExcel);
    console.log(archivoExcelFormData);

    this.funcionesMtcService.mostrarCargando();
    try {
      const datosExcel: responseExcel = await this.excelArchivosService.readExcel(archivoExcelFormData).toPromise();
      this.funcionesMtcService.ocultarCargando();

      console.log(datosExcel);
      if(datosExcel.resultado){
        this.funcionesMtcService.mensajeOk(datosExcel.message);
        this.a_Seccion2FG(0).enable({emitEvent:true});
        this.a_Seccion3FG(0).enable({emitEvent:true});
        this.a_Seccion3aFG(0).enable({emitEvent:true});
        this.a_Seccion4FG(0).enable({emitEvent:true});
        this.a_Seccion4aFG(0).enable({emitEvent:true});
        this.a_Seccion5FG(0).enable({emitEvent:true});
        this.a_Seccion6FG(0).enable({emitEvent:true});
        
        //this.a_s2_TerrestreFC(0).setValue(datosExcel.banda?.trim());
        this.a_s3_UbicacionFC(0).setValue(datosExcel.ubicacion);
        this.a_s3_LOGraFC(0).setValue(datosExcel.lonOeste_grados);
        this.a_s3_LOMinFC(0).setValue(datosExcel.lonOeste_minutos);
        this.a_s3_LOSegFC(0).setValue(datosExcel.lonOeste_segundos);
        this.a_s3_LSGraFC(0).setValue(datosExcel.latSur_grados);
        this.a_s3_LSMinFC(0).setValue(datosExcel.latSur_minutos);
        this.a_s3_LSSegFC(0).setValue(datosExcel.latSur_segundos);
        this.a_s3a_MarcaFC(0).setValue(datosExcel.marca);
        this.a_s3a_ModeloFC(0).setValue(datosExcel.modelo);
        this.a_s3a_CodHomoFC(0).setValue(datosExcel.codHomologa);
        this.a_s3a_PotenciaFC(0).setValue(datosExcel.potencia);
        this.a_s3a_BandFrecFC(0).setValue(datosExcel.bandaFrec);
        this.a_s3a_NroSerieFC(0).setValue(datosExcel.nroSerie);
        this.a_s3a_AnchoBandFC(0).setValue(datosExcel.canal);
        this.a_s3a_VelocidadFC(0).setValue(datosExcel.velocidad);
        this.a_s3a_an_MarcaFC(0).setValue(datosExcel.antena_marca);
        this.a_s3a_an_ModeloFC(0).setValue(datosExcel.antena_modelo);
        this.a_s3a_an_GananciaFC(0).setValue(datosExcel.antena_ganancia);
        /*this.a_s3a_an_AltTorreFC(0).setValue(datosExcel.antena_alturaTorre);
        this.a_s3a_an_AltRadFC(0).setValue(datosExcel.antena_alturaRadia);
        this.a_s4_PortZonaOperFC(0).setValue(datosExcel.zonaOperacionML);
        this.a_s4_VehiPlacaFC(0).setValue(datosExcel.placaRodajeML);*/

        switch(parseInt(this.codigoTipoSolicitudTupa)){
          case 1: break;
          case 2: break;
          case 5: break;
          case 6: this.a_s2_DigitalFG(0).setValue('fijo');
                  break;
        }
        
      
        /*
        await this.ubigeoEstFija1Component?.setUbigeoByText(
          datosExcel.departamento,
          datosExcel.provincia,
          datosExcel.distrito);*/
        setTimeout(()=>{
          for (const key in this.a_Seccion2FG(0).controls) {
              this.a_Seccion2FG(0).get(key).clearValidators();
              this.a_Seccion2FG(0).get(key).updateValueAndValidity();
              this.a_Seccion2FG(0).get(key).disable({onlySelf:true,emitEvent:false})
          }

          for (const key in this.a_Seccion3FG(0).controls) {
            if(key!='a_s3_DepartamentoFC' && key!='a_s3_ProvinciaFC' && key != 'a_s3_DistritoFC'){
              this.a_Seccion3FG(0).get(key).clearValidators();
              this.a_Seccion3FG(0).get(key).updateValueAndValidity();
              this.a_Seccion3FG(0).get(key).disable({onlySelf:true,emitEvent:false})
            }
          }

          for (const key in this.a_s3a_AntenaFG(0).controls) {
            this.a_s3a_AntenaFG(0).get(key).clearValidators();
            this.a_s3a_AntenaFG(0).get(key).updateValueAndValidity();
            //this.a_s3a_AntenaFG.get(key).disable({onlySelf:true,emitEvent:false});
          }

          for (const key in this.a_Seccion3aFG(0).controls) {
            this.a_Seccion3aFG(0).get(key).clearValidators();
            this.a_Seccion3aFG(0).get(key).updateValueAndValidity();
            this.a_Seccion3aFG(0).get(key).disable({onlySelf:true,emitEvent:false});
          }
          
          for (const key in this.a_Seccion4FG(0).controls) {
            this.a_Seccion4FG(0).get(key).clearValidators();
            this.a_Seccion4FG(0).get(key).updateValueAndValidity();
            this.a_Seccion4FG(0).get(key).disable({onlySelf:true,emitEvent:false});
          }

          for (const key in this.a_s4a_AntenaFG(0).controls) {
            this.a_s4a_AntenaFG(0).get(key).clearValidators();
            this.a_s4a_AntenaFG(0).get(key).updateValueAndValidity();
          }

          for (const key in this.a_Seccion4aFG(0).controls) {
            this.a_Seccion4aFG(0).get(key).clearValidators();
            this.a_Seccion4aFG(0).get(key).updateValueAndValidity();
            this.a_Seccion4aFG(0).get(key).disable({onlySelf:true,emitEvent:false});
          }

          this.a_Activo(0).setValue(true);
        });
      }else{
        this.funcionesMtcService.mensajeError(datosExcel.message);
      }
    }
    catch{

    }
  }

}
