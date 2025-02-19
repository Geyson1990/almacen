import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { SelectItemModel } from 'src/app/core/models/SelectItemModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';

@Component({
  selector: 'app-ubigeo',
  templateUrl: './ubigeo.component.html',
  styleUrls: ['./ubigeo.component.css']
})
export class UbigeoComponent implements OnInit {

  listaDepartamento: SelectItemModel[];
  listaProvincia: SelectItemModel[];
  listaDistrito: SelectItemModel[];

  @Input() parentForm: FormGroup;

  @Input() depaFormControlName: string;
  @Input() provFormControlName: string;
  @Input() distFormControlName: string;

  @Input() depaFormLabel = 'Departamento';
  @Input() provFormLabel = 'Provincia';
  @Input() distFormLabel = 'Distrito';

  @Input() depaPlaceHolder = 'Seleccione un departamento';
  @Input() provPlaceHolder = 'Seleccione una provincia';
  @Input() distPlaceHolder = 'Seleccione un distrito';

  @Input() horizontal = false;
  @Input() readOnly = false;


  constructor(
    private funcionesMtcService: FuncionesMtcService,
    private ubigeoService: UbigeoService,
  ) { }

  get depaFormControl(): FormControl { return this.parentForm.get(this.depaFormControlName) as FormControl; }
  get provFormControl(): FormControl { return this.parentForm.get(this.provFormControlName) as FormControl; }
  get distFormControl(): FormControl { return this.parentForm.get(this.distFormControlName) as FormControl; }

  async ngOnInit(): Promise<void> {
    this.depaFormControl.reset('', { emitEvent: false });
    this.listaDepartamento = [];
    await this.poblarDepartamentos();

    this.onChangeDepartamento();
    this.onChangeProvincia();
  }
  
  onChangeDepartamento(): void {
    this.depaFormControl.valueChanges.subscribe((idDepa: string) => {
      this.provFormControl.reset('');
      if (idDepa?.length > 0) {
        this.poblarProvincias(idDepa);
      } else {
        this.listaProvincia = [];
      }
    });
  }

  onChangeProvincia(): void {
    this.provFormControl.valueChanges.subscribe((idProv: string) => {
      this.distFormControl.reset('');
      if (idProv?.length > 0) {
        const idDepa = this.depaFormControl.value;
        this.poblarDistritos(idDepa, idProv);
      } else {
        this.listaDistrito = [];
      }
    });
  }

  async poblarDepartamentos(): Promise<void> {
    try {
      const response = await this.ubigeoService.departamento().toPromise();
      this.listaDepartamento = response;
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los departamentos');
    }
  }

  async poblarProvincias(idDepa: string): Promise<void> {
    if (isNaN(Number(idDepa))) {
      return;
    }
    const idDep = Number(idDepa);
    try {
      const response = await this.ubigeoService.provincia(idDep).toPromise();
      this.listaProvincia = response;
      console.log(response);
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener las provincias');
    }
  }

  async poblarDistritos(idDepa: string, idProv: string): Promise<void> {
    if (isNaN(Number(idDepa)) || isNaN(Number(idProv))) {
      return;
    }
    const idDep = Number(idDepa);
    const idPro = Number(idProv);
    try {
      const response = await this.ubigeoService.distrito(idDep, idPro).toPromise();
      this.listaDistrito = response;
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los distritos');
    }
  }

  async setUbigeoByText(departamento: string, provincia: string, distrito: string): Promise<void> {
    // this.depaFormControl.reset('', { emitEvent: false });
    // this.listaDepartamento = [];
    // await this.poblarDepartamentos();
    const depValue = this.listaDepartamento?.find(r =>
      this.formatStringToCompare(r.text) === this.formatStringToCompare(departamento)
    )?.value ?? '';
    this.depaFormControl.setValue(depValue, { emitEvent: false });

    this.provFormControl.reset('', { emitEvent: false });
    this.listaProvincia = [];
    await this.poblarProvincias(depValue);
    const proValue = this.listaProvincia?.find(r =>
      this.formatStringToCompare(r.text) === this.formatStringToCompare(provincia)
    )?.value ?? '';
    this.provFormControl.setValue(proValue, { emitEvent: false });

    this.distFormControl.reset('', { emitEvent: false });
    this.listaDistrito = [];
    await this.poblarDistritos(depValue, proValue);
    const disValue = this.listaDistrito?.find(r =>
      this.formatStringToCompare(r.text) === this.formatStringToCompare(distrito)
    )?.value ?? '';
    this.distFormControl.setValue(disValue, { emitEvent: false });
  }

  getDepartamentoText(): string {
    const depValue = this.depaFormControl?.value ?? '';
    const depText = this.listaDepartamento?.find(r => r.value === depValue)?.text ?? '';

    return this.formatStringToCompare(depText);
  }

  getProvinciaText(): string {
    const proValue = this.provFormControl?.value ?? '';
    const proText = this.listaProvincia?.find(r => r.value === proValue)?.text ?? '';

    return this.formatStringToCompare(proText);
  }

  getDistritoText(): string {
    const disValue = this.distFormControl?.value ?? '';
    const disText = this.listaDistrito?.find(r => r.value === disValue)?.text ?? '';

    return this.formatStringToCompare(disText);
  }

  private formatStringToCompare(value: string): string {
    return value?.trim()?.toUpperCase()?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '') ?? '';
  }

  isRequiredDepa(): boolean {
    if (!this.depaFormControl?.validator) {
      return false;
    }

    const validator = this.depaFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }

  isRequiredProv(): boolean {
    if (!this.provFormControl?.validator) {
      return false;
    }

    const validator = this.provFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }

  isRequiredDist(): boolean {
    if (!this.distFormControl?.validator) {
      return false;
    }

    const validator = this.distFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }
}
