import { Component, OnInit, ChangeDetectionStrategy, inject, AfterViewInit } from '@angular/core';
import { Map, LayerGroup, tileLayer, geoJSON, circleMarker, layerGroup, control, Control } from 'leaflet';

import { MapValueService } from '../../../../../core/services/mapas/map-values.service';
//import wellknown from 'wellknown';
import * as wellknown from 'wellknown';
import { MapGeometryService } from '../../../../../core/services/mapas/map-geometry.service';
import { FilesService } from '../../../../../core/services/mapas/files.service';
import { Legend } from '../../../../../core/models/Mapas/data.interface';
import { Response } from '../../../../../core/models/Mapas/response.interface';
import { ActivatedRoute } from '@angular/router';

import { GeometryGeneral, Polygon, PolygonArea, PolygonMiningLawSend } from '../../../../../core/models/Mapas/map-geometry.interface';
import { tap } from 'rxjs';
import proj4 from 'proj4'
import { SeguridadService } from 'src/app/core/services/seguridad.service';
//import * as proj4 from 'proj4';
//import { GlobalService } from '../../services/global.service';

declare var L: any;
//declare var Lg:any;

@Component({
  selector: 'lots-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  public isLoading = false;

  // Valores inicializados para el mapa
  public map!: Map;
  private layerGroups: { [key: string]: LayerGroup } = {};
  private overlayControl: Control | undefined = undefined;
  public circleMarkersGroup: LayerGroup = layerGroup();
  public polygonGroup: LayerGroup = layerGroup();
  public legendGroup: Legend[] = [];


  // Variables del servicio mapValuesService
  public polygonLatLngs: [number, number][] = [];
  public mapVisible: boolean = true;
  public UTMZone: string = "19";
  public labelsVisible: boolean = false;

  //Servicios para deteccion de cambios de variables para elementos de mapa
  private mapValuesService = inject(MapValueService);

  // inyeccion http
  private mapGeometryService = inject(MapGeometryService);

  // inyeccion files
  private fileService = inject(FilesService);

  // valores Observavle FileService
  public csvFile: File | undefined;

  // PARAMETROS DEL ROUTER 
  // public study: number   = 0;//9261;
  // public client:number   = 0;//431;
  // public study: number   = 9261;
  // public client:number   = 431;

  //CONSTRUCTOR
  constructor(private seguridadService: SeguridadService) { }

  ngOnInit(): void {
    //this.latLngToEastNorth(-12.93379440581003,-68.79519867250377, 19);
    //window.addEventListener('message', this.recibirMensajeDelPadre.bind(this));

    setTimeout(() => {
      // INICIALIZANDO EL MAPA 
      this.map = new Map('map', {
        zoomControl: false
      }).setView([-11.575834, -77.265470], 6);

      const mapTileLayer = tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      });
      this.map.addLayer(mapTileLayer);


      this.mapValuesService.getMapVisible().subscribe((mapVisible) => {
        this.mapVisible = mapVisible;
        this.mapVisible === false ? this.map.removeLayer(mapTileLayer) : this.map.addLayer(mapTileLayer);

      })

      // INYECCION SERVICIOS DE VALORES OBSERVABLES

      // Poligono manual
      this.mapValuesService.getPolygonLatLngs().subscribe((polygonLatLngs) => {
        this.polygonLatLngs = polygonLatLngs;

        this.setCircleMarkers();
      });

      // Zona UTM
      this.mapValuesService.getUTMZone().subscribe((UTMZone) => {
        this.UTMZone = UTMZone;
      });



      this.fileService.getCsvFile().subscribe((csvFile) => {


        if (this.overlayControl !== undefined) {
          this.map.removeControl(this.overlayControl);
          this.circleMarkersGroup.clearLayers();
          this.polygonGroup.clearLayers();
          Object.keys(this.layerGroups).forEach(key => {
            const layerGroup = this.layerGroups[key];
            layerGroup.clearLayers();
          });
          this.layerGroups = {};
          this.legendGroup = [];
        }

        this.csvFile = csvFile;
        if(csvFile !== undefined){
          const csvBlob: Blob = new Blob([this.csvFile!], { type: 'text/csv' });
          const formData = new FormData();
  
          formData.append('file', csvBlob);
          formData.append('zonaUTM', this.UTMZone);
  
          this.mapGeometryService.uploadCsvCoordinates(formData).subscribe((response: Response) => {
  
  
            const polygon = response.data as Polygon;
            console.log(response);
            const wktPolygon = polygon.geometryWKT;
  
            const coordinates = this.wktPolygonToCoordinates(wktPolygon);
            const geoJSONPolygon = wellknown.parse(wktPolygon);
  
  
  
            coordinates.forEach(coordinate => {
              circleMarker(coordinate, { radius: 5 }).addTo(this.circleMarkersGroup);
            });
  
  
            geoJSON(geoJSONPolygon, {
              style: function (feature) {
                return {
                  color: 'red',
                  fillColor: '#FAB1DD'
                };
              }
            }).addTo(this.polygonGroup);
  
            this.map.addLayer(this.polygonGroup);
  
            this.mapValuesService.setCsvPolygonLatLngs(polygon.coordenadas!);
            //this.circleMarkers(polygon.coordenadas!);
            this.executeGetPolygonsMiningLaw(wktPolygon);
  
  
          })
        }
        
      });

      // INYECCION HTTP

      let idEstudio = Number(localStorage.getItem('estudio-id'));

      this.mapGeometryService.getPolygonsAreaProyect(idEstudio, 2).subscribe((response: Response) => {

        const polygons = response.data as PolygonArea[];
        polygons.forEach((polygon: PolygonArea) => {
          const wktPolygon = polygon.geometryWKT;
          const geoJSONPolygon = wellknown.parse(wktPolygon);
          geoJSON(geoJSONPolygon, {
            style: function (feature) {
              return {
                color: 'red',
                fillColor: '#FAB1DD'
              };
            }
          }).addTo(this.map);
        });
      });

    }, 500);

  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.map.on('mousemove', (event) => {


        const coordinateEastNorth =
          this.latLngToEastNorth(event.latlng.lat, event.latlng.lng, parseInt(this.UTMZone));
        const coordinateFixed = coordinateEastNorth.map(num => num.toFixed(3));
  
        // Unir los elementos del array en un string separados por comas
        const coordinateString = coordinateFixed.join(',');
  
        // Luego, setear el valor con setCoordinateEastNorth
        this.mapValuesService.setCoordinateEastNorth(coordinateString);
  
  
      });
      this.mapValuesService.getVerticesVisible().subscribe((verticesVisible) => {
  
        if (verticesVisible) {
          this.map.addLayer(this.circleMarkersGroup);
        } else {
          this.map.removeLayer(this.circleMarkersGroup);
        }
      })
  
      this.mapValuesService.getLabelsVisible().subscribe((labelsVisible) => {
        this.labelsVisible = labelsVisible;
  
        if (this.labelsVisible) {
  
          Object.keys(this.layerGroups).forEach(key => {
            const layerGroup = this.layerGroups[key];
            layerGroup.eachLayer(layer => {
              const tooltip = layer.getTooltip();
              if (tooltip) {
                tooltip.options.opacity = 1;
                layer.openTooltip(); // Actualizar el tooltip
              }
            });
          });
        } else {
          Object.keys(this.layerGroups).forEach(key => {
            const layerGroup = this.layerGroups[key];
            layerGroup.eachLayer(layer => {
              const tooltip = layer.getTooltip();
              if (tooltip) {
                tooltip.options.opacity = 0;
                layer.closeTooltip(); // Actualizar el tooltip
              }
            });
          });
        }
      })
    }, 1000);

    

  }



  public setCircleMarkers(): void {
    if (this.polygonLatLngs.length > 0) {
      const formData = new FormData();
      formData.append('zonaUTM', this.UTMZone);
      // Añadir zona UTM al FormData
      this.polygonLatLngs.forEach((coordenada, index) => {
        formData.append(`coordenadasEN[${index}].este`, coordenada[0].toString());
        formData.append(`coordenadasEN[${index}].norte`, coordenada[1].toString());

      });
      

      this.mapGeometryService.uploadCoordinatesManual(formData).subscribe((response) => {
        const polygon = response.data as Polygon;
        const wktPolygon = polygon.geometryWKT;
        const geoJSONPolygon = wellknown.parse(wktPolygon);

        geoJSON(geoJSONPolygon, {
          style: function (feature) {
            return {
              color: 'red',
              fillColor: '#FAB1DD'
            };
          }
        }).addTo(this.map);
        this.executeGetPolygonsMiningLaw(wktPolygon);
      });
    }
  }

  public executeGetPolygonsMiningLaw(wktPolygon: string) {
    let idEstudio = Number(localStorage.getItem('estudio-id'));
    let idCliente = Number(this.seguridadService.getIdCliente());

    this.mapValuesService.setisLoading(true);
    const polygonMininLaw: PolygonMiningLawSend = {
      idCliente: idCliente,
      idEstudio: idEstudio,
      idPoligono: 2,
      flgArea: 0,
      geometryWKT: wktPolygon,
      idZona: parseInt(this.UTMZone),
      idDatum: 2
    }

    this.mapGeometryService.getPolygonsMiningLaw(polygonMininLaw)
      .pipe(
        tap({
          complete: () => {
            this.mapValuesService.setisLoading(false);
          }
        })
      )
      .subscribe((response: Response) => {

        const geometries: GeometryGeneral[] = response.data as GeometryGeneral[];

        geometries.forEach((geometry: GeometryGeneral) => {
          if (!this.layerGroups[geometry.capa]) {

            this.layerGroups[geometry.capa] = layerGroup();
            const legendGroup: Legend = {
              capa: geometry.capa !== null ? geometry.capa : null,
              color: geometry.color !== null ? geometry.color : null,
              contornoColor: geometry.contornoColor !== null ? geometry.contornoColor : null,
              geometry: geometry.geometryWKT !== null ? geometry.geometryWKT.substring(0, geometry.geometryWKT.indexOf('(')).trim() : null
            }
            this.legendGroup.push(legendGroup);
          }

          const wktGeometry = geometry.geometryWKT;

          let geoJSONGeometry;

          try {
            geoJSONGeometry = wellknown.parse(wktGeometry); // Intentar parsear la geometría WKT a GeoJSON
          } catch (error) {
            console.error(`Error parsing WKT for geometry with ID ${geometry.idObjeto}:`, error);
            return;
          }

          const polygonStyle = {
            color: geometry.contornoColor !== null ? geometry.contornoColor : 'gray',      // Color del borde
            weight: 2,                // Grosor del borde
            fillColor: geometry.color,
            fillOpacity: 0.5,
            dashArray: geometry.contornoEstilo === 'dash' ? '5,10' : ''      // Opacidad del fondo
          };

          // Añadir el GeoJSON al grupo de capas con el estilo aplicado
          //geoJSON(geoJSONGeometry).addTo(this.map);
          this.layerGroups[geometry.capa].addLayer(geoJSON(geoJSONGeometry, {
            style: function (feature) {
              return polygonStyle;
            }
          })
            .bindTooltip(geometry.nombreObjeto, {

              // Clase CSS personalizada para el tooltip
              permanent: true, // Mostrar la etiqueta permanentemente
              direction: 'right', // Dirección de la etiqueta (top, bottom, left, right)
              opacity: 1 // Opacidad de la etiqueta
            }));


        });

        this.mapValuesService.setLegendGroup(this.legendGroup);
        this.overlayControl = control.layers(undefined, this.layerGroups, {
          collapsed: false
        });

        this.overlayControl.addTo(this.map);


      })
  }

  public circleMarkers(polygonLatLngs: [number, number][]): void {
    polygonLatLngs.forEach(coordinate => {
      circleMarker(coordinate, { radius: 5 }).addTo(this.circleMarkersGroup);
    });
    this.map.addLayer(this.circleMarkersGroup);
  }


  public wktPolygonToCoordinates(polygonWKT: string): [number, number][] {
    const cleanWKT = polygonWKT.replace(/^POLYGON\s*\(\(\(?/, '').replace(/\)\)\)?$/, '');
    const pairs = cleanWKT.split(', ').map(pair => pair.split(' '));
    const points = pairs.map(pair => L.latLng(parseFloat(pair[1]), parseFloat(pair[0])));
    return points;
  }


  public latLngToEastNorth(lat: number, lng: number, utmZone: number) {
    // Definir el sistema de coordenadas de UTM según la zona especificada
    const utmDef = `+proj=utm +zone=${utmZone} +datum=WGS84 +units=m +no_defs`;

    // Convertir latitud y longitud a UTM
    const utmCoords = proj4(utmDef, [lng, lat]);

    return utmCoords;
    /*
    console.log(utmCoords);
    // Convertir UTM a Este y Norte (EPSG:3857 para Leaflet)
    const eastNorth = proj4('EPSG:3857', utmCoords);
    console.log(eastNorth);
    // Crear un objeto Point de Leaflet
    return L.point(eastNorth[0], eastNorth[1]);
    */
  }

  public latlngtest() {
    // import('proj4').then(proj4 => {
    //   // Usar proj4 aquí
    //   proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    // proj4.defs('EPSG:32619', '+proj=utm +zone=19 +datum=WGS84 +units=m +no_defs');
    // });
    proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    proj4.defs('EPSG:32619', '+proj=utm +zone=19 +datum=WGS84 +units=m +no_defs');
    

    const lon = -68.79519867250377;
    const lat = -12.93379440581003;

    // Convertir a UTM (Este y Norte)
    const utmCoordinates = proj4('EPSG:4326', 'EPSG:32619', [lon, lat]);

    // Obtener las coordenadas Este y Norte
    const este = utmCoordinates[0];
    const norte = utmCoordinates[1];

    console.log('Coordenadas UTM (Este, Norte):', este, norte);
  }

  // recibirMensajeDelPadre(event: MessageEvent) {
  //   // if (event.origin !== 'http://localhost:4200') {
  //   //   return;
  //   // }
  //   const data = event.data;
  //   console.log('Mensaje recibido del Proyecto Principal:', event.data);

  //   this.client = parseInt((data.split('|')[0]) ?? '0');
  //   this.study =  parseInt((data.split('|')[1]) ?? '0');
  // }



}
