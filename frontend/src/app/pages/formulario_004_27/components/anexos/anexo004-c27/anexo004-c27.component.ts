import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MetaData } from 'src/app/core/models/Anexos/Anexo004_C27/MetaData';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Anexo004_C27Request } from 'src/app/core/models/Anexos/Anexo004_C27/Anexo004_C27Request';
import { Anexo004_C27Response } from 'src/app/core/models/Anexos/Anexo004_C27/Anexo004_C27Response';
import { Anexo004C27Service } from 'src/app/core/services/anexos/anexo004-c27.service';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';

@Component({
  selector: 'app-anexo004-c27',
  templateUrl: './anexo004-c27.component.html',
  styleUrls: ['./anexo004-c27.component.css'],
})
export class Anexo004C27Component implements OnInit {

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
  txtTitulo = 'ANEXO 004-C/27 - REGISTROS'
  txtTituloHelp = 'Llenar solo los campos que correspondan al servicio solicitado'
  datosUsuarioLogin: DatosUsuarioLogin

  paSeccion2: string[] = ["DGPPC-023"];
  paSeccion4: string[] = ["DGPPC-023"];
  habilitarSeccion2: boolean = true;
  habilitarSeccion4: boolean = true;

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
    private anexoService: Anexo004C27Service,
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
    console.log("this.codigoProcedimientoTupa::", this.codigoProcedimientoTupa);
    console.log("Codigo Procedimiento:", this.paSeccion2.indexOf(this.codigoProcedimientoTupa));

    console.dir(this.dataInput)
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;
    this.tramiteReqId = this.dataInput.tramiteReqId;
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin()
    console.log("datosUsuarioLogin", this.datosUsuarioLogin)

    this.setForm();

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.anexoTramiteService.get<Anexo004_C27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;
          this.formulario.setValue(metaData);

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });

    }else{
      this.funcionesMtcService.mostrarCargando();
      console.log("this.dataInput.tramiteReqRefId", this.dataInput.tramiteReqRefId)
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          if(this.datosUsuarioLogin.tipoPersona=='00002'){
            this.rucDocIdentidad.setValue(this.datosUsuarioLogin.ruc)
            this.nombresRazonSocial.setValue(this.datosUsuarioLogin.razonSocial)
          } else {
            this.rucDocIdentidad.setValue(this.datosUsuarioLogin.nroDocumento)
            this.nombresRazonSocial.setValue(`${this.datosUsuarioLogin.nombres} ${this.datosUsuarioLogin.apePaterno} ${this.datosUsuarioLogin.apeMaterno}`)
          }
        }, (error) => {
          console.log("error::",error);
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario');
        }
      );
    }


    if (this.paSeccion2.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion2 = true; else this.habilitarSeccion2 = false;
    if (this.paSeccion4.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion4 = true; else this.habilitarSeccion4 = false;


  }

  setForm() {
    this.formulario = this.fb.group({
      seccion1: this.fb.group({
        rucDocIdentidad: ["", [Validators.required]],
        nombresRazonSocial: ["", [Validators.required]],
      }),
      seccion2: this.fb.group({ // DGC-007 (PARA COMERCIALIZADORES)
        comercializaServicio: [false],
        comercializaTrafico: [false],
        descripcion: [""],
        areaComercializacion: [""],
      }),
      seccion3: this.fb.group({ // DGC-013 (PARA PERSONAS HABILITADAS A REALIZAR ESTUDIOS TEORICOS Y MEDICIONES...)
        habilitacionEstudios: [false],
        habilitacionMediciones: [false],
        objetoSocial: [""],
      }),
      seccion4: this.fb.group({ // DGC-009 (PARA PROVEEDORES DE CAPACIDAD SATELITAL)
        especificacionesTecnicas: [""],
        interfacesSistemaSatelital: [""],
        interfacesUsuario: [""],
        servicioBrindar: [""],
      }),
      nombreCompleto: [this.seguridadService.getUserName()],
      nroDocumento: [this.seguridadService.getNumDoc()],
    });

    if(this.codigoProcedimientoTupa == "DGC-007"){
      this.descripcion.setValidators([Validators.required])
      this.areaComercializacion.setValidators([Validators.required])
    }

    if(this.codigoProcedimientoTupa == "DGC-013"){
      this.objetoSocial.setValidators([Validators.required])
    }

    if(this.codigoProcedimientoTupa == "DGC-009"){
      this.especificacionesTecnicas.setValidators([Validators.required])
      this.interfacesSistemaSatelital.setValidators([Validators.required])
      this.interfacesUsuario.setValidators([Validators.required])
      this.servicioBrindar.setValidators([Validators.required])
    }
  }

  get rucDocIdentidad(): AbstractControl { return this.formulario.get('seccion1.rucDocIdentidad'); }
  get nombresRazonSocial(): AbstractControl { return this.formulario.get('seccion1.nombresRazonSocial'); }

  get comercializaServicio(): AbstractControl { return this.formulario.get('seccion2.comercializaServicio'); }
  get comercializaTrafico(): AbstractControl { return this.formulario.get('seccion2.comercializaTrafico'); }
  get descripcion(): AbstractControl { return this.formulario.get('seccion2.descripcion'); }
  get areaComercializacion(): AbstractControl { return this.formulario.get('seccion2.areaComercializacion'); }

  get habilitacionEstudios(): AbstractControl { return this.formulario.get('seccion3.habilitacionEstudios'); }
  get habilitacionMediciones(): AbstractControl { return this.formulario.get('seccion3.habilitacionMediciones'); }
  get objetoSocial(): AbstractControl { return this.formulario.get('seccion3.objetoSocial'); }

  get especificacionesTecnicas(): AbstractControl { return this.formulario.get('seccion4.especificacionesTecnicas'); }
  get interfacesSistemaSatelital(): AbstractControl { return this.formulario.get('seccion4.interfacesSistemaSatelital'); }
  get interfacesUsuario(): AbstractControl { return this.formulario.get('seccion4.interfacesUsuario'); }
  get servicioBrindar(): AbstractControl { return this.formulario.get('seccion4.servicioBrindar'); }


  soloNumerosDecimal(event) {
    event.target.value = event.target.value.replace(/[^0-9\.]/g, '');
  }

  guardarAnexo() {
    console.log("this.formulario::",this.formulario);
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    if(this.codigoProcedimientoTupa == "DGC-007"){
      if(!this.comercializaServicio.value && !this.comercializaTrafico.value)
        return this.funcionesMtcService.mensajeError('Seleccione la inscripción para comercializar');
    }

    if(this.codigoProcedimientoTupa == "DGC-013"){
      if(!this.habilitacionEstudios.value && !this.habilitacionMediciones.value)
        return this.funcionesMtcService.mensajeError('Seleccione la habilitación a realizar');
    }

    const dataGuardar: Anexo004_C27Request = new Anexo004_C27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 4;
    dataGuardar.codigo = "C";
    dataGuardar.tramiteReqId = this.tramiteReqId;
    dataGuardar.metaData = this.formulario.value as MetaData

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
