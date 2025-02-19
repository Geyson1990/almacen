import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo004_D27Request } from 'src/app/core/models/Anexos/Anexo004_D27/Anexo004_D27Request';
import { Anexo004_D27Response } from 'src/app/core/models/Anexos/Anexo004_D27/Anexo004_D27Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo004D27Service } from 'src/app/core/services/anexos/anexo004-d27.service';
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
import { MetaData as MetaDataForm} from 'src/app/core/models/Formularios/Formulario004_27/MetaData';
import { HojaDatos, MetaData } from 'src/app/core/models/Anexos/Anexo004_D27/MetaData';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Seccion1 } from 'src/app/core/models/Anexos/Anexo004_D27/Secciones';
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { Experiencia } from 'src/app/core/models/Anexos/Anexo004_D27/Secciones';

@Component({
  selector: 'app-anexo004-d27',
  templateUrl: './anexo004-d27.component.html',
  styleUrls: ['./anexo004-d27.component.css'],
})
export class Anexo004D27Component implements OnInit {

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
  txtTitulo = 'ANEXO 004-D/27 - DECLARACIÓN JURADA - CURRICULUM VITAE PARA REGISTRO DE PERSONAS HABILITADAS A REALIZAR ESTUDIOS TEÓRICOS Y MEDICIONES DE RADIACIONES NO IONIZANTES EN TELECOMUNICACIONES'
  // txtTituloHelp = ''

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
    private anexoService: Anexo004D27Service,
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

    // this.setForm();

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.anexoTramiteService.get<Anexo004_D27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;
          console.log("metaData", metaData)

