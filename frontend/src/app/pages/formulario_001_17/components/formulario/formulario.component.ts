import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbNavChangeEvent, NgbModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { ReniecService } from '../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../core/services/servicios/extranjeria.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { Formulario00117Service } from '../../../../core/services/formularios/formulario001-17.service';
import { Formulario001_17Request } from '../../../../core/models/Formularios/Formulario001_17/Formulario001_17Request';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { Formulario001_17Response } from '../../../../core/models/Formularios/Formulario001_17/Formulario001_17Response';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { FormularioTramiteService } from '../../../../core/services/tramite/formulario-tramite.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { OficinaRegistralService } from '../../../../core/services/servicios/oficinaregistral.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  formulario: UntypedFormGroup;
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;
  
  graboUsuario: boolean = false;
  active = 1;
  disabled: boolean = true;
  fileToUpload: File;
  esRepresentante: boolean = false;
  //ruc:string;
  //Datos Generales
  tipoDocumentoLogin: string;
  nroDocumentoLogin: string;
  nombreUsuario: string;

  tipoPersonaLogin: string;

  datos: any = {};
  tipoDocumento: TipoDocumentoModel;
  oficinasRegistral: any = [];

  datosRepresentante: string[] = [];

  nombres: string;
  ap_paterno: string;
  ap_materno: string;

  buttonMarcadoObligatorio: boolean;
  marcado: boolean = false;

  representanteLegal: RepresentanteLegal[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de Extranjería' },
  ];
  permisoInternacional: string[]=["DSTT-016","DSTT-025","DSTT-027"];
  PADeclaracionJurada: string[]=["DSTT-012","DSTT-014","DSTT-015","DSTT-019","DSTT-026","DSTT-027","DSTT-034"];
  paDatosGeneralesEditable: string[]=["DSTT-010","DSTT-011","DSTT-013","DSTT-020"]; //Empresas extranjeras. El trámite lo realiza una PERSONA NATURAL CON RUC

  activarDeclaracionJurada: boolean=false;
  activarDatosGenerales: boolean=false;

  txtTituloCompleto:string =  "FORMULARIO 001/17 TRANSPORTE INTERNACIONAL TERRESTRE CONO SUR - COMUNIDAD ANDINA";
  txtTituloModificado:string = "FORMULARIO 001/17 TRANSPORTE INTERNACIONAL TERRESTRE CONO SUR";
  txtTitulo:string = '';
  paTituloModificado:string[]=["DSTT-008","DSTT-009","DSTT-010","DSTT-011","DSTT-012","DSTT-013","DSTT-014","DSTT-015","DSTT-016"];
  
  //===========================================================================================
  //===========================================================================================

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  personaJuridica: boolean = false;
  nroRuc:string = "";
  razonSocial: string;

  disableForm: boolean = false;

  filePdfSeleccionado: any = null;
  filePdfPathName: string = null;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private formularioService: Formulario00117Service,
    private reniecService: ReniecService,
    private modalService: NgbModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    private formularioTramiteService: FormularioTramiteService,
    private extranjeriaService: ExtranjeriaService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private sunatService: SunatService,
    private renatService :RenatService,
    private _oficinaRegistral: OficinaRegistralService) { }

  ngOnInit(): void {
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    if(this.paTituloModificado.indexOf(this.codigoProcedimientoTupa)>-1) this.txtTitulo=this.txtTituloModificado; else this.txtTitulo=this.txtTituloCompleto;
    if(this.PADeclaracionJurada.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDeclaracionJurada=true; else this.activarDeclaracionJurada=false;
    if(this.paDatosGeneralesEditable.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDatosGenerales=true; else this.activarDatosGenerales=false;

    this.formulario = this.fb.group({
      ruc                     : this.fb.control({value:'', disabled:true},[Validators.required]),
      razonSocial             : this.fb.control({value:'', disabled:true},[Validators.required]),
      domicilio               : this.fb.control("",[Validators.required]),
      distrito                : this.fb.control("",[Validators.required]),
      provincia               : this.fb.control("",[Validators.required]),
      departamento            : this.fb.control("",[Validators.required]),
      telefonoFax             : this.fb.control(""),
      celular                 : this.fb.control(""),
      correoElectronico       : this.fb.control("",[Validators.required]),
      marcadoObligatorio      : this.fb.control(true),
      tipoDocumento           : this.fb.control("",[Validators.required]),
      numeroDocumento         : this.fb.control("",[Validators.required]),
      nombreRepresentante     : this.fb.control("",[Validators.required]),
      apePaternoRepresentante : this.fb.control("",[Validators.required]),
      apeMaternoRepresentante : this.fb.control("",[Validators.required]),
      domicilioRepresentante  : this.fb.control("",[Validators.required]),
      poderRegistrado         : this.fb.control("",[Validators.required]),
      oficinaRegistral        : this.fb.control("",[Validators.required]),
      declaracionJurada       : this.fb.control(false)
    });
    
    this.cargarOficinaRegistral();
    // this.tramiteSelected = localStorage.getItem('tramite-selected');
    
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    // this.formulario.controls['ruc'].setValue(this.nroRuc);
    
    if(this.activarDatosGenerales){
      this.formulario.controls["ruc"].clearValidators();
      this.formulario.controls["domicilio"].clearValidators();
      this.formulario.controls["departamento"].clearValidators();
      this.formulario.controls["provincia"].clearValidators();
      this.formulario.controls["distrito"].clearValidators();
      this.formulario.controls["celular"].setValidators([Validators.required]);
      this.formulario.controls["correoElectronico"].setValidators([Validators.required]);
      this.formulario.controls['poderRegistrado'].clearValidators();
      this.formulario.controls['oficinaRegistral'].clearValidators();
      this.formulario.controls['tipoDocumento'].setValue('01');
      this.formulario.controls['numeroDocumento'].setValue(this.nroDocumentoLogin);
      this.formulario.updateValueAndValidity();
      this.personaJuridica = true;
    }

    this.cargarDatos();
    this.recuperarDatosUsuario();

    if(this.permisoInternacional.indexOf(this.codigoProcedimientoTupa)>-1) 
      this.verificarPermisoInternacional();

    /*if( this.nroRuc !== undefined &&  this.nroRuc != null &&  this.nroRuc != "" && tipoDocumento == "00002"){ // OBTENER EL RUC
      this.personaJuridica = true;
    }else{
        this.funcionesMtcService.mensajeError('Este procedimiento lo realiza una PERSONA NATURAL CON RUC.');
    }*/
    if(this.activarDatosGenerales){ //empresa extranjera
      if(tipoDocumento==="00002" || tipoDocumento==="00001")
      this.funcionesMtcService.mensajeError('Este procedimiento lo realiza una PERSONA NATURAL CON RUC.');
    }
  }

  verificarPermisoInternacional(){
    this.renatService.EmpresaServicio(this.nroRuc).subscribe( resp =>{
      if(resp == 0){  
        console.log('error');
        this.funcionesMtcService.ocultarCargando();
        return this.funcionesMtcService.mensajeError('No hay permisos vigentes registradas para esta Empresa');
      }else{
        const partidas = JSON.parse(JSON.stringify(resp));
        console.log(partidas.indexOf("CIR"));
        
        if (partidas.indexOf("CIR")==-1){
          return this.funcionesMtcService.mensajeError('La empresa no cuenta con autorización para el transporte terrestre internacional.');
        }else{
          return true;
        }
      }
    })
  }

  cargarOficinaRegistral(){
    this._oficinaRegistral.oficinaRegistral().subscribe(
      (dataOficinaRegistral) => {
        this.oficinasRegistral = dataOficinaRegistral;
        this.funcionesMtcService.ocultarCargando();
      },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
        });
  }

  recuperarDatosUsuario(){
    this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
      (response) => {
          const datos = response.reniecConsultDniResponse.listaConsulta.datosPersona;
          if (datos.prenombres !== null && datos.prenombres !== '')
            this.nombreUsuario = (datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
      },
      (error) => {
        this.nombreUsuario = "";
      }
    );
  }

  cargarDatos(){

    // ngAfterViewInit(){
    // setTimeout(() => {
        this.funcionesMtcService.mostrarCargando();

        this.formulario.controls["nombreRepresentante"].disable();
        this.formulario.controls["apePaternoRepresentante"].disable();
        this.formulario.controls["apeMaternoRepresentante"].disable();

        if(this.dataInput.movId > 0){

          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario001_17Response) => {
              
              this.funcionesMtcService.ocultarCargando();
              const metaData: any = JSON.parse(dataFormulario.metaData);
              console.dir(metaData);
              this.id = dataFormulario.formularioId;
              this.filePdfPathName = metaData.pathName;

              this.formulario.controls["ruc"].setValue(metaData.DatosSolicitante.Ruc);
              this.formulario.controls["razonSocial"].setValue(metaData.DatosSolicitante.RazonSocial);
              this.formulario.controls["domicilio"].setValue(metaData.DatosSolicitante.Domicilio);
              this.formulario.controls["distrito"].setValue(metaData.DatosSolicitante.Distrito);
              this.formulario.controls["provincia"].setValue(metaData.DatosSolicitante.Provincia);
              this.formulario.controls["departamento"].setValue(metaData.DatosSolicitante.Departamento);
              this.formulario.controls["telefonoFax"].setValue(metaData.DatosSolicitante.TelefonoFax);
              this.formulario.controls["celular"].setValue(metaData.DatosSolicitante.Celular);
              this.formulario.controls["correoElectronico"].setValue(metaData.DatosSolicitante.CorreoElectronico);
              this.formulario.controls["marcadoObligatorio"].setValue(metaData.DatosSolicitante.MarcadoObligatorio);
              this.formulario.controls["tipoDocumento"].setValue(metaData.DatosSolicitante.RepresentanteLegal.TipoDocumento.Id);
              if(this.formulario.get("tipoDocumento").value==='04'){

                const apellMatRep =   this.formulario.controls['apeMaternoRepresentante'];
                this.disabled = false;
                setTimeout(() => {
                  apellMatRep.setValidators(null);
                  apellMatRep.updateValueAndValidity();
              });

              }
              this.formulario.controls["numeroDocumento"].setValue(metaData.DatosSolicitante.RepresentanteLegal.NumeroDocumento);
              this.formulario.controls["nombreRepresentante"].setValue(metaData.DatosSolicitante.RepresentanteLegal.Nombres);
              this.formulario.controls["apePaternoRepresentante"].setValue(metaData.DatosSolicitante.RepresentanteLegal.apellidoPaterno);
              this.formulario.controls["apeMaternoRepresentante"].setValue(metaData.DatosSolicitante.RepresentanteLegal.apellidoMaterno);
              this.formulario.controls["domicilioRepresentante"].setValue(metaData.DatosSolicitante.RepresentanteLegal.DomicilioRepresentanteLegal);
              this.formulario.controls["poderRegistrado"].setValue(metaData.DatosSolicitante.RepresentanteLegal.NroPartida);
              this.formulario.controls["declaracionJurada"].setValue(metaData.DeclaracionJurada.declaracionJurada);
              setTimeout(() => {
                this.formulario.controls["oficinaRegistral"].setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.Id);
            });
              // this.formulario.controls["oficinaRegistral"].setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral);
              if(this.activarDatosGenerales){
                this.formulario.controls["ruc"].enable();
                this.formulario.controls["razonSocial"].enable();
                this.formulario.controls["domicilio"].enable();
                this.formulario.controls["distrito"].enable();
                this.formulario.controls["provincia"].enable();
                this.formulario.controls["departamento"].enable();
                this.formulario.controls["numeroDocumento"].disable();
                this.formulario.controls["tipoDocumento"].disable();
              }else{
                this.formulario.controls["domicilio"].disable();
                this.formulario.controls["distrito"].disable();
                this.formulario.controls["provincia"].disable();
                this.formulario.controls["departamento"].disable();
              }  
              
              // console.log( this.filePdfPathName);

            }, (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
            }
          );
        }else{
          if(this.activarDatosGenerales){
            this.formulario.controls['razonSocial'].enable();
            this.formulario.controls['ruc'].enable();
            this.formulario.controls['domicilio'].enable();
            this.formulario.controls['distrito'].enable();
            this.formulario.controls['provincia'].enable();
            this.formulario.controls['departamento'].enable();
            this.formulario.controls['telefonoFax'].enable();
            this.formulario.controls['celular'].enable();
            this.formulario.controls['correoElectronico'].enable();
            this.formulario.controls['domicilioRepresentante'].enable();
            this.formulario.controls['tipoDocumento'].disable();
            this.formulario.controls['numeroDocumento'].disable();

            this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
              (respuesta) => {
                this.funcionesMtcService.ocultarCargando();
      
                if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
      
                const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                this.formulario.controls['nombreRepresentante'].setValue(datosPersona.prenombres);
                this.formulario.controls['apePaternoRepresentante'].setValue(datosPersona.apPrimer);
                this.formulario.controls['apeMaternoRepresentante'].setValue(datosPersona.apSegundo);
                this.formulario.controls['domicilioRepresentante'].setValue(datosPersona.direccion);
              },
              (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
                this.formulario.controls["nombreRepresentante"].enable();
                this.formulario.controls["apePaternoRepresentante"].enable();
                this.formulario.controls["apeMaternoRepresentante"].enable();
              }
            );
          }else{
            this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
              (response) => {
                this.funcionesMtcService.ocultarCargando();
                
                this.formulario.controls['razonSocial'].setValue(response.razonSocial.trim());
                this.formulario.controls['ruc'].setValue(response.nroDocumento.trim());
                this.formulario.controls['domicilio'].setValue(response.domicilioLegal.trim());
                this.formulario.controls['distrito'].setValue(response.nombreDistrito.trim());
                this.formulario.controls['provincia'].setValue(response.nombreProvincia.trim());
                this.formulario.controls['departamento'].setValue(response.nombreDepartamento.trim());
                this.formulario.controls['telefonoFax'].setValue(response.telefono.trim());
                this.formulario.controls['celular'].setValue(response.celular.trim());
                this.formulario.controls['correoElectronico'].setValue(response.correo.trim());
                
                this.formulario.controls['razonSocial'].disable();
                this.formulario.controls['ruc'].disable();
                this.formulario.controls['domicilio'].disable();
                this.formulario.controls["distrito"].disable();
                this.formulario.controls["provincia"].disable();
                this.formulario.controls["departamento"].disable();
  
                this.representanteLegal = response.representanteLegal;
              },
              (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
                this.formulario.controls['razonSocial'].setValue(this.razonSocial);
                this.formulario.controls['ruc'].setValue(this.nroRuc);
  
                this.formulario.controls["domicilio"].enable();
                this.formulario.controls["distrito"].enable();
                this.formulario.controls["provincia"].enable();
                this.formulario.controls["departamento"].enable();
              }
            );
          }
        }
  //   });
  // }
  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onChangeTipoDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
    const apellMatR =   this.formulario.controls['apeMaternoRepresentante'];

    if(tipoDocumento ==='04'){

       this.disabled = false;
       apellMatR.setValidators(null);
       apellMatR.updateValueAndValidity();
    }else{
       apellMatR.setValidators([Validators.required]);
       apellMatR.updateValueAndValidity();
       this.disabled = true;
    }

    this.formulario.controls['numeroDocumento'].setValue('');
    this.inputNumeroDocumento();
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.formulario.controls['nombreRepresentante'].setValue('');
    this.formulario.controls['apePaternoRepresentante'].setValue('');
    this.formulario.controls['apeMaternoRepresentante'].setValue('');
    this.formulario.controls['nombreRepresentante'].disable();
    this.formulario.controls['apePaternoRepresentante'].disable();
    this.formulario.controls['apeMaternoRepresentante'].disable();
  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    return 0
  }

  buscarNumeroDocumento() {

    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
    const numeroDocumento: string = this.formulario.controls['numeroDocumento'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      
    const resultado = this.representanteLegal.find( representante =>  ('0'+representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );
    if (resultado) {//DNI
     /* this.esRepresentante = false;
    }else{
      this.esRepresentante = true;
       // return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }*/
    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '01') {//DNI
      this.reniecService.getDni(numeroDocumento).subscribe(
        (respuesta) => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          this.addPersona(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion);
        },
        (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.formulario.controls["nombreRepresentante"].enable();
          this.formulario.controls["apePaternoRepresentante"].enable();
          this.formulario.controls["apeMaternoRepresentante"].enable();
        }
      );

    } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
      console.log("=====>");
      this.extranjeriaService.getCE(numeroDocumento).subscribe(
        (respuesta) => {
          console.log("*****");
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

            this.addPersona(tipoDocumento,
              respuesta.CarnetExtranjeria.nombres,
              respuesta.CarnetExtranjeria.primerApellido,
              respuesta.CarnetExtranjeria.segundoApellido,
              '');
        },
        (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.formulario.controls["nombreRepresentante"].enable();
          this.formulario.controls["apePaternoRepresentante"].enable();
          this.formulario.controls["apeMaternoRepresentante"].enable();
        }
      );
    }
    }else{
      this.esRepresentante = false;
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    } 

  }

  onChangeInputFile(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfSeleccionado = event.target.files[0];
    event.target.value = "";
  }

  onChangeNotificacion(e){
    //this.toggle = e;
  }

  vistaPreviaPdf() {
    if (this.filePdfPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfSeleccionado = file;
          this.filePdfPathName = null;

          this.visualizarDialogoPdf();
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarDialogoPdf();
    }
  };

  visualizarDialogoPdf() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Vigencia de Poder";
  }

  addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string) {

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formulario.controls['nombreRepresentante'].setValue(nombres);
        this.formulario.controls['apePaternoRepresentante'].setValue(ap_paterno);
        this.formulario.controls['apeMaternoRepresentante'].setValue(ap_materno);
        this.formulario.controls['domicilioRepresentante'].setValue(direccion);
      });
  }

  guardarFormulario() {
    if(this.permisoInternacional.indexOf(this.codigoProcedimientoTupa)>-1) 
      this.verificarPermisoInternacional();
      
    if (!this.filePdfSeleccionado && !this.filePdfPathName && !this.activarDatosGenerales)
    return this.funcionesMtcService.mensajeError('Debe ingresar una vigencia de poder');

    if (this.activarDeclaracionJurada){
      if(!this.formulario.controls["declaracionJurada"].value)
      return this.funcionesMtcService.mensajeError('Debe aceptar la Declaración Jurada');
    }
    let dataGuardar: Formulario001_17Request = new Formulario001_17Request();

    dataGuardar.id = this.id;
    dataGuardar.codigo = '17';
    dataGuardar.formularioId = 1;
    dataGuardar.estado = 1;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.metaData.archivoAdjunto = this.filePdfSeleccionado;
    dataGuardar.metaData.pathName = this.filePdfPathName;
    dataGuardar.metaData.datosSolicitante.ruc = this.formulario.controls['ruc'].value;
    dataGuardar.metaData.datosSolicitante.razonSocial = this.formulario.controls['razonSocial'].value;
    dataGuardar.metaData.datosSolicitante.domicilio = this.formulario.controls['domicilio'].value;
    dataGuardar.metaData.datosSolicitante.distrito = this.formulario.controls['distrito'].value;
    dataGuardar.metaData.datosSolicitante.provincia = this.formulario.controls['provincia'].value;
    dataGuardar.metaData.datosSolicitante.departamento = this.formulario.controls['departamento'].value;
    dataGuardar.metaData.datosSolicitante.telefonoFax = this.formulario.controls['telefonoFax'].value;
    dataGuardar.metaData.datosSolicitante.celular = this.formulario.controls['celular'].value;
    dataGuardar.metaData.datosSolicitante.correoElectronico = this.formulario.controls['correoElectronico'].value;
    dataGuardar.metaData.datosSolicitante.marcadoObligatorio = this.formulario.controls['marcadoObligatorio'].value; //this.marcado;
    dataGuardar.metaData.datosSolicitante.representanteLegal.nombres =  this.formulario.controls['nombreRepresentante'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.apellidoPaterno = this.formulario.controls['apePaternoRepresentante'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.apellidoMaterno = this.formulario.controls['apeMaternoRepresentante'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.tipoDocumento.id = this.formulario.controls['tipoDocumento'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumento').value)[0].documento;
    dataGuardar.metaData.datosSolicitante.representanteLegal.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.domicilioRepresentanteLegal = this.formulario.controls['domicilioRepresentante'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.nroPartida = this.formulario.controls['poderRegistrado'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.oficinaRegistral.id = this.formulario.controls['oficinaRegistral'].value;
    dataGuardar.metaData.datosSolicitante.representanteLegal.oficinaRegistral.descripcion = (this.formulario.controls['oficinaRegistral'].value!='' && this.formulario.controls['oficinaRegistral'].value!=null ?this.oficinasRegistral.filter(item => item.value == this.formulario.get('oficinaRegistral').value)[0].text:'');
    dataGuardar.metaData.servicioSolicitado.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
    dataGuardar.metaData.servicioSolicitado.descProcedimientoTupa = this.descProcedimientoTupa;
    dataGuardar.metaData.declaracionJurada.documentoSolicitante = this.nroDocumentoLogin;
    dataGuardar.metaData.declaracionJurada.nombreSolicitante = this.nombreUsuario;
    dataGuardar.metaData.declaracionJurada.declaracionJurada = this.activarDeclaracionJurada;

    
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.dir(dataGuardar);
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {
        this.funcionesMtcService.mostrarCargando();

        if (this.id === 0) {
          //GUARDAR:
          this.formularioService.post<any>(dataGuardarFormData)
            .subscribe(
              (data) => {
                this.funcionesMtcService.ocultarCargando();
                this.id = data.id;
                this.uriArchivo = data.uriArchivo;

                this.graboUsuario = true;
                this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
              },
              (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
        } else {
           //ACTUALIZAR ANEXOS DEPENDIENTES

           let listarequisitos = this.dataRequisitosInput;
           let cadenaAnexos = "";
           for (let i = 0; i < listarequisitos.length; i++) {
             if (this.dataInput.tramiteReqId === listarequisitos[i].tramiteReqRefId) {
               if (listarequisitos[i].movId > 0) {
                   const nombreAnexo = listarequisitos[i].codigoFormAnexo.split("_");
                   cadenaAnexos += nombreAnexo[0] + " " + nombreAnexo[1] + "-" + nombreAnexo[2] + " ";
               }
             }
           }

          //  if( cadenaAnexos.length > 0){


          //    this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar los anexos " + cadenaAnexos + "¿Desea continuar?")
          //    .then(() => {

          //      this.funcionesMtcService.mostrarCargando();

          //    //MODIFICAR
          // console.log(dataGuardarFormData);
          // this.formularioService.put<any>(dataGuardarFormData)
          //   .subscribe(
          //     data => {
          //       this.funcionesMtcService.ocultarCargando();
          //       this.id = data.id;
          //       this.uriArchivo = data.uriArchivo;

          //       this.graboUsuario = true;

          //       this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
          //     },
          //     error => {
          //       this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
          //     }
          //   );
          // });

          // }
          if( cadenaAnexos.length > 0){
            this.funcionesMtcService.ocultarCargando();
            this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar los anexos " + cadenaAnexos + "¿Desea continuar?")
            .then(() => {

              this.funcionesMtcService.mostrarCargando();

            //MODIFICAR
            this.formularioService.put<any>(dataGuardarFormData)
              .subscribe(
                data => {
                  this.funcionesMtcService.ocultarCargando();
                  this.id = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;

                  /*this.tramiteService.getTramite(this.dataInput.id).subscribe((resp: any) => {
                      listarequisitos = resp.requisitos;
                  });*/

                  //let listarequisitos = JSON.parse(localStorage.getItem('listaRequisitos'));
                  //let listarequisitos = this.dataRequisitosInput;
                  for (let i = 0; i < listarequisitos.length; i++) {
                    if (this.dataInput.tramiteReqId === listarequisitos[i].tramiteReqRefId) {
                      if (listarequisitos[i].movId > 0) {
                        //ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
                        this.formularioTramiteService.uriArchivo<any>(listarequisitos[i].movId)
                          .subscribe(
                            data => {
                              this.funcionesMtcService.ocultarCargando();
                            },
                            error => {
                              this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                            }
                          );
                      }
                    }
                  }

                  this.funcionesMtcService.ocultarCargando();
                  this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

                },
                error => {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              );

            });

          }else{
            this.formularioService.put<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.id = data.id;
                this.uriArchivo = data.uriArchivo;
                this.graboUsuario = true;

                this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
              }
              );
          }
        }

      });
  }

  descargarPdf() { // OK
    if (this.id === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    if (!this.uriArchivo || this.uriArchivo == "" || this.uriArchivo == null)
      return this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      //this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001/17";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  formInvalid(control: string) : boolean {
    if(this.formulario.get(control))
      return this.formulario.get(control).invalid && (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }
}