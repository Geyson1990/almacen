import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_C28Request } from '../../../../../core/models/Anexos/Anexo002_C28/Anexo002_C28Request';
import { Anexo002_C28Response } from 'src/app/core/models/Anexos/Anexo002_C28/Anexo002_C28Response';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002C28Service } from '../../../../../core/services/anexos/anexo002-c28.service';
import { Seccion1, Seccion2, Seccion3, Seccion4, Seccion5 } from '../../../../../core/models/Anexos/Anexo002_C28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { toHexString } from 'pdf-lib';


@Component({
  selector: 'app-anexo002-c28',
  templateUrl: './anexo002-c28.component.html',
  styleUrls: ['./anexo002-c28.component.css']
})
export class Anexo002C28Component implements OnInit, AfterViewInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpEstudio') ubigeoEstudioComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpPlanta')  ubigeoPlantaComponent: UbigeoComponent;

  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  public idAnexo: number;
  public formAnexo: UntypedFormGroup;

  /*public filePdfDiagramaSeleccionado: any;
  filePdfDiagramaPathName: string = null;
  filePdfDiagramaRequired: boolean = false;*/

  visibleButtonDiagrama: boolean = false;
  filePdfDiagramaSeleccionado: any = null;
  pathPdfDiagramaSeleccionado: any = null;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  anexoTramiteReqId: number = 0;
  tipoDocumento:string  = "";
  tipoSolicitante:string = "";

  tipoPersona: number;
  dniPersona: string;
  ruc: string;
  
  listaDepartamentos: any = [];
  listaProvincias: any = [];
  listaDistritos: any = [];

  idDep: number;
  idProv: number;

  public suscritos: any[];
  public recordIndexToEdit: number;
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carné de Extranjería' }
  ];


  fechaAnexo: string = "";
  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private ubigeoService: UbigeoService,
    private anexoService: Anexo002C28Service,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private seguridadService: SeguridadService,
  ) {
    
    this.idAnexo = 0;
    this.recordIndexToEdit = -1;
  }

  ngOnInit(): void {
    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoPersona = 1; // persona natural
        this.dniPersona = this.seguridadService.getNumDoc();
        this.tipoSolicitante = 'PN';
        break;

      case '00002':
        this.tipoPersona = 2; // persona juridica
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.tipoSolicitante = 'PJ';
        break;

      case '00003':
        this.tipoPersona = 3;
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        break;

      case '00004':
        this.tipoPersona = 4; // persona extranjera
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = '';
        this.tipoSolicitante = 'PE';
        break;

      case '00005':
        this.tipoPersona = 5; // persona natural con ruc
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.tipoSolicitante = 'PNR';
        break;
    }


    this.uriArchivo = this.dataInput.rutaDocumento;
    this.createForm();
    this.departamentos();

    for (let i = 0; i < this.dataRequisitosInput.length; i++) {

      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }
    }
    //this.recuperarInformacion();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

  }

  async ngAfterViewInit(): Promise<void> {
    await this.datosSolicitante(this.dataInput.tramiteReqRefId);

    setTimeout(async () => {
      await this.cargarDatos();
    });
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      Seccion1:this.fb.group({
          modalidad:['',[Validators.required]],
      }),
      Seccion2:this.fb.group({
          Estudio : this.fb.group({
            est_distrito    : ['',[Validators.required]],
            est_provincia   : ['',[Validators.required]],
            est_departamento: ['',[Validators.required]],
            est_direccion   : ['',[Validators.required]],
            est_LO_grados   : ['',[Validators.required]],
            est_LO_minutos  : ['',[Validators.required]],
            est_LO_segundos : ['',[Validators.required]],
            est_LS_grados   : ['',[Validators.required]],
            est_LS_minutos  : ['',[Validators.required]],
            est_LS_segundos : ['',[Validators.required]]
          }),
          Planta: this.fb.group({
            planta_distrito    : ['',[Validators.required]],
            planta_provincia   : ['',[Validators.required]],
            planta_departamento: ['',[Validators.required]],
            planta_direccion   : ['',[Validators.required]],
            planta_LO_grados   : ['',[Validators.required]],
            planta_LO_minutos  : ['',[Validators.required]],
            planta_LO_segundos : ['',[Validators.required]],
            planta_LS_grados   : ['',[Validators.required]],
            planta_LS_minutos  : ['',[Validators.required]],
            planta_LS_segundos : ['',[Validators.required]]
          }),
          enlace_est_planta : ['',[Validators.required]],
      }),
      Seccion3:this.fb.group({
        potencia              : ['',[Validators.required]],
        perdida               : ['',[Validators.required]],
        sIrrad_Tipo           : ['',[Validators.required]],
        sIrrad_GananciaMaxRad : ['',[Validators.required]],
        sIrrad_AcimutMaxRad   : ['',[Validators.required]],
        sIrrad_AlturaCentroRad: ['',[Validators.required]],
        sIrrad_AlturaTorre    : ['',[Validators.required]],
        diagrama              : [false],
      }),
      Seccion4:this.fb.group({
        declaracion:[true],
      }),
      Seccion5:this.fb.group({
        nombresIngeniero     : ['',[Validators.required]],
        telefonoIngeniero    : ['',[Validators.required]],
        emailIngeniero       : ['',[Validators.required]],
        tipoDocumentoSolicitante:['',[Validators.required]],
        numeroDocumentoSolicitante:['',[Validators.required]],
        nombresSolicitante   :['',[Validators.required]],
      }),
    });
  }

   // GET FORM formularioFG

   get f_Seccion1(): UntypedFormGroup { return this.formAnexo.get('Seccion1') as UntypedFormGroup; }
   get f_s1_modalidad(): AbstractControl  { return this.f_Seccion1.get(['modalidad']) }
   get f_Seccion2(): UntypedFormGroup { return this.formAnexo.get('Seccion2') as UntypedFormGroup; }
   get f_s2_Estudio(): UntypedFormGroup { return this.f_Seccion2.get('Estudio') as UntypedFormGroup; }
   get f_s2_est_distrito():AbstractControl { return this.f_s2_Estudio.get(['est_distrito']); }
   get f_s2_est_provincia():AbstractControl {return this.f_s2_Estudio.get(['est_provincia']);}
   get f_s2_est_departamento(): AbstractControl { return this.f_s2_Estudio.get(['est_departamento']); }
   get f_s2_est_direccion(): AbstractControl { return this.f_s2_Estudio.get(['est_direccion']); }
   get f_s2_est_LO_grados(): AbstractControl { return this.f_s2_Estudio.get(['est_LO_grados']); }
   get f_s2_est_LO_minutos(): AbstractControl { return this.f_s2_Estudio.get(['est_LO_minutos']); }
   get f_s2_est_LO_segundos(): AbstractControl { return this.f_s2_Estudio.get(['est_LO_segundos']); }
   get f_s2_est_LS_grados(): AbstractControl { return this.f_s2_Estudio.get(['est_LS_grados']); }
   get f_s2_est_LS_minutos(): AbstractControl { return this.f_s2_Estudio.get(['est_LS_minutos']); }
   get f_s2_est_LS_segundos(): AbstractControl { return this.f_s2_Estudio.get(['est_LS_segundos']); }
   get f_s2_Planta(): UntypedFormGroup { return this.f_Seccion2.get('Planta') as UntypedFormGroup; }
   get f_s2_planta_distrito():AbstractControl { return this.f_s2_Planta.get(['planta_distrito']); }
   get f_s2_planta_provincia():AbstractControl {return this.f_s2_Planta.get(['planta_provincia']);}
   get f_s2_planta_departamento(): AbstractControl { return this.f_s2_Planta.get(['planta_departamento']); }
   get f_s2_planta_direccion(): AbstractControl { return this.f_s2_Planta.get(['planta_direccion']); }
   get f_s2_planta_LO_grados(): AbstractControl { return this.f_s2_Planta.get(['planta_LO_grados']); }
   get f_s2_planta_LO_minutos(): AbstractControl { return this.f_s2_Planta.get(['planta_LO_minutos']); }
   get f_s2_planta_LO_segundos(): AbstractControl { return this.f_s2_Planta.get(['planta_LO_segundos']); }
   get f_s2_planta_LS_grados(): AbstractControl { return this.f_s2_Planta.get(['planta_LS_grados']); }
   get f_s2_planta_LS_minutos(): AbstractControl { return this.f_s2_Planta.get(['planta_LS_minutos']); }
   get f_s2_planta_LS_segundos(): AbstractControl { return this.f_s2_Planta.get(['planta_LS_segundos']); }
   get f_s2_enlace_est_planta(): AbstractControl { return this.f_Seccion2.get(['enlace_est_planta']); }
   get f_Seccion3(): UntypedFormGroup { return this.formAnexo.get('Seccion3') as UntypedFormGroup; }
   get f_s3_potencia(): AbstractControl {return this.f_Seccion3.get(['potencia']);}
   get f_s3_perdida():AbstractControl {return this.f_Seccion3.get(['perdida']);}
   get f_s3_sIrrad_Tipo():AbstractControl {return this.f_Seccion3.get(['sIrrad_Tipo']);}
   get f_s3_sIrrad_GananciaMaxRad():AbstractControl {return this.f_Seccion3.get(['sIrrad_GananciaMaxRad']);}
   get f_s3_sIrrad_AcimutMaxRad():AbstractControl {return this.f_Seccion3.get(['sIrrad_AcimutMaxRad']);}
   get f_s3_sIrrad_AlturaCentroRad():AbstractControl {return this.f_Seccion3.get(['sIrrad_AlturaCentroRad']);}
   get f_s3_sIrrad_AlturaTorre():AbstractControl {return this.f_Seccion3.get(['sIrrad_AlturaTorre']);}
   get f_s3_diagrama():AbstractControl {return this.f_Seccion3.get(['diagrama']);}
   //get f_s3_pathNameDiagramaRadiacion():AbstractControl {return this.f_Seccion3.get(['pathNameDiagramaRadiacion']);}

   get f_Seccion4(): UntypedFormGroup { return this.formAnexo.get('Seccion4') as UntypedFormGroup; }
   get f_s4_declaracion():AbstractControl {return this.f_Seccion4.get(['declaracion']);}

   get f_Seccion5(): UntypedFormGroup { return this.formAnexo.get('Seccion5') as UntypedFormGroup; }
   get f_s5_nombresIngeniero():AbstractControl {return this.f_Seccion5.get(['nombresIngeniero']);}
   get f_s5_telefonoIngeniero():AbstractControl {return this.f_Seccion5.get(['telefonoIngeniero']);}
   get f_s5_emailIngeniero():AbstractControl {return this.f_Seccion5.get(['emailIngeniero']);}
   get f_s5_tipoDocumentoSolicitante():AbstractControl {return this.f_Seccion5.get(['tipoDocumentoSolicitante']);}
   get f_s5_numeroDocumentoSolicitante():AbstractControl {return this.f_Seccion5.get(['numeroDocumentoSolicitante']);}
   get f_s5_nombresSolicitante():AbstractControl {return this.f_Seccion5.get(['nombresSolicitante']);}
   // FIN GET FORM formularioFG

  async datosSolicitante(FormularioId: number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        console.log(JSON.stringify(metaDataForm));
        //this.tipoDocumento = metaDataForm.seccion1.nroRuc && metaDataForm.seccion1.personaJuridica ? 'RUC' : metaDataForm.seccion1.dni  ? 'DNI' : '';
        this.tipoDocumento = metaDataForm.seccion6.tipoDocumento;
        
        this.f_s1_modalidad.setValue(metaDataForm.seccion2.modalidad);
        this.f_s5_tipoDocumentoSolicitante.setValue(this.tipoDocumento=="01"?"DNI":this.tipoDocumento=="04"?"CE":"");
        this.f_s5_numeroDocumentoSolicitante.setValue(metaDataForm.seccion6.numeroDocumento);
        this.f_s5_nombresSolicitante.setValue(metaDataForm.seccion6.nombresApellidos);



        /*switch(this.tipoDocumento){
          case "01":  this.f_s1_tipoDocumento.setValue("DNI");
                      
                        
                      if(this.tipoSolicitante == 'PN'){
                        this.f_s1_pn_Ruc.clearValidators();
                        this.f_s1_pn_Ruc.updateValueAndValidity();
                      }
                      
                      this.f_s1_pn_Telefono.clearValidators();
                      this.f_s1_pn_Telefono.updateValueAndValidity();

                      break;

          case "04":  this.f_s1_tipoDocumento.setValue("CARNET DE EXTRANJERIA");
                      this.f_s1_pn_Peruano.setValue(false);
                      this.f_s1_pn_Peruano.disable();
                      this.f_s1_pn_Peruano.clearValidators();
                      this.f_s1_pn_Peruano.updateValueAndValidity();
                      this.f_s1_pn_Nacionalidad.enable();
                      this.f_s1_pn_Nacionalidad.setValidators([Validators.required]);
                      this.f_s1_pn_Nacionalidad.updateValueAndValidity();

                      this.f_s1_pn_Telefono.clearValidators();
                      this.f_s1_pn_Telefono.updateValueAndValidity();

                      break;
        }*/
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
      }
    );
  }

  async cargarDatos(): Promise<void> {
    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      this.funcionesMtcService.mostrarCargando();

      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo002_C28Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const metaData: any = JSON.parse(dataAnexo.metaData);
        console.log(metaData);
        this.idAnexo = dataAnexo.anexoId;

        this.f_s1_modalidad.setValue(metaData.seccion1.modalidad);
        this.f_s2_enlace_est_planta.setValue(metaData.seccion2.enlace_est_planta);
        this.f_s2_est_departamento.setValue(metaData.seccion2.est_departamento.id);
        this.f_s2_est_provincia.setValue(metaData.seccion2.est_provincia.id);
        this.f_s2_est_distrito.setValue(metaData.seccion2.est_distrito.id);
        this.f_s2_est_direccion.setValue(metaData.seccion2.est_direccion);
        this.f_s2_est_LO_grados.setValue(metaData.seccion2.est_LO_grados);
        this.f_s2_est_LO_minutos.setValue(metaData.seccion2.est_LO_minutos);
        this.f_s2_est_LO_segundos.setValue(metaData.seccion2.est_LO_segundos);
        this.f_s2_est_LS_grados.setValue(metaData.seccion2.est_LS_grados);
        this.f_s2_est_LS_minutos.setValue(metaData.seccion2.est_LS_minutos);
        this.f_s2_est_LS_segundos.setValue(metaData.seccion2.est_LS_segundos);
        this.f_s2_planta_departamento.setValue(metaData.seccion2.planta_departamento.id);
        this.f_s2_planta_provincia.setValue(metaData.seccion2.planta_provincia.id);
        this.f_s2_planta_distrito.setValue(metaData.seccion2.planta_distrito.id);
        this.f_s2_planta_direccion.setValue(metaData.seccion2.planta_direccion);
        this.f_s2_planta_LO_grados.setValue(metaData.seccion2.planta_LO_grados);
        this.f_s2_planta_LO_minutos.setValue(metaData.seccion2.planta_LO_minutos);
        this.f_s2_planta_LO_segundos.setValue(metaData.seccion2.planta_LO_segundos);
        this.f_s2_planta_LS_grados.setValue(metaData.seccion2.planta_LS_grados);
        this.f_s2_planta_LS_minutos.setValue(metaData.seccion2.planta_LS_minutos);
        this.f_s2_planta_LS_segundos.setValue(metaData.seccion2.planta_LS_segundos);
        
        this.f_s3_perdida.setValue(metaData.seccion3.perdida);
        this.f_s3_potencia.setValue(metaData.seccion3.potencia);
        this.f_s3_sIrrad_Tipo.setValue(metaData.seccion3.sIrrad_Tipo);
        this.f_s3_sIrrad_AcimutMaxRad.setValue(metaData.seccion3.sIrrad_AcimutMaxRad);
        this.f_s3_sIrrad_AlturaCentroRad.setValue(metaData.seccion3.sIrrad_AlturaCentroRad);
        this.f_s3_sIrrad_AlturaTorre.setValue(metaData.seccion3.sIrrad_AlturaTorre);
        this.f_s3_sIrrad_GananciaMaxRad.setValue(metaData.seccion3.sIrrad_GananciaMaxRad);
        this.f_s3_diagrama.setValue(metaData.seccion3.diagrama);

        this.f_s4_declaracion.setValue(metaData.seccion4.declaracion);

        this.f_s5_nombresIngeniero.setValue(metaData.seccion5.nombresIngeniero);
        this.f_s5_emailIngeniero.setValue(metaData.seccion5.emailIngeniero);
        this.f_s5_telefonoIngeniero.setValue(metaData.seccion5.telefonoIngeniero);
        this.f_s5_tipoDocumentoSolicitante.setValue(metaData.seccion5.tipoDocumentoSolicitante);
        this.f_s5_numeroDocumentoSolicitante.setValue(metaData.seccion5.numeroDocumentoSolicitante);
        this.f_s5_nombresSolicitante.setValue(metaData.seccion5.nombresSolicitante);

        this.pathPdfDiagramaSeleccionado = metaData.seccion3.pathNameDiagramaRadiacion;
      } catch (error) {
        console.error('Error cargarDatos: ', error);
        // this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando();
        //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
  
    this.formAnexo.controls['s2_nombresApellidos'].setValue('');
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaAnexo = finalDate;
  }

  onChangeDiagrama() {

    this.visibleButtonDiagrama = this.f_s3_diagrama?.value ?? false;

    if (this.visibleButtonDiagrama === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonDiagrama = false;
        this.f_s3_diagrama.setValue(false);
      });
    } else {
      this.filePdfDiagramaSeleccionado = null;
      this.pathPdfDiagramaSeleccionado = null;
    }
  }

  onChangeInputDiagrama(event) {
    if (event.target.files.length === 0){
      return;
    }

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfDiagramaSeleccionado = event.target.files[0];
    event.target.value = "";
    this.f_s3_diagrama.setValue(true);
  }

  vistaPreviaDiagrama() {
    if(this.pathPdfDiagramaSeleccionado === null || this.filePdfDiagramaSeleccionado!==null){
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfDiagramaSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa - Diagrama de Radiación Horizontal Polar del Arreglo de Antenas";
    }else {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.pathPdfDiagramaSeleccionado).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
          
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Diagrama de Radiación Horizontal Polar del Arreglo de Antenas";

          //this.filePdfDiagramaSeleccionado = file;

          //this.visualizarDialogoPdfDiagrama();
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    }
  }

  
  visualizarDialogoPdfDiagrama() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfDiagramaSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Diagrama de Radiación Horizontal Polar del Arreglo de Antenas";
  }

  save(){
    const dataGuardar: Anexo002_C28Request = new Anexo002_C28Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    /*
    const departamento: UbigeoResponse = new UbigeoResponse();
    departamento.id = this.f_s2_est_departamento.value;
    departamento.descripcion = this.ubigeoEstudioComponent.getDepartamentoText();

    const provincia: UbigeoResponse = new UbigeoResponse();
    provincia.id = this.f_s2_est_provincia.value;
    provincia.descripcion = this.ubigeoEstudioComponent.getProvinciaText();
    
    const distrito: UbigeoResponse = new UbigeoResponse();
    distrito.id = this.f_s2_est_distrito.value;
    distrito.descripcion = this.ubigeoEstudioComponent.getDistritoText();
   
    console.log("Departamento: "+this.f_s2_est_departamento.value);
    console.log("Provincia: "+this.f_s2_est_provincia.value);
    console.log("Distrito: "+this.f_s2_est_distrito.value);*/
    

    let seccion1: Seccion1 = new Seccion1();
    seccion1.modalidad = this.f_s1_modalidad.value;

    let seccion2: Seccion2 = new Seccion2();
    seccion2.enlace_est_planta = this.f_s2_enlace_est_planta.value;
    seccion2.est_distrito.id = this.f_s2_est_distrito.value;
    seccion2.est_distrito.descripcion = this.ubigeoEstudioComponent.getDistritoText();
    seccion2.est_provincia.id = this.f_s2_est_provincia.value;
    seccion2.est_provincia.descripcion = this.ubigeoEstudioComponent.getProvinciaText();
    seccion2.est_departamento.id = this.f_s2_est_departamento.value;
    seccion2.est_departamento.descripcion = this.ubigeoEstudioComponent.getDepartamentoText();
    seccion2.est_direccion = this.f_s2_est_direccion.value;
    seccion2.est_LO_grados = this.f_s2_est_LO_grados.value;
    seccion2.est_LO_minutos = this.f_s2_est_LO_minutos.value;
    seccion2.est_LO_segundos = this.f_s2_est_LO_segundos.value;
    seccion2.est_LS_grados = this.f_s2_est_LS_grados.value;
    seccion2.est_LS_minutos = this.f_s2_est_LS_minutos.value;
    seccion2.est_LS_segundos = this.f_s2_est_LS_segundos.value;

    seccion2.planta_distrito.id = this.f_s2_planta_distrito.value;
    seccion2.planta_distrito.descripcion = this.ubigeoPlantaComponent.getDistritoText();;
    seccion2.planta_provincia.id = this.f_s2_planta_provincia.value;
    seccion2.planta_provincia.descripcion = this.ubigeoPlantaComponent.getProvinciaText();
    seccion2.planta_departamento.id = this.f_s2_planta_departamento.value;
    seccion2.planta_departamento.descripcion = this.ubigeoPlantaComponent.getDepartamentoText();
    seccion2.planta_direccion = this.f_s2_planta_direccion.value;
    seccion2.planta_LO_grados = this.f_s2_planta_LO_grados.value;
    seccion2.planta_LO_minutos = this.f_s2_planta_LO_minutos.value;
    seccion2.planta_LO_segundos = this.f_s2_planta_LO_segundos.value;
    seccion2.planta_LS_grados = this.f_s2_planta_LS_grados.value;
    seccion2.planta_LS_minutos = this.f_s2_planta_LS_minutos.value;
    seccion2.planta_LS_segundos = this.f_s2_planta_LS_segundos.value;

    let seccion3: Seccion3 = new Seccion3();
    seccion3.potencia = this.f_s3_potencia.value;
    seccion3.perdida = this.f_s3_perdida.value;
    seccion3.sIrrad_Tipo = this.f_s3_sIrrad_Tipo.value;
    seccion3.sIrrad_AcimutMaxRad = this.f_s3_sIrrad_AcimutMaxRad.value;
    seccion3.sIrrad_AlturaCentroRad = this.f_s3_sIrrad_AlturaCentroRad.value;
    seccion3.sIrrad_AlturaTorre = this.f_s3_sIrrad_AlturaTorre.value;
    seccion3.sIrrad_GananciaMaxRad = this.f_s3_sIrrad_GananciaMaxRad.value;
    seccion3.pathNameDiagramaRadiacion = this.pathPdfDiagramaSeleccionado;
    seccion3.archivoDiagramaRadiacion = this.filePdfDiagramaSeleccionado;
    seccion3.diagrama=this.f_s3_diagrama.value;

    let seccion4: Seccion4 = new Seccion4();
    seccion4.declaracion = this.f_s4_declaracion.value;

    let seccion5: Seccion5 = new Seccion5();
    seccion5.nombresIngeniero = this.f_s5_nombresIngeniero.value;
    seccion5.emailIngeniero = this.f_s5_emailIngeniero.value;
    seccion5.telefonoIngeniero = this.f_s5_telefonoIngeniero.value;
    seccion5.tipoDocumentoSolicitante = this.f_s5_tipoDocumentoSolicitante.value;
    seccion5.numeroDocumentoSolicitante = this.f_s5_numeroDocumentoSolicitante.value;
    seccion5.nombresSolicitante = this.f_s5_nombresSolicitante.value;
    

    dataGuardar.metaData.seccion1 = seccion1;
    dataGuardar.metaData.seccion2 = seccion2;
    dataGuardar.metaData.seccion3 = seccion3;
    dataGuardar.metaData.seccion4 = seccion4;
    dataGuardar.metaData.seccion5 = seccion5;

    console.log(JSON.stringify(dataGuardar, null, 10));
    console.log(JSON.stringify(dataGuardar));
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
          // this.anexoService.post<any>(dataGuardar)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexo = data.id;
                this.uriArchivo = data.uriArchivo;

                this.graboUsuario = true;

                this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
        } else {
          //MODIFICAR
          this.anexoService.put<any>(dataGuardarFormData)
          // this.anexoService.put<any>(dataGuardar)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexo = data.id;
                this.uriArchivo = data.uriArchivo;

                this.graboUsuario = true;

                this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
              }
            );
        }
    });
  }
