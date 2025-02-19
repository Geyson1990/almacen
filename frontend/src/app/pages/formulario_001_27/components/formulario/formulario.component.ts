import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbNavChangeEvent, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { ReniecService } from '../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../core/services/servicios/extranjeria.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { DatosSolicitante,  ServicioSolicitado, DeclaracionJurada ,HabilitacionProfesional } from '../../../../core/models/Formularios/Formulario001_27/Secciones';
import { Formulario00127Service } from '../../../../core/services/formularios/formulario001-27.service ';
import { Formulario001_27Request } from '../../../../core/models/Formularios/Formulario001_27/Formulario001_27Request';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { Formulario001_27Response } from '../../../../core/models/Formularios/Formulario001_27/Formulario001_27Response';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { FormularioTramiteService } from '../../../../core/services/tramite/formulario-tramite.service';
import { ListaAeronave, OficinaRegistral } from '../../../../core/models/Formularios/Formulario002_b12/Secciones';
import { SunatService } from '../../../../core/services/servicios/sunat.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)



  active = 1;
  disabled: boolean = true;
  fileToUpload: File;
  idForm: number = 0;
  FilaAfectada: number;
  //ruc:string;
  formulario: UntypedFormGroup;
  //Datos Generales
  idFormularioMovimiento: number = 0;
  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;

  datos: any = {};
  tipoDocumento: TipoDocumentoModel;

  datosRepresentante: string[] = [];
  oficinasRegistral: any = [];
  nombres: string;
  ap_paterno: string;
  ap_materno: string;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  buttonMarcadoObligatorio: boolean;
  marcado: number = 0;

  filePdfCroquisSeleccionado: any = null;

  // listaTiposDocumentos: TipoDocumentoModel[] = [
  //   { id: "01", documento: 'DNI' },
  //   { id: "02", documento: 'Carnet de Extranjería' },
  //   { id: "03", documento: 'Carnet de Identidad' },
  //   { id: "04", documento: 'RUC' },
  //   { id: "05", documento: 'Cédula de indentidad' },
  //   { id: "06", documento: 'Carnet de Identidad' },
  //   { id: "07", documento: 'OTROS' }
  // ];

  // listaOficinaRegistraL : OficinaRegistral[] =[
  //   { id: 1, descripcion: 'LIMA' },
  //   { id: 2, descripcion: 'TARAPOTO' },
  // ] ;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private formularioService: Formulario00127Service,
    private reniecService: ReniecService,
    private sunatService: SunatService,
    private modalService: NgbModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    private formularioTramiteService: FormularioTramiteService,
    private extranjeriaService: ExtranjeriaService,
    public tramiteService: TramiteService,
    private _oficinaRegistral: OficinaRegistralService,
    ) { }

  ngOnInit(): void {
     this.uriArchivo = this.dataInput.rutaDocumento;

    this.formulario = this.fb.group({
     //S1
      tipoPersonaForm: this.fb.control('',[Validators.required]),
      tipoDocumentoForm: this.fb.control('',[Validators.required]),
      numeroDocumentoForm: this.fb.control('',[Validators.required]),
      nombresApellidosRazonSocialForm: this.fb.control('', [Validators.required]),
      telefonoForm: this.fb.control(''),
      celularForm: this.fb.control('',[Validators.required]),
      correoElectronicoForm: this.fb.control('',[Validators.required]),
      domicilioLegalForm: this.fb.control('',[Validators.required]),
      distritoForm: this.fb.control('',[Validators.required]),
      provinciaForm: this.fb.control('', [Validators.required]),
      departamentoForm: this.fb.control('', [Validators.required]),
      autorizacionForm:this.fb.control('', [Validators.required]),
      tipoDocumentoRepresentanteForm:this.fb.control('', [Validators.required]),
      numeroDocumentoRepresentanteForm: this.fb.control('', [Validators.required]),
      apellidosyNombresRepresentanteForm:this.fb.control('', [Validators.required]),
      direccionRepresentanteForm: this.fb.control(''),
      poderRegistradoForm: this.fb.control(''),
      asientoForm: this.fb.control(''),
      oficinaRegistralForm: this.fb.control(0),
      //S2
      numeroColegiaturaForm: this.fb.control(''),
      colegioProfesionalForm: this.fb.control(''),
      //S3
      s3_servicioCodigo: this.fb.control(''),
     //s4

    s4_apellidosNombresDeclaracionForm: this.fb.control(''),
    s4_numeroDocumentodeclaracionForm: this.fb.control(''),
    s4_tipoDocumentoDeclaracionForm: this.fb.control(''),
    s4_autorizacionDeclaracionForm: this.fb.control(''),

    });
   this.codigoProcedimientoTupa= localStorage.getItem('tupa-codigo');
   this.descProcedimientoTupa = localStorage.getItem('tupa-nombre');
   this.traerDatos();
   this.cargarDatos();
   this.cargarOficinaRegistral();
  }
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "02", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' },
    { id: "04", documento: 'RUC' }
  ];
  // listaOficinaRegistral : OficinaRegistral[] =[
  //   { id: 1, descripcion: 'LIMA' },
  //   { id: 2, descripcion: 'TARAPOTO' },
  // ] ;

  tupaId:number;
  codigoTupa: String;
  descripcionTupa: String;
  tramiteReqId: number = 0;

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

  traerDatos() {
    // this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    // this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login
    // this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    // //this.ruc = this.seguridadService.getCompanyCode();
    //  this.ruc = '20341841357';

    // this.formulario.controls['tipoDocumentoForm'].setValue("01");
    // this.formulario.controls['numeroDocumentoForm'].setValue(this.nroDocumentoLogin);

    //-----------------
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login
    this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.ruc = this.seguridadService.getCompanyCode();
    // console.log('RUC obtenido token'  + this.ruc);
    // console.log('this.tipoDocumentoLogin'  + this.tipoDocumentoLogin);
    // console.log('this.seguridadService.getNumDoc()'  + this.seguridadService.getNumDoc());
    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersonaLogin = 'PERSONA NATURAL';
      this.datos.tipo_solicitante = 'PN';
      this.formulario.controls['tipoPersonaForm'].setValue('PERSONA NATURAL');

      this.formulario.controls['tipoDocumentoForm'].setValue("01");
      this.formulario.controls['numeroDocumentoForm'].setValue(this.nroDocumentoLogin);
      this.formulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);


    }
     else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersonaLogin = 'PERSONA JURIDICA';
      this.datos.tipo_solicitante = 'PJ';

      this.formulario.controls['tipoPersonaForm'].setValue('PERSONA JURIDICA');

      this.formulario.controls['tipoDocumentoForm'].setValue("04");
      this.formulario.controls['numeroDocumentoForm'].setValue(this.ruc);
      this.formulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);

      //this.formulario.controls['nombres'].setValue(this.razonsocial);
      } else {
      this.tipoPersonaLogin = 'PERSONA NATURAL CON RUC';
      this.datos.tipo_solicitante = 'PN';
      this.formulario.controls['tipo_solicitante'].setValue('PERSONA NATURAL CON RUC');
      this.formulario.controls['doc_identidad'].setValue('01');

    }


    this.tupaId = Number(localStorage.getItem('tupa-id'));
    this.codigoTupa = localStorage.getItem('tupa-codigo');    //'DSTT-033'
    this.descripcionTupa = localStorage.getItem('tupa-nombre');


    if (this.tupaId === 1001) {
      this.datos.check_dstt033 = 1;

      this.formulario.get("s3_servicioCodigo").setValue('DGPPC-001');
    }


  }
  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  getMaxLengthNumeroDocumentoDeclaracion(){
    let v_tipoDocumento: string;
    v_tipoDocumento='00';

    if (this.formulario.controls['s4_numeroDocumentodeclaracionForm'].value!="" && this.formulario.controls['s4_numeroDocumentodeclaracionForm'].value!= null )
    {
      v_tipoDocumento=this.formulario.controls['s4_numeroDocumentodeclaracionForm'].value.trim();

    }

    const tipoDocumento: string = v_tipoDocumento;

    if (tipoDocumento === '01')//N° de DNI

      return 8;
    else if (tipoDocumento === '02')//Carnet de extranjería
      return 12;
    else if (tipoDocumento === '03')//Carnet de Identidad o Cédula de Identidad
    return 12;
    return 0
  }
  getMaxLengthNumeroDocumentoRepresentanteForm() {
    let v_tipoDocumento: string;
    v_tipoDocumento='00';

    if (this.formulario.controls['numeroDocumentoRepresentanteForm'].value!="" && this.formulario.controls['numeroDocumentoRepresentanteForm'].value!= null )
    {
      v_tipoDocumento=this.formulario.controls['numeroDocumentoRepresentanteForm'].value.trim();
    }
    const tipoDocumento: string = v_tipoDocumento;

    if (tipoDocumento === '01')//N° de DNI

      return 8;
    else if (tipoDocumento === '02')//Carnet de extranjería
      return 12;
    else if (tipoDocumento === '03')//Carnet de Identidad o Cédula de Identidad
    return 12;
    return 0
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

    // this.formulario.controls['datosForm'].setValue('');
    // this.formulario.controls['ap_paternoForm'].setValue('');
    // this.formulario.controls['ap_maternoForm'].setValue('');
  }
  buscarNumeroDocumento() {

    const tipoDocumento: string = this.formulario.controls['tipoDocumentoRepresentanteForm'].value.trim();
    const numeroDocumento: string = this.formulario.controls['numeroDocumentoRepresentanteForm'].value.trim();

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
            return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);


          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          this.addPersona(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion);
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

            // const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            this.addPersona(tipoDocumento,
              respuesta.CarnetExtranjeria.nombres,
              respuesta.CarnetExtranjeria.primerApellido,
              respuesta.CarnetExtranjeria.segundoApellido,
              '');

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }else if (tipoDocumento === '03')
    {//CARNET DE IDENTIDAD O CEDÚLA DE INDENITDAD
      // this.extranjeriaService.getCE(numeroDocumento).subscribe(
      //   respuesta => {
      //     this.funcionesMtcService.ocultarCargando();

      //     if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
      //       return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');


      //   },
      //   error => {
      //     this.funcionesMtcService
      //       .ocultarCargando()
      //       .mensajeError('Error al consultar al servicio');
      //   }
      // );
    }

  }
  buscarNumeroDocumentoDeclaracion() {

    const tipoDocumento: string = this.formulario.controls['s4_tipoDocumentoDeclaracionForm'].value.trim();
    const numeroDocumento: string = this.formulario.controls['s4_numeroDocumentodeclaracionForm'].value.trim();

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
            return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          this.addPersonaDeclaracion(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion);
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

            // const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            this.addPersona(tipoDocumento,
              respuesta.CarnetExtranjeria.nombres,
              respuesta.CarnetExtranjeria.primerApellido,
              respuesta.CarnetExtranjeria.segundoApellido,
              '');

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }else if (tipoDocumento === '03')
    {//CARNET DE IDENTIDAD O CEDÚLA DE INDENITDAD
      // this.extranjeriaService.getCE(numeroDocumento).subscribe(
      //   respuesta => {
      //     this.funcionesMtcService.ocultarCargando();

      //     if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
      //       return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');


      //   },
      //   error => {
      //     this.funcionesMtcService
      //       .ocultarCargando()
      //       .mensajeError('Error al consultar al servicio');
      //   }
      // );
    }

  }
  cargarDatos(){
    setTimeout(() => {

        if (this.dataInput.rutaDocumento) {
          this.funcionesMtcService.mostrarCargando();
          //RECUPERAMOS LOS DATOS
          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario001_27Response) => {
              this.funcionesMtcService.ocultarCargando();
              const metaData: any = JSON.parse(dataFormulario.metaData);

              this.idForm = dataFormulario.formularioId;
              console.log("Entro a carga de Datos")
              // console.log(JSON.stringify(dataFormulario, null, 10));
              console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));


              this.formulario.get("tipoPersonaForm").setValue(metaData.DatosSolicitante.TipoPersona);
              this.formulario.get("tipoDocumentoForm").setValue(metaData.DatosSolicitante.TipoDocumento.id);
              this.formulario.get("numeroDocumentoForm").setValue(metaData.DatosSolicitante.NumeroDocumento);
              this.formulario.get("nombresApellidosRazonSocialForm").setValue(metaData.DatosSolicitante.NombresApellidosRazonSocial);
              this.formulario.get("telefonoForm").setValue(metaData.DatosSolicitante.Telefono);
              this.formulario.get("celularForm").setValue(metaData.DatosSolicitante.Celular);
              this.formulario.get("correoElectronicoForm").setValue(metaData.DatosSolicitante.CorreoElectronico);
              this.formulario.get("domicilioLegalForm").setValue(metaData.DatosSolicitante.DomicilioLegal);

              this.formulario.get("distritoForm").setValue(metaData.DatosSolicitante.Distrito);
              this.formulario.get("provinciaForm").setValue(metaData.DatosSolicitante.Provincia);
              this.formulario.get("departamentoForm").setValue(metaData.DatosSolicitante.Departamento);

              this.formulario.get("autorizacionForm").setValue(metaData.DatosSolicitante.Autorizacion);
              this.formulario.get("tipoDocumentoRepresentanteForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.TipoDocumento.Id);
              this.formulario.get("numeroDocumentoRepresentanteForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.NumeroDocumentoRepresentante);
              this.formulario.get("apellidosyNombresRepresentanteForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.ApellidosyNombresRepresentante);
              this.formulario.get("direccionRepresentanteForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.DireccionRepresentante);
              this.formulario.get("poderRegistradoForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.PoderRegistrado);
              this.formulario.get("asientoForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.Asiento);
              this.formulario.get("oficinaRegistralForm").setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.Id);

              this.formulario.get("numeroColegiaturaForm").setValue(metaData.HabilitacionProfesional.NumeroColegiatura);
              this.formulario.get("colegioProfesionalForm").setValue(metaData.HabilitacionProfesional.ColegioPrifesional);

              this.formulario.get("s3_servicioCodigo").setValue('DGPPC-001');

              this.formulario.get("s4_apellidosNombresDeclaracionForm").setValue(metaData.DeclaracionJurada.ApellidosNombresDeclaracion);
              this.formulario.get("s4_numeroDocumentodeclaracionForm").setValue(metaData.DeclaracionJurada.NumeroDocumentodeclaracion);
              this.formulario.get("s4_tipoDocumentoDeclaracionForm").setValue(metaData.DeclaracionJurada.TipoDocumentoDeclaracion.Id);
              this.formulario.get("s4_autorizacionDeclaracionForm").setValue(metaData.DeclaracionJurada.AutorizacionDeclaracion);




          }
          ,
              error => {
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
              });

        }else{
          this.recuperarDatosSunat();
        }
  });
}
  onChangeInputCroquis(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfCroquisSeleccionado = event.target.files[0];
    event.target.value = "";
  }
  vistaPreviaPdfCroquis() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfCroquisSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Documento";
  };

  onChangeMarcado(event) {

    this.buttonMarcadoObligatorio =this.formulario.controls['autorizacionForm'].value;

    if ( this.buttonMarcadoObligatorio ){

      this.marcado = 1;

    }
  }

  addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string) {

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        // this.formulario.controls['datosForm'].setValue();
        // this.formulario.controls['ap_paternoForm'].setValue();
        this.formulario.controls['apellidosyNombresRepresentanteForm'].setValue(nombres +' '+ ap_paterno + ' ' + ap_materno ) ;
        this.formulario.controls['direccionRepresentanteForm'].setValue(direccion);
      });
  }
  addPersonaDeclaracion(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string) {

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        // this.formulario.controls['datosForm'].setValue();
        // this.formulario.controls['ap_paternoForm'].setValue();
        this.formulario.controls['s4_apellidosNombresDeclaracionForm'].setValue(nombres +' '+ ap_paterno + ' ' + ap_materno ) ;
        // this.formulario.controls['direccionRepresentanteform'].setValue(direccion);
      });
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001/27";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );


  }

  guardarFormulario0127() {


    let dataGuardar: Formulario001_27Request = new Formulario001_27Request();
    //-------------------------------------
    dataGuardar.id = this.idForm;
    dataGuardar.codigo = 'A';
    dataGuardar.formularioId = 1;
    dataGuardar.estado = 1;
    dataGuardar.codUsuario = "USER001";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // dataGuardar.usuarioCreacion = "MYUSER";
    // dataGuardar.ipCreacion = "192.168.1.1";
    //-------------------------------------

    let datosSolicitante: DatosSolicitante = new DatosSolicitante();
    datosSolicitante.telefono = this.formulario.controls['telefonoForm'].value;
    datosSolicitante.celular = this.formulario.controls['celularForm'].value;
    datosSolicitante.correoElectronico = this.formulario.controls['correoElectronicoForm'].value;
    datosSolicitante.departamento = this.formulario.controls['departamentoForm'].value;
    datosSolicitante.distrito = this.formulario.controls['distritoForm'].value;
    datosSolicitante.provincia = this.formulario.controls['provinciaForm'].value;
    datosSolicitante.tipoDocumento.id = this.formulario.controls['tipoDocumentoForm'].value;
    datosSolicitante.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id ==  this.formulario.get('tipoDocumentoForm').value)[0].documento;

    datosSolicitante.tipoPersona = this.formulario.controls['tipoPersonaForm'].value;
    datosSolicitante.autorizacion = this.formulario.controls['autorizacionForm'].value;
    datosSolicitante.nombresApellidosRazonSocial = this.formulario.controls['nombresApellidosRazonSocialForm'].value;
    datosSolicitante.domicilioLegal = this.formulario.controls['domicilioLegalForm'].value;
    datosSolicitante.numeroDocumento = this.formulario.controls['numeroDocumentoForm'].value;




    datosSolicitante.representanteLegal.apellidosyNombresRepresentante = this.formulario.controls['apellidosyNombresRepresentanteForm'].value;



    datosSolicitante.representanteLegal.asiento =  this.formulario.controls['asientoForm'].value;
    // datosSolicitante.representanteLegal.oficinaRegistral = this.formulario.controls['oficinaRegistralForm'].value;
    datosSolicitante.representanteLegal.direccionRepresentante  = this.formulario.controls['direccionRepresentanteForm'].value;
    datosSolicitante.representanteLegal.numeroDocumentoRepresentante= this.formulario.controls['numeroDocumentoRepresentanteForm'].value;
    if(this.formulario.get('tipoDocumentoRepresentanteForm').value!="" && this.formulario.get('tipoDocumentoRepresentanteForm').value!= null)
    {
      datosSolicitante.representanteLegal.tipoDocumento.documento= this.listaTiposDocumentos.filter(item => item.id ==  this.formulario.get('tipoDocumentoRepresentanteForm').value)[0].documento;

    }

    datosSolicitante.representanteLegal.tipoDocumento.id = this.formulario.controls['tipoDocumentoRepresentanteForm'].value;

   // datosSolicitante.representanteLegal.oficinaRegistral = this.formulario.controls['oficinaRegistralForm'].value;
    datosSolicitante.representanteLegal.poderRegistrado = this.formulario.controls['poderRegistradoForm'].value;
    datosSolicitante.representanteLegal.oficinaRegistral.id =  this.formulario.controls['oficinaRegistralForm'].value;
    if (this.formulario.get('oficinaRegistralForm').value!="" && this.formulario.get('oficinaRegistralForm').value!= null)
    {
      datosSolicitante.representanteLegal.oficinaRegistral.descripcion = this.oficinasRegistral.filter(item => item.value == this.formulario.get('oficinaRegistralForm').value)[0].text;

    }


    // datosSolicitante.representanteLegal.tipoDocumentoRepresentante = this.formulario.controls['poderRegistradoForm'].value;
    // // datosSolicitante.representanteLegal.oficinaRegistral.id = this.formulario.controls['oficinaRegistralForm'].value;
    // datosSolicitante.representanteLegal.oficinaRegistral.descripcion  =  this.listaOficinaRegistraL.filter(item => item.id ==  this.formulario.get('oficinaRegistralForm').value)[0].descripcion;


    let servicioSolicitado: ServicioSolicitado = new ServicioSolicitado();
    servicioSolicitado.codigoProcedimientoTupa = this.formulario.controls['s3_servicioCodigo'].value;//this.codigoProcedimientoTupa;
    servicioSolicitado.descProcedimientoTupa = 'Concesión Única para la prestación de servicios públicos de telecomunicaciones sin asignación de espectro radioeléctrico.';

    let declaracionJurada: DeclaracionJurada = new DeclaracionJurada();

   // declaracionJurada.flgAutorizacion = this.formulario.controls['s4_autorizacionDeclaracionForm'].value;
     declaracionJurada.autorizacionDeclaracion= this.formulario.controls['s4_autorizacionDeclaracionForm'].value;
    declaracionJurada.apellidosNombresDeclaracion = this.formulario.controls['s4_apellidosNombresDeclaracionForm'].value;
    if(this.formulario.get('s4_tipoDocumentoDeclaracionForm').value!="" && this.formulario.get('s4_tipoDocumentoDeclaracionForm').value!= null)
    {

      declaracionJurada.tipoDocumentoDeclaracion.documento= this.listaTiposDocumentos.filter(item => item.id ==  this.formulario.get('s4_tipoDocumentoDeclaracionForm').value)[0].documento;
    }

    declaracionJurada.tipoDocumentoDeclaracion.id= this.formulario.controls['s4_tipoDocumentoDeclaracionForm'].value;
    declaracionJurada.numeroDocumentodeclaracion= this.formulario.controls['s4_numeroDocumentodeclaracionForm'].value;


    let habilidadProfesional: HabilitacionProfesional = new HabilitacionProfesional();

    habilidadProfesional.colegioPrifesional = this.formulario.controls['colegioProfesionalForm'].value;
    habilidadProfesional.numeroColegiatura = this.formulario.controls['numeroColegiaturaForm'].value;


  // });


    dataGuardar.metaData.datosSolicitante = datosSolicitante;
    dataGuardar.metaData.archivoAdjunto =this.filePdfCroquisSeleccionado;
    dataGuardar.metaData.servicioSolicitado =  servicioSolicitado;
    dataGuardar.metaData.declaracionJurada =  declaracionJurada;
    dataGuardar.metaData.habilitacionProfesional =  habilidadProfesional;
    //dataGuardar.metaData.declaracionJurada = declaracionJurada;

   // console.log(dataGuardar);

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
             this.idFormularioMovimiento = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;

            //  this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente (idFormularioMovimiento = ${this.idFormularioMovimiento})`);
             this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
           },
           error => {
             this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
           }
         );


          // //MODIFICAR
          // console.log(dataGuardarFormData);
          // this.formularioService.put<any>(dataGuardarFormData)
          //   .subscribe(
          //     data => {
          //       this.funcionesMtcService.ocultarCargando();
          //       this.idForm = data.id;
          //       this.uriArchivo = data.uriArchivo;

          //       const listaRequisitos: any= JSON.parse(localStorage.getItem("listaRequisitos"));

          //       console.log(listaRequisitos);

          //       for (const data of listaRequisitos) {

          //         if(data.movId > 0 && data.tramiteReqRefId > 0){

          //           this.formularioTramiteService.uriArchivo<any>(data.movId, data.tramiteReqRefId)
          //             .subscribe(
          //                 dataDelete => {
          //                   this.funcionesMtcService.ocultarCargando();

          //                   this.FilaAfectada = dataDelete.rows;

          //                   // this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
          //                 },
          //                 error => {
          //                   this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el delete');
          //                 }
          //               );
          //         }

          //       }




          //       this.graboUsuario = true;

          //       this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
          //     },
          //     error => {
          //       this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
          //     }
          //   );

        }

      });
  }




  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  recuperarDatosSunat() {

if (this.ruc!="" )
{
  this.funcionesMtcService.mostrarCargando();

    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
        respuesta => {

          this.funcionesMtcService.ocultarCargando();

          const datos = respuesta;

          console.log(JSON.stringify(datos, null, 10));

          //console.log(JSON.stringify(datos, null, 10));


          this.formulario.controls['nombresApellidosRazonSocialForm'].setValue(datos.razonSocial);
          this.formulario.controls['domicilioLegalForm'].setValue(datos.domicilioLegal);
          this.formulario.controls['distritoForm'].setValue(datos.nombreDistrito);
          this.formulario.controls['provinciaForm'].setValue(datos.nombreProvincia);
          this.formulario.controls['departamentoForm'].setValue(datos.nombreDepartamento);


          this.formulario.controls['correoElectronicoForm'].setValue(datos.correo);
          this.formulario.controls['telefonoForm'].setValue(datos.telefono);
          this.formulario.controls['celularForm'].setValue(datos.celular);
          //Representante Legal

          this.formulario.controls['tipoDocumentoRepresentanteForm'].setValue("0" + datos.representanteLegal[0].tipoDocumento);

          this.formulario.controls['numeroDocumentoRepresentanteForm'].setValue(datos.representanteLegal[0].nroDocumento);
          this.formulario.controls['numeroDocumentoRepresentanteForm'].setValue(datos.representanteLegal[0].nroDocumento);
          this.formulario.controls['apellidosyNombresRepresentanteForm'].setValue(datos.representanteLegal[0].nombresApellidos);


        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio de Sunat');
        }
      );
}


  }

  formInvalid(control: string) {
    // return this.formulario.get(control).invalid &&
    //   (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }
}
