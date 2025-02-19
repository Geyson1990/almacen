import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { Anexo002_D17Request } from '../../../../../core/models/Anexos/Anexo002_D17/Anexo002_D17Request';
import { Anexo002D17Service } from '../../../../../core/services/anexos/anexo002-d17.service';
import { Cargo, A002_D17_Seccion_Declaracion_Juarada, Persona, A002_D17_Seccion_Documento_Adjuntar } from '../../../../../core/models/Anexos/Anexo002_D17/Secciones';
import { Documento } from '../../../../../core/models/Anexos/Anexo002_D17/Secciones';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { SelectionModel } from '../../../../../core/models/SelectionModel';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { Anexo002_D17Response } from 'src/app/core/models/Anexos/Anexo002_D17/Anexo002_D17Response';

@Component({
  selector: 'app-anexo002-d17',
  templateUrl: './anexo002-d17.component.html',
  styleUrls: ['./anexo002-d17.component.css']
})

export class Anexo002D17Component implements OnInit {

  public idAnexo: number;
  public formAnexo: UntypedFormGroup;
  public suscritos: any[];
  @Input() public dataInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  public documentos: any[];
  public visibleButton1: boolean;
  public visibleButton2: boolean;
  public visibleButton3: boolean;

  public filePdfSeleccionado1: any = null;
  public filePdfSeleccionado2: any = null;
  public filePdfSeleccionado3: any = null;
  public archivoAdjuntoGeneral: any = null;
  public recordIndexToEdit: number;
  listaDocumentos: Documento[]=[];
  listaDocumentos1: Documento[]=[];
  // public currentDate = new Date();
  // public day: number;
  // public month: string;
  // public year: number;
  // public meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  filePdfDocSeleccionado: any = null;
  filePdfDocPathName: string = null;
  visibleButtonDoc: boolean=false;
  cargadosDoc: number = 0;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  listaCargos: Cargo[] = [
    { id: 1, descripcion: 'Gerente General' },
    { id: 2, descripcion: 'Socios' },
    { id: 3, descripcion: 'Accionistas' },
    { id: 4, descripcion: 'Asociados' },
    { id: 5, descripcion: 'Directores' },
    { id: 6, descripcion: 'Administradores' },
    { id: 7, descripcion: 'Representante Legal' },
    { id: 8, descripcion: 'Secretarios' },
    { id: 9, descripcion: 'Subgerente general' },
    { id: 10, descripcion: 'Otros' },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private reniecService: ReniecService,
    private anexoService: Anexo002D17Service,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService
  ) {
    this.suscritos = [];
    this.documentos = [];
    this.visibleButton1 = false;
    this.visibleButton2 = false;
    this.visibleButton3 = false;

    this.recordIndexToEdit = -1;
    this.idAnexo = 0;
    this.archivoAdjuntoGeneral = null;


  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.createForm();
    this.listaDocumentos.push(
      {id: 1, descripcion: `La persona natural, o los socios, accionistas, asociados, directores, administradores o representantes legales de la persona jurídica que pretenda acceder a prestar servicio de transporte, no podrán encontrarse condenados por la comisión de los delitos de Tráfico Ilícito de Drogas, Lavado de Activos, Pérdida de Dominio, o Delito Tributario, ni podrán serlo, en tanto se encuentre vigente la autorización. Dicha condena deberá constar en una sentencia consentida o ejecutoriada que no haya sido objeto de rehabilitación.
      Esta prohibición es aplicable a los accionistas, socios, directores y representantes legalesde la persona jurídica que sea accionista o socia del solicitante o transportista. (Num. 37.4)`,flagAdjunto: true, archivoAdjunto: null, pathName: null},
      {id: 2, descripcion: 'La persona natural o los socios, accionistas, asociados, directores, administradores o representantes legales de la persona jurídica que pretenda acceder a prestar servicio de transporte no podrán haber sido declarados en quiebra, estar incursos en un proceso concursal, o estar sometido a medida judicial o administrativa que lo prive o restrinja de la administración de sus bienes, ni podrán serlo, en tanto se encuentre vigente la autorización. Esta prohibición es aplicable a los accionistas, socios, directores y representantes legalesde la persona jurídica que sea accionista o socia del solicitante o transportista. (Num. 37.5)',flagAdjunto: true, pathName: null,  archivoAdjunto: null},
      {id: 3, descripcion: 'No debe haber sufrido la cancelación de la autorización para prestar servicios de transporte, o encontrarse inhabilitado en forma definitiva para ello. Lo dispuesto en el presente numeral alcanza a los socios, accionistas, asociados, directores y representantes legales del transportista que fue cancelado y/o inhabilitado (Num. 37.7)',flagAdjunto: true,  archivoAdjunto: null, pathName: null},

      );
      this.listaDocumentos1 = this.listaDocumentos;
      this.cargaDatosGuardado();
      const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa =  tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;

  }


