import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbAccordionDirective , NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { VehiculoService } from '../../../../../core/services/servicios/vehiculo.service';
import { Anexo001_A172Request } from '../../../../../core/models/Anexos/Anexo001_A17_2/Anexo001_A172Request';
import { Seccion1, Seccion2, Seccion3, Material, RepLegal, Conductor } from '../../../../../core/models/Anexos/Anexo001_A17_2/Secciones';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001A172Service } from '../../../../../core/services/anexos/anexo001-a172.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { Anexo001_A172Response } from '../../../../../core/models/Anexos/Anexo001_A17_2/Anexo001_A172Response';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { Ruta } from 'src/app/core/models/renat';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo001_a17_2',
  templateUrl: './anexo001_a17_2.component.html',
  styleUrls: ['./anexo001_a17_2.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo001_a17_2_Component implements OnInit, AfterViewInit {

  fileToUpload: File;
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;
  @ViewChild('ubigeoCmp') ubigeoComponent: UbigeoComponent;

  graboUsuario = false;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  idAnexo: number;
  
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoTipoSolicitudTupa: string;  //usado para las validaciones 
  descTipoSolicitudTupa: string;

  tipoSolicitante:string;

  tipoDocumentoSolicitante:string;
  nombreTipoDocumentoSolicitante:string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante:string;

  maxLengthNumeroDocumentoRepLeg:number;

  public formAnexo: FormGroup;

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de Extranjería' },
  ];
  
  public conductor: Conductor[] = [];
  public recordIndexToEditConductor: number;

  public material: Material[] = [];
  public recordIndexToEditMaterial: number;

  public repLegal: RepLegal[] = [];
  public recordIndexToEditRepresentanteLegal: number;

  public representanteLegal:RepresentanteLegal[] = [];

  categoriaVehiculo: string;

  tipoPersona: number;
  dniPersona: string;
  ruc: string;

  reqAnexo: number;
  movIdAnexo: number;
  codAnexo: string;

  paRelacionConductores: string[] = ['DSTT-001','DSTT-002', 'DSTT-003', 'DSTT-004'];
  
  opcionalRelacionConductores = true;

  paSeccion1: string[] = ['DSTT-001','DSTT-002', 'DSTT-003', 'DSTT-004'];
  paSeccion2: string[] = ['DSTT-001','DSTT-002', 'DSTT-003', 'DSTT-004'];
  paSeccion3: string[] = ['DSTT-001','DSTT-002', 'DSTT-003', 'DSTT-004'];
  paSeccion4: string[] = ['DSTT-001','DSTT-002', 'DSTT-003', 'DSTT-004'];
  
  habilitarSeccion1 = true;
  habilitarSeccion2 = true;
  habilitarSeccion3 = true;
  habilitarSeccion4 = true;
  
  constructor(
    public modalClasVehicular: NgbModal,
    private fb: FormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService,
    private modalService: NgbModal,
    private vehiculoService: VehiculoService,
    private anexoService: Anexo001A172Service,
    public activeModal: NgbActiveModal,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private ubigeoService: UbigeoService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private renatService: RenatService,
    private seguridadService: SeguridadService,
    private mtcService: MtcService,

  ) {
    this.idAnexo = 0;
       
    this.recordIndexToEditMaterial = -1;
    this.recordIndexToEditRepresentanteLegal = -1;
    this.recordIndexToEditConductor = -1;
    this.conductor = [];
    this.representanteLegal = [];
    this.repLegal = [];
    this.material = [];

    /*this.mensajeClasificacionVehicular = `CLASIFICACIÓN VEHICULAR
    Categoría M: Vehículos automotores de cuatro ruedas o más diseñados y construidos para el transporte de pasajeros.
    M1 : Vehículos de ocho asientos o menos, sin contar el asiento del conductor.
    M2 : Vehículos de más de ocho asientos, sin contar el asiento del conductor y peso bruto vehicular de 5 toneladas o menos.
    M3 : Vehículos de más de ocho asientos, sin contar el asiento del conductor y peso bruto vehicular de más de 5 toneladas.
    Los vehículos de las categorías M2 y M3, a su vez de acuerdo a la disposición de los pasajeros se clasifican en:
    Clase I : Vehículos construidos con áreas para pasajeros de pie permitiendo el desplazamiento frecuente de éstos
    Clase II : Vehículos construidos principalmente para el transporte de pasajeros sentados y, también diseñados para permitir
    el transporte de pasajeros de pie en el pasadizo y/o en un área que no excede el espacio provisto para dos asientos dobles.
    Clase III : Vehículos construidos exclusivamente para el transporte de pasajeros sentados.
    Categoría N: Vehículos automotores de cuatro ruedas o más diseñados y construidos para el transporte de mercancía.
    N1 : Vehículos de peso bruto vehicular de 3,5 toneladas o menos.
    N2 : Vehículos de peso bruto vehicular mayor a 3,5 toneladas hasta 12 toneladas.
    N3 : Vehículos de peso bruto vehicular mayor a 12 toneladas.`;*/
    
  }

  ngOnInit(): void {
    /*switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoPersona = 1; // persona natural
        this.dniPersona = this.seguridadService.getNumDoc();
        // this.ruc;
        break;

      case '00002':
        this.tipoPersona = 2; // persona juridica
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        break;

      case '00003':
        this.tipoPersona = 3;
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        break;

      case '00004':
        this.tipoPersona = 4; // persona extranjera
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = '';
        break;

      case '00005':
        this.tipoPersona = 5; // persona natural con ruc
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        break;
    }*/

    this.formAnexo = this.fb.group({
      nombreMaterial : this.fb.control(''),

      tipoDocumento: this.fb.control(''),
      numeroDocumento: this.fb.control(''),
      nombreRepresentante: this.fb.control(''),
      partidaRepresentante: this.fb.control(''),
      asientoRepresentante: this.fb.control(''),
      
      tipoDocumentoConductor: this.fb.control(''),
      numeroDocumentoConductor: this.fb.control(''),
      nombreConductor: this.fb.control(''),
      licenciaConductor: this.fb.control('')
    });

    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;
    console.log("codigo tipo solicitud:"+this.codigoTipoSolicitudTupa);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.datosSolicitante(this.dataInput.tramiteReqRefId);

    if (this.paRelacionConductores.indexOf(this.codigoProcedimientoTupa) > -1) {
      this.opcionalRelacionConductores = true;
    } else {
      this.opcionalRelacionConductores = false;
    }

    setTimeout(async () => {
      await this.cargarDatos();
    });
  }

  async datosSolicitante(FormularioId: number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    try {
      const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const metaDataForm: any = JSON.parse(dataForm.metaData);
      const seccion1 = metaDataForm.seccion1;
      const seccion2 = metaDataForm.seccion2;
      const seccion3 = metaDataForm.seccion3;

      console.log("Datos Formulario");
      console.log(metaDataForm);

      this.tipoDocumentoSolicitante = metaDataForm.seccion6.tipoDocumentoSolicitante;
      this.nombreTipoDocumentoSolicitante = metaDataForm.seccion6.nombreTipoDocumentoSolicitante;
      this.numeroDocumentoSolicitante = metaDataForm.seccion6.numeroDocumentoSolicitante;
      this.nombresApellidosSolicitante = metaDataForm.seccion6.nombresApellidosSolicitante;

      this.tipoSolicitante = seccion3.tipoSolicitante;
      switch(this.tipoSolicitante){
        case "PJ":
          try {
          const response = await this.sunatService.getDatosPrincipales(seccion3.numeroDocumento).toPromise();
          this.funcionesMtcService.ocultarCargando();
          this.representanteLegal = response.representanteLegal;
          }catch (e){
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio ');
          }
          break;
      }

    } catch (error) {
      console.error(error);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Debe ingresar primero el Formulario');
    }
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value !== '' || value != null) {
      const date = value.split('/');
      return {
        day: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[0], 10)
      };
    }
    return null;
  }

  async cargarDatos(): Promise<void> {
    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      this.funcionesMtcService.mostrarCargando();

      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo001_A172Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const metaData: any = JSON.parse(dataAnexo.metaData);
        console.log(metaData);
        this.idAnexo = dataAnexo.anexoId;

        let i = 0;

        for (i = 0; i < metaData.seccion1.relacionMateriales.length; i++) {
          this.material.push({
            nombreMaterial: metaData.seccion1.relacionMateriales[i].nombreMaterial,
          } as Material);
        }

        for (i = 0; i < metaData.seccion2.relacionRepresentanteLegal.length; i++) {
          this.repLegal.push({
            TipoDocumento: metaData.seccion2.relacionRepresentanteLegal[i].tipoDocumento,
            ApellidosNombres: metaData.seccion2.relacionRepresentanteLegal[i].ApellidosNombres,
            NumeroDocumento: metaData.seccion2.relacionRepresentanteLegal[i].NumeroDocumento,
            PartidaRegistral: metaData.seccion2.relacionRepresentanteLegal[i].PartidaRegistral,
            NumeroAsiento: metaData.seccion2.relacionRepresentanteLegal[i].NumeroAsiento
          } as RepLegal);
        }
        
        for (i = 0; i < metaData.seccion3.relacionConductores.length; i++) {
          this.conductor.push({
            tipoDocumento: metaData.seccion3.relacionConductores[i].tipoDocumento,
            nombresApellidos: metaData.seccion3.relacionConductores[i].nombresApellidos,
            numeroDocumento: metaData.seccion3.relacionConductores[i].numeroDocumento,
            numeroLicencia: metaData.seccion3.relacionConductores[i].numeroLicencia
          } as Conductor);
        }
      } catch (error) {
        console.error('Error cargarDatos: ', error);
        this.funcionesMtcService
          .ocultarCargando();
        //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }
  }

  public modalClasificacionVehicular(content: any): void {
    this.modalClasVehicular.open(content, { size: 'xl' });
  }

  public addMaterial(): void {
    if (this.formAnexo.get('nombreMaterial').value.trim() === '') {
      this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
      return;
    }
    
    const nombreMaterial = this.formAnexo.get('nombreMaterial').value.trim().toUpperCase();
    const indexFound = this.material.findIndex(item => item.nombreMaterial === nombreMaterial);

    if (indexFound !== -1) {
      if (indexFound !== this.recordIndexToEditMaterial) {
        this.funcionesMtcService.mensajeError('El material ya se encuentra registrado');
        return;
      }
    }

    if (this.recordIndexToEditMaterial === -1) {
      this.material.push({
        nombreMaterial: nombreMaterial
      });
      console.log(this.material);
    } else {
      this.material[this.recordIndexToEditMaterial].nombreMaterial = nombreMaterial;
    }
    this.clearMaterialData();
  }

  private clearMaterialData(): void {
    this.recordIndexToEditMaterial = -1;
    this.formAnexo.controls.nombreMaterial.setValue('');
  }

  public deleteMaterial(material: any, i: number): void {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.clearMaterialData();
        this.material.splice(i, 1);
      });
  }

  async buscarNumeroDocumento(): Promise<void> {
    const tipoDocumento: string = this.formAnexo.controls.tipoDocumento.value.trim();
    const numeroDocumento: string = this.formAnexo.controls.numeroDocumento.value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      return;
    }
    if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
      this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      return;
    }
    if (tipoDocumento === '04' && numeroDocumento.length !== 9) {
      this.funcionesMtcService.mensajeError('El Carnet de Extranjería debe tener 9 caracteres');
      return;
    }

    const resultado = this.representanteLegal?.find(
      representante => (
        '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
        representante.nroDocumento.trim() === numeroDocumento
    );
    
    if (resultado){
      switch(tipoDocumento){
        case "01":  try {
                      const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
                      this.funcionesMtcService.ocultarCargando();

                      if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                      }
                      const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                      const nombres = datosPersona.prenombres;
                      const apellidoPaterno = datosPersona.apPrimer;
                      const apellidoMaterno = datosPersona.apSegundo;
                      
                      this.formAnexo.controls.nombreRepresentante.setValue(nombres+" "+apellidoPaterno+" "+apellidoMaterno);
                    }
                    catch (e) {
                      console.error(e);
                      this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
                    }
                    break;
        case "04":  try {
                      const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
                      this.funcionesMtcService.ocultarCargando();
                      if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
                      }
                      const nombres = respuesta.CarnetExtranjeria.nombres;
                      const apellidoPaterno = respuesta.CarnetExtranjeria.primerApellido;
                      const apellidoMaterno = respuesta.CarnetExtranjeria.segundoApellido;
                      
                      this.formAnexo.controls.nombreRepresentante.setValue(nombres+" "+apellidoPaterno+" "+apellidoMaterno);
                    }
                    catch (e) {
                      console.error(e);
                      this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
                    }
                    break;
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }

  private addPersona(datos: string, direccion: string): void {
    this.funcionesMtcService
      .mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formAnexo.controls.nombresApellidos.setValue(datos);
      });
  }

  /***************************** */
  public addRepresentanteLegal(): void {
    if (this.formAnexo.get('numeroDocumento').value.trim() === '' || 
        this.formAnexo.get('nombreRepresentante').value.trim() === '' || 
        this.formAnexo.get('partidaRepresentante').value.trim() === '' ||
        this.formAnexo.get('asientoRepresentante').value.trim() === '') {
      this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
      return;
    }
    const NumeroDocumento = this.formAnexo.get('numeroDocumento').value.trim().toUpperCase();
    const indexFound = this.repLegal.findIndex(item => item.NumeroDocumento === NumeroDocumento);

    if (indexFound !== -1) {
      if (indexFound !== this.recordIndexToEditRepresentanteLegal) {
        this.funcionesMtcService.mensajeError('El representante legal ya se encuentra registrado');
        return;
      }
    }

    let nombreTipoDocumento = this.listaTiposDocumentos.filter(
      (item) => item.id === this.formAnexo.get('tipoDocumento').value
    )[0].documento;

    let TipoDocumento: TipoDocumentoModel =  {id:this.formAnexo.get('tipoDocumento').value, documento:nombreTipoDocumento};
    const ApellidosNombres = this.formAnexo.get('nombreRepresentante').value;
    const PartidaRegistral = this.formAnexo.get('partidaRepresentante').value;
    const NumeroAsiento = this.formAnexo.get('asientoRepresentante').value;
      
    if (this.recordIndexToEditRepresentanteLegal === -1) {
      this.repLegal.push({
        TipoDocumento:TipoDocumento,
        NumeroDocumento: NumeroDocumento,
        ApellidosNombres: ApellidosNombres,
        PartidaRegistral: PartidaRegistral,
        NumeroAsiento: NumeroAsiento
      });
    } else {
      this.repLegal[this.recordIndexToEditRepresentanteLegal].TipoDocumento.id = this.formAnexo.get('tipoDocumento').value;
      this.repLegal[this.recordIndexToEditRepresentanteLegal].NumeroDocumento = NumeroDocumento;
      this.repLegal[this.recordIndexToEditRepresentanteLegal].ApellidosNombres = ApellidosNombres;
      this.repLegal[this.recordIndexToEditRepresentanteLegal].PartidaRegistral = PartidaRegistral;
      this.repLegal[this.recordIndexToEditRepresentanteLegal].NumeroAsiento = NumeroAsiento;
    }
    this.clearRepresentanteLegalData();
  }

  private clearRepresentanteLegalData(): void {
    this.recordIndexToEditRepresentanteLegal = -1;
    this.formAnexo.controls.numeroDocumento.setValue('');
    this.formAnexo.controls.nombreRepresentante.setValue('');
    this.formAnexo.controls.partidaRepresentante.setValue('');
    this.formAnexo.controls.asientoRepresentante.setValue('');
  }

  public deleteRepresentanteLegal(repLegal: any, i: number): void {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.clearRepresentanteLegalData();
        this.repLegal.splice(i, 1);
      });
  }

  onChangeTipoDocumento(): void {
    this.formAnexo.controls.tipoDocumento.valueChanges.subscribe((tipoDocumento: string) => {
      if (tipoDocumento?.trim() === '04') {
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }
      this.formAnexo.controls.numeroDocumento.reset('', { emitEvent: false });
      this.formAnexo.controls.nombreRepresentante.reset('', { emitEvent: false });
      this.formAnexo.controls.asientoRepresentante.reset('', { emitEvent: false });
      this.formAnexo.controls.partidaRepresentante.reset('', { emitEvent: false });
    });
  }

  inputNumeroDocumento(event?): void {
    if (event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    this.formAnexo.controls.nombreRepresentante.reset('', { emitEvent: false });
    this.formAnexo.controls.asientoRepresentante.reset('', { emitEvent: false });
    this.formAnexo.controls.partidaRepresentante.reset('', { emitEvent: false });
  }

  getMaxLengthNumeroDocumento() {
    let tipoDocumento: string=""; 
    tipoDocumento = this.formAnexo.controls.tipoDocumento.value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    return 0
  }
/******************************* */
  async addConductor(): Promise<void> {
    if (
      this.formAnexo.get('numeroDocumentoConductor').value.trim() === '' ||
      this.formAnexo.get('nombreConductor').value.trim() === '' ||
      this.formAnexo.get('licenciaConductor').value.trim() === ''
    ) {
      this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
      return;
    }
    const numeroDocumento = this.formAnexo.get('numeroDocumentoConductor').value;
    const indexFound = this.conductor.findIndex(item => item.numeroDocumento === numeroDocumento);

    if (indexFound !== -1) {
      if (indexFound !== this.recordIndexToEditConductor) {
        this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
        return;
      }
    }
    let nombreTipoDocumento = this.listaTiposDocumentos.filter(
      (item) => item.id === this.formAnexo.get('tipoDocumento').value
    )[0].documento;
    let tipoDocumento: TipoDocumentoModel =  {id:this.formAnexo.get('tipoDocumentoConductor').value, documento:nombreTipoDocumento};
    const nombresApellidos = this.formAnexo.get('nombreConductor').value;
    const numeroLicencia = this.formAnexo.get('licenciaConductor').value;

    if (this.recordIndexToEditConductor === -1) {
      this.conductor.push({
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento,
        nombresApellidos: nombresApellidos,
        numeroLicencia: numeroLicencia
      });
    } else {
      this.conductor[this.recordIndexToEditConductor].tipoDocumento = tipoDocumento;
      this.conductor[this.recordIndexToEditConductor].nombresApellidos = nombresApellidos;
      this.conductor[this.recordIndexToEditConductor].numeroDocumento = numeroDocumento;
      this.conductor[this.recordIndexToEditConductor].numeroLicencia = numeroLicencia;
    }

    this.clearConductorData();
  }

  private clearConductorData(): void {
    this.recordIndexToEditConductor = -1;

    this.formAnexo.controls.nombreConductor.setValue('');
    this.formAnexo.controls.numeroDocumentoConductor.setValue('');
    this.formAnexo.controls.licenciaConductor.setValue('');
  }

  deleteConductor(conductor: any, i: number): void {
    if (this.recordIndexToEditConductor === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.conductor.splice(i, 1);
        });
    }
  }

  onChangeConductor(): void {
    this.formAnexo.controls.numeroDocumentoConductor.setValue('');
    this.formAnexo.controls.nombreConductor.setValue('');
    this.formAnexo.controls.licenciaConductor.setValue('');
  }

  onChangeTipoDocumentoConductor(): void {
    this.formAnexo.controls.tipoDocumentoConductor.valueChanges.subscribe((tipoDocumento: string) => {
      if (tipoDocumento?.trim() === '04') {
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }
      this.formAnexo.controls.numeroDocumentoConductor.reset('', { emitEvent: false });
      this.formAnexo.controls.nombreConductor.reset('', { emitEvent: false });
      this.formAnexo.controls.licenciaConductor.reset('', { emitEvent: false });
    });
  }

  async buscarNumeroDocumentoConductor(): Promise<void> {
    const tipoDocumento: string = this.formAnexo.controls.tipoDocumentoConductor.value.trim();
    const numeroDocumento: string = this.formAnexo.controls.numeroDocumentoConductor.value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documentosss');
      return;
    }
    if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
      this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      return;
    }
    if (tipoDocumento === '04' && numeroDocumento.length !== 9) {
      this.funcionesMtcService.mensajeError('El Carnet de Extranjería debe tener 9 caracteres');
      return;
    }
    console.log("tipoDocumento: "+ this.maxLengthNumeroDocumentoRepLeg);
    console.log("numeroDocumento:"+numeroDocumento);
    const resultado = this.representanteLegal?.find(
      representante => (
        '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
        representante.nroDocumento.trim() === numeroDocumento
    );
    
    if (resultado){
      switch(tipoDocumento){
        case "01":  try {
                      const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
                      this.funcionesMtcService.ocultarCargando();

                      if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                      }
                      const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                      const nombres = datosPersona.prenombres;
                      const apellidoPaterno = datosPersona.apPrimer;
                      const apellidoMaterno = datosPersona.apSegundo;
                      
                      this.formAnexo.controls.nombreConductor.setValue(nombres+" "+apellidoPaterno+" "+apellidoMaterno);
                    }
                    catch (e) {
                      console.error(e);
                      this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
                    }
                    break;
        case "04":  try {
                      const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
                      this.funcionesMtcService.ocultarCargando();
                      if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
                      }
                      const nombres = respuesta.CarnetExtranjeria.nombres;
                      const apellidoPaterno = respuesta.CarnetExtranjeria.primerApellido;
                      const apellidoMaterno = respuesta.CarnetExtranjeria.segundoApellido;
                      
                      this.formAnexo.controls.nombreConductor.setValue(nombres+" "+apellidoPaterno+" "+apellidoMaterno);
                    }
                    catch (e) {
                      console.error(e);
                      this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
                    }
                    break;
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }
/******************************* */
  soloNumeros(event): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  save(): void {
    if (this.material.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar al menos un material.');
      return;
    }

    if (this.representanteLegal.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar al menos un Representante Legal.');
      return;
    }

    if (this.conductor.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar al menos un conductor.');
      return;
    }

    const dataGuardar: Anexo001_A172Request = new Anexo001_A172Request();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'A';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    const seccion1: Seccion1 = new Seccion1();
    const seccion2: Seccion2 = new Seccion2();
    const seccion3: Seccion3 = new Seccion3();


    dataGuardar.metaData.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
    dataGuardar.metaData.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
    dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
    dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;

    seccion1.relacionMateriales = this.material.map(material => {
      return {
        nombreMaterial: material.nombreMaterial
      } as Material;
    });
    
    seccion2.relacionRepresentanteLegal = this.repLegal.map(repLegal => {
      return {
        TipoDocumento: repLegal.TipoDocumento,
        NumeroDocumento: repLegal.NumeroDocumento,
        ApellidosNombres: repLegal.ApellidosNombres,
        PartidaRegistral: repLegal.PartidaRegistral,
        NumeroAsiento: repLegal.NumeroAsiento
      } as RepLegal;
    });

    seccion3.relacionConductores = this.conductor.map(conductor => {
      return {
        tipoDocumento: conductor.tipoDocumento,
        nombresApellidos: conductor.nombresApellidos,
        numeroDocumento: conductor.numeroDocumento,
        numeroLicencia: conductor.numeroLicencia
      } as Conductor;
    });

    console.log('Relacion Materiales:', seccion1.relacionMateriales);

    dataGuardar.metaData.seccion1 = seccion1;
    dataGuardar.metaData.seccion2 = seccion2;
    dataGuardar.metaData.seccion3 = seccion3;

    console.log(JSON.stringify(dataGuardar, null, 10));
    console.log(JSON.stringify(dataGuardar));

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    // console.log('dataGuardarFormData',dataGuardarFormData);

    this.funcionesMtcService
      .mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          // GUARDAR:
          try {
            const data = await this.anexoService.post<any>(dataGuardarFormData).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;

            this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
          } catch (error) {
            console.error(error);
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // MODIFICAR
          for (const dataRequisito of this.dataRequisitosInput) {

            // if (this.dataInput.tramiteReqRefId === dataRequisito.tramiteReqId) {
            // if (dataRequisito.movId === 0) {
            //   this.activeModal.close(this.graboUsuario);
            //   this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
            //   return;
            // }
            // }

            if (dataRequisito.codigoFormAnexo === 'ANEXO_001_A17_2') {
              this.codAnexo = dataRequisito.codigoFormAnexo;
              this.reqAnexo = dataRequisito.tramiteReqId;
              console.log('======> ' + this.reqAnexo);
              // if(dataRequisito.movId > 0){
              this.movIdAnexo = dataRequisito.movId;
              // this.activeModal.close(this.graboUsuario);
              // this.funcionesMtcService.mensajeError('Debe completar el '+dataRequisito.codigoFormAnexo);
              // return;

              // }
            }
          }

          if (this.movIdAnexo > 0) {
            this.funcionesMtcService.ocultarCargando();
            this.funcionesMtcService
              .mensajeConfirmar('Deberá volver a grabar el anexo ' + this.codAnexo + '¿Desea continuar?')
              .then(async () => {
                // MODIFICAR
                try {
                  const data = await this.anexoService.put<any>(dataGuardarFormData).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.idAnexo = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;
                  try {
                    await this.formularioTramiteService.uriArchivo<any>(this.movIdAnexo).toPromise();
                    this.funcionesMtcService.ocultarCargando();
                  } catch (error) {
                    this.funcionesMtcService
                      .ocultarCargando()
                      .mensajeError('Problemas para realizar la modificación de los anexos');
                  }
                  this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
                } catch (error) {
                  console.error(error);
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              });
          } else {
            try {
              const data = await this.anexoService.put<any>(dataGuardarFormData).toPromise();
              this.funcionesMtcService.ocultarCargando();
              this.idAnexo = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;
              this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
            } catch (error) {
              console.error(error);
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para realizar la modificación de datos del anexo');
            }

          }
        }
      });
  }

  async descargarPdf(): Promise<void> {
    if (this.idAnexo === 0) {
      this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
      return;
    }

    this.funcionesMtcService.mostrarCargando();

    try {
      const file: Blob = await this.visorPdfArchivosService.get(this.uriArchivo).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 001-A/17.02';
    } catch (error) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar Pdf');
    }
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  formInvalid(control: string): boolean {
    if (this.formAnexo.get(control)) {
      return this.formAnexo.get(control).invalid && (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
    }
  }
}
