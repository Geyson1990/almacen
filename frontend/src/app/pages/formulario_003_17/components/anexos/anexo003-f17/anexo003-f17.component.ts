import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbActiveModal, NgbAccordionDirective ,NgbModal,NgbDateStruct,NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Anexo003F17Service } from 'src/app/core/services/anexos/anexo003-f17.service';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { A003_F17_Seccion1, A003_F17_Seccion2, Documentos, Suscritos } from 'src/app/core/models/Anexos/Anexo003_F17/Secciones';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { Anexo003_F17Request } from 'src/app/core/models/Anexos/Anexo003_F17/Anexo003_F17Request';
import { Anexo003_F17Response } from 'src/app/core/models/Anexos/Anexo003_F17/Anexo003_F17Response';
import { JsonpClientBackend } from '@angular/common/http';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';

@Component({
  selector: 'app-anexo003-f17',
  templateUrl: './anexo003-f17.component.html',
  styleUrls: ['./anexo003-f17.component.css']
})
export class Anexo003F17Component implements OnInit {

  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  graboUsuario: boolean = false;
  tramiteReqId: number = 0;
  uriArchivo: string = ''; //nombre pdf (completo - adjuntos )
  errorAlCargarData: boolean = false;
  idFormularioMovimiento: number = 18;
  idAnexoMovimiento=0

  visibleButtonDoc: boolean=false;
  codigoTupa: string=''
  descripcionTupa: String=''
  
