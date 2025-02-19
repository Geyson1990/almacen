import { Component, Input, OnInit, inject } from '@angular/core';
import { AreaTypeSelection, NearbyTown } from '../../core/models/Mapas/data.interface';
import { DataService } from '../../core/services/mapas/data.service';
//import { Response } from '../../core/models/Mapas/response.interface';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapValueService } from '../../core/services/mapas/map-values.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AreaActividadMinera, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'lots-register-page',
  templateUrl: './map-dialog.component.html',
  styleUrl: './map-dialog.component.scss',
  animations: [
    trigger('slideOutAnimation', [
      state('normal', style({

        opacity: 1
      })),
      state('hidden', style({
        transform: 'translateX(-100%) translateY(-50%)',
        opacity: 0
      })),
      state('hiddenToogle', style({
        transform: 'translateX(-450px) translateY(-50%)',
        opacity: 1
      })),
      transition('normal <=> hidden', animate('300ms ease-out')),
      transition('normal <=> hiddenToogle', animate('300ms ease-out')),
    ])
  ],
})

export class MapDialogComponent implements OnInit {
  @Input() title!: string;
  @Input() tipo!: number;
  @Input() id!: number;
  @Input() edicion: AreaActividadMinera;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() codMaeRequisito: number;

  activeModal = inject(NgbActiveModal);
  //loading
  public isLoading: boolean = false;
  public nearbyTown: NearbyTown[] = [] as NearbyTown[];
  public nearby: NearbyTown = {} as NearbyTown;

  // animaciones
  public drawerState = 'normal';
  public toogleState = 'normal';

  // inyeccion de dependencias
  private dataService = inject(DataService);
  private mapValuesService = inject(MapValueService);
  areas: AreaActividadMinera[] = [];

  //Variables obtenidas por los componentes de formulario
  vUtm: string = '';
  vFondo: string = '';
  vElementos: string = '';
  vIdTipoActividad: number = 0;
  vTipoActividad: string = '';
  vDescripcionArea: string = '';
  vEsEdicion: boolean = false;
  //vCoordenadas: number[][] = [];
  vCoordenadas: [number, number][] = [];
  data: FormularioSolicitudDIA;

  constructor(
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

    //#region ViewOnly
    get viewOnly() { return this.modoVisualizacion; }

    get viewControl() { return !this.modoVisualizacion; }
  
    //#endregion ViewOnly

  ngOnInit(): void {
    let idEstudio = this.idEstudio;
    this.dataService.getLocationNearbyTown(idEstudio).subscribe((response) => {
      this.nearbyTown = response.data as NearbyTown[];
      this.nearby = this.nearbyTown[0];
    });

    this.mapValuesService.getIsLoading().subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });

    this.getData();
    if (this.edicion) {
      this.vDescripcionArea = this.edicion.Descripcion;
      this.vIdTipoActividad = this.edicion.IdActividad;
      this.vTipoActividad = this.edicion.Actividad;
      this.vCoordenadas = this.edicion.Coordenadas;
      this.vUtm = this.edicion.Zona;
      this.vEsEdicion = true;
    }
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.areas = this.data.DescripcionProyecto.Delimitacion.AreasActividadMinera;
        // this.patchFormValues(this.data);
      }
    });

    //const tramite = localStorage.getItem('tramite-selected');
    //const tramiteObj = JSON.parse(tramite);
    //this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }


  public toggleDrawer(): void {
    this.drawerState = this.drawerState === 'hidden' ? 'normal' : 'hidden';
    this.toogleState = this.toogleState === 'hiddenToogle' ? 'normal' : 'hiddenToogle';
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  save() {
    this.mapValuesService.getUTMZone().subscribe((param: string) => { this.vUtm = param; });
    this.mapValuesService.getDescriptionArea().subscribe((param: string) => { this.vDescripcionArea = param; });
    this.mapValuesService.getAreaTypeSelection().subscribe((param: AreaTypeSelection) => {
      this.vIdTipoActividad = param.idTipoArea;
      this.vTipoActividad = param.descripcionTipoArea;
    });
    this.mapValuesService.getPolygonLatLngs().subscribe({
      next: (latLngs) => { this.vCoordenadas = latLngs; },
      error: (error) => { console.error("Error al obtener las coordenadas:", error); }
    });
    const objeto: AreaActividadMinera = {
      Id: this.id,
      Zona: this.vUtm,
      Datum: "Datum",
      IdActividad: this.vIdTipoActividad,
      Actividad: this.vTipoActividad,
      Descripcion: this.vDescripcionArea,
      Estado: "",
      Validacion: this.vCoordenadas.length > 0 ? "ÁREA VÁLIDA" : "ÁREA NO VÁLIDA",
      Coordenadas: this.vCoordenadas
    };

    switch (this.tipo) {
      case 1: {
        if (this.edicion) this.areas = this.areas.filter(x => x.Id != this.id);
        this.areas.push(objeto);
        this.setNestedArrayProperty(this.data, ['DescripcionProyecto', 'Delimitacion', 'AreasActividadMinera'], this.areas);
        break;
      }
      case 2: {
        if (this.edicion) this.areas = this.areas.filter(x => x.Id != this.id);
        this.areas.push(objeto);
        this.setNestedArrayProperty(this.data, ['DescripcionProyecto', 'Delimitacion', 'AreasUsoMinero'], this.areas);
        break;
      }
      case 3: {
        if (this.edicion) this.areas = this.areas.filter(x => x.Id != this.id);
        this.areas.push(objeto);
        this.setNestedArrayProperty(this.data, ['DescripcionProyecto', 'AreasInfluencia', 'AreaDirectaAmbiental'], this.areas);
        break;
      }
      case 4: {
        if (this.edicion) this.areas = this.areas.filter(x => x.Id != this.id);
        this.areas.push(objeto);
        this.setNestedArrayProperty(this.data, ['DescripcionProyecto', 'AreasInfluencia', 'AreaIndirectaAmbiental'], this.areas);
        break;
      }
      case 5: {
        if (this.edicion) this.areas = this.areas.filter(x => x.Id != this.id);
        this.areas.push(objeto);
        this.setNestedArrayProperty(this.data, ['DescripcionProyecto', 'AreasInfluencia', 'AreaDirectaSocial'], this.areas);
        break;
      }
      case 6: {
        if (this.edicion) this.areas = this.areas.filter(x => x.Id != this.id);
        this.areas.push(objeto);
        this.setNestedArrayProperty(this.data, ['DescripcionProyecto', 'AreasInfluencia', 'AreaIndirectaSocial'], this.areas);
        break;
      }
    }
    this.GuardarJson(this.data);
  }

  capturarValor(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.mapValuesService.setDescriptionArea(inputElement.value);
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el formulario').then(() => this.activeModal.close(objeto));
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  // Función para asegurar que todas las propiedades existen y asignar el valor
  private setNestedArrayProperty(obj: any, path: string[], value: any[]) {
    let current = obj;

    // Iteramos sobre todas las propiedades del camino excepto la última
    for (let i = 0; i < path.length - 1; i++) {
      const property = path[i];

      // Si la propiedad no existe, la inicializamos como un objeto vacío
      if (!current[property]) {
        current[property] = {};
      }
      current = current[property];
    }

    // Asignamos el valor al último nivel de la propiedad
    current[path[path.length - 1]] = value;
  }

}