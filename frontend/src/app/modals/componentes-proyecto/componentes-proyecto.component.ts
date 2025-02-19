import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentesProyecto, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs';
import { TipoComponente } from 'src/app/core/models/Externos/TipoComponente';

@Component({
  selector: 'app-componentes-proyecto',
  templateUrl: './componentes-proyecto.component.html',
  styleUrl: './componentes-proyecto.component.scss'
})
export class ComponentesProyectoComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: ComponentesProyecto;
  @Input() modoVisualizacion: boolean;

  listaTipoComponente: TipoComponente[] = [];
  descripcionPrincipal: string = '';
  largoM: number = 0;
  anchoM: number = 0;
  area: number = 0;
  volumen: number = 0;
  constructor(private builder: FormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

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

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
    this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      Principal: ['', Validators.required],
      Largo: [null, Validators.required],
      Ancho: [null, Validators.required],
      Profundidad: [null, Validators.required],
      Cantidad: [null, Validators.required],
      Area: [null],
      Volumen: [null],
      TopSoil: [null],
      Actividades: [null, Validators.required],
    });
    this.subscribeToValueChanges();
  }

  get principal() {
    return this.form.get('Principal') as FormControl;
  }

  get principalErrors() {
    if (this.principal.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get largo() {
    return this.form.get('Largo') as FormControl;
  }

  get largoErrors() {
    if (this.largo.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get ancho() {
    return this.form.get('Ancho') as FormControl;
  }

  get anchoErrors() {
    if (this.ancho.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get profundidad() {
    return this.form.get('Profundidad') as FormControl;
  }

  get profundidadErrors() {
    if (this.profundidad.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  
  get cantidad() {
    return this.form.get('Cantidad') as FormControl;
  }

  get cantidadErrors() {
    if (this.cantidad.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get actividades() {
    return this.form.get('Actividades') as FormControl;
  }

  get actividadesErrors() {
    if (this.actividades.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  private subscribeToValueChanges(): void {
    this.form.get('Principal')?.valueChanges.subscribe(value => this.updateDescripcionPrincipal(value));
  }

  updateDescripcionPrincipal(value: string) {
    const selectedTipo = this.listaTipoComponente.find(item => item.idTipoComponente === parseInt(value));
    this.descripcionPrincipal = selectedTipo ? selectedTipo.descripcion : '';
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.id = this.edicion.Id;
      this.descripcionPrincipal = this.edicion.DescripcionPrincipal;
    }
  }

  save(form: FormGroup) {
    if (form.valid) {
      const datos: ComponentesProyecto = {
        ...form.value,
        Id: this.id,
        DescripcionPrincipal: this.descripcionPrincipal
      };
  
      this.activeModal.close(datos);
    }
   
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboTipoComponente().subscribe(response => this.listaTipoComponente = response);
  }
  
  private comboTipoComponente(): Observable<TipoComponente[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getTipoComponente().pipe(
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
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }

  calcularArea(){        
    const largoControl = this.form.get('Largo').value;
    const anchoControl = this.form.get('Ancho').value;
    const cantidadControl = this.form.get('Cantidad').value;
   
    if((largoControl=='' || largoControl==0) || (anchoControl=='' || anchoControl==0)){
      this.form.get('Area').setValue('');
      return false;
    }

    this.largoM = Number(largoControl);
    this.anchoM = Number(anchoControl);
    if(cantidadControl>0){
      this.area = (this.largoM * this.anchoM)*cantidadControl; 
      this.form.get('Area').setValue(this.area);
    }else{
      this.area = this.largoM * this.anchoM; 
      this.form.get('Area').setValue(this.area);
    }     
  }

  calcularVolumen(){        
    const largoControl = this.form.get('Largo').value;
    const anchoControl = this.form.get('Ancho').value;
    const profundidadControl = this.form.get('Profundidad').value;
    const cantidadControl = this.form.get('Cantidad').value;
    if((largoControl=='' || largoControl==0) || (anchoControl=='' || anchoControl==0)){
      this.form.get('Volumen').setValue('');
      return false;
    }

    if(profundidadControl=='' || profundidadControl==0){
      this.form.get('Volumen').setValue('');
      return false;
    }
  
    this.largoM = Number(largoControl);
    this.anchoM = Number(anchoControl);
    if(cantidadControl>0){
      this.volumen = (this.largoM * this.anchoM * profundidadControl)*cantidadControl; 
      this.form.get('Volumen').setValue(this.volumen);
    }else{
      this.volumen = (this.largoM * this.anchoM * profundidadControl) 
      this.form.get('Volumen').setValue(this.volumen);
    }      
  }
}
