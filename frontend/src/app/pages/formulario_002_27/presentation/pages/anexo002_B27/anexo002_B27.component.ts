import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { MetaData as MetaDataForm} from '../../../domain/formulario002_27/formulario002_27Request';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { Anexo002_B27Request, HojaDatos, MetaData } from '../../../domain/anexo002_B27/anexo002_B27Request';
import { FormEstacionFijaSatelitalComponent } from '../../components/form-estacion-fija-satelital/form-estacion-fija-satelital.component';
import { Anexo002_B27Response } from '../../../domain/anexo002_B27/anexo002_B27Response';
import { Anexo002_B27Service } from '../../../application/usecases';

@Component({
  selector: 'app-anexo002_B27',
  templateUrl: './anexo002_B27.component.html',
  styleUrls: ['./anexo002_B27.component.css'],
})
export class Anexo002_B27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  listaHojaDatos: HojaDatos[] = []

  listaDepartamentos:Array<any>

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 002-B/27 - ESTACIONES FIJAS SATELITALES'
  txtTituloHelp = 'Descripción de las Estaciones, Asignación de Frecuencias, Ubicación y Equipamiento'

  @ViewChild('acc') acc: NgbAccordionDirective ;
  modalRefAnexo: NgbModalRef

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo002_B27Service,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private formularioTramiteService: FormularioTramiteService,
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

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.anexoTramiteService.get<Anexo002_B27Response>(this.tramiteReqId)
        .subscribe((dataAnexo) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = dataAnexo.anexoId;
          const metaData = JSON.parse(dataAnexo.metaData) as MetaData;

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

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario');
        }
      );
    }
  }

  abrirModal(idx:number|null=null) {
    console.log("idx", idx)
    const modalRef: NgbModalRef = this.modalService.open(FormEstacionFijaSatelitalComponent, { centered: true, size:"xl", scrollable: true });
    modalRef.componentInstance.dataIdx = idx
    modalRef.componentInstance.listaHojaDatos = this.listaHojaDatos;
    modalRef.componentInstance.dataInput = this.dataInput
    modalRef.componentInstance.listaDepartamentos = this.listaDepartamentos

    modalRef.result.then((response: HojaDatos) => {
      if (!response)
        return;

      if(idx !== null && idx >= 0)
        this.listaHojaDatos[idx] = response
      else
        this.listaHojaDatos.push(response)

    }, (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Ocurrió un error');
    });
  }

  eliminar(index: number) {
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro que desea eliminar este registro de la lista?`, 'Eliminar')
    .then(() => {
      this.listaHojaDatos.splice(index, 1);
    });
  }

  guardarAnexo() {
    if (this.listaHojaDatos.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos un registro');

    const dataGuardar: Anexo002_B27Request = new Anexo002_B27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.tramiteReqId;
    dataGuardar.metaData.hojaDatos = this.listaHojaDatos

    console.log("dataGuardar", dataGuardar)

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    let msgPregunta: string = `¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`;

    this.funcionesMtcService.mensajeConfirmar(msgPregunta)
    .then(() => {

      this.funcionesMtcService.mostrarCargando();

      if (this.id === 0) {
        //GUARDAR:
        this.anexoService.post(dataGuardarFormData)
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
        this.anexoService.put(dataGuardarFormData)
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
