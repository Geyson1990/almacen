import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ver-producto',
  templateUrl: './ver-producto.component.html',
  styleUrl: './ver-producto.component.scss'
})
export class VerProductoComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() item: any;
  @Input() tipoMovimiento: string = '';

  nombreTipoMovimiento: string = '';

  constructor() { }

  ngOnInit(): void { 
    this.fnObtenerDatos();
  }

  closeDialog() {
    this.activeModal.close();
  }

  fnObtenerDatos(){
    if(this.tipoMovimiento === "Ingreso")
      this.nombreTipoMovimiento = this.item.tipoEntrada;
    else
      this.nombreTipoMovimiento = this.item.tipoSalida;
  }

}
