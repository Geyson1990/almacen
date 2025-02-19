import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_D27Request } from 'src/app/core/models/Anexos/Anexo001_D27NT/Anexo001_D27Request';
import { Anexo001_D27Response } from 'src/app/core/models/Anexos/Anexo001_D27NT/Anexo001_D27Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001D27NTService } from 'src/app/core/services/anexos/anexo001-d27NT.service';
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
import { HojaDatos, MetaData } from 'src/app/core/models/Anexos/Anexo001_D27NT/MetaData';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Seccion1 } from 'src/app/core/models/Anexos/Anexo001_D27NT/Secciones';
import { noWhitespaceValidator } from 'src/app/helpers/validator';

@Component({
  selector: 'app-anexo001-d27',
  templateUrl: './anexo001-d27.component.html',
  styleUrls: ['./anexo001-d27.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Anexo001D27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  listaHojaDatos: HojaDatos[] = []

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'D.N.I.' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];

  listaDepartamentos:Array<any>
  listaProvincias:Array<any>
  listaDistritos:Array<any>

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 001-D/27 - HOJA DE DATOS PERSONALES Y DECLARACIÓN JURADA PARA CONCESIÓN ÚNICA'
  txtTituloHelp = '(De la Persona Natural que es representante legal de la solicitante o socia/accionista de la Persona Jurídica solicitante)'

  dia:string
  mes:string
  anio:string

  formulario: UntypedFormGroup;
  formularioDeclarante: UntypedFormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;
  modalRefDeclarante: NgbModalRef
  maxLengthNroDocumento:number = 0
  habilitarBusquedaRepresentante:boolean = true

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001D27NTService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private ubigeoService: UbigeoService
  ) {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

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
        this.anexoTramiteService.get<Anexo001_D27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;

          this.listaHojaDatos = metaData.hojaDatos;
          this.Declaracion1Solicitante.setValue(metaData.hojaDatos[0].seccion2.declaracion1);

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

          const data: HojaDatos = new HojaDatos();
          data.seccion1 = metaDataForm.seccion3.representanteLegal as Seccion1

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
    });
  }

  setFormDeclarante() {
    this.formularioDeclarante = this.fb.group({
      Id: [null],
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
      Declaracion1: [false, [Validators.requiredTrue]],
    });
  }

  get Declaracion1Solicitante(): AbstractControl { return this.formulario.get(['Declaracion1Solicitante']); }

  get Id(): AbstractControl { return this.formularioDeclarante.get(['Id']); }
  get IdTipoDocumento(): AbstractControl { return this.formularioDeclarante.get(['IdTipoDocumento']); }
  get NumeroDocumento(): AbstractControl { return this.formularioDeclarante.get(['NumeroDocumento']); }
  get Nombres(): AbstractControl { return this.formularioDeclarante.get(['Nombres']); }
  get ApellidoPaterno(): AbstractControl { return this.formularioDeclarante.get(['ApellidoPaterno']); }
  get ApellidoMaterno(): AbstractControl { return this.formularioDeclarante.get(['ApellidoMaterno']); }
  get DomicilioLegal(): AbstractControl { return this.formularioDeclarante.get(['DomicilioLegal']); }
  get Departamento(): AbstractControl { return this.formularioDeclarante.get(['Departamento']); }
  get Provincia(): AbstractControl { return this.formularioDeclarante.get(['Provincia']); }
  get Distrito(): AbstractControl { return this.formularioDeclarante.get(['Distrito']); }
  get Telefono(): AbstractControl { return this.formularioDeclarante.get(['Telefono']); }
  get Celular(): AbstractControl { return this.formularioDeclarante.get(['Celular']); }
  get Email(): AbstractControl { return this.formularioDeclarante.get(['Email']); }
  get Declaracion1(): AbstractControl { return this.formularioDeclarante.get(['Declaracion1']); }

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


  abrirModalDeclarante(content:any, idx:number|null=null) {
    this.setFormDeclarante();
    this.listaProvincias = []
    this.listaDistritos = []
    this.modalRefDeclarante =  this.modalService.open(content, { centered: true, size:"lg", scrollable: true });

    if(idx && idx > -1){
      this.habilitarBusquedaRepresentante = false

      this.Id.setValue(idx)
      this.IdTipoDocumento.setValue(this.listaHojaDatos[idx].seccion1.tipoDocumento.id)
      this.changeTipoDocumento(this.IdTipoDocumento.value)
      this.NumeroDocumento.setValue(this.listaHojaDatos[idx].seccion1.numeroDocumento)
      this.Nombres.setValue(this.listaHojaDatos[idx].seccion1.nombres)
      this.ApellidoPaterno.setValue(this.listaHojaDatos[idx].seccion1.apellidoPaterno)
      this.ApellidoMaterno.setValue(this.listaHojaDatos[idx].seccion1.apellidoMaterno)
      this.Telefono.setValue(this.listaHojaDatos[idx].seccion1.telefono)
      this.Celular.setValue(this.listaHojaDatos[idx].seccion1.celular)
      this.Email.setValue(this.listaHojaDatos[idx].seccion1.email)
      this.DomicilioLegal.setValue(this.listaHojaDatos[idx].seccion1.domicilioLegal)

      const {departamento, provincia, distrito} = this.listaHojaDatos[idx].seccion1
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)

      this.Declaracion1.setValue(this.listaHojaDatos[idx].seccion2.declaracion1)
    }
  }

  buscarRepresentanteLegal(tipoDocumento: string, numeroDocumento: string) {
    if(!this.habilitarBusquedaRepresentante)
      return;
    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '01') {// DNI
      this.reniecService.getDni(numeroDocumento).subscribe((response) => {
        this.habilitarBusquedaRepresentante = false
        this.funcionesMtcService.ocultarCargando();

        if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const {prenombres, apPrimer, apSegundo, direccion, ubigeo} = response.reniecConsultDniResponse.listaConsulta.datosPersona
        const departamento = ubigeo.split('/')[0].trim()
        const provincia = ubigeo.split('/')[1].trim()
        const distrito = ubigeo.split('/')[2].trim()

        this.addRepresentante(prenombres, apPrimer, apSegundo, direccion, departamento, provincia, distrito)

      }, (error) => {
        this.habilitarBusquedaRepresentante = true
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el servicio de Reniec').then(() => {
          this.funcionesMtcService.mensajeConfirmar("¿Desea agregar los datos manualmente?").then(() => {
            this.habilitarBusquedaRepresentante = false
            this.Nombres.enable()
            this.ApellidoPaterno.enable()
            this.ApellidoMaterno.enable()
            this.DomicilioLegal.enable()
            this.Departamento.enable()
            this.Provincia.enable()
            this.Distrito.enable()
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
            this.Nombres.enable()
            this.ApellidoPaterno.enable()
            this.ApellidoMaterno.enable()
            this.DomicilioLegal.enable()
            this.Departamento.enable()
            this.Provincia.enable()
            this.Distrito.enable()
          })
        });
      })
    }
  }

  addRepresentante(nombres:string, apePaterno:string, apeMaterno:string, domicilio:string, departamento:string, provincia:string, distrito:string ){
    this.Nombres.setValue(nombres)
    this.ApellidoPaterno.setValue(apePaterno)
    this.ApellidoMaterno.setValue(apeMaterno)
    this.DomicilioLegal.setValue(domicilio)

    if(nombres == "") this.Nombres.enable(); else this.Nombres.disable()
    if(apePaterno == "") this.ApellidoPaterno.enable(); else this.ApellidoPaterno.disable()
    if(apeMaterno == "") this.ApellidoMaterno.enable(); else this.ApellidoMaterno.disable()
    if(domicilio == "") this.DomicilioLegal.enable(); else this.DomicilioLegal.disable()

    if(departamento != "" && provincia != "" && distrito != "")
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)
  }

  changeTipoDocumento(value: string) {
    this.NumeroDocumento.reset()
    if(value == "01"){
      this.maxLengthNroDocumento = 8
      this.NumeroDocumento.enable()
      this.NumeroDocumento.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(8)])
    }else if(value == "04"){
      this.maxLengthNroDocumento = 15
      this.NumeroDocumento.enable()
      this.NumeroDocumento.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(15)])
    }else{
      this.NumeroDocumento.disable()
    }
  }

  resetDatosRepresentante(){
    this.listaProvincias = []
    this.listaDistritos = []

    this.Nombres.reset()
    this.ApellidoPaterno.reset()
    this.ApellidoMaterno.reset()
    this.DomicilioLegal.reset()
    this.Departamento.setValue("")
    this.Provincia.setValue("")
    this.Distrito.setValue("")

    this.Nombres.disable()
    this.ApellidoPaterno.disable()
    this.ApellidoMaterno.disable()
    this.DomicilioLegal.disable()
    this.Departamento.disable()
    this.Provincia.disable()
    this.Distrito.disable()
  }

  onInputNroDoc(){
    console.dir('onInputNroDoc')
    this.habilitarBusquedaRepresentante = true
    this.resetDatosRepresentante()
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
        this.Provincia.setValue("");
      });
    }else{
      this.listaProvincias = [];
      this.Provincia.setValue("");
    }

    this.listaDistritos = [];
    this.Distrito.setValue("");
  }

  onChangeProvincia(codDepartamento: string, codProvincia: string){
    if(codDepartamento != "" && codProvincia != ""){
      this.ubigeoService.distrito(Number(codDepartamento), Number(codProvincia)).subscribe((data) => {
        this.listaDistritos = data;
        this.Distrito.setValue("");
      });
    }else{
      this.listaDistritos = [];
      this.Distrito.setValue("");
    }
  }

  setUbigeoTextRepresentante(departamento:string, provincia:string, distrito:string){
    const idxDep = this.listaDepartamentos.findIndex(item => this.campareStrings(item.text, departamento));
    if(idxDep > -1){
      const codDepartamento = this.listaDepartamentos[idxDep].value;
      this.Departamento.setValue(codDepartamento);

      this.ubigeoService.provincia(codDepartamento).subscribe((provincias) => {
        this.listaProvincias = provincias;

        //Buscar Provincia
        const idxProv = this.listaProvincias.findIndex(item => this.campareStrings(item.text, provincia));
        if(idxProv > -1){
          const codProvincia = this.listaProvincias[idxProv].value;
          this.Provincia.setValue(codProvincia);

          this.ubigeoService.distrito(codDepartamento, codProvincia).subscribe((distritos) => {
            this.listaDistritos = distritos;

            //Buscar Distritos
            const idxDist = this.listaDistritos.findIndex(item => this.campareStrings(item.text, distrito));
            if(idxDist > -1){
              const codDistrito = this.listaDistritos[idxDist].value;
              this.Distrito.setValue(codDistrito);
            }else{
              this.Distrito.enable();
            }
          });
        }else{
          this.Provincia.enable();
          this.Distrito.enable();
        }
      });
    }else{
      this.Departamento.enable();
      this.Provincia.enable();
      this.Distrito.enable();
    }
  }

  guardarDeclarante() {
    if(this.formularioDeclarante.invalid)
      return this.funcionesMtcService.mensajeError("Complete los campos obligatorios")

    const data: HojaDatos = new HojaDatos();

    data.seccion1.nombres = this.Nombres.value.trim().toUpperCase()
    data.seccion1.apellidoPaterno = this.ApellidoPaterno.value.trim().toUpperCase()
    data.seccion1.apellidoMaterno = this.ApellidoMaterno.value.trim().toUpperCase()
    data.seccion1.tipoDocumento = this.listaTiposDocumentos.find(item => item.id === this.IdTipoDocumento.value)
    data.seccion1.numeroDocumento = this.NumeroDocumento.value
    data.seccion1.telefono = this.Telefono.value.trim().toUpperCase()
    data.seccion1.celular = this.Celular.value.trim().toUpperCase()
    data.seccion1.email = this.Email.value.trim().toUpperCase()
    data.seccion1.domicilioLegal = this.DomicilioLegal.value.trim().toUpperCase()
    data.seccion1.departamento = this.listaDepartamentos.find(item => item.value === this.Departamento.value).text
    data.seccion1.provincia = this.listaProvincias.find(item => item.value === this.Provincia.value).text
    data.seccion1.distrito = this.listaDistritos.find(item => item.value === this.Distrito.value).text
    data.seccion2.declaracion1 = this.Declaracion1.value
    data.seccion2.dia = this.Dia
    data.seccion2.mes = this.Mes
    data.seccion2.anio = this.Anio

    const idxExistente:number = this.listaHojaDatos.findIndex(x =>
                                  x.seccion1.tipoDocumento.id === this.IdTipoDocumento.value
                                  && x.seccion1.numeroDocumento === this.NumeroDocumento.value)
      console.dir( this.Id.value)
      console.dir( idxExistente)

    if(this.Id.value && this.Id.value > -1){
      if(idxExistente > -1 && idxExistente !== this.Id.value)
        return this.funcionesMtcService.mensajeError("El Rep. Legal ya existe en la lista")

      this.listaHojaDatos[this.Id.value] = data
      this.modalRefDeclarante.close();
      this.funcionesMtcService.mensajeOk(`Se modificaron los datos del registro N° ${this.Id.value + 1}`)
    }else {
      if(idxExistente > -1)
        return this.funcionesMtcService.mensajeError("La persona ya fue agregada a la lista")

      this.modalRefDeclarante.close();
      const nombrePersona = (`${this.Nombres.value.trim()} ${this.ApellidoPaterno.value.trim()} ${this.ApellidoMaterno.value.trim()}`).toUpperCase()
      this.funcionesMtcService.mensajeOk(`Se agregó a ${nombrePersona} a la lista`)
      this.listaHojaDatos.push(data);
    }
  }

  eliminarDeclarante(index: any) {
    const nombrePersona = `${this.listaHojaDatos[index].seccion1.nombres} ${this.listaHojaDatos[index].seccion1.apellidoPaterno} ${this.listaHojaDatos[index].seccion1.apellidoMaterno}`
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro que desea eliminar a ${nombrePersona} de la lista?`, 'Eliminar')
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
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una Persona Natural a la lista');

    this.listaHojaDatos[0].seccion2.declaracion1 = this.Declaracion1Solicitante.value
    this.listaHojaDatos[0].seccion2.dia = this.Dia
    this.listaHojaDatos[0].seccion2.mes = this.Mes
    this.listaHojaDatos[0].seccion2.anio = this.Anio

    const dataGuardar: Anexo001_D27Request = new Anexo001_D27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "D";
    dataGuardar.tramiteReqId = this.tramiteReqId;
    dataGuardar.metaData.hojaDatos = this.listaHojaDatos

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    let msgPregunta: string = `¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;

    if(this.listaHojaDatos.length === 1){
      const {nombres, apellidoPaterno, apellidoMaterno} = this.listaHojaDatos[0].seccion1
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-D/27";
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
