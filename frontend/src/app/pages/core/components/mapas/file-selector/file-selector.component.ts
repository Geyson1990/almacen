import { Component, Input, OnInit, inject } from '@angular/core';

@Component({
  selector: 'lots-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrl: './file-selector.component.scss'
})
export class FileSelectorComponent implements OnInit {
  @Input() actividad: number;

  // Variables para capturar respuesta de los servicios
  public csvFile: File | undefined;
  

  selectedValue: string = '';

  ngOnInit(): void {

  }

  onCsvSelected(event: any) {
    this.csvFile = event.target.files[0] as File;
    // this.fileService.setCsvFile(this.csvFile);
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;    
    // let idTipoArea = this.typesArea[selectElement.selectedIndex].idTipoArea
    // this.selectedValue = idTipoArea.toString();
    // this.valuesMapService.setIdActivityType(idTipoArea);
    // this.valuesMapService.setActivityType(this.selectedValue);
    // this.SetAreaTypeSelection(idTipoArea, this.typesArea);
  }

  // SetAreaTypeSelection(id, areas: AreaType[]) {
  //   if(id==="0") id = this.typesArea[0].idTipoArea;
    
  //   // this.mapValuesService.setAreaTypeSelection({
  //   //   idTipoArea: parseInt(id),
  //   //   areas: areas,
  //   //   descripcionTipoArea: areas.find(x=>x.idTipoArea === parseInt(id)).nombreActividad ?? ''
  //   // });
  // }
}