/*
  formInvalid(control: string) {
    return this.formAnexo.get(control).invalid &&
      (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
  }*/
  formInvalid(control: string) : boolean {
    if(this.formAnexo.get(control))
    return this.formAnexo.get(control).invalid  && (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
  }
  
  descargarPdf() {
    if (this.idAnexo === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
    // this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-A/28";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  get form() { return this.formAnexo.controls; }


  departamentos(){
    this.ubigeoService.departamento().subscribe(

      (dataDepartamento) => {
         console.log(dataDepartamento);
        this.listaDepartamentos = dataDepartamento;
        this.funcionesMtcService.ocultarCargando();
    },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de los departamentos');
        });
  }

  onChangeDistritos() {
    const idDepartamento: string = this.formAnexo.controls['s1_departamento'].value.trim();
    const idProvincia: string = this.formAnexo.controls['s1_provincia'].value.trim();
    this.formAnexo.controls['s1_distrito'].setValue('');
    if(idDepartamento!=='' && idProvincia!==''){
    this.idDep = parseInt(idDepartamento);
    this.idProv = parseInt(idProvincia);
    this.listDistritos();
   }else{
    this.listaDistritos = [];
   }
  }
  
  onChangeProvincias() {
    const idDepartamento: string = this.formAnexo.controls['s1_departamento'].value;
    this.formAnexo.controls['s1_provincia'].setValue('');
    console.log(idDepartamento);

    if(idDepartamento!==''){
      this.listaProvincias=[];
      this.listaDistritos = [];
      this.idDep = parseInt(idDepartamento)
      console.log(this.idDep);
      this.listaProvincia();

    }else{
      this.listaProvincias=[];
      this.listaDistritos = [];
    }
  }

  listaProvincia(){
    console.log(this.idDep);
    this.ubigeoService.provincia(this.idDep).subscribe(
      (dataProvincia) => {
        this.funcionesMtcService.ocultarCargando();
        this.listaProvincias = dataProvincia;
      },
      (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
      }
    );
  }

  listDistritos(){
    this.ubigeoService.distrito(this.idDep, this.idProv).subscribe(
      (dataDistrito) => {
        this.listaDistritos = dataDistrito;
        this.funcionesMtcService.ocultarCargando();
      },
      (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
      }
    );
  }
}
