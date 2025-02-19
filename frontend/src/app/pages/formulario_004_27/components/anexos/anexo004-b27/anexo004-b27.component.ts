import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AbstractControlOptions, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { MetaData } from 'src/app/core/models/Anexos/Anexo004_B27/MetaData';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Anexo004B27Service } from 'src/app/core/services/anexos/anexo004-b27.service';
import { Anexo004_B27Request } from 'src/app/core/models/Anexos/Anexo004_B27/Anexo004_B27Request';
import { Concesionario, DiagramaConexionRed, Equipo, Area } from 'src/app/core/models/Anexos/Anexo004_B27/Secciones';
import { Anexo004_B27Response } from 'src/app/core/models/Anexos/Anexo004_B27/Anexo004_B27Response';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { exactLengthValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';


@Component({
  selector: 'app-anexo004-b27',
  templateUrl: './anexo004-b27.component.html',
  styleUrls: ['./anexo004-b27.component.css'],
})
export class Anexo004B27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  diagramaConexionRed: DiagramaConexionRed = null;

  listaDepartamentos: Array<any>
  listaProvincias: Array<any>
  listaDistritos: Array<any>
  listaAreas: Array<Area> = []
  listaEquipos: Array<Equipo> = []
  listaConcesionarios: Array<Concesionario> = []

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId: number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 004-B/27 - REGISTRO PARA SERVICIO DE VALOR AÑADIDO'

  formulario: UntypedFormGroup;
  formularioAgregarEquipo: UntypedFormGroup;
  formularioAgregarArea: UntypedFormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;
  @ViewChild('rucConcesionario') rucConcesionario: ElementRef;
  modalRefDeclarante: NgbModalRef
  maxLengthNroDocumento: number = 0
  habilitarBusquedaConcesionario: boolean = false
  concesionarioToched: boolean = false

  constructor(
    public fb: UntypedFormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private funcionesMtcService: FuncionesMtcService,
    private anexoService: Anexo004B27Service,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public tramiteService: TramiteService,
    private ubigeoService: UbigeoService,
    private reniecService: ReniecService,
    private sunatService: SunatService,
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
      this.anexoTramiteService.get<Anexo004_B27Response>(this.tramiteReqId)
        .subscribe(async (dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;

          this.FlagANivelNacional.setValue(metaData.seccion1.flagANivelNacional)
          if (!metaData.seccion1.flagANivelNacional) {
            //this.setUbigeoText(metaData.seccion1.departamento, metaData.seccion1.provincia, metaData.seccion1.distrito)
          } else {
            //this.Departamento.disable()
            //this.Provincia.disable()
            //this.Distrito.disable()
          }
          this.AlmacenamientoRetransmision.setValue(metaData.seccion2.almacenamientoRetransmision)
          this.Facsimil.setValue(metaData.seccion2.facsimil)
          this.MensajeriaInterpersonal.setValue(metaData.seccion2.mensajeriaInterpersonal)
          this.MensajeriaVoz.setValue(metaData.seccion2.mensajeriaVoz)
          this.ServicioConsulta.setValue(metaData.seccion2.servicioConsulta)
          this.ConmutacionDatos.setValue(metaData.seccion2.conmutacionDatos)
          this.Teleproceso.setValue(metaData.seccion2.teleproceso)
          this.Telealarma.setValue(metaData.seccion2.telealarma)
          this.Telemando.setValue(metaData.seccion2.telemando)
          this.Teleaccion.setValue(metaData.seccion2.teleaccion)
          this.Teletexto.setValue(metaData.seccion2.teletexto)
          this.Teletex.setValue(metaData.seccion2.teletex)
          this.Videotex.setValue(metaData.seccion2.videotex)
          this.SuministroInformacion.setValue(metaData.seccion2.suministroInformacion)
          // this.RucConcesionario.setValue(metaData.seccion2.rucConcesionario)
          // this.Concesionario.setValue(metaData.seccion2.concesionario)
          this.DescripcionServicio.setValue(metaData.seccion4.descripcionServicio)
          console.log("metaData.seccion3.equipos", metaData.seccion3.equipos)


          metaData.seccion1.areas.map(x => {

            this.ListaAreas.push(this.nuevaArea(x as Area))
          })

          metaData.seccion3.equipos.map(x => {

            this.ListaEquipos.push(this.nuevoEquipo(x as Equipo))
          })
          this.diagramaConexionRed = metaData.seccion5.diagramaConexionRed

          this.listaConcesionarios = metaData.seccion2.concesionarios

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });

    }

  }

  setForm() {

    this.formulario = this.fb.group({
      //departamento: ["", [Validators.required]],
      //provincia: ["", [Validators.required]],
      //distrito: ["", [Validators.required]],
      flagANivelNacional: [false],
      serviciosRequeridos: this.fb.group({
        almacenamientoRetransmision: [false],
        facsimil: [false],
        mensajeriaInterpersonal: [false],
        mensajeriaVoz: [false],
        servicioConsulta: [false],
        conmutacionDatos: [false],
        teleproceso: [false],
        telealarma: [false],
        telemando: [false],
        teleaccion: [false],
        teletexto: [false],
        teletex: [false],
        videotex: [false],
        suministroInformacion: [false],
      }, {
        validators: [requireCheckboxesToBeCheckedValidator()],
      } as AbstractControlOptions),
      listaAreas: this.fb.array([], Validators.required),
      listaEquipos: this.fb.array([], Validators.required),
      descripcionServicio: ["", [Validators.required, Validators.maxLength(500)]],
    });

    // this.formulario.controls['departamento'].disable()

    this.formulario.controls['flagANivelNacional'].valueChanges.subscribe((checked: boolean) => {
      //this.formulario.controls['departamento'].setValue("")
      this.formularioAgregarArea.controls['departamento'].setValue("")
      this.formularioAgregarArea.controls['provincia'].setValue("")
      this.formularioAgregarArea.controls['distrito'].setValue("")
      // this.formulario.controls['provincia'].setValue("")
      // this.formulario.controls['distrito'].setValue("")

      if (checked) {
        // this.formulario.controls['departamento'].disable()
        // this.formulario.controls['provincia'].disable()
        // this.formulario.controls['distrito'].disable()

        this.formularioAgregarArea.controls['departamento'].disable()
        this.formularioAgregarArea.controls['provincia'].disable()
        this.formularioAgregarArea.controls['distrito'].disable()
      } else {
        // this.formulario.controls['departamento'].enable()
        // this.formulario.controls['provincia'].enable()
        // this.formulario.controls['distrito'].enable()

        this.formularioAgregarArea.controls['departamento'].enable()
        this.formularioAgregarArea.controls['provincia'].enable()
        this.formularioAgregarArea.controls['distrito'].enable()

        // this.formulario.controls['departamento'].setValidators([Validators.required])
        // this.formulario.controls['provincia'].setValidators([Validators.required])
        // this.formulario.controls['distrito'].setValidators([Validators.required])

        this.formularioAgregarArea.controls['departamento'].setValidators([Validators.required])
        this.formularioAgregarArea.controls['provincia'].setValidators([Validators.required])
        this.formularioAgregarArea.controls['distrito'].setValidators([Validators.required])

      }
    })

    this.formularioAgregarArea = this.fb.group({
      departamento: ["", [Validators.required]],
      provincia: ["", [Validators.required]],
      distrito: ["", [Validators.required]],
      //flagANivelNacional: [false],
    });

    this.formularioAgregarEquipo = this.fb.group({
      nombre: ["", [Validators.required]],
      marca: ["", [Validators.required]],
      modelo: ["", [Validators.required]],
      cantidad: ["", [Validators.required]]
    });
  }

  // get Departamento(): AbstractControl { return this.formulario.get(['departamento']); }
  // get Provincia(): AbstractControl { return this.formulario.get(['provincia']); }
  // get Distrito(): AbstractControl { return this.formulario.get(['distrito']); }
  // get FlagANivelNacional(): AbstractControl { return this.formulario.get(['flagANivelNacional']); }

  get ServiciosRequeridos(): UntypedFormGroup { return this.formulario.get("serviciosRequeridos") as UntypedFormGroup }
  get AlmacenamientoRetransmision(): AbstractControl { return this.formulario.get('serviciosRequeridos.almacenamientoRetransmision'); }
  get Facsimil(): AbstractControl { return this.formulario.get('serviciosRequeridos.facsimil'); }
  get MensajeriaInterpersonal(): AbstractControl { return this.formulario.get('serviciosRequeridos.mensajeriaInterpersonal'); }
  get MensajeriaVoz(): AbstractControl { return this.formulario.get('serviciosRequeridos.mensajeriaVoz'); }
  get ServicioConsulta(): AbstractControl { return this.formulario.get('serviciosRequeridos.servicioConsulta'); }
  get ConmutacionDatos(): AbstractControl { return this.formulario.get('serviciosRequeridos.conmutacionDatos'); }
  get Teleproceso(): AbstractControl { return this.formulario.get('serviciosRequeridos.teleproceso'); }
  get Telealarma(): AbstractControl { return this.formulario.get('serviciosRequeridos.telealarma'); }
  get Telemando(): AbstractControl { return this.formulario.get('serviciosRequeridos.telemando'); }
  get Teleaccion(): AbstractControl { return this.formulario.get('serviciosRequeridos.teleaccion'); }
  get Teletexto(): AbstractControl { return this.formulario.get('serviciosRequeridos.teletexto'); }
  get Teletex(): AbstractControl { return this.formulario.get('serviciosRequeridos.teletex'); }
  get Videotex(): AbstractControl { return this.formulario.get('serviciosRequeridos.videotex'); }
  get SuministroInformacion(): AbstractControl { return this.formulario.get('serviciosRequeridos.suministroInformacion'); }
  // get Concesionario(): AbstractControl { return this.formulario.get(['concesionario']); }
  // get RucConcesionario(): AbstractControl { return this.formulario.get(['rucConcesionario']); }
  get ListaAreas(): UntypedFormArray { return this.formulario.get("listaAreas") as UntypedFormArray }
  get ListaEquipos(): UntypedFormArray { return this.formulario.get("listaEquipos") as UntypedFormArray }

  get DescripcionServicio(): AbstractControl { return this.formulario.get(['descripcionServicio']); }

  get Departamento(): AbstractControl { return this.formularioAgregarArea.get(['departamento']); }
  get Provincia(): AbstractControl { return this.formularioAgregarArea.get(['provincia']); }
  get Distrito(): AbstractControl { return this.formularioAgregarArea.get(['distrito']); }
  get FlagANivelNacional(): AbstractControl { return this.formulario.get(['flagANivelNacional']); }

  get NombreEquipo(): AbstractControl { return this.formularioAgregarEquipo.get(['nombre']); }
  get MarcaEquipo(): AbstractControl { return this.formularioAgregarEquipo.get(['marca']); }
  get ModeloEquipo(): AbstractControl { return this.formularioAgregarEquipo.get(['modelo']); }
  get CantidadEquipo(): AbstractControl { return this.formularioAgregarEquipo.get(['cantidad']); }

  nuevaArea(data: Area): UntypedFormGroup {
    return this.fb.group({
      departamento: data.departamento,
      provincia: data.provincia,
      distrito: data.distrito,
      //ubigeo: data.ubigeo
    })
  }

  nuevoEquipo(data: Equipo): UntypedFormGroup {
    return this.fb.group({
      nombre: data.nombre,
      marca: data.marca,
      modelo: data.modelo,
      cantidad: data.cantidad
    })
  }


  onChangeDepartamento(codDepartamento: string) {
    if (codDepartamento != "") {
      this.ubigeoService.provincia(Number(codDepartamento)).subscribe((data) => {
        this.listaProvincias = data;
        this.Provincia.setValue("");
      });
    } else {
      this.listaProvincias = [];
      this.Provincia.setValue("");
    }

    this.listaDistritos = [];
    this.Distrito.setValue("");
  }

  onChangeProvincia(codDepartamento: string, codProvincia: string) {
    if (codDepartamento != "" && codProvincia != "") {
      this.ubigeoService.distrito(Number(codDepartamento), Number(codProvincia)).subscribe((data) => {
        this.listaDistritos = data;
        this.Distrito.setValue("");
      });
    } else {
      this.listaDistritos = [];
      this.Distrito.setValue("");
    }
  }

  onChangeFlagANivelNacional() {
  console.log(this.FlagANivelNacional.value);
    if (this.FlagANivelNacional.value){
      this.ListaAreas.clearValidators();
      this.ListaAreas.updateValueAndValidity();
    }
    else{
      this.ListaAreas.setValidators(Validators.required);
      this.ListaAreas.updateValueAndValidity();
    }
      
  }

  // setUbigeoText(departamento:string, provincia:string, distrito:string){
  //   const idxDep = this.listaDepartamentos?.findIndex(item => this.campareStrings(item.text, departamento));
  //   if(idxDep > -1){
  //     const codDepartamento = this.listaDepartamentos[idxDep].value;
  //     this.Departamento.setValue(codDepartamento);

  //     this.ubigeoService.provincia(codDepartamento).subscribe((provincias) => {
  //       this.listaProvincias = provincias;

  //       //Buscar Provincia
  //       const idxProv = this.listaProvincias?.findIndex(item => this.campareStrings(item.text, provincia));
  //       if(idxProv > -1){
  //         const codProvincia = this.listaProvincias[idxProv].value;
  //         this.Provincia.setValue(codProvincia);

  //         this.ubigeoService.distrito(codDepartamento, codProvincia).subscribe((distritos) => {
  //           this.listaDistritos = distritos;

  //           //Buscar Distritos
  //           const idxDist = this.listaDistritos?.findIndex(item => this.campareStrings(item.text, distrito));
  //           if(idxDist > -1){
  //             const codDistrito = this.listaDistritos[idxDist].value;
  //             this.Distrito.setValue(codDistrito);
  //           }else{
  //             this.Distrito.enable();
  //           }
  //         });
  //       }else{
  //         this.Provincia.enable();
  //         this.Distrito.enable();
  //       }
  //     });
  //   }else{
  //     this.Departamento.enable();
  //     this.Provincia.enable();
  //     this.Distrito.enable();
  //   }
  // }

  onChangeInputPdf(event: any): any {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.diagramaConexionRed = {
      nombre: event.target.files[0].name,
      tamanio: event.target.files[0].size,
      ruta: null,
      archivo: event.target.files[0],
    } as DiagramaConexionRed

    event.target.value = "";
  }

  formatBytes(bytes: any, decimals: number = 2) {
    if (!bytes || bytes == 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  verDocumento(diagrama: DiagramaConexionRed) {
    if (diagrama.ruta) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(diagrama.ruta)
        .subscribe((file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = 'Vista Previa - Diagrama de conexión de red';
        }, (error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para descargar PDF');
        }))
    } else {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(diagrama.archivo);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa";
    }
  }

  get CountCaracteresDescripcionServicio(): string {
    const length = this.formulario.get(['descripcionServicio']).value.length
    // const value = this.DescripcionServicio.value.length
    return `${length} / 500`
  }

  eliminarPdf(diagrama: DiagramaConexionRed) {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar el documento seleccionado?', 'Eliminar')
      .then(() => {
        this.diagramaConexionRed = null
      });
  }

  eliminarConcesionario(index: number) {
    this.listaConcesionarios.splice(index)
  }

  agregarArea() {
    if (this.formularioAgregarArea.invalid)
      return this.formularioAgregarArea.markAllAsTouched();

    // Obtén los valores seleccionados de los selects
    const departamentoSeleccionado = this.listaDepartamentos.find(item => item.value === this.formularioAgregarArea.get('departamento').value)?.text;
    const provinciaSeleccionada = this.listaProvincias.find(item => item.value === this.formularioAgregarArea.get('provincia').value)?.text;
    const distritoSeleccionado = this.listaDistritos.find(item => item.value === this.formularioAgregarArea.get('distrito').value)?.text;

    // Agrega a la lista con las constantes
    this.ListaAreas.push(this.nuevaArea({
      departamento: departamentoSeleccionado,
      provincia: provinciaSeleccionada,
      distrito: distritoSeleccionado,
    } as Area));
    this.formularioAgregarArea.reset({
      departamento: '',
      provincia: '',
      distrito: '',
    });
  }

  eliminarArea(index: number) {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar el area?', 'Eliminar')
      .then(() => {
        this.ListaAreas.removeAt(index);
      });
  }

  agregarEquipo() {
    if (this.formularioAgregarEquipo.invalid)
      return this.formularioAgregarEquipo.markAllAsTouched();

    this.ListaEquipos.push(this.nuevoEquipo(this.formularioAgregarEquipo.value as Equipo))
    this.formularioAgregarEquipo.reset()
  }

  eliminarEquipo(index: number) {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar el equipo?', 'Eliminar')
      .then(() => {
        this.ListaEquipos.removeAt(index);
      });
  }

  onPressEnterRucConcesionario(event: any, ruc: string) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 13)
      this.buscarConcesionario(ruc)
  }

  onClickConcesionario() {
    this.concesionarioToched = true
  }

  buscarConcesionario(ruc: string) {
    if (ruc.length !== 11) {
      return
    }

    if (this.listaConcesionarios.findIndex(x => x.ruc == ruc) > -1) {
      return this.funcionesMtcService.mensajeError('El concesionario ya se encuentra en la lista');
    }

    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getDatosPrincipales(ruc)
      .subscribe(async (response) => {
        // this.habilitarBusquedaConcesionario=false
        this.rucConcesionario.nativeElement.value = '';
        this.funcionesMtcService.ocultarCargando();

        const { razonSocial, esActivo } = response

        if (!esActivo)
          return this.funcionesMtcService.mensajeError('El RUC se encuentra inactivo');

        this.listaConcesionarios.push({ ruc: ruc, nombre: razonSocial.trim() })

      }, (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el servicio de Sunat. Por favor inténtelo más tarde');
        this.habilitarBusquedaConcesionario = true
        // this.Concesionario.setValue("")
        // this.Concesionario.enable()
      })
  }

  onInputRucConcesionario() {
    this.habilitarBusquedaConcesionario = true
    // this.Concesionario.setValue("")
    // this.Concesionario.enable()
  }

  guardarAnexo() {
    console.log("this.formulario::",this.formulario);
    this.formularioAgregarEquipo.reset()
    this.concesionarioToched = true

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }
    if (this.listaConcesionarios.length === 0) {
      return this.funcionesMtcService.mensajeError("Debe ingresar al menos un concesionario");
    }
    if (!this.diagramaConexionRed) {
      return this.funcionesMtcService.mensajeError("Adjunte el diagrama de conexión de red");
    }


    const dataGuardar: Anexo004_B27Request = new Anexo004_B27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 4;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.tramiteReqId;

    //dataGuardar.metaData.seccion1.departamento = this.listaDepartamentos?.find(x => x.value == this.Departamento.value)?.text
    //dataGuardar.metaData.seccion1.provincia = this.listaProvincias?.find(x => x.value == this.Provincia.value)?.text
    //dataGuardar.metaData.seccion1.distrito = this.listaDistritos?.find(x => x.value == this.Distrito.value)?.text
    //dataGuardar.metaData.seccion1.ubigeo = `${this.Departamento.value}${this.Provincia.value}${this.Distrito.value}`
    //dataGuardar.metaData.seccion1.flagANivelNacional = this.FlagANivelNacional.value

    dataGuardar.metaData.seccion2.almacenamientoRetransmision = this.AlmacenamientoRetransmision.value
    dataGuardar.metaData.seccion2.facsimil = this.Facsimil.value
    dataGuardar.metaData.seccion2.mensajeriaInterpersonal = this.MensajeriaInterpersonal.value
    dataGuardar.metaData.seccion2.mensajeriaVoz = this.MensajeriaVoz.value
    dataGuardar.metaData.seccion2.servicioConsulta = this.ServicioConsulta.value
    dataGuardar.metaData.seccion2.conmutacionDatos = this.ConmutacionDatos.value
    dataGuardar.metaData.seccion2.teleproceso = this.Teleproceso.value
    dataGuardar.metaData.seccion2.telealarma = this.Telealarma.value
    dataGuardar.metaData.seccion2.telemando = this.Telemando.value
    dataGuardar.metaData.seccion2.teleaccion = this.Teleaccion.value
    dataGuardar.metaData.seccion2.teletexto = this.Teletexto.value
    dataGuardar.metaData.seccion2.teletex = this.Teletex.value
    dataGuardar.metaData.seccion2.videotex = this.Videotex.value
    dataGuardar.metaData.seccion2.suministroInformacion = this.SuministroInformacion.value
    dataGuardar.metaData.seccion2.concesionarios = this.listaConcesionarios
    // dataGuardar.metaData.seccion2.rucConcesionario = this.RucConcesionario.value

    dataGuardar.metaData.seccion1.areas = this.ListaAreas.value; // this.listaAreas
    dataGuardar.metaData.seccion1.flagANivelNacional = this.FlagANivelNacional.value
    dataGuardar.metaData.seccion3.equipos = this.ListaEquipos.value; // this.listaEquipos
    dataGuardar.metaData.seccion4.descripcionServicio = this.DescripcionServicio.value
    dataGuardar.metaData.seccion5.diagramaConexionRed = this.diagramaConexionRed

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.log("dataGuardar", dataGuardar)

    let msgPregunta: string = `¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;

    this.funcionesMtcService.mensajeConfirmar(msgPregunta)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.id === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
            .subscribe(data => {
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 004-B/27";
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

  soloNumeros(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  campareStrings(str1: string, str2: string) {
    const cadena1 = str1?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const cadena2 = str2?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    return cadena1 === cadena2 ? true : false;
  }

}
