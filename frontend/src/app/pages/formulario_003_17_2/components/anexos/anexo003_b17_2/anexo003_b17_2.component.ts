import { Component, OnInit, Injectable, ViewChild, Input } from '@angular/core';
import { getDocIdentidad } from 'src/app/core/services/servicios/docidentidad.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Anexo003_B172Request } from 'src/app/core/models/Anexos/Anexo003_B17_2/Anexo003_B172Request';
import { Anexo003_B172Response } from 'src/app/core/models/Anexos/Anexo003_B17_2/Anexo003_B172Response';
import { Anexo003B172Service } from 'src/app/core/services/anexos/anexo003-b172.service';
import { ActivatedRoute } from '@angular/router';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { leadingComment, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecModel } from 'src/app/core/models/ReniecModel';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { Tripulacion } from 'src/app/core/models/Anexos/Anexo002_I17/Tripulacion';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';

@Component({
   selector: 'app-anexo003_b17_2',
   templateUrl: './anexo003_b17_2.component.html',
   styleUrls: ['./anexo003_b17_2.component.css']
})
export class Anexo003_b17_2_Component implements OnInit {

   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective ;

   graboUsuario: boolean = false;
   idAnexo: number = 0;
   uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

   anexoFormulario: FormGroup;
   filePdfSeleccionado: any = null;
   indexEditTabla: number = -1;

   listaTripulacion: Tripulacion[] = [];

