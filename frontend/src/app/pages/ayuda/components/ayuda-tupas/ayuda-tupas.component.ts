import { Component, OnInit } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ayuda-tupas',
  templateUrl: './ayuda-tupas.component.html',
  styleUrls: ['./ayuda-tupas.component.css']
})
export class AyudaTupasComponent implements OnInit {
  listadoBase = [];
  listadoFiltro = [];
  listaSize=1;
  page = 1;
  pageSize = 10;
  filtrarTexto: string="";

  constructor(private TramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private route:Router) { }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.funcionesMtcService.mostrarCargando();
    this.TramiteService.getListaTupas().subscribe(
      (resp: any) => {
        console.log(resp);
        this.funcionesMtcService.ocultarCargando();
        this.listadoBase = resp;
        this.listadoFiltro = resp;
        this.listaSize = resp.length;
      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar los procedimientos');
        this.funcionesMtcService.ocultarCargando();
      }
    );
  }

  onChangeFilter(){    
    if (this.filtrarTexto !== ""){
      this.listadoFiltro = this.listadoBase.filter(x => x.denominacion.toLowerCase().includes(this.filtrarTexto.toLowerCase())
        || x.codTupa.toLowerCase().includes(this.filtrarTexto.toLowerCase()) ); 
      this.listaSize = this.listadoFiltro.length;
    }else{
      this.listadoFiltro = this.listadoBase;
      this.listaSize = this.listadoBase.length;
    }   
  }

  refreshLista(pagination: PaginationModel) {    
  }

}
