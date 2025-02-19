import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_C17Request } from 'src/app/core/models/Anexos/Anexo001_C17/Anexo001_C17Request';
import { Anexo001_C17Response } from 'src/app/core/models/Anexos/Anexo001_C17/Anexo001_C17Response';
import { A001_C17_Seccion3 } from 'src/app/core/models/Anexos/Anexo001_C17/Secciones';
import { Anexo001_C27Request } from 'src/app/core/models/Anexos/Anexo001_C27/Anexo001_C27Request';
import { Anexo001_C27Response } from 'src/app/core/models/Anexos/Anexo001_C27/Anexo001_C27Response';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { TripulacionModel } from 'src/app/core/models/TripulacionModel';
import { Anexo001C17Service } from 'src/app/core/services/anexos/anexo001-c17.service';
import { Anexo001C27Service } from 'src/app/core/services/anexos/anexo001-c27.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo001-c27',
  templateUrl: './anexo001-c27.component.html',
  styleUrls: ['./anexo001-c27.component.css']
})
export class Anexo001C27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  indexEditTabla: number = -1;
  listaPaises: PaisResponse[] = [];
  listaTripulacion: TripulacionModel[] = [];
  listaFlotaVehicular: A001_C17_Seccion3[] = [];

  

  tipoDocumento: TipoDocumentoModel;

  
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "02", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' },
    { id: "04", documento: 'RUC' }
  ];
  caf_vinculado: string = '';

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  visibleButtonCarf: boolean = false;

  fechaMinimaInicio: Date = (new Date()).addDays(1);
  fechaMinimaConclusion: Date = (new Date()).addDays(2);

  // anexoFormulario: FormGroup;

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001C27Service,
    private paisService: PaisService,
    private vehiculoService: VehiculoService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private seguridadService: SeguridadService,
    private sunatService: SunatService,
    private formularioTramiteService: FormularioTramiteService,
    
    ) { }
    // contactForm = this.fb.group({
    //   Documento_Identidad: ['', [Validators.required, Validators.minLength(3)]],
    //   Nombres_Apellidos: ['', [Validators.required, Validators.minLength(3)]],
    //   Domicilio_Legal: ['', [Validators.required, Validators.minLength(3)]],
    // //  Grado_Militar: ['', [Validators.required, Validators.minLength(3)]],
      
    //   Grado_Militar: ['0'],
    //   Factor_grupo_sanguineo: ['0'],
    //   newsletter1: ['0'],
    //   Vigencia_Licencia_Conducir: ['', [Validators.required, Validators.minLength(3)]],
    //   Fecha_Caducidad: ['', [Validators.required, Validators.minLength(3)]],
  
    //   correo:['', [Validators.required, Validators.email]],
    //   telefono: this.fb.control(''),
    //   celular: this.fb.control(''),
    //   Numero_Certificado_Salud: ['', [Validators.required, Validators.minLength(3)]],
    //   Fecha_Certificado: ['', [Validators.required, Validators.minLength(3)]],
  
    //   nro_resolucion: ['', [Validators.required, Validators.minLength(3)]],
    //   fecha_resolucion: ['', [Validators.required, Validators.minLength(3)]],
  
      
      
    //   Vehiculo_Transmision_automatica: this.fb.control(false),
    //   Vehiculo_acondicionado: this.fb.control(false),
    //   Con_lentes: this.fb.control(false),
    //   Con_Audifonos: this.fb.control(false),
    //   Con_espejos_laterales: this.fb.control(false),
    //   Sin_restricciones: this.fb.control(false),
    //   aceptacion: this.fb.control(false),
    //  // Factor_grupo_sanguineo: this.fb.control('')
  
    // });
  
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
      declaracionSegundoForm: this.fb.control(''),
      declaracionSegundoAsientoForm: this.fb.control(''),

      declaracionSegundoPartidaForm: this.fb.control(''),

      declaracionSegundoRegistrosForm: this.fb.control(''),
      declaracionSegundoRepresentacionForm: this.fb.control(''),
      
      declaracionLugarForm: this.fb.control(''),
      declaracionFechaForm: this.fb.control(''),

      ///************************ */
    });

    ngOnInit(): void {

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
  
            this.anexoFormulario.get("declaracionSegundoAsientoForm").setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.Asiento);
            this.anexoFormulario.get("declaracionSegundoPartidaForm").setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.PoderRegistrado);
                     
            this.anexoFormulario.get("declaracionSegundoRepresentacionForm").setValue(metaDataForm?.DatosSolicitante?.NombresApellidosRazonSocial);
            this.anexoFormulario.get("declaracionSegundoRegistrosForm").setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.OficinaRegistral?.Descripcion);
            
  
            // if(metaDataForm?.seccion1?.categoria==="1"){
            //   this.anexoFormulario.get("newsletter1").setValue("1");
            // }
            // if(metaDataForm?.seccion1?.categoria==="2"){
            //   this.anexoFormulario.get("newsletter1").setValue("2");
            // }
            // if(metaDataForm?.seccion1?.categoria==="3"){
            //   this.anexoFormulario.get("newsletter1").setValue("3");
            // }
            // if(metaDataForm?.seccion1?.categoria==="4"){
            //   this.anexoFormulario.get("newsletter1").setValue("4");
            // }
            // if(metaDataForm?.seccion1?.categoria==="5"){
            //   this.anexoFormulario.get("newsletter1").setValue("5");
            // }
            // if(metaDataForm?.seccion1?.categoria==="6"){
            //   this.anexoFormulario.get("newsletter1").setValue("6");
            // }
           
    
  
        
         //   this.contactForm.get("telefono").setValue(metaDataForm?.seccion1?.telefono);
          //  this.contactForm.get("celular").setValue(metaDataForm?.seccion1?.celular);
            // this.anexoFormulario.get("correo").setValue(metaDataForm?.seccion1?.correo);
            if (this.dataInput.rutaDocumento) {
              //RECUPERAMOS LOS DATOS
             // this.recuperarInformacion();
            }
            if (this.dataInput.movId > 0) {
              //RECUPERAMOS LOS DATOS
              this.funcionesMtcService.mostrarCargando();
              this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
                (dataAnexo: Anexo001_C27Response) => {
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
                  this.anexoFormulario.get("declaracionSegundoForm").setValue(metaData?.seccion3?.DeclaracionSegundo);
                  this.anexoFormulario.get("declaracionSegundoAsientoForm").setValue(metaData?.seccion3?.DeclaracionSegundoAsiento);
                  this.anexoFormulario.get("declaracionSegundoPartidaForm").setValue(metaData?.seccion3?.DeclaracionSegundoPartida);
                  this.anexoFormulario.get("declaracionSegundoRegistrosForm").setValue(metaData?.seccion3?.DeclaracionSegundoRegistros);
                  this.anexoFormulario.get("declaracionSegundoRepresentacionForm").setValue(metaData?.seccion3?.DeclaracionSegundoRepresentacion);
                 
 


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
     
      // if (this.dataInput.tramiteReqRefId === 0) {
      //   this.activeModal.close(this.graboUsuario);
      //   this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
      //   return;
      // }

      this.uriArchivo = this.dataInput.rutaDocumento; 
     
      this.traerDatos();
      this.recuperarDatosSunat();


    }
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-C/27";
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
    let dataGuardar: Anexo001_C27Request = new Anexo001_C27Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "C";
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

    dataGuardar.metaData.seccion3.declaracionSegundo =this.anexoFormulario.controls['declaracionSegundoForm'].value;
    dataGuardar.metaData.seccion3.declaracionSegundoAsiento =this.anexoFormulario.controls['declaracionSegundoAsientoForm'].value;
    dataGuardar.metaData.seccion3.declaracionSegundoPartida =this.anexoFormulario.controls['declaracionSegundoPartidaForm'].value;
    dataGuardar.metaData.seccion3.declaracionSegundoRegistros =this.anexoFormulario.controls['declaracionSegundoRegistrosForm'].value;
    dataGuardar.metaData.seccion3.declaracionSegundoRepresentacion =this.anexoFormulario.controls['declaracionSegundoRepresentacionForm'].value;
    
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

