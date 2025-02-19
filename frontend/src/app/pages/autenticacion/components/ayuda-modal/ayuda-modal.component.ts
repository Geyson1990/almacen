import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ayuda-modal',
  templateUrl: './ayuda-modal.component.html',
  styleUrls: ['./ayuda-modal.component.css']
})
export class AyudaModalComponent {
  @Input() nameImg;

  constructor(public activeModal: NgbActiveModal) { }
}
