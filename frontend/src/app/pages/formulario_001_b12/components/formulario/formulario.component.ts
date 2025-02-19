import { Component, OnInit, Input } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { Formulario001B12Service } from 'src/app/core/services/formularios/formulario001-b12.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario001B12Request } from 'src/app/core/models/Formularios/Formulario001_b12/Formulario001-b12Request';
import { DatosSolicitante, ServicioSolicitado } from '../../../../core/models/Formularios/Formulario001_b12/Secciones';
import { DeclaracionJurada } from '../../../../core/models/Formularios/Formulario001_b12/Secciones';
import { NgbActiveModal, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SunatService } from '../../../../core/services/servicios/sunat.service';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { Formulario001B12Response } from 'src/app/core/models/Formularios/Formulario001_b12/Formulario001-b12Response';
import { FormularioTramiteService } from '../../../../core/services/tramite/formulario-tramite.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  @Input() public dataInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  disabled: boolean = true;
  idForm: number = 0;
  formulario: UntypedFormGroup;
  vUbigeo: string[] = [];
  varUbigeo: string[] = [];

  ocultar: boolean = true;
  esRepresentante: boolean = false;

  tipoDocumentoLogin: string;
  nroDocumentoLogin: string;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  dni: string;
  buttonMarcadoObligatorio: boolean;

  fechaPago: string = "";
  fechaNacimiento: string = "";
  nroRecibo = '';
  nroOperacion = '';
  tramiteId: number;

  marcado: number = 0;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  descFlgForm: string;
  selectedDateFechaNacimiento: NgbDateStruct = undefined;
  selectedDateFechaPago: NgbDateStruct = undefined;

  nombreUsuario: string = "";

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de Extranjería' }
  ];

  listaOficinaRegistral: any[] = [];

  representanteLegal: RepresentanteLegal[] = [];

  constructor(public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private sunatService: SunatService,
    private extranjeriaService: ExtranjeriaService,
    private seguridadService: SeguridadService,
    private modalService: NgbModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private reniecService: ReniecService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario001B12Service,
    private _oficinaRegistral: OficinaRegistralService,
    private tramiteService: TramiteService) {
  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;

    this.formulario = this.fb.group({
      numeroRuc: this.fb.control('', [Validators.required]),
      razonSocial: this.fb.control('', [Validators.required]),
      domicilioLegal: this.fb.control('', [Validators.required]),
      distrito: this.fb.control('', [Validators.required]),
      provincia: this.fb.control('', [Validators.required]),
      departamento: this.fb.control('', [Validators.required]),
      telefono: this.fb.control(''),
      celular: this.fb.control('', [Validators.required]),
      correoElectronico: this.fb.control('', [Validators.email]),
      tipoDocumentoRep: this.fb.control('', [Validators.required]),
      nroDocumentoRep: this.fb.control('', [Validators.required]),

      nombreRep: this.fb.control('', [Validators.required]),
      apPaternoRep: this.fb.control('', [Validators.required]),
      apMaternoRep: this.fb.control('', [Validators.required]),
      domicilioRepresentante: this.fb.control('', [Validators.required]),
      numeroPartida: this.fb.control('', [Validators.required]),
      oficina: this.fb.control('', [Validators.required]),

      pasaporte: this.fb.control('', [Validators.required]),
      apellidoPaterno02: this.fb.control('', [Validators.required]),
      apellidoMaterno02: this.fb.control('', [Validators.required]),
      nombres02: this.fb.control('', [Validators.required]),
      nacionalidad: this.fb.control('', [Validators.required]),
      fechaNacimiento: this.fb.control('', [Validators.required]),
      licenciaDe: this.fb.control('', [Validators.required]),
      habilitacion: this.fb.control('', [Validators.required]),
      numero: this.fb.control('', [Validators.required]),
      numeroMeses: this.fb.control('', [Validators.required]),
      tipoAeronave: this.fb.control('', [Validators.required]),
      funciones: this.fb.control('', [Validators.required]),
    });

    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.traerDatos();
    this.cargarDatos();
    this.cargarOficinaRegistral();
  }

  traerDatos() {
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login
    this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.ruc = this.seguridadService.getCompanyCode();
    this.formulario.controls['numeroRuc'].setValue(this.ruc);
    this.recuperarDatosUsuario();
  }

  cargarOficinaRegistral() {
    this._oficinaRegistral.oficinaRegistral().subscribe(
      (dataOficinaRegistral) => {
        this.listaOficinaRegistral = dataOficinaRegistral;
        this.funcionesMtcService.ocultarCargando();
      },
      error => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
      });
  }

  cargarDatos() {
    if (this.dataInput.rutaDocumento) {
      this.funcionesMtcService.mostrarCargando();
      //RECUPERAMOS LOS DATOS
      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataFormulario: Formulario001B12Response) => {
          this.funcionesMtcService.ocultarCargando();
          const metaData: any = JSON.parse(dataFormulario.metaData);

          this.idForm = dataFormulario.formularioId;
          this.formulario.get("numeroRuc").setValue(metaData.datosSolicitante.ruc);
          this.formulario.get("razonSocial").setValue(metaData.datosSolicitante.razonSocial);
          this.formulario.get("domicilioLegal").setValue(metaData.datosSolicitante.domilicio);
          this.formulario.get("distrito").setValue(metaData.datosSolicitante.distrito);
          this.formulario.get("provincia").setValue(metaData.datosSolicitante.provincia);
          this.formulario.get("departamento").setValue(metaData.datosSolicitante.departamento);
          this.formulario.get("telefono").setValue(metaData.datosSolicitante.telefonoFax);
          this.formulario.get("celular").setValue(metaData.datosSolicitante.celular);
          this.formulario.get("correoElectronico").setValue(metaData.datosSolicitante.correoElectronico);

          this.formulario.get("tipoDocumentoRep").setValue(metaData.datosSolicitante.representanteLegal.tipoDocumento.id);
          this.formulario.get("nroDocumentoRep").setValue(metaData.datosSolicitante.representanteLegal.numeroDocumento);
          this.formulario.get("nombreRep").setValue(metaData.datosSolicitante.representanteLegal.nombres);
          this.formulario.get("apPaternoRep").setValue(metaData.datosSolicitante.representanteLegal.apellidoPaterno);
          this.formulario.get("apMaternoRep").setValue(metaData.datosSolicitante.representanteLegal.apellidoMaterno);

          if (this.formulario.get("tipoDocumentoRep").value === '04') {
            const apellMatRep = this.formulario.controls['apMaternoRep'];
            this.disabled = false;
            setTimeout(() => {
              apellMatRep.setValidators(null);
              apellMatRep.updateValueAndValidity();
            });
          }

          this.formulario.get("domicilioRepresentante").setValue(metaData.datosSolicitante.representanteLegal.domicilioRepresentanteLegal);
          this.formulario.get("numeroPartida").setValue(metaData.datosSolicitante.representanteLegal.nroPartida);
          setTimeout(() => {
            this.formulario.get("oficina").setValue(metaData.datosSolicitante.representanteLegal.oficinaRegistral.id);
          });

          this.formulario.get("apellidoPaterno02").setValue(metaData.servicioSolicitado.personalAeronautico.apellidoPaterno);
          this.formulario.get("apellidoMaterno02").setValue(metaData.servicioSolicitado.personalAeronautico.apellidoMaterno);
          this.formulario.get("nombres02").setValue(metaData.servicioSolicitado.personalAeronautico.nombres);
          this.formulario.get("pasaporte").setValue(metaData.servicioSolicitado.personalAeronautico.pasaporte);
          this.formulario.get("nacionalidad").setValue(metaData.servicioSolicitado.personalAeronautico.nacionalidad);

          this.formulario.get("licenciaDe").setValue(metaData.servicioSolicitado.personalAeronautico.nroLicencia);
          this.formulario.get("habilitacion").setValue(metaData.servicioSolicitado.personalAeronautico.habilitacion);
          this.formulario.get("numero").setValue(metaData.servicioSolicitado.personalAeronautico.nroLicencia);
          this.formulario.get("numeroMeses").setValue(metaData.servicioSolicitado.personalAeronautico.nroMeses);
          this.formulario.get("tipoAeronave").setValue(metaData.servicioSolicitado.personalAeronautico.tipoAeronave);
          this.formulario.get("funciones").setValue(metaData.servicioSolicitado.personalAeronautico.funciones);

          if (metaData.servicioSolicitado.personalAeronautico.fechaNacimiento.length > 0) {
            this.fechaNacimiento = metaData.servicioSolicitado.personalAeronautico.fechaNacimiento;

            const fechaNacimiento = metaData.servicioSolicitado.personalAeronautico.fechaNacimiento.split("-");

            this.selectedDateFechaNacimiento = {
              day: parseInt(fechaNacimiento[2]),
              month: parseInt(fechaNacimiento[1]),
              year: parseInt(fechaNacimiento[0]),
            };

            this.formulario.get("fechaNacimiento").setValue(this.selectedDateFechaNacimiento);
          } else {
            this.formulario.get("fechaNacimiento").setValue(null);
          }

        },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        });

    } else {
      this.recuperarDatosSunat();
    }
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

  changeTipoDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumentoRep'].value.trim();
    const apMaternoRep = this.formulario.controls['apMaternoRep'];

    if (tipoDocumento === '04') {
      this.disabled = false;
      apMaternoRep.setValidators(null);
      apMaternoRep.updateValueAndValidity();
    } else {
      this.disabled = true;
      apMaternoRep.setValidators([Validators.required]);
      apMaternoRep.updateValueAndValidity();
    }

    this.formulario.controls['nroDocumentoRep'].setValue('');
    this.inputNumeroDocumento();
  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumentoRep'].value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    else if (tipoDocumento === '03')//Carnet de Identidad o Cédula de Identidad
      return 12;
    return 0
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.formulario.controls['domicilioRepresentante'].setValue('');
    this.formulario.controls['apPaternoRep'].setValue('');
    this.formulario.controls['apMaternoRep'].setValue('');
    this.formulario.controls['nombreRep'].setValue('');
  }

  inputNumeroDocumentoExt(event = undefined) {
    this.formulario.controls['apellidoPaterno02'].setValue('');
    this.formulario.controls['apellidoMaterno02'].setValue('');
    this.formulario.controls['nombres02'].setValue('');

  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  soloNumeros1(event) {
    event.target.value = event.target.value.match(/^[A-Za-z0-9]+$/g);
  }

  buscarNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumentoRep'].value.trim();
    const numeroDocumento: string = this.formulario.controls['nroDocumentoRep'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    const resultado = this.representanteLegal.find(representante => ('0' + representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento);

    if (resultado) {//DNI
      this.esRepresentante = false;
    } else {
      this.esRepresentante = true;
    }

    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '01') {//DNI
      this.reniecService.getDni(numeroDocumento).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          this.addPersona(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion,
            datosPersona.ubigeo);
        },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
        }
      );
    } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
      this.extranjeriaService.getCE(numeroDocumento).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

          this.addPersona(tipoDocumento,
            respuesta.CarnetExtranjeria.nombres,
            respuesta.CarnetExtranjeria.primerApellido,
            respuesta.CarnetExtranjeria.segundoApellido,
            '',
            '');
        },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
        }
      );
    }
  }

  addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, ubigeo: string) {
    this.vUbigeo = ubigeo.split("/", 3);
    this.varUbigeo = this.vUbigeo;

    this.formulario.controls['apPaternoRep'].setValue(ap_paterno);
    this.formulario.controls['apMaternoRep'].setValue(ap_materno);
    this.formulario.controls['nombreRep'].setValue(nombres);
    this.formulario.controls['domicilioRepresentante'].setValue(direccion);
  }

  addPersonaExt(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, ubigeo: string) {
    this.vUbigeo = ubigeo.split("/", 3);
    this.varUbigeo = this.vUbigeo;

    this.formulario.controls['apellidoPaterno02'].setValue(ap_paterno);
    this.formulario.controls['apellidoMaterno02'].setValue(ap_materno);
    this.formulario.controls['nombres02'].setValue(nombres);
    this.formulario.controls['domicilioRepresentante'].setValue(direccion);
  }

  guardarFormulario() {

    let dataGuardar: Formulario001B12Request = new Formulario001B12Request();

    dataGuardar.id = this.idForm;
    dataGuardar.formularioId = 1;
    dataGuardar.codigo = 'B12';
    dataGuardar.codUsuario = "USER001";
    dataGuardar.estado = 1;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    let datosSolicitante: DatosSolicitante = new DatosSolicitante();

    datosSolicitante.ruc = this.formulario.controls['numeroRuc'].value.trim();
    datosSolicitante.razonSocial = this.formulario.controls['razonSocial'].value.trim();
    datosSolicitante.domilicio = this.formulario.controls['domicilioLegal'].value.trim();
    datosSolicitante.distrito = this.formulario.controls['distrito'].value.trim();
    datosSolicitante.provincia = this.formulario.controls['provincia'].value.trim();
    datosSolicitante.departamento = this.formulario.controls['departamento'].value.trim();
    datosSolicitante.telefonoFax = this.formulario.controls['telefono'].value.trim();
    datosSolicitante.celular = this.formulario.controls['celular'].value.trim();
    datosSolicitante.correoElectronico = this.formulario.controls['correoElectronico'].value.trim();

    datosSolicitante.representanteLegal.nombres = this.formulario.controls['nombreRep'].value;
    datosSolicitante.representanteLegal.apellidoPaterno = this.formulario.controls['apPaternoRep'].value;
    datosSolicitante.representanteLegal.apellidoMaterno = this.formulario.controls['apMaternoRep'].value;
    datosSolicitante.representanteLegal.tipoDocumento.id = this.formulario.controls['tipoDocumentoRep'].value;
    datosSolicitante.representanteLegal.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumentoRep').value)[0].documento;
    datosSolicitante.representanteLegal.numeroDocumento = this.formulario.controls['nroDocumentoRep'].value.trim();
    datosSolicitante.representanteLegal.domicilioRepresentanteLegal = this.formulario.controls['domicilioRepresentante'].value.trim();
    datosSolicitante.representanteLegal.nroPartida = this.formulario.controls['numeroPartida'].value.trim();
    datosSolicitante.representanteLegal.oficinaRegistral.id = this.formulario.controls['oficina'].value;
    datosSolicitante.representanteLegal.oficinaRegistral.descripcion = this.listaOficinaRegistral.filter(item => item.value == this.formulario.get('oficina').value)[0].text;

    let servicioSolicitado: ServicioSolicitado = new ServicioSolicitado();
    servicioSolicitado.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
    servicioSolicitado.descProcedimientoTupa = this.descProcedimientoTupa;

    servicioSolicitado.personalAeronautico.nombres = this.formulario.controls['nombres02'].value.trim();
    servicioSolicitado.personalAeronautico.apellidoPaterno = this.formulario.controls['apellidoPaterno02'].value.trim();
    servicioSolicitado.personalAeronautico.apellidoMaterno = this.formulario.controls['apellidoMaterno02'].value.trim();
    servicioSolicitado.personalAeronautico.pasaporte = this.formulario.controls['pasaporte'].value.trim();
    servicioSolicitado.personalAeronautico.nacionalidad = this.formulario.controls['nacionalidad'].value.trim();
    servicioSolicitado.personalAeronautico.fechaNacimiento = this.fechaNacimiento;
    servicioSolicitado.personalAeronautico.licenciaDe = this.formulario.controls['licenciaDe'].value.trim();
    servicioSolicitado.personalAeronautico.habilitacion = this.formulario.controls['habilitacion'].value;
    servicioSolicitado.personalAeronautico.nroLicencia = this.formulario.controls['numero'].value;
    servicioSolicitado.personalAeronautico.nroMeses = this.formulario.controls['numeroMeses'].value;
    servicioSolicitado.personalAeronautico.tipoAeronave = this.formulario.controls['tipoAeronave'].value;
    servicioSolicitado.personalAeronautico.funciones = this.formulario.controls['funciones'].value;

    const declaracionJurada: DeclaracionJurada = new DeclaracionJurada();
    declaracionJurada.nombreSolicitante = this.nombreUsuario;
    declaracionJurada.documentoSolicitante = this.nroDocumentoLogin;

    dataGuardar.metaData.datosSolicitante = datosSolicitante;
    dataGuardar.metaData.servicioSolicitado = servicioSolicitado;
    dataGuardar.metaData.declaracionJurada = declaracionJurada;

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idForm === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {
        this.funcionesMtcService.mostrarCargando();

        if (this.idForm === 0) {
          //GUARDAR:
          this.formularioService.post<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idForm = data.id;
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
          this.formularioService.put<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idForm = data.id;
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
    this.funcionesMtcService.mostrarCargando();

    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();
        const datos = respuesta;

        this.formulario.controls['razonSocial'].setValue(datos.razonSocial);
        this.formulario.controls['domicilioLegal'].setValue(datos.domicilioLegal);
        this.formulario.controls['distrito'].setValue(datos.nombreDistrito);
        this.formulario.controls['provincia'].setValue(datos.nombreProvincia);
        this.formulario.controls['departamento'].setValue(datos.nombreDepartamento);
        this.formulario.controls['correoElectronico'].setValue(datos.correo);
        this.formulario.controls['telefono'].setValue(datos.telefono);
        this.formulario.controls['celular'].setValue(datos.celular);
        this.representanteLegal = datos.representanteLegal;
      },
      error => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
      }
    );
  }

  descargarPdf() {
    if (this.idForm === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo).subscribe(
      (file: Blob) => {
        this.funcionesMtcService.ocultarCargando();

        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(file);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001-B/12";
      },
      error => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para descargar Pdf');
      }
    );
  }

  formatFecha(fecha: any) {
    let myDate = new Date(fecha.year, fecha.month - 1, fecha.day);
    return myDate;
  }

  onDateSelectPartida(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaNacimiento = finalDate;
  }

  formInvalid(control: string) {
    return this.formulario.get(control).invalid &&
      (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }
}
