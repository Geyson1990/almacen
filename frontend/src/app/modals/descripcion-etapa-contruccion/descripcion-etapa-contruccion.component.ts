import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-descripcion-etapa-contruccion',
  templateUrl: './descripcion-etapa-contruccion.component.html',
  styleUrl: './descripcion-etapa-contruccion.component.scss'
})
export class DescripcionEtapaContruccionComponent {
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  selectedClasificacion: string = '';
  selectedTipoResiduos: string = '';
  selectedResiduos: string = '';

  constructor() { }

  closeDialog() {
    this.activeModal.dismiss();
  }
}
