import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo004_A27Request } from 'src/app/core/models/Anexos/Anexo004_A27/Anexo004_A27Request';
import { Anexo004_A27Response } from 'src/app/core/models/Anexos/Anexo004_A27/Anexo004_A27Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo004A27Service } from 'src/app/core/services/anexos/anexo004-a27.service';
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
import { HojaDatos, MetaData } from 'src/app/core/models/Anexos/Anexo004_A27/MetaData';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { TipoMonedaModel } from 'src/app/core/models/TipoMonedaModel';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';

@Component({
  selector: 'app-anexo004-a27',
  templateUrl: './anexo004-a27.component.html',
  styleUrls: ['./anexo004-a27.component.css'],
})
export class Anexo004A27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  listaHojaDatos: HojaDatos[] = []

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'D.N.I.' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];

  listaTiposMoneda: TipoMonedaModel[] = [
    { id: 'PEN', descripcion: 'Soles' },
    { id: 'USD', descripcion: 'Dólares de los Estados Unidos de América' },
  ];

  listaOficinasRegistrales: OficinaRegistralModel[];
  DatosUsuarioLogin: DatosUsuarioLogin

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 004-A/27 - REGISTRO DE SERVICIOS PÚBLICOS'
  txtTituloHelp = 'Llenar solo los campos que correspondan al servicio solicitado'

  _modalidadServicio: Array<any> = [
    {codigo: "M01", descripcion: "Portador Local (Modalidades: Conmutado y/o No Conmutado"},
    {codigo: "M02", descripcion: "Portador de Larga Distancia Internacional (Modalidades: Conmutado y/o No Conmutado)"},
    {codigo: "M03", descripcion: "Portador de Larga Distancia Nacional (Modalidades: Conmutado y/o No Conmutado)"},
    {codigo: "M04", descripcion: "Telefonía Fija (Modalidades: Abonados y/o Teléfonos Públicos"},
    {codigo: "M05", descripcion: "Telefonía Móvil (Modalidades: Abonados y/o Teléfonos Públicos)"},
    {codigo: "M06", descripcion: "Distribución de Radiodifusión por cable: Cable alámbrico u óptico"},
    {codigo: "M07", descripcion: "Distribución de Radiodifusión por cable: Difusión directa por satélite"},
    {codigo: "M08", descripcion: "Distribución de Radiodifusión por cable: MMDS"},
    {codigo: "M09", descripcion: "Servicio Móvil de Canales Múltiples de Selección Automática (Troncalizado)"},
    {codigo: "M10", descripcion: "Servicio de Comunicaciones Personales (PCS)"},
    {codigo: "M11", descripcion: "Móvil por Satélite"},
    {codigo: "M12", descripcion: "Móvil de Datos Marítimo por Satélite"},
    {codigo: "M99", descripcion: "Otros"},
  ]

  formulario: UntypedFormGroup;

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo004A27Service,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private oficinaRegistralService: OficinaRegistralService,
  ) {

    for (let i = 0; i < this._modalidadServicio.length; i++) {
      this.listaHojaDatos[i] = new HojaDatos()
      this.listaHojaDatos[i].seccion2.modalidadServicio = this._modalidadServicio[i].codigo
    }

    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

    this.oficinaRegistralService.oficinaRegistral().subscribe((response:any) => {
      this.listaOficinasRegistrales = response.map(data => ({ id: data.value, descripcion: data.text } as OficinaRegistralModel) )
    })
  }

  ngOnInit() {
    console.dir(this.listaHojaDatos)
    console.dir(this.dataInput)
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;
    this.tramiteReqId = this.dataInput.tramiteReqId;
    this.DatosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin()

    this.setForm();

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.anexoTramiteService.get<Anexo004_A27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;

          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;

          metaData.hojaDatos.forEach(element => {
            this.listaHojaDatos[this.listaHojaDatos.findIndex(item => item.seccion2.modalidadServicio === element.seccion2.modalidadServicio)] = element
          });

          this.NombresRazonSocial.setValue(metaData.seccion1.nombresRazonSocial)
          this.NroDocumento.setValue(metaData.seccion1.nroDocumento)
          this.NombresFirmante.setValue(metaData.nombresFirmante)
          this.patchForm(this.listaHojaDatos)

          const formArray = <UntypedFormArray>this.formulario.get('HojaDatos');

          for (let control of formArray.controls) {
            this.checkValueModalidad(control as UntypedFormGroup)
          }

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });

    }else{

      this.patchForm(this.listaHojaDatos);

      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          const metaDataForm = JSON.parse(dataForm.metaData) as MetaDataForm;
          console.dir(metaDataForm)
          if(metaDataForm.seccion3.tipoSolicitante==="PN"){
            this.NombresRazonSocial.setValue(`${metaDataForm.seccion3.nombres}`)
            this.NroDocumento.setValue(`${metaDataForm.seccion3.numeroDocumento}`)
          } else {
            this.NombresRazonSocial.setValue(metaDataForm.seccion3.razonSocial)
            this.NroDocumento.setValue(metaDataForm.seccion3.ruc)
          }

          this.NombresFirmante.setValue(metaDataForm.seccion5.nombresFirmante)
        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos del formulario');
        }
      );
    }

  }

  setForm() {
    this.formulario = this.fb.group({
      NombresRazonSocial: ["", [Validators.required]],
      NroDocumento: ["", [Validators.required]],
      HojaDatos: this.fb.array([]), // create empty form array
      NombresFirmante: ["", [Validators.required]],
    });
  }

  patchForm(lista: Array<HojaDatos>) {
    const hojaDatos = <UntypedFormArray>this.formulario.get('HojaDatos');
    lista.forEach((data: HojaDatos ) => {
      hojaDatos.push(this.patchFormValues(data))
    });
    // Object.keys(control).forEach(key => {
    //   this.checkValueModalidad(control[key])
    // });
  }

  patchFormValues(data: HojaDatos) {
    console.log("data.seccion3", data.seccion3)
    const formGroup: UntypedFormGroup =  this.fb.group({
      Seccion2: this.fb.group({
        ModalidadServicio: [data.seccion2.modalidadServicio, [Validators.required]],
        Marca1: [data.seccion2.marca1],
        Marca2: [data.seccion2.marca2],
        OtraModalidad: [data.seccion2.otraModalidad],
      }),
      Seccion3: this.fb.group({
        TipoMoneda: [data.seccion3.tipoMoneda],
        InversionAnio1: [data.seccion3.inversionAnio1 >= 0 ? parseFloat(data.seccion3.inversionAnio1?.toString()).toFixed(2) : null],
        InversionAnio2: [data.seccion3.inversionAnio2 >= 0 ? parseFloat(data.seccion3.inversionAnio2?.toString()).toFixed(2) : null],
        InversionAnio3: [data.seccion3.inversionAnio3 >= 0 ? parseFloat(data.seccion3.inversionAnio3?.toString()).toFixed(2) : null],
        InversionAnio4: [data.seccion3.inversionAnio4 >= 0 ? parseFloat(data.seccion3.inversionAnio4?.toString()).toFixed(2) : null],
        InversionAnio5: [data.seccion3.inversionAnio5 >= 0 ? parseFloat(data.seccion3.inversionAnio5?.toString()).toFixed(2) : null],
        InversionTotal: [data.seccion3.inversionTotal >= 0 ? parseFloat(data.seccion3.inversionTotal?.toString()).toFixed(2) : null],
      })
    })

    const Seccion3 = formGroup.get('Seccion3') as UntypedFormGroup

    Object.keys(Seccion3.controls).forEach(key => {
      if(Seccion3.controls[key] !== Seccion3.controls['TipoMoneda'] && Seccion3.controls[key] !== Seccion3.controls['InversionTotal']){
        Seccion3.controls[key].valueChanges.subscribe(() => {
          const total = Number(!isNaN(Seccion3.get('InversionAnio1').value) ? Seccion3.get('InversionAnio1').value: null) +
                        Number(!isNaN(Seccion3.get('InversionAnio2').value) ? Seccion3.get('InversionAnio2').value: null) +
                        Number(!isNaN(Seccion3.get('InversionAnio3').value) ? Seccion3.get('InversionAnio3').value: null) +
                        Number(!isNaN(Seccion3.get('InversionAnio4').value) ? Seccion3.get('InversionAnio4').value: null) +
                        Number(!isNaN(Seccion3.get('InversionAnio5').value) ? Seccion3.get('InversionAnio5').value: null)

          Seccion3.get('InversionTotal').setValue(parseFloat(total?.toString()).toFixed(2))
        });
      }
    });

    return formGroup
  }

  getNombreModalidadServicio(codigo: string) : string{
    return this._modalidadServicio[this._modalidadServicio.findIndex( item => item.codigo === codigo)].descripcion
  }

  get NombresRazonSocial(): AbstractControl { return this.formulario.get('NombresRazonSocial'); }
  get NroDocumento(): AbstractControl { return this.formulario.get('NroDocumento'); }
  get HojaDatos(): UntypedFormArray { return <UntypedFormArray>this.formulario.get('HojaDatos'); }
  get NombresFirmante(): AbstractControl { return this.formulario.get('NombresFirmante'); }

  checkValueModalidad(formGroup: UntypedFormGroup){
    const marca1 = formGroup.get('Seccion2.Marca1').value
    const marca2 = formGroup.get('Seccion2.Marca2').value

    if(!marca1 && !marca2){
      this.changeValidatorsModalidad(formGroup, false)
    } else {
      this.changeValidatorsModalidad(formGroup, true)
    }
  }

  changeValidatorsModalidad(formGroup: UntypedFormGroup, activar:boolean) {
    if(activar){
      formGroup.get('Seccion3.TipoMoneda').setValidators([Validators.required])
      formGroup.get('Seccion3.InversionAnio1').setValidators([Validators.required, Validators.pattern(/^[0-9.]+$/)])
      formGroup.get('Seccion3.InversionAnio2').setValidators([Validators.required, Validators.pattern(/^[0-9.]+$/)])
      formGroup.get('Seccion3.InversionAnio3').setValidators([Validators.required, Validators.pattern(/^[0-9.]+$/)])
      formGroup.get('Seccion3.InversionAnio4').setValidators([Validators.required, Validators.pattern(/^[0-9.]+$/)])
      formGroup.get('Seccion3.InversionAnio5').setValidators([Validators.required, Validators.pattern(/^[0-9.]+$/)])
      formGroup.get('Seccion3.InversionTotal').setValidators([Validators.required, Validators.pattern(/^[0-9.]+$/)])
      if( formGroup.get('Seccion2.ModalidadServicio').value === 'M99' ) {
        formGroup.get('Seccion2.OtraModalidad').setValidators([Validators.required])
      }
    }else{
      formGroup.get('Seccion3.TipoMoneda').clearValidators();
      formGroup.get('Seccion3.InversionAnio1').clearValidators();
      formGroup.get('Seccion3.InversionAnio2').clearValidators();
      formGroup.get('Seccion3.InversionAnio3').clearValidators();
      formGroup.get('Seccion3.InversionAnio4').clearValidators();
      formGroup.get('Seccion3.InversionAnio5').clearValidators();
      formGroup.get('Seccion3.InversionTotal').clearValidators();
      if( formGroup.get('Seccion2.ModalidadServicio').value === 'M99' ) {
        formGroup.get('Seccion2.OtraModalidad').clearValidators()
      }
    }

    formGroup.get('Seccion3.TipoMoneda').updateValueAndValidity()
    formGroup.get('Seccion3.InversionAnio1').updateValueAndValidity();
    formGroup.get('Seccion3.InversionAnio2').updateValueAndValidity();
    formGroup.get('Seccion3.InversionAnio3').updateValueAndValidity();
    formGroup.get('Seccion3.InversionAnio4').updateValueAndValidity();
    formGroup.get('Seccion3.InversionAnio5').updateValueAndValidity();
    formGroup.get('Seccion3.InversionTotal').updateValueAndValidity();
    formGroup.get('Seccion2.OtraModalidad').updateValueAndValidity()
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

  guardarAnexo() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    const modalidadesSeleccionadas = this.HojaDatos.value.filter(o => o.Seccion2.Marca1 || o.Seccion2.Marca2);

    if(modalidadesSeleccionadas.length === 0)
      return this.funcionesMtcService.mensajeError('Seleccione al menos una modalidad de servicio');

    const dataGuardar: Anexo004_A27Request = new Anexo004_A27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 4;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.tramiteReqId;

    dataGuardar.metaData.seccion1.nombresRazonSocial = this.NombresRazonSocial.value
    dataGuardar.metaData.seccion1.nroDocumento = this.NroDocumento.value
    dataGuardar.metaData.hojaDatos = modalidadesSeleccionadas
    dataGuardar.metaData.nombresFirmante = this.NombresFirmante.value
    dataGuardar.metaData.nroDocumentoFirmante = this.DatosUsuarioLogin.nroDocumento

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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 004-A/27";
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

  setTwoNumberDecimal(control: AbstractControl) {
    control.setValue(parseFloat(control.value).toFixed(2))
  }

}