   representanteLegal: RepresentanteLegal[] = [];

   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "1", documento: 'DNI' },
      { id: "2", documento: 'Carné de Extranjería' },
      { id: "5", documento: 'Carné de Permiso Temp. Perman.' },
      { id: "6", documento: 'Permiso Temporal Permanencia' }
   ];

   listaCargos: SelectionModel[] = [
      { value: 1, text: 'Gerente General' },
      { value: 2, text: 'Socios' },
      { value: 3, text: 'Accionistas' },
      { value: 4, text: 'Asociados' },
      { value: 5, text: 'Directores' },
      { value: 6, text: 'Administradores' },
      { value: 7, text: 'Representante Legal' },
      { value: 8, text: 'Secretarios' },
      { value: 9, text: 'Subgerente general' },
      { value: 10, text: 'Otros' },
   ];

   //CODIGO Y NOMBRE DEL PROCEDIMIENTO:
   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;

   paDeclaracionJurada: string[] = ["DSTT-033", "DSTT-037", "DSTT-038"];
   activarDeclaracionJurada: boolean = false;

   nombresApellidosSolicitante: string = "";
   tipoDocumentoSolicitante: string = "";
   nombreTipoDocumentoSolicitante: string = "";
   numeroDocumentoSolicitante: string = "";

   constructor(private fb: FormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private modalService: NgbModal,
      private anexoService: Anexo003B172Service,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private anexoTramiteService: AnexoTramiteService,
      private formularioTramiteService: FormularioTramiteService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      public activeModal: NgbActiveModal,
      private _route: ActivatedRoute,
      public tramiteService: TramiteService,
      private seguridadService: SeguridadService,
      private sunatService: SunatService
   ) { }

   ngOnInit(): void {
      //==================================================================================
      //RECUPERAMOS NOMBRE DEL TUPA:
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      //==================================================================================

      this.uriArchivo = this.dataInput.rutaDocumento;

      this.anexoFormulario = this.fb.group({
         tipoDocumentoForm: this.fb.control(''),
         numeroDocumentoForm: this.fb.control(''),
         apellidosForm: this.fb.control(''),
         nombresForm: this.fb.control(''),
         cargoForm: this.fb.control(''),

      });

      this.anexoFormulario.controls['apellidosForm'].disable();
      this.anexoFormulario.controls['nombresForm'].disable();

      if (this.paDeclaracionJurada.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDeclaracionJurada = true; else this.activarDeclaracionJurada = false;

      for (let i = 0; i < this.dataRequisitosInput.length; i++) {
         if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
            if (this.dataRequisitosInput[i].movId === 0) {
               this.activeModal.close(this.graboUsuario);
               this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
               return;
            }
         }
      }
      if (this.dataInput.tramiteReqRefId != null || this.dataInput.tramiteReqRefId != 0) {
         this.datosSolicitante(this.dataInput.tramiteReqRefId);
      }
      setTimeout(() => {
         this.acc.expand('ngb-anexo003-b17-2');
         if (this.dataInput.movId > 0) {

            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
               (dataAnexo: Anexo003_B172Response) => {
                  this.funcionesMtcService.ocultarCargando();

                  const metaData: any = JSON.parse(dataAnexo.metaData);
                  this.idAnexo = dataAnexo.anexoId;

                  this.listaTripulacion.length = 0;

                  let i = 0;
                  for (i; i < metaData.listaTripulacion.length; i++) {

                     this.listaTripulacion.push({
                        tipoDocumento: {
                           id: metaData.listaTripulacion[i].tipoDocumento.id,
                           documento: metaData.listaTripulacion[i].tipoDocumento.documento
                        },
                        numeroDocumento: metaData.listaTripulacion[i].numeroDocumento,
                        apellidos: metaData.listaTripulacion[i].apellidos,
                        nombres: metaData.listaTripulacion[i].nombres,
                        cargo: {
                           value: metaData.listaTripulacion[i].cargo.value,
                           text: metaData.listaTripulacion[i].cargo.text
                        }
                     })
                  }

                  this.anexoFormulario.get("dia").setValue(metaData.dia);
                  this.anexoFormulario.get("mes").setValue(metaData.mes);
                  this.anexoFormulario.get("anio").setValue(metaData.anio);
               },
               error => {
                  // this.errorAlCargarData = true;
                  this.funcionesMtcService
                     .ocultarCargando()
                  //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
               });
         }
      });
   }

   datosSolicitante(FormularioId: number) {
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(FormularioId).subscribe(
         (dataForm: any) => {
            this.funcionesMtcService.ocultarCargando();

            const metaDataForm: any = JSON.parse(dataForm.metaData);
            const seccion3 = metaDataForm.seccion3;
            const seccion7 = metaDataForm.seccion7;

            if (seccion3.tipoSolicitante === 'PJ') {//PERSONA JURIDICA
               this.tipoDocumentoSolicitante = seccion7?.tipoDocumentoSolicitante;
               this.nombreTipoDocumentoSolicitante = seccion7?.nombreTipoDocumentoSolicitante;
               this.numeroDocumentoSolicitante = seccion3?.RepresentanteLegal.numeroDocumento;
               this.nombresApellidosSolicitante = `${seccion3?.RepresentanteLegal.apellidoPaterno?.toUpperCase()} ${seccion3?.RepresentanteLegal.apellidoMaterno?.toUpperCase()} ${seccion3?.RepresentanteLegal.nombres?.toUpperCase()}`;

               this.sunatService.getDatosPrincipales(seccion3.numeroDocumento).subscribe(
                  (response) => {

                     this.representanteLegal = response.representanteLegal;
                     console.log(this.representanteLegal);
                  });
            }

            if (seccion3.tipoSolicitante === 'PN' || seccion3.tipoSolicitante === 'PE' || seccion3.tipoSolicitante === 'PNR') {//PERSONA NATURAL
               this.tipoDocumentoSolicitante = seccion7?.tipoDocumentoSolicitante;
               this.nombreTipoDocumentoSolicitante = seccion7?.nombreTipoDocumentoSolicitante;
               this.numeroDocumentoSolicitante = seccion7?.numeroDocumentoSolicitante;
               this.nombresApellidosSolicitante = seccion7?.nombresApellidosSolicitante;
            }
         },
         error => {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Debe ingresar primero el Formulario');
         }
      );
   }

   validarRegistroDeFormulario(index: number, item: Tripulacion) {
      if (index === 0) {
         if (item.nombres.lastIndexOf(' *') !== -1)
            return false;
      }
      return true;
   }

   getMaxLengthNumeroDocumento() {
      const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();

      if (tipoDocumento === '1')//DNI
         return 8;
      else if (tipoDocumento === '2')//CE
         return 12;
      else if (tipoDocumento === '5' || tipoDocumento === '6')// CPP / PTP
         return 9;
      return 0
   }

   changeTipoDocumento() {
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue('');
      this.inputNumeroDocumento();
   }

   inputNumeroDocumento(event = undefined) {
      if (event)
         event.target.value = event.target.value.replace(/[^0-9]/g, '');

      this.anexoFormulario.controls['apellidosForm'].setValue('');
      this.anexoFormulario.controls['nombresForm'].setValue('');

      this.anexoFormulario.controls['apellidosForm'].disable();
      this.anexoFormulario.controls['nombresForm'].disable();
   }

   buscarNumeroDocumento() {

      const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();
      const numeroDocumento: string = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
         return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      if (tipoDocumento === '1' && numeroDocumento.length !== 8)
         return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      if (tipoDocumento === '4' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('CE debe tener 9 caracteres');
      if ((tipoDocumento === '5' || tipoDocumento === '6') && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('CPP/PTP debe tener 9 caracteres');


      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '1') {//DNI
         this.reniecService.getDni(numeroDocumento).subscribe(
            respuesta => {
               this.funcionesMtcService.ocultarCargando();

               if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

               const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
               this.addTripulacion(tipoDocumento,
                  datosPersona.prenombres,
                  datosPersona.apPrimer + ' ' + datosPersona.apSegundo,
                  numeroDocumento);
            },
            error => {
               this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Error al consultar al servicio');
            }
         );

      } else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
         this.extranjeriaService.getCE(numeroDocumento).subscribe(
            respuesta => {
               this.funcionesMtcService.ocultarCargando();

               if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

               this.addTripulacion(tipoDocumento,
                  respuesta.CarnetExtranjeria.nombres,
                  respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido,
                  numeroDocumento);

            },
            error => {
               this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Error al consultar al servicio');
            }
         );
      } else if (tipoDocumento === '5' || tipoDocumento === '6') {//CPP
         this.funcionesMtcService.ocultarCargando();
         
         this.anexoFormulario.controls['apellidosForm'].setValue('');
         this.anexoFormulario.controls['nombresForm'].setValue('');

         this.anexoFormulario.controls['apellidosForm'].enable();
         this.anexoFormulario.controls['nombresForm'].enable();

         this.funcionesMtcService.mensajeInfo('Para el tipo de documento CPP/PTP debe ingresar los datos de la persona.');

      }
   }


   addTripulacion(tipoDocumento: string, nombres: string, apellidos: string, numeroDocumento: string) {

      //buscamos si el documento ya existe en la grilla:
      const indexFind = this.listaTripulacion.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento);

      if (indexFind !== -1) {
         if (indexFind !== this.indexEditTabla)
            return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
      }

      this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '1' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.anexoFormulario.controls['apellidosForm'].setValue(apellidos);
            this.anexoFormulario.controls['nombresForm'].setValue(nombres);
         });
   }

   formularioCompleto(): boolean {

      if (this.anexoFormulario.controls['tipoDocumentoForm'].value.trim() === '' ||
         this.anexoFormulario.controls['numeroDocumentoForm'].value.trim() === '' ||
         this.anexoFormulario.controls['apellidosForm'].value.trim() === '' ||
         this.anexoFormulario.controls['nombresForm'].value.trim() === '' ||
         this.anexoFormulario.controls['cargoForm'].value.trim() === '')
         return false;//NO ESTÁ COMLETO
      return true;//COMPLETO
   }

   descargarPdf() {
      if (this.idAnexo === 0)
         return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.uriArchivo)
         // this.anexoService.readPostFie(this.idAnexo)
         .subscribe(
            (file: Blob) => {
               this.funcionesMtcService.ocultarCargando();

               const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
               const urlPdf = URL.createObjectURL(file);
               modalRef.componentInstance.pdfUrl = urlPdf;
               modalRef.componentInstance.titleModal = "Vista Previa - Anexo 003-B/17.02";
            },
            error => {
               this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para descargar Pdf');
            }
         );
   }

   agregarTripulacion() {

      if (this.formularioCompleto() === false)
         return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

      const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();
      const numeroDocumento: string = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();



      if (this.anexoFormulario.controls['cargoForm'].value === "1" || this.anexoFormulario.controls['cargoForm'].value === "7") {
         const resultado = this.representanteLegal.find(representante => (representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento);
         if (resultado) {

         } else {
            return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
         }
      }

      const indexFind = this.listaTripulacion.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento);

      if (indexFind !== -1) {
         if (indexFind !== this.indexEditTabla)
            return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
      }

      if (this.indexEditTabla === -1) {

         this.listaTripulacion.push({
            tipoDocumento: {
               id: this.anexoFormulario.controls['tipoDocumentoForm'].value,
               documento: this.listaTiposDocumentos.filter(item => item.id == this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento
            },
            numeroDocumento: this.anexoFormulario.controls['numeroDocumentoForm'].value,
            apellidos: this.anexoFormulario.controls['apellidosForm'].value,
            nombres: this.anexoFormulario.controls['nombresForm'].value,
            cargo: {
               value: this.anexoFormulario.controls['cargoForm'].value,
               text: this.listaCargos.filter(item => item.value == this.anexoFormulario.get('cargoForm').value)[0].text
            }
         });
      } else {
         this.listaTripulacion[this.indexEditTabla].tipoDocumento = {
            id: this.anexoFormulario.controls['tipoDocumentoForm'].value,
            documento: this.listaTiposDocumentos.filter(item => item.id == this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento
         };

         this.listaTripulacion[this.indexEditTabla].numeroDocumento = this.anexoFormulario.controls['numeroDocumentoForm'].value;
         this.listaTripulacion[this.indexEditTabla].apellidos = this.anexoFormulario.controls['apellidosForm'].value;
         this.listaTripulacion[this.indexEditTabla].nombres = this.anexoFormulario.controls['nombresForm'].value;
         this.listaTripulacion[this.indexEditTabla].cargo = {
            value: this.anexoFormulario.controls['cargoForm'].value,
            text: this.listaCargos.filter(item => item.value == this.anexoFormulario.get('cargoForm').value)[0].text
         };

      }

      this.cancelarModificacion();
   }

   cancelarModificacion() {
      this.anexoFormulario.controls['tipoDocumentoForm'].setValue('');
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue('');
      this.anexoFormulario.controls['apellidosForm'].setValue('');
      this.anexoFormulario.controls['nombresForm'].setValue('');
      this.anexoFormulario.controls['cargoForm'].setValue('');

      this.anexoFormulario.controls['apellidosForm'].disable();
      this.anexoFormulario.controls['nombresForm'].disable();

      this.indexEditTabla = -1;
   }

   modificarTripulacion(item: Tripulacion, index) {
      if (this.indexEditTabla !== -1)
         return;

      this.indexEditTabla = index;

      this.anexoFormulario.controls['tipoDocumentoForm'].setValue(item.tipoDocumento.id);
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue(item.numeroDocumento);
      this.anexoFormulario.controls['apellidosForm'].setValue(item.apellidos);
      this.anexoFormulario.controls['nombresForm'].setValue(item.nombres);
      this.anexoFormulario.controls['cargoForm'].setValue(item.cargo.value);
   }

   eliminarTripulacion(item: Tripulacion, index) {
      if (this.indexEditTabla === -1) {

         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.listaTripulacion.splice(index, 1);
            });
      }
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

   guardarAnexo() {

      if (this.anexoFormulario.invalid === true)
         return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      let dataGuardar: Anexo003_B172Request = new Anexo003_B172Request();
      //-------------------------------------    
      dataGuardar.id = this.idAnexo;
      dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
      dataGuardar.anexoId = 3;
      dataGuardar.codigo = "B";
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
      //-------------------------------------   
      dataGuardar.metaData.tipoSolicitud = {
         codigo: this.dataInput.tipoSolicitud.codigo,
         descripcion: this.dataInput.tipoSolicitud.descripcion
      } as TipoSolicitudModel
      //-------------------------------------   
      dataGuardar.metaData.listaTripulacion = this.listaTripulacion;
      dataGuardar.metaData.dia = this.getDia();
      dataGuardar.metaData.mes = this.getMes();
      dataGuardar.metaData.anio = this.getAnio();
      dataGuardar.metaData.file = this.filePdfSeleccionado;
      dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;
      dataGuardar.metaData.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
      dataGuardar.metaData.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
      dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;


      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(() => {

            this.funcionesMtcService.mostrarCargando();

            if (this.idAnexo === 0) {
               //GUARDAR:
               this.anexoService.post<any>(dataGuardarFormData)
                  .subscribe(
                     data => {
                        this.funcionesMtcService.ocultarCargando();
                        this.idAnexo = data.id;
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
                        this.idAnexo = data.id;
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

}

