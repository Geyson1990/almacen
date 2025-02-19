import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal , NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Anexo002G17Service } from 'src/app/core/services/anexos/anexo002-g17.service';
import { Anexo002_G17Response } from 'src/app/core/models/Anexos/Anexo002_G17/Anexo002_G17Response';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';

@Component({
  selector: 'app-anexo002-g17',
  templateUrl: './anexo002-g17.component.html',
  styleUrls: ['./anexo002-g17.component.css'],
})

export class Anexo002G17Component implements OnInit {

  active = 1;

  codigoTupa: string = "" ;
  descripcionTupa: string;

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  idAnexoMovimiento: number = 0;
  anexoFormulario: UntypedFormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo002G17Service,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
  ) { }

    ngOnInit(): void {

      //VERIFICAMOS QUE EL FORMULARIO YA ESTÉ GRABADO
      for (let i = 0; i < this.dataRequisitosInput.length; i++) {
        if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
          if (this.dataRequisitosInput[i].movId === 0) {
            this.activeModal.close(this.graboUsuario);
            this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
            return;
          }
        }
      }

      const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));

      this.codigoTupa = tramite.codigo;
      this.descripcionTupa = tramite.nombre;

      this.uriArchivo = this.dataInput.rutaDocumento;

      this.recuperarInformacion();

      this.anexoFormulario = this.fb.group({
        s1_apellidosNombres: this.fb.control('', [Validators.required]),
        s1_nroDocumento: this.fb.control('', [Validators.required]),
        s1_calidad: this.fb.control('', [Validators.required]),
        s1_razonSocial: this.fb.control('', [Validators.required]),
        s1_nroPartida: this.fb.control('', [Validators.required]),
        s1_domicilio: this.fb.control('', [Validators.required]),
        dia: this.fb.control(this.getDia(), [Validators.required]),
        mes: this.fb.control(this.getMes(), [Validators.required]),
        anio: this.fb.control(this.getAnio(), [Validators.required]),
      });

      setTimeout(() => {
        this.acc.expand('seccion-1');
      });

    }

    formInvalid(control: string) {
      return this.anexoFormulario.get(control).invalid &&
        (this.anexoFormulario.get(control).dirty || this.anexoFormulario.get(control).touched);
    }

    getDia() {
      return ('0' + (new Date().getDate())).slice(-2);
    }

    getMes() {
      switch (new Date().getMonth()) {
        case 0:
          return 'Enero';
        case 1:
          return 'Febrero';
        case 2:
          return 'Marzo';
        case 3:
          return 'Abril';
        case 4:
          return 'Mayo';
        case 5:
          return 'Junio';
        case 6:
          return 'Julio';
        case 7:
          return 'Agosto';
        case 8:
          return 'Setiembre';
        case 9:
          return 'Octubre';
        case 10:
          return 'Noviembre';
        case 11:
          return 'Diciembre';
      }
    }

    getAnio() {
      return new Date().getFullYear().toString().substr(2);
    }

    descargarPdf() {
      if (this.idAnexoMovimiento === 0)
        return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.uriArchivo)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-G/17";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );

    }

    guardarAnexo() {

      if (this.anexoFormulario.invalid === true)
        return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      let dataGuardar = {
        id: this.idAnexoMovimiento,
        tramiteReqId: this.dataInput.tramiteReqId,
        movimientoFormularioId: this.dataInput.tramiteReqRefId,
        anexoId: 2,
        codigo: "G",
        metaData: {
          seccion1: {
            apellidosNombres : this.anexoFormulario.controls['s1_apellidosNombres'].value,
            nroDocumento : this.anexoFormulario.controls['s1_nroDocumento'].value,
            calidad : this.anexoFormulario.controls['s1_calidad'].value,
            razonSocial : this.anexoFormulario.controls['s1_razonSocial'].value,
            nroPartida : this.anexoFormulario.controls['s1_nroPartida'].value,
            domicilio : this.anexoFormulario.controls['s1_domicilio'].value,
            dia : this.getDia(),
            mes : this.getMes(),
            anio : this.getAnio(),
          }
        }
      }

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexoMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        console.log(JSON.stringify(dataGuardar));

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexoMovimiento === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexoMovimiento = data.id;

                this.uriArchivo = data.uriArchivo;
                this.graboUsuario = true;

                this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
        } else {
          //MODIFICAR
          this.anexoService.put<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexoMovimiento = data.id;

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

    recuperarInformacion(){

        //si existe el documento pero no esta completo
        if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
            this.heredarInformacionFormulario();
            //RECUPERAMOS Y CARGAMOS LOS DATOS DEL ANEXO A EXCEPCION DE LOS CAMPOS HEREDADOS DEL FORMULARIO
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo002_G17Response) => {
                const metaData: any = JSON.parse(dataAnexo.metaData);
                console.log(JSON.stringify(metaData, null, 10));
                this.idAnexoMovimiento = dataAnexo.anexoId;

                this.anexoFormulario.get("dia").setValue(metaData.seccion1.dia);
                this.anexoFormulario.get("mes").setValue(metaData.seccion1.mes);
                this.anexoFormulario.get("anio").setValue(metaData.seccion1.anio);

              },
              error => {
                this.errorAlCargarData = true;
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para recuperar los datos guardados del anexo');
              });
        }
        //si existe el documento y esta completo
        else if (this.dataInput.movId > 0 && this.dataInput.completo === true) {
            //RECUPERAMOS LOS DATOS DEL ANEXO
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo002_G17Response) => {
                const metaData: any = JSON.parse(dataAnexo.metaData);

                this.idAnexoMovimiento = dataAnexo.anexoId;

                console.log(JSON.stringify(dataAnexo, null, 10));
                console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

                this.anexoFormulario.get("s1_apellidosNombres").setValue(metaData.seccion1.apellidosNombres);
                this.anexoFormulario.get("s1_nroDocumento").setValue(metaData.seccion1.nroDocumento);

                this.anexoFormulario.get("s1_calidad").setValue(metaData.seccion1.calidad);
                this.anexoFormulario.get("s1_razonSocial").setValue(metaData.seccion1.razonSocial);
                this.anexoFormulario.get("s1_nroPartida").setValue(metaData.seccion1.nroPartida);
                this.anexoFormulario.get("s1_domicilio").setValue(metaData.seccion1.domicilio);

                this.anexoFormulario.get("dia").setValue(metaData.seccion1.dia);
                this.anexoFormulario.get("mes").setValue(metaData.seccion1.mes);
                this.anexoFormulario.get("anio").setValue(metaData.seccion1.anio);

              },
              error => {
                this.errorAlCargarData = true;
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para recuperar los datos guardados del anexo');
              });
        }else{
            //si es un nuevo registro
            this.heredarInformacionFormulario();
        }

    }

    heredarInformacionFormulario(){

        this.funcionesMtcService.mostrarCargando();

        this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
          (dataForm: any) => {

            this.funcionesMtcService.ocultarCargando();
            const metaDataForm: any = JSON.parse(dataForm.metaData);

            console.log(JSON.stringify(metaDataForm));

            this.anexoFormulario.controls['s1_apellidosNombres'].setValue(`${metaDataForm?.seccion1?.nombresRepresentante} ${metaDataForm?.seccion1?.apellidoPaternoRepresentante} ${metaDataForm?.seccion1?.apellidoMaternoRepresentante}`);
            this.anexoFormulario.controls['s1_nroDocumento'].setValue(metaDataForm?.seccion1?.nroDocRepresentante);

            this.anexoFormulario.controls['s1_calidad'].setValue('Representante Legal');
            this.anexoFormulario.controls['s1_razonSocial'].setValue(metaDataForm?.seccion1?.razonSocial);
            this.anexoFormulario.controls['s1_nroPartida'].setValue(metaDataForm?.seccion1?.nroPartida);
            this.anexoFormulario.controls['s1_domicilio'].setValue(metaDataForm?.seccion1?.domicilioLegal);

          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
          }
        );

    }

}