  get numeroDniNoValido(): boolean{
    return this.formAnexo.get('numeroDni').invalid && this.formAnexo.get('numeroDni').touched;
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      numeroDni: ['', [ Validators.minLength(8), Validators.maxLength(8) ]],
      nombresApellidos: [''],
      cargo: [''],
      docAdjuntar1: [false],
      docAdjuntar2: [false],
      docAdjuntar3: [false],

      dia: this.fb.control(this.getDia(), [Validators.required]),
      mes: this.fb.control(this.getMes(), [Validators.required]),
      anio: this.fb.control(this.getAnio(), [Validators.required]),
    });
  }

  agregarDocumento() {

    if (this.filePdfDocSeleccionado === null)
      return this.funcionesMtcService.mensajeError('A seleccionado Documento, debe cargar un archivo PDF');

    if (this.recordIndexToEdit !==-1)
      this.listaDocumentos[this.recordIndexToEdit].archivoAdjunto = this.filePdfDocSeleccionado;
      this.cargadosDoc+=1;
    this.cancelarDocumento();
  }
  cancelarDocumento() {
    this.recordIndexToEdit = -1;
    this.filePdfDocSeleccionado = null;
    this.filePdfDocPathName = null;
    this.visibleButtonDoc = false;
  }

  modificarDocumento(item, index) {
    if (this.recordIndexToEdit !== -1)
      return;

    this.recordIndexToEdit = index;
    this.visibleButtonDoc = true;

    this.filePdfDocSeleccionado = item.archivoAdjunto;
    this.filePdfDocPathName = item.pathName;

  }

  eliminarDocumento(item, index) {
    if (this.recordIndexToEdit === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el documento Adjunto?')
        .then(() => {
          item.archivoAdjunto=null;
          item.pathName=null;
        });
    }
  }

  verPdfDocGrilla(item: Documento) {
    if (this.recordIndexToEdit !== -1)
      return;

    if (item.pathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(item.pathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          item.archivoAdjunto = <File>file;
          item.pathName = null;

          this.visualizarGrillaPdf(item.archivoAdjunto);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarGrillaPdf(item.archivoAdjunto);
    }
  }

  visualizarGrillaPdf(file: File) {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Documento Adjunto";
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


  // onChange1( event) {
  //   this.visibleButton1 = event;
  //   if ( this.visibleButton1 === true ) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'ADJUNTO').catch(() => {
  //       this.visibleButton1 = false;
  //       this.formAnexo.controls['docAdjuntar1'].setValue(false);
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
  //       this.visibleButton2 = false;
  //       this.formAnexo.controls['docAdjuntar2'].setValue(false);
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
  //       this.visibleButton3 = false;
  //       this.formAnexo.controls['docAdjuntar3'].setValue(false);
  //     });
  //   } else {
  //     const indexFound = this.documentos.findIndex( documento => documento.id === '3');
  //     if (indexFound !== -1) {
  //       this.documentos.splice(indexFound, 1);
  //     }

  //   }
  //   this.filePdfSeleccionado3 = null;
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
  cargaDatosGuardado(){

    console.log("hola");
    if(this.dataInput.movId >0){
      this.funcionesMtcService.mostrarCargando();
          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(

            (dataAnexo: Anexo002_D17Response) => {
              this.funcionesMtcService.ocultarCargando();

              const metaData: any = JSON.parse(dataAnexo.metaData);
              // console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));
              this.idAnexo = dataAnexo.anexoId;

              console.log(JSON.parse(dataAnexo.metaData));



              this.formAnexo.get("dia").setValue(metaData.declaracionJuarada.dia);
              this.formAnexo.get("mes").setValue(metaData.declaracionJuarada.mes);
              this.formAnexo.get("anio").setValue(metaData.declaracionJuarada.anio);

              // const cargo
              for (var i = 0; i < metaData.declaracionJuarada.personasSuscritas.length; i++) {
                 console.log("primer");
                this.suscritos.push({
                  cargo: metaData.declaracionJuarada.personasSuscritas[i].cargo,
                  nombresApellidos: metaData.declaracionJuarada.personasSuscritas[i].nombresApellidos,
                  numeroDni: metaData.declaracionJuarada.personasSuscritas[i].numeroDni,
                });
              }
              this.listaDocumentos = [];
              for (i = 0; i < metaData.documentoAdjuntar.documentos.length; i++) {
                this.cargadosDoc+=1;
                this.listaDocumentos.push({
                  id: metaData.documentoAdjuntar.documentos[i].id,
                  descripcion: this.listaDocumentos1[i].descripcion,
                  flagAdjunto:  metaData.documentoAdjuntar.documentos[i].flagAdjunto,
                  pathName: metaData.documentoAdjuntar.documentos[i].pathName,
                  archivoAdjunto: null,
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
  }

  onChangeInputGeneral(event) {
    if (event.target.files.length === 0){
      return;
    }

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.archivoAdjuntoGeneral = event.target.files[0];
  }

  buscarNumeroDocumento() {
    const numeroDni: string = this.formAnexo.get('numeroDni').value.trim();

    if ( numeroDni.length === 0 )
      return this.funcionesMtcService.mensajeError('Debe ingresar un Número de DNI');
    if ( numeroDni.length !== 8 )
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();

    this.reniecService.getDni(numeroDni).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();

        if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        // this.addPersona(datosPersona.prenombres + ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo, datosPersona.direccion);
        this.addPersona(`${datosPersona.apPrimer} ${datosPersona.apSegundo} ${datosPersona.prenombres}`, datosPersona.direccion);
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );
  }

  private addPersona(datos: string, direccion: string) {
    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formAnexo.controls.nombresApellidos.setValue(datos);
      });
  }

  public addSuscrito(){
    if (
      this.formAnexo.get('numeroDni').value.trim() === '' ||
      this.formAnexo.get('nombresApellidos').value.trim() === '' ||
      this.formAnexo.get('cargo').value.trim() === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    const numeroDni = this.formAnexo.get('numeroDni').value.trim();
    const indexFound = this.suscritos.findIndex( item => item.numeroDni === numeroDni);

    if ( indexFound !== -1 ) {
      if ( indexFound !== this.recordIndexToEdit ) {
        return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
      }
    }

    const nombresApellidos = this.formAnexo.get('nombresApellidos').value;
    const id: number = this.formAnexo.get('cargo').value;

    let descripcion: string= this.listaCargos.filter(item => item.id == this.formAnexo.get('cargo').value)[0].descripcion
    // switch (id.toString()) {
    //   case '1':
    //     descripcion = this.listaCargos.filter(item => item.value == this.formAnexo.get('cargoForm').value)[0].text
    //   case '2':
    //     descripcion = 'Cargo 2';
    //     break;
    //   case '3':
    //     descripcion = 'Cargo 3';
    //     break;
    // }
    const cargo: Cargo = {
      id,
      descripcion
    }

    // cargo: {
    //   id: this.formAnexo.controls['cargo'].value,
    //   descripcion: this.listaCargos.filter(item => item.value == this.formAnexo.get('cargoForm').value)[0].text
    // }

    const fechaTramite = this.formatDate(new Date());

    if (this.recordIndexToEdit === -1) {
      this.suscritos.push({
        numeroDni,
        nombresApellidos,
        cargo,
        fechaTramite
      });
    } else {
      this.suscritos[this.recordIndexToEdit].numeroDni = numeroDni;
      this.suscritos[this.recordIndexToEdit].nombresApellidos = nombresApellidos;
      this.suscritos[this.recordIndexToEdit].cargo = cargo;
      this.suscritos[this.recordIndexToEdit].fechaTramite = fechaTramite;
    }

    this.clearSuscritoData();
  }

  private clearSuscritoData(){
    this.recordIndexToEdit = -1;

    this.formAnexo.controls.numeroDni.setValue('');
    this.formAnexo.controls.nombresApellidos.setValue('');
    this.formAnexo.controls.cargo.setValue(null);
  }

  public editSuscrito( suscrito: any, i: number ){
    if (this.recordIndexToEdit !== -1){
      return;
    }

    this.recordIndexToEdit = i;

    this.formAnexo.controls.numeroDni.setValue(suscrito.numeroDni);
    this.formAnexo.controls.nombresApellidos.setValue(suscrito.nombresApellidos);
    this.formAnexo.controls.cargo.setValue(suscrito.cargo.id);
  }

  public deleteSuscrito( suscrito: any, i: number ){
    if (this.recordIndexToEdit === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.suscritos.splice(i, 1);
        });
    }
  }



  save(){

    console.log(this.suscritos.length);
    if( this.suscritos.length == 0)
    return this.funcionesMtcService.mensajeError("Debe agregar al menos un suscrito");

    let totalDoc=3;
    console.log(this.listaDocumentos.length+"===="+this.cargadosDoc)
    if(this.cargadosDoc <totalDoc)
    return this.funcionesMtcService.mensajeError("Debe adjuntar toda la lista de documentos");

    const dataGuardar: Anexo002_D17Request = new Anexo002_D17Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // SECCION (Declaración Jurada  )
    const declaracionJurada: A002_D17_Seccion_Declaracion_Juarada = new A002_D17_Seccion_Declaracion_Juarada();
    declaracionJurada.dia = this.formAnexo.get('dia').value;
    declaracionJurada.mes = this.formAnexo.get('mes').value;
    declaracionJurada.anio = this.formAnexo.get('anio').value;

    const suscritos: Persona[] = this.suscritos.map(persona => {
      return {
        nombresApellidos: persona.nombresApellidos,
        cargo: persona.cargo,
        numeroDni: persona.numeroDni,
      } as Persona
    });
    declaracionJurada.personasSuscritas = suscritos;
    dataGuardar.metaData.declaracionJuarada = declaracionJurada;

     // SECCION (Documento Adjuntar)
     const documentoAdjuntar: A002_D17_Seccion_Documento_Adjuntar = new A002_D17_Seccion_Documento_Adjuntar();
     const documentos: Documento[] = this.listaDocumentos.map(documento => {
       return {
         id: documento.id,
         descripcion: null,
         flagAdjunto: documento.flagAdjunto,
         archivoAdjunto: documento.archivoAdjunto,
         pathName: documento.pathName,
       } as Documento
     });

     console.log(documentos);
     documentoAdjuntar.documentos = documentos;
     dataGuardar.metaData.documentoAdjuntar = documentoAdjuntar;

     // SECCION (Archivo adjunto general)
     dataGuardar.metaData.archivoAdjuntoGeneral = this.archivoAdjuntoGeneral;


     console.log(dataGuardar);
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
          // this.anexoService.put<any>(dataGuardarFormData)
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-D/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }
}
