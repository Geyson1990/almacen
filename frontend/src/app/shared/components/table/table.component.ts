import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableColumn, TableRow } from './interfaces/table.interface';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'tupa-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TupaTableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: FormArray;
  @Input() legend?: number;
  @Input() message?: string;

  constructor() { }

  ngOnInit(): void {
    this.message = this.message || 'Sin información registrada.';
  }
}
