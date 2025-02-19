import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_F17Request } from 'src/app/core/models/Anexos/Anexo001_F17/Anexo001_F17Request';
import { Anexo001_F17Response } from 'src/app/core/models/Anexos/Anexo001_F17/Anexo001_F17Response';
import { DatosFormulario001 } from 'src/app/core/models/Anexos/DatosFormulario001';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { Anexo001F17Service } from 'src/app/core/services/anexos/anexo001-f17.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo001-f17',
  templateUrl: './anexo001-f17.component.html',
  styleUrls: ['./anexo001-f17.component.css']
})
export class Anexo001F17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFormulario: UntypedFormGroup;
  filePdfSeleccionado: any = null;

  listaNacionalidad: SelectionModel[] = []
  
  //CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  paComunidadAndina: string[]=["DSTT-010","DSTT-011","DSTT-013"];
  esComunidadAndina:boolean = false;

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001F17Service,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    //==================================================================================
    //RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    //==================================================================================

    this.uriArchivo = this.dataInput.rutaDocumento;

    if(this.paComunidadAndina.indexOf(this.codigoProcedimientoTupa)>-1) this.esComunidadAndina=true; else this.esComunidadAndina=false;

    if(this.esComunidadAndina){
      this.listaNacionalidad= [
        { value: 1, text: 'Boliviana' },
        { value: 5, text: 'Argentina' },
        { value: 6, text: 'Chilena' },
        { value: 7, text: 'Uruguaya' },
        { value: 8, text: 'Paraguaya' },
        { value: 9, text: 'Brasileña' }
      ]
    }else{
      this.listaNacionalidad= [
        { value: 1, text: 'Boliviana' },
        { value: 2, text: 'Colombiana' },
        { value: 3, text: 'Ecuatoriana' },
        { value: 4, text: 'Peruana'}
      ]
    }

    this.anexoFormulario = this.fb.group({
      nombreUsuario: this.fb.control(''),
      numeroDocumento: this.fb.control(''),
      domicilio: this.fb.control('', [Validators.required]),
      razonSocial: this.fb.control('', [Validators.required]),
      nacionalidad: this.fb.control('', [Validators.required]),

      dia: this.fb.control(this.getDia(), [Validators.required]),
      mes: this.fb.control(this.getMes(), [Validators.required]),
      anio: this.fb.control(this.getAnio(), [Validators.required]),
    });

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

      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {

          this.funcionesMtcService.ocultarCargando();
          const metaDataForm: any = JSON.parse(dataForm.metaData);

          this.anexoFormulario.controls['nombreUsuario'].setValue(
            `${metaDataForm?.DatosSolicitante?.RepresentanteLegal?.apellidoPaterno} ${metaDataForm?.DatosSolicitante?.RepresentanteLegal?.apellidoMaterno} ${metaDataForm?.DatosSolicitante?.RepresentanteLegal?.Nombres}`
          );
          this.anexoFormulario.controls['numeroDocumento'].setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.NumeroDocumento);
          this.anexoFormulario.controls['domicilio'].setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.DomicilioRepresentanteLegal);
          this.anexoFormulario.controls['razonSocial'].setValue(metaDataForm?.DatosSolicitante?.RazonSocial);

          if (this.dataInput.movId > 0) {
            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo001_F17Response) => {
                this.funcionesMtcService.ocultarCargando();
                const metaData: any = JSON.parse(dataAnexo.metaData);
                this.idAnexo = dataAnexo.anexoId;

                this.anexoFormulario.get("nacionalidad").setValue(metaData.nacionalidad.value);
                this.anexoFormulario.get("dia").setValue(metaData.dia);
                this.anexoFormulario.get("mes").setValue(metaData.mes);
                this.anexoFormulario.get("anio").setValue(metaData.anio);
              },
              error => {
                // this.errorAlCargarData = true;
                this.funcionesMtcService
                  .ocultarCargando()
                //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
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
  }

  formInvalid(control: string) {
    return this.anexoFormulario.get(control).invalid &&
      (this.anexoFormulario.get(control).dirty || this.anexoFormulario.get(control).touched);
  }

  onChangeInput(event) {
    if (this.idAnexo === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar el anexo primero');

    if (event.target.files.length === 0)
      return;

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfSeleccionado = event.target.files[0];
    event.target.value = "";
  }

  vistaPreviaPdf() {
    if (this.filePdfSeleccionado === null)
      return;

    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa Pdf Firmado";
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-F/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }


  guardarAnexo() {

    if (this.anexoFormulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    let dataGuardar: Anexo001_F17Request = new Anexo001_F17Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "F";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //------------------------------------- 
    dataGuardar.metaData.tipoSolicitud = {
      codigo: this.dataInput.tipoSolicitud.codigo,
      descripcion: this.dataInput.tipoSolicitud.descripcion
    } as TipoSolicitudModel
    //-------------------------------------
    dataGuardar.metaData.nombreUsuario = this.anexoFormulario.controls['nombreUsuario'].value;
    dataGuardar.metaData.numeroDocumento = this.anexoFormulario.controls['numeroDocumento'].value;
    dataGuardar.metaData.domicilio = this.anexoFormulario.controls['domicilio'].value;
    dataGuardar.metaData.razonSocial = this.anexoFormulario.controls['razonSocial'].value;
    dataGuardar.metaData.nacionalidad = {
      value: this.anexoFormulario.controls['nacionalidad'].value,
      text: this.listaNacionalidad.find(item => item.value == this.anexoFormulario.controls['nacionalidad'].value)?.text
    }

    dataGuardar.metaData.dia = this.getDia();
    dataGuardar.metaData.mes = this.getMes();
    dataGuardar.metaData.anio = this.getAnio();

    dataGuardar.metaData.file = this.filePdfSeleccionado;

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
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

}
