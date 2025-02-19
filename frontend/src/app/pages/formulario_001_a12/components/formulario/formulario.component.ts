import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario001A12Request } from 'src/app/core/models/Formularios/Formulario001_a12/Formulario001-a12Request';

//Servicios
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from '../../../../core/services/servicios/sunat.service';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { from } from 'rxjs';

import { Formulario001A12Service } from 'src/app/core/services/formularios/formulario001-a12.service';
import { DatosSolicitante, ServicioSolicitado, DeclaracionJurada } from '../../../../core/models/Formularios/Formulario001_a12/Secciones';
import { Tramite } from '../../../../core/models/Tramite';
import { NgbActiveModal, NgbModal, NgbAccordionDirective , NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormularioTramiteService } from '../../../../core/services/tramite/formulario-tramite.service';
import { Formulario001A12Response } from 'src/app/core/models/Formularios/Formulario001_a12/Formulario001-a12Response';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { TipoLicencia } from '../../../../core/models/Formularios/Formulario001_a12/Secciones';
import { TramiteService } from '../../../../core/services/tramite/tramite.service';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})

export class FormularioComponent implements OnInit {
  @Input() public dataInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  active = 1;
  idForm: number = 0;
  vUbigeo: string[] = [];
  varUbigeo: string[] = [];
  formulario: UntypedFormGroup;
  readOnly: boolean = true;
  activo: boolean = true;
  oculto:boolean=false;

  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  dni: string;
  tipoPersona: number;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  descFlgForm: string;
  marcado: number = 0;
  buttonMarcadoObligatorio: boolean=true;
  tramiteId: number;

  nroRecibo = '';
  nroOperacion = '';

