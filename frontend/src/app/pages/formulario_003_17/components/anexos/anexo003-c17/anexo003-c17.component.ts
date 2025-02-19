import { Component, OnInit, ViewChild , Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbActiveModal, NgbAccordionDirective ,NgbModal,NgbDateStruct,NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Anexo003C17Service } from 'src/app/core/services/anexos/anexo003-c17.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { Vinculos, Documentos, Encargados, A003_C17_Seccion1, A003_C17_Seccion2} from 'src/app/core/models/Anexos/Anexo003_C17/Secciones';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { Anexo003_C17Request } from 'src/app/core/models/Anexos/Anexo003_C17/Anexo003_C17Request';
import { Anexo003_C17Response } from 'src/app/core/models/Anexos/Anexo003_C17/Anexo003_C17Response';
import { Anexo003_A17Response } from 'src/app/core/models/Anexos/Anexo003_A17/Anexo003_A17Response';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { Vehiculos,Conductores, A003_A17_Seccion1, A003_A17_Seccion2, A003_A17_Seccion3} from 'src/app/core/models/Anexos/Anexo003_A17/Secciones';

declare var PDFLib:any;
declare var download:any;
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

@Component({
  selector: 'app-anexo003-c17',
  templateUrl: './anexo003-c17.component.html',
  styleUrls: ['./anexo003-c17.component.css']
})
export class Anexo003C17Component implements OnInit {
  
  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  graboUsuario: boolean = false;
  
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId: number = 0;

  anexo: UntypedFormGroup;
  idFormularioMovimiento: number = 18;
  idAnexoMovimiento: number = 0;

  tituloAnexo='SERVICIOS DE TRANSPORTE TERRESTRE ESPECIAL DE PERSONAS (TURÍSTICO)'
  submitted=false;
  codigoTupa: string=''
  descripcionTupa: String=''
  
  datosRequisito: any[]=[];
  listaVehiculoRequisito: any[]=[];

  listaFlotaVehicular: Vinculos[]=[];
  listaDocumentos: Documentos[]=[];
  listaEncargados: Encargados[]=[];
  indexEditTabla: number = -1;
 
  filePdfDocSeleccionado: any = null;
  filePdfDocPathName: string = null;
  visibleButtonDoc: boolean=false;

  errorAlCargarData: boolean = false;

  listaFlotaVehicularA: Vehiculos[] = [];
  listaConductoresA: Conductores[] = [];

  @ViewChild('acc') acc: NgbAccordionDirective ;

    constructor(
      private fb:UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private modalService: NgbModal,
      private anexoService: Anexo003C17Service,
      public activeModal: NgbActiveModal,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private formularioTramiteService: FormularioTramiteService,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private anexoTramiteService: AnexoTramiteService,

    ) {
      this.anexo=this.fb.group({
        nombres:[this.datos.nombres,[Validators.required]],
        dni:[this.datos.nro_documento,[Validators.required]],
        representante:[this.datos.representante,[Validators.required]],
        empresa:[this.datos.empresa,[Validators.required]],
        partida:[this.datos.partida,[Validators.required]],
        domicilio:[this.datos.domicilio,[Validators.required]],
        //cumplerequisitos:[this.datos.cumplerequisitos],
        celular:[this.datos.celular,[Validators.minLength(8), Validators.maxLength(15)]],
        vehiculo:[this.datos.vehiculo,[Validators.minLength(4), Validators.maxLength(15)]],
        nro_identidad_encargado:[''],
        nombres_apellidos:[''],

      })

      setTimeout(() => {
        this.acc.expand('seccion-1');
        this.acc.expand('seccion-2');
    });
    
      //this.rellenarDocumentos();
    }


