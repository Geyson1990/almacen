/**
 * Anexo 003-B/28
 * @author André Bernabé Pérez
 * @version 1.0 04.12.2023
 */

import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import {
  Anexo003_B28Request,
  MetaData,
} from '../../../domain/anexo003_B28/anexo003_B28Request';
import { Anexo003_B28Service } from '../../../application/usecases';
import { Subscription } from 'rxjs';
import { Anexo003_B28Response } from '../../../domain/anexo003_B28/anexo003_B28Response';

@Component({
  selector: 'app-anexo003_B28',
  templateUrl: './anexo003_B28.component.html',
  styleUrls: ['./anexo003_B28.component.scss'],
})
export class Anexo003_B28_Component
  implements OnInit, AfterViewInit, OnDestroy
{
  subs: Subscription[] = [];

  @Input() public dataInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmp') ubigeoComponent: UbigeoComponent;

  txtTitulo =
    'ANEXO 003-B/28 INFORMACIÓN TÉCNICA DE ESTACIÓN REPETIDORA PARA ASOCIACIONES DE RADIOAFICIONADOS';

  graboUsuario = false;

  idAnexo = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  anexoFG: UntypedFormGroup;

  tipoSolicitante: string;

  // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo003_B28Service,
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
      a_Seccion1FG: this.fb.group({
        a_s1_DenominacionFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(50),
          ],
        ],
        a_s1_NroLicenciaFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s1_IndicativoFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
      }),
      a_Seccion2FG: this.fb.group({
        a_s2_UbicacionFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(100),
          ],
        ],
        a_s2_DepartamentoFC: ['', [Validators.required]],
        a_s2_ProvinciaFC: ['', [Validators.required]],
        a_s2_DistritoFC: ['', [Validators.required]],
        a_s2_LOGraFC: ['', [Validators.required, Validators.max(90)]],
        a_s2_LOMinFC: ['', [Validators.required, Validators.max(59)]],
        a_s2_LOSegFC: ['', [Validators.required, Validators.max(59)]],
        a_s2_LSGraFC: ['', [Validators.required, Validators.max(90)]],
        a_s2_LSMinFC: ['', [Validators.required, Validators.max(59)]],
        a_s2_LSSegFC: ['', [Validators.required, Validators.max(59)]],
      }),
      a_Seccion3FG: this.fb.group({
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
        a_s3_NroSerieFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_PotenciaFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_SubTonoFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_BandaFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s3_AnioFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
      }),
      a_Seccion4FG: this.fb.group({
        a_s4_TipoAntFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s4_MarcaFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s4_ModeloFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s4_GanaAntFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s4_TipoCableFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
        a_s4_FiltroFC: [
          '',
          [
            Validators.required,
            noWhitespaceValidator(),
            Validators.maxLength(30),
          ],
        ],
      }),
      a_Seccion5FG: this.fb.group({
        a_s5_declaracion1FC: [false, [Validators.requiredTrue]],
      }),
    });
  }

  ngAfterViewInit(): void {
    this.cargarDatos();
  }

  get a_Seccion1FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion1FG') as UntypedFormGroup;
  }
  get a_Seccion2FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup;
  }
  get a_Seccion3FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion3FG') as UntypedFormGroup;
  }
  get a_Seccion4FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion4FG') as UntypedFormGroup;
  }
  get a_Seccion5FG(): UntypedFormGroup {
    return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup;
  }

  cargarDatos(): void {
    this.funcionesMtcService.mostrarCargando();

    if (this.dataInput.movId <= 0) {
      this.funcionesMtcService.ocultarCargando();
      return;
    }

    // RECUPERAMOS LOS DATOS
    this.subs.push(
      this.anexoTramiteService
        .get<Anexo003_B28Response>(this.dataInput.tramiteReqId)
        .subscribe(
          async (dataAnexo) => {
            console.log(JSON.parse(dataAnexo.metaData));
            const {
              seccion1,
              seccion2,
              seccion3,
              seccion4,
              seccion5,
              seccion6,
            } = JSON.parse(dataAnexo.metaData) as MetaData;

            this.idAnexo = dataAnexo.anexoId;

            const {
              a_Seccion1FG,
              a_Seccion2FG,
              a_Seccion3FG,
              a_Seccion4FG,
              a_Seccion5FG,
            } = this.anexoFG.controls;

            if (a_Seccion1FG.enabled) {
              a_Seccion1FG
                .get('a_s1_DenominacionFC')
                .setValue(seccion1.denominacion);
              a_Seccion1FG
                .get('a_s1_NroLicenciaFC')
                .setValue(seccion1.nroLicencia);
              a_Seccion1FG
                .get('a_s1_IndicativoFC')
                .setValue(seccion1.indicativo);
            }

            if (a_Seccion2FG.enabled) {
              const { departamento, provincia, distrito, lonOeste, latSur } =
                seccion2;

              a_Seccion2FG.get('a_s2_UbicacionFC').setValue(seccion2.ubicacion);

              await this.ubigeoComponent?.setUbigeoByText(
                departamento,
                provincia,
                distrito
              );

              a_Seccion2FG.get('a_s2_LOGraFC').setValue(lonOeste.grados);
              a_Seccion2FG.get('a_s2_LOMinFC').setValue(lonOeste.minutos);
              a_Seccion2FG.get('a_s2_LOSegFC').setValue(lonOeste.segundos);
              a_Seccion2FG.get('a_s2_LSGraFC').setValue(latSur.grados);
              a_Seccion2FG.get('a_s2_LSMinFC').setValue(latSur.minutos);
              a_Seccion2FG.get('a_s2_LSSegFC').setValue(latSur.segundos);
            }

            if (a_Seccion3FG.enabled) {
              a_Seccion3FG.get('a_s3_MarcaFC').setValue(seccion3.marca);
              a_Seccion3FG.get('a_s3_ModeloFC').setValue(seccion3.modelo);
              a_Seccion3FG.get('a_s3_NroSerieFC').setValue(seccion3.nroSerie);
              a_Seccion3FG.get('a_s3_PotenciaFC').setValue(seccion3.potencia);
              a_Seccion3FG.get('a_s3_SubTonoFC').setValue(seccion3.subTono);
              a_Seccion3FG.get('a_s3_BandaFC').setValue(seccion3.banda);
              a_Seccion3FG.get('a_s3_AnioFC').setValue(seccion3.anio);
            }

            if (a_Seccion4FG.enabled) {
              a_Seccion4FG.get('a_s4_TipoAntFC').setValue(seccion4.tipoAntena);
              a_Seccion4FG.get('a_s4_MarcaFC').setValue(seccion4.marca);
              a_Seccion4FG.get('a_s4_ModeloFC').setValue(seccion4.modelo);
              a_Seccion4FG.get('a_s4_GanaAntFC').setValue(seccion4.ganancia);
              a_Seccion4FG.get('a_s4_TipoCableFC').setValue(seccion4.tipoCable);
              a_Seccion4FG.get('a_s4_FiltroFC').setValue(seccion4.filtro);
            }

            if (a_Seccion5FG.enabled) {
              const { declaracion1 } = seccion5;
              a_Seccion5FG.get('a_s5_declaracion1FC').setValue(declaracion1);
            }

            this.funcionesMtcService.ocultarCargando();
          },
          (err) => {
            console.error(err);
            this.funcionesMtcService.ocultarCargando();
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError(
                'Problemas para recuperar los datos guardados del anexo'
              );
          }
        )
    );
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 003-B/28';
    } catch (e) {
      console.error(e);
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para descargar el archivo PDF');
    }
  }

  guardarAnexo(): void {
    if (this.anexoFG.invalid === true) {
      this.anexoFG.markAllAsTouched();
      this.funcionesMtcService.mensajeError(
        'Debe ingresar todos los campos obligatorios'
      );
      return;
    }

    const dataGuardar = new Anexo003_B28Request();
    // -------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = 'B';
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    // -------------------------------------

    const { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6 } =
      dataGuardar.metaData;

    const {
      a_Seccion1FG,
      a_Seccion2FG,
      a_Seccion3FG,
      a_Seccion4FG,
      a_Seccion5FG,
    } = this.anexoFG.controls;

    // SECCION 1:
    seccion1.denominacion = a_Seccion1FG.get('a_s1_DenominacionFC').value ?? '';
    seccion1.nroLicencia = a_Seccion1FG.get('a_s1_NroLicenciaFC').value ?? '';
    seccion1.indicativo = a_Seccion1FG.get('a_s1_IndicativoFC').value ?? '';
    // -------------------------------------

    // SECCION 2:
    const { lonOeste, latSur } = seccion2;

    seccion2.ubicacion = a_Seccion2FG.get('a_s2_UbicacionFC').value ?? '';
    seccion2.departamento = this.ubigeoComponent?.getDepartamentoText() ?? '';
    seccion2.provincia = this.ubigeoComponent?.getProvinciaText() ?? '';
    seccion2.distrito = this.ubigeoComponent?.getDistritoText() ?? '';
    lonOeste.grados = a_Seccion2FG.get('a_s2_LOGraFC').value ?? '';
    lonOeste.minutos = a_Seccion2FG.get('a_s2_LOMinFC').value ?? '';
    lonOeste.segundos = a_Seccion2FG.get('a_s2_LOSegFC').value ?? '';
    latSur.grados = a_Seccion2FG.get('a_s2_LSGraFC').value ?? '';
    latSur.minutos = a_Seccion2FG.get('a_s2_LSMinFC').value ?? '';
    latSur.segundos = a_Seccion2FG.get('a_s2_LSSegFC').value ?? '';
    // -------------------------------------

    // SECCION 3:
    seccion3.marca = a_Seccion3FG.get('a_s3_MarcaFC').value ?? '';
    seccion3.modelo = a_Seccion3FG.get('a_s3_ModeloFC').value ?? '';
    seccion3.nroSerie = a_Seccion3FG.get('a_s3_NroSerieFC').value ?? '';
    seccion3.potencia = a_Seccion3FG.get('a_s3_PotenciaFC').value ?? '';
    seccion3.subTono = a_Seccion3FG.get('a_s3_SubTonoFC').value ?? '';
    seccion3.banda = a_Seccion3FG.get('a_s3_BandaFC').value ?? '';
    seccion3.anio = a_Seccion3FG.get('a_s3_AnioFC').value ?? '';
    // -------------------------------------

    // SECCION 4:
    seccion4.tipoAntena = a_Seccion4FG.get('a_s4_TipoAntFC').value ?? '';
    seccion4.marca = a_Seccion4FG.get('a_s4_MarcaFC').value ?? '';
    seccion4.modelo = a_Seccion4FG.get('a_s4_ModeloFC').value ?? '';
    seccion4.ganancia = a_Seccion4FG.get('a_s4_GanaAntFC').value ?? '';
    seccion4.tipoCable = a_Seccion4FG.get('a_s4_TipoCableFC').value ?? '';
    seccion4.filtro = a_Seccion4FG.get('a_s4_FiltroFC').value ?? '';
    // -------------------------------------

    // SECCION 5:
    seccion5.declaracion1 =
      a_Seccion5FG.get('a_s5_declaracion1FC').value ?? false;
    // -------------------------------------

    // SECCION 6:
    const datosUsuario = this.seguridadService.getDatosUsuarioLogin();

    seccion6.nroDocumento = datosUsuario.nroDocumento;
    seccion6.nombreCompleto = datosUsuario.nombreCompleto;
    seccion6.razonSocial = datosUsuario.razonSocial;
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

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
