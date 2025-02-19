import { Component, Input, OnInit , ViewChild} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo002_I17Request } from 'src/app/core/models/Anexos/Anexo002_I17/Anexo002_I17Request';
import { Tripulacion, A002_I17_Seccion2 } from 'src/app/core/models/Anexos/Anexo002_I17/Tripulacion';
import { DatosFormulario001 } from 'src/app/core/models/Anexos/DatosFormulario001';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo002I17Service } from 'src/app/core/services/anexos/anexo002-i17.service';
import { Anexo002_I17Response } from 'src/app/core/models/Anexos/Anexo002_I17/Anexo002_I17Response';
import { DatosFormulario001Service } from 'src/app/core/services/anexos/datos-formulario001.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { TripulacionModel } from 'src/app/core/models/TripulacionModel';

@Component({
  selector: 'app-anexo002-i17',
  templateUrl: './anexo002-i17.component.html',
  styleUrls: ['./anexo002-i17.component.css']
})
export class Anexo002I17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  codigoTupa: string = "" ;
  descripcionTupa: string;

  idAnexo: number = 0;
  anexoFormulario: UntypedFormGroup;
  filePdfSeleccionado: any = null;
  indexEditTabla: number = -1;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  visibleButtonRestriccion1: boolean = false;
  filePdfRestriccion1Seleccionado: any = null;
  pathPdfRestriccion1Seleccionado: any = null;

  visibleButtonRestriccion2: boolean = false;
  filePdfRestriccion2Seleccionado: any = null;
  pathPdfRestriccion2Seleccionado: any = null;

  visibleButtonRestriccion3: boolean = false;
  filePdfRestriccion3Seleccionado: any = null;
  pathPdfRestriccion3Seleccionado: any = null;

  listaTripulacion: Tripulacion[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];

  listaCargos: SelectionModel[] = [
    { value: 1, text: 'Gerente General' },
    { value: 2, text: 'Socios' },
    { value: 3, text: 'Accionistas' },
    { value: 4, text: 'Asociados' },
    { value: 5, text: 'Directores' },
    { value: 6, text: 'Administradores' },
    { value: 7, text: 'Representante Legal' },
    { value: 8, text: 'Secretarios' },
    { value: 9, text: 'Subgerente general' },
    { value: 10, text: 'Otros' },
  ];

  dia:string = "";
  mes:string = "";
  anio:string = "";

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo002I17Service,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

    this.uriArchivo = this.dataInput.rutaDocumento;

    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));

    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;

    this.anexoFormulario = this.fb.group({
      tipoDocumentoForm: this.fb.control(''),
      numeroDocumentoForm: this.fb.control(''),
      apellidosForm: this.fb.control(''),
      nombresForm: this.fb.control(''),
      cargoForm: this.fb.control(''),
      restriccion1: this.fb.control(false),
      restriccion2: this.fb.control(false),
      restriccion3: this.fb.control(false),
    });

    this.dia = this.getDia();
    this.mes = this.getMes();
    this.anio = this.getAnio();

    this.recuperarInformacion();

    setTimeout(() => {
        this.acc.expand('seccion-2');
    });
    /*setTimeout(() => {
      this.funcionesMtcService.mostrarCargando();
      this.datosFormulario001Service.get<DatosFormulario001>("1").subscribe(
        data => {
          this.funcionesMtcService.ocultarCargando();

          this.listaTripulacion.push({
            tipoDocumento: {
              id: '1', //data.representante.tipoDocumento,
              documento: this.listaTiposDocumentos.filter(item => item.id == '1')[0].documento
            },
            numeroDocumento: data.representante.numeroDocumento,
            apellidos: data.representante.nombresYApellidos.toUpperCase(),
            nombres: data.representante.nombresYApellidos.toUpperCase(),
            cargo: {
              value: 7,
              text: this.listaCargos.filter(item => item.value == 7)[0].text
            }
          } as Tripulacion)

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        }
      );

    });*/
  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();

    if (tipoDocumento === '1')//DNI
      return 8;
    else if (tipoDocumento === '2')//CE
      return 12;
    return 0
  }

  changeTipoDocumento() {
    this.anexoFormulario.controls['numeroDocumentoForm'].setValue('');
    this.inputNumeroDocumento();
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.anexoFormulario.controls['apellidosForm'].setValue('');
    this.anexoFormulario.controls['nombresForm'].setValue('');
  }

  buscarNumeroDocumento() {

    const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();
    const numeroDocumento: string = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '1' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '1') {//DNI
      this.reniecService.getDni(numeroDocumento).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          this.addTripulacion(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer + ' ' + datosPersona.apSegundo,
            numeroDocumento);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );

    } else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
      this.extranjeriaService.getCE(numeroDocumento).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

          this.addTripulacion(tipoDocumento,
            respuesta.CarnetExtranjeria.nombres,
            respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido,
            numeroDocumento);

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }

  }


  addTripulacion(tipoDocumento: string, nombres: string, apellidos: string, numeroDocumento: string) {

    //buscamos si el documento ya existe en la grilla:
    const indexFind = this.listaTripulacion.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
    }

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '1' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.anexoFormulario.controls['apellidosForm'].setValue(apellidos);
        this.anexoFormulario.controls['nombresForm'].setValue(nombres);
      });
  }

  formularioCompleto(): boolean {

    if (this.anexoFormulario.controls['tipoDocumentoForm'].value.trim() === '' ||
      this.anexoFormulario.controls['numeroDocumentoForm'].value.trim() === '' ||
      this.anexoFormulario.controls['apellidosForm'].value.trim() === '' ||
      this.anexoFormulario.controls['nombresForm'].value.trim() === '' ||
      this.anexoFormulario.controls['cargoForm'].value.trim() === '')
      return false;//NO ESTÁ COMLETO
    return true;//COMPLETO
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-I/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  agregarTripulacion() {

    if (this.formularioCompleto() === false)
      return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

    const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();
    const numeroDocumento: string = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();

    const indexFind = this.listaTripulacion.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
    }

    if (this.indexEditTabla === -1) {

      this.listaTripulacion.push({
        tipoDocumento: {
          id: this.anexoFormulario.controls['tipoDocumentoForm'].value,
          documento: this.listaTiposDocumentos.filter(item => item.id == this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento
        },
        numeroDocumento: this.anexoFormulario.controls['numeroDocumentoForm'].value,
        apellidos: this.anexoFormulario.controls['apellidosForm'].value,
        nombres: this.anexoFormulario.controls['nombresForm'].value,
        cargo: {
          value: this.anexoFormulario.controls['cargoForm'].value,
          text: this.listaCargos.filter(item => item.value == this.anexoFormulario.get('cargoForm').value)[0].text
        }
      });
    } else {
      this.listaTripulacion[this.indexEditTabla].tipoDocumento = {
        id: this.anexoFormulario.controls['tipoDocumentoForm'].value,
        documento: this.listaTiposDocumentos.filter(item => item.id == this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento
      };

      this.listaTripulacion[this.indexEditTabla].numeroDocumento = this.anexoFormulario.controls['numeroDocumentoForm'].value;
      this.listaTripulacion[this.indexEditTabla].apellidos = this.anexoFormulario.controls['apellidosForm'].value;
      this.listaTripulacion[this.indexEditTabla].nombres = this.anexoFormulario.controls['nombresForm'].value;
      this.listaTripulacion[this.indexEditTabla].cargo = {
        value: this.anexoFormulario.controls['cargoForm'].value,
        text: this.listaCargos.filter(item => item.value == this.anexoFormulario.get('cargoForm').value)[0].text
      };

    }

    this.cancelarModificacion();
  }

  cancelarModificacion() {
    this.anexoFormulario.controls['tipoDocumentoForm'].setValue('');
    this.anexoFormulario.controls['numeroDocumentoForm'].setValue('');
    this.anexoFormulario.controls['apellidosForm'].setValue('');
    this.anexoFormulario.controls['nombresForm'].setValue('');
    this.anexoFormulario.controls['cargoForm'].setValue('');

    this.indexEditTabla = -1;
  }

  modificarTripulacion(item: Tripulacion, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexoFormulario.controls['tipoDocumentoForm'].setValue(item.tipoDocumento.id);
    this.anexoFormulario.controls['numeroDocumentoForm'].setValue(item.numeroDocumento);
    this.anexoFormulario.controls['apellidosForm'].setValue(item.apellidos);
    this.anexoFormulario.controls['nombresForm'].setValue(item.nombres);
    this.anexoFormulario.controls['cargoForm'].setValue(item.cargo.value);
  }

  eliminarTripulacion(item: Tripulacion, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaTripulacion.splice(index, 1);
        });
    }
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

  onChangeRestriccion1() {

    this.visibleButtonRestriccion1 = this.anexoFormulario.controls['restriccion1'].value;

    if (this.visibleButtonRestriccion1 === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonRestriccion1 = false;
        this.anexoFormulario.controls['restriccion1'].setValue(false);
      });
    } else {
      this.filePdfRestriccion1Seleccionado = null;
      this.pathPdfRestriccion1Seleccionado = null;
    }
  }

  onChangeRestriccion2() {

    this.visibleButtonRestriccion2 = this.anexoFormulario.controls['restriccion2'].value;

    if (this.visibleButtonRestriccion2 === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonRestriccion2 = false;
        this.anexoFormulario.controls['restriccion2'].setValue(false);
      });
    } else {
      this.filePdfRestriccion2Seleccionado = null;
      this.pathPdfRestriccion2Seleccionado = null;
    }
  }

  onChangeRestriccion3() {

    this.visibleButtonRestriccion3 = this.anexoFormulario.controls['restriccion3'].value;

    if (this.visibleButtonRestriccion3 === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonRestriccion3 = false;
        this.anexoFormulario.controls['restriccion3'].setValue(false);
      });
    } else {
      this.filePdfRestriccion3Seleccionado = null;
      this.pathPdfRestriccion3Seleccionado = null;
    }
  }

  onChangeInputRestriccion1(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }
    this.filePdfRestriccion1Seleccionado = event.target.files[0];
    event.target.value = "";
  }

  onChangeInputRestriccion2(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfRestriccion2Seleccionado = event.target.files[0];
    event.target.value = "";
  }

  onChangeInputRestriccion3(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfRestriccion3Seleccionado = event.target.files[0];
    event.target.value = "";
  }

  vistaPreviaRestriccion1() {

    if (this.pathPdfRestriccion1Seleccionado === null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfRestriccion1Seleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfRestriccion1Seleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  vistaPreviaRestriccion2() {

    if (this.pathPdfRestriccion2Seleccionado === null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfRestriccion2Seleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfRestriccion2Seleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  vistaPreviaRestriccion3() {

    if (this.pathPdfRestriccion3Seleccionado === null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfRestriccion3Seleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfRestriccion3Seleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Adjunto";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  guardarAnexo() {

    if (this.listaTripulacion.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una persona en la tripulación.');

    if (!this.filePdfRestriccion1Seleccionado && !this.pathPdfRestriccion1Seleccionado)
        return this.funcionesMtcService.mensajeError('Debe ingresar toda la documentación que se debe adjuntar.');

    if (!this.filePdfRestriccion2Seleccionado && !this.pathPdfRestriccion2Seleccionado)
        return this.funcionesMtcService.mensajeError('Debe ingresar toda la documentación que se debe adjuntar.');

    if (!this.filePdfRestriccion3Seleccionado && !this.pathPdfRestriccion3Seleccionado)
        return this.funcionesMtcService.mensajeError('Debe ingresar toda la documentación que se debe adjuntar.');

    if (this.anexoFormulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    let dataGuardar: Anexo002_I17Request = new Anexo002_I17Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId,
    dataGuardar.movimientoFormularioId = 17;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = "I";
    //-------------------------------------
    dataGuardar.metaData.listaTripulacion = this.listaTripulacion;
    dataGuardar.metaData.dia = this.dia;
    dataGuardar.metaData.mes = this.mes;
    dataGuardar.metaData.anio = this.anio;
    dataGuardar.metaData.file = this.filePdfSeleccionado;

    let seccion2: A002_I17_Seccion2 = new A002_I17_Seccion2();
    /*seccion2.restriccion1 = this.anexoFormulario.controls['restriccion1'].value;
    seccion2.restriccion2 = this.anexoFormulario.controls['restriccion2'].value;
    seccion2.restriccion3 = this.anexoFormulario.controls['restriccion3'].value;*/
    seccion2.restriccion1 = true;
    seccion2.restriccion2 = true;
    seccion2.restriccion3 = true;
    seccion2.fileRestriccion1 = this.filePdfRestriccion1Seleccionado;
    seccion2.fileRestriccion2 = this.filePdfRestriccion2Seleccionado;
    seccion2.fileRestriccion3 = this.filePdfRestriccion3Seleccionado;
    seccion2.pathNameR1 = this.pathPdfRestriccion1Seleccionado;
    seccion2.pathNameR2 = this.pathPdfRestriccion2Seleccionado;
    seccion2.pathNameR3 = this.pathPdfRestriccion3Seleccionado;
    dataGuardar.metaData.seccion2 = seccion2;
    //console.log(JSON.stringify(this.funcionesMtcService.jsonToFormData(dataGuardar), null, 10));
    //const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.log(JSON.stringify(dataGuardar, null, 10));
    //console.log(JSON.stringify(dataGuardarFormData, null, 10));

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


  recuperarInformacion(){

      //si existe el documento
      if (this.dataInput.movId > 0) {
          //RECUPERAMOS LOS DATOS DEL ANEXO
          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataAnexo: Anexo002_I17Response) => {
              const metaData: any = JSON.parse(dataAnexo.metaData);

              this.idAnexo = dataAnexo.anexoId;

              console.log(JSON.stringify(dataAnexo, null, 10));
              console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

              this.listaTripulacion.length = 0;

              let i = 0;
              for (i; i < metaData.listaTripulacion.length; i++) {

                this.listaTripulacion.push({
                  tipoDocumento: {
                    id: metaData.listaTripulacion[i].tipoDocumento.id,
                    documento: metaData.listaTripulacion[i].tipoDocumento.documento
                  },
                  numeroDocumento: metaData.listaTripulacion[i].numeroDocumento,
                  apellidos: metaData.listaTripulacion[i].apellidos,
                  nombres: metaData.listaTripulacion[i].nombres,
                  cargo: {
                    value: metaData.listaTripulacion[i].cargo.value,
                    text: metaData.listaTripulacion[i].cargo.text
                  }
                })
              }

              this.anexoFormulario.get("restriccion1").setValue(metaData.seccion2.restriccion1);
              this.anexoFormulario.get("restriccion2").setValue(metaData.seccion2.restriccion2);
              this.anexoFormulario.get("restriccion3").setValue(metaData.seccion2.restriccion3);

              this.pathPdfRestriccion1Seleccionado = metaData.seccion2.pathNameR1;
              this.pathPdfRestriccion2Seleccionado = metaData.seccion2.pathNameR2;
              this.pathPdfRestriccion3Seleccionado = metaData.seccion2.pathNameR3;

              /*this.visibleButtonRestriccion1 = true;
              this.visibleButtonRestriccion2 = true;
              this.visibleButtonRestriccion3 = true;*/

              this.dia = metaData.dia;
              this.mes = metaData.mes;
              this.anio = metaData.anio;

            },
            error => {
              this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para recuperar los datos guardados del anexo');
            });
        }

    }


}
