import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Anexo003_E17Request } from 'src/app/core/models/Anexos/Anexo003_E17/Anexo003_E17Request';
import { Anexo003_E17Response } from 'src/app/core/models/Anexos/Anexo003_E17/Anexo003_E17Response';
import { Tripulacion } from 'src/app/core/models/Anexos/Anexo003_E17/Tripulacion';
import { DatosFormulario001 } from 'src/app/core/models/Anexos/DatosFormulario001';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { Anexo003E17Service } from 'src/app/core/services/anexos/anexo003-e17.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo003-e17',
  templateUrl: './anexo003-e17.component.html',
  styleUrls: ['./anexo003-e17.component.css']
})
export class Anexo003E17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFormulario: UntypedFormGroup;
  filePdfSeleccionado: any = null;
  indexEditTabla: number = -1;

  listaTripulacion: Tripulacion[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
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

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo003E17Service,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal) { }

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

      dia: this.fb.control(this.getDia(), [Validators.required]),
      mes: this.fb.control(this.getMes(), [Validators.required]),
      anio: this.fb.control(this.getAnio(), [Validators.required]),
    });

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

    setTimeout(() => {
      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {
          this.funcionesMtcService.ocultarCargando();

          const metaDataForm: any = JSON.parse(dataForm.metaData);
          const seccion1 = metaDataForm.seccion1;

          if (seccion1.tipoSolicitante === 'PJ') {//PERSONA JURIDICA

            this.listaTripulacion.push({
              tipoDocumento: {
                id: '1',
                documento: this.listaTiposDocumentos.filter(item => item.id == '1')[0].documento
              },
              numeroDocumento: seccion1?.numeroDocumento,
              apellidos: `${seccion1?.apePaternoRepresentanteLegal?.toUpperCase()} ${seccion1?.apeMaternoRepresentanteLegal?.toUpperCase()}`,
              nombres: seccion1?.nombreRepresentanteLegal?.toUpperCase() + ' *',
              cargo: {
                value: 7,
                text: this.listaCargos.filter(item => item.value == 7)[0].text
              }
            } as Tripulacion);

          }

          if (this.dataInput.movId > 0) {

            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo003_E17Response) => {
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

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        }
      );

    });
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
  }

  buscarNumeroDocumento() {

    const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();
    const numeroDocumento: string = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '1' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

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
    }

    // setTimeout(() => {

    //   this.funcionesMtcService.ocultarCargando();

    //   this.funcionesMtcService.mensajeConfirmar('Los datos ingresados fueron validados por RENIEC corresponden a la persona ANA BELEN PAREDES SOLIS. ¿Está seguro de agregarlo?')
    //     .then(() => {

    //       this.anexoFormulario.controls['apellidosForm'].setValue('PAREDES SOLIS');
    //       this.anexoFormulario.controls['nombresForm'].setValue('ANA BELEN');
    //     })
    // }, 1000);
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 003-E/17";
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

    let dataGuardar: Anexo003_E17Request = new Anexo003_E17Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 3;
    dataGuardar.codigo = "E";
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