          this.listaHojaDatos = metaData.hojaDatos;

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });

    }else{
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          const metaDataForm = JSON.parse(dataForm.metaData) as MetaDataForm;

          // if(metaDataForm.seccion3.tipoSolicitante != 'PJ'){
          //   this.modalService.dismissAll();
          //   this.funcionesMtcService.mensajeError('El solicitante no es Persona Jurídica')
          // }

          // const data: HojaDatos = new HojaDatos();
          // data.seccion1 = metaDataForm.seccion3.representanteLegal as Seccion1

          // this.listaHojaDatos.push(data);

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario');
        }
      );
    }
  }

  // setForm() {
  //   this.formulario = this.fb.group({
  //     HojaDatos: this.fb.array([], Validators.required),
  //   });
  // }

  setFormDeclarante(data: HojaDatos|null, index:number|null) {
    this.formularioDeclarante = this.fb.group({
      index: [index],
      seccion1: this.fb.group({
        idTipoDocumento: [data? data.seccion1.idTipoDocumento : "", [Validators.required]],
        numeroDocumento: [data? data.seccion1.numeroDocumento : null, [Validators.required, Validators.pattern('^[0-9]*$')]],
        nombres: [{value:data? data.seccion1.nombres : null, disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        apellidoPaterno: [{value:data? data.seccion1.apellidoPaterno : null, disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        apellidoMaterno: [{value:data? data.seccion1.apellidoMaterno : null, disabled:true}, [noWhitespaceValidator(), Validators.maxLength(50)]],
        domicilioLegal: [{value:data? data.seccion1.domicilioLegal : null, disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]],
        departamento: [{value:data? data.seccion1.departamento : null, disabled:true}, [Validators.required]],
        provincia: [{value:data? data.seccion1.provincia : null, disabled:true}, [Validators.required]],
        distrito: [{value:data? data.seccion1.distrito : null, disabled:true}, [Validators.required]],
        telefono: [data? data.seccion1.telefono : null, [Validators.maxLength(9)]],
        celular: [data? data.seccion1.celular : null, [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
        email: [data? data.seccion1.email : null, [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(30)]],
      }),
      seccion2: this.fb.group({
        maestriaPostgrado: [data? data.seccion2.maestriaPostgrado : null, [Validators.required]],
        institucion: [data? data.seccion2.institucion : null, [Validators.required]],
        titulo: [data? data.seccion2.titulo : null, [Validators.required]],
        institucionTitulo: [data? data.seccion2.institucionTitulo : null, [Validators.required]],
      }),
      seccion3: this.fb.group({
        colegioProfesional: [data? data.seccion3.colegioProfesional : null, [Validators.required]],
        nroColegiatura: [data? data.seccion3.nroColegiatura : null, [Validators.required]],
      }),
      seccion4: this.fb.group({
        experiencia: this.fb.array([], Validators.required),
      }),
      declaracion: [data? data.declaracion : null, [Validators.requiredTrue]],
    });

    this.patchForm(data ? data.seccion4.experiencia : null)
  }

  patchForm(lista: Experiencia[] | null) {
    const filasMax = 6
    const experiencias = <UntypedFormArray>this.formularioDeclarante.get('seccion4.experiencia');

    for (let i = 0; i < filasMax; i++) {
      let data = null
      if(lista!==null){
        data = lista[i] ?? null
      }
      experiencias.push(this.patchFormValues(data))
    }
    experiencias.at(0).get('institucion').setValidators([Validators.required])
    experiencias.at(0).get('cargo').setValidators([Validators.required])
    experiencias.at(0).get('periodo').setValidators([Validators.required])
    experiencias.at(0).get('funcion').setValidators([Validators.required])
  }

  patchFormValues(data: Experiencia | null) {
    const formGroup: UntypedFormGroup =  this.fb.group({
      institucion: [data ? data.institucion : null],
      cargo: [data ? data.cargo : null],
      periodo: [data ? data.periodo : null],
      funcion: [data ? data.funcion : null],
    })

    return formGroup
  }

  // get HojaDatos(): FormArray { return <FormArray>this.formulario.get('HojaDatos') as FormArray; }

  get index(): AbstractControl { return this.formularioDeclarante.get('index'); }

  get idTipoDocumento(): AbstractControl { return this.formularioDeclarante.get('seccion1.idTipoDocumento'); }
  get numeroDocumento(): AbstractControl { return this.formularioDeclarante.get('seccion1.numeroDocumento'); }
  get nombres(): AbstractControl { return this.formularioDeclarante.get('seccion1.nombres'); }
  get apellidoPaterno(): AbstractControl { return this.formularioDeclarante.get('seccion1.apellidoPaterno'); }
  get apellidoMaterno(): AbstractControl { return this.formularioDeclarante.get('seccion1.apellidoMaterno'); }
  get domicilioLegal(): AbstractControl { return this.formularioDeclarante.get('seccion1.domicilioLegal'); }
  get departamento(): AbstractControl { return this.formularioDeclarante.get('seccion1.departamento'); }
  get provincia(): AbstractControl { return this.formularioDeclarante.get('seccion1.provincia'); }
  get distrito(): AbstractControl { return this.formularioDeclarante.get('seccion1.distrito'); }
  get telefono(): AbstractControl { return this.formularioDeclarante.get('seccion1.telefono'); }
  get celular(): AbstractControl { return this.formularioDeclarante.get('seccion1.celular'); }
  get email(): AbstractControl { return this.formularioDeclarante.get('seccion1.email'); }

  get maestriaPostgrado(): AbstractControl { return this.formularioDeclarante.get('seccion2.maestriaPostgrado'); }
  get institucion(): AbstractControl { return this.formularioDeclarante.get('seccion2.institucion'); }
  get titulo(): AbstractControl { return this.formularioDeclarante.get('seccion2.titulo'); }
  get institucionTitulo(): AbstractControl { return this.formularioDeclarante.get('seccion2.institucionTitulo'); }

  get colegioProfesional(): AbstractControl { return this.formularioDeclarante.get('seccion3.colegioProfesional'); }
  get nroColegiatura(): AbstractControl { return this.formularioDeclarante.get('seccion3.nroColegiatura'); }

  get experiencia(): UntypedFormArray { return <UntypedFormArray>this.formularioDeclarante.get('seccion4.experiencia') as UntypedFormArray }

  get declaracion(): AbstractControl { return this.formularioDeclarante.get('declaracion'); }

  abrirModalDeclarante(content:any, data:HojaDatos|null=null, idx:number|null=null) {
    this.setFormDeclarante(data, idx);
    this.listaProvincias = []
    this.listaDistritos = []
    this.modalRefDeclarante =  this.modalService.open(content, { centered: true, size:"xl", scrollable: true });

    if(idx !== null && idx > -1){
      this.habilitarBusquedaRepresentante = false

      if(data.seccion1.idTipoDocumento == '01')
        this.maxLengthNroDocumento = 8
      else if(data.seccion1.idTipoDocumento == '04')
        this.maxLengthNroDocumento = 9
      // this.index.setValue(idx)
      // this.idTipoDocumento.setValue(this.listaHojaDatos[idx].seccion1.tipoDocumento.id)
      // this.changeTipoDocumento(this.idTipoDocumento.value)
      // this.numeroDocumento.setValue(this.listaHojaDatos[idx].seccion1.numeroDocumento)
      // this.nombres.setValue(this.listaHojaDatos[idx].seccion1.nombres)
      // this.apellidoPaterno.setValue(this.listaHojaDatos[idx].seccion1.apellidoPaterno)
      // this.apellidoMaterno.setValue(this.listaHojaDatos[idx].seccion1.apellidoMaterno)
      // this.telefono.setValue(this.listaHojaDatos[idx].seccion1.telefono)
      // this.celular.setValue(this.listaHojaDatos[idx].seccion1.celular)
      // this.email.setValue(this.listaHojaDatos[idx].seccion1.email)
      // this.domicilioLegal.setValue(this.listaHojaDatos[idx].seccion1.domicilioLegal)

      const {departamento, provincia, distrito} = this.listaHojaDatos[idx].seccion1
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)

      // this.declaracion.setValue(this.listaHojaDatos[idx].declaracion)
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
            this.nombres.enable()
            this.apellidoPaterno.enable()
            this.apellidoMaterno.enable()
            this.domicilioLegal.enable()
            this.departamento.enable()
            this.provincia.enable()
            this.distrito.enable()
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
            this.nombres.enable()
            this.apellidoPaterno.enable()
            this.apellidoMaterno.enable()
            this.domicilioLegal.enable()
            this.departamento.enable()
            this.provincia.enable()
            this.distrito.enable()
          })
        });
      })
    }
  }

  addRepresentante(nombres:string, apePaterno:string, apeMaterno:string, domicilio:string, departamento:string, provincia:string, distrito:string ){
    this.nombres.setValue(nombres)
    this.apellidoPaterno.setValue(apePaterno)
    this.apellidoMaterno.setValue(apeMaterno)
    this.domicilioLegal.setValue(domicilio)

    if(nombres == "") this.nombres.enable(); else this.nombres.disable()
    if(apePaterno == "") this.apellidoPaterno.enable(); else this.apellidoPaterno.disable()
    if(apeMaterno == "") this.apellidoMaterno.enable(); else this.apellidoMaterno.disable()
    if(domicilio == "") this.domicilioLegal.enable(); else this.domicilioLegal.disable()

    if(departamento != "" && provincia != "" && distrito != ""){
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)
    } else{
      this.departamento.enable()
      this.provincia.enable()
      this.distrito.enable()
    }
  }

  changeTipoDocumento(value: string) {
    this.numeroDocumento.reset()
    if(value == "01"){
      this.maxLengthNroDocumento = 8
      this.numeroDocumento.enable()
      this.numeroDocumento.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(8)])
    }else if(value == "04"){
      this.maxLengthNroDocumento = 9
      this.numeroDocumento.enable()
      this.numeroDocumento.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(15)])
    }else{
      this.numeroDocumento.disable()
    }
  }

  resetDatosRepresentante(){
    this.listaProvincias = []
    this.listaDistritos = []

    this.nombres.reset()
    this.apellidoPaterno.reset()
    this.apellidoMaterno.reset()
    this.domicilioLegal.reset()
    this.departamento.setValue("")
    this.provincia.setValue("")
    this.distrito.setValue("")

    this.nombres.disable()
    this.apellidoPaterno.disable()
    this.apellidoMaterno.disable()
    this.domicilioLegal.disable()
    this.departamento.disable()
    this.provincia.disable()
    this.distrito.disable()
  }

  onInputNroDoc(){
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
        this.provincia.setValue("");
      });
    }else{
      this.listaProvincias = [];
      this.provincia.setValue("");
    }

    this.listaDistritos = [];
    this.distrito.setValue("");
  }

  onChangeProvincia(codDepartamento: string, codProvincia: string){
    if(codDepartamento != "" && codProvincia != ""){
      this.ubigeoService.distrito(Number(codDepartamento), Number(codProvincia)).subscribe((data) => {
        this.listaDistritos = data;
        this.distrito.setValue("");
      });
    }else{
      this.listaDistritos = [];
      this.distrito.setValue("");
    }
  }

  setUbigeoTextRepresentante(departamento:string, provincia:string, distrito:string){
    const idxDep = this.listaDepartamentos.findIndex(item => this.campareStrings(item.text, departamento));
    if(idxDep > -1){
      const codDepartamento = this.listaDepartamentos[idxDep].value;
      this.departamento.setValue(codDepartamento);

      this.ubigeoService.provincia(codDepartamento).subscribe((provincias) => {
        this.listaProvincias = provincias;

        //Buscar Provincia
        const idxProv = this.listaProvincias.findIndex(item => this.campareStrings(item.text, provincia));
        if(idxProv > -1){
          const codProvincia = this.listaProvincias[idxProv].value;
          this.provincia.setValue(codProvincia);

          this.ubigeoService.distrito(codDepartamento, codProvincia).subscribe((distritos) => {
            this.listaDistritos = distritos;

            //Buscar Distritos
            const idxDist = this.listaDistritos.findIndex(item => this.campareStrings(item.text, distrito));
            if(idxDist > -1){
              const codDistrito = this.listaDistritos[idxDist].value;
              this.distrito.setValue(codDistrito);
            }else{
              this.distrito.enable();
            }
          });
        }else{
          this.provincia.enable();
          this.distrito.enable();
        }
      });
    }else{
      this.departamento.enable();
      this.provincia.enable();
      this.distrito.enable();
    }
  }

  guardarDeclarante() {
    if(this.formularioDeclarante.invalid)
      return this.funcionesMtcService.mensajeError("Complete los campos obligatorios")

    const data: HojaDatos = new HojaDatos();

    data.seccion1.nombres = this.nombres.value.trim().toUpperCase()
    data.seccion1.apellidoPaterno = this.apellidoPaterno.value.trim().toUpperCase()
    data.seccion1.apellidoMaterno = this.apellidoMaterno.value.trim().toUpperCase()
    data.seccion1.idTipoDocumento = this.idTipoDocumento.value
    data.seccion1.numeroDocumento = this.numeroDocumento.value
    data.seccion1.telefono = this.telefono.value?.trim()
    data.seccion1.celular = this.celular.value.trim().toUpperCase()
    data.seccion1.email = this.email.value.trim().toUpperCase()
    data.seccion1.domicilioLegal = this.domicilioLegal.value.trim().toUpperCase()
    data.seccion1.departamento = this.listaDepartamentos.find(item => item.value === this.departamento.value).text
    data.seccion1.provincia = this.listaProvincias.find(item => item.value === this.provincia.value).text
    data.seccion1.distrito = this.listaDistritos.find(item => item.value === this.distrito.value).text
    data.seccion1.ubigeo = `${this.departamento.value}${this.provincia.value}${this.distrito.value}`
    data.seccion2.maestriaPostgrado = this.maestriaPostgrado.value.trim()
    data.seccion2.institucion = this.institucion.value.trim()
    data.seccion2.titulo = this.titulo.value.trim()
    data.seccion2.institucionTitulo = this.institucionTitulo.value.trim()
    data.seccion3.colegioProfesional = this.colegioProfesional.value.trim()
    data.seccion3.nroColegiatura = this.nroColegiatura.value.trim()
    data.seccion4.experiencia = this.experiencia.value

    data.declaracion = this.declaracion.value
    data.solicitante = this.seguridadService.getUserName()
    data.docSolicitante = this.seguridadService.getNumDoc()

    console.log("data", data)

    const idxExistente:number = this.listaHojaDatos.findIndex(x =>
                                  x.seccion1.idTipoDocumento === this.idTipoDocumento.value
                                  && x.seccion1.numeroDocumento === this.numeroDocumento.value)

    if(this.index.value !== null && this.index.value > -1){
      if(idxExistente > -1 && idxExistente !== this.index.value)
        return this.funcionesMtcService.mensajeError("El Rep. Legal ya existe en la lista")

      this.listaHojaDatos[this.index.value] = data
      this.modalRefDeclarante.close();
      this.funcionesMtcService.mensajeOk(`Se modificaron los datos del registro N° ${this.index.value + 1}`)
    }else {
      if(idxExistente > -1)
        return this.funcionesMtcService.mensajeError("La persona ya fue agregada a la lista")

      this.modalRefDeclarante.close();
      const nombrePersona = (`${this.nombres.value.trim()} ${this.apellidoPaterno.value.trim()} ${this.apellidoMaterno.value.trim()}`).toUpperCase()
      this.funcionesMtcService.mensajeOk(`Se agregó a ${nombrePersona} a la lista`);
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
    if (this.listaHojaDatos.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una Persona Natural a la lista');

    const dataGuardar: Anexo004_D27Request = new Anexo004_D27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 4;
    dataGuardar.codigo = "D";
    dataGuardar.tramiteReqId = this.tramiteReqId;
    dataGuardar.metaData.hojaDatos = this.listaHojaDatos

    console.log("DATAGUARDAR", dataGuardar)

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    let msgPregunta: string = `¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;

    // if(this.listaHojaDatos.length === 1){
    //   const {nombres, apellidoPaterno, apellidoMaterno} = this.listaHojaDatos[0].seccion1
    //   msgPregunta = `No ha ingresado más personas. Éste documento sólo se generará para ${nombres} ${apellidoPaterno} ${apellidoMaterno}
    //   ¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;
    // }

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
