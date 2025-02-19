import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_B27Request } from 'src/app/core/models/Anexos/Anexo001_B27NT/Anexo001_B27Request';
import { Anexo001_B27Response } from 'src/app/core/models/Anexos/Anexo001_B27NT/Anexo001_B27Response';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001B27NTService } from 'src/app/core/services/anexos/anexo001-b27NT.service';
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
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_B27NT/MetaData';
@Component({
  selector: 'app-anexo001-b27',
  templateUrl: './anexo001-b27.component.html',
  styleUrls: ['./anexo001-b27.component.css']
})
export class Anexo001B27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  id: number = 0;
  // idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  txtTitulo = 'ANEXO 001-B/27 - HOJA DE DATOS PERSONALES Y DECLARACIÓN JURADA PARA CONCESIÓN ÚNICA';
  txtTituloHelp = '(Del solicitante en caso de ser Persona Natural)'

  nombresApellidos:string
  tipoDocumento: TipoDocumentoModel
  nroDocumento: string
  ruc: string
  telefono: string
  celular: string
  correo: string
  domicilio: string
  distrito: string
  provincia: string
  departamento: string
  dia:string
  mes:string
  anio:string

  fecha:string

  formulario: UntypedFormGroup;

  active = 1;
  disabled: boolean = true;
  fileToUpload: File;
  idForm: number = 0;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001B27NTService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private formularioTramiteService: FormularioTramiteService
  ) {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
  }

  ngOnInit(): void {
    console.dir(this.dataInput)
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;
    this.tramiteReqId = this.dataInput.tramiteReqId;

    this.setForm();

    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (data: any) => {
        this.funcionesMtcService.ocultarCargando();
        const metaDataForm = JSON.parse(data.metaData) as MetaDataForm;

        if(metaDataForm.seccion3.tipoSolicitante != 'PN'){
          this.modalService.dismissAll();
          this.funcionesMtcService.mensajeError('El solicitante no es Persona Natural')
        }

        this.nombresApellidos = metaDataForm.seccion3.nombres
        this.tipoDocumento = metaDataForm.seccion3.tipoDocumento as TipoDocumentoModel
        this.nroDocumento = metaDataForm.seccion3.numeroDocumento
        this.ruc = metaDataForm.seccion3.ruc
        this.telefono = metaDataForm.seccion3.telefono
        this.celular = metaDataForm.seccion3.celular
        this.correo = metaDataForm.seccion3.email
        this.domicilio = metaDataForm.seccion3.domicilioLegal
        this.distrito = metaDataForm.seccion3.distrito
        this.provincia = metaDataForm.seccion3.provincia
        this.departamento = metaDataForm.seccion3.departamento

      }, (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario')
        .then(() => {
          this.modalService.dismissAll();
        });
      }
    );

    this.dia = this.Dia
    this.mes = this.Mes
    this.anio = this.Anio

    if (this.dataInput != null && this.id > 0) {

      this.funcionesMtcService.mostrarCargando();
      this.anexoTramiteService.get<Anexo001_B27Response>(this.tramiteReqId)
      .subscribe((dataAnexo) => {
        this.funcionesMtcService.ocultarCargando();
        this.id = dataAnexo.anexoId;

        const metaData = JSON.parse(dataAnexo.metaData) as MetaData;
        this.Declaracion1.setValue(metaData.seccion2.declaracion1);

      }, (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
      });
    }

  }

  setForm() {
    this.formulario = this.fb.group({
      Declaracion1: [false, [Validators.requiredTrue]],
    });
  }

  get Declaracion1(): AbstractControl { return this.formulario.get(['Declaracion1']); }

  get Dia(): string { return ('0' + (new Date().getDate())).slice(-2);
  }

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

  guardarAnexo() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    const dataGuardar: Anexo001_B27Request = new Anexo001_B27Request();

    dataGuardar.id = this.id;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.tramiteReqId;

    dataGuardar.metaData.seccion1.nombresApellidos = this.nombresApellidos
    dataGuardar.metaData.seccion1.tipoDocumento = this.tipoDocumento
    dataGuardar.metaData.seccion1.numeroDocumento = this.nroDocumento
    dataGuardar.metaData.seccion1.ruc = this.ruc
    dataGuardar.metaData.seccion1.telefono = this.telefono
    dataGuardar.metaData.seccion1.celular = this.celular
    dataGuardar.metaData.seccion1.correo = this.correo
    dataGuardar.metaData.seccion1.domicilio = this.domicilio
    dataGuardar.metaData.seccion1.distrito = this.distrito
    dataGuardar.metaData.seccion1.provincia = this.provincia
    dataGuardar.metaData.seccion1.departamento = this.departamento
    dataGuardar.metaData.seccion2.declaracion1 = this.Declaracion1.value
    dataGuardar.metaData.seccion2.dia = this.dia
    dataGuardar.metaData.seccion2.mes = this.mes
    dataGuardar.metaData.seccion2.anio = this.anio

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
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

    if (!this.uriArchivo || this.uriArchivo === '' || this.uriArchivo == null) {
      return this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');
    }

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-B/27";
        },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para descargar Pdf');
        }
      );

  }



}
