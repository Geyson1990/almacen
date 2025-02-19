import { Component, OnInit , ViewChild , Input} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal , NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario00128Service } from 'src/app/core/services/formularios/formulario001-28.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { Formulario001_28Response } from 'src/app/core/models/Formularios/Formulario001_28/Formulario001_28Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})

export class FormularioComponent implements OnInit {

  active = 1;

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL FORMULARIO

  tipoPersona: number = 2 ;
  codigoTupa: string = "" ;
  descripcionTupa: string;
  idFormularioMovimiento: number = 0;
  formulario: UntypedFormGroup;
  tipoDocumento: string;
  dniPersona: string = '';
  ruc: string = '';
  extranjero: boolean = false;
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  nombreUsuario: string = "";
  toggle : boolean;
  tramiteId: number = 0;

  representanteLegal: RepresentanteLegal[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];
  
  listaTipoDocumentoConadis: TipoDocumentoModel[] = [
    { id: "1", documento: 'Resolución de CONADIS N°' },
    { id: "2", documento: 'N° Carnet de CONADIS' }
  ];
  submitted = false;

  @ViewChild('acc') acc: NgbAccordionDirective ;

   constructor(
      private fb: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private sunatService: SunatService,
      private reniecService: ReniecService,
      private modalService: NgbModal,
      private formularioService: Formulario00128Service,
      private formularioTramiteService: FormularioTramiteService,
      public activeModal: NgbActiveModal,
      private seguridadService: SeguridadService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private extranjeriaService: ExtranjeriaService
    ) {
    }

