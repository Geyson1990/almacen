import { Component, Input, OnInit } from '@angular/core';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';

@Component({
  selector: 'app-anexo001-abcdnt',
  templateUrl: './anexo001-abcdnt.component.html',
  styleUrls: ['./anexo001-abcdnt.component.css']
})
export class Anexo001AbcdntComponent implements OnInit {
  @Input() public dataInput: any;
  @Input() fileFormLabel = '';
  
  modalidadServicio:string="";
  modalidadServicioOtro:string="";

  anexoA:boolean=false;
  anexoB:boolean=false;
  anexoC:boolean=false;
  anexoD:boolean=false;

  constructor(
    private formularioTramiteService: FormularioTramiteService
  ) { 
    
  }

  ngOnInit(): void {
    
  }
  async ngAfterViewInit(): Promise<void> {
    const dataForm: any =await this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).toPromise();
    //this.funcionesMtcService.ocultarCargando();

    const metaDataForm: any = JSON.parse(dataForm.metaData);
    const seccion1 = metaDataForm.seccion1;
    
    this.modalidadServicio = seccion1.modalidadServicio;
    this.modalidadServicioOtro = seccion1.modalidadOtroServicio;

    switch(this.modalidadServicioOtro){
      case 'ayudaMeteorologiaFija': 
      case 'bandaCiuFija' : 
      case 'fijoAero' :
      case 'radioNavAeroFijo': this.anexoA=true;
                               break;
      
      case 'bandaCiuMov':
      case 'movMarSat':
      case 'radioNavAeroMovil':
      case 'radioMar':  this.anexoB=true;
                        break;
      case 'enlaceFijoMicro':
      case 'efmAnalogico':
      case 'efmUniAnalogico':
      case 'efmUniDigital':
      case 'emmAnalogico':
      case 'emmDigital':
      case 'emmUniAnalogico':
      case 'emmUniDigital': this.anexoC=true;
                            break;
      case 'ayudaMeteorologiaSat':
      case 'expTierraSatelite':
      case 'metsat':
      case 'movSat':
      case 'movSatEnlAux':  this.anexoD=true;
                            break;                       
    }
    
    console.log(this.modalidadServicio);
  }

}
