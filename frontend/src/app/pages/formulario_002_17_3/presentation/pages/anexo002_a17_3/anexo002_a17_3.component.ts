import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbAccordionDirective, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaData, Secciones, Seccion1, Seccion2, Seccion3, Seccion4, Seccion5, Seccion6, Seccion7, Seccion8 } from '../../../domain/anexo002_A17_3/anexo002_A17_3Request';
import { Anexo002_A17_3Request } from '../../../domain/anexo002_A17_3/anexo002_A17_3Request';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo002_A17_3Service } from '../../../application/usecases';
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_A17_3Response } from 'src/app/core/models/Anexos/Anexo002_A17_3/Anexo002_A17_3Response';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo002_a17_3',
  templateUrl: './anexo002_a17_3.component.html',
  styleUrls: ['./anexo002_a17_3.component.css']
})

// tslint:disable-next-line: class-name 
export class Anexo002_a17_3_Component implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective;

  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  tipoDocumentoSolicitante: string;
  nombreTipoDocumentoSolicitante: string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante: string;

  organizacionFerroviaria: string;

  disabledAcordion = 2;

  public anexoFG: UntypedFormGroup;

  tipoSolicitante: string;

  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  paSeccion1: string[] = ['DCV-004'];
  paSeccion2: string[] = ['DCV-004'];

  tipoServicio = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo002_A17_3Service,
    private seguridadService: SeguridadService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
  ) {
    this.idAnexo = 0;
  }

  ngOnInit(): void {
    // ==================================================================================
    // RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    // ==================================================================================

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.anexoFG = this.formBuilder.group({
      a_AnexosFA: this.formBuilder.array([], [Validators.required])
    })
  }

  private addAnexoFG(): void {
    const newformAnexo = this.formBuilder.group({
      Seccion1: this.formBuilder.group({
        organizacion: [{ value: this.organizacionFerroviaria, disabled: true }, [Validators.required]],
        ambito: ['', [Validators.required, Validators.maxLength(50)]],
        documento: ['', [Validators.maxLength(20)]],
        tramite: [''],
        tipoVehiculo: ['', [Validators.required, Validators.maxLength(30)]],
        numeroVehiculo: ['', [Validators.required, Validators.maxLength(30)]],
        fabricante: ['', [Validators.maxLength(30)]],
        pesoBruto: ['', [Validators.maxLength(10)]],
        trocha: ['', [Validators.maxLength(10)]],
        anioFabricacion: ['', [Validators.maxLength(4)]],
        capacidad: ['', []]
      }),
      Seccion2: this.formBuilder.group({ /* SISTEMA MECANICO*/
        motorDiesel: ['', [Validators.maxLength(30)]],
        marcaSistemaMecanico: ['', [Validators.maxLength(30)]],
        anioFabricacion: ['', [Validators.maxLength(4)]],
        potencia: ['', [Validators.maxLength(10)]],
        modelo: ['', [Validators.maxLength(20)]],
        cilindro: ['', [Validators.maxLength(2)]],
        sobrealimentacion: ['', [Validators.maxLength(50)]],
        rotacionMaxima: ['', [Validators.maxLength(10)]],
        sobrevelocidad: ['', [Validators.maxLength(10)]],
        bajaPresion: ['', [Validators.maxLength(10)]],
        ultimaFechaReparacion: ['', [Validators.maxLength(10)]],
        ultimaFechaMantenimiento: ['', [Validators.maxLength(10)]],
        condicionGeneral: ['', [Validators.maxLength(50)]]
      }),
      Seccion3: this.formBuilder.group({ /** SISTEMA ELECTRICO */
        marcaSistemaElectrico: ['', [Validators.maxLength(30)]],
        modelo: ['', [Validators.maxLength(30)]],
        numeroPolos: ['', [Validators.maxLength(3)]],
        ultimaFechaReparacion: ['', [Validators.maxLength(10)]],
        ultimaFechaMantenimiento: ['', [Validators.maxLength(10)]],
        condicionGeneralAlternador: ['', [Validators.maxLength(50)]],
        marcaMotor: ['', [Validators.maxLength(50)]],
        modeloMotor: ['', [Validators.maxLength(50)]],
        polosMotor: ['', [Validators.maxLength(3)]],
        ultimaFechaReparacionMotor: ['', [Validators.maxLength(10)]],
        ultimaFechaMantenimientoMotor: ['', [Validators.maxLength(10)]],
        condicionGeneralMandoMotor: ['', [Validators.maxLength(50)]],
        mandoControl: ['', [Validators.maxLength(30)]],
        contactoresRelay: ['', [Validators.maxLength(30)]],
        cablesElectricos: ['', [Validators.maxLength(30)]],
        bateria: ['', [Validators.maxLength(30)]],
        frenoDinamico: ['', [Validators.maxLength(30)]],
        alarma: ['', [Validators.maxLength(30)]],
        verificacionTierra: ['', [Validators.maxLength(30)]],
        iluminacion: ['', [Validators.maxLength(30)]],
        velocimetro: ['', [Validators.maxLength(30)]],
        condicionGeneralMandoControl: ['', [Validators.maxLength(50)]]
      }),
      Seccion4: this.formBuilder.group({ /** SISTEMA NEUMATICO Y FRENO */
        marcaSistemaNeumatico: ['', [Validators.maxLength(30)]],
        modelo: ['', [Validators.maxLength(30)]],
        tipo: ['', [Validators.maxLength(30)]],
        capacidad: ['', [Validators.maxLength(30)]],
        velocidad: ['', [Validators.maxLength(30)]],
        valvulaAlivio: ['', [Validators.maxLength(30)]],
        ultimaFechaReparacion: ['', [Validators.maxLength(10)]],
        ultimaFechaMantenimiento: ['', [Validators.maxLength(30)]],
        condicionGeneral: ['', [Validators.maxLength(50)]],
        valvulaFreno: ['', [Validators.maxLength(30)]],
        controlAlerta: ['', [Validators.maxLength(30)]],
        sobreVelocidad: ['', [Validators.maxLength(30)]],
        pruebaFugas: ['', [Validators.maxLength(30)]],
        estadoAire: ['', [Validators.maxLength(30)]],
        valvulaSeguridad: ['', [Validators.maxLength(30)]],
        ultimaFechaReparacionFreno: ['', [Validators.maxLength(10)]],
        ultimaFechaMantenimientoFreno: ['', [Validators.maxLength(10)]],
      }),
      Seccion5: this.formBuilder.group({  /** CARROCERIA Y BASTIDOR */
        estadoCabina: ['', [Validators.maxLength(30)]],
        estadoVidrios: ['', [Validators.maxLength(30)]],
        estadoCampana: ['', [Validators.maxLength(30)]],
        estadoBaranda: ['', [Validators.maxLength(30)]],
        estadoCarroceria: ['', [Validators.maxLength(30)]],
        estadoAsiento: ['', [Validators.maxLength(30)]],
        estadoCocina: ['', [Validators.maxLength(30)]],
        tipoBanio: ['', [Validators.maxLength(30)]],
        estadoBanio: ['', [Validators.maxLength(30)]],
        estadoPuertas: ['', [Validators.maxLength(30)]],
        extinguidores: ['', [Validators.maxLength(30)]],
        condicionGeneral: ['', [Validators.maxLength(30)]],
        estadoBastidor: ['', [Validators.maxLength(30)]],
        estadoTrompa: ['', [Validators.maxLength(30)]],
        estadoEnganche: ['', [Validators.maxLength(30)]],
        condicionGeneralBastidor: ['', [Validators.maxLength(50)]],
        resultadoPotencia: ['', [Validators.maxLength(30)]],
        resultadoFrenado: ['', [Validators.maxLength(30)]],
        resultadoAceleracion: ['', [Validators.maxLength(30)]],
      }),
      Seccion6: this.formBuilder.group({ /** BOGGIES */
        numeroEjes: ['', [Validators.maxLength(3)]],
        numeroBoggies: ['', [Validators.maxLength(3)]],
        estadoPlatoCentro: ['', [Validators.maxLength(30)]],
        estadoApoyoLateral: ['', [Validators.maxLength(30)]],
        estadoRuedas: ['', [Validators.maxLength(30)]],
        diametroRuedas: ['', [Validators.maxLength(30)]],
        estadoPestanas: ['', [Validators.maxLength(30)]],
        ultimaFechaReparacionBoggies: ['', [Validators.maxLength(10)]],
        ultimaFechaMantenimientoBoggies: ['', [Validators.maxLength(10)]],
        condicionGeneralBoggies: ['', [Validators.maxLength(30)]],
      }),
      Seccion7: this.formBuilder.group({ /** FRENOS */
        directo: ['', [Validators.maxLength(30)]],
        automatico: ['', [Validators.maxLength(30)]],
        independiente: ['', [Validators.maxLength(30)]],
        parqueo: ['', [Validators.maxLength(30)]],
        condicionGeneralFrenos: ['', [Validators.maxLength(30)]],
        evaluacionFinal: ['', [Validators.required]],
        comentario: ['', [Validators.maxLength(100)]],
        evaluador: ['', [Validators.maxLength(50)]]
      }),
    });

    this.a_AnexosFA.push(newformAnexo);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.datosSolicitante(this.dataInput.tramiteReqRefId);

    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        break;
      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        break;
      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        break;
      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        break;
    }
    await this.cargarDatos();
  }

  async datosSolicitante(FormularioId: number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    try {
      const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const metaDataForm: any = JSON.parse(dataForm.metaData);
      const seccion3 = metaDataForm.seccion3;
      const seccion7 = metaDataForm.seccion7;

      this.tipoDocumentoSolicitante = seccion7.tipoDocumentoSolicitante;
      this.nombreTipoDocumentoSolicitante = seccion7.nombreTipoDocumentoSolicitante;
      this.numeroDocumentoSolicitante = seccion7.numeroDocumentoSolicitante;
      this.nombresApellidosSolicitante = seccion7.nombresApellidosSolicitante;

      this.organizacionFerroviaria = seccion3.razonSocial;

    } catch (error) {
      console.error(error);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Debe ingresar primero el Formulario');
    }
  }

  // GET FORM anexoFG
  get a_AnexosFA(): UntypedFormArray { return this.anexoFG.get(['a_AnexosFA']) as UntypedFormArray; }

  a_Seccion1(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion1']) as UntypedFormGroup; }
  a_s1_Organizacion(index: number): UntypedFormControl { return this.a_Seccion1(index).get('organizacion') as UntypedFormControl; }
  a_s1_Ambito(index: number): UntypedFormControl { return this.a_Seccion1(index).get('ambito') as UntypedFormControl; }
  a_s1_Documento(index: number): UntypedFormControl { return this.a_Seccion1(index).get('documento') as UntypedFormControl; }
  a_s1_Tramite(index: number): UntypedFormControl { return this.a_Seccion1(index).get('tramite') as UntypedFormControl; }
  a_s1_TipoVehiculo(index: number): UntypedFormControl { return this.a_Seccion1(index).get('tipoVehiculo') as UntypedFormControl; }
  a_s1_NumeroVehiculo(index: number): UntypedFormControl { return this.a_Seccion1(index).get('numeroVehiculo') as UntypedFormControl; }
  a_s1_Fabricante(index: number): UntypedFormControl { return this.a_Seccion1(index).get('fabricante') as UntypedFormControl; }
  a_s1_PesoBruto(index: number): UntypedFormControl { return this.a_Seccion1(index).get('pesoBruto') as UntypedFormControl; }
  a_s1_Trocha(index: number): UntypedFormControl { return this.a_Seccion1(index).get('trocha') as UntypedFormControl; }
  a_s1_AnioFabricacion(index: number): UntypedFormControl { return this.a_Seccion1(index).get('anioFabricacion') as UntypedFormControl; }
  a_s1_Capacidad(index: number): UntypedFormControl { return this.a_Seccion1(index).get('capacidad') as UntypedFormControl; }

  a_Seccion2(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion2']) as UntypedFormGroup; }
  a_s2_MotorDiesel(index: number): UntypedFormControl { return this.a_Seccion2(index).get('motorDiesel') as UntypedFormControl; }
  a_s2_MarcaSistemaMecanico(index: number): UntypedFormControl { return this.a_Seccion2(index).get('marcaSistemaMecanico') as UntypedFormControl; }
  a_s2_AnioFabricacion(index: number): UntypedFormControl { return this.a_Seccion2(index).get('anioFabricacion') as UntypedFormControl; }
  a_s2_Potencia(index: number): UntypedFormControl { return this.a_Seccion2(index).get('potencia') as UntypedFormControl; }
  a_s2_Modelo(index: number): UntypedFormControl { return this.a_Seccion2(index).get('modelo') as UntypedFormControl; }
  a_s2_Cilindro(index: number): UntypedFormControl { return this.a_Seccion2(index).get('cilindro') as UntypedFormControl; }
  a_s2_Sobrealimentacion(index: number): UntypedFormControl { return this.a_Seccion2(index).get('sobrealimentacion') as UntypedFormControl; }
  a_s2_RotacionMaxima(index: number): UntypedFormControl { return this.a_Seccion2(index).get('rotacionMaxima') as UntypedFormControl; }
  a_s2_Sobrevelocidad(index: number): UntypedFormControl { return this.a_Seccion2(index).get('sobrevelocidad') as UntypedFormControl; }
  a_s2_BajaPresion(index: number): UntypedFormControl { return this.a_Seccion2(index).get('bajaPresion') as UntypedFormControl; }
  a_s2_UltimaFechaReparacion(index: number): UntypedFormControl { return this.a_Seccion2(index).get('ultimaFechaReparacion') as UntypedFormControl; }
  a_s2_UltimaFechaMantenimiento(index: number): UntypedFormControl { return this.a_Seccion2(index).get('ultimaFechaMantenimiento') as UntypedFormControl; }
  a_s2_CondicionGeneral(index: number): UntypedFormControl { return this.a_Seccion2(index).get('condicionGeneral') as UntypedFormControl; }

  a_Seccion3(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion3']) as UntypedFormGroup; }
  a_s3_MarcaSistemaElectrico(index: number): UntypedFormControl { return this.a_Seccion3(index).get('marcaSistemaElectrico') as UntypedFormControl; }
  a_s3_Modelo(index: number): UntypedFormControl { return this.a_Seccion3(index).get('modelo') as UntypedFormControl; }
  a_s3_NumeroPolos(index: number): UntypedFormControl { return this.a_Seccion3(index).get('numeroPolos') as UntypedFormControl; }
  a_s3_UltimaFechaReparacion(index: number): UntypedFormControl { return this.a_Seccion3(index).get('ultimaFechaReparacion') as UntypedFormControl; }
  a_s3_UltimaFechaMantenimiento(index: number): UntypedFormControl { return this.a_Seccion3(index).get('ultimaFechaMantenimiento') as UntypedFormControl; }
  a_s3_CondicionGeneralAlternador(index: number): UntypedFormControl { return this.a_Seccion3(index).get('condicionGeneralAlternador') as UntypedFormControl; }
  a_s3_MarcaMotor(index: number): UntypedFormControl { return this.a_Seccion3(index).get('marcaMotor') as UntypedFormControl; }
  a_s3_ModeloMotor(index: number): UntypedFormControl { return this.a_Seccion3(index).get('modeloMotor') as UntypedFormControl; }
  a_s3_PolosMotor(index: number): UntypedFormControl { return this.a_Seccion3(index).get('polosMotor') as UntypedFormControl; }
  a_s3_UltimaFechaReparacionMotor(index: number): UntypedFormControl { return this.a_Seccion3(index).get('ultimaFechaReparacionMotor') as UntypedFormControl; }
  a_s3_UltimaFechaMantenimientoMotor(index: number): UntypedFormControl { return this.a_Seccion3(index).get('ultimaFechaMantenimientoMotor') as UntypedFormControl; }
  a_s3_CondicionGeneralMotor(index: number): UntypedFormControl { return this.a_Seccion3(index).get('condicionGeneralMandoMotor') as UntypedFormControl }
  a_s3_MandoControl(index: number): UntypedFormControl { return this.a_Seccion3(index).get('mandoControl') as UntypedFormControl; }
  a_s3_ContactoresRelay(index: number): UntypedFormControl { return this.a_Seccion3(index).get('contactoresRelay') as UntypedFormControl; }
  a_s3_CablesElectricos(index: number): UntypedFormControl { return this.a_Seccion3(index).get('cablesElectricos') as UntypedFormControl; }
  a_s3_Bateria(index: number): UntypedFormControl { return this.a_Seccion3(index).get('bateria') as UntypedFormControl; }
  a_s3_FrenoDinamico(index: number): UntypedFormControl { return this.a_Seccion3(index).get('frenoDinamico') as UntypedFormControl; }
  a_s3_Alarma(index: number): UntypedFormControl { return this.a_Seccion3(index).get('alarma') as UntypedFormControl; }
  a_s3_VerificacionTierra(index: number): UntypedFormControl { return this.a_Seccion3(index).get('verificacionTierra') as UntypedFormControl; }
  a_s3_Iluminacion(index: number): UntypedFormControl { return this.a_Seccion3(index).get('iluminacion') as UntypedFormControl; }
  a_s3_Velocimetro(index: number): UntypedFormControl { return this.a_Seccion3(index).get('velocimetro') as UntypedFormControl; }
  a_s3_CondicionGeneralMandoControl(index: number): UntypedFormControl { return this.a_Seccion3(index).get('condicionGeneralMandoControl') as UntypedFormControl; }

  a_Seccion4(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion4']) as UntypedFormGroup; }
  a_s4_MarcaSistemaElectrico(index: number): UntypedFormControl { return this.a_Seccion4(index).get('marcaSistemaNeumatico') as UntypedFormControl; }
  a_s4_Modelo(index: number): UntypedFormControl { return this.a_Seccion4(index).get('modelo') as UntypedFormControl; }
  a_s4_Tipo(index: number): UntypedFormControl { return this.a_Seccion4(index).get('tipo') as UntypedFormControl; }
  a_s4_Capacidad(index: number): UntypedFormControl { return this.a_Seccion4(index).get('capacidad') as UntypedFormControl; }
  a_s4_Velocidad(index: number): UntypedFormControl { return this.a_Seccion4(index).get('velocidad') as UntypedFormControl; }
  a_s4_ValvulaAlivio(index: number): UntypedFormControl { return this.a_Seccion4(index).get('valvulaAlivio') as UntypedFormControl; }
  a_s4_UltimaFechaReparacion(index: number): UntypedFormControl { return this.a_Seccion4(index).get('ultimaFechaReparacion') as UntypedFormControl; }
  a_s4_UltimaFechaMantenimiento(index: number): UntypedFormControl { return this.a_Seccion4(index).get('ultimaFechaMantenimiento') as UntypedFormControl; }
  a_s4_CondicionGeneral(index: number): UntypedFormControl { return this.a_Seccion4(index).get('condicionGeneral') as UntypedFormControl; }
  a_s4_ValvulaFreno(index: number): UntypedFormControl { return this.a_Seccion4(index).get('valvulaFreno') as UntypedFormControl; }
  a_s4_ControlAlerta(index: number): UntypedFormControl { return this.a_Seccion4(index).get('controlAlerta') as UntypedFormControl; }
  a_s4_SobreVelocidad(index: number): UntypedFormControl { return this.a_Seccion4(index).get('sobreVelocidad') as UntypedFormControl; }
  a_s4_PruebaFugas(index: number): UntypedFormControl { return this.a_Seccion4(index).get('pruebaFugas') as UntypedFormControl; }
  a_s4_EstadoAire(index: number): UntypedFormControl { return this.a_Seccion4(index).get('estadoAire') as UntypedFormControl; }
  a_s4_ValvulaSeguridad(index: number): UntypedFormControl { return this.a_Seccion4(index).get('valvulaSeguridad') as UntypedFormControl; }
  a_s4_UltimaFechaReparacionFreno(index: number): UntypedFormControl { return this.a_Seccion4(index).get('ultimaFechaReparacionFreno') as UntypedFormControl; }
  a_s4_UltimaFechaMantenimientoFreno(index: number): UntypedFormControl { return this.a_Seccion4(index).get('ultimaFechaMantenimientoFreno') as UntypedFormControl; }

  a_Seccion5(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion5']) as UntypedFormGroup; }
  a_s5_EstadoCabina(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoCabina') as UntypedFormControl; }
  a_s5_EstadoVidrios(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoVidrios') as UntypedFormControl; }
  a_s5_EstadoCampana(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoCampana') as UntypedFormControl; }
  a_s5_EstadoBaranda(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoBaranda') as UntypedFormControl; }
  a_s5_EstadoCarroceria(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoCarroceria') as UntypedFormControl; }
  a_s5_EstadoAsiento(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoAsiento') as UntypedFormControl; }
  a_s5_EstadoCocina(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoCocina') as UntypedFormControl; }
  a_s5_TipoBanio(index: number): UntypedFormControl { return this.a_Seccion5(index).get('tipoBanio') as UntypedFormControl; }
  a_s5_EstadoBanio(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoBanio') as UntypedFormControl; }
  a_s5_EstadoPuertas(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoPuertas') as UntypedFormControl; }
  a_s5_Extinguidores(index: number): UntypedFormControl { return this.a_Seccion5(index).get('extinguidores') as UntypedFormControl; }
  a_s5_CondicionGeneral(index: number): UntypedFormControl { return this.a_Seccion5(index).get('condicionGeneral') as UntypedFormControl; }
  a_s5_EstadoBastidor(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoBastidor') as UntypedFormControl; }
  a_s5_EstadoTrompa(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoTrompa') as UntypedFormControl; }
  a_s5_EstadoEnganche(index: number): UntypedFormControl { return this.a_Seccion5(index).get('estadoEnganche') as UntypedFormControl; }
  a_s5_CondicionGeneralBastidor(index: number): UntypedFormControl { return this.a_Seccion5(index).get('condicionGeneralBastidor') as UntypedFormControl; }
  a_s5_ResultadoPotencia(index: number): UntypedFormControl { return this.a_Seccion5(index).get('resultadoPotencia') as UntypedFormControl; }
  a_s5_ResultadoFrenado(index: number): UntypedFormControl { return this.a_Seccion5(index).get('resultadoFrenado') as UntypedFormControl; }
  a_s5_ResultadoAceleracion(index: number): UntypedFormControl { return this.a_Seccion5(index).get('resultadoAceleracion') as UntypedFormControl; }

  a_Seccion6(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion6']) as UntypedFormGroup; }
  a_s6_NumeroEjes(index: number): UntypedFormControl { return this.a_Seccion6(index).get('numeroEjes') as UntypedFormControl; }
  a_s6_NumeroBoggies(index: number): UntypedFormControl { return this.a_Seccion6(index).get('numeroBoggies') as UntypedFormControl; }
  a_s6_EstadoPlatoCentro(index: number): UntypedFormControl { return this.a_Seccion6(index).get('estadoPlatoCentro') as UntypedFormControl; }
  a_s6_EstadoApoyoLateral(index: number): UntypedFormControl { return this.a_Seccion6(index).get('estadoApoyoLateral') as UntypedFormControl; }
  a_s6_EstadoRuedas(index: number): UntypedFormControl { return this.a_Seccion6(index).get('estadoRuedas') as UntypedFormControl; }
  a_s6_DiametroRuedas(index: number): UntypedFormControl { return this.a_Seccion6(index).get('diametroRuedas') as UntypedFormControl; }
  a_s6_EstadoPestanas(index: number): UntypedFormControl { return this.a_Seccion6(index).get('estadoPestanas') as UntypedFormControl; }
  a_s6_UltimaFechaReparacion(index: number): UntypedFormControl { return this.a_Seccion6(index).get('ultimaFechaReparacionBoggies') as UntypedFormControl; }
  a_s6_UltimaFechaMantenimiento(index: number): UntypedFormControl { return this.a_Seccion6(index).get('ultimaFechaMantenimientoBoggies') as UntypedFormControl; }
  a_s6_CondicionGeneral(index: number): UntypedFormControl { return this.a_Seccion6(index).get('condicionGeneralBoggies') as UntypedFormControl; }

  a_Seccion7(index: number): UntypedFormGroup { return this.a_AnexosFA.get([index, 'Seccion7']) as UntypedFormGroup; }
  a_s7_Directo(index: number): UntypedFormControl { return this.a_Seccion7(index).get('directo') as UntypedFormControl; }
  a_s7_Automatico(index: number): UntypedFormControl { return this.a_Seccion7(index).get('automatico') as UntypedFormControl; }
  a_s7_Independiente(index: number): UntypedFormControl { return this.a_Seccion7(index).get('independiente') as UntypedFormControl; }
  a_s7_Parqueo(index: number): UntypedFormControl { return this.a_Seccion7(index).get('parqueo') as UntypedFormControl; }
  a_s7_CondicionGeneralFrenos(index: number): UntypedFormControl { return this.a_Seccion7(index).get('condicionGeneralFrenos') as UntypedFormControl; }

  a_s7_EvaluacionFinal(index: number): UntypedFormControl { return this.a_Seccion7(index).get('evaluacionFinal') as UntypedFormControl; }
  a_s7_Comentario(index: number): UntypedFormControl { return this.a_Seccion7(index).get('comentario') as UntypedFormControl; }
  a_s7_Evaluador(index: number): UntypedFormControl { return this.a_Seccion7(index).get('evaluador') as UntypedFormControl; }

  // FIN GET FORM anexoFG
  /*
    formInvalid(control: AbstractControl): boolean {
      if (control) {
        return control.invalid && (control.dirty || control.touched);
      }
    }*/

  formInvalid(control: string) {
    return this.anexoFG.get(control).invalid &&
      (this.anexoFG.get(control).dirty || this.anexoFG.get(control).touched);
  }

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).toPromise();
        const metaData: any = JSON.parse(dataAnexo.metaData);
        const { secciones } = JSON.parse(dataAnexo.metaData) as MetaData;
        //const { seccion8 } = JSON.parse(metaData.seccion8);
        console.log('metaData: ', metaData);
        console.log('Secciones: ', secciones);
        console.log('seccion 8: ', metaData.seccion8);

        this.idAnexo = dataAnexo.anexoId;

        if (!secciones) {
          this.funcionesMtcService.mensajeError('Ha ocurrido un error al intentar obtener el anexo, por favor intentelo nuevamente o contáctese con nosotros');
          return;
        }

        for (let i = 0; i < secciones.length; i++) {
          this.addAnexoFG();

          const {
            seccion1,
            seccion2,
            seccion3,
            seccion4,
            seccion5,
            seccion6,
            seccion7
          } = secciones[i]

          this.a_s1_Organizacion(i).setValue(seccion1.organizacion);
          this.a_s1_Ambito(i).setValue(seccion1.ambito);
          this.a_s1_Documento(i).setValue(seccion1.documento);
          this.a_s1_TipoVehiculo(i).setValue(seccion1.tipoVehiculo);
          this.a_s1_NumeroVehiculo(i).setValue(seccion1.numeroVehiculo);
          this.a_s1_Fabricante(i).setValue(seccion1.fabricante);
          this.a_s1_Trocha(i).setValue(seccion1.trocha);
          this.a_s1_AnioFabricacion(i).setValue(seccion1.anioFabricacion);
          this.a_s1_NumeroVehiculo(i).setValue(seccion1.numeroVehiculo);
          this.a_s1_PesoBruto(i).setValue(seccion1.pesoBruto);
          this.a_s1_Capacidad(i).setValue(seccion1.capacidad);

          this.a_s2_MotorDiesel(i).setValue(seccion2.motorDiesel);
          this.a_s2_MarcaSistemaMecanico(i).setValue(seccion2.marcaSistemaMecanico);
          this.a_s2_AnioFabricacion(i).setValue(seccion2.anioFabricacion);
          this.a_s2_Potencia(i).setValue(seccion2.potencia);
          this.a_s2_Modelo(i).setValue(seccion2.modelo);
          this.a_s2_Cilindro(i).setValue(seccion2.cilindro);
          this.a_s2_Sobrealimentacion(i).setValue(seccion2.sobrealimentacion);
          this.a_s2_RotacionMaxima(i).setValue(seccion2.rotacionMaxima);
          this.a_s2_Sobrevelocidad(i).setValue(seccion2.sobrevelocidad);
          this.a_s2_BajaPresion(i).setValue(seccion2.bajaPresion);
          this.a_s2_UltimaFechaReparacion(i).setValue(seccion2.ultimaFechaReparacion);
          this.a_s2_UltimaFechaMantenimiento(i).setValue(seccion2.ultimaFechaMantenimiento);
          this.a_s2_CondicionGeneral(i).setValue(seccion2.condicionGeneral);

          this.a_s3_MarcaSistemaElectrico(i).setValue(seccion3.marcaSistemaElectrico);
          this.a_s3_Modelo(i).setValue(seccion3.modelo);
          this.a_s3_NumeroPolos(i).setValue(seccion3.numeroPolos);
          this.a_s3_UltimaFechaReparacion(i).setValue(seccion3.ultimaFechaReparacion);
          this.a_s3_UltimaFechaMantenimiento(i).setValue(seccion3.ultimaFechaMantenimiento);
          this.a_s3_CondicionGeneralAlternador(i).setValue(seccion3.condicionGeneralAlternador);
          this.a_s3_MarcaMotor(i).setValue(seccion3.marcaMotor);
          this.a_s3_ModeloMotor(i).setValue(seccion3.modeloMotor);
          this.a_s3_PolosMotor(i).setValue(seccion3.polosMotor);
          this.a_s3_UltimaFechaReparacionMotor(i).setValue(seccion3.ultimaFechaReparacionMotor);
          this.a_s3_UltimaFechaMantenimientoMotor(i).setValue(seccion3.ultimaFechaMantenimientoMotor);
          this.a_s3_CondicionGeneralMotor(i).setValue(seccion3.condicionGeneralMotor);
          this.a_s3_MandoControl(i).setValue(seccion3.mandoControl);
          this.a_s3_ContactoresRelay(i).setValue(seccion3.contactoresRelay);
          this.a_s3_CablesElectricos(i).setValue(seccion3.cablesElectricos);
          this.a_s3_Bateria(i).setValue(seccion3.bateria);
          this.a_s3_FrenoDinamico(i).setValue(seccion3.frenoDinamico);
          this.a_s3_Alarma(i).setValue(seccion3.alarma);
          this.a_s3_VerificacionTierra(i).setValue(seccion3.verificacionTierra);
          this.a_s3_Iluminacion(i).setValue(seccion3.iluminacion);
          this.a_s3_Velocimetro(i).setValue(seccion3.velocimetro);
          this.a_s3_CondicionGeneralMandoControl(i).setValue(seccion3.condicionGeneralMandoControl);

          this.a_s4_MarcaSistemaElectrico(i).setValue(seccion4.marcaSistemaNeumatico);
          this.a_s4_Modelo(i).setValue(seccion4.modelo);
          this.a_s4_Tipo(i).setValue(seccion4.tipo);
          this.a_s4_Capacidad(i).setValue(seccion4.capacidad);
          this.a_s4_Velocidad(i).setValue(seccion4.velocidad);
          this.a_s4_ValvulaAlivio(i).setValue(seccion4.valvulaAlivio);
          this.a_s4_UltimaFechaReparacion(i).setValue(seccion4.ultimaFechaReparacion);
          this.a_s4_UltimaFechaMantenimiento(i).setValue(seccion4.ultimaFechaMantenimiento);
          this.a_s4_CondicionGeneral(i).setValue(seccion4.condicionGeneral);
          this.a_s4_ValvulaFreno(i).setValue(seccion4.valvulaFreno);
          this.a_s4_ControlAlerta(i).setValue(seccion4.controlAlerta);
          this.a_s4_SobreVelocidad(i).setValue(seccion4.sobreVelocidad);
          this.a_s4_PruebaFugas(i).setValue(seccion4.pruebaFugas);
          this.a_s4_EstadoAire(i).setValue(seccion4.estadoAire);
          this.a_s4_ValvulaSeguridad(i).setValue(seccion4.valvulaSeguridad);
          this.a_s4_UltimaFechaReparacionFreno(i).setValue(seccion4.ultimaFechaReparacionFreno);
          this.a_s4_UltimaFechaMantenimientoFreno(i).setValue(seccion4.ultimaFechaMantenimientoFreno);

          this.a_s5_EstadoCabina(i).setValue(seccion5.estadoCabina);
          this.a_s5_EstadoVidrios(i).setValue(seccion5.estadoVidrios);
          this.a_s5_EstadoCampana(i).setValue(seccion5.estadoCampana);
          this.a_s5_EstadoBaranda(i).setValue(seccion5.estadoBaranda);
          this.a_s5_EstadoCarroceria(i).setValue(seccion5.estadoCarroceria);
          this.a_s5_EstadoAsiento(i).setValue(seccion5.estadoAsiento);
          this.a_s5_EstadoCocina(i).setValue(seccion5.estadoCocina);
          this.a_s5_TipoBanio(i).setValue(seccion5.tipoBanio);
          this.a_s5_EstadoBanio(i).setValue(seccion5.estadoBanio);
          this.a_s5_EstadoPuertas(i).setValue(seccion5.estadoPuertas);
          this.a_s5_Extinguidores(i).setValue(seccion5.extinguidores);
          this.a_s5_CondicionGeneral(i).setValue(seccion5.condicionGeneral);
          this.a_s5_EstadoBastidor(i).setValue(seccion5.estadoBastidor);
          this.a_s5_EstadoTrompa(i).setValue(seccion5.estadoTrompa);
          this.a_s5_EstadoEnganche(i).setValue(seccion5.estadoEnganche);
          this.a_s5_CondicionGeneralBastidor(i).setValue(seccion5.estadoCabina);
          this.a_s5_ResultadoPotencia(i).setValue(seccion5.resultadoPotencia);
          this.a_s5_ResultadoFrenado(i).setValue(seccion5.resultadoFrenado);
          this.a_s5_ResultadoAceleracion(i).setValue(seccion5.resultadoAceleracion);

          this.a_s6_NumeroEjes(i).setValue(seccion6.numeroBoggies);
          this.a_s6_NumeroBoggies(i).setValue(seccion6.numeroBoggies);
          this.a_s6_EstadoPlatoCentro(i).setValue(seccion6.estadoPlatoCentro);
          this.a_s6_EstadoApoyoLateral(i).setValue(seccion6.estadoApoyoLateral);
          this.a_s6_EstadoRuedas(i).setValue(seccion6.estadoRuedas);
          this.a_s6_DiametroRuedas(i).setValue(seccion6.diametroRuedas);
          this.a_s6_EstadoPestanas(i).setValue(seccion6.estadoPestanas);
          this.a_s6_UltimaFechaReparacion(i).setValue(seccion6.ultimaFechaReparacion);
          this.a_s6_UltimaFechaMantenimiento(i).setValue(seccion6.ultimaFechaMantenimiento);
          this.a_s6_CondicionGeneral(i).setValue(seccion6.condicionGeneral);

          this.a_s7_Directo(i).setValue(seccion7.directo);
          this.a_s7_Automatico(i).setValue(seccion7.automatico);
          this.a_s7_Independiente(i).setValue(seccion7.independiente);
          this.a_s7_Parqueo(i).setValue(seccion7.parqueo);
          this.a_s7_CondicionGeneralFrenos(i).setValue(seccion7.condicionGeneral);
          this.a_s7_EvaluacionFinal(i).setValue(seccion7.evaluacionFinal);
          this.a_s7_Comentario(i).setValue(seccion7.comentario);
          this.a_s7_Evaluador(i).setValue(seccion7.evaluador);
        }

        this.tipoDocumentoSolicitante = metaData.seccion8.tipoDocumentoSolicitante;
        this.nombreTipoDocumentoSolicitante = metaData.seccion8.nombreTipoDocumentoSolicitante;
        this.numeroDocumentoSolicitante = metaData.seccion8.numeroDocumentoSolicitante;
        this.nombresApellidosSolicitante = metaData.seccion8.nombresApellidosSolicitante;

      }
      catch (e) {
        console.error(e);
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    } else {
      this.addAnexoFG();
    }
    this.funcionesMtcService.ocultarCargando();
  }

  get maxLengthPlacaRodaje(): number {
    if (this.tipoSolicitante === 'PNR') {
      return 20;
    }
    else {
      return 6;
    }
  }

  soloNumeros(event): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 002-A/17.03';
    }
    catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar Pdf');
    }
  }

  addAnexoSolicitado(btnSubmit: HTMLButtonElement): void {
    btnSubmit.disabled = true;

    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de agregar una nuevo Anexo 002-A/17.03?')
      .then(() => {
        this.addAnexoFG();
      });

    btnSubmit.disabled = false;
  }

  guardarAnexo(): void {
    this.findInvalidControls();
    this.anexoFG.markAllAsTouched();
    if (this.anexoFG.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    const dataGuardar: Anexo002_A17_3Request = new Anexo002_A17_3Request();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = 'A';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    const { secciones } = dataGuardar.metaData;
    const seccion1: Seccion1 = new Seccion1();
    const seccion2: Seccion2 = new Seccion2();
    const seccion3: Seccion3 = new Seccion3();
    const seccion4: Seccion4 = new Seccion4();
    const seccion5: Seccion5 = new Seccion5();
    const seccion6: Seccion6 = new Seccion6();
    const seccion7: Seccion7 = new Seccion7();
    const seccion8: Seccion8 = new Seccion8();
    // -------------------------------------
    // SECCION 1:
    dataGuardar.metaData.codigoProcedimiento = this.codigoProcedimientoTupa;

    for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
      secciones[i] = new Secciones();
      const { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6, seccion7 } = secciones[i];

      //let seccion1: A002_A28_Seccion1 = new A002_A28_Seccion1();
      seccion1.organizacion = this.a_s1_Organizacion(i).value;
      seccion1.ambito = this.a_s1_Ambito(i).value;
      seccion1.documento = this.a_s1_Documento(i).value;
      seccion1.tramite = this.a_s1_Tramite(i).value;
      seccion1.tipoVehiculo = this.a_s1_TipoVehiculo(i).value;
      seccion1.numeroVehiculo = this.a_s1_NumeroVehiculo(i).value;;
      seccion1.fabricante = this.a_s1_Fabricante(i).value;
      seccion1.pesoBruto = this.a_s1_PesoBruto(i).value;
      seccion1.trocha = this.a_s1_Trocha(i).value;
      seccion1.anioFabricacion = this.a_s1_AnioFabricacion(i).value;
      seccion1.capacidad = this.a_s1_Capacidad(i).value;

      seccion2.motorDiesel = this.a_s2_MotorDiesel(i).value;
      seccion2.marcaSistemaMecanico = this.a_s2_MarcaSistemaMecanico(i).value;
      seccion2.anioFabricacion = this.a_s2_AnioFabricacion(i).value;
      seccion2.potencia = this.a_s2_Potencia(i).value;
      seccion2.modelo = this.a_s2_Modelo(i).value;
      seccion2.cilindro = this.a_s2_Cilindro(i).value;
      seccion2.sobrealimentacion = this.a_s2_Sobrealimentacion(i).value;
      seccion2.rotacionMaxima = this.a_s2_RotacionMaxima(i).value;
      seccion2.sobrevelocidad = this.a_s2_Sobrevelocidad(i).value;
      seccion2.bajaPresion = this.a_s2_BajaPresion(i).value;
      seccion2.ultimaFechaReparacion = this.a_s2_UltimaFechaReparacion(i).value;
      seccion2.ultimaFechaMantenimiento = this.a_s2_UltimaFechaMantenimiento(i).value;
      seccion2.condicionGeneral = this.a_s2_CondicionGeneral(i).value;

      seccion3.marcaSistemaElectrico = this.a_s3_MarcaSistemaElectrico(i).value;
      seccion3.modelo = this.a_s3_Modelo(i).value;
      seccion3.numeroPolos = this.a_s3_NumeroPolos(i).value;
      seccion3.ultimaFechaReparacion = this.a_s3_UltimaFechaReparacion(i).value;
      seccion3.ultimaFechaMantenimiento = this.a_s3_UltimaFechaMantenimiento(i).value;
      seccion3.condicionGeneralAlternador = this.a_s3_CondicionGeneralAlternador(i).value;
      seccion3.marcaMotor = this.a_s3_MarcaMotor(i).value;
      seccion3.modeloMotor = this.a_s3_ModeloMotor(i).value;
      seccion3.polosMotor = this.a_s3_PolosMotor(i).value;
      seccion3.ultimaFechaReparacionMotor = this.a_s3_UltimaFechaReparacionMotor(i).value;
      seccion3.ultimaFechaMantenimientoMotor = this.a_s3_UltimaFechaMantenimientoMotor(i).value;
      seccion3.condicionGeneralMotor = this.a_s3_CondicionGeneralMotor(i).value;
      seccion3.mandoControl = this.a_s3_MandoControl(i).value;
      seccion3.contactoresRelay = this.a_s3_ContactoresRelay(i).value;
      seccion3.cablesElectricos = this.a_s3_CablesElectricos(i).value;
      seccion3.bateria = this.a_s3_Bateria(i).value;
      seccion3.frenoDinamico = this.a_s3_FrenoDinamico(i).value;
      seccion3.alarma = this.a_s3_Alarma(i).value;
      seccion3.verificacionTierra = this.a_s3_VerificacionTierra(i).value;
      seccion3.iluminacion = this.a_s3_Iluminacion(i).value;
      seccion3.velocimetro = this.a_s3_Velocimetro(i).value;
      seccion3.condicionGeneralMandoControl = this.a_s3_CondicionGeneralMandoControl(i).value;

      seccion4.marcaSistemaNeumatico = this.a_s4_MarcaSistemaElectrico(i).value;
      seccion4.modelo = this.a_s4_Modelo(i).value;
      seccion4.tipo = this.a_s4_Tipo(i).value;
      seccion4.capacidad = this.a_s4_Capacidad(i).value;
      seccion4.velocidad = this.a_s4_Velocidad(i).value;
      seccion4.valvulaAlivio = this.a_s4_ValvulaAlivio(i).value;
      seccion4.ultimaFechaReparacion = this.a_s4_UltimaFechaReparacion(i).value;
      seccion4.ultimaFechaMantenimiento = this.a_s4_UltimaFechaMantenimiento(i).value;
      seccion4.condicionGeneral = this.a_s4_CondicionGeneral(i).value;
      seccion4.valvulaFreno = this.a_s4_ValvulaFreno(i).value;
      seccion4.controlAlerta = this.a_s4_ControlAlerta(i).value;
      seccion4.sobreVelocidad = this.a_s4_SobreVelocidad(i).value;
      seccion4.pruebaFugas = this.a_s4_PruebaFugas(i).value;
      seccion4.estadoAire = this.a_s4_EstadoAire(i).value;
      seccion4.valvulaSeguridad = this.a_s4_ValvulaSeguridad(i).value;
      seccion4.ultimaFechaReparacionFreno = this.a_s4_UltimaFechaReparacionFreno(i).value;
      seccion4.ultimaFechaMantenimientoFreno = this.a_s4_UltimaFechaMantenimientoFreno(i).value;

      seccion5.estadoCabina = this.a_s5_EstadoCabina(i).value;
      seccion5.estadoVidrios = this.a_s5_EstadoVidrios(i).value;
      seccion5.estadoCampana = this.a_s5_EstadoCampana(i).value;
      seccion5.estadoBaranda = this.a_s5_EstadoBaranda(i).value;
      seccion5.estadoCarroceria = this.a_s5_EstadoCarroceria(i).value;
      seccion5.estadoAsiento = this.a_s5_EstadoAsiento(i).value;
      seccion5.estadoCocina = this.a_s5_EstadoCocina(i).value;
      seccion5.tipoBanio = this.a_s5_TipoBanio(i).value;
      seccion5.estadoBanio = this.a_s5_EstadoBanio(i).value;
      seccion5.estadoPuertas = this.a_s5_EstadoPuertas(i).value;
      seccion5.extinguidores = this.a_s5_Extinguidores(i).value;
      seccion5.condicionGeneral = this.a_s5_CondicionGeneral(i).value;
      seccion5.estadoBastidor = this.a_s5_EstadoBastidor(i).value;
      seccion5.estadoTrompa = this.a_s5_EstadoTrompa(i).value;
      seccion5.estadoEnganche = this.a_s5_EstadoEnganche(i).value;
      seccion5.condicionGeneralBastidor = this.a_s5_CondicionGeneralBastidor(i).value;
      seccion5.resultadoPotencia = this.a_s5_ResultadoPotencia(i).value;
      seccion5.resultadoFrenado = this.a_s5_ResultadoFrenado(i).value;
      seccion5.resultadoAceleracion = this.a_s5_ResultadoAceleracion(i).value;

      seccion6.numeroEjes = this.a_s6_NumeroEjes(i).value;
      seccion6.numeroBoggies = this.a_s6_NumeroBoggies(i).value;
      seccion6.estadoPlatoCentro = this.a_s6_EstadoPlatoCentro(i).value;
      seccion6.estadoApoyoLateral = this.a_s6_EstadoApoyoLateral(i).value;
      seccion6.estadoRuedas = this.a_s6_EstadoRuedas(i).value;
      seccion6.diametroRuedas = this.a_s6_DiametroRuedas(i).value;
      seccion6.estadoPestanas = this.a_s6_EstadoPestanas(i).value;
      seccion6.ultimaFechaReparacion = this.a_s6_UltimaFechaReparacion(i).value;
      seccion6.ultimaFechaMantenimiento = this.a_s6_UltimaFechaMantenimiento(i).value;
      seccion6.condicionGeneral = this.a_s6_CondicionGeneral(i).value;

      seccion7.directo = this.a_s7_Directo(i).value;
      seccion7.automatico = this.a_s7_Automatico(i).value;
      seccion7.independiente = this.a_s7_Independiente(i).value;
      seccion7.parqueo = this.a_s7_Parqueo(i).value;
      seccion7.condicionGeneral = this.a_s7_CondicionGeneralFrenos(i).value;
      seccion7.evaluacionFinal = this.a_s7_EvaluacionFinal(i).value;
      seccion7.comentario = this.a_s7_Comentario(i).value;
      seccion7.evaluador = this.a_s7_Evaluador(i).value;
    }

    dataGuardar.metaData.seccion8.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
    dataGuardar.metaData.seccion8.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
    dataGuardar.metaData.seccion8.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
    dataGuardar.metaData.seccion8.nombresApellidosSolicitante = this.nombresApellidosSolicitante;

    console.log(dataGuardar);
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {
        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          // GUARDAR:
          try {
            /*const data = await this.anexoService.post<any>(dataGuardarFormData).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;

            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);*/
            this.anexoService.post(dataGuardarFormData)
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

          }
          catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // MODIFICAR
          try {
            /*const data = await this.anexoService.put<any>(dataGuardarFormData).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;

            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);*/
            this.anexoService.put(dataGuardarFormData)
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
          catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
          }
        }
      });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.a_AnexosFA.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    console.log(invalid);
  }

}

