import { Component, Input, OnInit, inject } from '@angular/core';
import { FilesService } from '../../../../../core/services/mapas/files.service';
import { DataService } from '../../../../../core/services/mapas/data.service';
import { Response } from '../../../../../core/models/Mapas/response.interface';
import { AreaType, AreaTypeSelection } from '../../../../../core/models/Mapas/data.interface';
import { MapValueService } from '../../../../../core/services/mapas/map-values.service';

@Component({
  selector: 'lots-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrl: './file-selector.component.scss'
})
export class FileSelectorComponent implements OnInit {
  @Input() actividad: number;

  // Variables para capturar respuesta de los servicios
  public csvFile: File | undefined;
  public typesArea: AreaType[] = [];

  //Servicios para deteccion de cambios de variables de mapa
  private mapValuesService = inject(MapValueService);

  // inyeccion files
  private fileService = inject(FilesService);

  // inyeccion de dependencia http
  private dataService = inject(DataService);

  // Inyeccion de servicios para elementos
  private valuesMapService = inject(MapValueService);

  selectedValue: string = '';

  ngOnInit(): void {
    this.dataService.getAreaType(1).subscribe((response: Response) => {

      this.typesArea = response.data as AreaType[];
      this.selectedValue = this.actividad.toString();
      this.SetAreaTypeSelection(this.selectedValue, this.typesArea);
    })
  }

  onCsvSelected(event: any) {
    this.csvFile = event.target.files[0] as File;
    this.fileService.setCsvFile(this.csvFile);
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;    
    let idTipoArea = this.typesArea[selectElement.selectedIndex].idTipoArea
    this.selectedValue = idTipoArea.toString();
    // this.valuesMapService.setIdActivityType(idTipoArea);
    // this.valuesMapService.setActivityType(this.selectedValue);
    this.SetAreaTypeSelection(idTipoArea, this.typesArea);
  }

  SetAreaTypeSelection(id, areas: AreaType[]) {
    if(id==="0") id = this.typesArea[0].idTipoArea;
    
    this.mapValuesService.setAreaTypeSelection({
      idTipoArea: parseInt(id),
      areas: areas,
      descripcionTipoArea: areas.find(x=>x.idTipoArea === parseInt(id)).nombreActividad ?? ''
    });
  }
}
