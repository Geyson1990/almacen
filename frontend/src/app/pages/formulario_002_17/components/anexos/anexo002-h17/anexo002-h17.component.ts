import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal , NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Anexo002_H17Request } from 'src/app/core/models/Anexos/Anexo002H17/Anexo002_H17Request';
import { Anexo002_H17Response } from 'src/app/core/models/Anexos/Anexo002H17/Anexo002_H17Response';
import { A002_H17_Seccion1, A002_H17_Seccion12, A002_H17_Seccion2 } from 'src/app/core/models/Anexos/Anexo002H17/Secciones';
import { Anexo002H17Service } from 'src/app/core/services/anexos/anexo002-h17.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo002-h17',
  templateUrl: './anexo002-h17.component.html',
  styleUrls: ['./anexo002-h17.component.css']
})
export class Anexo002H17Component implements OnInit {

  @Input() public dataInput: any;

  idAnexoMovimiento=0

  /**Sección 1 */
  seccion1Data : A002_H17_Seccion1 = new A002_H17_Seccion1();
  seccion12Data : A002_H17_Seccion12 = new A002_H17_Seccion12();
  seccion12Datos : A002_H17_Seccion12[] = [];
  correcto:boolean;
  RequestDataAnexo002H17 : Anexo002_H17Request = new Anexo002_H17Request();
  ok1:boolean;
  errorAlCargarData: boolean = false;
  tramiteReqId: number = 0;
  selectedDocumento : string='0';
  uriArchivo : string;
  nroDNI : string ="";
  ruc :string="";

  /**Sección 2 */
  seccion2Data : A002_H17_Seccion2 = new A002_H17_Seccion2();


  graboUsuario: boolean = false;
  @ViewChild('acc') acc: NgbAccordionDirective ;
  constructor(//private fb: FormBuilder
    
    private serviceAnexo002_H17 : Anexo002H17Service,
    private funcionesMtcService: FuncionesMtcService,
    private extranjeriaService: ExtranjeriaService,
    private reniecService: ReniecService,
    private modalService: NgbModal,
    private AnexoTramiteService: AnexoTramiteService,
    public activeModal: NgbActiveModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private renatService :RenatService,
    private seguridadService: SeguridadService
    ) { }

  ngOnInit(): void {
    this.ruc = this.seguridadService.getCompanyCode();
    this.tramiteReqId = this.dataInput.tramiteReqId;
    this.uriArchivo = this.dataInput.rutaDocumento;
    setTimeout(() => {
      this.acc.expand('seccion-1');
    });

    this.recuperarInformacion();
  }

