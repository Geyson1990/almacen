import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './presentation/pages/inicio/inicio.component';
import { PublicoRoutingModule } from './publico-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleTupaComponent } from './presentation/components/detalle-tupa/detalle-tupa.component';
import { MateriaUseCase } from './application/usecases';
import { MateriaRepository } from './application/repositories';
import { MateriaHttpRepository } from './infrastructure/respositories/materia-http.repository';
import { DetalleProcedimientoComponent } from './presentation/components/detalle-procedimiento/detalle-procedimiento.component';
import { QuillModule } from 'ngx-quill';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCER } from './presentation/state/app.state';
import { TupaAttachButtonComponent } from 'src/app/components/attach-button/attach-button.component';
import { CuadroResumenAmbientalComponent } from 'src/app/modals/cuadro-resumen-ambiental/cuadro-resumen-ambiental.component';
import { ConfirmationDialogComponent } from 'src/app/modals/confirmation-dialog/confirmation-dialog.component';
import { PlanManejoComponent } from 'src/app/modals/plan-manejo/plan-manejo.component';
import { FuenteAbastecimientoComponent } from 'src/app/modals/fuente-abastecimiento/fuente-abastecimiento.component';
import { RequerimientoAguaComponent } from 'src/app/modals/requerimiento-agua/requerimiento-agua.component';
import { ViasAccesoNuevaComponent } from 'src/app/modals/vias-acceso-nueva/vias-acceso-nueva.component';
import { AreaSuperficialActivityComponent } from 'src/app/modals/area-superficial-activity/area-superficial-activity.component';
import { ParticipacionCiudadanaComponent } from 'src/app/modals/participacion-ciudadana/participacion-ciudadana.component';
import { ViasAccesoExistentesComponent } from 'src/app/modals/vias-acceso-existentes/vias-acceso-existentes.component';
import { TipoManoObraComponent } from 'src/app/modals/tipo-mano-obra/tipo-mano-obra.component';
import { DescripcionEtapaContruccionComponent } from 'src/app/modals/descripcion-etapa-contruccion/descripcion-etapa-contruccion.component';
import { DistanciaProyectoAreasNaturalesComponent } from 'src/app/modals/distancia-proyecto-areas-naturales/distancia-proyecto-areas-naturales.component';
import { MaquinariaModalComponent } from 'src/app/modals/maquinaria-modal/maquinaria-modal.component';
import { PagoDialogComponent } from 'src/app/components/pago-dialog/pago-dialog.component';
import { ConsultoraDialogComponent } from 'src/app/components/consultora-dialog/consultora-dialog.component';
import { PlanCierreActividadesDialogComponent } from 'src/app/components/plan-cierre-actividades-dialog/plan-cierre-actividades-dialog.component';
import { CuadroResumenContenidoAmbientalesDialogComponent } from 'src/app/components/cuadro-resumen-contenido-ambientales-dialog/cuadro-resumen-contenido-ambientales-dialog.component';
import { PlanContingenciaDialogComponent } from 'src/app/components/plan-contingencia-dialog/plan-contingencia-dialog.component';
import { PlanRelacionamientoDialogComponent } from 'src/app/components/plan-relacionamiento-dialog/plan-relacionamiento-dialog.component';
import { PlanVigilanciaAmbientalDialogComponent } from 'src/app/components/plan-vigilancia-ambiental-dialog/plan-vigilancia-ambiental-dialog.component';
import { ArqueologiaPatrimonioCulturalDialog } from 'src/app/components/arqueologia-patrimonio-cultural-dialog/arqueologia-patrimonio-cultural-dialog.component';
import { PlanMinimizacionManejoResiduoSolidoDialogComponent } from 'src/app/components/plan-minimizacion-manejo-residuo-solido-dialog/plan-minimizacion-manejo-residuo-solido-dialog.component';
import { PlanManejoDialog } from 'src/app/components/plan-manejo-dialog/plan-manejo-dialog.component';
import { ParticipacionCiudadanaDialog } from 'src/app/components/participacion-ciudadana-dialog/participacion-ciudadana-dialog.component';
import { CartografiaDialog } from 'src/app/components/cartografia-dialog/cartografia-dialog.component';
import { DescripcionPosiblesImpactAmbDialog } from 'src/app/components/descripcion-posibles-impact-amb-dialog/descripcion-posibles-impact-amb-dialog.component';
import { PuntoMuestreoDialog } from 'src/app/components/punto-muestreo-dialog/punto-muestreo-dialog.component';
import { DescripcionEtapaConstrucHabilitacionDialog } from 'src/app/components/descripcion-etapa-construc-habilitacion-dialog/descripcion-etapa-construc-habilitacion-dialog.component';
import { DescripcionMedioFisicoDialog } from 'src/app/components/descripcion-medio-fisico-dialog/descripcion-medio-fisico-dialog.component';
import { DescripcionMedioBiologicoDialog } from 'src/app/components/descripcion-medio-biologico-dialog/descripcion-medio-biologico-dialog.component';
import { DescripcionCaractSocEcoCulAntoDialog } from 'src/app/components/descripcion-caract-soc-eco-cul-anto-dialog/descripcion-caract-soc-eco-cul-anto-dialog.component';
import { CronogramaInversionProyectDialogComponent } from 'src/app/components/cronograma-inversion-proyect-dialog/cronograma-inversion-proyect-dialog.component';
import { LocalizacionGeograficaPoliticaProyectComponent } from 'src/app/components/localizacion-geografica-politica-proyect/LocalizacionGeograficaPoliticaProyectComponent';
import { DelimitacionPerimertoAreaDialogComponent } from 'src/app/components/delimitacion-perimerto-area-dialog/delimitacion-perimerto-area-dialog.component';
import { AreaInfluenciaDialogComponent } from 'src/app/components/area-influencia-dialog/area-influencia-dialog.component';
import { AntecedentesDialogComponent } from 'src/app/components/antecedentes-dialog/antecedentes-dialog.component';
import { ObjetivoJustificacionProyectDialogComponent } from 'src/app/components/objetivo-justificacion-proyect/objetivo-justificacion-proyect.component';
import { ResumenEjecutivoDialogComponent } from 'src/app/components/resumen-ejecutivo-dialog/resumen-ejecutivo-dialog.component';
import { ComponentesNoCerradosComponent } from 'src/app/modals/componentes-no-cerrados/componentes-no-cerrados.component';
import { EstudiosInvestigacionesComponent } from 'src/app/modals/estudios-investigaciones/estudios-investigaciones.component';
import { PermisosLicenciasComponent } from 'src/app/modals/permisos-licencias/permisos-licencias.component';
import { TupaAttachIconComponent } from 'src/app/components/attach-icon/attach-icon.component';
import { DistanciaPobladosCercanosComponent } from 'src/app/modals/distancia-poblados-cercanos/distancia-poblados-cercanos.component';
import { DocumentGridComponent } from 'src/app/components/document-grid/document-grid.component';
import { MineralExplotarComponent } from 'src/app/modals/mineral-explotar/mineral-explotar.component';
import { PlataformasPerforacionesComponent } from 'src/app/modals/plataformas-perforaciones/plataformas-perforaciones.component';
import { ComponentesProyectoComponent } from 'src/app/modals/componentes-proyecto/componentes-proyecto.component';
import { ResiduosComponent } from 'src/app/modals/residuos/residuos.component';
import { InsumosComponent } from 'src/app/modals/insumos/insumos.component';
import { EquiposModalComponent } from 'src/app/modals/equipos-modal/equipos-modal.component';
import { PuntosMonitoreoComponent } from 'src/app/modals/puntos-monitoreo/puntos-monitoreo.component';
import { ParametrosComponent } from 'src/app/modals/parametros/parametros.component';
import { EmpresaConsultoraComponent } from 'src/app/modals/empresa-consultora/empresa-consultora.component';
import { ProfesionalesConsultoraComponent } from 'src/app/modals/profesionales-consultora/profesionales-consultora.component';
import { OtrosProfesionalesConsultoraComponent } from 'src/app/modals/otros-profesionales-consultora/otros-profesionales-consultora.component';
import { PasivoLaboresInfraestructuraComponent } from 'src/app/modals/pasivo-labores-infraestructura/pasivo-labores-infraestructura.component';
import { CommentModalTableComponent } from 'src/app/modals/comment-modal-table/comment-modal-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MapDialogComponent } from 'src/app/components/map-dialog/map-dialog.component';
import { CoordinatesTableComponent } from 'src/app/pages/core/components/mapas/coordinates-table/coordinates-table.component';
import { FileSelectorComponent } from 'src/app/pages/core/components/mapas/file-selector/file-selector.component';
import { LayoutComponent } from 'src/app/pages/core/components/mapas/layout/layout.component';
import { MapOptionsComponent } from 'src/app/pages/core/components/mapas/map-options/map-options.component';
import { LegendComponent } from 'src/app/pages/core/components/mapas/legend/legend.component';
import { MapComponent } from 'src/app/pages/core/components/mapas/map/map.component';

