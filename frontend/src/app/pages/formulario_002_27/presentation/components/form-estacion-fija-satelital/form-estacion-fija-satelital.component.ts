import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { MetaData as MetaDataForm} from 'src/app/core/models/Formularios/Formulario001_27NT/MetaData';
import { HojaDatos } from '../../../domain/anexo002_B27/anexo002_B27Request';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { exactLengthValidator } from 'src/app/helpers/validator';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';

@Component({
  selector: 'app-form-estacion-fija-satelital',
  templateUrl: './form-estacion-fija-satelital.component.html',
  styleUrls: ['./form-estacion-fija-satelital.component.css'],
})
export class FormEstacionFijaSatelitalComponent implements OnInit {
  @Input() public dataInput: any;
  @Input() public dataIdx: number
  @Input() public listaHojaDatos: HojaDatos[]
  @Input() private listaDepartamentos:Array<any>

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'D.N.I.' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];

  listaProvincias:Array<any>
  listaDistritos:Array<any>

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 002-B/27 - ESTACIONES FIJAS SATELITALES'
  txtTituloHelp = 'Descripción de las Estaciones, Asignación de Frecuencias, Ubicación y Equipamiento'

  formulario: UntypedFormGroup;
  formularioDeclarante: UntypedFormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;
  modalRefDeclarante: NgbModalRef
  maxLengthNroDocumento:number = 0
  habilitarBusquedaIngeniero:boolean = true

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private reniecService: ReniecService,
    private ubigeoService: UbigeoService
  ) {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
  }

  ngOnInit(): void {
    this.setForm();

    console.log("this.dataInput", this.dataInput)
    console.log("this.dataIdx", this.dataIdx)
    console.log("this.listaHojaDatos", this.listaHojaDatos)

    if (this.dataIdx !== null && this.dataIdx >= 0) {
      this.formulario.setValue(this.listaHojaDatos[this.dataIdx])
      this.setUbigeoText(this.listaHojaDatos[this.dataIdx].seccion1.departamento, this.listaHojaDatos[this.dataIdx].seccion1.provincia, this.listaHojaDatos[this.dataIdx].seccion1.distrito)
    }else{
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          const metaDataForm = JSON.parse(dataForm.metaData) as MetaDataForm;
          this.empresa.setValue(metaDataForm.seccion3?.razonSocial)
        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario');
        }
      );
    }

  }

  setForm() {
    this.formulario = this.fb.group({
      seccion1: this.fb.group({
        empresa: ["", [Validators.required]],
        servicio: ["", [Validators.required]],
        nombreEstacion: ["", [Validators.required]],
        ubicacionEstacion: ["", [Validators.required]],
        departamento: ["", [Validators.required]],
        provincia: ["", [Validators.required]],
        distrito: ["", [Validators.required]],
        localidad: ["", [Validators.required]],
        coordenadaGeograficaGradosLO: ["", [Validators.required]],
        coordenadaGeograficaMinutosLO: ["", [Validators.required]],
        coordenadaGeograficaSegundosLO: ["", [Validators.required]],
        coordenadaGeograficaGradosLS: ["", [Validators.required]],
        coordenadaGeograficaMinutosLS: ["", [Validators.required]],
        coordenadaGeograficaSegundosLS: ["", [Validators.required]],
        coordenadaGeograficaAltitud: ["", [Validators.required]],
        indicativo: [""],

        nroPortadorasTransmision: ["", [Validators.required]],
        frecuenciaUplink: ["", [Validators.required]],
        frecuenciaDownlink: ["", [Validators.required]],
        bloqueHorario: ["", [Validators.required]],
      }),
      seccion2: this.fb.group({
        marca: ["", [Validators.required]],
        modelo: ["", [Validators.required]],
        rangoFrecuencia: ["", [Validators.required]],
        potenciadBm: ["", [Validators.required]],
        potenciaW: ["", [Validators.required]],
        tipoEmision: ["", [Validators.required]],
        capacidad: ["", [Validators.required]],

        nroTransponedor: ["", [Validators.required]],
        tipoAmplificadorHPA: ["", [Validators.required]],
        tipoAmplificadorSSPA: ["", [Validators.required]],
      }),
      seccion3: this.fb.group({
        tipoAntena: ["", [Validators.required]],
        marcaSistemaRadiante: ["", [Validators.required]],
        modeloSistemaRadiante: ["", [Validators.required]],
        ganancia: ["", [Validators.required]],
        piredBm: ["", [Validators.required]],
        pireW: ["", [Validators.required]],
        alturaTorre: ["", [Validators.required]],
        alturaEdificio: ["", [Validators.required]],
        alturaInstalada: ["", [Validators.required]],
        distanciaAntena: ["", [Validators.required]],

        diametroAntena: ["", [Validators.required]],
        anguloElevacionAntena: ["", [Validators.required]],
        azimut: ["", [Validators.required]],
      }),
      seccion4: this.fb.group({
        nombrePosicionOrbital: ["", [Validators.required]],
      }),
      seccion5: this.fb.group({
        dni: ["", [Validators.required]],
        nombresApellidos: ["", [Validators.required]],
        cip: ["", [Validators.required, Validators.maxLength(10)]],
        telefono: ["", [Validators.maxLength(9)]],
        celular: ["", [Validators.required, exactLengthValidator([9])]],
      }),
    });
  }

  get empresa(): AbstractControl { return this.formulario.get('seccion1.empresa'); }
  get servicio(): AbstractControl { return this.formulario.get('seccion1.servicio'); }
  get nombreEstacion(): AbstractControl { return this.formulario.get('seccion1.nombreEstacion'); }
  get ubicacionEstacion(): AbstractControl { return this.formulario.get('seccion1.ubicacionEstacion'); }
  get departamento(): AbstractControl { return this.formulario.get('seccion1.departamento'); }
  get provincia(): AbstractControl { return this.formulario.get('seccion1.provincia'); }
  get distrito(): AbstractControl { return this.formulario.get('seccion1.distrito'); }
  get localidad(): AbstractControl { return this.formulario.get('seccion1.localidad'); }
  get coordenadaGeograficaGradosLO(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaGradosLO'); }
  get coordenadaGeograficaMinutosLO(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaMinutosLO'); }
  get coordenadaGeograficaSegundosLO(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaSegundosLO'); }
  get coordenadaGeograficaGradosLS(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaGradosLS'); }
  get coordenadaGeograficaMinutosLS(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaMinutosLS'); }
  get coordenadaGeograficaSegundosLS(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaSegundosLS'); }
  get coordenadaGeograficaAltitud(): AbstractControl { return this.formulario.get('seccion1.coordenadaGeograficaAltitud'); }
  get indicativo(): AbstractControl { return this.formulario.get('seccion1.indicativo'); }
  get nroPortadorasTransmision(): AbstractControl { return this.formulario.get('seccion1.nroPortadorasTransmision'); }
  get frecuenciaUplink(): AbstractControl { return this.formulario.get('seccion1.frecuenciaUplink'); }
  get frecuenciaDownlink(): AbstractControl { return this.formulario.get('seccion1.frecuenciaDownlink'); }
  get bloqueHorario(): AbstractControl { return this.formulario.get('seccion1.bloqueHorario'); }

  get marca(): AbstractControl { return this.formulario.get('seccion2.marca'); }
  get modelo(): AbstractControl { return this.formulario.get('seccion2.modelo'); }
  get rangoFrecuencia(): AbstractControl { return this.formulario.get('seccion2.rangoFrecuencia'); }
  get potenciadBm(): AbstractControl { return this.formulario.get('seccion2.potenciadBm'); }
  get potenciaW(): AbstractControl { return this.formulario.get('seccion2.potenciaW'); }
  get tipoEmision(): AbstractControl { return this.formulario.get('seccion2.tipoEmision'); }
  get capacidad(): AbstractControl { return this.formulario.get('seccion2.capacidad'); }
  get nroTransponedor(): AbstractControl { return this.formulario.get('seccion2.nroTransponedor'); }
  get tipoAmplificadorHPA(): AbstractControl { return this.formulario.get('seccion2.tipoAmplificadorHPA'); }
  get tipoAmplificadorSSPA(): AbstractControl { return this.formulario.get('seccion2.tipoAmplificadorSSPA'); }

  get tipoAntena(): AbstractControl { return this.formulario.get('seccion3.tipoAntena'); }
  get marcaSistemaRadiante(): AbstractControl { return this.formulario.get('seccion3.marcaSistemaRadiante'); }
  get modeloSistemaRadiante(): AbstractControl { return this.formulario.get('seccion3.modeloSistemaRadiante'); }
  get ganancia(): AbstractControl { return this.formulario.get('seccion3.ganancia'); }
  get piredBm(): AbstractControl { return this.formulario.get('seccion3.piredBm'); }
  get pireW(): AbstractControl { return this.formulario.get('seccion3.pireW'); }
  get alturaTorre(): AbstractControl { return this.formulario.get('seccion3.alturaTorre'); }
  get alturaEdificio(): AbstractControl { return this.formulario.get('seccion3.alturaEdificio'); }
  get alturaInstalada(): AbstractControl { return this.formulario.get('seccion3.alturaInstalada'); }
  get distanciaAntena(): AbstractControl { return this.formulario.get('seccion3.distanciaAntena'); }
  get diametroAntena(): AbstractControl { return this.formulario.get('seccion3.diametroAntena'); }
  get anguloElevacionAntena(): AbstractControl { return this.formulario.get('seccion3.anguloElevacionAntena'); }
  get azimut(): AbstractControl { return this.formulario.get('seccion3.azimut'); }

  get nombrePosicionOrbital(): AbstractControl { return this.formulario.get('seccion4.nombrePosicionOrbital'); }

  get dni(): AbstractControl { return this.formulario.get('seccion5.dni'); }
  get nombresApellidos(): AbstractControl { return this.formulario.get('seccion5.nombresApellidos'); }
  get cip(): AbstractControl { return this.formulario.get('seccion5.cip'); }
  get telefono(): AbstractControl { return this.formulario.get('seccion5.telefono'); }
  get celular(): AbstractControl { return this.formulario.get('seccion5.celular'); }

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

  setUbigeoText(departamento:string, provincia:string, distrito:string){
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

  onPressEnterNroDoc(event:any, nroDoc:string) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 13)
      this.buscarIngeniero(nroDoc)
  }

  buscarIngeniero(numeroDocumento: string) {
    if(!this.habilitarBusquedaIngeniero)
      return;

    if (numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

      this.funcionesMtcService.mostrarCargando();

      this.reniecService.getDni(numeroDocumento).subscribe((response) => {
        this.habilitarBusquedaIngeniero = false
        this.funcionesMtcService.ocultarCargando();

        if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const {prenombres, apPrimer, apSegundo} = response.reniecConsultDniResponse.listaConsulta.datosPersona
        this.nombresApellidos.setValue(`${prenombres} ${apPrimer} ${apSegundo}`)

      }, (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el servicio de Reniec').then(() => {
          this.habilitarBusquedaIngeniero = false
          this.nombresApellidos.setValue("")
          this.nombresApellidos.enable()
        });
      });
  }

  onInputNroDoc(){
    this.habilitarBusquedaIngeniero = true
    this.nombresApellidos.setValue("")
    this.nombresApellidos.enable()
  }

  agregarAnexo() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    let hojaDatos: HojaDatos = new HojaDatos();

    hojaDatos = this.formulario.value as HojaDatos
    hojaDatos.seccion1.departamento = this.listaDepartamentos.find(item => item.value === this.departamento.value).text
    hojaDatos.seccion1.provincia = this.listaProvincias.find(item => item.value === this.provincia.value).text
    hojaDatos.seccion1.distrito = this.listaDistritos.find(item => item.value === this.distrito.value).text
    hojaDatos.seccion5.nombresApellidos = this.nombresApellidos.value

    console.log("hojaDatos", hojaDatos)

    let msgPregunta: string = `¿Está seguro de ${this.dataIdx >= 0 ? 'modificar' : 'guardar'} los datos ingresados?`;

    // this.funcionesMtcService.mensajeConfirmar(msgPregunta)
    // .then(() => {
      this.activeModal.close(hojaDatos);
    // });
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