  loadDataUser(){
    //this.seccion12Data.apellidosNombres ="edy andres garay huamani";
    if (this.selectedDocumento === '0' || this.nroDNI.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (this.selectedDocumento === '1' && this.nroDNI.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
    if(this.selectedDocumento === '2' && this.nroDNI.length != 12)
    return this.funcionesMtcService.mensajeError('CE debe tener 12 caracteres');

    //this.validaRepresentanteLegal();


    this.renatService.estaEnNomina(this.ruc,this.nroDNI).subscribe((data :any) => {

      if(data === 0){
        this.nroDNI ="";
        this.seccion12Data.apellidosNombres ="";
        return this.funcionesMtcService.mensajeError('Persona no está en nómina');
      }else{

        if (this.selectedDocumento === '1') {//DNI
          this.reniecService.getDni(this.nroDNI).subscribe(
            respuesta => {
              this.funcionesMtcService.ocultarCargando();
    
              if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
                return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
              const numDNI  =this.nroDNI;
              const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
              this.seccion12Data.apellidosNombres = datosPersona.prenombres+ ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo
              this.seccion12Data.numeroDni = numDNI;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Error al consultar al servicio');
            }
          );
        } else if (this.selectedDocumento === '2') {//CARNÉ DE EXTRANJERÍA
          this.extranjeriaService.getCE(this.nroDNI).subscribe(
            respuesta => {
              this.funcionesMtcService.ocultarCargando();
    
              if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
                return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
    
                this.seccion12Data.apellidosNombres =  respuesta.CarnetExtranjeria.nombres + ' '+     respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido
    
                const nroRecibo = this.nroDNI;
                this.seccion12Data.numeroDni = nroRecibo;
            
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Error al consultar al servicio');
            }
          );
        }


      }
    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas al consultar servicio.');
    });


  
  }



  validacionAnexoH17(){

    if(this.selectedDocumento == '0' || this.nroDNI.length == 0 || this.seccion12Data.cargo == "" || this.seccion12Data.apellidosNombres==""){
      this.correcto=false;
    }
    else{
      this.correcto= true;
    }    
    this.cargaTablaAnexoH17();
  }

  cargaTablaAnexoH17(){
    if(this.correcto){
     this.ok1 = true;
     
      this.seccion12Datos.push(this.seccion12Data);
      this.seccion12Data = new A002_H17_Seccion12();
      this.selectedDocumento = '0';
      this.nroDNI = ""
    }else{
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos'); 
    }

  }

  eliminarSeccion1(item : number){
    this.seccion12Datos.splice(item,1);
  }

  guardarAnexo(){
    if(this.seccion12Datos.length != 0){
      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de guardar' los datos ingresados?`)
      .then(() => {
  
        //console.log(JSON.stringify(dataGuardar));
        this.RequestDataAnexo002H17.id =   this.idAnexoMovimiento;
        this.RequestDataAnexo002H17.movimientoFormularioId =this.dataInput.tramiteReqRefId;
        this.RequestDataAnexo002H17.anexoId = 1;
        this.RequestDataAnexo002H17.codigo = "A"
        this.RequestDataAnexo002H17.tramiteReqId = this.dataInput.tramiteReqId;
       
        /**seccion1 */
        
        this.RequestDataAnexo002H17.metaData.seccion1.dataTabla1 = this.seccion12Datos;
        this.RequestDataAnexo002H17.metaData.seccion1.file ;

        /**Seccion2 */
        this.RequestDataAnexo002H17.metaData.seccion2.check1  = this.seccion2Data.check1;
        this.RequestDataAnexo002H17.metaData.seccion2.check2  = this.seccion2Data.check2;
        this.RequestDataAnexo002H17.metaData.seccion2.check3  = this.seccion2Data.check3;
        var date = new Date();
        
        this.RequestDataAnexo002H17.metaData.seccion1.dia =date.getDate().toString();
        this.RequestDataAnexo002H17.metaData.seccion1.mes =(date.getMonth() +1).toString();
        this.RequestDataAnexo002H17.metaData.seccion1.anio =date.getFullYear().toString();

      
  
  
        this.funcionesMtcService.mostrarCargando();
  
       
          //GUARDAR:
        if (this.idAnexoMovimiento === 0) {
          console.log("DATA",this.RequestDataAnexo002H17);
          this.serviceAnexo002_H17.saveInfo<any>(this.RequestDataAnexo002H17)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
           
                this.idAnexoMovimiento = data.id;
                this.uriArchivo = data.uriArchivo;

                this.graboUsuario = true;

                this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idAnexo = ${this.idAnexoMovimiento})`);
                
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
            }
            else{
                 //MODIFICAR
                
                 this.serviceAnexo002_H17.put<any>(this.RequestDataAnexo002H17)
                 .subscribe(
                   data => {
                     this.funcionesMtcService.ocultarCargando();
                     this.idAnexoMovimiento = data.id;
                     this.graboUsuario = true;
                     this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente (idAnexo = ${this.idAnexoMovimiento})`);
                   },
                   error => {
                     this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                   }
                 );
            }
  
      });
    }else{
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos'); 
    }
  }

  cleanForm(){

    this.RequestDataAnexo002H17 = new Anexo002_H17Request();
    this.seccion12Datos = [];
    this.seccion2Data = new A002_H17_Seccion2();
    this.selectedDocumento = '0';

  }

  descargarPdf() {
    if (this.idAnexoMovimiento === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
  
    this.funcionesMtcService.mostrarCargando();
  
    this.visorPdfArchivosService.get(this.uriArchivo)
      //this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
  
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002 -H/17";
  
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  
  }


  validaRepresentanteLegal() {

    this.renatService.estaEnNomina(this.ruc,this.nroDNI).subscribe((data :any) => {

      if(data === 0){
        this.nroDNI ="";
        this.seccion12Data.apellidosNombres ="";
        return this.funcionesMtcService.mensajeError('Persona no está en nómina');
      }
    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas al consultar servicio.');
    });


  }


  recuperarInformacion(){

    //si existe el documento
    console.log('Ruta del documento');
    console.log(this.dataInput.rutaDocumento);
    if (this.dataInput.rutaDocumento) {
      //RECUPERAMOS LOS DATOS DEL FORMULARIO
      this.AnexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo002_H17Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexoMovimiento = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

            console.log("metadata" ,metaData);
             this.seccion12Datos = metaData.seccion1.dataTabla1;
            this.seccion2Data.check1 = metaData.seccion2.check1;
            this.seccion2Data.check2 = metaData.seccion2.check2;
            this.seccion2Data.check3 = metaData.seccion2.check3;

        },
        error => {
          this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
    }else{

        // switch(this.tipoPersona){
        //     case 1:
        //         //servicio reniec
        //         this.recuperarDatosReniec();
        //     break;

        //     case 2:
        //         //persona juridica
        //         this.recuperarDatosSunat();
        //         //console.log("Procedimiento Recuperar Datos Representante");
        //         //this.recuperarDatosRepresentateLegal();
        //     break;

        //     case 3:
        //         //persona natural con ruc
        //         this.recuperarDatosSunat();
        //     break;
        // }

    }

}


}