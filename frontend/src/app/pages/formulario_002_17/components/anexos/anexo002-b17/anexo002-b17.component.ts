import { DeclaracionJurada } from './../../../../../core/models/Formularios/Formulario002_a12/Secciones';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Anexo002_B17Request } from '../../../../../core/models/Anexos/Anexo002_B17/Anexo002_B17Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002B17Service } from '../../../../../core/services/anexos/anexo002-b17.service';
import { A002_B17_Seccion_Declaracion_Jurada, Telefono, A002_B17_Seccion_Documento_Adjuntar, Documento } from '../../../../../core/models/Anexos/Anexo002_B17/Secciones';
import { VehiculoService } from '../../../../../core/services/servicios/vehiculo.service';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_B17Response } from 'src/app/core/models/Anexos/Anexo002_B17/Anexo002_B17Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { Vehiculo } from '../../../../../core/models/Anexos/Anexo002_A17/Secciones';

@Component({
  selector: 'app-anexo002-b17',
  templateUrl: './anexo002-b17.component.html',
  styleUrls: ['./anexo002-b17.component.css']
})
export class Anexo002B17Component implements OnInit {
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  public idAnexo: number;
  public formAnexo: UntypedFormGroup;
  public nombreApellido: string;
  public nroDocumento: string;
  public tipoRepresentacion: string;
  public razonSocial: string;
  public filePdfAdjuntoSeleccionado: any;
  public recordIndexToEdit: number;

  public filePdfCvSeleccionado: any;
  filePdfAdjuntoPathName: string = null;
  // public telefonos: any[];
  public documentos: any[]=[];

  telefonos:  Telefono[] = [];

  cargadosDoc: number = 0;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  paTipoServicio = [{"pa":"DSTT-028","tipoServicio":"1"}];

  public visibleButton1: boolean;
  public visibleButton2: boolean;
  public visibleButton3: boolean;
  public visibleButton4: boolean;
  public visibleButton5: boolean;
  public visibleButton6: boolean;
  public visibleButton7: boolean;
  public visibleButton8: boolean;
  public visibleButton9: boolean;
  public visibleButton10: boolean;
  public visibleButton11: boolean;
  public visibleButton12: boolean;
  public filePdfSeleccionado1: any;
  public filePdfSeleccionado2: any;
  public filePdfSeleccionado3: any;
  public filePdfSeleccionado4: any;
  public filePdfSeleccionado5: any;
  public filePdfSeleccionado6: any;
  public filePdfSeleccionado7: any;
  public filePdfSeleccionado8: any;
  public filePdfSeleccionado9: any;
  public filePdfSeleccionado10: any;
  public filePdfSeleccionado11: any;
  public filePdfSeleccionado12: any;