  fechaPago: string = "";
  fechaNacimiento: string = "";
  selectedDateFechaNacimiento: NgbDateStruct = undefined;
  selectedDateFechaPago: NgbDateStruct = undefined;

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "02", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' }
  ];

  listaLicencias: TipoLicencia[] = [
    { id: 1, descripcion: 'Pilotos PP' },
    { id: 2, descripcion: 'Pilotos PC' },
    { id: 3, descripcion: 'Pilotos TLA' },
    { id: 4, descripcion: 'TC' },
    { id: 5, descripcion: 'NAV' },
    { id: 6, descripcion: 'MBO' },
    { id: 7, descripcion: 'CTA' },
    { id: 8, descripcion: 'AFIS' },
    { id: 9, descripcion: 'APILOTO' },
    { id: 10, descripcion: 'TM' },
    { id: 11, descripcion: 'EOV' },
    { id: 12, descripcion: 'OEA' },
    { id: 13, descripcion: 'A.PARACADISTA' },
    { id: 14, descripcion: 'PARACAIDISTA A' },
    { id: 15, descripcion: 'PARACAIDISTA B' },
    { id: 16, descripcion: 'PARACAIDISTA C' },
    { id: 17, descripcion: 'PARACAIDISTA D' }

  ];

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private reniecService: ReniecService,
    private sunatService: SunatService,
    private formularioService: Formulario001A12Service,
    private extranjeriaService: ExtranjeriaService,
    private seguridadService: SeguridadService,
    private modalService: NgbModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private formularioTramiteService: FormularioTramiteService,
    private formService: Formulario001A12Service,
    private tramiteService: TramiteService) {
      //this.datosSolicitante = new DatosSolicitante();
      //this.derechoTramite = new Tramite();

     }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.formulario = this.fb.group({
      // tipoDocumentoForm: this.fb.control(''),
      numeroDocumentoForm: this.fb.control('', [Validators.required]),
      ap_paternoForm: this.fb.control('', [Validators.required]),
      ap_maternoForm: this.fb.control('', [Validators.required]),
      nombreForm: this.fb.control('', [Validators.required]),
      direccionForm: this.fb.control(''),
      distritoForm: this.fb.control('', [Validators.required]),
      provinciaForm: this.fb.control('', [Validators.required]),
      departamentoForm: this.fb.control('', [Validators.required]),
      rucForm: this.fb.control(''),
      telefonoForm: this.fb.control(''),
      celularForm: this.fb.control('', [Validators.required]),
      correoForm: this.fb.control('', [Validators.email, Validators.required ]),
      pesoForm: this.fb.control('', [Validators.required]),
      estaturaForm: this.fb.control('', [Validators.required]),
      c_ojosForm: this.fb.control('', [Validators.required]),
      c_cabelloForm: this.fb.control('', [Validators.required]),
      nacionalidadForm: this.fb.control('', [Validators.required]),
      f_nacForm: this.fb.control('', [Validators.required]),
      licenciaForm: this.fb.control('', [Validators.required]),
      n_licenciaForm: this.fb.control('', [Validators.required]),
      descFlgForm:  this.fb.control(''),
      especRequeridaForm: this.fb.control(''),
      
      
      //marcadoObligatorioForm: this.fb.control(true),
      autorizacionForm: this.fb.control('0')
    });
    /*n_reciboForm: this.fb.control(''),
      n_operacionForm: this.fb.control(''),
      fec_pagoForm: this.fb.control(null),*/

    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));
    console.log("===> "+  this.tramiteId);
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.descFlgForm = "";

    //this.validarPago();
    this.traerDatos();

    // this.recuperarDatosReniec();
    this.cargarDatos();
    this.loadDeclaracionJurada(this.codigoProcedimientoTupa);
  }

  validarPago(){
    if(this.dataInput.movId==0){
      this.tramiteService.getPago(this.tramiteId).subscribe(
        respuesta => {

          this.funcionesMtcService.ocultarCargando();

          const datos = respuesta;

          console.log(JSON.stringify(datos, null, 10));
          console.log(datos);

          if(datos==null){
            this.activeModal.close(this.graboUsuario);
            this.funcionesMtcService.mensajeError('Primero debe realizar el pago por derecho de trámite');
            return;

          }else{

            if(respuesta.numeroOperacion === null || respuesta.numeroOperacion === ''){
              this.activeModal.close(this.graboUsuario);
              this.funcionesMtcService.mensajeError('Primero debe realizar el pago por derecho de trámite');
              return;

            }else{

              this.nroRecibo = datos.codigoTributo + '-' + datos.codigoOficina;
              this.nroOperacion = datos.numeroOperacion;
              this.fechaPago = datos.fechaPago.substr(0,10);

              this.formulario.controls['n_reciboForm'].setValue(this.nroRecibo);
              this.formulario.controls['n_operacionForm'].setValue(this.nroOperacion);

              //cargar la fecha si es un nuevo registro

              const fechaPago = this.fechaPago.split("-");

              this.selectedDateFechaPago = {
                  day: parseInt(fechaPago[2]),
                  month: parseInt(fechaPago[1]),
                  year: parseInt(fechaPago[0])
              };

              this.formulario.controls['fec_pagoForm'].setValue(this.selectedDateFechaPago);

            }
          }

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Tramite');
        }
      );
    }

}
  loadDeclaracionJurada(codigoTupa: string){

    const licenciaForm = this.formulario.controls['licenciaForm'];
    const n_licenciaForm = this.formulario.controls['n_licenciaForm'];

    const n_reciboForm = "";
    const fec_pagoForm = "";
    const n_operacionForm = "";
    const descFlgForm = this.formulario.controls['descFlgForm'];

    // if(codigoTupa === 'DSA-001' || codigoTupa === 'DSA-003'){
    //   var descFlgForm = this.formulario.controls['descFlgForm'];

    // }

    switch(codigoTupa){

        case 'DSA-003':

          licenciaForm.setValidators([Validators.required]);
          n_licenciaForm.setValidators([Validators.required]);
          /*
          n_reciboForm.setValidators(null);
          fec_pagoForm.setValidators(null);
          n_operacionForm.setValidators(null);*/
          descFlgForm.setValidators([Validators.required]);
          this.activo = false;


            break;

        case 'DSA-001':


            licenciaForm.setValidators(null);
            n_licenciaForm.setValidators(null);
            /*
            n_reciboForm.setValidators(null);
            fec_pagoForm.setValidators(null);
            n_operacionForm.setValidators(null);*/

            descFlgForm.setValidators([Validators.required]);
            this.activo = false;


            break;

        case 'DSA-002':

          licenciaForm.setValidators(null);
          n_licenciaForm.setValidators(null);
          /*
          n_reciboForm.setValidators(null);
          fec_pagoForm.setValidators(null);
          n_operacionForm.setValidators(null);*/
          this.activo = false;

            break;

        case 'S-DSA-001':
        /*
        n_reciboForm.setValidators(null);
        fec_pagoForm.setValidators(null);
        n_operacionForm.setValidators(null);*/  
        this.activo = false;

        break;


    }

    licenciaForm.updateValueAndValidity();
    n_licenciaForm.updateValueAndValidity();
    licenciaForm.updateValueAndValidity();

    /*n_reciboForm.updateValueAndValidity();
    fec_pagoForm.updateValueAndValidity();
    n_operacionForm.updateValueAndValidity();*/

  }

  traerDatos() {
    // this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login
    // this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    // this.ruc = this.seguridadService.getCompanyCode();
    // this.formulario.controls['rucForm'].setValue(this.ruc);
    // this.formulario.controls['tipoDocumentoForm'].setValue("01");
    // this.formulario.controls['numeroDocumentoForm'].setValue(this.nroDocumentoLogin);

    if(this.seguridadService.getNameId() === '00001'){
      //persona natural
        this.tipoPersona = 1;
        this.dni = this.seguridadService.getNumDoc();
        this.formulario.controls['numeroDocumentoForm'].setValue(this.dni);
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.dni = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.formulario.controls['numeroDocumentoForm'].setValue(this.dni);
        this.formulario.controls['rucForm'].setValue(this.ruc);
    }else {

        this.tipoPersona = 3;
        this.dni = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.formulario.controls['numeroDocumentoForm'].setValue(this.dni);
        this.formulario.controls['rucForm'].setValue(this.ruc);
    }
  }

  cargarDatos(){
    setTimeout(() => {

        if (this.dataInput.movId>0) {
          // console.log("SI EXISTE RUTA DOCUMENTO");
          this.funcionesMtcService.mostrarCargando();
          //RECUPERAMOS LOS DATOS
          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario001A12Response) => {
              this.funcionesMtcService.ocultarCargando();
              const metaData: any = JSON.parse(dataFormulario.metaData);

              this.idForm = dataFormulario.formularioId;

              // console.log(JSON.stringify(dataFormulario, null, 10));
              console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));

              // this.formulario.get("tipoDocumentoForm").setValue('0'+(metaData.DatosSolicitante.TipoDocumento.Id).toString());
              this.formulario.get("numeroDocumentoForm").setValue(metaData.DatosSolicitante.NumeroDocumento);
              this.formulario.get("ap_paternoForm").setValue(metaData.DatosSolicitante.ApellidoPaterno);
              this.formulario.get("ap_maternoForm").setValue(metaData.DatosSolicitante.ApellidoMaterno);
              this.formulario.get("nombreForm").setValue(metaData.DatosSolicitante.Nombres);

              this.formulario.get("rucForm").setValue(metaData.DatosSolicitante.Ruc);
              // this.formulario.get("razonSocialForm").setValue(metaData.DatosSolicitante.RazonSocial);
              this.formulario.get("direccionForm").setValue(metaData.DatosSolicitante.Domicilio);
              this.formulario.get("distritoForm").setValue(metaData.DatosSolicitante.Distrito);
              this.formulario.get("provinciaForm").setValue(metaData.DatosSolicitante.Provincia);
              this.formulario.get("departamentoForm").setValue(metaData.DatosSolicitante.Departamento);
              this.formulario.get("telefonoForm").setValue(metaData.DatosSolicitante.TelefonoFax);
              this.formulario.get("celularForm").setValue(metaData.DatosSolicitante.Celular);
              this.formulario.get("correoForm").setValue(metaData.DatosSolicitante.CorreoElectronico);

             // this.formulario.get("marcadoObligatorioForm").setValue(metaData.DatosSolicitante.MarcadoObligatorio);

              this.formulario.get("pesoForm").setValue(metaData.DatosSolicitante.Peso);
              this.formulario.get("estaturaForm").setValue(metaData.DatosSolicitante.Estatura);
              this.formulario.get("c_ojosForm").setValue(metaData.DatosSolicitante.ColorOjos);
              this.formulario.get("c_cabelloForm").setValue(metaData.DatosSolicitante.ColorCabellos);
              this.formulario.get("nacionalidadForm").setValue(metaData.DatosSolicitante.Nacionalidad);

              if(metaData.DatosSolicitante.TipoLicencia.Id!==null){
                this.formulario.get("licenciaForm").setValue(metaData.DatosSolicitante.TipoLicencia.Id);
              }

              this.formulario.get("n_licenciaForm").setValue(metaData.DatosSolicitante.NroLicencia);
              
              /*
              this.formulario.get("n_reciboForm").setValue(metaData.DerechoTramite.NroReciboAcotacion);
              this.formulario.get("n_operacionForm").setValue(metaData.DerechoTramite.NroOperacionBancoNacion);
              */

              // this.formulario.get("oficinaRegistralForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.Id);
              // this.formulario.get("datosForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.Nombres);

              // this.formulario.get("direccion").setValue(metaData.DatosSolicitante.RepresentanteLegal.DomicilioRepresentanteLegal);
              // this.formulario.get("autorizacionForm").setValue(metaData.DeclaracionJurada.FlgAutorizacion);


            if( metaData.DatosSolicitante.FechaNacimiento.length > 0){

              this.fechaNacimiento =  metaData.DatosSolicitante.FechaNacimiento;

              const fechaNacimiento = metaData.DatosSolicitante.FechaNacimiento.split("-");

              this.selectedDateFechaNacimiento = {
                day: parseInt(fechaNacimiento[2]),
                month: parseInt(fechaNacimiento[1]),
                year: parseInt(fechaNacimiento[0])
              };

              console.log("==> "+this.selectedDateFechaNacimiento);
              this.formulario.get("f_nacForm").setValue(this.selectedDateFechaNacimiento);

          }else{

              this.formulario.get("f_nacForm").setValue(null);

          }

          if(metaData.DerechoTramite.FechaDePago!==null){
              if( metaData.DerechoTramite.FechaDePago.length > 0){

                this.fechaPago = metaData.DerechoTramite.FechaDePago;
                console.log("+==> "+this.fechaPago);

                const fechaPago =metaData.DerechoTramite.FechaDePago.split("-");

                this.selectedDateFechaPago = {
                  day: parseInt(fechaPago[2]),
                  month: parseInt(fechaPago[1]),
                  year: parseInt(fechaPago[0])
                };

                console.log("==> "+this.selectedDateFechaPago);

                this.formulario.get("fec_pagoForm").setValue(this.selectedDateFechaPago);

            }else{

                this.formulario.get("fec_pagoForm").setValue(null);

            }
          }
          }
          ,
              error => {
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
              });

        }else{
          // this.recuperarDatosReniec();
          console.log(">>>>>> "+this.tipoPersona);
          switch(this.tipoPersona){
            case 1:
                //servicio reniec
                this.recuperarDatosReniec();
            break;

            case 2:
                //persona juridica
                this.recuperarDatosReniec();

            break;

            case 3:
                //persona natural con ruc
                this.recuperarDatosReniec();
            break;
        }
        }
  });
}

