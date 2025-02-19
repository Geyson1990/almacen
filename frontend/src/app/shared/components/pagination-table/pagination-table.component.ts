import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/Pagination';

@Component({
  selector: 'app-pagination-table',
  templateUrl: './pagination-table.component.html',
  styleUrls: ['./pagination-table.component.css']
})
export class PaginationTableComponent implements OnInit {

  @Input() page: number;
  @Input() pageSize: number;
  @Input() totalRegistros: number;
  @Output() changePagination = new EventEmitter<PaginationModel>();


  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.emit();
    });
  }

  changePaginationEmit(): void {
    this.emit();
  }

  changePaginationEmitSelect(): void {
    this.page = 1;
    this.emit();
  }

  emit(): void {
    this.changePagination.emit({ page: this.page, pageSize: this.pageSize } as PaginationModel);
  }

}
