import { Component, OnInit, ViewChild , Input, Injectable} from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal ,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Formulario00217Service } from 'src/app/core/services/formularios/formulario002-17.service';
import { Formulario002_17Request } from '../../../../core/models/Formularios/Formulario002_17/Formulario002_17Request';
import { Formulario002_17Response } from 'src/app/core/models/Formularios/Formulario002_17/Formulario002_17Response';
import { ReniecModel } from 'src/app/core/models/ReniecModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DatosInspeccion } from 'src/app/core/models/Formularios/Formulario002_b12/Secciones';
//import { Console } from 'console';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {

  active = 1;

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL FORMULARIO
  
  filePdfSeleccionado: any = null;
  filePdfPathName: string = null;
  
  PADeclaracionJurada: string[]=["DSTT-034"];
  activarDeclaracionJurada: boolean=false;

  tipoPersona: number;
  codigoTupa: string = "";
  descripcionTupa: string;
  fechaPago: string = "";
  fechaPartida: string = "";
  idFormularioMovimiento: number = 0;
  formulario: UntypedFormGroup;
  dniPersona: string = '';
  ruc: string = '';
  extranjero: boolean = false;
  toggle : boolean = true;
  tramiteId: number = 0;
  selectedDateFechaInscripcion: NgbDateStruct = undefined;
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';

  datosPersona: ReniecModel[] = [];
  representanteLegal: RepresentanteLegal[] = [];

  nombreUsuario: string = "";

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];

  
  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private reniecService: ReniecService,
    private sunatService: SunatService,
    private formularioService: Formulario00217Service,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private seguridadService: SeguridadService,
    private tramiteService: TramiteService,
  ) { }

  ngOnInit(): void {

    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));

    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));
    this.dniPersona = this.seguridadService.getNumDoc();
    this.recuperarDatosUsuario();

    if(this.PADeclaracionJurada.indexOf(this.codigoTupa)>-1) this.activarDeclaracionJurada=true; else this.activarDeclaracionJurada=false;
    
    if(this.seguridadService.getNameId() === '00001'){
        //persona natural
        this.tipoPersona = 1;
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.ruc = this.seguridadService.getCompanyCode();
        
    }else {
        //persona natural con ruc
        this.tipoPersona = 3;
        this.ruc = this.seguridadService.getCompanyCode();
    }

    this.recuperarInformacion();

    this.formulario = this.fb.group({
      s1_razonSocial: this.fb.control('', [Validators.required]),
      s1_domicilioLegal: this.fb.control('', [Validators.required]),
      s1_distrito: this.fb.control('', [Validators.required]),
      s1_provincia: this.fb.control('', [Validators.required]),
      s1_departamento: this.fb.control('', [Validators.required]),
      s1_nroDocumento: this.fb.control('', [Validators.required]),
      s1_ce: this.fb.control(false),
      s1_ci: this.fb.control(false),
      s1_correo: this.fb.control('', [Validators.required]),
      s1_telefono: this.fb.control(''),
      s1_celular: this.fb.control('', [Validators.required]),
      s1_notificacion: this.fb.control(true),
      s1_nombresRepresentante: this.fb.control(''),
      s1_apellidoPaternoRepresentante: this.fb.control(''),
      s1_apellidoMaternoRepresentante: this.fb.control(''),
      s1_tipoDocumentoRepresentante: this.fb.control(''),
      s1_numeroDocumentoRepresentante: this.fb.control(''),
      s1_domicilioRepresentante: this.fb.control(''),
      s1_nroPartida: this.fb.control(''),
      s1_fechaPartida: this.fb.control(null),
      s1_oficinaRegistral: this.fb.control(''),
      s2_servicioCodigo: this.fb.control(this.codigoTupa),
      s3_declaracionjurada:this.fb.control(false),
    });

    this.uriArchivo = this.dataInput.rutaDocumento;

    setTimeout(() => {
        this.deshabilitarCampos();
        this.acc.expand('datos-solicitante');
        this.acc.expand('declaracion-jurada');
    });

  }


  descargarPdf() {
    if (this.idFormularioMovimiento === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 002/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  guardarFormulario() {
    if (!this.filePdfSeleccionado && !this.filePdfPathName)
      return this.funcionesMtcService.mensajeError('Debe ingresar una vigencia de poder');

    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    let dataGuardar: Formulario002_17Request = new Formulario002_17Request();

    //let dataGuardar = {
      dataGuardar.id=this.idFormularioMovimiento;
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
      dataGuardar.codigo = "17";
      dataGuardar.formularioId = 2;
      dataGuardar.codUsuario = "COD-USU";
      dataGuardar.estado = 1;
      dataGuardar.metaData.seccion1.personaNatural = this.tipoPersona === 1 ? true : false;
      dataGuardar.metaData.seccion1.personaJuridica = this.tipoPersona === 2 ? true : false;
      dataGuardar.metaData.seccion1.razonSocial = this.tipoPersona === 2 ? this.formulario.controls['s1_razonSocial'].value : '';
      dataGuardar.metaData.seccion1.apellidoPaterno = this.apellidoPaterno;
      dataGuardar.metaData.seccion1.apellidoMaterno = this.apellidoMaterno;
      dataGuardar.metaData.seccion1.nombres = this.nombres;
      dataGuardar.metaData.seccion1.domicilioLegal = this.formulario.controls['s1_domicilioLegal'].value;
      dataGuardar.metaData.seccion1.distrito = this.formulario.controls['s1_distrito'].value;
      dataGuardar.metaData.seccion1.provincia = this.formulario.controls['s1_provincia'].value;
      dataGuardar.metaData.seccion1.departamento = this.formulario.controls['s1_departamento'].value;
      dataGuardar.metaData.seccion1.dni = this.tipoPersona === 1 ? this.formulario.controls['s1_nroDocumento'].value : '';
      dataGuardar.metaData.seccion1.nroRuc = this.tipoPersona === 2 ? this.formulario.controls['s1_nroDocumento'].value : '';
      dataGuardar.metaData.seccion1.ce = this.formulario.controls['s1_ce'].value;
      dataGuardar.metaData.seccion1.ci = this.formulario.controls['s1_ci'].value;
      dataGuardar.metaData.seccion1.correo = this.formulario.controls['s1_correo'].value;
      dataGuardar.metaData.seccion1.telefono = this.formulario.controls['s1_telefono'].value;
      dataGuardar.metaData.seccion1.celular = this.formulario.controls['s1_celular'].value;
      dataGuardar.metaData.seccion1.notificacion = this.formulario.controls['s1_notificacion'].value;
      dataGuardar.metaData.seccion1.tipoDocRepresentante = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_tipoDocumentoRepresentante'].value;
      dataGuardar.metaData.seccion1.nroDocRepresentante = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_numeroDocumentoRepresentante'].value;
      dataGuardar.metaData.seccion1.nombresRepresentante = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_nombresRepresentante'].value;
      dataGuardar.metaData.seccion1.apellidoPaternoRepresentante = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_apellidoPaternoRepresentante'].value;
      dataGuardar.metaData.seccion1.apellidoMaternoRepresentante = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_apellidoMaternoRepresentante'].value;
      dataGuardar.metaData.seccion1.domicilioRepresentante = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_domicilioRepresentante'].value;
      dataGuardar.metaData.seccion1.nroPartida = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_nroPartida'].value;
      dataGuardar.metaData.seccion1.fechaPartida = this.tipoPersona === 1 ? '' : this.fechaPartida;
      dataGuardar.metaData.seccion1.oficinaRegistral = this.tipoPersona === 1 ? '' : this.formulario.controls['s1_oficinaRegistral'].value;
      dataGuardar.metaData.seccion1.archivoAdjunto = this.filePdfSeleccionado;
      dataGuardar.metaData.seccion1.pathName = this.filePdfPathName;
      dataGuardar.metaData.seccion2.servicioCodigo = this.codigoTupa;
      dataGuardar.metaData.seccion3.nombreSolicitante = this.nombreUsuario;
      dataGuardar.metaData.seccion3.documentoSolicitante = this.dniPersona;
      dataGuardar.metaData.seccion3.declaracionJurada = this.formulario.controls['s3_declaracionjurada'].value; 
        
    console.log("DATA: ",dataGuardar);
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idFormularioMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
    .then(() => {
      if (this.idFormularioMovimiento === 0) {
        this.funcionesMtcService.mostrarCargando();
        //GUARDAR:
        this.formularioService.post<any>(dataGuardarFormData)
          .subscribe(
            data => {
              this.funcionesMtcService.ocultarCargando();
              this.idFormularioMovimiento = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;

              this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
            },
            error => {
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

        this.funcionesMtcService.mostrarCargando();

        if( cadenaAnexos.length > 0){

          this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar los anexos " + cadenaAnexos + "¿Desea continuar?")
          .then(() => {

          //MODIFICAR
          this.formularioService.put<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idFormularioMovimiento = data.id;
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
                      this.formularioTramiteService.uriArchivo<number>(listarequisitos[i].movId)
                        .subscribe(
                          data => {},
                          error => {
                            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                          }
                        );
                    }
                  }
                }

                this.funcionesMtcService.ocultarCargando().mensajeOk(`Los datos fueron modificados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
              }
            );
          });
        }else{
            //MODIFICAR
            this.formularioService.put<any>(dataGuardarFormData)
              .subscribe(
                data => {
                  this.funcionesMtcService.ocultarCargando();
                  this.idFormularioMovimiento = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;

                  this.funcionesMtcService.ocultarCargando().mensajeOk(`Los datos fueron modificados exitosamente`);
                },
                error => {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              );
        }
      }
    });
  }

  recuperarDatosUsuario(){
    this.reniecService.getDni(this.dniPersona).subscribe(
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

  recuperarDatosReniec() {

    this.funcionesMtcService.mostrarCargando();

    this.reniecService.getDni(this.dniPersona).subscribe(
        respuesta => {

            this.funcionesMtcService.ocultarCargando();

            const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            if (datos.prenombres === '')
              return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

            this.formulario.controls['s1_razonSocial'].setValue(datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
            this.formulario.controls['s1_domicilioLegal'].setValue(datos.direccion.trim());

            this.nombres = datos.prenombres.trim();
            this.apellidoPaterno = datos.apPrimer.trim();
            this.apellidoMaterno = datos.apSegundo.trim();

            let ubigeo = datos.ubigeo.split('/');
            this.formulario.controls['s1_distrito'].setValue(ubigeo[2].trim());
            this.formulario.controls['s1_provincia'].setValue(ubigeo[1].trim());
            this.formulario.controls['s1_departamento'].setValue(ubigeo[0].trim());

            this.formulario.controls['s1_nroDocumento'].setValue(this.dniPersona.trim());
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando().mensajeError('Error al consultar el Servicio Reniec');
            this.habilitarCamposUsuario();
        }
      );
  }

  recuperarDatosSunat() {
    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
      datos => {
        this.funcionesMtcService.ocultarCargando();
        this.formulario.controls['s1_razonSocial'].setValue(datos.razonSocial.trim());
        this.formulario.controls['s1_domicilioLegal'].setValue(datos.domicilioLegal.trim());
        this.formulario.controls['s1_distrito'].setValue(datos.nombreDistrito.trim());
        this.formulario.controls['s1_provincia'].setValue(datos.nombreProvincia.trim());
        this.formulario.controls['s1_departamento'].setValue(datos.nombreDepartamento.trim());
        this.formulario.controls['s1_nroDocumento'].setValue(datos.nroDocumento.trim());
        this.formulario.controls['s1_correo'].setValue(datos.correo.trim());
        this.formulario.controls['s1_telefono'].setValue(datos.telefono.trim());
        this.formulario.controls['s1_celular'].setValue(datos.celular.trim());
        this.representanteLegal = datos.representanteLegal;
      },
      error => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio Reniec');
        this.habilitarCamposUsuario();
        this.habilitarCamposRepresentante();
      }
    );
  }

  recuperarDatosSunatModificar() {
    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
      datos => {
        this.funcionesMtcService.ocultarCargando();
        this.representanteLegal = datos.representanteLegal;
      },
      error => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio Reniec');
      }
    );
  }

  recuperarDatosRepresentateLegal() {
    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getRepresentantesLegales(this.ruc).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();
          const datos = respuesta.getRepLegalesResponse;
        },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio Reniec');
          this.habilitarCamposRepresentante();
        }
    );
  }

  onDateSelectPartida(event) {
      let year = event.year;
      let month = event.month <= 9 ? '0' + event.month : event.month;
      let day = event.day <= 9 ? '0' + event.day : event.day;
      let finalDate = year + "-" + month + "-" + day;
      this.fechaPartida = finalDate;
  }

  onDateSelectPago(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaPago = finalDate;
  }

  changeTipoDocumento() {
    this.formulario.controls['s1_numeroDocumentoRepresentante'].setValue('');
    this.inputNumeroDocumento();
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.formulario.controls['s1_nombresRepresentante'].setValue('');
    this.formulario.controls['s1_apellidoPaternoRepresentante'].setValue('');
    this.formulario.controls['s1_apellidoMaternoRepresentante'].setValue('');
    this.formulario.controls['s1_domicilioRepresentante'].setValue('');
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
    this.toggle = e;
  }

  buscarNumeroDocumento() {
      const tipoDocumento: string = this.formulario.controls['s1_tipoDocumentoRepresentante'].value.trim();
      const numeroDocumento: string = this.formulario.controls['s1_numeroDocumentoRepresentante'].value.trim();

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
        return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      if (tipoDocumento === '1' && numeroDocumento.length !== 8)
        return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

        const resultado = this.representanteLegal.find( representante => representante.tipoDocumento.trim() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );
        if(resultado){

          this.funcionesMtcService.mostrarCargando();

            this.reniecService.getDni(numeroDocumento).subscribe(
              respuesta => {

                  this.funcionesMtcService.ocultarCargando();

                  const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

                  if (datos.prenombres === '')
                    return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

                  this.formulario.controls['s1_apellidoPaternoRepresentante'].setValue(datos.apPrimer.trim());
                  this.formulario.controls['s1_apellidoMaternoRepresentante'].setValue(datos.apSegundo.trim());
                  this.formulario.controls['s1_nombresRepresentante'].setValue(datos.prenombres.trim());
                  this.formulario.controls['s1_domicilioRepresentante'].setValue(datos.direccion.trim());

              },
              error => {
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Error al consultar el Servicio Reniec');
                  this.habilitarCamposRepresentante();
              }
            );

        }else{
            return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
        }

  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['s1_tipoDocumentoRepresentante'].value.trim();

    if (tipoDocumento === '1')//DNI
      return 8;
    else if (tipoDocumento === '2')//CE
      return 12;
    return 0
  }

  recuperarInformacion(){
      //si existe el documento
      if (this.dataInput.movId > 0) {
        //RECUPERAMOS LOS DATOS DEL FORMULARIO
        this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
          (dataFormulario: Formulario002_17Response) => {
            const metaData: any = JSON.parse(dataFormulario.metaData);
            
            this.idFormularioMovimiento = dataFormulario.formularioId;

            if( this.tipoPersona === 1 ){
                this.formulario.get("s1_razonSocial").setValue(metaData.seccion1.apellidoPaterno + " " + metaData.seccion1.apellidoMaterno + " " + metaData.seccion1.nombres);
                this.formulario.get("s1_nroDocumento").setValue(metaData.seccion1.dni);
                this.apellidoPaterno = metaData.seccion1.apellidoPaterno;
                this.apellidoMaterno = metaData.seccion1.apellidoMaterno;
                this.nombres = metaData.seccion1.nombres;
            }else{
                this.formulario.get("s1_razonSocial").setValue(metaData.seccion1.razonSocial);
                this.formulario.get("s1_nroDocumento").setValue(metaData.seccion1.nroRuc);
            }

            this.formulario.get("s1_domicilioLegal").setValue(metaData.seccion1.domicilioLegal);
            this.formulario.get("s1_distrito").setValue(metaData.seccion1.distrito);
            this.formulario.get("s1_provincia").setValue(metaData.seccion1.provincia);
            this.formulario.get("s1_departamento").setValue(metaData.seccion1.departamento);
            this.formulario.get("s1_ce").setValue(metaData.seccion1.ce);
            this.formulario.get("s1_ci").setValue(metaData.seccion1.ci);
            this.formulario.get("s1_correo").setValue(metaData.seccion1.correo);
            this.formulario.get("s1_telefono").setValue(metaData.seccion1.telefono);
            this.formulario.get("s1_celular").setValue(metaData.seccion1.celular);
            this.formulario.get("s1_notificacion").setValue(metaData.seccion1.notificacion);
            this.formulario.get("s1_numeroDocumentoRepresentante").setValue(metaData.seccion1.nroDocRepresentante);
            this.formulario.get("s1_tipoDocumentoRepresentante").setValue(metaData.seccion1.tipoDocRepresentante);
            this.formulario.get("s1_nombresRepresentante").setValue(metaData.seccion1.nombresRepresentante);
            this.formulario.get("s1_apellidoMaternoRepresentante").setValue(metaData.seccion1.apellidoMaternoRepresentante);
            this.formulario.get("s1_apellidoPaternoRepresentante").setValue(metaData.seccion1.apellidoPaternoRepresentante);
            this.formulario.get("s1_domicilioRepresentante").setValue(metaData.seccion1.domicilioRepresentante);
            this.formulario.get("s1_nroPartida").setValue(metaData.seccion1.nroPartida);
            this.filePdfPathName = metaData.seccion1.pathName;

            if( metaData.seccion1.fechaPartida.length > 0){
                this.fechaPartida = metaData.seccion1.fechaPartida;
                const fechaPartida = metaData.seccion1.fechaPartida.split("-");

                this.selectedDateFechaInscripcion = {
                  day: parseInt(fechaPartida[2]),
                  month: parseInt(fechaPartida[1]),
                  year: parseInt(fechaPartida[0])
                };

                this.formulario.get("s1_fechaPartida").setValue(this.selectedDateFechaInscripcion);
            }else{
                this.formulario.get("s1_fechaPartida").setValue(null);
            }

            this.formulario.get("s1_oficinaRegistral").setValue(metaData.seccion1.oficinaRegistral);
            this.formulario.get("s2_servicioCodigo").setValue(metaData.seccion2.servicioCodigo);

            this.recuperarDatosSunatModificar();

          },
          error => {
            this.errorAlCargarData = true;
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del formulario');
            this.habilitarCamposUsuario();
            this.habilitarCamposRepresentante();
          });
      }else{
          switch(this.tipoPersona){
              case 1: this.recuperarDatosReniec(); break;
              case 2: case 3: this.recuperarDatosSunat(); break;
          }
      }
  }

  deshabilitarCampos(){
      this.formulario.controls["s1_razonSocial"].disable();
      this.formulario.controls["s1_nroDocumento"].disable();
      this.formulario.controls["s1_domicilioLegal"].disable();
      this.formulario.controls["s1_distrito"].disable();
      this.formulario.controls["s1_provincia"].disable();
      this.formulario.controls["s1_departamento"].disable();
      this.formulario.controls["s1_ce"].disable();
      this.formulario.controls["s1_ci"].disable();
      this.formulario.controls["s1_nombresRepresentante"].disable();
      this.formulario.controls["s1_apellidoMaternoRepresentante"].disable();
      this.formulario.controls["s1_apellidoPaternoRepresentante"].disable();
  }

  habilitarCamposUsuario(){
      this.formulario.controls["s1_razonSocial"].enable();
      this.formulario.controls["s1_nroDocumento"].enable();
      this.formulario.controls["s1_domicilioLegal"].enable();
      this.formulario.controls["s1_distrito"].enable();
      this.formulario.controls["s1_provincia"].enable();
      this.formulario.controls["s1_departamento"].enable();
      this.formulario.controls["s1_ce"].enable();
      this.formulario.controls["s1_ci"].enable();
  }

  habilitarCamposRepresentante(){
      this.formulario.controls["s1_nombresRepresentante"].enable();
      this.formulario.controls["s1_apellidoMaternoRepresentante"].enable();
      this.formulario.controls["s1_apellidoPaternoRepresentante"].enable();
      this.formulario.controls["s1_tipoDocumentoRepresentante"].enable();
      this.formulario.controls["s1_numeroDocumentoRepresentante"].enable();
  }

  visualizarVigenciaPoderPdf() {
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
  }

  visualizarDialogoPdf() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Vigencia de Poder";
  }

  formInvalid(control: string) : boolean {
    if(this.formulario.get(control))
      return this.formulario.get(control).invalid && (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }
}