recuperarDatosReniec(){
  const tipoDocumento: string = "01";
  console.log("==>");
  // const dni: any = this.nroDocumentoLogin.trim();
  // this.formulario.controls['tipoDocumentoForm'].setValue(tipoDocumento);
  // this.formulario.controls['numeroDocumentoForm'].setValue(dni);
  // console.log("***** "+dni);
  this.reniecService.getDni(this.dni).subscribe(
    respuesta => {
      this.funcionesMtcService.ocultarCargando();

      if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

        if (datosPersona.prenombres === '')
        return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

        this.addPersonaSin(tipoDocumento,
          datosPersona.prenombres ,
          datosPersona.apPrimer,
          datosPersona.apSegundo,
          datosPersona.direccion,
          datosPersona.ubigeo);
    },
    error => {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Error al consultar al servicio');
    }
  );

}

recuperarDatosSunat() {

    this.funcionesMtcService.mostrarCargando();

    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
        respuesta => {

          this.funcionesMtcService.ocultarCargando();

          const datos = respuesta;

          console.log(JSON.stringify(datos, null, 10));

          //console.log(JSON.stringify(datos, null, 10));
          this.formulario.controls['razonSocialForm'].setValue(datos.razonSocial);
          this.formulario.controls['domicilioForm'].setValue(datos.domicilioLegal);
          this.formulario.controls['distritoForm'].setValue(datos.nombreDistrito);
          this.formulario.controls['provinciaForm'].setValue(datos.nombreProvincia);
          this.formulario.controls['departamentoForm'].setValue(datos.nombreDepartamento);
          this.formulario.controls['numeroDocumentoForm'].setValue(datos.representanteLegal[0].nroDocumento);
          this.formulario.controls['correoElectronicoForm'].setValue(datos.correo);
          this.formulario.controls['telefonoFaxForm'].setValue(datos.telefono);
          this.formulario.controls['celularForm'].setValue(datos.celular);

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio de Sunat');
        }
      );

  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  onChangeMarcado(event) {

    this.buttonMarcadoObligatorio =this.formulario.controls['marcadoObligatorio'].value;

    if ( this.buttonMarcadoObligatorio ){

      this.marcado = 1;

    }
  }

  changeTipoDocumento() {
    this.formulario.controls['numeroDocumentoForm'].setValue('');
    this.inputNumeroDocumento();
  }
  changeTipoLicencia() {
    this.formulario.controls['n_licenciaForm'].setValue('');
  }
  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumentoForm'].value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '02')//Carnet de extranjería
      return 12;
    else if (tipoDocumento === '03')//Carnet de Identidad o Cédula de Identidad
    return 12;
    return 0
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

      this.formulario.controls['ap_paternoForm'].setValue('');
      this.formulario.controls['ap_maternoForm'].setValue('');
      this.formulario.controls['nombreForm'].setValue('');
  }
  buscarNumeroDocumento() {

    const tipoDocumento: string = this.formulario.controls['tipoDocumentoForm'].value.trim();
    const numeroDocumento: string = this.formulario.controls['numeroDocumentoForm'].value.trim();

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
          this.addPersona(tipoDocumento,
            datosPersona.prenombres ,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion,
            datosPersona.ubigeo);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    } else if (tipoDocumento === '02') {//CARNÉ DE EXTRANJERÍA
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
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }
  }
  addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, ubigeo: string) {
    this.vUbigeo = ubigeo.split("/", 3);
    this.varUbigeo =this.vUbigeo;

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formulario.controls['ap_paternoForm'].setValue(ap_paterno);
        this.formulario.controls['ap_maternoForm'].setValue(ap_materno);
        this.formulario.controls['nombreForm'].setValue(nombres);
        this.formulario.controls['direccionForm'].setValue(direccion);
        this.formulario.controls['distritoForm'].setValue(this.varUbigeo[2]);
        this.formulario.controls['provinciaForm'].setValue(this.varUbigeo[1]);
        this.formulario.controls['departamentoForm'].setValue(this.varUbigeo[0]);
      });
  }
  addPersonaSin(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, ubigeo: string) {
    this.vUbigeo = ubigeo.split("/", 3);
    this.varUbigeo =this.vUbigeo;

    this.formulario.controls['ap_paternoForm'].setValue(ap_paterno);
    this.formulario.controls['ap_maternoForm'].setValue(ap_materno);
    this.formulario.controls['nombreForm'].setValue(nombres);
    this.formulario.controls['direccionForm'].setValue(direccion);
    this.formulario.controls['distritoForm'].setValue(this.varUbigeo[2]);
    this.formulario.controls['provinciaForm'].setValue(this.varUbigeo[1]);
    this.formulario.controls['departamentoForm'].setValue(this.varUbigeo[0]);

  }
  guardarFormulario001a12(){
    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    let dataGuardar: Formulario001A12Request = new Formulario001A12Request();
           //-------------------------------------
    dataGuardar.id = this.idForm;
    dataGuardar.formularioId = 1;
    dataGuardar.codigo = 'E';
    dataGuardar.codUsuario = "USER001";
    dataGuardar.idTramiteReq = this.dataInput.tramiteReqId;
    // dataGuardar.usuarioCreacion = "MYUSER";
    // dataGuardar.ipCreacion = "192.168.1.1";
    //-------------------------------------


    let datosSolicitante: DatosSolicitante = new DatosSolicitante();

    datosSolicitante.apellidoPaterno = this.formulario.controls['ap_paternoForm'].value;
    datosSolicitante.apellidoMaterno = this.formulario.controls['ap_maternoForm'].value;
    datosSolicitante.nombres = this.formulario.controls['nombreForm'].value;
    datosSolicitante.domicilio = this.formulario.controls['direccionForm'].value;
    // datosSolicitante.tipoDocumento.id = this.formulario.controls['tipoDocumentoForm'].value;
    datosSolicitante.tipoDocumento.id = this.tipoPersona.toString();
    // datosSolicitante.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id ==  this.formulario.get('tipoDocumentoForm').value)[0].documento;
    datosSolicitante.numeroDocumento = this.formulario.controls['numeroDocumentoForm'].value;
    datosSolicitante.distrito = this.formulario.controls['distritoForm'].value;
    datosSolicitante.provincia = this.formulario.controls['provinciaForm'].value;
    datosSolicitante.departamento = this.formulario.controls['departamentoForm'].value;
    datosSolicitante.ruc = this.formulario.controls['rucForm'].value.trim();
    datosSolicitante.celular = this.formulario.controls['celularForm'].value;
    datosSolicitante.correoElectronico = this.formulario.controls['correoForm'].value;
    //console.log("MARCADO ==> "+this.formulario.controls['marcadoObligatorioForm'].value);

    //datosSolicitante.marcadoObligatorio = true;
    datosSolicitante.peso = this.formulario.controls['pesoForm'].value;
    datosSolicitante.estatura = this.formulario.controls['estaturaForm'].value;
    datosSolicitante.colorOjos = this.formulario.controls['c_ojosForm'].value;
    datosSolicitante.colorCabellos = this.formulario.controls['c_cabelloForm'].value;
    datosSolicitante.nacionalidad = this.formulario.controls['nacionalidadForm'].value;
    datosSolicitante.fechaNacimiento = this.fechaNacimiento;
    // this.formatFecha(this.formulario.controls['f_nacForm'].value);
    datosSolicitante.tipoLicencia.id = this.formulario.controls['licenciaForm'].value;
    if(this.formulario.controls['licenciaForm'].value!==''){
      datosSolicitante.tipoLicencia.descripcion = this.listaLicencias.filter(item => item.id ==  this.formulario.get('licenciaForm').value)[0].descripcion;
    }

    datosSolicitante.nroLicencia = this.formulario.controls['n_licenciaForm'].value;

    let servicioSolicitado: ServicioSolicitado = new ServicioSolicitado();

    servicioSolicitado.codigoProcedimientoTupa = this.codigoProcedimientoTupa
    servicioSolicitado.descProcedimientoTupa = this.descProcedimientoTupa
    servicioSolicitado.descFlg = this.formulario.controls['descFlgForm'].value;
    servicioSolicitado.especificacionRequerida = this.formulario.controls['especRequeridaForm'].value;

    let declaracionJurada: DeclaracionJurada = new DeclaracionJurada();
    declaracionJurada.flgAutorizacion = 0;

    let derechoTramite: Tramite = new Tramite();
    derechoTramite.nroReciboAcotacion = "";

    derechoTramite.nroOperacionBancoNacion = "";
    derechoTramite.fechaDePago = null;

    dataGuardar.metaData.datosSolicitante = datosSolicitante;
    dataGuardar.metaData.servicioSolicitado = servicioSolicitado;
    dataGuardar.metaData.declaracionJurada = declaracionJurada;
    dataGuardar.metaData.derechoTramite = derechoTramite;

    console.log(dataGuardar);
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idForm === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idForm === 0) {
          //GUARDAR:
          this.formService.post<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                console.log(data)
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
          this.formService.put<any>(dataGuardarFormData)
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
  onDateSelectFechaNac(event){
    console.log(event);
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaNacimiento = finalDate;
  }

  onDateSelectPago(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaPago = finalDate;
  }

  descargarPdf() {
    if (this.idForm === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      //this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001-A/12";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }
  formatFecha(fecha: any) {
    let myDate = new Date(fecha.year, fecha.month-1, fecha.day);
    return myDate;
  }
  formInvalid(control: string) {
    return this.formulario.get(control).invalid &&
      (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }
}
