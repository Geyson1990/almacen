/**
 * Anexo 003-A/28
 * @author André Bernabé Pérez
 * @version 1.0 19.05.2022
 */

import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormArray,
  UntypedFormControl,
} from '@angular/forms';
import {
  NgbAccordionDirective ,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import {
  EquipoTrans,
  EquipoAux,
  MetaData,
  Anexo003_A28Request,
} from '../../../domain/anexo003_A28/anexo003_A28Request';
import { Anexo003_A28Service } from '../../../application/usecases';
import { Anexo003_A28Response } from '../../../domain/anexo003_A28/anexo003_A28Response';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-anexo003_A28',
  templateUrl: './anexo003_A28.component.html',
  styleUrls: ['./anexo003_A28.component.scss'],
})

// tslint:disable-next-line: class-name
export class Anexo003_A28_Component implements OnInit, AfterViewInit {
  @Input() public dataInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;
  @ViewChild('ubigeoCmpEstFija2') ubigeoEstFija2Component: UbigeoComponent;

  txtTitulo =
    'ANEXO 003-A/28 INFORMACIÓN TÉCNICA PARA EQUIPOS DE RADIOAFICIONADOS';

  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  anexoFG: UntypedFormGroup;
  equipoTransFG: UntypedFormGroup;
  equipoAuxFG: UntypedFormGroup;

  tipoSolicitante: string;

  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  tipoDocumento = '';
  nroDocumento = '';
  nroRuc = '';
  nombreCompleto = '';
  razonSocial = '';

