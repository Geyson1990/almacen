import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_G28Request } from '../../../../../core/models/Anexos/Anexo002_G28/Anexo002_G28Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002G28Service } from '../../../../../core/services/anexos/anexo002-g28.service';
import { A002_G28_Seccion1, A002_G28_Seccion2, A002_G28_Seccion3, A002_G28_Seccion4 } from '../../../../../core/models/Anexos/Anexo002_G28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_G28Response } from 'src/app/core/models/Anexos/Anexo002_G28/Anexo002_G28Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';

@Component({
  selector: 'app-anexo002-g28',
  templateUrl: './anexo002-g28.component.html',
  styleUrls: ['./anexo002-g28.component.css']
})
export class Anexo002G28Component implements OnInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  public idAnexo: number;
  public formAnexo: UntypedFormGroup;

  public filePdfDiagramaSeleccionado: any;
  filePdfDiagramaPathName: string = null;
  filePdfDiagramaRequired: boolean = false;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  listaDepartamentos: any = [];
  listaProvincias: any = [];
  listaDistritos: any = [];
  idDep: number;
  idProv: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private anexoService: Anexo002G28Service,
    private ubigeoService: UbigeoService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService,
  ) {
    this.idAnexo = 0;
    this.filePdfDiagramaSeleccionado = null;
  }

  ngOnInit(): void {
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
    
    this.recuperarInformacion();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      s1_autorizacionModalidad: ['', [Validators.required ]],
      s1_nResolucionAutorizada: ['', [Validators.required ]],
      s1_enFrecuenciaCanal: ['', [Validators.required ]],
      s2_servCambioUbicacion: [false],
      s2_servAumentoPotencia: [false],
      s2_servCambioFrecuencia: [false],
      s3_frCanal_Asignado: ['', [Validators.required]],
      s3_frCanal_Solicitado: ['', [Validators.required]],
      s3_potencia_Autorizada: ['', [Validators.required]],
      s3_potencia_Solicitada: ['', [Validators.required]],
      s3_sIrrad_Tipo: ['', [Validators.required]],
      s3_sIrrad_GananciaMaxRad: ['', [Validators.required]],
      s3_sIrrad_AcimutMaxRad: ['', [Validators.required]],
      s3_sIrrad_InclinacionHaz: ['', [Validators.required]],
      s3_sIrrad_AlturaCentroRad: ['', [Validators.required]],
      s3_sIrrad_AlturaTorre: ['', [Validators.required]],
      s3_perdida_ConectorCableDist: ['', [Validators.required]],
      s3_ubicacionDireccion: ['', [Validators.required]],
      s3_departamento: ['', [Validators.required]],
      s3_provincia: ['', [Validators.required]],
      s3_distrito: ['', [Validators.required]],
      s3_coordWGS84LO_grados: ['',[Validators.required]],
      s3_coordWGS84LO_minutos: ['',[Validators.required]],
      s3_coordWGS84LO_segundos: ['',[Validators.required]],
      s3_coordWGS84LS_grados: ['',[Validators.required]],
      s3_coordWGS84LS_minutos: ['',[Validators.required]],
      s3_coordWGS84LS_segundos: ['',[Validators.required]],
      s3_plantaTransmisora: ['', [Validators.required]],
      s4_telefonoIngeniero: ['', [Validators.required]],
      s4_emailIngeniero: ['', [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }

  clearValidatorS3(){
    this.formAnexo.controls["s3_frCanal_Asignado"].clearValidators();
    this.formAnexo.controls["s3_frCanal_Solicitado"].clearValidators();
    this.formAnexo.controls["s3_potencia_Autorizada"].clearValidators();
    this.formAnexo.controls["s3_potencia_Solicitada"].clearValidators();
    this.formAnexo.controls["s3_sIrrad_Tipo"].clearValidators();
    this.formAnexo.controls["s3_sIrrad_GananciaMaxRad"].clearValidators();
    this.formAnexo.controls["s3_sIrrad_AcimutMaxRad"].clearValidators();
    this.formAnexo.controls["s3_sIrrad_InclinacionHaz"].clearValidators();
    this.formAnexo.controls["s3_sIrrad_AlturaCentroRad"].clearValidators();
    this.formAnexo.controls["s3_sIrrad_AlturaTorre"].clearValidators();
    this.formAnexo.controls["s3_perdida_ConectorCableDist"].clearValidators();
    this.filePdfDiagramaRequired = false;
    this.formAnexo.controls["s3_ubicacionDireccion"].clearValidators();
    this.formAnexo.controls["s3_departamento"].clearValidators();
    this.formAnexo.controls["s3_provincia"].clearValidators();
    this.formAnexo.controls["s3_distrito"].clearValidators();
    this.formAnexo.controls["s3_coordWGS84LO_grados"].clearValidators();
    this.formAnexo.controls["s3_coordWGS84LO_minutos"].clearValidators();
    this.formAnexo.controls["s3_coordWGS84LO_segundos"].clearValidators();
    this.formAnexo.controls["s3_coordWGS84LS_grados"].clearValidators();
    this.formAnexo.controls["s3_coordWGS84LS_minutos"].clearValidators();
    this.formAnexo.controls["s3_coordWGS84LS_segundos"].clearValidators();
    this.formAnexo.controls["s3_plantaTransmisora"].clearValidators();
  }
  frecuenciaCanalRequired(){
    this.formAnexo.controls["s3_frCanal_Asignado"].setValidators(Validators.required);
    this.formAnexo.controls["s3_frCanal_Solicitado"].setValidators(Validators.required);
  }
  potenciaAutorizadaRequired(){
    this.formAnexo.controls["s3_potencia_Autorizada"].setValidators(Validators.required);
    this.formAnexo.controls["s3_potencia_Solicitada"].setValidators(Validators.required);
  }
  sistemaIrradianteRequired(){
    this.formAnexo.controls["s3_sIrrad_Tipo"].setValidators(Validators.required);
    this.formAnexo.controls["s3_sIrrad_GananciaMaxRad"].setValidators(Validators.required);
    this.formAnexo.controls["s3_sIrrad_AcimutMaxRad"].setValidators(Validators.required);
    this.formAnexo.controls["s3_sIrrad_InclinacionHaz"].setValidators(Validators.required);
    this.formAnexo.controls["s3_sIrrad_AlturaCentroRad"].setValidators(Validators.required);
    this.formAnexo.controls["s3_sIrrad_AlturaTorre"].setValidators(Validators.required);
  }
  perdidasRequired(){
    this.formAnexo.controls["s3_perdida_ConectorCableDist"].setValidators(Validators.required);
  }
  ubicacionRequired(){
    this.formAnexo.controls["s3_ubicacionDireccion"].setValidators(Validators.required);
    this.formAnexo.controls["s3_departamento"].setValidators(Validators.required);
    this.formAnexo.controls["s3_provincia"].setValidators(Validators.required);
    this.formAnexo.controls["s3_distrito"].setValidators(Validators.required);
    this.formAnexo.get("s3_coordWGS84LO_grados").setValidators(Validators.required);
    this.formAnexo.get("s3_coordWGS84LO_minutos").setValidators(Validators.required);
    this.formAnexo.get("s3_coordWGS84LO_segundos").setValidators(Validators.required);
    this.formAnexo.get("s3_coordWGS84LS_grados").setValidators(Validators.required);
    this.formAnexo.get("s3_coordWGS84LS_minutos").setValidators(Validators.required);
    this.formAnexo.get("s3_coordWGS84LS_segundos").setValidators(Validators.required);
    this.formAnexo.controls["s3_plantaTransmisora"].setValidators(Validators.required);
  }

  onChangeTramiteSolicitado(){    
    const servCambioUbicacion = this.formAnexo.controls['s2_servCambioUbicacion'].value;
    const servAumentoPotencia = this.formAnexo.controls['s2_servAumentoPotencia'].value;
    const servCambioFrecuencia = this.formAnexo.controls['s2_servCambioFrecuencia'].value;
    this.clearValidatorS3();

    if (servCambioUbicacion) {
      this.ubicacionRequired(); this.filePdfDiagramaRequired= true;
    }
    if (servAumentoPotencia) {
      this.potenciaAutorizadaRequired();
      this.sistemaIrradianteRequired();
      this.perdidasRequired(); this.filePdfDiagramaRequired= true;
    }
    if (servCambioFrecuencia) {
      this.frecuenciaCanalRequired();
    }
    Object.keys(this.formAnexo.controls).forEach(key => {
      this.formAnexo.controls[key].updateValueAndValidity();
    });
    this.formAnexo.markAllAsTouched();
  }
 
  recuperarInformacion(){
    //si existe el documento pero no esta completo
    if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
        this.heredarInformacionFormulario();
        //RECUPERAMOS Y CARGAMOS LOS DATOS DEL ANEXO A EXCEPCION DE LOS CAMPOS HEREDADOS DEL FORMULARIO
        this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
          (dataAnexo: Anexo002_G28Response) => {
            const metaData: any = JSON.parse(dataAnexo.metaData);

            this.idAnexo = dataAnexo.anexoId;
  
            this.formAnexo.get("s1_autorizacionModalidad").setValue(`${metaData?.seccion1?.autorizacionModalidad}`);
            this.formAnexo.get("s1_nResolucionAutorizada").setValue(`${metaData?.seccion1?.nResolucionAutorizada}`);
            this.formAnexo.get("s1_enFrecuenciaCanal").setValue(`${metaData?.seccion1?.enFrecuenciaCanal}`);
            
            this.formAnexo.get("s2_servCambioUbicacion").setValue(metaData.seccion2.servCambioUbicacion);
            this.formAnexo.get("s2_servAumentoPotencia").setValue(metaData.seccion2.servAumentoPotencia);
            this.formAnexo.get("s2_servCambioFrecuencia").setValue(metaData.seccion2.servCambioFrecuencia);

            this.formAnexo.get("s3_frCanal_Asignado").setValue(metaData.seccion3.frCanal_Asignado);
            this.formAnexo.get("s3_frCanal_Solicitado").setValue(metaData.seccion3.frCanal_Solicitado);
            this.formAnexo.get("s3_potencia_Autorizada").setValue(metaData.seccion3.potencia_Autorizada);
            this.formAnexo.get("s3_potencia_Solicitada").setValue(metaData.seccion3.potencia_Solicitada);
            this.formAnexo.get("s3_sIrrad_Tipo").setValue(metaData.seccion3.sIrrad_Tipo);
            this.formAnexo.get("s3_sIrrad_GananciaMaxRad").setValue(metaData.seccion3.sIrrad_GananciaMaxRad);
            this.formAnexo.get("s3_sIrrad_AcimutMaxRad").setValue(metaData.seccion3.sIrrad_AcimutMaxRad);
            this.formAnexo.get("s3_sIrrad_InclinacionHaz").setValue(metaData.seccion3.sIrrad_InclinacionHaz);
            this.formAnexo.get("s3_sIrrad_AlturaCentroRad").setValue(metaData.seccion3.sIrrad_AlturaCentroRad);
            this.formAnexo.get("s3_sIrrad_AlturaTorre").setValue(metaData.seccion3.sIrrad_AlturaTorre);
            this.formAnexo.get("s3_perdida_ConectorCableDist").setValue(metaData.seccion3.perdida_ConectorCableDist);
            this.formAnexo.get("s3_ubicacionDireccion").setValue(metaData.seccion3.ubicacionDireccion);
            this.formAnexo.get("s3_departamento").setValue(metaData.seccion3.departamento.id);
            this.idDep = metaData.seccion3.departamento.id;
            if(this.idDep) this.listaProvincia();
            this.formAnexo.get("s3_provincia").setValue(metaData.seccion3.provincia.id);
            this.idProv = metaData.seccion3.provincia.id;
            this.formAnexo.get("s3_distrito").setValue(metaData.seccion3.distrito.id);
            if(this.idProv) this.listDistritos();
            this.formAnexo.get("s3_coordWGS84LO_grados").setValue(metaData.seccion3.coordWGS84LO_grados);
            this.formAnexo.get("s3_coordWGS84LO_minutos").setValue(metaData.seccion3.coordWGS84LO_minutos);
            this.formAnexo.get("s3_coordWGS84LO_segundos").setValue(metaData.seccion3.coordWGS84LO_segundos);
            this.formAnexo.get("s3_coordWGS84LS_grados").setValue(metaData.seccion3.coordWGS84LS_grados);
            this.formAnexo.get("s3_coordWGS84LS_minutos").setValue(metaData.seccion3.coordWGS84LS_minutos);
            this.formAnexo.get("s3_coordWGS84LS_segundos").setValue(metaData.seccion3.coordWGS84LS_segundos);
            this.formAnexo.get("s3_plantaTransmisora").setValue(metaData.seccion3.plantaTransmisora);
            this.filePdfDiagramaPathName = metaData.seccion3.pathNameDiagramaRadiacion;

            this.formAnexo.get("s4_telefonoIngeniero").setValue(metaData.seccion4.telefonoIngeniero);
            this.formAnexo.get("s4_emailIngeniero").setValue(metaData.seccion4.emailIngeniero);
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para recuperar los datos guardados del anexo');
          });
    }
    //si existe el documento y esta completo
    else if (this.dataInput.movId > 0 && this.dataInput.completo === true) {
      //RECUPERAMOS LOS DATOS DEL ANEXO
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo002_G28Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexo = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

          this.formAnexo.get("s1_autorizacionModalidad").setValue(`${metaData?.seccion1?.autorizacionModalidad}`);
          this.formAnexo.get("s1_nResolucionAutorizada").setValue(`${metaData?.seccion1?.nResolucionAutorizada}`);
          this.formAnexo.get("s1_enFrecuenciaCanal").setValue(`${metaData?.seccion1?.enFrecuenciaCanal}`);
          
          this.formAnexo.get("s2_servCambioUbicacion").setValue(metaData.seccion2.servCambioUbicacion);
          this.formAnexo.get("s2_servAumentoPotencia").setValue(metaData.seccion2.servAumentoPotencia);
          this.formAnexo.get("s2_servCambioFrecuencia").setValue(metaData.seccion2.servCambioFrecuencia);

          this.formAnexo.get("s3_frCanal_Asignado").setValue(metaData.seccion3.frCanal_Asignado);
          this.formAnexo.get("s3_frCanal_Solicitado").setValue(metaData.seccion3.frCanal_Solicitado);
          this.formAnexo.get("s3_potencia_Autorizada").setValue(metaData.seccion3.potencia_Autorizada);
          this.formAnexo.get("s3_potencia_Solicitada").setValue(metaData.seccion3.potencia_Solicitada);
          this.formAnexo.get("s3_sIrrad_Tipo").setValue(metaData.seccion3.sIrrad_Tipo);
          this.formAnexo.get("s3_sIrrad_GananciaMaxRad").setValue(metaData.seccion3.sIrrad_GananciaMaxRad);
          this.formAnexo.get("s3_sIrrad_AcimutMaxRad").setValue(metaData.seccion3.sIrrad_AcimutMaxRad);
          this.formAnexo.get("s3_sIrrad_InclinacionHaz").setValue(metaData.seccion3.sIrrad_InclinacionHaz);
          this.formAnexo.get("s3_sIrrad_AlturaCentroRad").setValue(metaData.seccion3.sIrrad_AlturaCentroRad);
          this.formAnexo.get("s3_sIrrad_AlturaTorre").setValue(metaData.seccion3.sIrrad_AlturaTorre);
          this.formAnexo.get("s3_perdida_ConectorCableDist").setValue(metaData.seccion3.perdida_ConectorCableDist);
          this.formAnexo.get("s3_ubicacionDireccion").setValue(metaData.seccion3.ubicacionDireccion);
          this.formAnexo.get("s3_departamento").setValue(metaData.seccion3.departamento.id);
          this.idDep = metaData.seccion3.departamento.id;
          if(this.idDep) this.listaProvincia();
          this.formAnexo.get("s3_provincia").setValue(metaData.seccion3.provincia.id);
          this.idProv = metaData.seccion3.provincia.id;
          this.formAnexo.get("s3_distrito").setValue(metaData.seccion3.distrito.id);
          if(this.idProv) this.listDistritos();
          this.formAnexo.get("s3_coordWGS84LO_grados").setValue(metaData.seccion3.coordWGS84LO_grados);
          this.formAnexo.get("s3_coordWGS84LO_minutos").setValue(metaData.seccion3.coordWGS84LO_minutos);
          this.formAnexo.get("s3_coordWGS84LO_segundos").setValue(metaData.seccion3.coordWGS84LO_segundos);
          this.formAnexo.get("s3_coordWGS84LS_grados").setValue(metaData.seccion3.coordWGS84LS_grados);
          this.formAnexo.get("s3_coordWGS84LS_minutos").setValue(metaData.seccion3.coordWGS84LS_minutos);
          this.formAnexo.get("s3_coordWGS84LS_segundos").setValue(metaData.seccion3.coordWGS84LS_segundos);
          this.formAnexo.get("s3_plantaTransmisora").setValue(metaData.seccion3.plantaTransmisora);
          this.filePdfDiagramaPathName = metaData.seccion3.pathNameDiagramaRadiacion;

          this.formAnexo.get("s4_telefonoIngeniero").setValue(metaData.seccion4.telefonoIngeniero);
          this.formAnexo.get("s4_emailIngeniero").setValue(metaData.seccion4.emailIngeniero);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
    }else{
        //si es un nuevo registro
        this.heredarInformacionFormulario();
    }
    this.onChangeTramiteSolicitado();
  }

  heredarInformacionFormulario(){
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        console.log(JSON.stringify(metaDataForm));
        this.formAnexo.controls['s1_autorizacionModalidad'].setValue(metaDataForm.seccion3.modalidad);
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
      }
    );

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
  }

  vistaPreviaDiagrama() {
    if(this.filePdfDiagramaSeleccionado!==null){
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfDiagramaSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa - Diagrama de Radiación Horizontal Polar del Arreglo de Antenas";
    }else {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfDiagramaPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfDiagramaSeleccionado = file;

          this.visualizarDialogoPdfDiagrama();
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
    if(this.filePdfDiagramaRequired && !this.filePdfDiagramaPathName && !this.filePdfDiagramaSeleccionado)
      return this.funcionesMtcService.mensajeError("Debe adjuntar el Diagrama de Radiación Horizontal Polar del Arreglo de Antenas");
    const dataGuardar: Anexo002_G28Request = new Anexo002_G28Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = "G";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    const departamento: UbigeoResponse = new UbigeoResponse();
    departamento.id = this.formAnexo.get('s3_departamento').value;
    departamento.descripcion = departamento.id ? this.listaDepartamentos.filter(item => item.value ==  this.formAnexo.get('s3_departamento').value)[0].text:'';

    const provincia: UbigeoResponse = new UbigeoResponse();
    provincia.id = this.formAnexo.get('s3_provincia').value;
    provincia.descripcion = provincia.id ? this.listaProvincias.filter(item => item.value ==  this.formAnexo.get('s3_provincia').value)[0].text:'';

    const distrito: UbigeoResponse = new UbigeoResponse();
    distrito.id = this.formAnexo.get('s3_distrito').value;
    distrito.descripcion = distrito.id ? this.listaDistritos.filter(item => item.value ==  this.formAnexo.get('s3_distrito').value)[0].text:'';

    let seccion1: A002_G28_Seccion1 = new A002_G28_Seccion1();
    seccion1.autorizacionModalidad = this.formAnexo.controls['s1_autorizacionModalidad'].value;
    seccion1.nResolucionAutorizada = this.formAnexo.controls['s1_nResolucionAutorizada'].value;
    seccion1.enFrecuenciaCanal = this.formAnexo.controls['s1_enFrecuenciaCanal'].value;
    dataGuardar.metaData.seccion1 = seccion1;

    let seccion2: A002_G28_Seccion2 = new A002_G28_Seccion2();
    seccion2.servCambioUbicacion = this.formAnexo.controls['s2_servCambioUbicacion'].value;
    seccion2.servAumentoPotencia = this.formAnexo.controls['s2_servAumentoPotencia'].value;
    seccion2.servCambioFrecuencia = this.formAnexo.controls['s2_servCambioFrecuencia'].value;
    dataGuardar.metaData.seccion2 = seccion2;

    let seccion3: A002_G28_Seccion3 = new A002_G28_Seccion3();
    seccion3.frCanal_Asignado = this.formAnexo.controls['s3_frCanal_Asignado'].value;
    seccion3.frCanal_Solicitado = this.formAnexo.controls['s3_frCanal_Solicitado'].value;
    seccion3.potencia_Autorizada = this.formAnexo.controls['s3_potencia_Autorizada'].value;
    seccion3.potencia_Solicitada = this.formAnexo.controls['s3_potencia_Solicitada'].value;
    seccion3.sIrrad_Tipo = this.formAnexo.controls['s3_sIrrad_Tipo'].value;
    seccion3.sIrrad_GananciaMaxRad = this.formAnexo.controls['s3_sIrrad_GananciaMaxRad'].value;
    seccion3.sIrrad_AcimutMaxRad = this.formAnexo.controls['s3_sIrrad_AcimutMaxRad'].value;
    seccion3.sIrrad_InclinacionHaz = this.formAnexo.controls['s3_sIrrad_InclinacionHaz'].value;
    seccion3.sIrrad_AlturaCentroRad = this.formAnexo.controls['s3_sIrrad_AlturaCentroRad'].value;
    seccion3.sIrrad_AlturaTorre = this.formAnexo.controls['s3_sIrrad_AlturaTorre'].value;
    seccion3.perdida_ConectorCableDist = this.formAnexo.controls['s3_perdida_ConectorCableDist'].value;
    seccion3.ubicacionDireccion = this.formAnexo.controls['s3_ubicacionDireccion'].value;
    seccion3.distrito = distrito;
    seccion3.provincia = provincia;
    seccion3.departamento = departamento;
    seccion3.coordWGS84LO_grados = this.formAnexo.controls['s3_coordWGS84LO_grados'].value;
    seccion3.coordWGS84LO_minutos = this.formAnexo.controls['s3_coordWGS84LO_minutos'].value;
    seccion3.coordWGS84LO_segundos = this.formAnexo.controls['s3_coordWGS84LO_segundos'].value;
    seccion3.coordWGS84LS_grados = this.formAnexo.controls['s3_coordWGS84LS_grados'].value;
    seccion3.coordWGS84LS_minutos = this.formAnexo.controls['s3_coordWGS84LS_minutos'].value;
    seccion3.coordWGS84LS_segundos = this.formAnexo.controls['s3_coordWGS84LS_segundos'].value;
    seccion3.plantaTransmisora = this.formAnexo.controls['s3_plantaTransmisora'].value;
    seccion3.archivoDiagramaRadiacion = this.filePdfDiagramaSeleccionado ? this.filePdfDiagramaSeleccionado: null;
    seccion3.pathNameDiagramaRadiacion = this.filePdfDiagramaPathName;
    dataGuardar.metaData.seccion3 = seccion3;

    let seccion4: A002_G28_Seccion4 = new A002_G28_Seccion4();
    seccion4.telefonoIngeniero = this.formAnexo.controls['s4_telefonoIngeniero'].value;
    seccion4.emailIngeniero = this.formAnexo.controls['s4_emailIngeniero'].value;
    dataGuardar.metaData.seccion4 = seccion4;

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

  formInvalid(control: string) {
    return this.formAnexo.get(control).invalid &&
      (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
  }

  descargarPdf() {
    if (this.idAnexo === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-G/28";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
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
    const idDepartamento: string = this.formAnexo.controls['s3_departamento'].value.trim();
    const idProvincia: string = this.formAnexo.controls['s3_provincia'].value.trim();
    this.formAnexo.controls['s3_distrito'].setValue('');
    if(idDepartamento!=='' && idProvincia!==''){
    this.idDep = parseInt(idDepartamento);
    this.idProv = parseInt(idProvincia);
    this.listDistritos();
   }else{
    this.listaDistritos = [];
   }
  }
  
  onChangeProvincias() {
    const idDepartamento: string = this.formAnexo.controls['s3_departamento'].value;
    this.formAnexo.controls['s3_provincia'].setValue('');
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
