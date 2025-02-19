import { Component, Input, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { A001_A27_Seccion1, A001_A27_Seccion3 } from 'src/app/core/models/Anexos/Anexo001_A27/Secciones';
import { Anexo001_D17Request } from 'src/app/core/models/Anexos/Anexo001_D17/Anexo001_D17Request';
import { Anexo001_D17Response } from 'src/app/core/models/Anexos/Anexo001_D17/Anexo001_D17Response';
import { A001_D17_Seccion2 } from 'src/app/core/models/Anexos/Anexo001_D17/Secciones';
import { Anexo001_D27Request } from 'src/app/core/models/Anexos/Anexo001_D27/Anexo001_D27Request';
import { Anexo001_D27Response } from 'src/app/core/models/Anexos/Anexo001_D27/Anexo001_D27Response';
import { Anexo001_G17Request } from 'src/app/core/models/Anexos/Anexo001_G17/Anexo001_G17Request';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001D17Service } from 'src/app/core/services/anexos/anexo001-d17.service';
import { Anexo001D27Service } from 'src/app/core/services/anexos/anexo001-d27.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo001-d27',
  templateUrl: './anexo001-d27.component.html',
  styleUrls: ['./anexo001-d27.component.css']
})
export class Anexo001D27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  indexEditTabla: number = -1;
  visibleButtonCarf: boolean = false;
  caf_vinculado: string = '';


  listaPaises: PaisResponse[] = [];
  listaFlotaVehicular: A001_D17_Seccion2[] = [];

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  constructor(public fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private paisService: PaisService,
    private anexoService: Anexo001D27Service,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private vehiculoService: VehiculoService,
    private visorPdfArchivosService: VisorPdfArchivosService,
     public activeModal: NgbActiveModal,

     private seguridadService: SeguridadService,
     private sunatService: SunatService,     ) { }

 
     anexoFormulario = this.fb.group({
        
      //***************************** */

      //S1
      tipoDocumentoForm: this.fb.control(''),
      numeroDocumentoForm: this.fb.control(''),
      nombresApellidosRazonSocialForm: this.fb.control(''),
      rucForm: this.fb.control(''),
      telefonoForm: this.fb.control(''),
      celularForm: this.fb.control(''),
      correoElectronicoForm: this.fb.control(''),


//S2
    domicilioLegalForm: this.fb.control('',[Validators.required]),
    distritoForm: this.fb.control('',[Validators.required]),
    provinciaForm: this.fb.control('', [Validators.required]),
    departamentoForm: this.fb.control('', [Validators.required]), 


     //S3

      declaracionPrimeroForm: this.fb.control(''),
    
      
      declaracionLugarForm: this.fb.control(''),
      declaracionFechaForm: this.fb.control(''),

      ///************************ */
    });

    ngOnInit(): void {

      this.uriArchivo = this.dataInput.rutaDocumento;
  


      setTimeout(() => {
        this.funcionesMtcService.mostrarCargando();
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //RECUPERAMOS DATOS DEL FORMULARIO
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
          (dataForm: any) => {
  
            this.funcionesMtcService.ocultarCargando();
            const metaDataForm: any = JSON.parse(dataForm.metaData);

            console.log("recupera metadata del formulario::",metaDataForm )
  
          
            if (this.dataInput.movId > 0) {
              //RECUPERAMOS LOS DATOS
              this.funcionesMtcService.mostrarCargando();
              this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
                (dataAnexo: Anexo001_D27Response) => {
                  this.funcionesMtcService.ocultarCargando();
  
                  const metaData: any = JSON.parse(dataAnexo.metaData);
                  this.idAnexo = dataAnexo.anexoId;
  
            
                  //*******************Cargar todo para edicion**************** */
                  this.anexoFormulario.get("tipoDocumentoForm").setValue(metaData?.seccion1?.TipoDocumento.id);
                  this.anexoFormulario.get("numeroDocumentoForm").setValue(metaData?.seccion1?.NumeroDocumento);
                  this.anexoFormulario.get("nombresApellidosRazonSocialForm").setValue(metaData?.seccion1?.NombresApellidosRazonSocial);
                  this.anexoFormulario.get("rucForm").setValue(metaData?.seccion1?.Ruc);
                  this.anexoFormulario.get("telefonoForm").setValue(metaData?.seccion1?.telefono);
                  this.anexoFormulario.get("celularForm").setValue(metaData?.seccion1?.Celular);
                  this.anexoFormulario.get("correoElectronicoForm").setValue(metaData?.seccion1?.CorreoElectronico);
                 

                 // this.anexoFormulario.get("correoElectronicoForm").setValue(metaData?.seccion3?.DeclaracionFecha);

                  this.anexoFormulario.get("declaracionLugarForm").setValue(metaData?.seccion3?.DeclaracionLugar);
                  this.anexoFormulario.get("declaracionPrimeroForm").setValue(metaData?.seccion3?.DeclaracionPrimero);
                  
 


                  if( metaData?.seccion3?.DeclaracionFecha.length > 0){

                    this.fechaDeclaracion = metaData?.seccion3?.DeclaracionFecha;
                    console.log("+==> "+this.fechaDeclaracion);
        
                    const fechaDeclara=metaData?.seccion3?.DeclaracionFecha.split("-");
        
                    this.selectedDateFechaDeclaracion = {
                      day: parseInt(fechaDeclara[2]),
                      month: parseInt(fechaDeclara[1]),
                      year: parseInt(fechaDeclara[0])
                    };
        
                    console.log("==> "+this.selectedDateFechaDeclaracion);
        
                    this.anexoFormulario.get("declaracionFechaForm").setValue(this.selectedDateFechaDeclaracion);
        
                }else{
        
                    this.anexoFormulario.get("declaracionFechaForm").setValue(null);
        
                }
                  
                 
  //                
            
                  //************************************************** */
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
      this.traerDatos();
     this.recuperarDatosSunat();

    }

    tipoDocumento: TipoDocumentoModel;

 
  tupaId: number;
  codigoTupa: String;
  descripcionTupa: String;
  tramiteReqId: number = 0;
  formulario: UntypedFormGroup;
  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  datos: any = {};

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "02", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' },
    { id: "04", documento: 'RUC' }
  ];
  traerDatos() {

    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login

    this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.ruc = this.seguridadService.getCompanyCode();
    console.log('RUC obtenido token' + this.ruc);
    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersonaLogin = 'PERSONA NATURAL';
      this.datos.tipo_solicitante = 'PN';
      // this.formulario.controls['tipoPersonaForm'].setValue('PERSONA NATURAL');

      this.anexoFormulario.controls['tipoDocumentoForm'].setValue("01");
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue(this.nroDocumentoLogin);
      this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);


    }
    else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersonaLogin = 'PERSONA JURIDICA';
      this.datos.tipo_solicitante = 'PJ';

      // this.formulario.controls['tipoPersonaForm'].setValue('PERSONA JURIDICA');

      this.anexoFormulario.controls['tipoDocumentoForm'].setValue("04");
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue(this.ruc);
      this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);

      //this.formulario.controls['nombres'].setValue(this.razonsocial);
    } else {
      this.tipoPersonaLogin = 'PERSONA NATURAL CON RUC';
      this.datos.tipo_solicitante = 'PN';
      this.anexoFormulario.controls['tipo_solicitante'].setValue('PERSONA NATURAL CON RUC');
      this.anexoFormulario.controls['doc_identidad'].setValue('01');

    }


    this.tupaId = Number(localStorage.getItem('tupa-id'));
    this.codigoTupa = localStorage.getItem('tupa-codigo');    //'DSTT-033'
    this.descripcionTupa = localStorage.getItem('tupa-nombre');

  } 

  descargarPdf() {
    // if (this.idAnexo === 0)
    //   return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      // this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-D/27";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }
  fechaDeclaracion: string = "";
  selectedDateFechaDeclaracion: NgbDateStruct = undefined;
  onDateSelectFechaDeclaracion(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaDeclaracion = finalDate;
  }
  guardarAnexo() {

    // if (this.anexoFormulario.invalid === true)
    //   return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    // if (this.anexoFormulario.controls['s2_fechaInicioViaje'].value >= this.anexoFormulario.controls['s2_fechaConclusionViaje'].value)
    //   return this.funcionesMtcService.mensajeError('La fecha de inicio del viaje debe ser menor a la fecha de conclusión del viaje');

    // if (this.listaFlotaVehicular.length === 0)
    //   return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');

    let mensajeErrorPermisoOriginario = '';
    let ruta = ''
    let itinerario = ''
    let frecuencia = ''
    let numeroFrecuencia = '';
    let dataGuardar: Anexo001_D27Request = new Anexo001_D27Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "D";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------    
    this.idAnexo

     

    //-------------------------------------    
    //SECCION 1:
    dataGuardar.metaData.seccion1.telefono= this.anexoFormulario.controls['telefonoForm'].value ;
    dataGuardar.metaData.seccion1.tipoDocumento.documento= this.listaTiposDocumentos.filter(item => item.id ==  this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento;
    dataGuardar.metaData.seccion1.tipoDocumento.id= this.anexoFormulario.controls['tipoDocumentoForm'].value;
    dataGuardar.metaData.seccion1.ruc= this.anexoFormulario.controls['rucForm'].value;
    dataGuardar.metaData.seccion1.celular= this.anexoFormulario.controls['celularForm'].value;
    dataGuardar.metaData.seccion1.correoElectronico= this.anexoFormulario.controls['correoElectronicoForm'].value;
    dataGuardar.metaData.seccion1.numeroDocumento= this.anexoFormulario.controls['numeroDocumentoForm'].value;
    dataGuardar.metaData.seccion1.nombresApellidosRazonSocial = this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].value.trim();
  
    //-------------------------------------
    //SECCION 2:
    dataGuardar.metaData.seccion2.departamento = this.anexoFormulario.controls['departamentoForm'].value;
    dataGuardar.metaData.seccion2.provincia = this.anexoFormulario.controls['provinciaForm'].value;
    dataGuardar.metaData.seccion2.distrito = this.anexoFormulario.controls['distritoForm'].value;
    dataGuardar.metaData.seccion2.domicilioLegal =this.anexoFormulario.controls['domicilioLegalForm'].value;
     
    //-------------------------------------    
    //SECCION 3:
    
    dataGuardar.metaData.seccion3.declaracionLugar =this.anexoFormulario.controls['declaracionLugarForm'].value;
    
    dataGuardar.metaData.seccion3.declaracionFecha =this.fechaDeclaracion;
    dataGuardar.metaData.seccion3.declaracionPrimero =this.anexoFormulario.controls['declaracionPrimeroForm'].value;


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
 
  recuperarDatosSunat() {

    if(this.ruc!="")
    {
    this.funcionesMtcService.mostrarCargando();

    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
        respuesta => {

          this.funcionesMtcService.ocultarCargando();

          const datos = respuesta;

          console.log(JSON.stringify(datos, null, 10));

          //console.log(JSON.stringify(datos, null, 10));


          this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(datos.razonSocial);
          this.anexoFormulario.controls['domicilioLegalForm'].setValue(datos.domicilioLegal);
          this.anexoFormulario.controls['distritoForm'].setValue(datos.nombreDistrito);
          this.anexoFormulario.controls['provinciaForm'].setValue(datos.nombreProvincia);
          this.anexoFormulario.controls['departamentoForm'].setValue(datos.nombreDepartamento);
          // this.anexoFormulario.controls['numeroDocumentoRepresentanteForm'].setValue(datos.representanteLegal[0].nroDocumento);
          this.anexoFormulario.controls['correoElectronicoForm'].setValue(datos.correo);
          this.anexoFormulario.controls['telefonoForm'].setValue(datos.telefono);
          this.anexoFormulario.controls['celularForm'].setValue(datos.celular);
          this.anexoFormulario.controls['rucForm'].setValue(this.ruc);
         // this.anexoFormulario.controls['domicilioLegalForm'].setValue(datos.domicilioLegal);
          
          
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio de Sunat');
        }
      );
      }

  }
    
}