  datosTupa: any[]=[];
  anexo:UntypedFormGroup;
  tituloAnexo='OTORGAMIENTO DE AUTORIZACIÓN PARA PRESTAR SERVICIO ESPECIAL DE TRANSPORTE TURÍSTICO';
  submitted=false;
  listaSuscritos: Suscritos[]=[];
  listaDocumentos:Documentos[]=[];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];

  indexEditTabla: number = -1;
  
  filePdfDocSeleccionado: any = null;
  filePdfDocPathName: string = null;

  
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


  rellenarDocumentos(){
    this.listaDocumentos.push(
      {nroOrden: 1, descripcion: 'La persona natural, o los socios, accionistas, asociados, directores, administradores o representantes legales de la persona jurídica que pretenda acceder a prestar servicio de transporte, no podrán encontrarse condenados por la comisión de los delitos de Tráfico Ilícito de Drogas, Lavado de Activos, Pérdida de Dominio, o Delito Tributario, ni podrán serlo, en tanto se encuentre vigente la autorización. Dicha condena deberá constar en una sentencia consentida o ejecutoriada que no haya sido objeto de rehabilitación. Esta prohibición es aplicable a los accionistas, socios, directores y representantes legales de la persona jurídica que sea accionista o socia del solicitante o transportista. (Num. 37.4) ',activo: true, pathName: null,  file: null},
      {nroOrden: 2, descripcion: 'La persona natural o los socios, accionistas, asociados, directores, administradores o representantes legales de la persona jurídica que pretenda acceder a prestar servicio de transporte no podrán haber sido declarados en quiebra, estar incursos en un proceso concursal, o estar sometido a medida judicial o administrativa que lo prive o restrinja de la administración de sus bienes, ni podrán serlo, en tanto se encuentre vigente la autorización. Esta prohibición es aplicable a los accionistas, socios, directores y representantes legales de la persona jurídica que sea accionista o socia del solicitante o transportista. (Num. 37.4) ',activo: true, pathName: null,  file: null},
      {nroOrden: 3, descripcion: 'No debe haber sufrido la cancelación de la autorización para prestar servicios de transporte, o encontrarse inhabilitado en forma definitiva para ello. Lo dispuesto en el presente numeral alcanza a los socios, accionistas, asociados, directores y representantes legales del transportista que fue cancelado y/o inhabilitado (Num. 37.7)',activo: true, pathName: null,  file: null},      
      );
  }

  changeTipoDocumento() {
    this.anexo.controls['nroDni'].setValue(' ');
    this.inputNumeroDocumento();
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.anexo.controls['nombres'].setValue('');
    this.anexo.controls['apellidoPaterno'].setValue('');
    this.anexo.controls['apellidoMaterno'].setValue('');
    this.anexo.controls['nombresApellidos'].setValue('');
    

  }


  addSuscritos(){
    console.log("Agrego Suscrito") ;
    
    if (
      this.anexo.controls['nroDni'].value.trim() === '' ||
      this.anexo.controls['nombresApellidos'].value.trim() === '' ||
      this.anexo.controls['cargo'].value.trim() === ''       
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    const nroDni = this.anexo.controls['nroDni'].value.trim().toUpperCase();
    const indexFind = this.listaSuscritos.findIndex(item => item.numeroDocumento === nroDni);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El Suscrito ya se encuentra registrado');
    }

    if (this.indexEditTabla === -1) {
      this.listaSuscritos.push({
        tipoDocumento: {
          id: this.anexo.controls['tipoDocumento'].value,
          documento: this.listaTiposDocumentos.filter(item => item.id == this.anexo.get('tipoDocumento').value)[0].documento
        },
        numeroDocumento: nroDni,
        nombresApellidos:  this.anexo.controls['nombresApellidos'].value,
        cargo: {
          id: this.anexo.controls['cargo'].value,
          descripcion: this.listaCargos.filter(item => item.value == this.anexo.get('cargo').value)[0].text
        }
      });
        //nombres:  this.anexo.controls['nombres'].value,
        //ape_Paterno:this.anexo.controls['apellidoPaterno'].value,
        //ape_Materno:this.anexo.controls['apellidoMaterno'].value,
        //firma: this.anexo.controls['firma'].value,     
    } else {
      this.listaSuscritos[this.indexEditTabla].tipoDocumento = {
        id: this.anexo.controls['tipoDocumento'].value,
        documento: this.listaTiposDocumentos.filter(item => item.id == this.anexo.get('tipoDocumento').value)[0].documento
      };
      this.listaSuscritos[this.indexEditTabla].numeroDocumento = nroDni; 
      this.listaSuscritos[this.indexEditTabla].nombresApellidos = this.anexo.controls['nombresApellidos'].value;
      this.listaSuscritos[this.indexEditTabla].cargo = this.anexo.controls['cargo'].value;      
      this.listaSuscritos[this.indexEditTabla].cargo = {
        id: this.anexo.controls['cargo'].value,
        descripcion: this.listaCargos.filter(item => item.value == this.anexo.get('cargo').value)[0].text
      };
    }

    this.limpiarCampos();
    console.log(this.listaSuscritos);
   }

   limpiarCampos(){
    this.anexo.controls['nroDni'].setValue('');
    this.anexo.controls['nombres'].setValue('');
    this.anexo.controls['apellidoPaterno'].setValue('');
    this.anexo.controls['apellidoMaterno'].setValue('');
    this.anexo.controls['nombresApellidos'].setValue('');
    this.anexo.controls['cargo'].setValue('');
    this.anexo.controls['firma'].setValue('');
    this.indexEditTabla = -1;
   }

   modificarSuscrito(item: Suscritos, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexo.controls['tipoDocumento'].setValue(item.tipoDocumento.id);
    //this.anexo.controls['numeroDocumentoForm'].setValue(item.numeroDocumento);
    this.anexo.controls['nroDni'].setValue(item.numeroDocumento);
    this.anexo.controls['nombresApellidos'].setValue(item.nombresApellidos);
    this.anexo.controls['cargo'].setValue(item.cargo.id);
  }

   eliminarSuscrito(item: Suscritos, index){
    if (this.indexEditTabla === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaSuscritos.splice(index, 1);
        });
    }    
   }
   
   formInvalid(control: string) {
    return this.anexo.get(control).invalid &&
      (this.anexo.get(control).dirty || this.anexo.get(control).touched);
  }
  
  @ViewChild('acc') acc: NgbAccordionDirective ;

