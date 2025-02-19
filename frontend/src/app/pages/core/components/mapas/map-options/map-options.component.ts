import { Component, OnInit, inject } from '@angular/core';
import { MapValueService } from '../../../../../core/services/mapas/map-values.service';

@Component({
  selector: 'lots-map-options',
  templateUrl: './map-options.component.html',
  styleUrl: './map-options.component.scss'
})
export class MapOptionsComponent implements OnInit{

  //Servicios para deteccion de cambios de variables de mapa
  private mapValuesService = inject(MapValueService);

  // Variables del servicio mapValuesService
  public UTMZone: string = "19";  
  public coordinateEastNorth: string = "";

  public setLayer(): void{
    this.mapValuesService.setMapVisible(true);
  }

  public removeLayer(): void{
    this.mapValuesService.setMapVisible(false);
  }

  ngOnInit(): void {
    this.mapValuesService.setUTMZone(this.UTMZone);

    this.mapValuesService.getCoordinateEastNorth().subscribe((coordinateEastNorth) => {
      this.coordinateEastNorth = coordinateEastNorth;
    });
  }

  public setUTMZone(event: MouseEvent): void{
    const target = event.target as HTMLInputElement;
    this.UTMZone =  target.value;

    this.mapValuesService.setUTMZone(this.UTMZone);
  }

  public showVertices(event: MouseEvent): void{
    const isChecked = (event.target as HTMLInputElement).checked;
    this.mapValuesService.setVerticesVisible(isChecked);
  }

  public showLabels(event: MouseEvent): void{
    const isChecked = (event.target as HTMLInputElement).checked;
    this.mapValuesService.setLabelsVisible(isChecked);
  }

}