const COMPONENTS = [
  ObjetivoJustificacionProyectDialogComponent,
  AntecedentesDialogComponent,
  ResumenEjecutivoDialogComponent,
  LocalizacionGeograficaPoliticaProyectComponent,
  DelimitacionPerimertoAreaDialogComponent,
  AreaInfluenciaDialogComponent,
  CronogramaInversionProyectDialogComponent,
  DescripcionEtapaConstrucHabilitacionDialog,
  DescripcionMedioFisicoDialog,
  DescripcionMedioBiologicoDialog,
  PuntoMuestreoDialog,
  DescripcionCaractSocEcoCulAntoDialog,
  ArqueologiaPatrimonioCulturalDialog,
  CartografiaDialog,
  ParticipacionCiudadanaDialog,
  DescripcionPosiblesImpactAmbDialog,
  PlanManejoDialog,
  PlanVigilanciaAmbientalDialogComponent,
  PlanMinimizacionManejoResiduoSolidoDialogComponent,
  PlanContingenciaDialogComponent,
  PlanRelacionamientoDialogComponent,
  PlanCierreActividadesDialogComponent,
  CuadroResumenContenidoAmbientalesDialogComponent,
  ConsultoraDialogComponent,
  PagoDialogComponent,
  MapDialogComponent
];