  ngOnInit(): void {

    this.uriArchivo = this.dataInput.rutaDocumento;

    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));

    if(this.seguridadService.getNameId() === '00001'){
        //persona natural
        this.tipoPersona = 1;
        this.dniPersona = this.seguridadService.getNumDoc();
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.ruc = this.seguridadService.getCompanyCode();
        this.dniPersona = this.seguridadService.getNumDoc();
    }else {
        //persona natural con ruc
        this.tipoPersona = 3;
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
    }

    this.tipoDocumento = this.ruc && this.tipoPersona === 2 ? 'RUC' : this.dniPersona ? 'DNI' : '';

    this.formulario = this.fb.group({
      tipoPersona: this.tipoPersona===1 || this.tipoPersona===3 ? '1' : '2',
      s1_razonSocial: this.fb.control('', [Validators.required]),
      s1_nroDocumento: ['', [Validators.minLength(8), Validators.maxLength(20)]],
      s1_telefono: ['',Validators.required],
      s1_celular: ['',Validators.required],
      s1_correo: ['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      s1_domicilioLegal   : ['',Validators.required],
      s1_distrito:    ['',Validators.required],
      s1_provincia:     ['',Validators.required],
      s1_departamento: ['',Validators.required],
      s1_nroResolucionConadis: [''],
      s1_disVisual: [false],
      s1_disAuditiva: [false],
      s1_disMental: [false],
      s1_disFisica: [false],
      s1_disDelLenguaje: [false],
      s1_disIntelectual: [false],
      s1_disMultiples: [false],
      s1_notificacion: [true],          
      s1_representanteLegal: [''],
      s1_tipoDocumentoRepresentante: [''],
      s1_numeroDocumentoRepresentante: [''],
      s1_domicilioRepresentante: [''],
      s1_poderRegistradoOficinaNumero: [''],
      s1_poderRegistradoPartidaNumero: [''],
      s1_asientoNumero: [''],
      s2_servicioCodigo: [this.codigoTupa],
      s2_servicioPrivado: [''],
      s2_servicioPrivadoOtros: [''],
      s2_radioaficionadoNivel: [''],
      s2_radioaficionadoServicio: [''],
      s2_radioaficionadoServicioOtros: [''],
      s2_renunciaAutorizacion: [''],
      s2_renunciaAutorizacionOtros: [''],
      s3_nroColegiatura: [''],
      s3_colegioProfesional: ['']
    });

    if (this.tipoPersona === 2) {      
      this.formulario.controls["s1_representanteLegal"].setValidators(Validators.required);
      this.formulario.controls["s1_tipoDocumentoRepresentante"].setValidators(Validators.required);
      this.formulario.controls["s1_numeroDocumentoRepresentante"].setValidators(Validators.required);
      this.formulario.controls["s1_domicilioRepresentante"].setValidators(Validators.required);
      this.formulario.controls["s1_poderRegistradoOficinaNumero"].setValidators(Validators.required);
      this.formulario.controls["s1_poderRegistradoPartidaNumero"].setValidators(Validators.required);
      this.formulario.controls["s1_asientoNumero"].setValidators(Validators.required);
    }

    if (this.codigoTupa === 'DGAT-001' || this.codigoTupa === 'DGAT-003' || this.codigoTupa === 'DGAT-007') {
      this.formulario.controls["s3_nroColegiatura"].setValidators(Validators.required);
      this.formulario.controls["s3_colegioProfesional"].setValidators(Validators.required);
    }

    this.recuperarInformacion();

    setTimeout(() => {
        this.acc.expand('formulario001-28-seccion-1');
        this.acc.expand('formulario001-28-seccion-4');
    });
  }

  //*************************************************************************************
  //************************VALIDACION DE CAMPOS DEL FORMULARIO *************************
  //*************************************************************************************

  //npm install ngx-ui-switch --save
  //toggle de la seccion 1 y se importa en formulario_001-28.module y se agrego al angular.json
  onChangeNotificacion(e){
    this.toggle = e;
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001/28";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  guardarFormulario() {

    if ( this.formulario.invalid ){
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return Object.values( this.formulario.controls ).forEach( control => {
        control.markAsTouched();

        //para evaluar los aniados
        if(control instanceof UntypedFormGroup) {
            Object.values( control.controls ).forEach( control => control.markAsTouched() );
        }else{
          control.markAsTouched();
        }
      });
    }
    
    if(this.formulario.controls['s2_servicioPrivado'].value === 'otros') this.formulario.get("s2_servicioPrivadoOtros").setValue('');
    if(this.formulario.controls['s2_radioaficionadoServicio'].value === 'otros') this.formulario.get("s2_radioaficionadoServicioOtros").setValue('');
    if(this.formulario.controls['s2_renunciaAutorizacion'].value === 'otros') this.formulario.get("s2_renunciaAutorizacionOtros").setValue('');

    let dataGuardar = {
      id: this.idFormularioMovimiento,
      tramiteReqId: this.dataInput.tramiteReqId,
      codigo: "28",
      formularioId: 2,
      codUsuario: "COD-USU",
      estado: 1,
      metaData: {
        seccion1: {
          personaNatural : this.tipoPersona === 1 || this.tipoPersona === 3 ? true : false,
          personaJuridica : this.tipoPersona === 2 ? true : false,
          razonSocial : this.tipoPersona === 2 ? this.formulario.controls['s1_razonSocial'].value : '',
          apellidoPaterno : this.apellidoPaterno,
          apellidoMaterno : this.apellidoMaterno,
          nombres : this.nombres,
          domicilioLegal : this.formulario.controls['s1_domicilioLegal'].value,
          distrito : this.formulario.controls['s1_distrito'].value,
          provincia : this.formulario.controls['s1_provincia'].value,
          departamento : this.formulario.controls['s1_departamento'].value,
          dni : this.dniPersona,
          nroRuc : this.tipoPersona === 2 || this.tipoPersona === 3 ? this.ruc : '',
          ce : '',
          telefono : this.formulario.controls['s1_telefono'].value,
          celular : this.formulario.controls['s1_celular'].value,
          correo : this.formulario.controls['s1_correo'].value,
          nroResolucionConadis : this.formulario.controls['s1_nroResolucionConadis'].value,
          disVisual : this.formulario.controls['s1_disVisual'].value,
          disAuditiva : this.formulario.controls['s1_disAuditiva'].value,
          disMental : this.formulario.controls['s1_disMental'].value,
          disFisica : this.formulario.controls['s1_disFisica'].value,
          disDelLenguaje : this.formulario.controls['s1_disDelLenguaje'].value,
          disIntelectual : this.formulario.controls['s1_disIntelectual'].value,
          disMultiples : this.formulario.controls['s1_disMultiples'].value,
          notificacion : this.formulario.controls['s1_notificacion'].value,
          representanteLegal : this.formulario.controls['s1_representanteLegal'].value,
          tipoDocRepresentante : this.formulario.controls['s1_tipoDocumentoRepresentante'].value,
          nroDocRepresentante : this.formulario.controls['s1_numeroDocumentoRepresentante'].value,
          domicilioRepresentante : this.formulario.controls['s1_domicilioRepresentante'].value,
          poderRegistradoPartidaNumero : this.formulario.controls['s1_poderRegistradoPartidaNumero'].value,
          poderRegistradoOficinaNumero : this.formulario.controls['s1_poderRegistradoOficinaNumero'].value,
          asientoNumero : this.formulario.controls['s1_asientoNumero'].value,
        },
        seccion2: {
          servicioCodigo : this.codigoTupa,
          servicioPrivado : this.formulario.controls['s2_servicioPrivado'].value,
          servicioPrivadoOtros : this.formulario.controls['s2_servicioPrivadoOtros'].value,
          radioaficionadoNivel : this.formulario.controls['s2_radioaficionadoNivel'].value,
          radioaficionadoServicio : this.formulario.controls['s2_radioaficionadoServicio'].value,
          radioaficionadoServicioOtros : this.formulario.controls['s2_radioaficionadoServicioOtros'].value,
          renunciaAutorizacion : this.formulario.controls['s2_renunciaAutorizacion'].value,
          renunciaAutorizacionOtros : this.formulario.controls['s2_renunciaAutorizacionOtros'].value,
        },
        seccion3: {
          nroColegiatura : this.formulario.controls['s3_nroColegiatura'].value,
          colegioProfesional : this.formulario.controls['s3_colegioProfesional'].value,
        },
        seccion4: {
          nombreSolicitante : this.nombreUsuario,
          documentoSolicitante : this.dniPersona,
        }
      }
    }

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idFormularioMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
    .then(() => {
      console.log(JSON.stringify(dataGuardar));

      this.funcionesMtcService.mostrarCargando();

      if (this.idFormularioMovimiento === 0) {
        //GUARDAR:
        this.formularioService.post<any>(dataGuardar)
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
        //MODIFICAR
        this.formularioService.put<any>(dataGuardar)
          .subscribe(
            data => {
              this.funcionesMtcService.ocultarCargando();
              this.idFormularioMovimiento = data.id;

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

  formInvalid(control: string) {
    return this.formulario.get(control).invalid &&
      (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }

  changeTipoDocumentoRP() {
      this.formulario.controls['s1_numeroDocumentoRepresentante'].setValue('');
      this.inputNumeroDocumentoRP();
  }

  inputNumeroDocumentoRP(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.formulario.controls['s1_representanteLegal'].setValue('');
  }

  getMaxLengthNumeroDocumento(frmControlNameTipoDocumento: string) {
      const tipoDocumento: string = this.formulario.controls[frmControlNameTipoDocumento].value.trim();

      if (tipoDocumento === '1')//DNI
        return 8;
      else if (tipoDocumento === '2')//CE
        return 12;
      return 0
  }

  recuperarDatosReniec() {

    this.funcionesMtcService.mostrarCargando();

    this.reniecService.getDni(this.dniPersona).subscribe(
        respuesta => {

            this.funcionesMtcService.ocultarCargando();

            const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            console.log(JSON.stringify(datos, null, 10));

            if (datos.prenombres === '')
              return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

            this.nombres = datos.prenombres.trim();
            this.apellidoPaterno = datos.apPrimer.trim();
            this.apellidoMaterno = datos.apSegundo.trim();
            this.nombreUsuario = ( datos.apPrimer.trim() + ' ' + datos.apSegundo.trim() + ' ' + datos.prenombres.trim() );
            if(this.tipoPersona === 1 || this.tipoPersona === 3){
              this.formulario.controls['s1_nroDocumento'].setValue(this.dniPersona.trim());
              this.formulario.controls['s1_razonSocial'].setValue(datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
              this.formulario.controls['s1_domicilioLegal'].setValue(datos.direccion.trim());
              let ubigeo = datos.ubigeo.split('/');
              this.formulario.controls['s1_distrito'].setValue(ubigeo[2].trim());
              this.formulario.controls['s1_provincia'].setValue(ubigeo[1].trim());
              this.formulario.controls['s1_departamento'].setValue(ubigeo[0].trim());
            }
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

            this.formulario.controls['s1_nroDocumento'].setValue(datos.nroDocumento.trim());
            this.formulario.controls['s1_razonSocial'].setValue(datos.razonSocial.trim());
            this.formulario.controls['s1_domicilioLegal'].setValue(datos.domicilioLegal.trim());
            this.formulario.controls['s1_distrito'].setValue(datos.nombreDistrito.trim());
            this.formulario.controls['s1_provincia'].setValue(datos.nombreProvincia.trim());
            this.formulario.controls['s1_departamento'].setValue(datos.nombreDepartamento.trim());
            this.formulario.controls['s1_correo'].setValue(datos.correo.trim());
            this.formulario.controls['s1_telefono'].setValue(datos.telefono.trim());
            this.formulario.controls['s1_celular'].setValue(datos.celular.trim());

            this.representanteLegal = datos.representanteLegal;
            
            if (this.representanteLegal.length > 0){
              this.formulario.controls['s1_tipoDocumentoRepresentante'].setValue(this.representanteLegal[0].tipoDocumento);
              this.formulario.controls['s1_numeroDocumentoRepresentante'].setValue(this.representanteLegal[0].nroDocumento);
              this.buscarNumeroDocumento();
            }
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar el Servicio Sunat');
          }
        );

    }

  recuperarInformacion(){

      //si existe el documento
      if (this.dataInput.rutaDocumento) {
          //RECUPERAMOS LOS DATOS DEL FORMULARIO
          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario001_28Response) => {
              const metaData: any = JSON.parse(dataFormulario.metaData);

              this.idFormularioMovimiento = dataFormulario.formularioId;

              console.log(JSON.stringify(dataFormulario, null, 10));
              console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));

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

              this.formulario.get("s1_domicilioLegal").setValue(metaData.seccion1.domicilioLegal.trim());
              this.formulario.get("s1_distrito").setValue(metaData.seccion1.distrito.trim());
              this.formulario.get("s1_provincia").setValue(metaData.seccion1.provincia.trim());
              this.formulario.get("s1_departamento").setValue(metaData.seccion1.departamento.trim());
              this.formulario.get("s1_telefono").setValue(metaData.seccion1.telefono.trim());
              this.formulario.get("s1_celular").setValue(metaData.seccion1.celular.trim());
              this.formulario.get("s1_correo").setValue(metaData.seccion1.correo.trim());
              this.formulario.get("s1_nroResolucionConadis").setValue(metaData.seccion1.nroResolucionConadis.trim());
              this.formulario.get("s1_disVisual").setValue(metaData.seccion1.disVisual);
              this.formulario.get("s1_disAuditiva").setValue(metaData.seccion1.disAuditiva);
              this.formulario.get("s1_disMental").setValue(metaData.seccion1.disMental);
              this.formulario.get("s1_disFisica").setValue(metaData.seccion1.disFisica);
              this.formulario.get("s1_disDelLenguaje").setValue(metaData.seccion1.disDelLenguaje);
              this.formulario.get("s1_disIntelectual").setValue(metaData.seccion1.disIntelectual);
              this.formulario.get("s1_disMultiples").setValue(metaData.seccion1.disMultiples);
              this.formulario.get("s1_notificacion").setValue(metaData.seccion1.notificacion);
              this.formulario.get("s1_representanteLegal").setValue(metaData.seccion1.representanteLegal.trim());
              this.formulario.get("s1_tipoDocumentoRepresentante").setValue(metaData.seccion1.tipoDocRepresentante);
              this.formulario.get("s1_numeroDocumentoRepresentante").setValue(metaData.seccion1.nroDocRepresentante);
              this.formulario.get("s1_domicilioRepresentante").setValue(metaData.seccion1.domicilioRepresentante.trim());
              this.formulario.get("s1_poderRegistradoPartidaNumero").setValue(metaData.seccion1.poderRegistradoPartidaNumero.trim());
              this.formulario.get("s1_poderRegistradoOficinaNumero").setValue(metaData.seccion1.poderRegistradoOficinaNumero.trim());
              this.formulario.get("s1_asientoNumero").setValue(metaData.seccion1.asientoNumero.trim());

              this.formulario.get("s2_servicioCodigo").setValue(metaData.seccion2.servicioCodigo.trim());
              this.formulario.get("s2_servicioPrivado").setValue(metaData.seccion2.servicioPrivado.trim());
              this.formulario.get("s2_servicioPrivadoOtros").setValue(metaData.seccion2.servicioPrivadoOtros.trim());
              this.formulario.get("s2_radioaficionadoNivel").setValue(metaData.seccion2.radioaficionadoNivel.trim());
              this.formulario.get("s2_radioaficionadoServicio").setValue(metaData.seccion2.radioaficionadoServicio.trim());
              this.formulario.get("s2_radioaficionadoServicioOtros").setValue(metaData.seccion2.radioaficionadoServicioOtros.trim());
              this.formulario.get("s2_renunciaAutorizacion").setValue(metaData.seccion2.renunciaAutorizacion.trim());
              this.formulario.get("s2_renunciaAutorizacionOtros").setValue(metaData.seccion2.renunciaAutorizacionOtros.trim());

              this.formulario.get("s3_nroColegiatura").setValue(metaData.seccion3.nroColegiatura.trim());
              this.formulario.get("s3_colegioProfesional").setValue(metaData.seccion3.colegioProfesional.trim());
            },
            error => {
              this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para recuperar los datos guardados del anexo');
            });
        }else{

            switch(this.tipoPersona){
                case 1:
                    //servicio reniec
                    this.recuperarDatosReniec();
                break;

                case 2:
                    //persona juridica
                    this.recuperarDatosReniec();
                    this.recuperarDatosSunat();
                break;

                case 3:
                    //persona natural con ruc
                    this.recuperarDatosReniec();
                    this.recuperarDatosSunat();
                break;
            }

        }

    }

    
    buscarNumeroDocumento() {
      const tipoDocumento = this.formulario.controls['s1_tipoDocumentoRepresentante'].value.trim();
      const numeroDocumento = this.formulario.controls['s1_numeroDocumentoRepresentante'].value.trim();

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
        return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      if (tipoDocumento === '1' && numeroDocumento.length !== 8)
        return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

          const resultado = this.representanteLegal.find( representante => representante.tipoDocumento.trim() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );
          if(resultado){
              this.funcionesMtcService.mostrarCargando();
              if (tipoDocumento === '1') {//DNI
                  this.reniecService.getDni(numeroDocumento).subscribe(
                    respuesta => {
                        this.funcionesMtcService.ocultarCargando();
                        const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                        console.log(JSON.stringify(datos, null, 10));

                        if (datos.prenombres === '')
                          return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);
                        
                          this.formulario.controls['s1_representanteLegal'].setValue( datos.apPrimer.trim() + ' ' +datos.apSegundo.trim() + ' ' + datos.prenombres.trim());
                          this.formulario.controls['s1_domicilioRepresentante'].setValue( datos.direccion.trim() );
                      },
                    error => {
                      this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('Error al consultar el Servicio Reniec');
                        this.habilitarCamposRepresentante();
                    }
                  );

              } else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
                  this.extranjeriaService.getCE(numeroDocumento).subscribe(
                    respuesta => {
                      this.funcionesMtcService.ocultarCargando();
                      const datos = respuesta.CarnetExtranjeria;
                      if (datos.numRespuesta !== '0000')
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

                        this.formulario.controls['s1_representanteLegal'].setValue(datos.primerApellido.trim() + ' ' +datos.segundoApellido.trim() + ' ' + datos.nombres.trim());
                      },
                    error => {
                      this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('Error al consultar al servicio de extranjeria');
                        this.habilitarCamposRepresentante();
                    }
                  );
              }
          }else{
              return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
          }

  }
  

  habilitarCamposRepresentante(){
    this.formulario.controls["s1_representanteLegal"].enable();
    this.formulario.controls["s1_tipoDocumentoRepresentante"].enable();
    this.formulario.controls["s1_numeroDocumentoRepresentante"].enable();
}
    
  get form() { return this.formulario.controls; }
  
}
