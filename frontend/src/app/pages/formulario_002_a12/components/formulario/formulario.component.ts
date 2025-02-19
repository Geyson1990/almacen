import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Formulario002A12Request } from 'src/app/core/models/Formularios/Formulario002_a12/Formulario002-a12Request';
import { Formulario002A12Service } from 'src/app/core/services/formularios/formulario002-a12.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TipoPersona, DatosSolicitante, ServicioSolicitado, OficinaRegistral, DeclaracionJurada } from '../../../../core/models/Formularios/Formulario002_a12/Secciones';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { ReniecService } from '../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../core/services/servicios/extranjeria.service';
import { Tramite } from '../../../../core/models/Tramite';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TramiteService } from '../../../../core/services/tramite/tramite.service';
import { SunatService } from '../../../../core/services/servicios/sunat.service';
import { FormularioTramiteService } from '../../../../core/services/tramite/formulario-tramite.service';
import { Formulario002A12Response } from 'src/app/core/models/Formularios/Formulario002_a12/Formulario002-a12Response';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';

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
  form: UntypedFormGroup;
  activarN    : boolean  = false;
  activarJ   : boolean  = false;
  vUbigeo: string[] = [];
  dtPersona: string[] = [];
  disabled: boolean = true;
  esRepresentante: boolean = false;

  // formulario: Formulario002_A12;
  // metadata: MetaData;
  // datosSolicitante: DatosSolicitante;
  // declaracionJurada: DeclaracionJurada;
  // derechoTramite : DerechoTramite;
  ocultar : boolean = true;
  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  dni: string;
  tipoPersona: number;
  descTipoPersona: string;
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  esGratuito: boolean = false;
  fechaPago: string;
  tramiteId: number;

  nroRecibo = '';
  nroOperacion = '';

  selectedDateFechaPago: NgbDateStruct = undefined;

  representanteLegal: RepresentanteLegal[] = [];

  @ViewChild('acc') acc: NgbAccordionDirective ;
  listaTipoPersona: TipoPersona[] = [
    { id: 1, descripcion: 'PERSONA NATURAL' },
    { id: 2, descripcion: 'PERSONA JURÍDICA' }
  ];
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' },
    // { id: "04", documento: 'RUC' }
  ];
  // listaOficinaRegistral : OficinaRegistral[] =[
  //   { id: 1, descripcion: 'LIMA' },
  //   { id: 2, descripcion: 'TARAPOTO' },
  // ] ;
  listaOficinaRegistral : any = [];


  constructor(public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioService: Formulario002A12Service,
    private seguridadService: SeguridadService,
    private modalService: NgbModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public tramiteService: TramiteService,
    private sunatService: SunatService,
    private formularioTramiteService: FormularioTramiteService,
    private _oficinaRegistral: OficinaRegistralService
  ) {

  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.form = this.fb.group({

      // tipoPersonaForm:  this.fb.control('', [Validators.required]),
      // tipoDocumentoForm: this.fb.control('', [Validators.required]),
      numeroDocumentoForm: this.fb.control('', [Validators.required]),
      datoSolicitante: this.fb.control('', [Validators.required]),
      domicilio: this.fb.control(''),
      distrito: this.fb.control('', [Validators.required]),
      provincia: this.fb.control('', [Validators.required]),
      departamento: this.fb.control('', [Validators.required]),
      telefonoFax: this.fb.control(''),
      celular: this.fb.control('', [Validators.required]),
      correoElectronico: this.fb.control('', [Validators.email]),
      marcadoObligatorio: this.fb.control(true),
      tpDocRepresentanteForm: this.fb.control('', [Validators.required]),
      nroDocRepresentanteForm: this.fb.control('', [Validators.required]),
      nombresRepreLegal: this.fb.control('',[Validators.required]),
      apellidoPaternoRepreLegal: this.fb.control('',[Validators.required]),
      apellidoMaternoRepreLegal: this.fb.control('',[Validators.required]),
      domicilioRepreLegal: this.fb.control('',[Validators.required]),
      partidaNumero: this.fb.control('',[Validators.required]),
      oficinaRegistral: this.fb.control('',[Validators.required]),
      /*numeroRecibo: this.fb.control(''),
      numeroOperacion: this.fb.control(''),
      fechaPago: this.fb.control(null),*/
      autorizacionForm: this.fb.control('0')

    });
    this.cargarOficinaRegistral();
    if(this.seguridadService.getNameId() === '00001'){
      //persona natural
        this.tipoPersona = 1;
        this.dni = this.seguridadService.getNumDoc();
        this.form.controls['numeroDocumentoForm'].setValue(this.dni);
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.ruc = this.seguridadService.getCompanyCode();
        this.form.controls['numeroDocumentoForm'].setValue(this.ruc);
    }else {
        //persona natural con ruc
        this.tipoPersona = 5;
        this.dni = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.form.controls['numeroDocumentoForm'].setValue(this.ruc);
    }

    // this.valoresTupa();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.esGratuito = tramiteSelected.esGratuito;

    //this.validarPago();
    this.recuperarInformacion();
    setTimeout(() => {
      this.acc.expand('ngb-form-002-a-12-d');
  });

  }
  valoresTupa(){
    this.tramiteService.getTramite(this.dataInput.tramiteId, '').subscribe((resp: any) => {
      console.log(JSON.stringify(resp, null, 10));
      this.codigoProcedimientoTupa = resp.tupaCodigo;
      this.descProcedimientoTupa = resp.tupaNombre;

    });
  }
  cargarOficinaRegistral(){
    this._oficinaRegistral.oficinaRegistral().subscribe(

      (dataOficinaRegistral) => {
         console.log(dataOficinaRegistral);
        this.listaOficinaRegistral = dataOficinaRegistral;
        this.funcionesMtcService.ocultarCargando();


    },

        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
        });
  }

  validarPago(){
    if(!this.esGratuito){
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

                this.form.controls['numeroRecibo'].setValue(this.nroRecibo);
                this.form.controls['numeroOperacion'].setValue(this.nroOperacion);

                //cargar la fecha si es un nuevo registro

                const fechaPago = this.fechaPago.split("-");

                this.selectedDateFechaPago = {
                    day: parseInt(fechaPago[2]),
                    month: parseInt(fechaPago[1]),
                    year: parseInt(fechaPago[0])
                };

                this.form.controls['fechaPago'].setValue(this.selectedDateFechaPago);

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
}

  activaTipoPersona(){
    const tipoPersona: string = this.form.controls['tipoPersonaForm'].value.trim();
    if(tipoPersona==='1'){
      this.activarN=true;
      this.activarJ=false;
    }else{
      this.activarJ=true;
      this.activarN=false;
    }
  }
  changeTipoDocumento() {
    this.form.controls['numeroDocumentoForm'].setValue('');
    this.inputNumeroDocumento();
    this.form.controls['datoSolicitante'].setValue('');
  }
  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

  }
  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.form.controls['tpDocRepresentanteForm'].value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    else if (tipoDocumento === '03')//Carnet de Identidad o Cédula de Identidad
    return 12;

    return 0
  }

  addPersona(tipoDocumento: string, nombres: string, apellidoPaterno: string,apellidoMaterno: string, direccion: string, ubigeo: string) {
    this.vUbigeo = ubigeo.split("/", 3);

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apellidoPaterno} ${apellidoMaterno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        // this.formulario.controls['ap_paternoForm'].setValue(ap_paterno);
        // this.formulario.controls['ap_maternoForm'].setValue(ap_materno);
        // this.formulario.controls['nombreForm'].setValue(nombres);

        this.form.controls['nombresRepreLegal'].setValue(nombres);
        this.form.controls['apellidoPaternoRepreLegal'].setValue(apellidoPaterno);
        this.form.controls['apellidoMaternoRepreLegal'].setValue(apellidoMaterno);
        this.form.controls['domicilioRepreLegal'].setValue(direccion);
        // this.form.controls['distrito'].setValue(this.vUbigeo[2]);
        // this.form.controls['provincia'].setValue(this.vUbigeo[1]);
        // this.form.controls['departamento'].setValue(this.vUbigeo[0]);
        // }else{
        //   this.form.controls['nombresApellidosRepreLegal'].setValue(datos);
        //   this.form.controls['domicilioRepreLegal'].setValue(direccion);
        // }
      });
  }
  changeTipoDocumentoNew() {
    const tipoDocumento: string = this.form.controls['tpDocRepresentanteForm'].value.trim();
    const apellMatRep =   this.form.controls['apellidoMaternoRepreLegal'];

    if(tipoDocumento ==='04'){

       this.disabled = false;
       apellMatRep.setValidators(null);
       apellMatRep.updateValueAndValidity();
    }else{
       apellMatRep.setValidators([Validators.required]);
       apellMatRep.updateValueAndValidity();
       this.disabled = true;
    }

    this.form.controls['nroDocRepresentanteForm'].setValue('');
    this.inputNumeroDocumento();
    this.form.controls['nombresRepreLegal'].setValue('');
    this.form.controls['apellidoPaternoRepreLegal'].setValue('');
    this.form.controls['apellidoMaternoRepreLegal'].setValue('');

  }
  buscarDocRepresentante(){

    const tipoDocumento: string = this.form.controls['tpDocRepresentanteForm'].value.trim();
    const numeroDocumento: string = this.form.controls['nroDocRepresentanteForm'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    const resultado = this.representanteLegal.find( representante =>  ('0'+representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );



      if (resultado) {//DNI
        this.esRepresentante = false;
        console.log("*****");

      }else{
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
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio');
          }
        );
      }else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA

        this.extranjeriaService.getCE(numeroDocumento).subscribe(
          (respuesta) => {
            this.funcionesMtcService.ocultarCargando();
            console.log(respuesta);
            if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

              this.addPersona(tipoDocumento,
                respuesta.CarnetExtranjeria.nombres,
                respuesta.CarnetExtranjeria.primerApellido,
                respuesta.CarnetExtranjeria.segundoApellido,
                '',
                '');
          },
          (error) => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
            this.form.controls["nombresRepreLegal"].enable();
            this.form.controls["apellidoPaternoRepreLegal"].enable();
            this.form.controls["apellidoMaternoRepreLegal"].enable();
          }
        );
      }

  }
  guardarFormulario(){

  if (this.form.invalid === true)
    return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

  let dataGuardar: Formulario002A12Request = new Formulario002A12Request();
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
  datosSolicitante.tipoPersona.id = this.tipoPersona
  if(this.tipoPersona==1){
    this.descTipoPersona = 'PERSONA NATURAL';
  }else if (this.tipoPersona==2){
    this.descTipoPersona = 'PERSONA JURÍDICA';
  }else{
    this.descTipoPersona = 'PERSONA NATURAL CON RUC';
  }
  datosSolicitante.tipoPersona.descripcion =   this.descTipoPersona;
  datosSolicitante.tipoDocumento.id = this.tipoPersona.toString();
  // datosSolicitante.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.form.get('tipoDocumentoForm').value)[0].documento;
  datosSolicitante.numeroDocumento = this.form.controls['numeroDocumentoForm'].value;
  datosSolicitante.nomRazNomCom = this.form.controls['datoSolicitante'].value;
  datosSolicitante.domicilio = this.form.controls.domicilio.value;
  datosSolicitante.distrito = this.form.controls.distrito.value;
  datosSolicitante.provincia = this.form.controls.provincia.value;
  datosSolicitante.departamento = this.form.controls['departamento'].value;
  datosSolicitante.telefonoFax = this.form.controls['telefonoFax'].value;
  datosSolicitante.celular = this.form.controls['celular'].value;
  datosSolicitante.correoElectronico = this.form.controls['correoElectronico'].value;
  datosSolicitante.marcadoObligatorio = this.form.controls['marcadoObligatorio'].value;

  datosSolicitante.representanteLegal.nombres = this.form.controls['nombresRepreLegal'].value;
  datosSolicitante.representanteLegal.apellidoPaterno = this.form.controls['apellidoPaternoRepreLegal'].value;
  datosSolicitante.representanteLegal.apellidoMaterno = this.form.controls['apellidoMaternoRepreLegal'].value;
  datosSolicitante.representanteLegal.tipoDocumento.id = this.form.controls['tpDocRepresentanteForm'].value;
  datosSolicitante.representanteLegal.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.form.get('tpDocRepresentanteForm').value)[0].documento;
  datosSolicitante.representanteLegal.numeroDocumento = this.form.controls['nroDocRepresentanteForm'].value;
  datosSolicitante.representanteLegal.domicilioRepresentanteLegal = this.form.controls['domicilioRepreLegal'].value;
  datosSolicitante.representanteLegal.nroPartida= this.form.controls['partidaNumero'].value;
  datosSolicitante.representanteLegal.oficinaRegistral.id =  this.form.controls['oficinaRegistral'].value;
  datosSolicitante.representanteLegal.oficinaRegistral.descripcion = this.listaOficinaRegistral.filter(item => item.value == this.form.get('oficinaRegistral').value)[0].text;


  let servicioSolicitado = new ServicioSolicitado();

  servicioSolicitado.codigoProcedimientoTupa = this.codigoProcedimientoTupa;
  servicioSolicitado.descProcedimientoTupa = this.descProcedimientoTupa;

  /*let derechoTramite = new Tramite()
  derechoTramite.nroReciboAcotacion = this.form.controls['numeroRecibo'].value;
  derechoTramite.nroOperacionBancoNacion = this.form.controls['numeroOperacion'].value;
  derechoTramite.fechaDePago =  '';*/

  let declaracionJurada: DeclaracionJurada = new DeclaracionJurada();
  declaracionJurada.flgAutorizacion = 0;


  dataGuardar.metaData.datosSolicitante = datosSolicitante;
  dataGuardar.metaData.servicioSolicitado = servicioSolicitado;
  dataGuardar.metaData.declaracionJurada = declaracionJurada;
  //dataGuardar.metaData.derechoTramite = derechoTramite;

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
              // this.form.id = data.id;
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
              // this.formulario.id = data.id;
              this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
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
      this.funcionesMtcService.mostrarCargando();
      //RECUPERAMOS LOS DATOS
      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataFormulario: Formulario002A12Response) => {
          this.funcionesMtcService.ocultarCargando();
          const metaData: any = JSON.parse(dataFormulario.metaData);


          this.idForm = dataFormulario.formularioId;

          // console.log(JSON.stringify(dataFormulario, null, 10));
          console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));



          this.form.get("numeroDocumentoForm").setValue(metaData.datosSolicitante.numeroDocumento);
          this.form.get("datoSolicitante").setValue(metaData.datosSolicitante.nomRazNomCom);
          this.form.get("domicilio").setValue(metaData.datosSolicitante.domicilio);
          this.form.get("distrito").setValue(metaData.datosSolicitante.distrito);
          this.form.get("provincia").setValue(metaData.datosSolicitante.provincia);
          this.form.get("departamento").setValue(metaData.datosSolicitante.departamento);
          this.form.get("telefonoFax").setValue(metaData.datosSolicitante.telefonoFax);
          this.form.get("celular").setValue(metaData.datosSolicitante.celular);
          this.form.get("correoElectronico").setValue(metaData.datosSolicitante.correoElectronico);

          this.form.get("marcadoObligatorio").setValue(metaData.datosSolicitante.marcadoObligatorio);


          this.form.get("tpDocRepresentanteForm").setValue('0'+(metaData.datosSolicitante.representanteLegal.tipoDocumento.id).toString());
          this.form.get("nroDocRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.numeroDocumento);
          this.form.get("nombresRepreLegal").setValue(metaData.datosSolicitante.representanteLegal.nombres);
          this.form.get("apellidoPaternoRepreLegal").setValue(metaData.datosSolicitante.representanteLegal.apellidoPaterno);

          this.form.get("apellidoMaternoRepreLegal").setValue(metaData.datosSolicitante.representanteLegal.apellidoMaterno);
          if(this.form.get("tpDocRepresentanteForm").value==='04'){

            const apellMatRep =   this.form.controls['apellidoMaternoRepreLegal'];
            this.disabled = false;
            setTimeout(() => {
              apellMatRep.setValidators(null);
              apellMatRep.updateValueAndValidity();
          });

          }
          this.form.get("domicilioRepreLegal").setValue(metaData.datosSolicitante.representanteLegal.domicilioRepresentanteLegal);
          // this.form.get("telefonoRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.telefonoFax);
          // this.form.get("celularRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.celularR);
          // this.form.get("itinerarioVuelo").setValue(metaData.servicioSolicitado.datosInspeccion.itinerarioVuelo);
          this.form.get("partidaNumero").setValue(metaData.datosSolicitante.representanteLegal.nroPartida);
          setTimeout(() => {
          this.form.get("oficinaRegistral").setValue(metaData.datosSolicitante.representanteLegal.oficinaRegistral.id);
        });
          // this.form.get("correoRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.correoElectronicoR);
          // this.form.get("especificacion").setValue(metaData.servicioSolicitado.especificacionRequerida);


          // for (var i = 0; i < metaData.datosSolicitante.listaAeronave.length; i++) {
          //   this.listaAeronave.push({

          //     modelo: metaData.datosSolicitante.listaAeronave[i].modelo,
          //     matricula: metaData.datosSolicitante.listaAeronave[i].matricula,
          //     nroSerie: metaData.datosSolicitante.listaAeronave[i].nroSerie,
          //   });
          // }


          /*this.form.get("numeroRecibo").setValue(metaData.derechoTramite.nroReciboAcotacion);

          if(metaData.derechoTramite.fechaDePago!==null){
            if( metaData.derechoTramite.fechaDePago.length > 0){

                this.fechaPago = metaData.derechoTramite.fechaDePago;

                const fechaPago = metaData.derechoTramite.fechaDePago.split("-");

                this.selectedDateFechaPago = {
                  day: parseInt(fechaPago[2]),
                  month: parseInt(fechaPago[1]),
                  year: parseInt(fechaPago[0])
                };

                this.form.get("fechaPago").setValue(this.selectedDateFechaPago);

            }else{

                this.form.get("fechaPago").setValue(null);

            }
          }



          this.form.get("numeroOperacion").setValue(metaData.derechoTramite.nroOperacionBancoNacion);*/

          // this.formulario.get("fechaPago").setValue(metaData.derechoTramite.operacionBancoNacion);
          // this.formulario.get("autorizacionForm").setValue(metaData.derechoTramite.FlgAutorizacion);

      }
      ,
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
          });

    }else{
          switch(this.tipoPersona){
            case 1:
                //servicio reniec
                this.recuperarDatosReniec();
            break;

            case 2:
                //persona juridica
                this.recuperarDatosSunat();
                //this.recuperarDatosRepresentateLegal();
            break;

            case 3:
                //persona natural con ruc
                this.recuperarDatosSunat();
            break;
        }
    }
  }

  formatFecha(fecha: any) {
    let myDate = new Date(fecha.year, fecha.month-1, fecha.day);
    return myDate;
  }
  recuperarDatosReniec() {

    this.funcionesMtcService.mostrarCargando();

    this.reniecService.getDni(this.dni).subscribe(
        respuesta => {

            this.funcionesMtcService.ocultarCargando();

            const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            console.log(JSON.stringify(datos, null, 10));

            if (datos.prenombres === '')
              return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

            this.form.controls['datoSolicitante'].setValue(datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
            this.form.controls['domicilioLegal'].setValue(datos.direccion.trim());

            // this.nombres = datos.prenombres.trim();
            // this.apellidoPaterno = datos.apPrimer.trim();
            // this.apellidoMaterno = datos.apSegundo.trim();

            let ubigeo = datos.ubigeo.split('/');
            this.form.controls['distrito'].setValue(ubigeo[2].trim());
            this.form.controls['provincia'].setValue(ubigeo[1].trim());
            this.form.controls['departamento'].setValue(ubigeo[0].trim());

            this.form.controls['numeroDocumento'].setValue(this.dni.trim());

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
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

          this.form.controls['datoSolicitante'].setValue(datos.razonSocial.trim());
          // this.form.controls['numeroDocumento'].setValue(datos.nroDocumento.trim())
          this.form.controls['domicilio'].setValue(datos.domicilioLegal.trim());
          this.form.controls['distrito'].setValue(datos.nombreDistrito.trim());
          this.form.controls['provincia'].setValue(datos.nombreProvincia.trim());
          this.form.controls['departamento'].setValue(datos.nombreDepartamento.trim());;
          this.form.controls['correoElectronico'].setValue(datos.correo.trim());
          this.form.controls['telefonoFax'].setValue(datos.telefono.trim());
          this.form.controls['celular'].setValue(datos.celular.trim());

          this.representanteLegal = datos.representanteLegal;

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Sunat');
        }
      );

  }
  formInvalid(control: string) {
    return this.form.get(control).invalid &&
      (this.form.get(control).dirty || this.form.get(control).touched);
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 002-A/12";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  onDateSelectPago(event) {

    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaPago = finalDate;

  }

}
