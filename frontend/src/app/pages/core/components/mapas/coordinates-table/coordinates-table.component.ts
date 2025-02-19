import { Component, inject, ViewChildren, ElementRef, QueryList, OnInit, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, Input } from '@angular/core';
import { MapValueService } from '../../../../../core/services/mapas/map-values.service';

@Component({
  selector: 'lots-coordinates-table',
  templateUrl: './coordinates-table.component.html',
  styleUrl: './coordinates-table.component.scss'
})
export class CoordinatesTableComponent implements OnInit, AfterViewInit {

  @Input() coordenadas: [number, number][] = [];
  @Input() esEdicion: boolean = false;
  // Elementios html 
  @ViewChildren('input') inputs!: QueryList<ElementRef>;


  //public 
  public countArrayInputs: number[] = [1, 2, 3];

  // Atributos propios del componente
  public polygonLatLngs: [number, number][] = [];

  // Inyeccion de servicios para elementos
  private valuesMapService = inject(MapValueService);

  // Variables para capturar datos del servicio map ValueService
  private CsvPolygonLatLngs: [number, number][] = [];

  public latitude: string = "";
  public longitude: string = "";
  urlAdministrado: string = '';
  UTMZone: string = '';
  DescriptionArea: string = '';
  ActivityType: string = '';
  IdActivityType: number = 0;
  coordinatesArray: [number, number][] = [];

  constructor(private cdr: ChangeDetectorRef) {
    //this.urlAdministrado = ''//`${environment.baseUrlAdministrado}`;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    if(this.esEdicion){
      this.valuesMapService.setCsvPolygonLatLngs(this.coordenadas);
    }

    this.valuesMapService.getCsvPolygonLatLngs()
      .subscribe((CsvPolygonLatLngs) => {
        console.log(CsvPolygonLatLngs);
        if (CsvPolygonLatLngs.length !== 0) {
          this.CsvPolygonLatLngs = CsvPolygonLatLngs;
          this.countArrayInputs = [];
          for (let i = 0; i < this.CsvPolygonLatLngs.length; i++) {
            this.countArrayInputs.push(i + 1);

          }
          this.cdr.detectChanges();
          const inputsArray = this.inputs.toArray();



          this.CsvPolygonLatLngs.forEach((input, index) => {

            inputsArray[index * 2].nativeElement.value = input[0].toString();
            inputsArray[index * 2 + 1].nativeElement.value = input[1].toString();

            //input.nativeElement.value = this.CsvPolygonLatLngs[index][0].toString();
            //inputsArray[index + 1].nativeElement.value = this.CsvPolygonLatLngs[index][1].toString();


          });

        }

      });

    // window.addEventListener('message', this.recibirMensajeDelPadre.bind(this));

  }


  public generateInputs(coordinates: number[]) {
  }

  public setCoordinate(idInput1: string, idInput2: string): void {

    this.polygonLatLngs = [];
    const inputsArray = this.inputs.toArray(); // Convertimos QueryList a un array

    inputsArray.forEach((input, index) => {
      if (index % 2 === 0) {
        const latitude = parseFloat(input.nativeElement.value);
        const longitude = parseFloat(inputsArray[index + 1].nativeElement.value);
        this.polygonLatLngs.push([latitude, longitude]);
      }
    });

    this.polygonLatLngs = this.polygonLatLngs.filter(subArray => !this.containsNaN(subArray));
    console.log(this.polygonLatLngs);
    this.captureAllInputs();
    // this.valuesMapService.setPolygonLatLngs(this.polygonLatLngs);

    /*

        const doubleLengthArray = new Array(this.countArrayInputs.length * 2);

    if(this.polygonLatLngs.length === 0 ){
      const latitude = parseFloat((document.getElementById(idInput1) as HTMLInputElement).value);
      const longitude = parseFloat((document.getElementById(idInput2) as HTMLInputElement).value);
      this.polygonLatLngs.push([latitude, longitude]);
      console.log(this.polygonLatLngs);
    }else{

    }
    doubleLengthArray.forEach((_, index) => {
      // Aquí puedes acceder a cada elemento según su índice
      
      if(index % 2 == 0){
        const input1 = document.getElementById((index-1).toString()) as HTMLInputElement;
        const input2  = document.getElementById(index.toString()) as HTMLInputElement;
        const latitude = parseFloat(input1.value);
        const longitude = parseFloat(input2.value);
        this.polygonLatLngs.push([latitude, longitude]);

      }
    });
*/
    /*
    const input1 = document.getElementById(idInput1) as HTMLInputElement;
    const input2 = document.getElementById(idInput2) as HTMLInputElement;
    const latitude = parseFloat(input1.value);
    const longitude = parseFloat(input2.value);

    this.polygonLatLngs.push([latitude, longitude]);

    this.valuesMapService.setPolygonLatLngs(this.polygonLatLngs);
*/
  }


  public addInputs(): void {
    const lastValue = this.countArrayInputs[this.countArrayInputs.length - 1];
    this.countArrayInputs.push(lastValue + 1);
  }

  public removeInputs(): void {

    if (this.countArrayInputs.length <= 3) return;
    this.countArrayInputs.pop();
  }

  public containsNaN(array: number[]) {
    return array.some(isNaN);
  }

  public deleteRow(index: number) {
    this.countArrayInputs.splice(index, 1);
  }

  captureAllInputs() {
    this.coordinatesArray = [];
    const inputValues = this.inputs.toArray().map(input => parseFloat(input.nativeElement.value) || 0);
    for (let i = 0; i < inputValues.length; i += 2) {
      //this.coordinatesArray.push([inputValues[i], inputValues[i + 1]]);
      const latLng: [number, number] = [inputValues[i], inputValues[i + 1]];
      this.coordinatesArray.push(latLng);
    }

    this.valuesMapService.setPolygonLatLngs(this.coordinatesArray);
  }
}