  indexEditEquipoTrans = -1;
  indexEditEquipoAux = -1;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo003_A28Service,
    private seguridadService: SeguridadService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService
  ) {}

  ngOnInit(): void {
    // ==================================================================================
    // RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected = JSON.parse(
      localStorage.getItem('tramite-selected')
    );
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    // ==================================================================================

    this.uriArchivo = this.dataInput.rutaDocumento;

    this.anexoFG = this.fb.group({
      a_Seccion2FG: this.fb.group({
        a_s2_EquipoTransFA: this.fb.array([], [Validators.required]),
      }),
      a_Seccion3FG: this.fb.group({
        a_s3_TipoAntFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_MarcaFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_ModeloFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_GanaAntFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_TipoCableFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_FiltroFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
      }),
      a_Seccion4FG: this.fb.group({
        a_s4_EquipoAuxFA: this.fb.array([], [Validators.required]),
      }),
      a_Seccion5FG: this.fb.group({
        a_s5_declaracion1FC: [false, [Validators.requiredTrue]],
      }),
    });

    this.equipoTransFG = this.fb.group({
      et_MarcaFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_ModeloFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_NroSerieFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_PotenciaFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_TipoEmisFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_BandaOpeFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_AnioFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
    });

    this.equipoAuxFG = this.fb.group({
      ea_DescripFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_MarcaFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_ModeloFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_NroSerieFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_AnioFC: [
        '',
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.nombreCompleto = this.seguridadService.getUserName(); // nombre de usuario login
    this.nroDocumento = this.seguridadService.getNumDoc(); // nro de documento usuario login

    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.tipoDocumento = '01'; // 01 DNI  03 CI  04 CE

        break;
      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        break;
      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.tipoDocumento = '04'; // 01 DNI  03 CI  04 CE
        break;
      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.tipoDocumento = '01'; // 01 DNI  03 CI  04 CE
        break;
    }

    await this.cargarDatos();
  }

  // GET FORM anexoFG
  get a_Seccion2FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup;
  }
  get a_s2_EquipoTransFA(): UntypedFormArray {
    return this.a_Seccion2FG.get('a_s2_EquipoTransFA') as UntypedFormArray;
  }
  get a_Seccion3FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion3FG') as UntypedFormGroup;
  }
  get a_s3_TipoAntFC(): UntypedFormControl {
    return this.a_Seccion3FG.get('a_s3_TipoAntFC') as UntypedFormControl;
  }
  get a_s3_MarcaFC(): UntypedFormControl {
    return this.a_Seccion3FG.get('a_s3_MarcaFC') as UntypedFormControl;
  }
  get a_s3_ModeloFC(): UntypedFormControl {
    return this.a_Seccion3FG.get('a_s3_ModeloFC') as UntypedFormControl;
  }
  get a_s3_GanaAntFC(): UntypedFormControl {
    return this.a_Seccion3FG.get('a_s3_GanaAntFC') as UntypedFormControl;
  }
  get a_s3_TipoCableFC(): UntypedFormControl {
    return this.a_Seccion3FG.get('a_s3_TipoCableFC') as UntypedFormControl;
  }
  get a_s3_FiltroFC(): UntypedFormControl {
    return this.a_Seccion3FG.get('a_s3_FiltroFC') as UntypedFormControl;
  }
  get a_Seccion4FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion4FG') as UntypedFormGroup;
  }
  get a_s4_EquipoAuxFA(): UntypedFormArray {
    return this.a_Seccion4FG.get('a_s4_EquipoAuxFA') as UntypedFormArray;
  }
  get a_Seccion5FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup;
  }
  get a_s5_declaracion1FC(): UntypedFormControl {
    return this.a_Seccion5FG.get('a_s5_declaracion1FC') as UntypedFormControl;
  }

  get et_MarcaFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_MarcaFC') as UntypedFormControl;
  }
  get et_ModeloFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_ModeloFC') as UntypedFormControl;
  }
  get et_NroSerieFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_NroSerieFC') as UntypedFormControl;
  }
  get et_PotenciaFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_PotenciaFC') as UntypedFormControl;
  }
  get et_TipoEmisFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_TipoEmisFC') as UntypedFormControl;
  }
  get et_BandaOpeFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_BandaOpeFC') as UntypedFormControl;
  }
  get et_AnioFC(): UntypedFormControl {
    return this.equipoTransFG.get('et_AnioFC') as UntypedFormControl;
  }

  get ea_DescripFC(): UntypedFormControl {
    return this.equipoAuxFG.get('ea_DescripFC') as UntypedFormControl;
  }
  get ea_MarcaFC(): UntypedFormControl {
    return this.equipoAuxFG.get('ea_MarcaFC') as UntypedFormControl;
  }
  get ea_ModeloFC(): UntypedFormControl {
    return this.equipoAuxFG.get('ea_ModeloFC') as UntypedFormControl;
  }
  get ea_NroSerieFC(): UntypedFormControl {
    return this.equipoAuxFG.get('ea_NroSerieFC') as UntypedFormControl;
  }
  get ea_AnioFC(): UntypedFormControl {
    return this.equipoAuxFG.get('ea_AnioFC') as UntypedFormControl;
  }

  a_s2_et_MarcaFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_MarcaFC']) as UntypedFormControl;
  }
  a_s2_et_ModeloFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_ModeloFC']) as UntypedFormControl;
  }
  a_s2_et_NroSerieFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_NroSerieFC']) as UntypedFormControl;
  }
  a_s2_et_PotenciaFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_PotenciaFC']) as UntypedFormControl;
  }
  a_s2_et_TipoEmisFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_TipoEmisFC']) as UntypedFormControl;
  }
  a_s2_et_BandaOpeFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_BandaOpeFC']) as UntypedFormControl;
  }
  a_s2_et_AnioFC(index: number): UntypedFormControl {
    return this.a_s2_EquipoTransFA.get([index, 'et_AnioFC']) as UntypedFormControl;
  }

  a_s4_ea_DescripFC(index: number): UntypedFormControl {
    return this.a_s4_EquipoAuxFA.get([index, 'ea_DescripFC']) as UntypedFormControl;
  }
  a_s4_ea_MarcaFC(index: number): UntypedFormControl {
    return this.a_s4_EquipoAuxFA.get([index, 'ea_MarcaFC']) as UntypedFormControl;
  }
  a_s4_ea_ModeloFC(index: number): UntypedFormControl {
    return this.a_s4_EquipoAuxFA.get([index, 'ea_ModeloFC']) as UntypedFormControl;
  }
  a_s4_ea_NroSerieFC(index: number): UntypedFormControl {
    return this.a_s4_EquipoAuxFA.get([index, 'ea_NroSerieFC']) as UntypedFormControl;
  }
  a_s4_ea_AnioFC(index: number): UntypedFormControl {
    return this.a_s4_EquipoAuxFA.get([index, 'ea_AnioFC']) as UntypedFormControl;
  }
  // FIN GET FORM anexoFG

  // region: Equipo Transmisor
  saveEquipoTrans(): void {
    const equipoTrans: EquipoTrans = {
      marca: this.et_MarcaFC.value,
      modelo: this.et_ModeloFC.value,
      nroSerie: this.et_NroSerieFC.value,
      potencia: this.et_PotenciaFC.value,
      tipoEmision: this.et_TipoEmisFC.value,
      bandaOpera: this.et_BandaOpeFC.value,
      anio: this.et_AnioFC.value,
    };

    this.funcionesMtcService
      .mensajeConfirmar(
        `Desea ${
          this.indexEditEquipoTrans === -1 ? 'guardar' : 'modificar'
        } la información del equipo transmisor?`
      )
      .then(() => {
        this.addEditEquipoTransFG(equipoTrans, this.indexEditEquipoTrans);
        this.indexEditEquipoTrans = -1;
        this.equipoTransFG.reset();
      });
  }

  nosaveEquipoTrans(): void {
    this.indexEditEquipoTrans = -1;
    this.equipoTransFG.reset();
  }

  editEquipoTrans(index: number): void {
    this.indexEditEquipoTrans = index;

    const marca = this.a_s2_et_MarcaFC(index).value;
    const modelo = this.a_s2_et_ModeloFC(index).value;
    const nroSerie = this.a_s2_et_NroSerieFC(index).value;
    const potencia = this.a_s2_et_PotenciaFC(index).value;
    const tipoEmision = this.a_s2_et_TipoEmisFC(index).value;
    const bandaOpera = this.a_s2_et_BandaOpeFC(index).value;
    const anio = this.a_s2_et_AnioFC(index).value;

    this.et_MarcaFC.setValue(marca);
    this.et_ModeloFC.setValue(modelo);
    this.et_NroSerieFC.setValue(nroSerie);
    this.et_PotenciaFC.setValue(potencia);
    this.et_TipoEmisFC.setValue(tipoEmision);
    this.et_BandaOpeFC.setValue(bandaOpera);
    this.et_AnioFC.setValue(anio);
  }

  private addEditEquipoTransFG(
    equipoTrans: EquipoTrans,
    index: number = -1
  ): void {
    const { marca, modelo, nroSerie, potencia, tipoEmision, bandaOpera, anio } =
      equipoTrans;

    const newEquipoTransFG = this.fb.group({
      et_MarcaFC: [
        marca,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_ModeloFC: [
        modelo,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_NroSerieFC: [
        nroSerie,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_PotenciaFC: [
        potencia,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_TipoEmisFC: [
        tipoEmision,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_BandaOpeFC: [
        bandaOpera,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      et_AnioFC: [
        anio,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
    });

    if (index === -1) {
      this.a_s2_EquipoTransFA.push(newEquipoTransFG);
    } else {
      this.a_s2_EquipoTransFA.setControl(index, newEquipoTransFG);
    }
  }

  removeEquipoTrans(index: number): void {
    this.funcionesMtcService
      .mensajeConfirmar(
        '¿Está seguro de eliminar la información del equipo transmisor seleccionado?'
      )
      .then(() => {
        this.a_s2_EquipoTransFA.removeAt(index);
      });
  }
  // endregion: Equipo Transmisor

  // region: Equipo Auxiliar
  saveEquipoAux(): void {
    const equipoAux: EquipoAux = {
      descripcion: this.ea_DescripFC.value,
      marca: this.ea_MarcaFC.value,
      modelo: this.ea_ModeloFC.value,
      nroSerie: this.ea_NroSerieFC.value,
      anio: this.ea_AnioFC.value,
    };

    this.funcionesMtcService
      .mensajeConfirmar(
        `Desea ${
          this.indexEditEquipoAux === -1 ? 'guardar' : 'modificar'
        } la información del equipo auxiliar?`
      )
      .then(() => {
        this.addEditEquipoAuxFG(equipoAux, this.indexEditEquipoAux);
        this.indexEditEquipoAux = -1;
        this.equipoAuxFG.reset();
      });
  }

  nosaveEquipoAux(): void {
    this.indexEditEquipoAux = -1;
    this.equipoAuxFG.reset();
  }

  editEquipoAux(index: number): void {
    this.indexEditEquipoAux = index;

    const descripcion = this.a_s4_ea_DescripFC(index).value;
    const marca = this.a_s4_ea_MarcaFC(index).value;
    const modelo = this.a_s4_ea_ModeloFC(index).value;
    const nroSerie = this.a_s4_ea_NroSerieFC(index).value;
    const anio = this.a_s4_ea_AnioFC(index).value;

    this.ea_DescripFC.setValue(descripcion);
    this.ea_MarcaFC.setValue(marca);
    this.ea_ModeloFC.setValue(modelo);
    this.ea_NroSerieFC.setValue(nroSerie);
    this.ea_AnioFC.setValue(anio);
  }

  private addEditEquipoAuxFG(equipoAux: EquipoAux, index: number = -1): void {
    const { descripcion, marca, modelo, nroSerie, anio } = equipoAux;

    const newEquipoAuxFG = this.fb.group({
      ea_DescripFC: [
        descripcion,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_MarcaFC: [
        marca,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_ModeloFC: [
        modelo,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_NroSerieFC: [
        nroSerie,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
      ea_AnioFC: [
        anio,
        [
          Validators.required,
          noWhitespaceValidator(),
          Validators.maxLength(30),
        ],
      ],
    });

    if (index === -1) {
      this.a_s4_EquipoAuxFA.push(newEquipoAuxFG);
    } else {
      this.a_s4_EquipoAuxFA.setControl(index, newEquipoAuxFG);
    }
  }

  removeEquipoAux(index: number): void {
    this.funcionesMtcService
      .mensajeConfirmar(
        '¿Está seguro de eliminar la información del equipo auxiliar seleccionado?'
      )
      .then(() => {
        this.a_s4_EquipoAuxFA.removeAt(index);
      });
  }
  // endregion: Equipo Auxiliar

  async cargarDatos(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService
          .get<Anexo003_A28Response>(this.dataInput.tramiteReqId)
          .toPromise();
        console.log(JSON.parse(dataAnexo.metaData));
        const { seccion2, seccion3, seccion4, seccion5, seccion6 } = JSON.parse(
          dataAnexo.metaData
        ) as MetaData;

        this.idAnexo = dataAnexo.anexoId;

        if (this.a_Seccion2FG.enabled) {
          const { listaEquipoTrans } = seccion2;

          if (this.a_s2_EquipoTransFA.enabled) {
            for (const equipoTrans of listaEquipoTrans) {
              this.addEditEquipoTransFG(equipoTrans);
            }
          }
        }

        if (this.a_Seccion3FG.enabled) {
          this.a_s3_TipoAntFC.setValue(seccion3.tipoAntena);
          this.a_s3_MarcaFC.setValue(seccion3.marca);
          this.a_s3_ModeloFC.setValue(seccion3.modelo);
          this.a_s3_GanaAntFC.setValue(seccion3.ganancia);
          this.a_s3_TipoCableFC.setValue(seccion3.tipoCable);
          this.a_s3_FiltroFC.setValue(seccion3.filtro);
        }

        if (this.a_Seccion4FG.enabled) {
          const { listaEquipoAux } = seccion4;

          if (this.a_s4_EquipoAuxFA.enabled) {
            for (const equipoAux of listaEquipoAux) {
              this.addEditEquipoAuxFG(equipoAux);
            }
          }
        }

        if (this.a_Seccion5FG.enabled) {
          const { declaracion1 } = seccion5;
          this.a_s5_declaracion1FC.setValue(declaracion1);
        }

        this.nroDocumento = seccion6.nroDocumento;
        this.nombreCompleto = seccion6.nombreCompleto;
        this.razonSocial = seccion6.razonSocial;
      } catch (e) {
        console.error(e);
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(
            'Problemas para recuperar los datos guardados del anexo'
          );
      }
    } else {
      // SI ES NUEVO
      await this.cargarDatosSolicitante();
    }
    this.funcionesMtcService.ocultarCargando();
  }

  async vistaPreviaAdjunto(
    fileAdjuntoFC: UntypedFormControl,
    pathNameAdjuntoFC: UntypedFormControl
  ): Promise<void> {
    const pathNameAdjunto = pathNameAdjuntoFC.value;
    if (pathNameAdjunto) {
      this.funcionesMtcService.mostrarCargando();
      try {
        const file: Blob = await this.visorPdfArchivosService
          .get(pathNameAdjunto)
          .toPromise();
        this.funcionesMtcService.ocultarCargando();
        this.visualizarPdf(file as File);
      } catch (e) {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    } else {
      this.visualizarPdf(fileAdjuntoFC.value);
    }
  }

  visualizarPdf(file: File): void {
    const modalRef = this.modalService.open(VistaPdfComponent, {
      size: 'lg',
      scrollable: true,
    });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = 'Vista Previa Documento Adjunto';
  }

  eliminarAdjunto(
    fileAdjuntoFC: UntypedFormControl,
    pathNameAdjuntoFC: UntypedFormControl
  ): void {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el archivo adjunto?')
      .then(() => {
        fileAdjuntoFC.setValue(null);
        pathNameAdjuntoFC.setValue(null);
      });
  }

  async descargarPdf(): Promise<void> {
    if (this.idAnexo === 0) {
      this.funcionesMtcService.mensajeError(
        'Debe guardar previamente los datos ingresados'
      );
      return;
    }
    this.funcionesMtcService.mostrarCargando();
    try {
      const file: Blob = await this.visorPdfArchivosService
        .get(this.uriArchivo)
        .toPromise();
      this.funcionesMtcService.ocultarCargando();

      const modalRef = this.modalService.open(VistaPdfComponent, {
        size: 'lg',
        scrollable: true,
      });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 003-A/28';
    } catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
  }

  downloadPlantEquipa(): void {}

  downloadPlantAntena(): void {}

  async cargarDatosSolicitante(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    // Obtenemos los datos del Solicitante
    if (this.tipoSolicitante === 'PJ') {
      try {
        const response = await this.sunatService
          .getDatosPrincipales(this.nroRuc)
          .toPromise();
        console.log('SUNAT: ', response);

        this.razonSocial = response.razonSocial?.trim() ?? '';

        // Cargamos el Representante Legal
        for (const repLegal of response.representanteLegal) {
          if (repLegal.nroDocumento === this.nroDocumento) {
            if (repLegal.tipoDocumento === '1') {
              // DNI
              this.tipoDocumento = '01';
              this.nroDocumento = repLegal.nroDocumento;
            }
            break;
          }
        }
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Sunat);
      }
    }
    if (this.tipoDocumento === '01') {
      // DNI
      try {
        const respuesta = await this.reniecService
          .getDni(this.nroDocumento)
          .toPromise();
        console.log(respuesta);

        if (
          respuesta.reniecConsultDniResponse.listaConsulta.coResultado !==
          '0000'
        ) {
          return this.funcionesMtcService.mensajeError(
            'Número de documento no registrado en RENIEC'
          );
        }

        const { prenombres, apPrimer, apSegundo } =
          respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        this.nombreCompleto = `${prenombres} ${apPrimer} ${apSegundo}`;
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Reniec);
      }
    } else if (this.tipoDocumento === '04') {
      // CARNÉ DE EXTRANJERÍA
      try {
        const { CarnetExtranjeria } = await this.extranjeriaService
          .getCE(this.nroDocumento)
          .toPromise();
        console.log(CarnetExtranjeria);
        const { numRespuesta, nombres, primerApellido, segundoApellido } =
          CarnetExtranjeria;

        if (numRespuesta !== '0000') {
          return this.funcionesMtcService.mensajeError(
            'Número de documento no registrado en Migraciones'
          );
        }

        this.nombreCompleto = `${nombres} ${primerApellido} ${segundoApellido}`;
      } catch (e) {
        console.error(e);
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError(CONSTANTES.MensajeError.Migraciones);
      }
    }
    this.funcionesMtcService.ocultarCargando();
  }

  async guardarAnexo(): Promise<void> {
    if (this.anexoFG.invalid === true) {
      this.funcionesMtcService.mensajeError(
        'Debe ingresar todos los campos obligatorios'
      );
      return;
    }

    const dataGuardar = new Anexo003_A28Request();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'A';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // -------------------------------------

    const { seccion2, seccion3, seccion4, seccion5, seccion6 } =
      dataGuardar.metaData;

    // SECCION 2:
    const { listaEquipoTrans } = seccion2;

    for (const controlFG of this.a_s2_EquipoTransFA.controls) {
      const equipoTrans: EquipoTrans = {
        marca: controlFG.get('et_MarcaFC').value,
        modelo: controlFG.get('et_ModeloFC').value,
        nroSerie: controlFG.get('et_NroSerieFC').value,
        potencia: controlFG.get('et_PotenciaFC').value,
        tipoEmision: controlFG.get('et_TipoEmisFC').value,
        bandaOpera: controlFG.get('et_BandaOpeFC').value,
        anio: controlFG.get('et_AnioFC').value,
      };
      listaEquipoTrans.push(equipoTrans);
    }
    // -------------------------------------
    // SECCION 3:
    seccion3.tipoAntena = this.a_s3_TipoAntFC.value ?? '';
    seccion3.marca = this.a_s3_MarcaFC.value ?? '';
    seccion3.modelo = this.a_s3_ModeloFC.value ?? '';
    seccion3.ganancia = this.a_s3_GanaAntFC.value ?? '';
    seccion3.tipoCable = this.a_s3_TipoCableFC.value ?? '';
    seccion3.filtro = this.a_s3_FiltroFC.value ?? '';
    // -------------------------------------
    // SECCION 4:
    const { listaEquipoAux } = seccion4;

    for (const controlFG of this.a_s4_EquipoAuxFA.controls) {
      const equipoAux: EquipoAux = {
        descripcion: controlFG.get('ea_DescripFC').value,
        marca: controlFG.get('ea_MarcaFC').value,
        modelo: controlFG.get('ea_ModeloFC').value,
        nroSerie: controlFG.get('ea_NroSerieFC').value,
        anio: controlFG.get('ea_AnioFC').value,
      };
      listaEquipoAux.push(equipoAux);
    }
    // -------------------------------------
    // SECCION 5:
    seccion5.declaracion1 = this.a_s5_declaracion1FC.value ?? false;
    // -------------------------------------
    // SECCION 6:
    seccion6.nroDocumento = this.nroDocumento;
    seccion6.nombreCompleto = this.nombreCompleto;
    seccion6.razonSocial = this.razonSocial;
    // -------------------------------------

    const dataGuardarFormData =
      this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService
      .mensajeConfirmar(
        `¿Está seguro de ${
          this.idAnexo === 0 ? 'guardar' : 'modificar'
        } los datos ingresados?`
      )
      .then(async () => {
        this.funcionesMtcService.mostrarCargando();
        if (this.idAnexo === 0) {
          // GUARDAR:
          try {
            const data = await this.anexoService
              .post(dataGuardarFormData)
              .toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;

            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(
              `Los datos fueron guardados exitosamente`
            );
          } catch (e) {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // MODIFICAR
          try {
            const data = await this.anexoService
              .put(dataGuardarFormData)
              .toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.idAnexo = data.id;
            this.uriArchivo = data.uriArchivo;

            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(
              `Los datos fueron modificados exitosamente`
            );
          } catch (e) {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para realizar la modificación de datos');
          }
        }
      });
  }
}