const MODALS = [
  DistanciaProyectoAreasNaturalesComponent,
  DescripcionEtapaContruccionComponent,
  RequerimientoAguaComponent,
  MaquinariaModalComponent,
  ViasAccesoExistentesComponent,
  ViasAccesoNuevaComponent,
  TipoManoObraComponent,
  FuenteAbastecimientoComponent,
  ParticipacionCiudadanaComponent,
  PlanManejoComponent,
  AreaSuperficialActivityComponent,
  CuadroResumenAmbientalComponent,
  ConfirmationDialogComponent,
  ComponentesNoCerradosComponent,
  EstudiosInvestigacionesComponent,
  PermisosLicenciasComponent,
  DistanciaPobladosCercanosComponent,
  MineralExplotarComponent,
  PlataformasPerforacionesComponent,
  ComponentesProyectoComponent,
  ResiduosComponent,
  InsumosComponent,
  EquiposModalComponent,
  PuntosMonitoreoComponent,
  ParametrosComponent,
  EmpresaConsultoraComponent,
  ProfesionalesConsultoraComponent,
  OtrosProfesionalesConsultoraComponent,
  PasivoLaboresInfraestructuraComponent,
  CommentModalTableComponent
];

@NgModule({
  declarations: [
    InicioComponent,
    DetalleTupaComponent,
    DetalleProcedimientoComponent,
    TupaAttachButtonComponent,
    TupaAttachIconComponent,
    COMPONENTS,
    MODALS,
    DocumentGridComponent,

    CoordinatesTableComponent,
    FileSelectorComponent,
    LayoutComponent,
    MapOptionsComponent,
    LegendComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    PublicoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CoreModule,
    SharedModule,
    QuillModule,
    MatDialogModule,
    StoreModule.forFeature('PublicoAppState', ROOT_REDUCER),
  ],
  providers: [
    MateriaUseCase,
    { provide: MateriaRepository, useClass: MateriaHttpRepository },
  ]
})
export class PublicoModule { }
