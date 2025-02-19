import { Component, OnInit, Input } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
// tslint:disable-next-line: max-line-length

//Servicios
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { Formulario001B12Service } from 'src/app/core/services/formularios/formulario001-b12.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario001B12Request } from 'src/app/core/models/Formularios/Formulario001_b12/Formulario001-b12Request';
import { DatosSolicitante, OficinaRegistral, ServicioSolicitado, TipoPersona } from '../../../../core/models/Formularios/Formulario002_b12/Secciones';
import { Tramite } from '../../../../core/models/Tramite';
import { DeclaracionJurada } from '../../../../core/models/Formularios/Formulario001_a12/Secciones';
import { NgbActiveModal, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ListaAeronave } from '../../../../core/models/Formularios/Formulario002_b12/Secciones';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { SunatService } from '../../../../core/services/servicios/sunat.service';
import { Formulario002B12Request } from '../../../../core/models/Formularios/Formulario002_b12/Formulario002-b12Request';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { Formulario002B12Service } from 'src/app/core/services/formularios/formulario002-b12.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { FormularioTramiteService } from '../../../../core/services/tramite/formulario-tramite.service';
import { Formulario002B12Response } from '../../../../core/models/Formularios/Formulario002_b12/Formulario001-b12Response';
import { TramiteService } from '../../../../core/services/tramite/tramite.service';
import { AeronaveService } from '../../../../core/services/servicios/aeronave.service';
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
  formulario: UntypedFormGroup;
  vUbigeo: string[] = [];
  varUbigeo: string[] = [];
  readOnly: boolean = true;
  listaAeronave : ListaAeronave[] = [];
  indexEditTabla: number = -1;
  disabled: boolean = true;
  ocultar : boolean = true;
  esRepresentante: boolean = false;

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
  fechaPago: string;
  tramiteId: number;

  nroRecibo = '';
  nroOperacion = '';

  selectedDateFechaPago: NgbDateStruct = undefined;
  representanteLegal: RepresentanteLegal[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' }
  ];
  // listaOficinaRegistral : OficinaRegistral[] =[
  //   { id: 1, descripcion: 'LIMA' },
  //   { id: 2, descripcion: 'TARAPOTO' },
  // ] ;
  listaOficinaRegistral : any = [];
  listaTiposDocuExt: TipoDocumentoModel[] = [
    { id: "04", documento: 'Carnet de Extranjería' },
    // { id: "3", documento: 'Pasaporte' }
  ];
  constructor(public activeModal: NgbActiveModal,
              private fb: UntypedFormBuilder,
              private funcionesMtcService: FuncionesMtcService,
              private reniecService: ReniecService,
              private extranjeriaService: ExtranjeriaService,
              private seguridadService: SeguridadService,
              private modalService: NgbModal,
              private visorPdfArchivosService: VisorPdfArchivosService,
              private sunatService: SunatService,
              private formularioTramiteService: FormularioTramiteService,
              private formularioService: Formulario002B12Service,
              public tramiteService: TramiteService,
              public aeronaveService: AeronaveService,
              private _oficinaRegistral: OficinaRegistralService) {

  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.formulario = this.fb.group({
      // dni: this.fb.control(''),
      // carnetPasaporte: this.fb.control(''),
      numeroDocumento: this.fb.control('',[Validators.required]),
      nomRazNomCom: this.fb.control('',[Validators.required]),
      domicilioLegal: this.fb.control('',[Validators.required]),
      distrito: this.fb.control('',[Validators.required]),
      provincia: this.fb.control('',[Validators.required]),
      departamento: this.fb.control('',[Validators.required]),
      telefono: this.fb.control(''),
      celular: this.fb.control('',[Validators.required]),
      correoElectronico: this.fb.control('',[Validators.required]),
      marcadoObligatorio: this.fb.control(true),


      tpDocRepresentanteForm: this.fb.control('',[Validators.required]),
      nroDocRepresentanteForm: this.fb.control('',[Validators.required]),
      nombreRep: this.fb.control('',[Validators.required]),
      apPaternoRep: this.fb.control('',[Validators.required]),
      apMaternoRep: this.fb.control('',[Validators.required]),
      domicilioRepresentante: this.fb.control('',[Validators.required]),
      telefonoRepresentanteForm: this.fb.control(''),
      celularRepresentanteForm: this.fb.control('',[Validators.required]),
      especificacion: this.fb.control(''),
      itinerarioVuelo: this.fb.control('',[Validators.required]),
      correoRepresentanteForm: this.fb.control('',[Validators.email]),
      numeroPartida: this.fb.control('',[Validators.required]),
      oficina: this.fb.control('',[Validators.required]),

      modeloForm: this.fb.control(''),
      matriculaForm: this.fb.control(''),
      serieForm: this.fb.control(''),


      numeroRecibo: this.fb.control(''),
      numeroOperacionBancoNacion: this.fb.control(''),
      fechaPago: this.fb.control(null),
      autorizacionForm: this.fb.control('0'),

    });

    this.cargarOficinaRegistral();
    if(this.seguridadService.getNameId() === '00001'){
        //persona natural
        this.tipoPersona = 1;
        this.dni = this.seguridadService.getNumDoc();
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.ruc = this.seguridadService.getCompanyCode();
        // this.ruc = '20601237211';
    }else {
        //persona natural con ruc
        this.tipoPersona = 3;
        this.dni = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
    }

    // this.valoresTupa();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

    this.validarPago();
    this.recuperarInformacion();
  }


  valoresTupa(){
    this.tramiteService.getTramite(this.dataInput.tramiteId, '').subscribe((resp: any) => {
      console.log(JSON.stringify(resp, null, 10));
      this.codigoProcedimientoTupa = resp.tupaCodigo;
      this.descProcedimientoTupa = resp.tupaNombre;

    });
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
            console.log("8vo debugger")
            
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

              this.formulario.controls['numeroRecibo'].setValue(this.nroRecibo);
              this.formulario.controls['numeroOperacionBancoNacion'].setValue(this.nroOperacion);

              //cargar la fecha si es un nuevo registro

              const fechaPago = this.fechaPago.split("-");

              this.selectedDateFechaPago = {
                  day: parseInt(fechaPago[2]),
                  month: parseInt(fechaPago[1]),
                  year: parseInt(fechaPago[0])
              };

              this.formulario.controls['fechaPago'].setValue(this.selectedDateFechaPago);

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
  changeTipoDocumento() {
    const tipoDocumento: string = this.formulario.controls['tpDocRepresentanteForm'].value.trim();
    const apellMatR =   this.formulario.controls['apMaternoRep'];

    if(tipoDocumento ==='04'){

       this.disabled = false;
       apellMatR.setValidators(null);
       apellMatR.updateValueAndValidity();
    }else{
       apellMatR.setValidators([Validators.required]);
       apellMatR.updateValueAndValidity();
       this.disabled = true;
    }

    this.formulario.controls['nroDocRepresentanteForm'].setValue('');
    this.inputNumeroDocumento();
  }
  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tpDocRepresentanteForm'].value.trim();

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

      this.formulario.controls['nombreRep'].setValue('');
      this.formulario.controls['apPaternoRep'].setValue('');
      this.formulario.controls['apMaternoRep'].setValue('');
      this.formulario.controls['domicilioRepresentante'].setValue('');
      // this.formulario.controls['nombres'].setValue('');
  }
  formularioCompleto(): boolean {

    if (this.formulario.controls['modeloForm'].value.trim() === '' ||
      this.formulario.controls['matriculaForm'].value.trim() === '' ||
      this.formulario.controls['serieForm'].value.trim() === '')
      return false;
    return true;
  }
  agregarDatos() {

    if (this.formularioCompleto() === false)
      return this.funcionesMtcService.mensajeError('Debe agregar datos de la aeronave a la lista ');

   // const modelo: string = this.formulario.controls['modeloForm'].value.trim();
    const matricula: string = this.formulario.controls['matriculaForm'].value.trim();
    const serie: string = this.formulario.controls['serieForm'].value.trim();

    const indexFind = this.listaAeronave.findIndex(item => item.matricula === matricula && item.nroSerie === serie);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El modelo y matrícula ya existen. No pueden ser agregados.');
    }

    if (this.indexEditTabla === -1) {

      this.listaAeronave.push({
        modelo: this.formulario.controls['modeloForm'].value,
        matricula: this.formulario.controls['matriculaForm'].value,
        nroSerie: this.formulario.controls['serieForm'].value
      });
    } else {

      this.listaAeronave[this.indexEditTabla].modelo = this.formulario.controls['modeloForm'].value;
      this.listaAeronave[this.indexEditTabla].matricula = this.formulario.controls['matriculaForm'].value;
      this.listaAeronave[this.indexEditTabla].nroSerie = this.formulario.controls['serieForm'].value;


    }

    this.cancelarMod();
  }
  cancelarMod() {
    this.formulario.controls['modeloForm'].setValue('');
    this.formulario.controls['matriculaForm'].setValue('');
    this.formulario.controls['serieForm'].setValue('');
    this.indexEditTabla = -1;
  }
  modificarLista(item: ListaAeronave, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.formulario.controls['modeloForm'].setValue(item.modelo);
    this.formulario.controls['matriculaForm'].setValue(item.matricula);
    this.formulario.controls['serieForm'].setValue(item.nroSerie);
  }

  eliminarLista(item: ListaAeronave, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaAeronave.splice(index, 1);
        });
    }
  }
  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  buscarNumeroDocumento() {

    const tipoDocumento: string = this.formulario.controls['tpDocRepresentanteForm'].value.trim();
    const numeroDocumento: string = this.formulario.controls['nroDocRepresentanteForm'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    const resultado = this.representanteLegal.find( representante =>  ('0'+representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );



    if (resultado) {//DNI
      this.esRepresentante = false;

    }else{
      this.esRepresentante = true;
     // return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
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
            this.formulario.controls["nombreRep"].enable();
            this.formulario.controls["apPaternoRep"].enable();
            this.formulario.controls["apMaternoRep"].enable();
          }
        );
      }
  }

  addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, ubigeo: string) {
    this.vUbigeo = ubigeo.split("/", 3);
    this.varUbigeo =this.vUbigeo;

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formulario.controls['apMaternoRep'].setValue(ap_materno);
        this.formulario.controls['apPaternoRep'].setValue(ap_paterno);
        this.formulario.controls['nombreRep'].setValue(nombres);
        this.formulario.controls['domicilioRepresentante'].setValue(direccion);
        // this.formulario.controls['distrito'].setValue(this.varUbigeo[2]);
        // this.formulario.controls['provincia'].setValue(this.varUbigeo[1]);
        // this.formulario.controls['departamento'].setValue(this.varUbigeo[0]);
      });
  }
  guardarFormulario002b12(){
    if (this.formulario.invalid === true)
    return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
    if (this.listaAeronave.length === 0)
    return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');

    let dataGuardar: Formulario002B12Request = new Formulario002B12Request();

    dataGuardar.id = this.idForm;
    dataGuardar.formularioId = 1;
    dataGuardar.codigo = 'E';
    dataGuardar.codUsuario = "USER001";
    dataGuardar.estado = 1;
    dataGuardar.idTramiteReq = this.dataInput.tramiteReqId;
    // dataGuardar.usuarioCreacion = "MYUSER";
    // dataGuardar.ipCreacion = "192.168.1.1";
    let datosSolicitante: DatosSolicitante = new DatosSolicitante();

    datosSolicitante.tipoPersona.id =  this.tipoPersona;
    if(this.tipoPersona==1){
        this.descTipoPersona = 'PERSONA NATURAL';
      }else if (this.tipoPersona==2){
        this.descTipoPersona = 'PERSONA JURÍDICA';
      }else{
        this.descTipoPersona = 'PERSONA NATURAL CON RUC';
      }
    datosSolicitante.tipoPersona.descripcion =   this.descTipoPersona;
    datosSolicitante.tipoDocumento.id = this.tipoPersona.toString();
    datosSolicitante.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
    datosSolicitante.nomRazNomCom = this.formulario.controls['nomRazNomCom'].value;
    datosSolicitante.domicilio = this.formulario.controls['domicilioLegal'].value;
    datosSolicitante.distrito = this.formulario.controls['distrito'].value;
    datosSolicitante.provincia = this.formulario.controls['provincia'].value;
    datosSolicitante.departamento = this.formulario.controls['departamento'].value;
    datosSolicitante.telefono = this.formulario.controls['telefono'].value;
    datosSolicitante.celular     = this.formulario.controls['celular'].value;
    datosSolicitante.correoElectronico = this.formulario.controls['correoElectronico'].value;
    datosSolicitante.marcadoObligatorio = this.formulario.controls['marcadoObligatorio'].value;
    datosSolicitante.representanteLegal.nombres = this.formulario.controls['nombreRep'].value;
    // datosSolicitante.representanteLegal.apellidos = this.formulario.controls['representanteLegal'].value;

    datosSolicitante.representanteLegal.apellidoPaterno = this.formulario.controls['apPaternoRep'].value;
    datosSolicitante.representanteLegal.apellidoMaterno = this.formulario.controls['apMaternoRep'].value;
    datosSolicitante.representanteLegal.tipoDocumento.id = this.formulario.controls['tpDocRepresentanteForm'].value;
    datosSolicitante.representanteLegal.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tpDocRepresentanteForm').value)[0].documento;
    datosSolicitante.representanteLegal.numeroDocumento = this.formulario.controls['nroDocRepresentanteForm'].value;
    datosSolicitante.representanteLegal.domicilioRepresentanteLegal = this.formulario.controls['domicilioRepresentante'].value;
    datosSolicitante.representanteLegal.nroPartida= this.formulario.controls['numeroPartida'].value;
    datosSolicitante.representanteLegal.oficinaRegistral.id =  this.formulario.controls['oficina'].value;
    datosSolicitante.representanteLegal.oficinaRegistral.descripcion = this.listaOficinaRegistral.filter(item => item.value == this.formulario.get('oficina').value)[0].text;
    datosSolicitante.representanteLegal.telefonoFax = this.formulario.controls['telefonoRepresentanteForm'].value;
    datosSolicitante.representanteLegal.celularR = this.formulario.controls['celularRepresentanteForm'].value;
    datosSolicitante.representanteLegal.correoElectronicoR = this.formulario.controls['correoRepresentanteForm'].value;

    datosSolicitante.listaAeronave = this.listaAeronave;

    let servicioSolicitado: ServicioSolicitado = new ServicioSolicitado();
    // servicioSolicitado.codigoProcedimientoTupa = this.formulario.controls['codProc'].value;
    // servicioSolicitado.descProcedimientoTupa = this.formulario.controls['descProcedimientoTupa'].value;
    servicioSolicitado.datosInspeccion.itinerarioVuelo = this.formulario.controls['itinerarioVuelo'].value;
    servicioSolicitado.codigoProcedimientoTupa = this.codigoProcedimientoTupa
    servicioSolicitado.descProcedimientoTupa = this.descProcedimientoTupa
    servicioSolicitado.especificacionRequerida = this.formulario.controls['especificacion'].value.trim();
    // servicioSolicitado.flgProcedimientoTupa =this.formulario.controls['numeroPartida'].value;
    // servicioSolicitado.descFlg =this.formulario.controls['numeroPartida'].value;


    let derechoTramite = new Tramite()
    derechoTramite.nroReciboAcotacion = this.formulario.controls['numeroRecibo'].value;
    derechoTramite.nroOperacionBancoNacion = this.formulario.controls['numeroOperacionBancoNacion'].value;
    derechoTramite.fechaDePago = this.fechaPago;
    // derechoTramite.fechaDePago = this.formatFecha(this.formulario.controls['fechaDerecho'].value);


    let declaracionJurada: DeclaracionJurada = new DeclaracionJurada();
    declaracionJurada.flgAutorizacion = 0;

    dataGuardar.metaData.datosSolicitante = datosSolicitante;
    dataGuardar.metaData.servicioSolicitado = servicioSolicitado;
    dataGuardar.metaData.derechoTramite = derechoTramite;
    // dataGuardar.metaData.declaracionJurada = declaracionJurada;
    console.log(dataGuardar);
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
  onDateSelectPago(event) {

    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaPago = finalDate;

  }

  formatFecha(fecha: any) {
    let myDate = new Date(fecha.year, fecha.month-1, fecha.day);
    return myDate;
  }


  formInvalid(control: string) {
    return this.formulario.get(control).invalid &&
      (this.formulario.get(control).dirty || this.formulario.get(control).touched);
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 002-B/12";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }
  recuperarInformacion(){

    //si existe el documento
    if (this.dataInput.rutaDocumento) {
      this.funcionesMtcService.mostrarCargando();
      //RECUPERAMOS LOS DATOS
      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataFormulario: Formulario002B12Response) => {
          this.funcionesMtcService.ocultarCargando();
          const metaData: any = JSON.parse(dataFormulario.metaData);


          this.idForm = dataFormulario.formularioId;

          // console.log(JSON.stringify(dataFormulario, null, 10));
          console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));



          this.formulario.get("numeroDocumento").setValue(metaData.datosSolicitante.numeroDocumento);
          this.formulario.get("nomRazNomCom").setValue(metaData.datosSolicitante.nomRazNomCom);
          this.formulario.get("domicilioLegal").setValue(metaData.datosSolicitante.domicilio);
          this.formulario.get("distrito").setValue(metaData.datosSolicitante.distrito);
          this.formulario.get("provincia").setValue(metaData.datosSolicitante.provincia);
          this.formulario.get("departamento").setValue(metaData.datosSolicitante.departamento);
          this.formulario.get("telefono").setValue(metaData.datosSolicitante.telefono);
          this.formulario.get("celular").setValue(metaData.datosSolicitante.celular);
          this.formulario.get("correoElectronico").setValue(metaData.datosSolicitante.correoElectronico);

          this.formulario.get("marcadoObligatorio").setValue(metaData.datosSolicitante.marcadoObligatorio);


          this.formulario.get("tpDocRepresentanteForm").setValue('0'+(metaData.datosSolicitante.representanteLegal.tipoDocumento.id).toString());
          this.formulario.get("nroDocRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.numeroDocumento);
          this.formulario.get("nombreRep").setValue(metaData.datosSolicitante.representanteLegal.nombres);
          this.formulario.get("apPaternoRep").setValue(metaData.datosSolicitante.representanteLegal.apellidoPaterno);
          this.formulario.get("apMaternoRep").setValue(metaData.datosSolicitante.representanteLegal.apellidoMaterno);
          if(this.formulario.get("tpDocRepresentanteForm").value==='04'){

            const apellMatRep =   this.formulario.controls['apMaternoRep'];
            this.disabled = false;
            setTimeout(() => {
              apellMatRep.setValidators(null);
              apellMatRep.updateValueAndValidity();
          });

          }
          this.formulario.get("domicilioRepresentante").setValue(metaData.datosSolicitante.representanteLegal.domicilioRepresentanteLegal);
          this.formulario.get("telefonoRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.telefonoFax);
          this.formulario.get("celularRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.celularR);
          this.formulario.get("itinerarioVuelo").setValue(metaData.servicioSolicitado.datosInspeccion.itinerarioVuelo);
          this.formulario.get("numeroPartida").setValue(metaData.datosSolicitante.representanteLegal.nroPartida);

          setTimeout(() => {
          this.formulario.get("oficina").setValue(metaData.datosSolicitante.representanteLegal.oficinaRegistral.id);
        });
          this.formulario.get("correoRepresentanteForm").setValue(metaData.datosSolicitante.representanteLegal.correoElectronicoR);
          this.formulario.get("especificacion").setValue(metaData.servicioSolicitado.especificacionRequerida);


          for (var i = 0; i < metaData.datosSolicitante.listaAeronave.length; i++) {
            this.listaAeronave.push({
              // placaRodaje: metaData.datosSolicitante.listaAeronave[i].modelo,
              // soat: metaData.renat.listaVehiculos[i].soat,
              modelo: metaData.datosSolicitante.listaAeronave[i].modelo,
              matricula: metaData.datosSolicitante.listaAeronave[i].matricula,
              nroSerie: metaData.datosSolicitante.listaAeronave[i].nroSerie,
            });
          }


          this.formulario.get("numeroRecibo").setValue(metaData.derechoTramite.nroReciboAcotacion);
          if(metaData.derechoTramite.fechaDePago!==null){
              if( metaData.derechoTramite.fechaDePago.length > 0){

                this.fechaPago = metaData.derechoTramite.fechaDePago;

                const fechaPago = metaData.derechoTramite.fechaDePago.split("-");

                this.selectedDateFechaPago = {
                  day: parseInt(fechaPago[2]),
                  month: parseInt(fechaPago[1]),
                  year: parseInt(fechaPago[0])
                };

                this.formulario.get("fechaPago").setValue(this.selectedDateFechaPago);

            }else{

                this.formulario.get("fechaPago").setValue(null);

            }
          }



          this.formulario.get("numeroOperacionBancoNacion").setValue(metaData.derechoTramite.nroOperacionBancoNacion);

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
  recuperarDatosReniec() {

    this.funcionesMtcService.mostrarCargando();

    this.reniecService.getDni(this.dni).subscribe(
        respuesta => {

            this.funcionesMtcService.ocultarCargando();

            const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            console.log(JSON.stringify(datos, null, 10));

            if (datos.prenombres === '')
              return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

            this.formulario.controls['nomRazNomCom'].setValue(datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
            this.formulario.controls['domicilioLegal'].setValue(datos.direccion.trim());

            // this.nombres = datos.prenombres.trim();
            // this.apellidoPaterno = datos.apPrimer.trim();
            // this.apellidoMaterno = datos.apSegundo.trim();

            let ubigeo = datos.ubigeo.split('/');
            this.formulario.controls['distrito'].setValue(ubigeo[2].trim());
            this.formulario.controls['provincia'].setValue(ubigeo[1].trim());
            this.formulario.controls['departamento'].setValue(ubigeo[0].trim());

            this.formulario.controls['numeroDocumento'].setValue(this.dni.trim());

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

          this.formulario.controls['nomRazNomCom'].setValue(datos.razonSocial.trim());
          this.formulario.controls['numeroDocumento'].setValue(datos.nroDocumento.trim())
          this.formulario.controls['domicilioLegal'].setValue(datos.domicilioLegal.trim());
          this.formulario.controls['distrito'].setValue(datos.nombreDistrito.trim());
          this.formulario.controls['provincia'].setValue(datos.nombreProvincia.trim());
          this.formulario.controls['departamento'].setValue(datos.nombreDepartamento.trim());;
          this.formulario.controls['correoElectronico'].setValue(datos.correo.trim());
          this.formulario.controls['telefono'].setValue(datos.telefono.trim());
          this.formulario.controls['celular'].setValue(datos.celular.trim());

          this.representanteLegal = datos.representanteLegal;

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
        }
      );

  }

  recuperarDatosRepresentateLegal() {

    this.funcionesMtcService.mostrarCargando();

    this.sunatService.getRepresentantesLegales(this.ruc).subscribe(
        respuesta => {

          this.funcionesMtcService.ocultarCargando();

          const datos = respuesta.getRepLegalesResponse;

          console.log(JSON.stringify(datos, null, 10));

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
        }
      );

  }

  buscarMatricula(){
    const matricula: string = this.formulario.controls['matriculaForm'].value.trim();

    this.funcionesMtcService.mostrarCargando();
    this.aeronaveService.getAeronave(matricula).subscribe(
      respuesta => {

        this.funcionesMtcService.ocultarCargando();

        const datos = respuesta;
        console.log(respuesta);
        if(datos[0].mensaje==='E0003')
        return this.funcionesMtcService.mensajeError('Problemas para conectar con el Servicio de Datos de Aeronave');
        // console.log("****** "+matricula)

        this.formulario.controls['modeloForm'].setValue(datos[0].modelo.trim());
        // // this.formulario.controls['modeloForm'].setValue(datos.modelo.trim());
        this.formulario.controls['serieForm'].setValue(datos[0].numeroSerie.trim());

      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar el Servicio de Datos de Aeronave');
      }
    );
  }
}
