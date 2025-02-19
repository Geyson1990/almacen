import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn, TableRow } from '../table/interfaces/table.interface';

@Component({
  selector: 'tupa-table-multiple',
  templateUrl: './table-multiple.component.html',
  styleUrls: ['./table-multiple.component.scss']
})
export class TupaTableMultipleComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: TableRow[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
