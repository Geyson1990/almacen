import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
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
    { header: 'Acción', field: 'accion', },
  ];

  tableData2191: TableRow[] = [
    {
      nro: { text: '1' },
      est: { text: '' },
      nor: { text: '' },
      accion: { buttonIcon: 'delete' },
    },
    {
      nro: { text: '2' },
      est: { text: '' },
      nor: { text: '' },
      accion: { buttonIcon: 'delete'},
    },
    {
      nro: { text: '3' },
      est: { text: '' },
      nor: { text: '' },
      accion: { buttonIcon: 'delete' },
    },
  ]

  constructor(private seguridadService: SeguridadService,){}

  idCliente:number=0;
  idEstudio:number=0;

  iframeSrc:string='';
  mensajeDesdeIframe: string = '';

  ngOnInit() {
    // Escuchar mensajes desde el iframe
    debugger;
    this.idCliente = Number(this.seguridadService.getIdCliente());
    this.idEstudio = Number(localStorage.getItem('estudio-id'));
    
    window.addEventListener('message', this.recibirMensajeDelIframe.bind(this));

    setTimeout(() => {
      this.enviarMensajeAlIframe(this.idCliente.toString() ?? '0' +'|'+ this.idEstudio.toString() ?? '0');
    }, 1000);
  }

  fnGuardar(){
    let jsonString: string = 'Envio desde Guardar - String'
    const iframe = document.getElementById('iframeProyectoSecundario') as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(jsonString, 'http://localhost:50585');
  }

  recibirMensajeDelIframe(event: MessageEvent) {
    // Verificar la fuente del mensaje para mayor seguridad
    debugger;
    if (event.origin !== this.iframeSrc) {
      return;
    }

    debugger;
    debugger;
    debugger;
    //Recibir datos para GUARDAR
    // Mostrar el mensaje recibido del iframe    
    this.mensajeDesdeIframe = event.data;
  }

  enviarMensajeAlIframe(mensaje: string) {
    // Enviar un mensaje al iframe
    const iframe = document.getElementById('iframeProyectoSecundario') as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(mensaje, 'http://localhost:50585');
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  
}
