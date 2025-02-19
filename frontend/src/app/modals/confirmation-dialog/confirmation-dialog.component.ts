import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  activeModal = inject(NgbActiveModal);
  @Input() description!: string;
  constructor() { }

  closeDialog() {
    this.activeModal.dismiss();
  }
}