constructor(
  public fb:UntypedFormBuilder,
  private funcionesMtcService: FuncionesMtcService,
  private anexoService: Anexo003F17Service,
  private modalService: NgbModal,
  private visorPdfArchivosService: VisorPdfArchivosService,
  private reniecService: ReniecService,
  public activeModal: NgbActiveModal,
  private anexoTramiteService: AnexoTramiteService,
  private extranjeriaService: ExtranjeriaService,
  
) { 
  this.anexo=this.fb.group({
    tipoDocumento:[''],
    nroDni:[''],    
    nombres:[''],
    apellidoPaterno:[''],
    apellidoMaterno:[''],
    nombresApellidos:[''],    
    cargo:[''],   
    firma:[''],
    dia:this.fb.control(this.getDia(), [Validators.required]),
    mes:this.fb.control(this.getMes(), [Validators.required]),
    anio:this.fb.control(this.getAnio(), [Validators.required]),
  })

  //this.rellenarDocumentos();

}

get form() {return this.anexo.controls;}

validarRegistroDeFormulario(index: number, item: Suscritos) {
  if (index === 0) {
    if (item.nombresApellidos.lastIndexOf(' *') !== -1)
      return false;
  }
  return true;
}

soloNumeros(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

getMaxLengthNumeroDocumento() {
  const tipoDocumento: string = this.anexo.controls['tipoDocumento'].value.trim();

  if (tipoDocumento === '1')//DNI
    return 8;
  else if (tipoDocumento === '2')//CE
    return 12;
  return 0
}
buscarDNI(){
  const tipoDocumento: string = '01';    //this.formulario.controls['cod_identidad_representante'].value.trim();
  const numeroDocumento: string = this.anexo.controls['nroDni'].value.trim();

  if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
    return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
  if (tipoDocumento === '01' && numeroDocumento.length !== 8)
    return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

  this.funcionesMtcService.mostrarCargando();

  if (tipoDocumento === '01') {//DNI
    this.reniecService.getDni(numeroDocumento).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();

        if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        const nombre_aux=datosPersona.prenombres+' '+ datosPersona.apPrimer + ' ' + datosPersona.apSegundo;
        this.anexo.controls['nombres'].setValue(datosPersona.prenombres);
        this.anexo.controls['apellidoPaterno'].setValue(datosPersona.apPrimer);
        this.anexo.controls['apellidoMaterno'].setValue(datosPersona.apSegundo);
        this.anexo.controls['nombresApellidos'].setValue(nombre_aux);
        //this.datos.nombre_representante= nombre_aux;
        //this.anexo.controls['domicilio_representante'].setValue(datosPersona.direccion);

      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
      );
    } 

  }



  
  buscarNumeroDocumento() {

    const tipoDocumento: string = this.anexo.controls['tipoDocumento'].value.trim();
    const numeroDocumento: string = this.anexo.controls['nroDni'].value.trim();

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
            const nombre_aux=datosPersona.prenombres+' '+ datosPersona.apPrimer + ' ' + datosPersona.apSegundo;
            this.anexo.controls['nombres'].setValue(datosPersona.prenombres);
            this.anexo.controls['apellidoPaterno'].setValue(datosPersona.apPrimer);
            this.anexo.controls['apellidoMaterno'].setValue(datosPersona.apSegundo);
            this.anexo.controls['nombresApellidos'].setValue(nombre_aux);
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
            
            const nombre_aux=respuesta.CarnetExtranjeria.nombres+' '+ respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido;
            this.anexo.controls['nombres'].setValue(respuesta.CarnetExtranjeria.nombres);
            this.anexo.controls['apellidoPaterno'].setValue(respuesta.CarnetExtranjeria.primerApellido);
            this.anexo.controls['apellidoMaterno'].setValue(respuesta.CarnetExtranjeria.segundoApellido);
            this.anexo.controls['nombresApellidos'].setValue(nombre_aux);

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }

    // setTimeout(() => {

    //   this.funcionesMtcService.ocultarCargando();

    //   this.funcionesMtcService.mensajeConfirmar('Los datos ingresados fueron validados por RENIEC corresponden a la persona ANA BELEN PAREDES SOLIS. ¿Está seguro de agregarlo?')
    //     .then(() => {

    //       this.anexoFormulario.controls['apellidosForm'].setValue('PAREDES SOLIS');
    //       this.anexoFormulario.controls['nombresForm'].setValue('ANA BELEN');
    //     })
    // }, 1000);
  }


  
  verPdfDocGrilla(item) {
    if (this.indexEditTabla !== -1)
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


  eliminarDocumento(item, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el documento Adjunto?')
        .then(() => {
          item.file=null;
          item.pathName=null;
        });
    }
  }

  modificarDocumento(item, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;
    this.visibleButtonDoc = true;

    this.filePdfDocSeleccionado = item.file;
    this.filePdfDocPathName = item.pathName;

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

  agregarDocumento() {

    if (this.filePdfDocSeleccionado === null)
      return this.funcionesMtcService.mensajeError('A seleccionado Documento, debe cargar un archivo PDF');   

    if (this.indexEditTabla !==-1) 
      this.listaDocumentos[this.indexEditTabla].file = this.filePdfDocSeleccionado;        
    this.cancelarDocumento();
  }

  cancelarDocumento() {
    this.indexEditTabla = -1;  
    this.filePdfDocSeleccionado = null;
    this.filePdfDocPathName = null;
    this.visibleButtonDoc = false;
  }






descargarPdf() {
  if (this.idAnexoMovimiento === 0)
    return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

  this.funcionesMtcService.mostrarCargando();

  this.visorPdfArchivosService.get(this.uriArchivo)
  //this.anexoService.readPostFie(this.idAnexoMovimiento)
    .subscribe(
      (file: Blob) => {
        this.funcionesMtcService.ocultarCargando();

        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
        const urlPdf = URL.createObjectURL(file);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Anexo 003-F/17";
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    );

}

guardarAnexo() {

  if (this.anexo.invalid === true)
    return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
  
  if (this.listaSuscritos.length === 0)
    return this.funcionesMtcService.mensajeError('Debe ingresar al menos en la lista de Suscritos');
  
  let cargadosDoc=0
  let i = 0;
  for (i = 0; i < this.listaDocumentos.length; i++) {
    if (this.listaDocumentos[i].file != null || this.listaDocumentos[i].pathName != null )              
        cargadosDoc+=1;
  }

  console.log(this.listaDocumentos);
  console.log(cargadosDoc);

  if (cargadosDoc < 3)
    return this.funcionesMtcService.mensajeError('Debe ingresar PDF en la Lista de documentos');

  let dataGuardar : Anexo003_F17Request = new Anexo003_F17Request();

  dataGuardar.id = this.idAnexoMovimiento;
  dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
  dataGuardar.anexoId = 1;
  dataGuardar.codigo = "F";
  dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
  dataGuardar.metaData.dia=this.getDia();
  dataGuardar.metaData.mes=this.getMes();
  dataGuardar.metaData.anio=this.getAnio();
  //SECCION1
  let seccion1: A003_F17_Seccion1 = new A003_F17_Seccion1();
  seccion1.suscritos=this.listaSuscritos.map(item => {
    return {
      tipoDocumento: item.tipoDocumento,
      numeroDocumento: item.numeroDocumento, 
      nombresApellidos: item.nombresApellidos,
      cargo: item.cargo           
    } as Suscritos
  });  
  dataGuardar.metaData.seccion1 = seccion1;

  let seccion2: A003_F17_Seccion2=new A003_F17_Seccion2();  
  seccion2.documentos=this.listaDocumentos.map(item => {
    return {
      nroOrden: item.nroOrden,
      descripcion: item.descripcion,
      activo: item.activo,
      pathName: item.pathName,
      file: item.file
    } as Documentos
  }); 
  dataGuardar.metaData.seccion2 = seccion2;

  const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

  this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexoMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
  .then(() => {

    console.log(JSON.stringify(dataGuardar));

    this.funcionesMtcService.mostrarCargando();

    if (this.idAnexoMovimiento === 0) {
      //GUARDAR:
      this.anexoService.post<any>(dataGuardarFormData)
        .subscribe(
          data => {
            this.funcionesMtcService.ocultarCargando();
            this.idAnexoMovimiento = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            //this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idAnexoMovimiento = ${this.idAnexoMovimiento})`);
            this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente `);
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
            this.idAnexoMovimiento = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente `);
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
  if (this.dataInput.rutaDocumento) {
    //RECUPERAMOS LOS DATOS DEL ANEXO
    this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
      (dataAnexo: Anexo003_F17Response) => {
        const metaData: any = JSON.parse(dataAnexo.metaData);

        this.idAnexoMovimiento = dataAnexo.anexoId;

        console.log(JSON.stringify(dataAnexo, null, 10));
        console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));
        //this.anexo.get("dia").setValue(metaData.seccion1.dia);
        //this.anexo.get("mes").setValue(metaData.seccion1.mes);
        //this.anexo.get("anio").setValue(metaData.seccion1.anio);

        let i = 0;
        i=0;
        for (i = 0; i < metaData.seccion1.suscritos.length; i++) {
          this.listaSuscritos.push({
            tipoDocumento: metaData.seccion1.suscritos[i].tipoDocumento,
            numeroDocumento: metaData.seccion1.suscritos[i].numeroDocumento,
            nombresApellidos:metaData.seccion1.suscritos[i].nombresApellidos,
            cargo:metaData.seccion1.suscritos[i].cargo,
          });
        }

        i = 0;
        for (i = 0; i < metaData.seccion2.documentos.length; i++) {
          this.listaDocumentos.push({
            nroOrden: metaData.seccion2.documentos[i].nroOrden,
            descripcion: metaData.seccion2.documentos[i].descripcion,
            activo:  metaData.seccion2.documentos[i].activo,
            pathName: metaData.seccion2.documentos[i].pathName,              
            file: null              
          });
        }

      },
      error => {
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      });
  }else{
  //    this.heredarInformacionFormulario();
    this.rellenarDocumentos();
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

cargarDatosRequisito(){
  //console.log( localStorage.getItem('listaRequisitos'));
  //this.datosTupa =JSON.parse(localStorage.getItem('listaRequisitos')) ;
  this.datosTupa =this.dataRequisitosInput; 
  console.log('Busqueda');
  console.log(this.datosTupa);
 // console.log(JSON.stringify(this.datosTupa));
  const indexFind = this.datosTupa.findIndex(item => item.codigoFormAnexo == 'ANEXO_003_A17');
  if (indexFind === -1)
    console.log('No se encontro el anexo ');

  console.log('Numero de Movimiento Anexo: '+this.datosTupa[indexFind].movId);
}

ngOnInit(): void {
  this.tramiteReqId = this.dataInput.tramiteReqId;
  this.uriArchivo = this.dataInput.rutaDocumento;

  const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));
  this.codigoTupa = tramite.codigo;
  this.descripcionTupa = tramite.nombre;

  //this.codigoTupa = localStorage.getItem('tupa-codigo');    //'DSTT-033'
  //this.descripcionTupa = localStorage.getItem('tupa-nombre');

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
    this.acc.expand('seccion-1');
    this.acc.expand('seccion-2');
  });

  this.cargarDatosRequisito();
  this.recuperarInformacion();
  
}

}
