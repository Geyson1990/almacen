import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncidenciaRequestModel } from 'src/app/core/models/Tramite/IncidenciaRequestModel';
import { ValidaVoucherResponseModel } from 'src/app/core/models/Tramite/ValidaVoucherResponseModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
