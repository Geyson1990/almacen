import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Anexo001_H17Request } from '../../../../../core/models/Anexos/Anexo001_H17/Anexo001_H17Request';
import { A001_H17_DeclaracionJurada } from '../../../../../core/models/Anexos/Anexo001_H17/Secciones';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo001H17Service } from '../../../../../core/services/anexos/anexo001-h17.service';
import { NgbActiveModal, NgbAccordionDirective , NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { Anexo001_H17Response } from '../../../../../core/models/Anexos/Anexo001_H17/Anexo001_H17Response';
import { DatosFormulario001Service } from '../../../../../core/services/anexos/datos-formulario001.service';
import { DatosFormulario001 } from '../../../../../core/models/Anexos/DatosFormulario001';
import { MetaData } from '../../../../../core/models/Anexos/Anexo001_C17/MetaData';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';

@Component({
  selector: 'app-anexo001-h17',
  templateUrl: './anexo001-h17.component.html',
  styleUrls: ['./anexo001-h17.component.css']
})
export class Anexo001H17Component implements OnInit {

  fileToUpload: File;
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false

  idAnexo: number = 0;

  // idAnexo: number;
  public formAnexo: UntypedFormGroup;
  public nombreApellido: string;
  public nroDocumento: string;
  public tipoRepresentacion: string;
  public razonSocial: string;

  public currentDate = new Date();
  public day: number;
  public month: string;
  public year: number;
  public meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  filePdfSeleccionado: any = null;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private anexoService: Anexo001H17Service,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private datosFormulario001Service: DatosFormulario001Service,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService
  ) {

  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.createForm();
  //VERIFICAMOS QUE EL FORMULARIO YA ESTÉ GRABADO
    for (let i = 0; i < this.dataRequisitosInput.length; i++) {
      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }
    }
    setTimeout(() => {
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqRefId).subscribe(
     
          (dataForm : Anexo001_H17Response) => {
          this.funcionesMtcService.ocultarCargando();
      
          const data: any = JSON.parse(dataForm.metaData);
          // console.log(JSON.stringify(JSON.parse(dataForm.metaData), null, 10));
          if (this.dataInput.movId === 0 || this.uriArchivo==='') {
          console.log("===> primera condicón");
          this.formAnexo.controls['nombreApellido'].setValue(`${data.DatosSolicitante.RepresentanteLegal.apellidoPaterno} ${data.DatosSolicitante.RepresentanteLegal.apellidoMaterno} ${data.DatosSolicitante.RepresentanteLegal.Nombres}`);
          this.formAnexo.controls['nroDocumento'].setValue(data.DatosSolicitante.RepresentanteLegal.NumeroDocumento);
          this.formAnexo.controls['tipoRepresentacion'].setValue('Representante Legal');
          this.formAnexo.controls['razonSocial'].setValue(data.DatosSolicitante.RazonSocial);
          this.formAnexo.controls['nroPartida'].setValue(data.DatosSolicitante.RepresentanteLegal.NroPartida);
          this.formAnexo.controls['domicilio'].setValue(data.DatosSolicitante.RepresentanteLegal.DomicilioRepresentanteLegal);
          }
          console.log(this.dataInput.movId);
          if (this.dataInput.movId > 0 ) {
            
            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo001_H17Response) => {
                this.funcionesMtcService.ocultarCargando();
                
                const metaData: any = JSON.parse(dataAnexo.metaData);
                console.log(metaData);
                this.idAnexo = dataAnexo.anexoId;
            if(this.uriArchivo!==''){
              this.formAnexo.controls['nombreApellido'].setValue(`${metaData.declaracionJurada.nombreApellido}`);
              this.formAnexo.controls['nroDocumento'].setValue(metaData.declaracionJurada.nroDocumento);
              this.formAnexo.controls['tipoRepresentacion'].setValue('Representante Legal');
              this.formAnexo.controls['razonSocial'].setValue(metaData.declaracionJurada.razonSocial);
              this.formAnexo.controls['nroPartida'].setValue(metaData.declaracionJurada.nroPartida);
              this.formAnexo.controls['domicilio'].setValue(metaData.declaracionJurada.domicilio);
              this.formAnexo.get("dia").setValue(metaData.declaracionJurada.dia);
              this.formAnexo.get("mes").setValue(metaData.declaracionJurada.mes);
              this.formAnexo.get("anio").setValue(metaData.declaracionJurada.anio);
            }
                
              },
              error => {
                this.errorAlCargarData = true;
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para recuperar los datos guardados del anexo');
              });
          }

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        }
      );

    });
    if(this.dataInput.rutaDocumento === 0) {
      this.activeModal.close(this.graboUsuario);
      this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
      return;
    }
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa =  tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
  }

  get nroPartidaNoValido(): boolean{
    return this.formAnexo.get('nroPartida').invalid && this.formAnexo.get('nroPartida').touched;
  }

  get domicilioNoValido(): boolean{
    return this.formAnexo.get('domicilio').invalid && this.formAnexo.get('domicilio').touched;
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      nombreApellido: this.fb.control(''),
      nroDocumento: this.fb.control(''),
      tipoRepresentacion: this.fb.control('', [Validators.required]),
      razonSocial: this.fb.control('', [Validators.required]),
      nroPartida: ['', [ Validators.required ]],
      domicilio: ['', [ Validators.required ]],

      dia: this.fb.control(this.getDia(), [Validators.required]),
      mes: this.fb.control(this.getMes(), [Validators.required]),
      anio: this.fb.control(this.getAnio(), [Validators.required]),
    });
  }

  save(){


    const dataGuardar: Anexo001_H17Request = new Anexo001_H17Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "E";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    dataGuardar.metaData.pathName = 'ArchivTest';
    dataGuardar.metaData.archivo = this.filePdfSeleccionado;

    // SECCION (Declaración Jurada)
    const declaracionJurada: A001_H17_DeclaracionJurada = new A001_H17_DeclaracionJurada();
    declaracionJurada.nombreApellido = this.formAnexo.get('nombreApellido').value;
    declaracionJurada.nroDocumento = this.formAnexo.get('nroDocumento').value;
    declaracionJurada.tipoRepresentacion = this.formAnexo.get('tipoRepresentacion').value;
    declaracionJurada.razonSocial = this.formAnexo.get('razonSocial').value;
    declaracionJurada.nroPartida = this.formAnexo.get('nroPartida').value;
    declaracionJurada.domicilio = this.formAnexo.get('domicilio').value;
    //declaracionJurada.fechaTramite = new Date();
    declaracionJurada.dia = this.formAnexo.get('dia').value;
    declaracionJurada.mes = this.formAnexo.get('mes').value;
    declaracionJurada.anio = this.formAnexo.get('anio').value;
    dataGuardar.metaData.declaracionJurada = declaracionJurada;


    console.log(dataGuardar);


    // console.log(JSON.stringify(dataGuardar, null, 10));
    // console.log(JSON.stringify(dataGuardar));

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.log(dataGuardarFormData);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
          //this.anexoService.post<any>(dataGuardar)
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

  handleFileInput(files: FileList) {
      this.filePdfSeleccionado = files.item(0);
  }
  vistaPreviaPdfCroquis() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL( this.filePdfSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Documento";
  };
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-H/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

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
}
