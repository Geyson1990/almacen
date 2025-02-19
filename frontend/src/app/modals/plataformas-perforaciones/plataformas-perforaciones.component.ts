import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FuenteAgua } from 'src/app/core/models/Externos/FuenteAgua';
import { FormularioSolicitudDIA, Mineral, PlataformasPerforaciones } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-plataformas-perforaciones',
  templateUrl: './plataformas-perforaciones.component.html',
  styleUrl: './plataformas-perforaciones.component.scss'
})
export class PlataformasPerforacionesComponent implements OnInit{
  headersParameters: TableColumn[] = [];
  dataTablaParameters: TableRow[] = [];
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string; 
  @Input() id: number;
  @Input() edicion: PlataformasPerforaciones;
  @Input() modoVisualizacion: boolean;
  listaFuente: FuenteAgua[] = [];
  descripcionFuenteAgua: string = '';
  plataformaTouched = false;
  esteTouched = false;
  norteTouched = false;
  cotaTouched = false;

  constructor(private builder: FormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }
  
 

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    this.loadListas();
    this.habilitarControles();
    this.loadTableHeaders();
  }
  private loadTableHeaders() {
    this.headersParameters = [
      { header: 'SOLDAJE *', field: 'Id', },
      { header: 'INCLINACIÓN *', field: 'Nombre', },
      { header: 'AZIMUT *', field: 'Tipo', },
      { header: 'PROFUNDIDAD (m) *', field: 'Subtipo', },
      { header: 'METODO DE OBTURACIÓN *', field: 'Este', },
      { header: 'N° POZAS DE SEDIMENTACIÓN *', field: 'Norte', },
      { header: 'TOTAL DE TOPSOIL A REMOVER (m3) *', field: 'Zona', minWidth: '180px' },
      { header: 'ASPECTOS TECNICOS DE LAS ACTIVIDADES A DESARROLLAR Y METODO DE CONSTRUCCIÓN *', field: 'Datum', minWidth: '230px' },
      { header: 'AGREGAR', field: 'agregar', hidden: this.modoVisualizacion },
    ];
  }
  //#region ViewOnly
  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      if(this.form !== undefined)
        Object.keys(this.form.controls).forEach(controlName => {
          const control = this.form.get(controlName);
          control?.disable();
        });
    }
  }
  //#endregion ViewOnly

  private buildForm(): void{
    this.form = this.builder.group({
      Plataforma: [null, Validators.required],
      Este: [null, Validators.required],
      Norte: [null, Validators.required],
      Largo: [null],
      Ancho: [null],
      Profundidad: [null],
      Cota: [null, Validators.required],
      Distancia: [null],
      FuenteAgua: [''],
      NumeroSondaje: [null],
    });
    this.subscribeToValueChanges();
  }

  get plataforma() {
    return this.form.get('Plataforma') as FormControl;
  }

  get plataformaErrors() {
    if (this.plataforma.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get este() {
    return this.form.get('Este') as FormControl;
  }

  get esteErrors() {
    if (this.este.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get norte() {
    return this.form.get('Norte') as FormControl;
  }

  get norteErrors() {
    if (this.norte.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get cota() {
    return this.form.get('Cota') as FormControl;
  }

  get cotaErrors() {
    if (this.cota.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }  

  private subscribeToValueChanges(): void {
    this.form.get('FuenteAgua')?.valueChanges.subscribe(value => this.updateFuenteAguaDescripcion(value));
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionFuenteAgua = this.edicion.DescripcionFuenteAgua;
    }
  }

  updateFuenteAguaDescripcion(value: string) {
    const selectedRecurso = this.listaFuente.find(item => item.idFuenteAbastecimiento === parseInt(value));
    this.descripcionFuenteAgua = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  save(form:FormGroup){
    if (form.valid) {
      const datos: PlataformasPerforaciones = {
        ...form.value,
        Id: this.id,
        DescripcionFuenteAgua: this.descripcionFuenteAgua
      };
  
      this.activeModal.close(datos);
    }
    
  }
  
  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboFuenteAgua().subscribe(response => this.listaFuente = response);    
  }

  private comboFuenteAgua(): Observable<FuenteAgua[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getFuenteAgua().pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); 
    this.form.get(campo)?.setValue(value);
  }
}
