import { Component, OnInit , ViewChild , Input} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal , NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario00412Service } from 'src/app/core/services/formularios/formulario004-12.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { Formulario004_12Response } from 'src/app/core/models/Formularios/Formulario004_12/Formulario004_12Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ReniecModel } from 'src/app/core/models/ReniecModel';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
  codigoTupa: string = "DGAC-025" ;
  descripcionTupa: string;
  fechaPago: string = "";
  fechaPartida: string = "";
  disabledAcordion: number = 1;
  idFormularioMovimiento: number = 0;
  formulario: UntypedFormGroup;
  dniPersona: string = '72793352';
  ruc: string = '20318171701';
  extranjero: boolean = false;
  toggle : boolean = true;
  tramiteId: number = 0;
  selectedDateFechaInscripcion: NgbDateStruct = undefined;
  selectedDateFechaPago: NgbDateStruct = undefined;

  visibleButtonMemoriaDescriptiva: boolean = false;
  filePdfMemoriaDescriptivaSeleccionado: any = null;
  pathPdfMemoriaDescriptivaSeleccionado: any = null;

  visibleButtonImpactoAmbiental: boolean = false;
  filePdfImpactoAmbientalSeleccionado: any = null;
  pathPdfImpactoAmbientalSeleccionado: any = null;

  visibleButtonHabilidadProfesional: boolean = false;
  filePdfHabilidadProfesionalSeleccionado: any = null;
  pathPdfHabilidadProfesionalSeleccionado: any = null;

  nroRecibo = '';
  nroOperacion = '';

  datosPersona: ReniecModel[] = [];

  representanteLegal: RepresentanteLegal[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];

  @ViewChild('acc') acc: NgbAccordionDirective ;

   constructor(
      private fb: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private sunatService: SunatService,
      private reniecService: ReniecService,
      private modalService: NgbModal,
      private formularioService: Formulario00412Service,
      private formularioTramiteService: FormularioTramiteService,
      public activeModal: NgbActiveModal,
      private seguridadService: SeguridadService,
      private tramiteService: TramiteService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private extranjeriaService: ExtranjeriaService,
    ) {
      //this.validarCamposFormulario();
    }

  ngOnInit(): void {

      this.uriArchivo = this.dataInput.rutaDocumento;

      const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));

      this.codigoTupa = tramite.codigo;
      this.descripcionTupa = tramite.nombre;
      this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));

      //this.validarPago();

      if(this.seguridadService.getNameId() === '00001'){
          //persona natural
          this.tipoPersona = 1;
          this.dniPersona = this.seguridadService.getNumDoc();
      }else if(this.seguridadService.getNameId() === '00002'){
          //persona juridica
          this.tipoPersona = 2;
          this.ruc = this.seguridadService.getCompanyCode();
      }else {
          //persona natural con ruc
          this.tipoPersona = 3;
          this.dniPersona = this.seguridadService.getNumDoc();
          this.ruc = this.seguridadService.getCompanyCode();
      }

      this.formulario = this.fb.group({
          tipoPersona: this.tipoPersona===1 || this.tipoPersona===3 ? '1' : '2',
          s1_personaNatural : this.fb.control(true),
          s1_personaJuridica : this.fb.control(false),
          s1_razonSocial : ['',Validators.required],
          s1_apellidoPaterno : ['',Validators.required],
          s1_apellidoMaterno : ['',Validators.required],
          s1_nombres     : ['',Validators.required],
          s1_domicilioLegal   : ['',Validators.required],
          s1_distrito:    ['',Validators.required],
          s1_provincia:     ['',Validators.required],
          s1_departamento: ['',Validators.required],
          s1_dni           : this.fb.control('', [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]),
          s1_cePasaporte  : [''],
          s1_nroRuc           : this.fb.control('', [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]),
          s1_telefono: [''],
          s1_celular: ['',Validators.required],
          s1_correo: ['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          s1_notificacion: [true],
          s1_numeroRucOperador: ['',Validators.required],
          s1_razonSocialOperador: ['',Validators.required],
          s1_nombresRepresentante: ['',Validators.required],
          s1_apellidoPaternoRepresentante: ['',Validators.required],
          s1_apellidoMaternoRepresentante: ['',Validators.required],
          s1_domicilioRepresentante: ['',Validators.required],
          s1_tipoDocumentoRepresentante: ['',Validators.required],
          s1_numeroDocumentoRepresentante: ['',Validators.required],
          s1_nroPartida: ['',Validators.required],
          s1_oficinaRegistral: ['',Validators.required],
          s2_nroPartida: ['',Validators.required],
          s2_oficinaRegistral: ['',Validators.required],
          s3_servicioCodigo: [this.codigoTupa],
          s3_memoriaDescriptiva: ['',Validators.required],
          s3_impactoAmbiental: ['',Validators.required],
          s3_habilidadProfesional: ['',Validators.required],
          s3_nombreApellido: ['',Validators.required],
          s3_profesion: ['',Validators.required],
          s3_nroColegiatura: ['',Validators.required],
          /*s4_nroRecibo: [this.nroRecibo],
          s4_nroOperacion: [this.nroOperacion],
          s4_fechaPago: this.fb.control(null),*/
          s5_autorizaPersona: this.fb.control(false),
          s5_documentoIdentidad: [''],
          s5_apellidosNombres: [''],
      });

      this.recuperarInformacion();

      setTimeout(() => {
          this.deshabilitarCampos();
          this.acc.expand('formulario004-12-seccion-1');
          this.acc.expand('formulario004-12-seccion-2');
          this.acc.expand('formulario004-12-seccion-3');
          this.acc.expand('formulario004-12-seccion-4');
      });

      this.loadPersona(this.tipoPersona);
      this.validarTupa(this.codigoTupa);

  }

  //*************************************************************************************
  //************************VALIDACION DE CAMPOS DEL FORMULARIO *************************
  //*************************************************************************************

  loadPersona(tipo: number){

    const s1_apellidoPaterno = this.formulario.controls['s1_apellidoPaterno'];
    const s1_apellidoMaterno = this.formulario.controls['s1_apellidoMaterno'];
    const s1_nombres = this.formulario.controls['s1_nombres'];
    const s1_dni = this.formulario.controls['s1_dni'];

    const s1_razonSocial = this.formulario.controls['s1_razonSocial'];
    const s1_nroRuc = this.formulario.controls['s1_nroRuc'];

    const s1_numeroRucOperador = this.formulario.controls['s1_numeroRucOperador'];
    const s1_tipoDocumentoRepresentante = this.formulario.controls['s1_tipoDocumentoRepresentante'];
    const s1_numeroDocumentoRepresentante = this.formulario.controls['s1_numeroDocumentoRepresentante'];
    const s1_razonSocialOperador = this.formulario.controls['s1_razonSocialOperador'];
    const s1_nombresRepresentante = this.formulario.controls['s1_nombresRepresentante'];
    const s1_apellidoPaternoRepresentante = this.formulario.controls['s1_apellidoPaternoRepresentante'];
    const s1_apellidoMaternoRepresentante = this.formulario.controls['s1_apellidoMaternoRepresentante'];
    const s1_domicilioRepresentante = this.formulario.controls['s1_domicilioRepresentante'];
    const s1_nroPartida = this.formulario.controls['s1_nroPartida'];
    const s1_oficinaRegistral = this.formulario.controls['s1_oficinaRegistral'];

    if(tipo==1){

      s1_razonSocial.setValidators(null);
      s1_nroRuc.setValidators(null);

      s1_numeroRucOperador.setValidators(null);
      s1_tipoDocumentoRepresentante.setValidators(null);
      s1_numeroDocumentoRepresentante.setValidators(null);
      s1_razonSocialOperador.setValidators(null);
      s1_nombresRepresentante.setValidators(null);
      s1_apellidoPaternoRepresentante.setValidators(null);
      s1_apellidoMaternoRepresentante.setValidators(null);
      s1_domicilioRepresentante.setValidators(null);
      s1_nroPartida.setValidators(null);
      s1_oficinaRegistral.setValidators(null);

      s1_apellidoPaterno.setValidators([Validators.required]);
      s1_apellidoMaterno.setValidators([Validators.required]);
      s1_nombres.setValidators([Validators.required]);
      s1_dni.setValidators([Validators.required]);

    }if(tipo==2){

      s1_apellidoPaterno.setValidators(null);
      s1_apellidoMaterno.setValidators(null);
      s1_nombres.setValidators(null);
      s1_dni.setValidators(null);

      s1_razonSocial.setValidators([Validators.required]);
      s1_nroRuc.setValidators([Validators.required]);

      s1_numeroRucOperador.setValidators([Validators.required]);
      s1_tipoDocumentoRepresentante.setValidators([Validators.required]);
      s1_numeroDocumentoRepresentante.setValidators([Validators.required]);
      s1_razonSocialOperador.setValidators([Validators.required]);
      s1_nombresRepresentante.setValidators([Validators.required]);
      s1_apellidoPaternoRepresentante.setValidators([Validators.required]);
      s1_apellidoMaternoRepresentante.setValidators([Validators.required]);
      s1_domicilioRepresentante.setValidators([Validators.required]);
      s1_nroPartida.setValidators([Validators.required]);
      s1_oficinaRegistral.setValidators([Validators.required]);

    }else{

      s1_razonSocial.setValidators(null);

      s1_numeroRucOperador.setValidators(null);
      s1_tipoDocumentoRepresentante.setValidators(null);
      s1_numeroDocumentoRepresentante.setValidators(null);
      s1_razonSocialOperador.setValidators(null);
      s1_nombresRepresentante.setValidators(null);
      s1_apellidoPaternoRepresentante.setValidators(null);
      s1_apellidoMaternoRepresentante.setValidators(null);
      s1_domicilioRepresentante.setValidators(null);
      s1_nroPartida.setValidators(null);
      s1_oficinaRegistral.setValidators(null);

      s1_nroRuc.setValidators([Validators.required]);
      s1_apellidoPaterno.setValidators([Validators.required]);
      s1_apellidoMaterno.setValidators([Validators.required]);
      s1_nombres.setValidators([Validators.required]);
      s1_dni.setValidators([Validators.required]);

    }

    s1_apellidoPaterno.updateValueAndValidity();
    s1_apellidoMaterno.updateValueAndValidity();
    s1_nombres.updateValueAndValidity();
    s1_dni.updateValueAndValidity();
    s1_razonSocial.updateValueAndValidity();
    s1_nroRuc.updateValueAndValidity();

    s1_numeroRucOperador.updateValueAndValidity();
    s1_tipoDocumentoRepresentante.updateValueAndValidity();
    s1_numeroDocumentoRepresentante.updateValueAndValidity();
    s1_razonSocialOperador.updateValueAndValidity();
    s1_nombresRepresentante.updateValueAndValidity();
    s1_apellidoPaternoRepresentante.updateValueAndValidity();
    s1_apellidoMaternoRepresentante.updateValueAndValidity();
    s1_domicilioRepresentante.updateValueAndValidity();
    s1_nroPartida.updateValueAndValidity();
    s1_oficinaRegistral.updateValueAndValidity();

  }

  validarTupa(codigoTupa: string){

    const s2_nroPartida = this.formulario.controls['s2_nroPartida'];
    const s2_oficinaRegistral = this.formulario.controls['s2_oficinaRegistral'];
    const s3_memoriaDescriptiva = this.formulario.controls['s3_memoriaDescriptiva'];
    const s3_impactoAmbiental = this.formulario.controls['s3_impactoAmbiental'];
    const s3_habilidadProfesional = this.formulario.controls['s3_habilidadProfesional'];
    const s3_nombreApellido = this.formulario.controls['s3_nombreApellido'];
    const s3_profesion = this.formulario.controls['s3_profesion'];
    const s3_nroColegiatura = this.formulario.controls['s3_nroColegiatura'];

    if(codigoTupa=='DGAC-025'){

      s2_nroPartida.setValidators([Validators.required]);
      s2_oficinaRegistral.setValidators([Validators.required]);
      s3_memoriaDescriptiva.setValidators([Validators.required]);
      s3_impactoAmbiental.setValidators([Validators.required]);
      s3_habilidadProfesional.setValidators([Validators.required]);
      s3_nombreApellido.setValidators([Validators.required]);
      s3_profesion.setValidators([Validators.required]);
      s3_nroColegiatura.setValidators([Validators.required]);

    }else if(codigoTupa=='DGAC-027'){

      s2_nroPartida.setValidators(null);
      s2_oficinaRegistral.setValidators(null);
      s3_impactoAmbiental.setValidators(null);

      s3_memoriaDescriptiva.setValidators([Validators.required]);
      s3_habilidadProfesional.setValidators([Validators.required]);
      s3_nombreApellido.setValidators([Validators.required]);
      s3_profesion.setValidators([Validators.required]);
      s3_nroColegiatura.setValidators([Validators.required]);

    }else if(codigoTupa=='DGAC-026' || codigoTupa=='S-DGAC-012'){

      s2_nroPartida.setValidators(null);
      s2_oficinaRegistral.setValidators(null);
      s3_memoriaDescriptiva.setValidators(null);
      s3_impactoAmbiental.setValidators(null);
      s3_habilidadProfesional.setValidators(null);
      s3_nombreApellido.setValidators(null);
      s3_profesion.setValidators(null);
      s3_nroColegiatura.setValidators(null);

    }

    s2_nroPartida.updateValueAndValidity();
    s2_oficinaRegistral.updateValueAndValidity();
    s3_memoriaDescriptiva.updateValueAndValidity();
    s3_impactoAmbiental.updateValueAndValidity();
    s3_habilidadProfesional.updateValueAndValidity();
    s3_nombreApellido.updateValueAndValidity();
    s3_profesion.updateValueAndValidity();
    s3_nroColegiatura.updateValueAndValidity();

  }

  //npm install ngx-ui-switch --save
  //toggle de la seccion 1 y se importa en formulario_004_12.module y se agrego al angular.json
  onChangeNotificacion(e){
    this.toggle = e;
    console.log(this.toggle);
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 004/12";
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

    if (this.codigoTupa === 'DGAC-025') {

        if (!this.filePdfMemoriaDescriptivaSeleccionado && !this.pathPdfMemoriaDescriptivaSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');

        if (!this.filePdfImpactoAmbientalSeleccionado && !this.pathPdfImpactoAmbientalSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');

        if (!this.filePdfHabilidadProfesionalSeleccionado && !this.pathPdfHabilidadProfesionalSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');

    } else if (this.codigoTupa === 'DGAC-027') {

        if (!this.filePdfMemoriaDescriptivaSeleccionado && !this.pathPdfMemoriaDescriptivaSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');

        if (!this.filePdfHabilidadProfesionalSeleccionado && !this.pathPdfHabilidadProfesionalSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');

    }

    let dataGuardar = {
      id: this.idFormularioMovimiento,
      tramiteReqId: this.dataInput.tramiteReqId,
      codigo: "12",
      formularioId: 4,
      codUsuario: "COD-USU",
      estado: 1,
      metaData: {
        seccion1: {
          personaNatural : this.tipoPersona === 1 || this.tipoPersona === 3 ? true : false,
          personaJuridica : this.tipoPersona === 2 ? true : false,
          razonSocial : this.tipoPersona === 2 ? this.formulario.controls['s1_razonSocial'].value : '',
          apellidoPaterno : this.tipoPersona === 1 || this.tipoPersona === 3 ? this.formulario.controls['s1_apellidoPaterno'].value : '',
          apellidoMaterno : this.tipoPersona === 1 || this.tipoPersona === 3 ? this.formulario.controls['s1_apellidoMaterno'].value : '',
          nombres : this.tipoPersona === 1 || this.tipoPersona === 3 ? this.formulario.controls['s1_nombres'].value : '',
          domicilioLegal : this.formulario.controls['s1_domicilioLegal'].value,
          distrito : this.formulario.controls['s1_distrito'].value,
          provincia : this.formulario.controls['s1_provincia'].value,
          departamento : this.formulario.controls['s1_departamento'].value,
          dni : this.tipoPersona === 1 || this.tipoPersona === 3 ? this.formulario.controls['s1_dni'].value : '',
          cePasaporte : this.formulario.controls['s1_cePasaporte'].value,
          nroRuc : this.tipoPersona === 2 || this.tipoPersona === 3 ? this.formulario.controls['s1_nroRuc'].value : '',
          telefono : this.formulario.controls['s1_telefono'].value,
          celular : this.formulario.controls['s1_celular'].value,
          correo : this.formulario.controls['s1_correo'].value,
          notificacion : this.formulario.controls['s1_notificacion'].value,
          numeroRucOperador : this.formulario.controls['s1_numeroRucOperador'].value,
          razonSocialOperador : this.formulario.controls['s1_razonSocialOperador'].value,
          nombresRepresentante : this.formulario.controls['s1_nombresRepresentante'].value,
          apellidoPaternoRepresentante : this.formulario.controls['s1_apellidoPaternoRepresentante'].value,
          apellidoMaternoRepresentante : this.formulario.controls['s1_apellidoMaternoRepresentante'].value,
          domicilioRepresentante : this.formulario.controls['s1_domicilioRepresentante'].value,
          tipoDocRepresentante : this.formulario.controls['s1_tipoDocumentoRepresentante'].value,
          nroDocRepresentante : this.formulario.controls['s1_numeroDocumentoRepresentante'].value,
          nroPartida : this.formulario.controls['s1_nroPartida'].value,
          oficinaRegistral : this.formulario.controls['s1_oficinaRegistral'].value,
        },
        seccion2: {
          nroPartida : this.formulario.controls['s2_nroPartida'].value,
          oficinaRegistral : this.formulario.controls['s2_oficinaRegistral'].value,
        },
        seccion3: {
          servicioCodigo : this.codigoTupa,
          memoriaDescriptiva : this.formulario.controls['s3_memoriaDescriptiva'].value ? true : false ,
          impactoAmbiental : this.formulario.controls['s3_impactoAmbiental'].value ? true : false ,
          habilidadProfesional : this.formulario.controls['s3_habilidadProfesional'].value ? true : false ,
          fileMemoriaDescriptiva : this.filePdfMemoriaDescriptivaSeleccionado,
          fileImpactoAmbiental : this.filePdfImpactoAmbientalSeleccionado,
          fileHabilidadProfesional : this.filePdfHabilidadProfesionalSeleccionado,
          pathNameMemoriaDescriptiva : this.pathPdfMemoriaDescriptivaSeleccionado,
          pathNameImpactoAmbiental : this.pathPdfImpactoAmbientalSeleccionado,
          pathNameHabilidadProfesional : this.pathPdfHabilidadProfesionalSeleccionado,
          nombreApellido : this.formulario.controls['s3_nombreApellido'].value,
          profesion : this.formulario.controls['s3_profesion'].value,
          nroColegiatura : this.formulario.controls['s3_nroColegiatura'].value,
        },
        /*seccion4: {
          nroRecibo : this.formulario.controls['s4_nroRecibo'].value,
          nroOperacion : this.formulario.controls['s4_nroOperacion'].value,
          fechaPago : this.fechaPago,
        }*/
      }
    }

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idFormularioMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
    .then(() => {

      console.log(JSON.stringify(dataGuardar));

      this.funcionesMtcService.mostrarCargando();

      if (this.idFormularioMovimiento === 0) {
        //GUARDAR:
        this.formularioService.post<any>(dataGuardarFormData)
          .subscribe(
            data => {
              this.funcionesMtcService.ocultarCargando();
              this.idFormularioMovimiento = data.id;

              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;

              this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
              //this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idFormularioMovimiento})`);
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

              this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
              //this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente (idFormularioMovimiento = ${this.idFormularioMovimiento})`);
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

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
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

    inputNumeroRuc(event = undefined) {
      if (event)
        event.target.value = event.target.value.replace(/[^0-9]/g, '');

      this.formulario.controls['s1_tipoDocumentoRepresentante'].setValue('');
      this.formulario.controls['s1_numeroDocumentoRepresentante'].setValue('');
      this.formulario.controls['s1_razonSocialOperador'].setValue('');
      this.formulario.controls['s1_nombresRepresentante'].setValue('');
      this.formulario.controls['s1_apellidoPaternoRepresentante'].setValue('');
      this.formulario.controls['s1_apellidoMaternoRepresentante'].setValue('');
      this.formulario.controls['s1_domicilioRepresentante'].setValue('');
      this.representanteLegal = [];
    }

    getMaxLengthNumeroDocumento() {
        const tipoDocumento: string = this.formulario.controls['s1_tipoDocumentoRepresentante'].value.trim();

        if (tipoDocumento === '1')//DNI
          return 8;
        else if (tipoDocumento === '2')//CE
          return 12;
        return 0
    }

    onChangeMemoriaDescriptiva() {

      this.visibleButtonMemoriaDescriptiva = this.formulario.controls['s3_memoriaDescriptiva'].value;

      if (this.visibleButtonMemoriaDescriptiva === true) {
        this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
          this.visibleButtonMemoriaDescriptiva = false;
          this.formulario.controls['s3_memoriaDescriptiva'].setValue(false);
        });
      } else {
        this.filePdfMemoriaDescriptivaSeleccionado = null;
        this.pathPdfMemoriaDescriptivaSeleccionado = null;
      }
    }

    onChangeImpactoAmbiental() {

      this.visibleButtonImpactoAmbiental = this.formulario.controls['s3_impactoAmbiental'].value;

      if (this.visibleButtonImpactoAmbiental === true) {
        this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
          this.visibleButtonImpactoAmbiental = false;
          this.formulario.controls['s3_impactoAmbiental'].setValue(false);
        });
      } else {
        this.filePdfImpactoAmbientalSeleccionado = null;
        this.pathPdfImpactoAmbientalSeleccionado = null;
      }
    }

    onChangeHabilidadProfesional() {

      this.visibleButtonHabilidadProfesional = this.formulario.controls['s3_habilidadProfesional'].value;

      if (this.visibleButtonHabilidadProfesional === true) {
        this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
          this.visibleButtonHabilidadProfesional = false;
          this.formulario.controls['s3_habilidadProfesional'].setValue(false);
        });
      } else {
        this.filePdfHabilidadProfesionalSeleccionado = null;
        this.pathPdfHabilidadProfesionalSeleccionado = null;
      }
    }

    onChangeInputMemoriaDescriptiva(event) {
      if (event.target.files.length === 0)
        return

      if (event.target.files[0].type !== 'application/pdf') {
        event.target.value = "";
        return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
      }
      this.filePdfMemoriaDescriptivaSeleccionado = event.target.files[0];
      event.target.value = "";
    }

    onChangeInputImpactoAmbiental(event) {
      if (event.target.files.length === 0)
        return

      if (event.target.files[0].type !== 'application/pdf') {
        event.target.value = "";
        return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
      }
      this.filePdfImpactoAmbientalSeleccionado = event.target.files[0];
      event.target.value = "";
    }

    onChangeInputHabilidadProfesional(event) {
      if (event.target.files.length === 0)
        return

      if (event.target.files[0].type !== 'application/pdf') {
        event.target.value = "";
        return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
      }
      this.filePdfHabilidadProfesionalSeleccionado = event.target.files[0];
      event.target.value = "";
    }

    vistaPreviaMemoriaDescriptiva() {

      if (this.pathPdfMemoriaDescriptivaSeleccionado === null){
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(this.filePdfMemoriaDescriptivaSeleccionado);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Memoria Descriptiva";
      }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.pathPdfMemoriaDescriptivaSeleccionado)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Memoria Descriptiva";
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
      }

    }

    vistaPreviaImpactoAmbiental() {

      if (this.pathPdfImpactoAmbientalSeleccionado === null){
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(this.filePdfImpactoAmbientalSeleccionado);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Impacto Ambiental";
      }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.pathPdfImpactoAmbientalSeleccionado)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Impacto Ambiental";
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
      }

    }

    vistaPreviaHabilidadProfesional() {

      if (this.pathPdfHabilidadProfesionalSeleccionado === null){
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(this.filePdfHabilidadProfesionalSeleccionado);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Habilidad Profesional";
      }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.pathPdfHabilidadProfesionalSeleccionado)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Habilidad Profesional";
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
      }

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

            //this.formulario.controls['s1_razonSocial'].setValue(datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());

            this.formulario.controls['s1_domicilioLegal'].setValue(datos.direccion.trim());
            this.formulario.controls['s1_apellidoPaterno'].setValue(datos.apPrimer.trim());
            this.formulario.controls['s1_apellidoMaterno'].setValue(datos.apSegundo.trim());
            this.formulario.controls['s1_nombres'].setValue(datos.prenombres.trim());

            let ubigeo = datos.ubigeo.split('/');
            this.formulario.controls['s1_distrito'].setValue(ubigeo[2].trim());
            this.formulario.controls['s1_provincia'].setValue(ubigeo[1].trim());
            this.formulario.controls['s1_departamento'].setValue(ubigeo[0].trim());

            this.formulario.controls['s1_dni'].setValue(this.dniPersona.trim());

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
            this.habilitarCamposUsuario();
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

            this.formulario.controls['s1_razonSocial'].setValue(datos.razonSocial.trim());

            if (this.tipoPersona === 2) {

                this.formulario.controls['s1_domicilioLegal'].setValue(datos.domicilioLegal.trim());

            }

            this.formulario.controls['s1_distrito'].setValue(datos.nombreDistrito.trim());
            this.formulario.controls['s1_provincia'].setValue(datos.nombreProvincia.trim());
            this.formulario.controls['s1_departamento'].setValue(datos.nombreDepartamento.trim());
            this.formulario.controls['s1_nroRuc'].setValue(datos.nroDocumento.trim());
            this.formulario.controls['s1_correo'].setValue(datos.correo.trim());
            this.formulario.controls['s1_telefono'].setValue(datos.telefono.trim());
            this.formulario.controls['s1_celular'].setValue(datos.celular.trim());

            //this.representanteLegal = datos.representanteLegal;

          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar el Servicio Sunat');
              this.habilitarCamposUsuario();
          }
        );

    }

  recuperarInformacion(){

      //si existe el documento
      if (this.dataInput.rutaDocumento) {
          //RECUPERAMOS LOS DATOS DEL FORMULARIO
          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario004_12Response) => {
              const metaData: any = JSON.parse(dataFormulario.metaData);

              this.idFormularioMovimiento = dataFormulario.formularioId;

              console.log(JSON.stringify(dataFormulario, null, 10));
              console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));

              if( this.tipoPersona === 1 ){

                  this.formulario.get("s1_apellidoPaterno").setValue(metaData.seccion1.apellidoPaterno.trim());
                  this.formulario.get("s1_apellidoMaterno").setValue(metaData.seccion1.apellidoMaterno.trim());
                  this.formulario.get("s1_nombres").setValue(metaData.seccion1.nombres.trim());
                  this.formulario.get("s1_dni").setValue(metaData.seccion1.dni.trim());

              }if( this.tipoPersona === 2 ){

                  this.formulario.get("s1_razonSocial").setValue(metaData.seccion1.razonSocial.trim());
                  this.formulario.get("s1_nroRuc").setValue(metaData.seccion1.nroRuc.trim());

              }else{
                  this.formulario.get("s1_apellidoPaterno").setValue(metaData.seccion1.apellidoPaterno.trim());
                  this.formulario.get("s1_apellidoMaterno").setValue(metaData.seccion1.apellidoMaterno.trim());
                  this.formulario.get("s1_nombres").setValue(metaData.seccion1.nombres.trim());
                  this.formulario.get("s1_dni").setValue(metaData.seccion1.dni.trim());
                  this.formulario.get("s1_nroRuc").setValue(metaData.seccion1.nroRuc.trim());
              }

              this.formulario.get("s1_domicilioLegal").setValue(metaData.seccion1.domicilioLegal.trim());
              this.formulario.get("s1_distrito").setValue(metaData.seccion1.distrito.trim());
              this.formulario.get("s1_provincia").setValue(metaData.seccion1.provincia.trim());
              this.formulario.get("s1_departamento").setValue(metaData.seccion1.departamento.trim());
              this.formulario.get("s1_correo").setValue(metaData.seccion1.correo.trim());
              this.formulario.get("s1_telefono").setValue(metaData.seccion1.telefono.trim());
              this.formulario.get("s1_celular").setValue(metaData.seccion1.celular.trim());
              this.formulario.get("s1_notificacion").setValue(metaData.seccion1.notificacion);
              this.formulario.get("s1_numeroRucOperador").setValue(metaData.seccion1.numeroRucOperador.trim());
              this.formulario.get("s1_razonSocialOperador").setValue(metaData.seccion1.razonSocialOperador.trim());
              this.formulario.get("s1_nombresRepresentante").setValue(metaData.seccion1.nombresRepresentante.trim());
              this.formulario.get("s1_apellidoPaternoRepresentante").setValue(metaData.seccion1.apellidoPaternoRepresentante.trim());
              this.formulario.get("s1_apellidoMaternoRepresentante").setValue(metaData.seccion1.apellidoMaternoRepresentante.trim());
              this.formulario.get("s1_tipoDocumentoRepresentante").setValue(metaData.seccion1.tipoDocRepresentante);
              this.formulario.get("s1_numeroDocumentoRepresentante").setValue(metaData.seccion1.nroDocRepresentante);
              this.formulario.get("s1_domicilioRepresentante").setValue(metaData.seccion1.domicilioRepresentante.trim());
              this.formulario.get("s1_nroPartida").setValue(metaData.seccion1.nroPartida.trim());
              this.formulario.get("s1_oficinaRegistral").setValue(metaData.seccion1.oficinaRegistral.trim());

              this.formulario.get("s2_nroPartida").setValue(metaData.seccion2.nroPartida);
              this.formulario.get("s2_oficinaRegistral").setValue(metaData.seccion2.oficinaRegistral);


              this.formulario.get("s3_servicioCodigo").setValue(metaData.seccion3.servicioCodigo.trim());

              this.formulario.get("s3_memoriaDescriptiva").setValue(metaData.seccion3.memoriaDescriptiva);
              this.formulario.get("s3_impactoAmbiental").setValue(metaData.seccion3.impactoAmbiental);
              this.formulario.get("s3_habilidadProfesional").setValue(metaData.seccion3.habilidadProfesional);

              this.pathPdfMemoriaDescriptivaSeleccionado = metaData.seccion3.pathNameMemoriaDescriptiva;
              this.pathPdfImpactoAmbientalSeleccionado = metaData.seccion3.pathNameImpactoAmbiental;
              this.pathPdfHabilidadProfesionalSeleccionado = metaData.seccion3.pathNameHabilidadProfesional;

              this.visibleButtonMemoriaDescriptiva = true;
              this.visibleButtonImpactoAmbiental = true;
              this.visibleButtonHabilidadProfesional = true;

              this.formulario.get("s3_nombreApellido").setValue(metaData.seccion3.nombreApellido);
              this.formulario.get("s3_profesion").setValue(metaData.seccion3.profesion);
              this.formulario.get("s3_nroColegiatura").setValue(metaData.seccion3.nroColegiatura);

              /*this.formulario.get("s4_nroRecibo").setValue(metaData.seccion4.nroRecibo);
              this.formulario.get("s4_nroOperacion").setValue(metaData.seccion4.nroOperacion);

              if( metaData.seccion4.fechaPago.length > 0 ){

                  this.fechaPago = metaData.seccion4.fechaPago;

                  const fechaPago = metaData.seccion4.fechaPago.split("-");

                  this.selectedDateFechaPago = {
                      day: parseInt(fechaPago[2]),
                      month: parseInt(fechaPago[1]),
                      year: parseInt(fechaPago[0])
                  };

                  this.formulario.get("s4_fechaPago").setValue(this.selectedDateFechaPago);

              }else{

                  this.formulario.get("s4_fechaPago").setValue(null);

              }*/

              this.buscarNumeroRuc();

            },
            error => {
              this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para recuperar los datos guardados del formulario');
                this.habilitarCamposUsuario();
                this.habilitarCamposRepresentante();
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
                    this.recuperarDatosReniec();
                    this.recuperarDatosSunat();
                break;
            }

        }

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

                if (tipoDocumento === '1') {//DNI

                    this.reniecService.getDni(numeroDocumento).subscribe(
                      respuesta => {

                          this.funcionesMtcService.ocultarCargando();

                          const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

                          console.log(JSON.stringify(datos, null, 10));

                          if (datos.prenombres === '')
                            return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

                            this.formulario.controls['s1_nombresRepresentante'].setValue(datos.prenombres.trim());
                            this.formulario.controls['s1_apellidoPaternoRepresentante'].setValue(datos.apPrimer.trim());
                            this.formulario.controls['s1_apellidoMaternoRepresentante'].setValue(datos.apSegundo.trim());
                            this.formulario.controls['s1_domicilioRepresentante'].setValue(datos.direccion.trim());

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

                          this.formulario.controls['s1_nombresRepresentante'].setValue(datos.nombres.trim());
                          this.formulario.controls['s1_apellidoPaternoRepresentante'].setValue(datos.primerApellido.trim());
                          this.formulario.controls['s1_apellidoMaternoRepresentante'].setValue(datos.segundoApellido.trim());

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

    buscarNumeroRuc() {

        const numeroRucOperador: string = this.formulario.controls['s1_numeroRucOperador'].value.trim();

        if (numeroRucOperador.length === 0)
          return this.funcionesMtcService.mensajeError('Debe ingresar un Número de Ruc');
        if (numeroRucOperador.length !== 11)
          return this.funcionesMtcService.mensajeError('DNI debe tener 11 caracteres');

        this.funcionesMtcService.mostrarCargando();

        this.sunatService.getDatosPrincipales(numeroRucOperador).subscribe(
            respuesta => {

              this.funcionesMtcService.ocultarCargando();

              const datos = respuesta;

              if (datos.nroDocumento === "")
                return this.funcionesMtcService.mensajeError('Número de Ruc no encontrado');

              if (!datos.esActivo)
                return this.funcionesMtcService.mensajeError('Debe ingresar un ruc activo, estado actual: ' + datos.desc_estado.trim());

              console.log(JSON.stringify(datos, null, 10));

              this.formulario.controls['s1_razonSocialOperador'].setValue(datos.razonSocial.trim());

              this.representanteLegal = datos.representanteLegal;

            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Error al consultar el Servicio Sunat');
                this.habilitarCamposRepresentante();
            }
          );

    }

    deshabilitarCampos(){
        this.formulario.controls["s1_razonSocial"].disable();
        this.formulario.controls["s1_apellidoPaterno"].disable();
        this.formulario.controls["s1_apellidoMaterno"].disable();
        this.formulario.controls["s1_nombres"].disable();
        this.formulario.controls["s1_domicilioLegal"].disable();
        this.formulario.controls["s1_distrito"].disable();
        this.formulario.controls["s1_provincia"].disable();
        this.formulario.controls["s1_departamento"].disable();
        this.formulario.controls["s1_dni"].disable();
        this.formulario.controls["s1_cePasaporte"].disable();
        this.formulario.controls["s1_nroRuc"].disable();

        this.formulario.controls["s1_razonSocialOperador"].disable();
        this.formulario.controls["s1_nombresRepresentante"].disable();
        this.formulario.controls["s1_apellidoPaternoRepresentante"].disable();
        this.formulario.controls["s1_apellidoMaternoRepresentante"].disable();
    }

    habilitarCamposUsuario(){
        this.formulario.controls["s1_razonSocial"].enable();
        this.formulario.controls["s1_apellidoPaterno"].enable();
        this.formulario.controls["s1_apellidoMaterno"].enable();
        this.formulario.controls["s1_nombres"].enable();
        this.formulario.controls["s1_domicilioLegal"].enable();
        this.formulario.controls["s1_distrito"].enable();
        this.formulario.controls["s1_provincia"].enable();
        this.formulario.controls["s1_departamento"].enable();
        this.formulario.controls["s1_dni"].enable();
        this.formulario.controls["s1_cePasaporte"].enable();
        this.formulario.controls["s1_nroRuc"].enable();
    }

    habilitarCamposRepresentante(){
        this.formulario.controls["s1_razonSocialOperador"].enable();
        this.formulario.controls["s1_nombresRepresentante"].enable();
        this.formulario.controls["s1_apellidoPaternoRepresentante"].enable();
        this.formulario.controls["s1_apellidoMaternoRepresentante"].enable();
        this.formulario.controls["s1_tipoDocumentoRepresentante"].enable();
        this.formulario.controls["s1_numeroDocumentoRepresentante"].enable();
    }

    validarPago(){
        //si no existe el documento
        if (this.dataInput.movId === 0) {

            this.tramiteService.getPago(this.tramiteId).subscribe(
              respuesta => {

                this.funcionesMtcService.ocultarCargando();

                const datos = respuesta;

                console.log(JSON.stringify(datos, null, 10));

                //if(datos.obligatorio){
                if(datos==null){

                  console.log("9no debugger")
                    this.activeModal.close(this.graboUsuario);
                    this.funcionesMtcService.mensajeError('Primero debe realizar el pago por derecho de trámite');
                    return;

                }else{
                    if(datos.numeroOperacion === null || datos.numeroOperacion === ''){

            console.log("10mo debugger")
                      this.activeModal.close(this.graboUsuario);
                      this.funcionesMtcService.mensajeError('Primero debe realizar el pago por derecho de trámite');
                      return;
                    }else{

                      this.nroRecibo = datos.codigoTributo + '-' + datos.codigoOficina;
                      this.nroOperacion = datos.numeroOperacion;
                      this.fechaPago = datos.fechaPago.substr(0,10);

					  this.cargarInformacionPago();

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

    cargarInformacionPago(){
        //si no existe el documento
        if (this.dataInput.movId === 0) {
            //cargar la fecha si es un nuevo registro

            /*const fechaPago = this.fechaPago.split("-");

            this.selectedDateFechaPago = {
                day: parseInt(fechaPago[2]),
                month: parseInt(fechaPago[1]),
                year: parseInt(fechaPago[0])
            };

            this.formulario.get("s4_nroRecibo").setValue(this.nroRecibo);
            this.formulario.get("s4_nroOperacion").setValue(this.nroOperacion);
            this.formulario.get("s4_fechaPago").setValue(this.selectedDateFechaPago);*/
        }
    }

}