    rellenarDocumentos(){
      this.listaDocumentos.push(
        {nroOrden: 1, descripcion: 'Certificado de limitador de velocidad (Numerales 55.1.12.9 y 55.2.2)  *',activo: false, pathName: null,  file: null},
        {nroOrden: 2, descripcion: 'Contrato de GPS de los vehículos (Num. 20.1.10)',activo: true, pathName: null,  file: null},
        {nroOrden: 3, descripcion: 'Contrato con taller de mantenimiento (Numerales 55.1.12.6 y 55.2.2)  **',activo: false, pathName: null,  file: null},
        {nroOrden: 4, descripcion: 'Contrato o recibo con los celulares asignados a vehículos Numerales 55.1.12.7 y 55.2.2)',activo: true, pathName: null,  file: null},
        {nroOrden: 5, descripcion: 'Manual General de Operaciones (Numerales 42.1.5\, 55.1.12.8 y 55.2.2)',activo: true, pathName: null,  file: null},
        {nroOrden: 6, descripcion: 'Curriculum documentado del gerente de operaciones y prevención de riesgos (Numerales 55.1.12.10 y 55.2.2)',activo: true, pathName: null,  file: null},
        {nroOrden: 7, descripcion: 'Contrato para el uso de oficina administrativa (Num. 33.2)',activo: true, pathName: null,  file: null},
        {nroOrden: 8, descripcion: 'Documento que acredita la personería jurídica y que su objeto social corresponda al transporte de personas (Num. 38.1.2)',activo: true, pathName: null,  file: null},
        {nroOrden: 9, descripcion: 'Contrato de arrendamiento financiero u operativo si lo Hubiere (Numerales 26.1\,55.1.7 y 55.2.2)',activo: true, pathName: null,  file: null},
        {nroOrden: 10, descripcion: 'Patrimonio (Num. 38.1.5.4\, 55.1.12.1 y 55.2.2)',activo: true, pathName: null,  file: null},
        );

    }

    addVehiculos(){
      console.log("Agrego Vehículo") ;
      
      if (
        this.anexo.controls['celular'].value.trim() === '' ||
        this.anexo.controls['vehiculo'].value.trim() === '' 
        
      ) {
        return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
      }

      const placaRodaje = this.anexo.controls['vehiculo'].value.trim().toUpperCase();
      const nroCelular=this.anexo.controls['celular'].value;

      const indexFindA = this.listaFlotaVehicularA.findIndex(item => item.placaRodaje.trim().toUpperCase() === placaRodaje);

      if (indexFindA === -1) {        
          return this.funcionesMtcService.mensajeError('El vehículo no esta registrado en el listado - ANEXO 003-A17');
      }
      console.log('Placa:'+indexFindA);

      const indexFindCel = this.listaFlotaVehicular.findIndex(item => item.nroCelular === nroCelular);
      if (indexFindCel !== -1) {
        if (indexFindCel !== this.indexEditTabla)
          return this.funcionesMtcService.mensajeError('El Nro de Celular ya se encuentra registrado');
      }

      const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

      if (indexFind !== -1) {
        if (indexFind !== this.indexEditTabla)
          return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
      }



      if (this.indexEditTabla === -1) {
        this.listaFlotaVehicular.push({
          nroCelular: nroCelular,
          placaRodaje: placaRodaje          
        });
      } else {
        this.listaFlotaVehicular[this.indexEditTabla].nroCelular = nroCelular;
        this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;        
      }

      this.limpiarCampos();
      console.log(this.listaFlotaVehicular);
     }

     limpiarCampos(){
      this.anexo.controls['celular'].setValue('');
      this.anexo.controls['vehiculo'].setValue('');
     }

