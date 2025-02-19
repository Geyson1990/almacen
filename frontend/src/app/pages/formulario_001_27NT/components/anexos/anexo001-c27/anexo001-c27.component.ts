import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_C27Request } from 'src/app/core/models/Anexos/Anexo001_C27NT/Anexo001_C27Request';
import { Anexo001_C27Response } from 'src/app/core/models/Anexos/Anexo001_C27NT/Anexo001_C27Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001C27NTService } from 'src/app/core/services/anexos/anexo001-c27NT.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { MetaData as MetaDataForm} from 'src/app/core/models/Formularios/Formulario001_27NT/MetaData';
import { HojaDatos, MetaData } from 'src/app/core/models/Anexos/Anexo001_C27NT/MetaData';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { Empresa, RepresentanteLegal } from 'src/app/core/models/Anexos/Anexo001_C27NT/Secciones';
import { RepresentanteLegal as RepresentanteLegalSunat } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';

@Component({
  selector: 'app-anexo001-c27',
  templateUrl: './anexo001-c27.component.html',
  styleUrls: ['./anexo001-c27.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Anexo001C27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  listaHojaDatos: HojaDatos[] = []

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'D.N.I.' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];

  listaOficinasRegistrales: OficinaRegistralModel[];
  listaDepartamentos:Array<any>
  listaProvincias:Array<any>
  listaDistritos:Array<any>

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 001-C/27 - HOJA DE DATOS PERSONALES Y DECLARACIÓN JURADA PARA CONCESIÓN ÚNICA'
  txtTituloHelp = 'Del representante legal de la persona jurídica solicitante. En caso que esta tenga como socio o accionista a una persona jurídica, el representante legal de esta última deberá llenar este anexo'

  _tipoDeclarante = Object.freeze({ solicitante: {value:1, text: "Solicitante"}, socio: {value:2, text: "Socio/Accionista"} })

  dia:string
  mes:string
  anio:string

  formulario: UntypedFormGroup;
  formularioDeclarante: UntypedFormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;
  modalRefDeclarante: NgbModalRef
  SolicitanteEmpresa:Empresa
  SolicitanteListaRepresentantes:  RepresentanteLegalSunat[] = [];
  SocioListaRepresentantes: RepresentanteLegalSunat[] = [];
  maxLengthNroDocumento:number = 0

  habilitarBusquedaEmpresa:boolean = true
  habilitarBusquedaRepresentante:boolean = true

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001C27NTService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private oficinaRegistralService: OficinaRegistralService,
    private sunatService: SunatService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private ubigeoService: UbigeoService
  ) {

    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

    this.oficinaRegistralService.oficinaRegistral().subscribe((response:any) => {
      this.listaOficinasRegistrales = response.map(data => ({ id: data.value, descripcion: data.text } as OficinaRegistralModel) )
    })

    // TRAER DATOS DE LOS REPRESENTANTES LEGALES DE LA PERSONA JURIDICA SOLICITANTE
    this.sunatService.getDatosPrincipales(this.seguridadService.getCompanyCode())
    .subscribe(async(response) => {
      this.SolicitanteListaRepresentantes = response.representanteLegal;
    })

    this.ubigeoService.departamento().subscribe((response) => {
      this.listaDepartamentos = response
    })

  }

  ngOnInit(): void {
    console.dir(this.dataInput)
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;
    this.tramiteReqId = this.dataInput.tramiteReqId;

    this.dia = this.Dia
    this.mes = this.Mes
    this.anio = this.Anio

    this.setForm();

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.anexoTramiteService.get<Anexo001_C27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;

          //SET DATOS DE LA EMPRESA SOLICITANTE
          this.SolicitanteEmpresa = metaData.hojaDatos[0].seccion2.empresa as Empresa

          //SET DATOS EDITAR
          this.listaHojaDatos = metaData.hojaDatos;
          this.Declaracion1Solicitante.setValue(metaData.hojaDatos[0].seccion3.declaracion1);
          this.Declaracion2Solicitante.setValue(metaData.hojaDatos[0].seccion3.declaracion2);

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });

    }else{
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          const metaDataForm = JSON.parse(dataForm.metaData) as MetaDataForm;

          if(metaDataForm.seccion3.tipoSolicitante != 'PJ'){
            this.modalService.dismissAll();
            this.funcionesMtcService.mensajeError('El solicitante no es Persona Jurídica')
          }

          //SET DATOS DE LA EMPRESA SOLICITANTE
          this.SolicitanteEmpresa = metaDataForm.seccion3 as Empresa

          //SET PRIMEROS DATOS
          const data: HojaDatos = new HojaDatos();
          data.seccion1.tipoDeclarante = this._tipoDeclarante.solicitante.value
          data.seccion2.empresa = metaDataForm.seccion3 as Empresa
          data.seccion2.representante = metaDataForm.seccion3.representanteLegal as RepresentanteLegal

          this.listaHojaDatos.push(data);

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario');
        }
      );
    }
  }

  setForm() {
    this.formulario = this.fb.group({
      Declaracion1Solicitante: [false, [Validators.requiredTrue]],
      Declaracion2Solicitante: [false, [Validators.requiredTrue]],
    });
  }

  setFormDeclarante() {
    this.formularioDeclarante = this.fb.group({
      Id: [null],
      TipoDeclarante: [null, [Validators.required]],
      Empresa: this.fb.group({
        Ruc: [{value:'', disabled:true}, [Validators.required, Validators.pattern("^[0-9]*$"), exactLengthValidator([11])]],
        RazonSocial: [{value:'', disabled:true}, [Validators.required]],
        DomicilioLegal: [{value:'', disabled:true}, [Validators.required, Validators.maxLength(200)]],
        Departamento: [{value:'', disabled:true}, [Validators.required]],
        Provincia: [{value:'', disabled:true}, [Validators.required]],
        Distrito: [{value:'', disabled:true}, [Validators.required]],
      }),
      Representante: this.fb.group({
        IdTipoDocumento: ['', [Validators.required]],
        NumeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        Nombres: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        ApellidoPaterno: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        ApellidoMaterno: [{value:'', disabled:true}, [noWhitespaceValidator(), Validators.maxLength(50)]],
        DomicilioLegal: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]],
        Departamento: [{value:'', disabled:true}, [Validators.required]],
        Provincia: [{value:'', disabled:true}, [Validators.required]],
        Distrito: [{value:'', disabled:true}, [Validators.required]],
        Telefono: ['', [Validators.maxLength(9)]],
        Celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
        Email: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(30)]],
        Partida: ['', [Validators.required,  Validators.maxLength(15)]],
        Asiento: ['', [Validators.required,  Validators.maxLength(15)]],
        IdOficinaRegistral: ['', [Validators.required]],
      }),
      Declaracion1: [false, [Validators.requiredTrue]],
      Declaracion2: [false, [Validators.requiredTrue]],
    });
  }

  get Declaracion1Solicitante(): AbstractControl { return this.formulario.get(['Declaracion1Solicitante']); }
  get Declaracion2Solicitante(): AbstractControl { return this.formulario.get(['Declaracion2Solicitante']); }

  get Id(): AbstractControl { return this.formularioDeclarante.get(['Id']); }
  get TipoDeclarante(): AbstractControl { return this.formularioDeclarante.get(['TipoDeclarante']); }
  get FormEmpresa(): UntypedFormGroup {             return this.formularioDeclarante.get('Empresa') as UntypedFormGroup; }
  get FormRepresentante(): UntypedFormGroup {             return this.formularioDeclarante.get('Representante') as UntypedFormGroup; }
  get Emp_Ruc(): AbstractControl {             return this.formularioDeclarante.get('Empresa.Ruc'); }
  get Emp_RazonSocial(): AbstractControl {     return this.formularioDeclarante.get('Empresa.RazonSocial'); }
  get Emp_DomicilioLegal(): AbstractControl {  return this.formularioDeclarante.get('Empresa.DomicilioLegal'); }
  get Emp_Departamento(): AbstractControl {    return this.formularioDeclarante.get('Empresa.Departamento'); }
  get Emp_Provincia(): AbstractControl {       return this.formularioDeclarante.get('Empresa.Provincia'); }
  get Emp_Distrito(): AbstractControl {        return this.formularioDeclarante.get('Empresa.Distrito'); }
  get Rep_IdTipoDocumento(): AbstractControl {    return this.formularioDeclarante.get('Representante.IdTipoDocumento'); }
  get Rep_NumeroDocumento(): AbstractControl {    return this.formularioDeclarante.get('Representante.NumeroDocumento'); }
  get Rep_Nombres(): AbstractControl {            return this.formularioDeclarante.get('Representante.Nombres'); }
  get Rep_ApellidoPaterno(): AbstractControl {    return this.formularioDeclarante.get('Representante.ApellidoPaterno'); }
  get Rep_ApellidoMaterno(): AbstractControl {    return this.formularioDeclarante.get('Representante.ApellidoMaterno'); }
  get Rep_Telefono(): AbstractControl {           return this.formularioDeclarante.get('Representante.Telefono'); }
  get Rep_Celular(): AbstractControl {            return this.formularioDeclarante.get('Representante.Celular'); }
  get Rep_Email(): AbstractControl {              return this.formularioDeclarante.get('Representante.Email'); }
  get Rep_DomicilioLegal(): AbstractControl {     return this.formularioDeclarante.get('Representante.DomicilioLegal'); }
  get Rep_Departamento(): AbstractControl {       return this.formularioDeclarante.get('Representante.Departamento'); }
  get Rep_Provincia(): AbstractControl {          return this.formularioDeclarante.get('Representante.Provincia'); }
  get Rep_Distrito(): AbstractControl {           return this.formularioDeclarante.get('Representante.Distrito'); }
  get Rep_Partida(): AbstractControl {            return this.formularioDeclarante.get('Representante.Partida'); }
  get Rep_Asiento(): AbstractControl {            return this.formularioDeclarante.get('Representante.Asiento'); }
  get Rep_IdOficinaRegistral(): AbstractControl { return this.formularioDeclarante.get('Representante.IdOficinaRegistral'); }
  get Declaracion1(): AbstractControl { return this.formularioDeclarante.get(['Declaracion1']); }
  get Declaracion2(): AbstractControl { return this.formularioDeclarante.get(['Declaracion2']); }


  get Dia(): string { return ('0' + (new Date().getDate())).slice(-2); }
  get Mes(): string {
    switch (new Date().getMonth()) {
      case 0: return 'Enero';
      case 1: return 'Febrero';
      case 2: return 'Marzo';
      case 3: return 'Abril';
      case 4: return 'Mayo';
      case 5: return 'Junio';
      case 6: return 'Julio';
      case 7: return 'Agosto';
      case 8: return 'Setiembre';
      case 9: return 'Octubre';
      case 10: return 'Noviembre';
      case 11: return 'Diciembre';
    }
  }
  get Anio(): string { return new Date().getFullYear().toString(); }

  get OficinaRegistralDescripcion(){
    return this.listaOficinasRegistrales.find(item => item.id === this.Rep_IdOficinaRegistral.value)?.descripcion
  }

  abrirModalDeclarante(content:any, idx:number|null=null) {
    this.setFormDeclarante();
    this.listaProvincias = []
    this.listaDistritos = []
    this.modalRefDeclarante =  this.modalService.open(content, { centered: false, size:"lg", scrollable: true, keyboard:true });

    if(idx && idx > -1) {
      this.habilitarBusquedaEmpresa = false
      this.habilitarBusquedaRepresentante = false
      this.SocioListaRepresentantes = [];

      this.Id.setValue(idx)
      this.TipoDeclarante.setValue(this.listaHojaDatos[idx].seccion1.tipoDeclarante.toString())
      this.Emp_Ruc.setValue(this.listaHojaDatos[idx].seccion2.empresa.ruc)
      this.Emp_RazonSocial.setValue(this.listaHojaDatos[idx].seccion2.empresa.razonSocial)
      this.Emp_DomicilioLegal.setValue(this.listaHojaDatos[idx].seccion2.empresa.domicilioLegal)
      this.Emp_Departamento.setValue(this.listaHojaDatos[idx].seccion2.empresa.departamento)
      this.Emp_Provincia.setValue(this.listaHojaDatos[idx].seccion2.empresa.provincia)
      this.Emp_Distrito.setValue(this.listaHojaDatos[idx].seccion2.empresa.distrito)
      this.Rep_IdTipoDocumento.setValue(this.listaHojaDatos[idx].seccion2.representante.tipoDocumento.id)
      this.changeTipoDocumento(this.Rep_IdTipoDocumento.value)
      this.Rep_NumeroDocumento.setValue(this.listaHojaDatos[idx].seccion2.representante.numeroDocumento)
      this.Rep_Nombres.setValue(this.listaHojaDatos[idx].seccion2.representante.nombres)
      this.Rep_ApellidoPaterno.setValue(this.listaHojaDatos[idx].seccion2.representante.apellidoPaterno)
      this.Rep_ApellidoMaterno.setValue(this.listaHojaDatos[idx].seccion2.representante.apellidoMaterno)
      this.Rep_Telefono.setValue(this.listaHojaDatos[idx].seccion2.representante.telefono)
      this.Rep_Celular.setValue(this.listaHojaDatos[idx].seccion2.representante.celular)
      this.Rep_Email.setValue(this.listaHojaDatos[idx].seccion2.representante.email)
      this.Rep_DomicilioLegal.setValue(this.listaHojaDatos[idx].seccion2.representante.domicilioLegal)

      const {departamento, provincia, distrito} = this.listaHojaDatos[idx].seccion2.representante
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)

      this.Rep_Partida.setValue(this.listaHojaDatos[idx].seccion2.representante.partida)
      this.Rep_Asiento.setValue(this.listaHojaDatos[idx].seccion2.representante.asiento)
      this.Rep_IdOficinaRegistral.setValue(this.listaHojaDatos[idx].seccion2.representante.oficinaRegistral.id)
      this.Declaracion1.setValue(this.listaHojaDatos[idx].seccion3.declaracion1)
      this.Declaracion2.setValue(this.listaHojaDatos[idx].seccion3.declaracion2)

      if(this.TipoDeclarante.value == "1")
        this.Emp_Ruc.disable()
      else
        this.Emp_Ruc.enable()
    }
  }

  changeDeclarante() {
    console.dir("changeDeclarante")
    this.FormEmpresa.reset()
    this.FormRepresentante.reset()
    this.Rep_IdTipoDocumento.setValue("")
    this.Rep_IdOficinaRegistral.setValue("")

    if(this.TipoDeclarante.value == "1"){ // Representante Legal de la Solicitante
      this.Emp_Ruc.setValue(this.SolicitanteEmpresa.ruc)
      this.Emp_RazonSocial.setValue(this.SolicitanteEmpresa.razonSocial)
      this.Emp_DomicilioLegal.setValue(this.SolicitanteEmpresa.domicilioLegal)
      this.Emp_Departamento.setValue(this.SolicitanteEmpresa.departamento)
      this.Emp_Provincia.setValue(this.SolicitanteEmpresa.provincia)
      this.Emp_Distrito.setValue(this.SolicitanteEmpresa.distrito)
      this.Emp_Ruc.disable()
    }else{ // Representante Legal del Socio o Accionista de la Solicitante
      this.SocioListaRepresentantes = [];
      this.Emp_Ruc.enable()
      this.Emp_Departamento.disable()
    }
  }

  buscarEmpresa(ruc:string){
    if(!this.habilitarBusquedaEmpresa)
      return;
    if(ruc.length !== 11)
      return this.funcionesMtcService.mensajeError('Debe ingresar 11 caracteres');
    if(ruc.substring(0,2) != '20')
      return this.funcionesMtcService.mensajeError('El RUC debe empezar con 20');

    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getDatosPrincipales(ruc)
    .subscribe(async(response) => {
      this.habilitarBusquedaEmpresa=false
      this.funcionesMtcService.ocultarCargando();

      const {razonSocial, domicilioLegal, nombreDepartamento, nombreProvincia, nombreDistrito, esActivo, representanteLegal} = response

      if(!esActivo)
        return this.funcionesMtcService.mensajeError('El RUC se encuentra inactivo');

      this.addEmpresa(razonSocial, domicilioLegal, nombreDepartamento, nombreProvincia, nombreDistrito)
      this.SocioListaRepresentantes = representanteLegal
      console.dir(this.SocioListaRepresentantes)

    }, (error) => {
      this.habilitarBusquedaEmpresa=true
      this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el servicio de Sunat. Por favor inténtelo más tarde');
    })
  }

  buscarRepresentanteLegal(tipoDocumento: string, numeroDocumento: string) {
    if(!this.habilitarBusquedaRepresentante)
      return;
    if(this.FormEmpresa.invalid)
      return this.funcionesMtcService.mensajeError('Primero ingrese los datos de la Persona Jurídica');
    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    const representantesLegales: Array<RepresentanteLegalSunat> = this.TipoDeclarante.value=='1'?this.SolicitanteListaRepresentantes:this.SocioListaRepresentantes // Representante Legal de la

    const existe = representantesLegales.find(r => ('0' + r.tipoDocumento.trim()).toString() === tipoDocumento && r.nroDocumento.trim() === numeroDocumento);

    if (existe) {
      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '01') {// DNI
        this.reniecService.getDni(numeroDocumento).subscribe((response) => {
          this.habilitarBusquedaRepresentante = false
          this.funcionesMtcService.ocultarCargando();

          if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const {prenombres, apPrimer, apSegundo, direccion, ubigeo} = response.reniecConsultDniResponse.listaConsulta.datosPersona
          this.addRepresentante(prenombres, apPrimer, apSegundo, direccion, ubigeo.split('/')[0], ubigeo.split('/')[1], ubigeo.split('/')[2])

        }, (error) => {
          this.habilitarBusquedaRepresentante = true
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el servicio de Reniec').then(() => {
            this.funcionesMtcService.mensajeConfirmar("¿Desea agregar los datos manualmente?").then(() => {
              this.habilitarBusquedaRepresentante = false
              this.Rep_Nombres.enable()
              this.Rep_ApellidoPaterno.enable()
              this.Rep_ApellidoMaterno.enable()
              this.Rep_DomicilioLegal.enable()
              this.Rep_Departamento.enable()
              this.Rep_Provincia.enable()
              this.Rep_Distrito.enable()
            })
          });
        });
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
        this.extranjeriaService.getCE(numeroDocumento).subscribe((response) => {
          this.habilitarBusquedaRepresentante = false
          this.funcionesMtcService.ocultarCargando();

          if (response.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones')

          const {nombres, primerApellido, segundoApellido} = response.CarnetExtranjeria
          this.addRepresentante(nombres, primerApellido, segundoApellido, "", "", "", "")

        }, (error) => {
          this.habilitarBusquedaRepresentante = true
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio').then(() => {
            this.funcionesMtcService.mensajeConfirmar("¿Desea agregar los datos manualmente?").then(() => {
              this.Rep_Nombres.enable()
              this.Rep_ApellidoPaterno.enable()
              this.Rep_ApellidoMaterno.enable()
              this.Rep_DomicilioLegal.enable()
              this.Rep_Departamento.enable()
              this.Rep_Provincia.enable()
              this.Rep_Distrito.enable()
            })
          });
        })
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }

  addEmpresa(razonSocial:string, domicilio:string, departamento:string, provincia:string, distrito:string ){
    this.Emp_RazonSocial.setValue(razonSocial)
    this.Emp_DomicilioLegal.setValue(domicilio)
    this.Emp_Departamento.setValue(departamento)
    this.Emp_Provincia.setValue(provincia)
    this.Emp_Distrito.setValue(distrito)
  }

  addRepresentante(nombres:string, apePaterno:string, apeMaterno:string, domicilio:string, departamento:string, provincia:string, distrito:string ){
    this.Rep_Nombres.setValue(nombres)
    this.Rep_ApellidoPaterno.setValue(apePaterno)
    this.Rep_ApellidoMaterno.setValue(apeMaterno)
    this.Rep_DomicilioLegal.setValue(domicilio)

    // this.Rep_Departamento.setValue(departamento)
    // this.Rep_Provincia.setValue(provincia)
    // this.Rep_Distrito.setValue(distrito)

    if(nombres == "") this.Rep_Nombres.enable(); else this.Rep_Nombres.disable()
    if(apePaterno == "") this.Rep_ApellidoPaterno.enable(); else this.Rep_ApellidoPaterno.disable()
    if(apeMaterno == "") this.Rep_ApellidoMaterno.enable(); else this.Rep_ApellidoMaterno.disable()
    if(domicilio == "") this.Rep_DomicilioLegal.enable(); else this.Rep_DomicilioLegal.disable()
    // if(departamento == "") this.Rep_Departamento.enable(); else this.Rep_Departamento.disable()
    // if(provincia == "") this.Rep_Provincia.enable(); else this.Rep_Provincia.disable()
    // if(distrito == "") this.Rep_Distrito.enable(); else this.Rep_Distrito.disable()
    if(departamento != "" && provincia != "" && distrito != "")
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)
  }

  changeTipoDocumento(value: string) {
    this.Rep_NumeroDocumento.reset()
    if(value == "01"){
      this.maxLengthNroDocumento = 8
      this.Rep_NumeroDocumento.enable()
      this.Rep_NumeroDocumento.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(8)])
    }else if(value == "04"){
      this.maxLengthNroDocumento = 15
      this.Rep_NumeroDocumento.enable()
      this.Rep_NumeroDocumento.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(15)])
    }else{
      this.Rep_NumeroDocumento.disable()
    }
  }

  resetDatosRepresentante(){
    this.listaProvincias = []
    this.listaDistritos = []

    this.Rep_Nombres.reset()
    this.Rep_ApellidoPaterno.reset()
    this.Rep_ApellidoMaterno.reset()
    this.Rep_DomicilioLegal.reset()
    this.Rep_Departamento.setValue("")
    this.Rep_Provincia.setValue("")
    this.Rep_Distrito.setValue("")

    this.Rep_Nombres.disable()
    this.Rep_ApellidoPaterno.disable()
    this.Rep_ApellidoMaterno.disable()
    this.Rep_DomicilioLegal.disable()
    this.Rep_Departamento.disable()
    this.Rep_Provincia.disable()
    this.Rep_Distrito.disable()
  }

  onInputRuc(){
    this.habilitarBusquedaEmpresa = true
    this.Emp_RazonSocial.reset()
    this.Emp_DomicilioLegal.reset()
    this.Emp_Departamento.reset()
    this.Emp_Provincia.reset()
    this.Emp_Distrito.reset()
    this.FormRepresentante.reset()
    this.Rep_IdTipoDocumento.setValue("")
    this.Rep_IdOficinaRegistral.setValue("")
  }

  onInputNroDoc(){
    console.dir('onInputNroDoc')
    this.habilitarBusquedaRepresentante = true
    this.resetDatosRepresentante()
  }

  onPressEnterRuc(event:any, ruc:string) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 13)
      this.buscarEmpresa(ruc)
  }

  onPressEnterNroDoc(event:any, tipoDoc:string, nroDoc:string) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 13)
      this.buscarRepresentanteLegal(tipoDoc, nroDoc)
  }

  onChangeDepartamento(codDepartamento: string){
    if(codDepartamento != ""){
      this.ubigeoService.provincia(Number(codDepartamento)).subscribe((data) => {
        this.listaProvincias = data;
        this.Rep_Provincia.setValue("");
      });
    }else{
      this.listaProvincias = [];
      this.Rep_Provincia.setValue("");
    }

    this.listaDistritos = [];
    this.Rep_Distrito.setValue("");
  }

  onChangeProvincia(codDepartamento: string, codProvincia: string){
    if(codDepartamento != "" && codProvincia != ""){
      this.ubigeoService.distrito(Number(codDepartamento), Number(codProvincia)).subscribe((data) => {
        this.listaDistritos = data;
        this.Rep_Distrito.setValue("");
      });
    }else{
      this.listaDistritos = [];
      this.Rep_Distrito.setValue("");
    }
  }

  setUbigeoTextRepresentante(departamento:string, provincia:string, distrito:string){
    const idxDep = this.listaDepartamentos.findIndex(item => this.campareStrings(item.text, departamento));
    if(idxDep > -1){
      const codDepartamento = this.listaDepartamentos[idxDep].value;
      this.Rep_Departamento.setValue(codDepartamento);

      this.ubigeoService.provincia(codDepartamento).subscribe((provincias) => {
        this.listaProvincias = provincias;

        //Buscar Provincia
        const idxProv = this.listaProvincias.findIndex(item => this.campareStrings(item.text, provincia));
        if(idxProv > -1){
          const codProvincia = this.listaProvincias[idxProv].value;
          this.Rep_Provincia.setValue(codProvincia);

          this.ubigeoService.distrito(codDepartamento, codProvincia).subscribe((distritos) => {
            this.listaDistritos = distritos;

            //Buscar Distritos
            const idxDist = this.listaDistritos.findIndex(item => this.campareStrings(item.text, distrito));
            if(idxDist > -1){
              const codDistrito = this.listaDistritos[idxDist].value;
              this.Rep_Distrito.setValue(codDistrito);
            }else{
              this.Rep_Distrito.enable();
            }
          });
        }else{
          this.Rep_Provincia.enable();
          this.Rep_Distrito.enable();
        }
      });
    }else{
      this.Rep_Departamento.enable();
      this.Rep_Provincia.enable();
      this.Rep_Distrito.enable();
    }
  }

  //==============================================================================
  //==============================================================================

  guardarDeclarante() {
    if(this.formularioDeclarante.invalid)
      return this.funcionesMtcService.mensajeError("Complete los campos obligatorios")

    const data: HojaDatos = new HojaDatos();

    data.seccion1.tipoDeclarante = this.TipoDeclarante.value
    data.seccion2.empresa.ruc = this.Emp_Ruc.value
    data.seccion2.empresa.razonSocial = this.Emp_RazonSocial.value
    data.seccion2.empresa.domicilioLegal= this.Emp_DomicilioLegal.value
    data.seccion2.empresa.departamento = this.Emp_Departamento.value
    data.seccion2.empresa.provincia = this.Emp_Provincia.value
    data.seccion2.empresa.distrito = this.Emp_Distrito.value

    data.seccion2.representante.nombres = this.Rep_Nombres.value.trim().toUpperCase()
    data.seccion2.representante.apellidoPaterno = this.Rep_ApellidoPaterno.value.trim().toUpperCase()
    data.seccion2.representante.apellidoMaterno = this.Rep_ApellidoMaterno.value.trim().toUpperCase()
    data.seccion2.representante.tipoDocumento = this.listaTiposDocumentos.find(item => item.id === this.Rep_IdTipoDocumento.value)
    data.seccion2.representante.numeroDocumento = this.Rep_NumeroDocumento.value
    data.seccion2.representante.telefono = this.Rep_Telefono.value
    data.seccion2.representante.celular = this.Rep_Celular.value
    data.seccion2.representante.email = this.Rep_Email.value.trim().toUpperCase()
    data.seccion2.representante.domicilioLegal = this.Rep_DomicilioLegal.value.trim().toUpperCase()
    data.seccion2.representante.departamento = this.listaDepartamentos.find(item => item.value === this.Rep_Departamento.value).text
    data.seccion2.representante.provincia = this.listaProvincias.find(item => item.value === this.Rep_Provincia.value).text
    data.seccion2.representante.distrito = this.listaDistritos.find(item => item.value === this.Rep_Distrito.value).text
    data.seccion2.representante.partida = this.Rep_Partida.value.trim().toUpperCase()
    data.seccion2.representante.asiento = this.Rep_Asiento.value.trim().toUpperCase()
    data.seccion2.representante.oficinaRegistral = this.listaOficinasRegistrales.find(item => item.id === this.Rep_IdOficinaRegistral.value)
    data.seccion3.declaracion1 = this.Declaracion1.value
    data.seccion3.declaracion2 = this.Declaracion2.value
    data.seccion3.dia = this.Dia
    data.seccion3.mes = this.Mes
    data.seccion3.anio = this.Anio

    const idxExistente:number = this.listaHojaDatos.findIndex(x =>
                                  x.seccion2.empresa.ruc === this.Emp_Ruc.value
                                  && x.seccion2.representante.tipoDocumento.id === this.Rep_IdTipoDocumento.value
                                  && x.seccion2.representante.numeroDocumento === this.Rep_NumeroDocumento.value)

    if(this.Id.value && this.Id.value > -1){
      if(idxExistente > -1 && idxExistente !== this.Id.value)
        return this.funcionesMtcService.mensajeError("El Rep. Legal ya existe en la lista")

      this.listaHojaDatos[this.Id.value] = data
    }else {
      if(idxExistente > -1)
        return this.funcionesMtcService.mensajeError("El Rep. Legal ya existe en la lista")

      this.listaHojaDatos.push(data);
    }

    this.modalRefDeclarante.close();

    this.funcionesMtcService.mensajeOk(`Se ${this.Id.value && this.Id.value>-1 ? 'modificaron' : 'agregaron'} los datos correctamente`)
  }

  eliminarDeclarante(index: any) {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro que desea eliminar este registro?', 'Eliminar')
    .then(() => {
      this.listaHojaDatos.splice(index, 1);
    });
  }

  guardarAnexo() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    if (this.listaHojaDatos.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos un declarante a la lista');

    this.listaHojaDatos[0].seccion3.declaracion1 = this.Declaracion1Solicitante.value
    this.listaHojaDatos[0].seccion3.declaracion2 = this.Declaracion2Solicitante.value
    this.listaHojaDatos[0].seccion3.dia = this.Dia
    this.listaHojaDatos[0].seccion3.mes = this.Mes
    this.listaHojaDatos[0].seccion3.anio = this.Anio

    const dataGuardar: Anexo001_C27Request = new Anexo001_C27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "C";
    dataGuardar.tramiteReqId = this.tramiteReqId;
    dataGuardar.metaData.hojaDatos = this.listaHojaDatos

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    let msgPregunta: string = `¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;

    if(this.listaHojaDatos.length === 1){
      const {nombres, apellidoPaterno, apellidoMaterno} = this.listaHojaDatos[0].seccion2.representante
      msgPregunta = `No ha ingresado más personas. Éste documento sólo se generará para ${nombres} ${apellidoPaterno} ${apellidoMaterno}
      ¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;
    }

    this.funcionesMtcService.mensajeConfirmar(msgPregunta)
    .then(() => {

      this.funcionesMtcService.mostrarCargando();

      if (this.id === 0) {
        //GUARDAR:
        this.anexoService.post<any>(dataGuardarFormData)
        .subscribe( data => {
            this.funcionesMtcService.ocultarCargando();
            this.id = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
        },
        error => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
        });
      } else {
        //MODIFICAR
        this.anexoService.put<any>(dataGuardarFormData)
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
    });
  }

  descargarPdf() {
    if (this.id === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    if (!this.uriArchivo || this.uriArchivo === '' || this.uriArchivo == null)
      return this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-C/27";
        },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  formInvalid(control: AbstractControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }

  soloNumeros(event : any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  campareStrings(str1:string, str2:string) {
    const cadena1 = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const cadena2 = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    return cadena1 === cadena2 ? true : false;
  }

}