  listaDocumentos: Documento[]=[];
  listaDocumentos1: Documento[]=[];
  // public currentDate = new Date();
  // public day: number;
  // public month: string;
  // public year: number;
  // public meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  filePdfDocSeleccionado: any = null;
  filePdfCelular: any = null;
  filePdfDocPathName: string = null;
  visibleButtonDoc: boolean=false;

  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private anexoService: Anexo002B17Service,
    private vehiculoService: VehiculoService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService
  ) {
    this.idAnexo = 0;
    this.tipoRepresentacion = 'Representate Legal';

    this.filePdfAdjuntoSeleccionado = null;
    this.recordIndexToEdit = -1;

    this.telefonos = [];

    this.filePdfCvSeleccionado = null;
    // this.documentos = [];


    // this.visibleButton1 = false;
    // this.visibleButton2 = false;
    // this.visibleButton3 = false;
    // this.visibleButton4 = false;
    // this.visibleButton5 = false;
    // this.visibleButton6 = false;
    // this.visibleButton7 = false;
    // this.visibleButton8 = false;
    // this.visibleButton9 = false;
    // this.visibleButton10 = false;
    // this.visibleButton11 = false;
    // this.visibleButton12 = false;

    // this.filePdfSeleccionado1 = null;
    // this.filePdfSeleccionado2 = null;
    // this.filePdfSeleccionado3 = null;
    // this.filePdfSeleccionado4 = null;
    // this.filePdfSeleccionado5 = null;
    // this.filePdfSeleccionado6 = null;
    // this.filePdfSeleccionado7 = null;
    // this.filePdfSeleccionado8 = null;
    // this.filePdfSeleccionado9 = null;
    // this.filePdfSeleccionado10 = null;
    // this.filePdfSeleccionado11 = null;
    // this.filePdfSeleccionado12 = null;


  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.createForm();


    for (let i = 0; i < this.dataRequisitosInput.length; i++) {

      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }

      if(this.dataRequisitosInput[i].codigoFormAnexo=='ANEXO_002_A17'){
        this.reqAnexo = this.dataRequisitosInput[i].tramiteReqId;
        console.log("======> "+this.reqAnexo );
        if(this.dataRequisitosInput[i].movId=== 0){
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Debe completar el '+this.dataRequisitosInput[i].codigoFormAnexo);
          return;
        }
       }
    }
    this.recuperaInfo();
    this.listaDocumentos1.push(
      {nroOrden: 1, descripcion: 'Certificado de limitador de velocidad (Numerales 55.1.12.9 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 2, descripcion: 'Contrato de GPS de los vehículos (Num. 20.1.10)',activo: true, pathName: null,  file: null},
      // {nroOrden: 3, descripcion: 'Contrato con taller de mantenimiento (Numerales 55.1.12.6 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 3, descripcion: 'Contrato o recibo con los celulares asignados a vehículos Numerales 55.1.12.7 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 4, descripcion: 'Manual General de Operaciones (Numerales 42.1.5\, 55.1.12.8 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 5, descripcion: 'Curriculum documentado del gerente de operaciones y prevención de riesgos (Numerales 55.1.12.10 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 6, descripcion: 'Contrato para el uso de oficina administrativa (Num. 33.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 7, descripcion: 'Propuesta operacional (Num. 55.1.12.4 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 8, descripcion: 'Terminales Terrestres y/o estaciones de rutas debidamente habilitados por la autoridad competente (Num. 33.2, 55.1.12.5 y 55.2.2), o en caso que no sea propio debe adjuntar el contrato para el uso del terminal.',activo: true, pathName: null,  file: null},
      {nroOrden: 9, descripcion: 'Patrimonio (Num. 38.1.5.4\, 55.1.12.1 y 55.2.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 10, descripcion: 'Documento que acredita la personería jurídica y que su objeto social corresponda al transporte de personas (Num. 38.1.2)',activo: true, pathName: null,  file: null},
      {nroOrden: 11, descripcion: 'Contrato de arrendamiento financiero u operativo si lo Hubiere (Numerales 26.1,55.1.7 y 55.2.2)',activo: true, pathName: null,  file: null},
      );
      const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa =  tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;

  }



  private createForm(): void{
    this.formAnexo = this.fb.group({
      nombreApellido: ['', [ Validators.required ]],
      nroDocumento: ['', [ Validators.required ]],
      tipoRepresentacion: ['', [ Validators.required ]],
      razonSocial: ['', [ Validators.required ]],
      nroPartida: ['', [ Validators.required ]],
      domicilio: ['', [ Validators.required ]],
      placaVehiculo: ['', [ Validators.minLength(6), Validators.maxLength(6) ]],
      nroCelular:[''],
      gerenteOperaciones:['', [ Validators.required ]],

      // docAdjuntar1: [false, [ Validators.required ]],
      // docAdjuntar2: [false, [ Validators.required ]],
      // docAdjuntar3: [false, [ Validators.required ]],
      // docAdjuntar4: [false, [ Validators.required ]],
      // docAdjuntar5: [false, [ Validators.required ]],
      // docAdjuntar6: [false, [ Validators.required ]],
      // docAdjuntar7: [false, [ Validators.required ]],
      // docAdjuntar8: [false, [ Validators.required ]],
      // docAdjuntar9: [false, [ Validators.required ]],
      // docAdjuntar10: [false, [ Validators.required ]],
      // docAdjuntar11: [false, [ Validators.required ]],
      // docAdjuntar12: [false, [ Validators.required ]],
      dia: this.fb.control(this.getDia(), [Validators.required]),
      mes: this.fb.control(this.getMes(), [Validators.required]),
      anio: this.fb.control(this.getAnio(), [Validators.required]),
    });
  }

  recuperaInfo(){
  //  setTimeout(() => {

      this.funcionesMtcService.mostrarCargando();

      if(this.dataInput.movId==0){
        console.log("******* "+this.dataInput.movId);
        this.formularioTramiteService.get<any>(this.dataInput.tramiteReqRefId).subscribe(

              (dataForm : Anexo002_B17Response) => {
              this.funcionesMtcService.ocultarCargando();

              const data: any = JSON.parse(dataForm.metaData);
              console.log(JSON.stringify(JSON.parse(dataForm.metaData), null, 10));

              this.formAnexo.controls['nombreApellido'].setValue(`${data.seccion1.apellidoPaternoRepresentante} ${data.seccion1.apellidoMaternoRepresentante} ${data.seccion1.nombresRepresentante}`);
              this.formAnexo.controls['nroDocumento'].setValue(`${data.seccion1.nroDocRepresentante}`);
              this.formAnexo.controls['tipoRepresentacion'].setValue('Representante');
              this.formAnexo.controls['razonSocial'].setValue(`${data.seccion1.razonSocial}`);
              this.formAnexo.controls['nroPartida'].setValue(data.seccion1.nroPartida);
              this.formAnexo.controls['domicilio'].setValue(data.seccion1.domicilioRepresentante);

              this.nombreApellido = data.seccion1.apellidoPaternoRepresentante + " " +data.seccion1.apellidoMaternoRepresentante + " "+data.seccion1.nombresRepresentante;
              this.nroDocumento = data.seccion1.nroDocRepresentante;
              this.razonSocial = data.seccion1.razonSocial;
              this.rellenarDocumentos();

              //  if (this.dataInput.movId > 0) {
              //   this.funcionesMtcService.ocultarCargando();
              //   this.cargaDatosGuardado();
              // }else{
              //   this.rellenarDocumentos();
              // }
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
            }
          );

       }else{
        this.funcionesMtcService.ocultarCargando();
        this.cargaDatosGuardado();

      }


    //});
  }

  rellenarDocumentos(){
    console.log("<========>");
    this.funcionesMtcService.mostrarCargando();

          this.anexoTramiteService.get<any>(this.reqAnexo).subscribe(

            (dataAnexo: Anexo002_B17Response) => {
              this.funcionesMtcService.ocultarCargando();

              const metaData: any = JSON.parse(dataAnexo.metaData);
              console.log(JSON.parse(dataAnexo.metaData));
              console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));
              // this.idAnexo = dataAnexo.anexoId;

              for (var i = 0; i < metaData.renat.listaVehiculos.length; i++) {

                // this.recuperaPdfCelular(metaData.renat.listaVehiculos[i].pathNameCelular);
                this.telefonos.push({
                  placaVehiculo: metaData.renat.listaVehiculos[i].placaRodaje,
                  nroCelular: metaData.renat.listaVehiculos[i].celular,
                  archivoAdjunto: metaData.renat.listaVehiculos[i].fileCelular,
                  pathNameCelular:  metaData.renat.listaVehiculos[i].pathNameCelular
                });
              }
              // this.formAnexo.get("dia").setValue(metaData.declaracionJurada.dia);
              // this.formAnexo.get("mes").setValue(metaData.declaracionJurada.mes);
              // this.formAnexo.get("anio").setValue(metaData.declaracionJurada.anio);
            },
            error => {
              // this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para recuperar los datos guardados del anexo');
            });

      if(this.dataInput.movId==0){
        this.listaDocumentos = this.listaDocumentos1;
      }
     

  }
  recuperaPdfCelular(pathNameCelular : any) {

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(pathNameCelular)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCelular = <File>file;
          console.log(this.filePdfCelular);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
// }

}

  cargaDatosGuardado(){
    this.funcionesMtcService.mostrarCargando();

          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(

            (dataAnexo: Anexo002_B17Response) => {
              this.funcionesMtcService.ocultarCargando();

              const metaData: any = JSON.parse(dataAnexo.metaData);
              // console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));
              this.idAnexo = dataAnexo.anexoId;

              console.log(JSON.parse(dataAnexo.metaData));

              this.formAnexo.controls['nombreApellido'].setValue(`${metaData.declaracionJurada.nombreApellido}`);
              this.formAnexo.controls['nroDocumento'].setValue(`${metaData.declaracionJurada.nroDocumento}`);
              this.formAnexo.controls['tipoRepresentacion'].setValue('Representante');
              this.formAnexo.controls['razonSocial'].setValue(`${metaData.declaracionJurada.razonSocial}`);
              this.formAnexo.controls['nroPartida'].setValue(metaData.declaracionJurada.nroPartida);
              this.formAnexo.controls['domicilio'].setValue(metaData.declaracionJurada.domicilio);

              this.formAnexo.controls['gerenteOperaciones'].setValue(metaData.declaracionJurada.gerenteOperaciones);

              this.filePdfCvSeleccionado = null;
              this.filePdfAdjuntoPathName = metaData.declaracionJurada.pathNameAdjuntoCV;
              this.nombreApellido = metaData.declaracionJurada.nombreApellido;
              this.nroDocumento = metaData.declaracionJurada.nroDocumento;
              this.razonSocial = metaData.declaracionJurada.razonSocial;

              this.formAnexo.get("dia").setValue(metaData.declaracionJurada.dia);
              this.formAnexo.get("mes").setValue(metaData.declaracionJurada.mes);
              this.formAnexo.get("anio").setValue(metaData.declaracionJurada.anio);
              
              if(this.uriArchivo!=''){
                for (var i = 0; i < metaData.declaracionJurada.listaNumeroTelef.length; i++) {
            
                 this.telefonos.push({
                   placaVehiculo: metaData.declaracionJurada.listaNumeroTelef[i].placaVehiculo,
                   nroCelular: metaData.declaracionJurada.listaNumeroTelef[i].nroCelular,
                   archivoAdjunto: null,
                   pathNameCelular:  metaData.declaracionJurada.listaNumeroTelef[i].pathNameCelular,
                 });
               }
              }else{
                this.rellenarDocumentos();
              }
           
              this.listaDocumentos = [];
              for (i = 0; i < metaData.documentoAdjuntar.documentos.length; i++) {
                this.cargadosDoc+=1;
                this.listaDocumentos.push({
                  nroOrden: metaData.documentoAdjuntar.documentos[i].nroOrden,
                  // descripcion: metaData.documentoAdjuntar[i].descripcion,
                  descripcion: this.listaDocumentos1[i].descripcion,
                  activo:  metaData.documentoAdjuntar.documentos[i].activo,
                  pathName: metaData.documentoAdjuntar.documentos[i].pathName,
                  file: null
                });
              }
            },
            error => {
              // this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para recuperar los datos guardados del anexo');
            });
  }

  agregarDocumento() {

    if (this.filePdfDocSeleccionado === null)
      return this.funcionesMtcService.mensajeError('A seleccionado Documento, debe cargar un archivo PDF');

    if (this.recordIndexToEdit !==-1)
      this.listaDocumentos[this.recordIndexToEdit].file = this.filePdfDocSeleccionado;
      this.cargadosDoc+=1;
    this.cancelarDocumento();
  }
  cancelarDocumento() {
    this.recordIndexToEdit = -1;
    this.filePdfDocSeleccionado = null;
    this.filePdfDocPathName = null;
    this.visibleButtonDoc = false;
  }

  verPdfDocGrilla(item) {
    if (this.recordIndexToEdit !== -1)
      return;

    if (item.pathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(item.pathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          item.file = <File>file;
          item.pathName = null;

          this.visualizarGrillaPdf(item.file);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarGrillaPdf(item.file);
    }
  }

  visualizarGrillaPdf(file: File) {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Documento Adjunto";
  }

  modificarDocumento(item, index) {
    if (this.recordIndexToEdit !== -1)
      return;

    this.recordIndexToEdit = index;
    this.visibleButtonDoc = true;

    this.filePdfDocSeleccionado = item.file;
    this.filePdfDocPathName = item.pathName;

  }

  eliminarDocumento(item, index) {
    if (this.recordIndexToEdit === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el documento Adjunto?')
        .then(() => {
          item.file=null;
          item.pathName=null;
        });
    }
  }

  vistaPreviaDoc() {
    if (this.filePdfDocPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfDocPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfDocSeleccionado = <File>file;
          this.filePdfDocPathName = null;

          this.visualizarGrillaPdf(this.filePdfDocSeleccionado);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarGrillaPdf(this.filePdfDocSeleccionado);
    }
  }

  onChangeInputDoc(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfDocSeleccionado = event.target.files[0];
    this.filePdfDocPathName = null;
    event.target.value = "";
  }




  buscarPlacaVehiculo1() {
    const placaVehiculo = this.formAnexo.controls.placaVehiculo.value.trim();
    if ( placaVehiculo.length !== 6 ){
      return;
    }

    // this.changePlacaRodaje();

    this.funcionesMtcService.mostrarCargando();

    this.vehiculoService.getPlacaRodaje(placaVehiculo).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();
        /*
        if (respuesta.soat.estado === '')
          return this.funcionesMtcService.mensajeError('Placa de rodaje no encontrada');
        if (respuesta.soat.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('SOAT no vigente');

        this.formAnexo.controls.soat.setValue(respuesta.soat.numero);
        this.formAnexo.controls.citv.setValue(respuesta.citv || '(FALTANTE)');*/

        if(respuesta.categoria==="" || respuesta.categoria==="-"){
          return this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
        }else{
          if(respuesta.categoria.charAt(0)=="O")
            this.formAnexo.controls.soat.setValue(respuesta.soat.numero || '-');
          
          if(respuesta.categoria.charAt(0)=="N" || respuesta.categoria.charAt(0)=="M"){
              if (respuesta.soat.estado === '')
                return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
              else 
                if (respuesta.soat.estado !== 'VIGENTE')
                return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
                
                this.formAnexo.controls.soat.setValue(respuesta.soat.numero);
          }
        }

        let band:boolean = false;
        let placaNumero:string = "";
        if(respuesta.citvs.length>0){
          for (let placa of respuesta.citvs){
            if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa &&  i.tipoServicio==placa.tipoId)!=undefined){
              placaNumero=placa.numero;
              band=true;
            }
          }
          if(!band)
            return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
          else
            this.formAnexo.controls.citv.setValue(placaNumero || '(FALTANTE)');
        }else{
          if(respuesta.nuevo){
            this.formAnexo.controls['citv'].setValue(placaNumero || '-');                   
          }else{
            return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');     
          }
        }
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );
  }


  // buscarPlacaRodaje() {
  //   const placaVehiculo = this.formAnexo.controls.placaVehiculo.value.trim();
  //   if ( placaVehiculo.length !== 6 )
  //     return;

  //   // this.changePlacaRodaje();

  //   this.funcionesMtcService.mostrarCargando();

  //   this.vehiculoService.getPlacaRodaje(placaVehiculo).subscribe(
  //     respuesta => {
  //       this.funcionesMtcService.ocultarCargando();
  //       if (this.dataInput.validacionesPlaca === 1) {
  //         if (respuesta.soat.estado === '')
  //           return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
  //         if (respuesta.soat.estado !== 'VIGENTE')
  //           return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
  //         if (respuesta.citv.estado !== 'VIGENTE')
  //           return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
  //         if (respuesta.citv.tipoId != '23')
  //           return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
  //       }
  //       this.formAnexo.controls.soat.setValue(respuesta.soat.numero || '(FALTANTE)');
  //       this.formAnexo.controls.citv.setValue(respuesta.citv.numero || '(FALTANTE)');
  //     },
  //     error => {
  //       this.funcionesMtcService
  //         .ocultarCargando()
  //         .mensajeError('Error al consultar al servicio');
  //     }
  //   );
  // }

  buscarPlacaVehiculo() {
    const placaRodaje = this.formAnexo.controls.placaVehiculo.value.trim();
    if ( placaRodaje.length !== 6 )
      return;

    // this.changePlacaRodaje();

    this.funcionesMtcService.mostrarCargando();

    this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();
        if(respuesta.categoria===""){
          return this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
        }else{
          if(respuesta.categoria.charAt(0)=="O")
            this.formAnexo.controls.soat.setValue(respuesta.soat.numero || '-');
          
          if(respuesta.categoria.charAt(0)=="N"){
              if (respuesta.soat.estado === '')
                return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
              else 
                if (respuesta.soat.estado !== 'VIGENTE')
                return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
                
                this.formAnexo.controls.soat.setValue(respuesta.soat.numero);
          }
        }

        let band:boolean = false;
        let placaNumero:string = "";
        if(respuesta.citvs.length>0){
          for (let placa of respuesta.citvs){
            if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa &&  i.tipoServicio==placa.tipoId)!=undefined){
              placaNumero=placa.numero;
              band=true;
            }
          }
          if(!band)
            return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
          else
            this.formAnexo.controls.citv.setValue(placaNumero || '(FALTANTE)');
        }else{
          return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');
        }
        /*
        if (this.dataInput.validacionesPlaca === 1) {
          if (respuesta.soat.estado === '')
            return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
          if (respuesta.soat.estado !== 'VIGENTE')
            return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
          if (respuesta.citv.estado !== 'VIGENTE')
            return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
          if (respuesta.citv.tipoId != '23')
            return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        }
        this.formAnexo.controls.soat.setValue(placaRodaje || '(FALTANTE)');
        // this.formAnexo.controls.citv.setValue(respuesta.citv.numero || '(FALTANTE)');*/
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );
  }

  onChangeInputAdjunto(event) {
    if (event.target.files.length === 0){
      return;
    }

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfAdjuntoSeleccionado = event.target.files[0];
  }

  onChangeInputCv(event) {
    if (event.target.files.length === 0){
      return;
    }

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfCvSeleccionado = event.target.files[0];
  }

  vistaPreviaAdjunto() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfAdjuntoSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
  }

  vistaPreviaCv() {
    if(this.filePdfCvSeleccionado!==null){
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfCvSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - CV";
    }else {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfAdjuntoPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCvSeleccionado = file;
          // this.filePdfAdjuntoPathName = null;

          this.visualizarDialogoPdfCv();
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    }
  }

  visualizarDialogoPdfCv() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfCvSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - CV";
  }

  // public addTelefono(){
  //   if (
  //     this.formAnexo.get('placaVehiculo').value.trim() === '' ||
  //     this.formAnexo.get('nroCelular').value.trim() === ''
  //   ) {
  //     return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
  //   }

  //   if ( this.filePdfAdjuntoSeleccionado === null ){
  //     return this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF');
  //   }

  //   const placaVehiculo = this.formAnexo.get('placaVehiculo').value.trim().toUpperCase();
  //   const indexFound = this.telefonos.findIndex( item => item.placaVehiculo === placaVehiculo);

  //   if ( indexFound !== -1 ) {
  //     if ( indexFound !== this.recordIndexToEdit ) {
  //       return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
  //     }
  //   }

  //   const nroCelular = this.formAnexo.get('nroCelular').value.trim();
  //   const archivoAdjunto = this.filePdfAdjuntoSeleccionado ? this.filePdfAdjuntoSeleccionado: null;

  //   if (this.recordIndexToEdit === -1) {
  //     this.telefonos.push({
  //       placaVehiculo,
  //       nroCelular,
  //       archivoAdjunto
  //     });
  //   } else {
  //     this.telefonos[this.recordIndexToEdit].placaVehiculo = placaVehiculo;
  //     this.telefonos[this.recordIndexToEdit].nroCelular = nroCelular;
  //     this.telefonos[this.recordIndexToEdit].archivoAdjunto = archivoAdjunto;
  //   }

  //   this.clearTelefonoData();
  // }

  private clearTelefonoData(){
    this.recordIndexToEdit = -1;

    this.formAnexo.controls.placaVehiculo.setValue('');
    this.formAnexo.controls.nroCelular.setValue('');

    this.filePdfAdjuntoSeleccionado = null;
  }

  public editTelefono( telefono: any, i: number ){
    if (this.recordIndexToEdit !== -1){
      return;
    }

    this.recordIndexToEdit = i;

    this.formAnexo.controls.placaVehiculo.setValue(telefono.placaVehiculo);
    this.formAnexo.controls.nroCelular.setValue(telefono.nroCelular);

    this.filePdfAdjuntoSeleccionado = telefono.archivoAdjunto;
  }

  public deleteTelefono( telefono: any, i: number ){
    if (this.recordIndexToEdit === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.telefonos.splice(i, 1);
        });
    }
  }

  // onChange1( event) {
  //   this.visibleButton1 = event;
  //   if ( this.visibleButton1 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '1');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado1 = null;
  // }

  // onChange2( event) {
  //   this.visibleButton2 = event;
  //   if ( this.visibleButton2 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '2');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado2 = null;
  // }

  // onChange3( event) {
  //   this.visibleButton3 = event;
  //   if ( this.visibleButton3 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '3');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado3 = null;
  // }

  // onChange4( event) {
  //   this.visibleButton4 = event;
  //   if ( this.visibleButton4 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '4');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado4 = null;
  // }

  // onChange5( event) {
  //   this.visibleButton5 = event;
  //   if ( this.visibleButton5 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '5');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado5 = null;
  // }

  // onChange6( event) {
  //   this.visibleButton6 = event;
  //   if ( this.visibleButton6 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '6');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado6 = null;
  // }

  // onChange7( event) {
  //   this.visibleButton7 = event;
  //   if ( this.visibleButton7 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '7');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado7 = null;
  // }

  // onChange8( event) {
  //   this.visibleButton8 = event;
  //   if ( this.visibleButton8 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '8');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado8 = null;
  // }

  // onChange9( event) {
  //   this.visibleButton9 = event;
  //   if ( this.visibleButton9 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '9');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado9 = null;
  // }

  // onChange10( event) {
  //   this.visibleButton10 = event;
  //   if ( this.visibleButton10 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '10');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado10 = null;
  // }

  // onChange11( event) {
  //   this.visibleButton11 = event;
  //   if ( this.visibleButton11 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '11');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado11 = null;
  // }

  // onChange12( event) {
  //   this.visibleButton12 = event;
  //   if ( this.visibleButton12 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '12');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }
  //   }
  //   this.filePdfSeleccionado12 = null;
  // }

  // onChangeInput1(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado1 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '1',
  //     descripcion: this.filePdfSeleccionado1.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado1
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton1 = false;
  // }

  // onChangeInput2(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado2 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '2',
  //     descripcion: this.filePdfSeleccionado2.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado2
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton2 = false;
  // }

  // onChangeInput3(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado3 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '3',
  //     descripcion: this.filePdfSeleccionado3.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado3
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton3 = false;
  // }

  // onChangeInput4(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado4 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '4',
  //     descripcion: this.filePdfSeleccionado4.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado4
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton4 = false;
  // }

  // onChangeInput5(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado5 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '5',
  //     descripcion: this.filePdfSeleccionado5.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado5
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton5 = false;
  // }

  // onChangeInput6(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado6 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '6',
  //     descripcion: this.filePdfSeleccionado6.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado6
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton6 = false;
  // }

  // onChangeInput7(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado7 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '7',
  //     descripcion: this.filePdfSeleccionado7.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado7
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton7 = false;
  // }

  // onChangeInput8(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado8 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '8',
  //     descripcion: this.filePdfSeleccionado8.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado8
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton8 = false;
  // }

  // onChangeInput9(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado9 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '9',
  //     descripcion: this.filePdfSeleccionado9.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado9
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton9 = false;
  // }

  // onChangeInput10(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado10 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '10',
  //     descripcion: this.filePdfSeleccionado10.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado10
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton10 = false;
  // }

  // onChangeInput11(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado11 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '11',
  //     descripcion: this.filePdfSeleccionado11.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado11
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton11 = false;
  // }

  // onChangeInput12(event) {
  //   if (event.target.files.length === 0){
  //     return;
  //   }

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfSeleccionado12 = event.target.files[0];
  //   const documento: Documento = {
  //     id: '12',
  //     descripcion: this.filePdfSeleccionado12.name,
  //     flagAdjunto: 1,
  //     archivoAdjunto: this.filePdfSeleccionado12
  //   };
  //   this.documentos.push(documento);
  //   this.visibleButton12 = false;
  // }

  // vistaPreviaSeleccionado1() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado1);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 1`;
  // }

  // vistaPreviaSeleccionado2() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado2);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 2`;
  // }

  // vistaPreviaSeleccionado3() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado3);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 3`;
  // }

  // vistaPreviaSeleccionado4() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado4);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 4`;
  // }

  // vistaPreviaSeleccionado5() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado5);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 5`;
  // }

  // vistaPreviaSeleccionado6() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado6);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 6`;
  // }

  // vistaPreviaSeleccionado7() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado7);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 7`;
  // }

  // vistaPreviaSeleccionado8() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado8);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 8`;
  // }

  // vistaPreviaSeleccionado9() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado9);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 9`;
  // }

  // vistaPreviaSeleccionado10() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado10);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 10`;
  // }

  // vistaPreviaSeleccionado11() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado11);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 11`;
  // }

  // vistaPreviaSeleccionado12() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfSeleccionado12);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = `Vista Previa - 12`;
  // }

  save(){
    let totalDoc=11;
    console.log(this.listaDocumentos.length+"===="+this.cargadosDoc)
    if(this.cargadosDoc <totalDoc)
    return this.funcionesMtcService.mensajeError("Debe adjuntar toda la lista de documentos");

    const dataGuardar: Anexo002_B17Request = new Anexo002_B17Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    // SECCION (Declaración Jurada)
    const declaracionJurada: A002_B17_Seccion_Declaracion_Jurada = new A002_B17_Seccion_Declaracion_Jurada();
    declaracionJurada.nombreApellido = this.nombreApellido;
    declaracionJurada.nroDocumento = this.nroDocumento;
    declaracionJurada.tipoRepresentacion = this.tipoRepresentacion;
    declaracionJurada.razonSocial = this.razonSocial;
    declaracionJurada.nroPartida = this.formAnexo.get('nroPartida').value;
    declaracionJurada.domicilio = this.formAnexo.get('domicilio').value;
    declaracionJurada.dia = this.formAnexo.get('dia').value;
    declaracionJurada.mes = this.formAnexo.get('mes').value;
    declaracionJurada.anio = this.formAnexo.get('anio').value;

    console.log(this.filePdfCelular);
    const listaNumeroTelef: Telefono[] = this.telefonos.map(telefono => {
      return {
        nroCelular: telefono.nroCelular,
        placaVehiculo: telefono.placaVehiculo,
        archivoAdjunto: telefono.archivoAdjunto,
        pathNameCelular: telefono.pathNameCelular
      } as Telefono
    });
    declaracionJurada.listaNumeroTelef = listaNumeroTelef;


    declaracionJurada.gerenteOperaciones = this.formAnexo.get('gerenteOperaciones').value;
    declaracionJurada.archivoAdjuntoCV = this.filePdfCvSeleccionado ? this.filePdfCvSeleccionado: null;

    declaracionJurada.pathNameAdjuntoCV = this.filePdfAdjuntoPathName;
    declaracionJurada.fechaTramite = this.formatDate(new Date());

    // SECCION (Documento Adjuntar)
    const documentoAdjuntar: A002_B17_Seccion_Documento_Adjuntar = new A002_B17_Seccion_Documento_Adjuntar();
    const documentos: Documento[] = this.listaDocumentos.map(documento => {
      // return {
        // id: documento.id,
        // descripcion: documento.descripcion,
        // flagAdjunto: documento.flagAdjunto,
        // archivoAdjunto: documento.archivoAdjunto,
      // } as Documento

      return {
        nroOrden: documento.nroOrden,
        descripcion: null,
        activo: documento.activo,
        pathName: documento.pathName,
        file: documento.file
      } as Documento

    });


    documentoAdjuntar.documentos = documentos;

    dataGuardar.metaData.declaracionJurada = declaracionJurada;
    dataGuardar.metaData.documentoAdjuntar = documentoAdjuntar;




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

  formatFecha(fecha: any) {
    let myDate = new Date(fecha.year, fecha.month-1, fecha.day);
    return myDate;
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }
  formInvalid(control: string) {
    return this.formAnexo.get(control).invalid &&
      (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
  }
  getDia() {
    return ('0' + (new Date().getDate())).slice(-2);
  }

  getMes() {
    switch (new Date().getMonth()) {
      case 0:
        return 'Enero';
      case 1:
        return 'Febrero';
      case 2:
        return 'Marzo';
      case 3:
        return 'Abril';
      case 4:
        return 'Mayo';
      case 5:
        return 'Junio';
      case 6:
        return 'Julio';
      case 7:
        return 'Agosto';
      case 8:
        return 'Setiembre';
      case 9:
        return 'Octubre';
      case 10:
        return 'Noviembre';
      case 11:
        return 'Diciembre';
    }
  }

  getAnio() {
    return new Date().getFullYear().toString().substr(2);
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-B/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }


  verPdfCelularGrilla(item: Telefono) {

    // if (item.fileCelular !== null){
    //     const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    //     const urlPdf = URL.createObjectURL(item.fileCelular);
    //     modalRef.componentInstance.pdfUrl = urlPdf;
    //     modalRef.componentInstance.titleModal = "Vista Previa - Celular: " + item.celular;
    // }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(item.pathNameCelular)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Contrato Celular " +item.nroCelular;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    // }

  }
}
