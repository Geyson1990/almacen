import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-area-superficial-activity',
  templateUrl: './area-superficial-activity.component.html',
  styleUrl: './area-superficial-activity.component.scss'
})
export class AreaSuperficialActivityComponent {
  selectedMecanismo: string = '';
  selectedUMT: string = '';
  selectedLibre: string = '';
  selectedEtiqueta: string = '';
  activeModal = inject(NgbActiveModal);

  @Input() title!: string;
  tableColumns2191: TableColumn[] = [
    { header: 'Nro', field: 'nro', },
    { header: 'Este', field: 'est', },
    { header: 'Norte', field: 'nor', },
  ];

  tableData2191: TableRow[] = [
    {
      nro: { text: '1' },
      est: { text: '' },
      nor: { text: '' },
    },
    {
      nro: { text: '2' },
      est: { text: '' },
      nor: { text: '' },
    },
    {
      nro: { text: '3' },
      est: { text: '' },
      nor: { text: '' },
    },
  ]

  closeDialog() {
    this.activeModal.dismiss();
  }
}
