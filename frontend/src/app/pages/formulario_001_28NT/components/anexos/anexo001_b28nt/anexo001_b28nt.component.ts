/**
 * Anexo 001-B/28
 * @author André Bernabé Pérez
 * @version 1.0 21.04.2022
 * @author Alicia Toquila
 * @version 2.0 01.04.2023
 */

import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { fileMaxSizeValidator, noWhitespaceValidator, requireCheckboxesToBeCheckedValidator, requiredFileTypeValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_B28NT/MetaData';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Anexo001B28NTService } from 'src/app/core/services/anexos/anexo001-b28NT.service';
import { Anexo001_B28NTRequest } from 'src/app/core/models/Anexos/Anexo001_B28NT/Anexo001_B28NTRequest';
import { Anexo001_B28NTResponse } from 'src/app/core/models/Anexos/Anexo001_B28NT/Anexo001_B28NTResponse';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { ExcelArchivosService } from '../../../../../core/services/tramite/excel-archivos.service';
import { requestExcel, responseExcel } from 'src/app/core/models/ExcelModel';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo001_b28',
  templateUrl: './anexo001_b28nt.component.html',
  styleUrls: ['./anexo001_b28nt.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo001_b28nt_Component implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @Input() fileFormLabel = '';

  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;
  @ViewChild('ubigeoCmpEstFija2') ubigeoEstFija2Component: UbigeoComponent;

  txtTitulo = 'ANEXO 001-B/28 PERFIL DEL PROYECTO TÉCNICO Teleservicio privado móvil (Terrestre, Marítimo y Aeronáutico)';
  txtServicioSolicitado: string ="";
  
  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFG: UntypedFormGroup;

  tipoSolicitante: string;
  modalidadServicio:string;

  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;

  datosUsuarioLogin: DatosUsuarioLogin;

  tipoDocumento = '';
  nroDocumento = '';
  nroRuc = '';
  nombreCompleto = '';
  razonSocial = '';

  platillaAntenas = 'ANEXO_001_B28NT_ANTEN.xlsx';
  platillaEquipos = 'ANEXO_001_B28NT_EQUIP.xlsx';

  plantillaFijoTerrestre  = 'ExcelHomologado_FijoTerrestre.xlsx';
  plantillaMicroondas     = 'ExcelHomologado_Microondas.xlsx';
  plantillaMoviAeronautico= 'ExcelHomologado_MovilAeronautico.xlsx';
  plantillaMovilMaritimo  = 'ExcelHomologado_MovilMaritimo.xlsx';
  plantillaMovilTerrestre = 'ExcelHomologado_MovilTerrestre.xlsx';
  plantillaSatelital      = 'ExcelHomologado_Satelital.xlsx';

  plantilla:string ='';
  fileExcelSeleccionado: any = null;
  valExcel = 0;

  servicioTerrestre:boolean=false;
  servicioAeronautico:boolean=false;
  servicioMaritimo:boolean=false;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001B28NTService,
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
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario
    
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
      case 1 : // Terrestre
               /*this.a_s2_AeronauticoFC.clearValidators(); 
               this.a_s2_MaritimoFC.clearValidators();
               this.a_s4a_an_AltTorreFC.clearValidators();
               this.a_s4a_an_AltRadFC.clearValidators();
               
               this.a_s2_AeronauticoFC.disable();
               this.a_s2_MaritimoFC.disable();
               this.a_s4a_an_AltTorreFC.disable();
               this.a_s4a_an_AltRadFC.disable();*/

               this.plantilla = this.plantillaMovilTerrestre;
               this.servicioTerrestre=true;
               this.servicioAeronautico=false;
               this.servicioMaritimo=false;
               
               break;

      case 2 : this.a_s2_TerrestreFC.clearValidators(); // Aeronautico
               this.a_s2_MaritimoFC.clearValidators();
               
               this.a_s2_TerrestreFC.disable();
               //this.a_s2_MaritimoFC.disable();
               this.plantilla = this.plantillaMoviAeronautico;
               this.servicioTerrestre=false;
               this.servicioAeronautico=true;
               this.servicioMaritimo=false;
               console.log("Plantilla:" + this.plantilla);
               break;

      case 4 : this.a_s2_MaritimoFC.clearValidators(); // Valor añadido móvil
               this.a_s2_AeronauticoFC.clearValidators();
               
               this.a_s2_MaritimoFC.disable();
               this.a_s2_AeronauticoFC.disable();
               this.plantilla = this.plantillaMovilTerrestre;
               this.servicioTerrestre=true;
               this.servicioAeronautico=false;
               this.servicioMaritimo=false;
               break;
      case 5 : this.a_s2_TerrestreFC.clearValidators();  // Marítimo
               this.a_s2_AeronauticoFC.clearValidators();

               this.a_s2_TerrestreFC.disable();
               this.a_s2_AeronauticoFC.disable();
               this.plantilla = this.plantillaMovilMaritimo;
               this.servicioTerrestre=false;
               this.servicioAeronautico=false;
               this.servicioMaritimo=true;
               break;
      case 8 : 
               this.a_s2_MaritimoFC.clearValidators(); // Móvil troncalizado privado 
               this.a_s2_AeronauticoFC.clearValidators();

               
               this.a_s2_MaritimoFC.disable();
               this.a_s2_AeronauticoFC.disable();
               this.plantilla = this.plantillaMovilTerrestre;
               this.servicioTerrestre=true;
               this.servicioAeronautico=false;
               this.servicioMaritimo=false;
               break;
      case 12: /*this.a_s2_TerrestreFC.clearValidators(); // Radiolocalización móvil
               this.a_s2_MaritimoFC.clearValidators(); 
               this.a_s2_AeronauticoFC.clearValidators();

               this.a_s2_TerrestreFC.disable();
               this.a_s2_MaritimoFC.disable();
               this.a_s2_AeronauticoFC.disable();*/
               this.plantilla="";
               this.a_s2_TerrestreFC.clearValidators(); // Radiolocalización móvil
               this.a_s2_AeronauticoFC.clearValidators();
               this.a_s2_MaritimoFC.clearValidators();
               this.a_s2_TerrestreFC.updateValueAndValidity();
               this.a_s2_AeronauticoFC.updateValueAndValidity();
               this.a_s2_MaritimoFC.updateValueAndValidity();
               this.a_Seccion2FG.disable();
               for (const key in this.a_Seccion3FG.controls) {
                this.a_Seccion3FG.get(key).clearValidators();
                this.a_Seccion3FG.get(key).updateValueAndValidity();
               }

               for (const key in this.a_Seccion3aFG.controls) {
                this.a_Seccion3aFG.get(key).clearValidators();
                this.a_Seccion3aFG.get(key).updateValueAndValidity();
               }

               for (const key in this.a_s3a_AntenaFG.controls) {
                this.a_s3a_AntenaFG.get(key).clearValidators();
                this.a_s3a_AntenaFG.get(key).updateValueAndValidity();
               }
               break;
      case 15: break; // Banda ciudadana / móvil marítimo por satélite // Radionavegación aeronáutica móvil / Radionavegación Marítima
    }
  }

  setFormulario(){
    this.anexoFG = this.fb.group({

      a_FileFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['pdf'])]],
      a_PathNameFC: [''],
      a_FileExcelFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['xlsx'])]],
      a_PathNameExcelFC: [''],
      a_Activo:[false,[Validators.requiredTrue]],
      a_Seccion2FG: this.fb.group({
        a_s2_TerrestreFC:[{disable:true}, [Validators.required]],
        a_s2_MaritimoFC: this.fb.group({
          a_s2_MariHfFC: [false],
          a_s2_MariVhfFC: [false],
          a_s2_MariUhfFC: [false]
        } as AbstractControlOptions),
        a_s2_AeronauticoFC: this.fb.group({
          a_s2_AeroHfFC: [false],
          a_s2_AeroVhfFC: [false],
          a_s2_AeroUhfFC: [false],
        } as AbstractControlOptions),
        
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
        a_s3a_CantidadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.min(1), Validators.max(999)]],
        a_s3a_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_NroSerieFC: ['', [Validators.maxLength(20)]],
        a_s3a_PotenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s3a_BandFrecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s3a_CodHomoFC: ['', [Validators.maxLength(20)]],
        /*a_s3a_FileFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['pdf'])]],
        a_s3a_PathNameFC: [''],*/
        a_s3a_AntenaFG: this.fb.group({
          a_s3a_an_TipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s3a_an_GananciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s3a_an_CodHomoFC: ['', [Validators.maxLength(20)]],
          a_s3a_an_AltTorreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s3a_an_AltRadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          /*a_s3a_an_FileFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['pdf'])]],
          a_s3a_an_PathNameFC: [''],*/
        }),
      }),
      a_Seccion4FG: this.fb.group({
        a_s4_PortZonaOperFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(40)]],
        a_s4_VehiZonaOperFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4_VehiPlacaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4_EmbarMatriFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4_AeroMatriFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
      }),
      a_Seccion4aFG: this.fb.group({
        a_s4a_EquipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_CantidadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.min(1), Validators.max(999)]],
        a_s4a_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_NroSerieFC: ['', [Validators.maxLength(20)]],
        a_s4a_PotenciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
        a_s4a_BandFrecFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        a_s4a_CodHomoFC: ['', [Validators.maxLength(20)]],
        /*a_s4a_FileFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['pdf'])]],
        a_s4a_PathNameFC: [''],*/
        a_s4a_AntenaFG: this.fb.group({
          a_s4a_an_TipoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_MarcaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_ModeloFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
          a_s4a_an_GananciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s4a_an_CodHomoFC: ['', [Validators.maxLength(20)]],
          a_s4a_an_AltTorreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          a_s4a_an_AltRadFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(10)]],
          /*a_s4a_an_FileFC: [null, [fileMaxSizeValidator(4194304), requiredFileTypeValidator(['pdf'])]],
          a_s4a_an_PathNameFC: [''],*/
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
  }
  // GET FORM anexoFG
  get a_FileFC(): UntypedFormControl { return this.anexoFG.get('a_FileFC') as UntypedFormControl; }
  get a_PathNameFC(): UntypedFormControl { return this.anexoFG.get('a_PathNameFC') as UntypedFormControl; }
  get a_FileExcelFC(): UntypedFormControl { return this.anexoFG.get('a_FileExcelFC') as UntypedFormControl; }
  get a_PathNameExcelFC(): UntypedFormControl { return this.anexoFG.get('a_PathNameExcelFC') as UntypedFormControl; }
  get a_Activo(): UntypedFormControl { return this.anexoFG.get('a_Activo') as UntypedFormControl}

  get a_Seccion2FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup; }
  get a_s2_TerrestreFC(): UntypedFormControl { return this.a_Seccion2FG.get('a_s2_TerrestreFC') as UntypedFormControl; }
  
  get a_s2_MaritimoFC(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_MaritimoFC') as UntypedFormGroup; }
  get a_s2_MariHfFC(): UntypedFormControl { return this.a_s2_MaritimoFC.get('a_s2_MariHfFC') as UntypedFormControl; }
  get a_s2_MariVhfFC(): UntypedFormControl { return this.a_s2_MaritimoFC.get('a_s2_MariVhfFC') as UntypedFormControl; }
  get a_s2_MariUhfFC(): UntypedFormControl { return this.a_s2_MaritimoFC.get('a_s2_MariUhfFC') as UntypedFormControl; }
  
  get a_s2_AeronauticoFC(): UntypedFormGroup { return this.a_Seccion2FG.get('a_s2_AeronauticoFC') as UntypedFormGroup; }
  get a_s2_AeroHfFC(): UntypedFormControl { return this.a_s2_AeronauticoFC.get('a_s2_AeroHfFC') as UntypedFormControl; }
  get a_s2_AeroVhfFC(): UntypedFormControl { return this.a_s2_AeronauticoFC.get('a_s2_AeroVhfFC') as UntypedFormControl; }
  get a_s2_AeroUhfFC(): UntypedFormControl { return this.a_s2_AeronauticoFC.get('a_s2_AeroUhfFC') as UntypedFormControl; }

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
  get a_Seccion3aFG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3aFG') as UntypedFormGroup; }
  get a_s3a_EquipoFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_EquipoFC') as UntypedFormControl; }
  get a_s3a_CantidadFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_CantidadFC') as UntypedFormControl; }
  get a_s3a_MarcaFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_MarcaFC') as UntypedFormControl; }
  get a_s3a_ModeloFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_ModeloFC') as UntypedFormControl; }
  get a_s3a_NroSerieFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_NroSerieFC') as UntypedFormControl; }
  get a_s3a_PotenciaFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_PotenciaFC') as UntypedFormControl; }
  get a_s3a_BandFrecFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_BandFrecFC') as UntypedFormControl; }
  get a_s3a_CodHomoFC(): UntypedFormControl { return this.a_Seccion3aFG.get('a_s3a_CodHomoFC') as UntypedFormControl; }
  /*get a_s3a_FileFC(): FormControl { return this.a_Seccion3aFG.get('a_s3a_FileFC') as FormControl; }
  get a_s3a_PathNameFC(): FormControl { return this.a_Seccion3aFG.get('a_s3a_PathNameFC') as FormControl; }*/
  get a_s3a_AntenaFG(): UntypedFormGroup { return this.a_Seccion3aFG.get('a_s3a_AntenaFG') as UntypedFormGroup; }
  get a_s3a_an_TipoFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_TipoFC') as UntypedFormControl; }
  get a_s3a_an_MarcaFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_MarcaFC') as UntypedFormControl; }
  get a_s3a_an_ModeloFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_ModeloFC') as UntypedFormControl; }
  get a_s3a_an_GananciaFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_GananciaFC') as UntypedFormControl; }
  get a_s3a_an_CodHomoFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_CodHomoFC') as UntypedFormControl; }
  get a_s3a_an_AltTorreFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_AltTorreFC') as UntypedFormControl; }
  get a_s3a_an_AltRadFC(): UntypedFormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_AltRadFC') as UntypedFormControl; }
  /*get a_s3a_an_FileFC(): FormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_FileFC') as FormControl; }
  get a_s3a_an_PathNameFC(): FormControl { return this.a_s3a_AntenaFG.get('a_s3a_an_PathNameFC') as FormControl; }*/
  get a_Seccion4FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion4FG') as UntypedFormGroup; }
  get a_s4_PortZonaOperFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_PortZonaOperFC') as UntypedFormControl; }
  get a_s4_VehiZonaOperFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_VehiZonaOperFC') as UntypedFormControl; }
  get a_s4_VehiPlacaFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_VehiPlacaFC') as UntypedFormControl; }
  get a_s4_EmbarMatriFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_EmbarMatriFC') as UntypedFormControl; }
  get a_s4_AeroMatriFC(): UntypedFormControl { return this.a_Seccion4FG.get('a_s4_AeroMatriFC') as UntypedFormControl; }
  get a_Seccion4aFG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion4aFG') as UntypedFormGroup; }
  get a_s4a_EquipoFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_EquipoFC') as UntypedFormControl; }
  get a_s4a_CantidadFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_CantidadFC') as UntypedFormControl; }
  get a_s4a_MarcaFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_MarcaFC') as UntypedFormControl; }
  get a_s4a_ModeloFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_ModeloFC') as UntypedFormControl; }
  get a_s4a_NroSerieFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_NroSerieFC') as UntypedFormControl; }
  get a_s4a_PotenciaFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_PotenciaFC') as UntypedFormControl; }
  get a_s4a_BandFrecFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_BandFrecFC') as UntypedFormControl; }
  get a_s4a_CodHomoFC(): UntypedFormControl { return this.a_Seccion4aFG.get('a_s4a_CodHomoFC') as UntypedFormControl; }
  /*get a_s4a_FileFC(): FormControl { return this.a_Seccion4aFG.get('a_s4a_FileFC') as FormControl; }
  get a_s4a_PathNameFC(): FormControl { return this.a_Seccion4aFG.get('a_s4a_PathNameFC') as FormControl; }*/
  get a_s4a_AntenaFG(): UntypedFormGroup { return this.a_Seccion4aFG.get('a_s4a_AntenaFG') as UntypedFormGroup; }
  get a_s4a_an_TipoFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_TipoFC') as UntypedFormControl; }
  get a_s4a_an_MarcaFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_MarcaFC') as UntypedFormControl; }
  get a_s4a_an_ModeloFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_ModeloFC') as UntypedFormControl; }
  get a_s4a_an_GananciaFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_GananciaFC') as UntypedFormControl; }
  get a_s4a_an_CodHomoFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_CodHomoFC') as UntypedFormControl; }
  get a_s4a_an_AltTorreFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_AltTorreFC') as UntypedFormControl; }
  get a_s4a_an_AltRadFC(): UntypedFormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_AltRadFC') as UntypedFormControl; }
  /*get a_s4a_an_FileFC(): FormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_FileFC') as FormControl; }
  get a_s4a_an_PathNameFC(): FormControl { return this.a_s4a_AntenaFG.get('a_s4a_an_PathNameFC') as FormControl; }*/
  get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
  get a_s5_ColegioProfFC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_ColegioProfFC') as UntypedFormControl; }
  get a_s5_NroColegiaFC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_NroColegiaFC') as UntypedFormControl; }
  get a_Seccion6FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion6FG') as UntypedFormGroup; }
  get a_s6_declaracion1FC(): UntypedFormControl { return this.a_Seccion6FG.get('a_s6_declaracion1FC') as UntypedFormControl; }
  // FIN GET FORM anexoFG

  /*public addValidators(form: FormGroup) {
    for (const key in form.controls) {
        form.get(key).setValidators(this.validationType[key]);
        form.get(key).updateValueAndValidity();
    }
  }*/

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo001_B28NTResponse>(this.dataInput.tramiteReqId).toPromise();
        console.log(JSON.parse(dataAnexo.metaData));
        const {
          seccion2,
          seccion3,
          seccion3a,
          seccion4,
          seccion4a,
          seccion5,
          seccion6,
          seccion7
        } = JSON.parse(dataAnexo.metaData) as MetaData;

        this.idAnexo = dataAnexo.anexoId;

        this.a_PathNameExcelFC.setValue(seccion2.pathNameExcel);

        if (this.a_Seccion2FG.enabled) {
          let { mariBanda, aeroBanda } = seccion2;
          this.a_s2_TerrestreFC.setValue(seccion2.terreBanda);
          this.a_s2_MariHfFC.setValue(mariBanda.hf);
          this.a_s2_MariVhfFC.setValue(mariBanda.vhf);
          this.a_s2_MariUhfFC.setValue(mariBanda.uhf);
          
          this.a_s2_AeroHfFC.setValue(aeroBanda.hf);
          this.a_s2_AeroVhfFC.setValue(aeroBanda.vhf);
          this.a_s2_AeroUhfFC.setValue(aeroBanda.uhf);

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
        }

        if (this.a_Seccion3aFG.enabled) {
          const { antena } = seccion3a;
          this.a_s3a_EquipoFC.setValue(seccion3a.equipo);
          this.a_s3a_CantidadFC.setValue(seccion3a.cantidad);
          this.a_s3a_MarcaFC.setValue(seccion3a.marca);
          this.a_s3a_ModeloFC.setValue(seccion3a.modelo);
          this.a_s3a_NroSerieFC.setValue(seccion3a.nroSerie);
          this.a_s3a_PotenciaFC.setValue(seccion3a.potencia);
          this.a_s3a_BandFrecFC.setValue(seccion3a.bandaFrec);
          this.a_s3a_CodHomoFC.setValue(seccion3a.codHomologa);
          //this.a_s3a_PathNameFC.setValue(seccion3a.pathName);

          this.a_s3a_an_TipoFC.setValue(antena.tipo);
          this.a_s3a_an_MarcaFC.setValue(antena.marca);
          this.a_s3a_an_ModeloFC.setValue(antena.modelo);
          this.a_s3a_an_GananciaFC.setValue(antena.ganancia);
          this.a_s3a_an_CodHomoFC.setValue(antena.codHomologa);
          this.a_s3a_an_AltTorreFC.setValue(antena.alturaTorre);
          this.a_s3a_an_AltRadFC.setValue(antena.alturaRadia);
          //this.a_s3a_an_PathNameFC.setValue(antena.pathName);
        }

        if (this.a_Seccion4FG.enabled) {
          const { portZonaOpera, vehiZonaOpera, vehiPlaca, EmbarMatricula, AeroMatricula } = seccion4;
          this.a_s4_PortZonaOperFC.setValue(portZonaOpera);
          this.a_s4_VehiZonaOperFC.setValue(vehiZonaOpera);
          this.a_s4_VehiPlacaFC.setValue(vehiPlaca);
          this.a_s4_EmbarMatriFC.setValue(EmbarMatricula);
          this.a_s4_AeroMatriFC.setValue(AeroMatricula);
        }

        if (this.a_Seccion4aFG.enabled) {
          const { antena } = seccion4a;
          this.a_s4a_EquipoFC.setValue(seccion4a.equipo);
          this.a_s4a_CantidadFC.setValue(seccion4a.cantidad);
          this.a_s4a_MarcaFC.setValue(seccion4a.marca);
          this.a_s4a_ModeloFC.setValue(seccion4a.modelo);
          this.a_s4a_NroSerieFC.setValue(seccion4a.nroSerie);
          this.a_s4a_PotenciaFC.setValue(seccion4a.potencia);
          this.a_s4a_BandFrecFC.setValue(seccion4a.bandaFrec);
          this.a_s4a_CodHomoFC.setValue(seccion4a.codHomologa);
          //this.a_s4a_PathNameFC.setValue(seccion4a.pathName);

          this.a_s4a_an_TipoFC.setValue(antena.tipo);
          this.a_s4a_an_MarcaFC.setValue(antena.marca);
          this.a_s4a_an_ModeloFC.setValue(antena.modelo);
          this.a_s4a_an_GananciaFC.setValue(antena.ganancia);
          this.a_s4a_an_CodHomoFC.setValue(antena.codHomologa);
          this.a_s4a_an_AltTorreFC.setValue(antena.alturaTorre);
          this.a_s4a_an_AltRadFC.setValue(antena.alturaRadia);
          //this.a_s4a_an_PathNameFC.setValue(antena.pathName);
        }

        if (this.a_Seccion5FG.enabled) {
          const { colegioPro, nroColegiatura } = seccion5;
          this.a_s5_ColegioProfFC.setValue(colegioPro);
          this.a_s5_NroColegiaFC.setValue(nroColegiatura);
        }

        if (this.a_Seccion6FG.enabled) {
          const { declaracion1 } = seccion6;
          this.a_s6_declaracion1FC.setValue(declaracion1);
        }

        this.nroDocumento = seccion7.nroDocumento;
        this.nombreCompleto = seccion7.nombreCompleto;
        this.razonSocial = seccion7.razonSocial;

        setTimeout(()=>{
          for (const key in this.a_Seccion2FG.controls) {
              if(this.servicioTerrestre){
                this.a_Seccion2FG.get(key).clearValidators();
                this.a_Seccion2FG.get(key).updateValueAndValidity();
                this.a_Seccion2FG.get(key).disable({onlySelf:true,emitEvent:false})
              }
          }
  
          for (const key in this.a_Seccion3FG.controls) {
            if(key!='a_s3_DepartamentoFC' && key!='a_s3_ProvinciaFC' && key != 'a_s3_DistritoFC'){
              this.a_Seccion3FG.get(key).clearValidators();
              this.a_Seccion3FG.get(key).updateValueAndValidity();
              this.a_Seccion3FG.get(key).disable({onlySelf:true,emitEvent:false})
            }
          }
  
          for (const key in this.a_s3a_AntenaFG.controls) {
            this.a_s3a_AntenaFG.get(key).clearValidators();
            this.a_s3a_AntenaFG.get(key).updateValueAndValidity();
          }
  
          for (const key in this.a_Seccion3aFG.controls) {
            this.a_Seccion3aFG.get(key).clearValidators();
            this.a_Seccion3aFG.get(key).updateValueAndValidity();
            this.a_Seccion3aFG.get(key).disable({onlySelf:true,emitEvent:false});
          }
          
          for (const key in this.a_Seccion4FG.controls) {
            this.a_Seccion4FG.get(key).clearValidators();
            this.a_Seccion4FG.get(key).updateValueAndValidity();
            this.a_Seccion4FG.get(key).disable({onlySelf:true,emitEvent:false});
          }
  
          for (const key in this.a_s4a_AntenaFG.controls) {
            this.a_s4a_AntenaFG.get(key).clearValidators();
            this.a_s4a_AntenaFG.get(key).updateValueAndValidity();
          }
  
          for (const key in this.a_Seccion4aFG.controls) {
            this.a_Seccion4aFG.get(key).clearValidators();
            this.a_Seccion4aFG.get(key).updateValueAndValidity();
            this.a_Seccion4aFG.get(key).disable({onlySelf:true,emitEvent:false});
          }
  
          this.a_Activo.setValue(true);
        });
      }
      catch (e) {
        console.error(e);
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    } else {  // SI ES NUEVO
      await this.cargarDatosSolicitante(this.dataInput.tramiteReqRefId);
      setTimeout(()=>{
        this.a_Seccion2FG.disable();
        this.a_Seccion3FG.disable();
        this.a_Seccion3aFG.disable();
        this.a_Seccion4FG.disable();
        this.a_Seccion4aFG.disable();
        this.a_Seccion5FG.disable();
        this.a_Seccion6FG.disable();
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
        this.a_Seccion2FG.disable({ emitEvent: true });
        this.a_Seccion3FG.disable({ emitEvent: true });
        this.a_Seccion3aFG.disable({ emitEvent: true });
        this.a_Seccion4FG.disable({ emitEvent: true });
        this.a_Seccion4aFG.disable({ emitEvent: true });
        this.a_Seccion5FG.disable({ emitEvent: true });
        this.a_Seccion6FG.disable({ emitEvent: true });
        this.a_Activo.setValue(false);
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 001-B/28';
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
      const response: Blob = await this.visorPdfArchivosService.getExcel(this.a_PathNameExcelFC.value).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(response);
      downloadLink.setAttribute('download', this.a_PathNameExcelFC.value);
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

  async downloadPlantEquipa(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    try {
      const response: Blob = await this.visorPdfArchivosService.getPlantilla(this.platillaEquipos).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(response);
      downloadLink.setAttribute('download', this.platillaEquipos);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.parentNode.removeChild(downloadLink);
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
  }

  async downloadPlantAntena(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    try {
      const response: Blob = await this.visorPdfArchivosService.getPlantilla(this.platillaAntenas).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(response);
      downloadLink.setAttribute('download', this.platillaAntenas);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.parentNode.removeChild(downloadLink);
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
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

    if (event.target.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos Excel');
      return;
    }
    /*
    const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
    if (msg !== 'ok') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError(msg);
      return;
    }*/

    this.fileExcelSeleccionado = event.target.files[0];
    this.a_PathNameExcelFC.setValue(null);
    event.target.value = '';
    this.valExcel = 1;

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
        this.a_Seccion2FG.enable({emitEvent:true});
        this.a_Seccion3FG.enable({emitEvent:true});
        this.a_Seccion3aFG.enable({emitEvent:true});
        this.a_Seccion4FG.enable({emitEvent:true});
        this.a_Seccion4aFG.enable({emitEvent:true});
        this.a_Seccion5FG.enable({emitEvent:true});
        this.a_Seccion6FG.enable({emitEvent:true});
        
        this.a_s2_TerrestreFC.setValue(datosExcel.banda?.trim());
        this.a_s3_UbicacionFC.setValue(datosExcel.ubicacion);
        this.a_s3_LOGraFC.setValue(datosExcel.lonOeste_grados);
        this.a_s3_LOMinFC.setValue(datosExcel.lonOeste_minutos);
        this.a_s3_LOSegFC.setValue(datosExcel.lonOeste_segundos);
        this.a_s3_LSGraFC.setValue(datosExcel.latSur_grados);
        this.a_s3_LSMinFC.setValue(datosExcel.latSur_minutos);
        this.a_s3_LSSegFC.setValue(datosExcel.latSur_segundos);
        this.a_s3a_MarcaFC.setValue(datosExcel.marca);
        this.a_s3a_ModeloFC.setValue(datosExcel.modelo);
        this.a_s3a_CodHomoFC.setValue(datosExcel.codHomologa);
        this.a_s3a_PotenciaFC.setValue(datosExcel.potencia);
        this.a_s3a_BandFrecFC.setValue(datosExcel.bandaFrec);
        this.a_s3a_NroSerieFC.setValue(datosExcel.nroSerie);
        this.a_s3a_an_MarcaFC.setValue(datosExcel.antena_marca);
        this.a_s3a_an_ModeloFC.setValue(datosExcel.antena_modelo);
        this.a_s3a_an_GananciaFC.setValue(datosExcel.antena_ganancia);
        this.a_s3a_an_AltTorreFC.setValue(datosExcel.antena_alturaTorre);
        this.a_s3a_an_AltRadFC.setValue(datosExcel.antena_alturaRadia);
        this.a_s4_PortZonaOperFC.setValue(datosExcel.zonaOperacionML);
        this.a_s4_VehiPlacaFC.setValue(datosExcel.placaRodajeML);

        switch(parseInt(this.codigoTipoSolicitudTupa)){
          case 1: break;
          case 2: /**Aeronautico */
                  this.a_s4_PortZonaOperFC.setValue(datosExcel.ma_ZonaOperacion);
                  this.a_s4_AeroMatriFC.setValue(datosExcel.ma_Matricula);
                  this.a_s4a_MarcaFC.setValue(datosExcel.ma_Marca);
                  this.a_s4a_ModeloFC.setValue(datosExcel.ma_Modelo);
                  this.a_s4a_CodHomoFC.setValue(datosExcel.ma_CodHomologa);
                  this.a_s4a_NroSerieFC.setValue(datosExcel.ma_Serie);
                  this.a_s4a_CantidadFC.setValue(datosExcel.ma_Cantidad);
                  this.a_s4a_PotenciaFC.setValue(datosExcel.ma_Potencia);
                  this.a_s4a_BandFrecFC.setValue(datosExcel.ma_Rango);
                  this.a_s4a_CodHomoFC.setValue(datosExcel.ma_CodHomologa);

                  this.a_s4a_an_MarcaFC.setValue(datosExcel.ma_AntenaMarca);
                  this.a_s4a_an_ModeloFC.setValue(datosExcel.ma_AntenaModelo);
                  this.a_s4a_an_GananciaFC.setValue(datosExcel.ma_AntenaGanancia);
                  break;
          case 5: /**Maritimo */
                  this.a_s4_PortZonaOperFC.setValue(datosExcel.ms_ZonaOperacion);
                  this.a_s4_EmbarMatriFC.setValue(datosExcel.ms_Matricula);
                  this.a_s4a_MarcaFC.setValue(datosExcel.ms_Marca);
                  this.a_s4a_ModeloFC.setValue(datosExcel.ms_Modelo);
                  this.a_s4a_CodHomoFC.setValue(datosExcel.ms_CodHomologa);
                  this.a_s4a_NroSerieFC.setValue(datosExcel.ms_Serie);
                  this.a_s4a_CantidadFC.setValue(datosExcel.ms_Cantidad);
                  this.a_s4a_PotenciaFC.setValue(datosExcel.ms_Potencia);
                  this.a_s4a_BandFrecFC.setValue(datosExcel.ms_Rango);
                  this.a_s4a_CodHomoFC.setValue(datosExcel.ms_CodHomologa);

                  this.a_s4a_an_MarcaFC.setValue(datosExcel.ms_AntenaMarca);
                  this.a_s4a_an_ModeloFC.setValue(datosExcel.ms_AntenaModelo);
                  this.a_s4a_an_GananciaFC.setValue(datosExcel.ms_AntenaGanancia);
                  break;
        }
        
      
        /*
        await this.ubigeoEstFija1Component?.setUbigeoByText(
          datosExcel.departamento,
          datosExcel.provincia,
          datosExcel.distrito);*/
        setTimeout(()=>{
          for (const key in this.a_Seccion2FG.controls) {
              this.a_Seccion2FG.get(key).clearValidators();
              this.a_Seccion2FG.get(key).updateValueAndValidity();
              this.a_Seccion2FG.get(key).disable({onlySelf:true,emitEvent:false})
          }

          for (const key in this.a_Seccion3FG.controls) {
            if(key!='a_s3_DepartamentoFC' && key!='a_s3_ProvinciaFC' && key != 'a_s3_DistritoFC'){
              this.a_Seccion3FG.get(key).clearValidators();
              this.a_Seccion3FG.get(key).updateValueAndValidity();
              this.a_Seccion3FG.get(key).disable({onlySelf:true,emitEvent:false})
            }
          }

          for (const key in this.a_s3a_AntenaFG.controls) {
            this.a_s3a_AntenaFG.get(key).clearValidators();
            this.a_s3a_AntenaFG.get(key).updateValueAndValidity();
            //this.a_s3a_AntenaFG.get(key).disable({onlySelf:true,emitEvent:false});
          }

          for (const key in this.a_Seccion3aFG.controls) {
            this.a_Seccion3aFG.get(key).clearValidators();
            this.a_Seccion3aFG.get(key).updateValueAndValidity();
            this.a_Seccion3aFG.get(key).disable({onlySelf:true,emitEvent:false});
          }
          
          for (const key in this.a_Seccion4FG.controls) {
            this.a_Seccion4FG.get(key).clearValidators();
            this.a_Seccion4FG.get(key).updateValueAndValidity();
            this.a_Seccion4FG.get(key).disable({onlySelf:true,emitEvent:false});
          }

          for (const key in this.a_s4a_AntenaFG.controls) {
            this.a_s4a_AntenaFG.get(key).clearValidators();
            this.a_s4a_AntenaFG.get(key).updateValueAndValidity();
          }

          for (const key in this.a_Seccion4aFG.controls) {
            this.a_Seccion4aFG.get(key).clearValidators();
            this.a_Seccion4aFG.get(key).updateValueAndValidity();
            this.a_Seccion4aFG.get(key).disable({onlySelf:true,emitEvent:false});
          }

          this.a_Activo.setValue(true);
        });
      }else{
        this.funcionesMtcService.mensajeError(datosExcel.message);
      }
    }
    catch{

    }
  }

  async cargarDatosSolicitante(FormularioId:number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();

    this.funcionesMtcService.ocultarCargando();

    const metaDataForm: any = JSON.parse(dataForm.metaData);
    const seccion1 = metaDataForm.seccion1;
    this.modalidadServicio = seccion1.modalidadServicio;
    
    // Obtenemos los datos del Solicitante
    console.log(this.tipoSolicitante);
    switch(this.tipoSolicitante){
      case "PJ":this.razonSocial = this.datosUsuarioLogin.razonSocial;
                this.tipoDocumento = '01';
                this.nroDocumento = this.datosUsuarioLogin.nombres + ' ' + this.datosUsuarioLogin.apePaterno + ' ' + this.datosUsuarioLogin.apeMaterno; 
                break;
      
      case "PN"://this.razonSocial = this.datosUsuarioLogin.razonSocial;
                this.tipoDocumento = '01';
                this.nombreCompleto = this.datosUsuarioLogin.nombres + ' ' + this.datosUsuarioLogin.apePaterno + ' ' + this.datosUsuarioLogin.apeMaterno; 
                break;

      case "PE"://this.razonSocial = this.datosUsuarioLogin.razonSocial;
                this.tipoDocumento = '01';
                this.nombreCompleto = this.datosUsuarioLogin.nombres + ' ' + this.datosUsuarioLogin.apePaterno + ' ' + this.datosUsuarioLogin.apeMaterno; 
                break;
    }
    this.funcionesMtcService.ocultarCargando();
  }

  async guardarAnexo(): Promise<void> {
    if (this.anexoFG.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    const dataGuardar = new Anexo001_B28NTRequest();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'B';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // -------------------------------------

    const { seccion2, seccion3, seccion3a, seccion4, seccion4a, seccion5, seccion6, seccion7 } = dataGuardar.metaData;
    console.log("Terrestre: "+this.a_s2_TerrestreFC.value);
    // SECCION 2:
    //let { terreBanda, mariBanda, aeroBanda } = seccion2;
    seccion2.terreBanda = this.a_s2_TerrestreFC.value;
    /*seccion2.mariBanda = this.a_s2_MaritimoFC.value;
    seccion2.aeroBanda = this.a_s2_AeronauticoFC.value ?? '';*/

    seccion2.mariBanda.hf = this.a_s2_MariHfFC.value ?? false;
    seccion2.mariBanda.vhf = this.a_s2_MariVhfFC.value ?? false;
    seccion2.mariBanda.uhf = this.a_s2_MariUhfFC.value ?? false;
    
    seccion2.aeroBanda.hf = this.a_s2_AeroHfFC.value ?? false;
    seccion2.aeroBanda.vhf = this.a_s2_AeroVhfFC.value ?? false;
    seccion2.aeroBanda.uhf = this.a_s2_AeroUhfFC.value ?? false;
    

    seccion2.file = this.a_FileFC.value ?? null;
    seccion2.pathName = this.a_PathNameFC.value ?? '';
    seccion2.fileExcel = this.fileExcelSeleccionado ?? null;
    seccion2.pathNameExcel = this.a_PathNameExcelFC.value ?? '';

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
    // -------------------------------------
    // SECCION 3a:
    const { antena: s3Antena } = seccion3a;
    seccion3a.equipo = this.a_s3a_EquipoFC.value ?? '';
    seccion3a.cantidad = this.a_s3a_CantidadFC.value ?? '';
    seccion3a.marca = this.a_s3a_MarcaFC.value ?? '';
    seccion3a.modelo = this.a_s3a_ModeloFC.value ?? '';
    seccion3a.nroSerie = this.a_s3a_NroSerieFC.value ?? '';
    seccion3a.potencia = this.a_s3a_PotenciaFC.value ?? '';
    seccion3a.bandaFrec = this.a_s3a_BandFrecFC.value ?? '';
    seccion3a.codHomologa = this.a_s3a_CodHomoFC.value ?? '';
    /*seccion3a.file = this.a_s3a_FileFC.value ?? null;
    seccion3a.pathName = this.a_s3a_PathNameFC.value ?? '';*/
    s3Antena.tipo = this.a_s3a_an_TipoFC.value ?? '';
    s3Antena.marca = this.a_s3a_an_MarcaFC.value ?? '';
    s3Antena.modelo = this.a_s3a_an_ModeloFC.value ?? '';
    s3Antena.ganancia = this.a_s3a_an_GananciaFC.value ?? '';
    s3Antena.codHomologa = this.a_s3a_an_CodHomoFC.value ?? '';
    s3Antena.alturaTorre = this.a_s3a_an_AltTorreFC.value ?? '';
    s3Antena.alturaRadia = this.a_s3a_an_AltRadFC.value ?? '';
    /*s3Antena.file = this.a_s3a_an_FileFC.value ?? null;
    s3Antena.pathName = this.a_s3a_an_PathNameFC.value ?? '';*/
    // -------------------------------------
    // SECCION 4:
    seccion4.portZonaOpera = this.a_s4_PortZonaOperFC.value ?? '';
    seccion4.vehiZonaOpera = this.a_s4_VehiZonaOperFC.value ?? '';
    seccion4.vehiPlaca = this.a_s4_VehiPlacaFC.value ?? '';
    seccion4.EmbarMatricula = this.a_s4_EmbarMatriFC.value ?? '';
    seccion4.AeroMatricula = this.a_s4_AeroMatriFC.value ?? '';
    // -------------------------------------
    // SECCION 4a:
    const { antena: s4Antena } = seccion4a;
    seccion4a.equipo = this.a_s4a_EquipoFC.value ?? '';
    seccion4a.cantidad = this.a_s4a_CantidadFC.value ?? '';
    seccion4a.marca = this.a_s4a_MarcaFC.value ?? '';
    seccion4a.modelo = this.a_s4a_ModeloFC.value ?? '';
    seccion4a.nroSerie = this.a_s4a_NroSerieFC.value ?? '';
    seccion4a.potencia = this.a_s4a_PotenciaFC.value ?? '';
    seccion4a.bandaFrec = this.a_s4a_BandFrecFC.value ?? '';
    seccion4a.codHomologa = this.a_s4a_CodHomoFC.value ?? '';
    /*seccion4a.file = this.a_s4a_FileFC.value ?? null;
    seccion4a.pathName = this.a_s4a_PathNameFC.value ?? '';*/
    s4Antena.tipo = this.a_s4a_an_TipoFC.value ?? '';
    s4Antena.marca = this.a_s4a_an_MarcaFC.value ?? '';
    s4Antena.modelo = this.a_s4a_an_ModeloFC.value ?? '';
    s4Antena.ganancia = this.a_s4a_an_GananciaFC.value ?? '';
    s4Antena.codHomologa = this.a_s4a_an_CodHomoFC.value ?? '';
    s4Antena.alturaTorre = this.a_s4a_an_AltTorreFC.value ?? '';
    s4Antena.alturaRadia = this.a_s4a_an_AltRadFC.value ?? '';
    /*s4Antena.file = this.a_s4a_an_FileFC.value ?? null;
    s4Antena.pathName = this.a_s4a_an_PathNameFC.value ?? '';*/
    // -------------------------------------
    // SECCION 5:
    seccion5.colegioPro = this.a_s5_ColegioProfFC.value ?? '';
    seccion5.nroColegiatura = this.a_s5_NroColegiaFC.value ?? '';
    // -------------------------------------
    // SECCION 6:
    seccion6.declaracion1 = this.a_s6_declaracion1FC.value ?? false;
    // -------------------------------------
    // SECCION 7:
    seccion7.nroDocumento = this.nroDocumento;
    seccion7.nombreCompleto = this.nombreCompleto;
    seccion7.razonSocial = this.razonSocial;
    // -------------------------------------

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.log(dataGuardar);

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
