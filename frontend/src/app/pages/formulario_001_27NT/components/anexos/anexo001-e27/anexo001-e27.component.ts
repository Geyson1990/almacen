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
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_E27NT/MetaData';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Anexo001_E27Request } from 'src/app/core/models/Anexos/Anexo001_E27NT/Anexo001_E27Request';
import { Anexo001E27NTService } from 'src/app/core/services/anexos/anexo001-e27NT.service';
import { Anexo001_E27Response } from 'src/app/core/models/Anexos/Anexo001_E27NT/Anexo001_E27Response';

@Component({
  selector: 'app-anexo001-e27',
  templateUrl: './anexo001-e27.component.html',
  styleUrls: ['./anexo001-e27.component.css'],
})
export class Anexo001E27Component implements OnInit {

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
  txtTitulo = 'ANEXO 001-E/27 - MODIFICACIÓN DEL PLAN DE COBERTURA'
  txtTituloHelp = ''

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
    private anexoService: Anexo001E27NTService,
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
        this.anexoTramiteService.get<Anexo001_E27Response>(this.tramiteReqId)
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
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();
          const dataUsuarioLogin = this.seguridadService.getDatosUsuarioLogin()
          this.empresa.setValue(dataUsuarioLogin.razonSocial)

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
        modalidad: ["", [Validators.required]],
      }),
      seccion2: this.fb.group({
        planAnual: this.fb.group({
          anio1: ["", [Validators.required]],
          anio2: ["", [Validators.required]],
          anio3: ["", [Validators.required]],
          anio4: ["", [Validators.required]],
          anio5: ["", [Validators.required]],
        }),
        planAcumulado: this.fb.group({
          anio1: ["", [Validators.required]],
          anio2: ["", [Validators.required]],
          anio3: ["", [Validators.required]],
          anio4: ["", [Validators.required]],
          anio5: ["", [Validators.required]],
        }),
      }),
      seccion3: this.fb.group({
        planAnual: this.fb.group({
          anio1: ["", [Validators.required]],
          anio2: ["", [Validators.required]],
          anio3: ["", [Validators.required]],
          anio4: ["", [Validators.required]],
          anio5: ["", [Validators.required]],
        }),
        planAcumulado: this.fb.group({
          anio1: ["", [Validators.required]],
          anio2: ["", [Validators.required]],
          anio3: ["", [Validators.required]],
          anio4: ["", [Validators.required]],
          anio5: ["", [Validators.required]],
        }),
      }),
    });
  }

  get empresa(): AbstractControl { return this.formulario.get('seccion1.empresa'); }
  get servicio(): AbstractControl { return this.formulario.get('seccion1.servicio'); }
  get modalidad(): AbstractControl { return this.formulario.get('seccion1.modalidad'); }

  get planAprobadoAnualAnio1(): AbstractControl { return this.formulario.get('seccion2.planAnual.anio1'); }
  get planAprobadoAnualAnio2(): AbstractControl { return this.formulario.get('seccion2.planAnual.anio2'); }
  get planAprobadoAnualAnio3(): AbstractControl { return this.formulario.get('seccion2.planAnual.anio3'); }
  get planAprobadoAnualAnio4(): AbstractControl { return this.formulario.get('seccion2.planAnual.anio4'); }
  get planAprobadoAnualAnio5(): AbstractControl { return this.formulario.get('seccion2.planAnual.anio5'); }
  get planAprobadoAcumuladoAnio1(): AbstractControl { return this.formulario.get('seccion2.planAcumulado.anio1'); }
  get planAprobadoAcumuladoAnio2(): AbstractControl { return this.formulario.get('seccion2.planAcumulado.anio2'); }
  get planAprobadoAcumuladoAnio3(): AbstractControl { return this.formulario.get('seccion2.planAcumulado.anio3'); }
  get planAprobadoAcumuladoAnio4(): AbstractControl { return this.formulario.get('seccion2.planAcumulado.anio4'); }
  get planAprobadoAcumuladoAnio5(): AbstractControl { return this.formulario.get('seccion2.planAcumulado.anio5'); }

  get planPropuestoAnualAnio1(): AbstractControl { return this.formulario.get('seccion3.planAnual.anio1'); }
  get planPropuestoAnualAnio2(): AbstractControl { return this.formulario.get('seccion3.planAnual.anio2'); }
  get planPropuestoAnualAnio3(): AbstractControl { return this.formulario.get('seccion3.planAnual.anio3'); }
  get planPropuestoAnualAnio4(): AbstractControl { return this.formulario.get('seccion3.planAnual.anio4'); }
  get planPropuestoAnualAnio5(): AbstractControl { return this.formulario.get('seccion3.planAnual.anio5'); }
  get planPropuestoAcumuladoAnio1(): AbstractControl { return this.formulario.get('seccion3.planAcumulado.anio1'); }
  get planPropuestoAcumuladoAnio2(): AbstractControl { return this.formulario.get('seccion3.planAcumulado.anio2'); }
  get planPropuestoAcumuladoAnio3(): AbstractControl { return this.formulario.get('seccion3.planAcumulado.anio3'); }
  get planPropuestoAcumuladoAnio4(): AbstractControl { return this.formulario.get('seccion3.planAcumulado.anio4'); }
  get planPropuestoAcumuladoAnio5(): AbstractControl { return this.formulario.get('seccion3.planAcumulado.anio5'); }

  soloNumerosDecimal(event) {
    event.target.value = event.target.value.replace(/[^0-9\.]/g, '');
  }

  guardarAnexo() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    const dataGuardar: Anexo001_E27Request = new Anexo001_E27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "E";
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