     eliminarVehiculo(index){
      this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.listaFlotaVehicular.splice(index, 1);
      });
     }
     

    formInvalid(control: string) {
      return this.anexo.get(control).invalid &&
        (this.anexo.get(control).dirty || this.anexo.get(control).touched);
    }


    
    cargarDatosRequisito(){
      //console.log( localStorage.getItem('listaRequisitos'));
      //this.datosRequisito =JSON.parse(localStorage.getItem('listaRequisitos')) ;  
      this.datosRequisito =this.dataRequisitosInput; 
      console.log(this.datosRequisito);
      // console.log(JSON.stringify(this.datosTupa));
      const indexFind = this.datosRequisito.findIndex(item => item.codigoFormAnexo == 'ANEXO_003_A17');

      if (indexFind === -1)
        return this.funcionesMtcService.mensajeError('No se encontro datos del Anexo 003-A17');

        //console.log('otro intermediario');
        //console.log(this.datosRequisito[indexFind].movId );

      if (this.datosRequisito[indexFind].movId === 0 ){
        console.log('No hay información del anexo A');
        setTimeout(() => { 
          this.funcionesMtcService
          .ocultarCargando().mensajeError('No hay datos registrados en Anexo 003-A17, Registre primero el listado de oferta vehicular');
          },1000);
        return;
      }else{
        console.log('Recuperamos información del Formulario A');
        console.log(this.datosRequisito[indexFind].tramiteReqId );
        const TramiteI=this.datosRequisito[indexFind].tramiteReqId 
        //RECUPERAMOS LOS DATOS DEL ANEXO

        this.anexoTramiteService.get<any>(TramiteI).subscribe(
          (dataAnexoAux: Anexo003_A17Response) => {
            const metaDataA: any = JSON.parse(dataAnexoAux.metaData);
            //console.log(JSON.stringify(JSON.parse(dataAnexoAux.metaData), null, 10));
            
            //this.idAnexoMovimiento = dataAnexoAux.anexoId;

            //console.log(JSON.stringify(dataAnexoAux, null, 10));
            //console.log(JSON.stringify(JSON.parse(dataAnexoAux.metaData), null, 10));
            console.log("Data Cargada Anexo A");
            console.log(metaDataA);
            let i = 0;
            for (i = 0; i < metaDataA.seccion2.vehiculos.length; i++) {
              this.listaFlotaVehicularA.push({
                placaRodaje: metaDataA.seccion2.vehiculos[i].placaRodaje,
                soat: metaDataA.seccion2.vehiculos[i].soat,
                citv: metaDataA.seccion2.vehiculos[i].citv,
                caf: metaDataA.seccion2.vehiculos[i].caf === true || metaDataA.seccion2.vehiculos[i].caf === 'true' ? true : false,
                cao: metaDataA.seccion2.vehiculos[i].cao === true || metaDataA.seccion2.vehiculos[i].cao === 'true' ? true : false,
                pathNameCaf: metaDataA.seccion2.vehiculos[i].pathNameCaf,
                pathNameCao: metaDataA.seccion2.vehiculos[i].pathNameCao,
                fileCaf: null,
                fileCao: null
              });
            }

            let c = 0;

            for (c = 0; c < metaDataA.seccion3.conductores.length; c++) {
              this.listaConductoresA.push({
                nroDni: metaDataA.seccion3.conductores[c].nroDni,
                nombresApellidos: metaDataA.seccion3.conductores[c].nombresApellidos,
                ape_Paterno:  metaDataA.seccion3.conductores[c].ape_Paterno,
                ape_Materno:  metaDataA.seccion3.conductores[c].ape_Materno,
                nombres:  metaDataA.seccion3.conductores[c].nombres,
                edad:  metaDataA.seccion3.conductores[c].edad,
                nroLicencia:  metaDataA.seccion3.conductores[c].nroLicencia,
                categoria:  metaDataA.seccion3.conductores[c].categoria
              });
            }


            //activamos los botones adicionale para carga de documentos
            if (this.listaFlotaVehicularA.length > 4 ){
              this.listaDocumentos[2].activo=true;              
            }
    
            const indexFind = this.listaConductoresA.findIndex(item => item.categoria === 'M3');
            if (indexFind !== -1) { 
              this.listaDocumentos[0].activo=true;              
            }


         
  
          },
          error => {
            this.errorAlCargarData = true;
            this.funcionesMtcService
              .ocultarCargando()
              //.mensajeError('Problemas para recuperar los datos guardados del anexo');
          });
      }
      console.log('Cargando datos del Anexo A');
      console.log(this.listaFlotaVehicularA);
      console.log(this.listaConductoresA);
      //return;
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
      
      /* if (this.dataInput.tramiteReqRefId === 0) {
        this.activeModal.close(this.graboUsuario);
        this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
        return;
      } */

      console.log('datarequisitos');
      console.log(this.dataRequisitosInput);
      this.recuperarInformacion();
      this.cargarDatosRequisito();
      this.heredarInformacionFormulario();
    }


    public datos = {
      nombres:'', 
      doc_identidad:'',
      nro_documento:'',
      representante:'Gerente General',
      empresa:'',
      partida:'',
      domicilio:'',
      cumplerequisitos:'1',
      celular:'',
      vehiculo:'',

      distrito:'',
      provincia:'',
      region:'',      
      dia:'',
      mes:'',
      anio:'',
      riesgo:'',
      celulares:[ {telefono:'996633074',placa:'HM8523'},
                  {telefono:'996665412',placa:'TR8745'},
                  {telefono:'999874522',placa:'WX8744'}]
      };


      descargarPdf() {
        if (this.idAnexoMovimiento === 0)
          return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
    
        this.funcionesMtcService.mostrarCargando();
    
        //this.anexoService.readPostFie(this.idAnexoMovimiento)
        this.visorPdfArchivosService.get(this.uriArchivo)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();
    
              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Anexo 003- C/17";
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    
      }

      guardarAnexo() {
        //Revisión de Documentos
        let totalDoc=8;
        let msgDoc='Debe ingresar los documentos requeridos. ';
        if (this.listaFlotaVehicularA.length > 4 ){
          totalDoc+=1;
          msgDoc+=' Adicional Falta: Contrato con taller de mantenimiento ** ';
        }

        const indexFind = this.listaConductoresA.findIndex(item => item.categoria === 'M3');
        if (indexFind !== -1) { 
          totalDoc+=1;
          msgDoc+=' Adicional Falta: Certificado de limitador de velocidad * ';            
        }
        console.log('Total Doc'+ totalDoc);
        

        let cargadosDoc=0
        let i = 0;
          for (i = 0; i < this.listaDocumentos.length; i++) {
            if (this.listaDocumentos[i].file !== null || this.listaDocumentos[i].pathName !== null )              
              cargadosDoc+=1;
          }
        
        //FIn revisión de documentos


        if (this.anexo.invalid === true)
          return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
        
          if (this.listaFlotaVehicular.length === 0)
          return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');
        
        if (cargadosDoc < totalDoc)
          return this.funcionesMtcService.mensajeError(msgDoc);

        if (this.listaEncargados.length === 0)
          return this.funcionesMtcService.mensajeError('Debe ingresar al menos un Encargado vehicular');
        
      
        
        
        let dataGuardar : Anexo003_C17Request = new Anexo003_C17Request();

        dataGuardar.id = this.idAnexoMovimiento;
        dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
        dataGuardar.anexoId = 1;
        dataGuardar.codigo = "D";
        dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
        
        //SECCION1
        let seccion1: A003_C17_Seccion1 = new A003_C17_Seccion1();
        seccion1.nombresApellidos=this.anexo.controls['nombres'].value;
        seccion1.dni =this.anexo.controls['dni'].value;
        seccion1.cargo= this.anexo.controls['representante'].value;
        seccion1.razonSocial= this.anexo.controls['empresa'].value;
        seccion1.partidaRegistral = this.anexo.controls['partida'].value;
        seccion1.domicilio  = this.anexo.controls['domicilio'].value;
        seccion1.cumplerequisitos= 'T';
        seccion1.dia=this.getDia();
        seccion1.mes=this.getMes();
        seccion1.anio=this.getAnio();
        seccion1.vinculos=this.listaFlotaVehicular.map(item => {
          return {
            nroCelular: item.nroCelular,
            placaRodaje: item.placaRodaje,            
          } as Vinculos
        });  
        seccion1.encargados=this.listaEncargados.map(item => {
          return {
            tipoDocumento: item.tipoDocumento,
            numeroDocumento: item.numeroDocumento,
            nombresApellidos: item.nombresApellidos            
          } as Encargados
        }); 
        dataGuardar.metaData.seccion1 = seccion1;

        let seccion2: A003_C17_Seccion2=new A003_C17_Seccion2();
        console.log(this.listaDocumentos);
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

      get form() {return this.anexo.controls;}



     heredarInformacionFormulario(){

        this.funcionesMtcService.mostrarCargando();
  
        this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
          (dataForm: any) => {
  
            this.funcionesMtcService.ocultarCargando();
            const metaDataForm: any = JSON.parse(dataForm.metaData);

            //console.log(JSON.stringify(metaDataForm));
            const nombres=metaDataForm.seccion1.nombreRepresentanteLegal +' '+ metaDataForm.seccion1.apePaternoRepresentanteLegal + ' ' +  metaDataForm.seccion1.apeMaternoRepresentanteLegal;
            this.anexo.controls['nombres'].setValue(nombres);
            this.anexo.controls['dni'].setValue(metaDataForm?.seccion1?.nroDocumentoRepresentanteLegal);
            this.anexo.controls['representante'].setValue(metaDataForm?.seccion1?.cargoRepresentanteLegal);
            this.anexo.controls['empresa'].setValue(metaDataForm?.seccion1?.razonSocial);
            this.anexo.controls['partida'].setValue(metaDataForm?.seccion1?.partidaRepresentanteLegal);
            this.anexo.controls['domicilio'].setValue(metaDataForm?.seccion1?.domicilioLegal);
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
          }
        );
  
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



  
  buscarDNI(){
    const tipoDocumento: string= '1'; //string = this.formulario.controls['cod_identidad_representante'].value.trim();
    const numeroDocumento: string = this.anexo.controls['nro_identidad_encargado'].value.trim();
    console.log(tipoDocumento);
    console.log(numeroDocumento);

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
          //console.log(datosPersona);
          this.anexo.controls['nombres_apellidos'].setValue(nombre_aux);
          
          
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

          const nombre_aux= respuesta.CarnetExtranjeria.nombres + ' ' + respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido
          this.anexo.controls['nombres_apellidos'].setValue(nombre_aux);
          //this.datos.nombre_representante= nombre_aux;

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }


  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.anexo.controls['nombres_apellidos'].setValue('');    
  }

  addEncargados(){
    console.log("Agrego Encargados") ;
    
    if (
      this.anexo.controls['nro_identidad_encargado'].value.trim() === '' ||
      this.anexo.controls['nombres_apellidos'].value.trim() === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar un número de documento');
    }
    const nro_dni = this.anexo.controls['nro_identidad_encargado'].value.trim().toUpperCase();
    const indexFind = this.listaEncargados.findIndex(item => item.numeroDocumento === nro_dni);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('La personas ya se encuentra registrado');
    }

    if (this.indexEditTabla === -1) {
      this.listaEncargados.push({
        tipoDocumento:'1',
        numeroDocumento: nro_dni,
        nombresApellidos: this.anexo.controls['nombres_apellidos'].value  ,      
      });
    } 

    this.anexo.controls['nro_identidad_encargado'].setValue('') ;
    this.anexo.controls['nombres_apellidos'].setValue('');
   }



  eliminarEncargado(index){
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.listaEncargados.splice(index, 1);
      });
  }




  
  recuperarInformacion(){

    //si existe el documento
    if (this.dataInput.rutaDocumento) {
      //RECUPERAMOS LOS DATOS DEL ANEXO
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo003_C17Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexoMovimiento = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));
                 
          this.anexo.get("nombres").setValue(metaData.seccion1.nombresApellidos);
          this.anexo.get("dni").setValue(metaData.seccion1.dni);
          this.anexo.get("representante").setValue(metaData.seccion1.cargo);
          this.anexo.get("empresa").setValue(metaData.seccion1.razonSocial);
          this.anexo.get("partida").setValue(metaData.seccion1.partidaRegistral);
          this.anexo.get("domicilio").setValue(metaData.seccion1.domicilio);
          //this.anexo.get("cumplerequisitos").setValue(metaData.seccion1.cumplerequisitos);
          //this.anexo.get("cargo").setValue(metaData.seccion1.cargo);
          //this.anexo.get("dia").setValue(metaData.seccion1.dia);
          //this.anexo.get("mes").setValue(metaData.seccion1.mes);
          //this.anexo.get("anio").setValue(metaData.seccion1.anio);

          let i = 0;
          for (i = 0; i < metaData.seccion1.vinculos.length; i++) {
            this.listaFlotaVehicular.push({
              nroCelular: metaData.seccion1.vinculos[i].nroCelular,
              placaRodaje: metaData.seccion1.vinculos[i].placaRodaje,
            });
          }

          i=0;
          for (i = 0; i < metaData.seccion1.encargados.length; i++) {
            this.listaEncargados.push({
              tipoDocumento: metaData.seccion1.encargados[i].tipoDocumento,
              numeroDocumento: metaData.seccion1.encargados[i].numeroDocumento,
              nombresApellidos:metaData.seccion1.encargados[i].nombresApellidos,
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






}
