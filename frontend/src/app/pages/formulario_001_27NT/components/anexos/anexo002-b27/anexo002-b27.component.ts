import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { MetaData as MetaDataForm} from 'src/app/core/models/Formularios/Formulario001_27NT/MetaData';
import { MetaData } from 'src/app/core/models/Anexos/Anexo002_B27NT/MetaData';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Anexo002_B27Request } from 'src/app/core/models/Anexos/Anexo002_B27NT/Anexo002_B27Request';
import { Anexo002B27NTService } from 'src/app/core/services/anexos/anexo002-b27NT.service';
import { Anexo002_B27Response } from 'src/app/core/models/Anexos/Anexo002_B27NT/Anexo002_B27Response';
import { exactLengthValidator } from 'src/app/helpers/validator';

@Component({
  selector: 'app-anexo002-b27',
  templateUrl: './anexo002-b27.component.html',
  styleUrls: ['./anexo002-b27.component.css'],
})
export class Anexo002B27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

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
  txtTitulo = 'ANEXO 002-B/27 - ESTACIONES FIJAS SATELITALES'
  txtTituloHelp = 'Descripción de las Estaciones, Asignación de Frecuencias, Ubicación y Equipamiento'

  formulario: FormGroup;
  formularioDeclarante: FormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;
  modalRefDeclarante: NgbModalRef
  maxLengthNroDocumento:number = 0
  habilitarBusquedaIngeniero:boolean = true

  constructor(
    public fb:FormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo002B27NTService,
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

    this.setForm();

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.anexoTramiteService.get<Anexo002_B27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;
          this.formulario.setValue(metaData);
          this.setUbigeoText(metaData.seccion1.departamento, metaData.seccion1.provincia, metaData.seccion1.distrito)

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });

    }else{
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          const metaDataForm = JSON.parse(dataForm.metaData) as MetaDataForm;
          this.empresa.setValue(metaDataForm.seccion3?.razonSocial)
          if(metaDataForm.seccion3.tipoSolicitante != 'PJ'){
            this.modalService.dismissAll();
            this.funcionesMtcService.mensajeError('El solicitante no es Persona Jurídica')
          }

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

  guardarAnexo() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    const dataGuardar: Anexo002_B27Request = new Anexo002_B27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.tramiteReqId;
    dataGuardar.metaData = this.formulario.value as MetaData

    dataGuardar.metaData.seccion1.departamento = this.listaDepartamentos.find(item => item.value === this.departamento.value).text
    dataGuardar.metaData.seccion1.provincia = this.listaProvincias.find(item => item.value === this.provincia.value).text
    dataGuardar.metaData.seccion1.distrito = this.listaDistritos.find(item => item.value === this.distrito.value).text
    dataGuardar.metaData.seccion5.nombresApellidos = this.nombresApellidos.value

    console.log("dataGuardar", dataGuardar)

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    let msgPregunta: string = `¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;

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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo";
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
