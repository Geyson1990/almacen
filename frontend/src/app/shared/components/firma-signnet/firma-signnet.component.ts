/**
 * Componente de firma SignNet
 * @author André Bernabé Pérez
 * @version 1.0 26.08.2022
 */

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioFirmaRequestModel } from 'src/app/core/models/SignNet/ServicioFirmaRequestModel';
import { ServicioFirmaResponseModel } from 'src/app/core/models/SignNet/ServicioFirmaResponseModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-firma-signnet',
  templateUrl: './firma-signnet.component.html',
  styleUrls: ['./firma-signnet.component.css']
})
export class FirmaSignnetComponent implements OnInit {
  @ViewChild('dvIframe') dvIframe: TemplateRef<any>;

  @Output() response = new EventEmitter<ServicioFirmaResponseModel>();

  urlServicioFirma: string;
  rutaOrigen: string;
  rutaDestino: string;
  nombreArchivos: string;
  // Parametro para mostrar el panel de Descripcion(razon, ubicaci&oacute;n,etc.) en el MicroServicio: 0-Si, 1-No
  activarDescripcion = '1';
  posicionFirma = 'SI';
  ubicacionPagina = 'PP';
  // Parametro para firmar en una pagina Especifica, se debe especificar Ubicacion Pagina en NP
  numeroPagina = '1';
  estiloFirma = 'D';
  altoRubrica = '50';
  anchoRubrica = '150';
  // Parametro para aplicar una Imagen en el estampado, se debe especificar el nombre de la Imagen: 0-Si, 1-No
  aplicarImagen = '1';
  rutaImagen = '';
  imagen = '';
  // Parametro para Filtrar los certificados con el Numero de DNI que se envie
  alias = '';
  session = '';
  // Parametro para crear un estampado con detalles alternativos: 0-Si, 1-No
  usarPersonalizado = '1';
  cargo = '';
  ubicacion = '';
  razon = 'Soy revisor del documento';
  comentario = '';
  // Parametro para Aplicar una firma invisible a documentos PDF, 0-Invisible, 1-Visible
  invisible = '1';
  // Parametro para ubicar el estampado en donde se encuentre el TAG especificado, se debe especificar Posicion de Firma TA
  nombreTag = '';
  // Parametro para elegir el Formato de Firma: 1-PAdES, 2-XAdES, 3-CAdES
  tipoFirma = '1';
  // Parametro que permite activar el visor para firma: 1-Inactivo, 0-Activo
  visor = '1';
  // Parametro para Firmar documentos en Servidor o escoger en cliente, 0-Cliente, 1-Servidor
  listarArchivos = '1';
  // Parametro para elegir Tipo de Firma CAdES, A-Attached, D-Detached
  tipoCades = 'A';
  nomarch = '';
  // Parametro para Especificar el tamaño de fuente de la descripcion de Firma
  tamanoFuente = '';
  // Parametro para firmar por Coordenadas, se debe especificar Posicion de Firma CO
  coordenadas = '';
  extra1 = '';

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    window.addEventListener('message', (e) => this.recibeRespuestaSignNet(e.data));
  }

  recibeRespuestaSignNet(respuestaJson: string): void {
    this.modalService.dismissAll();
    console.log('respuestaJson: ', respuestaJson);
    try {
      const rptJSON: ServicioFirmaResponseModel = JSON.parse(respuestaJson);
      this.response.emit(rptJSON);
    } catch (error) {
      console.log(error);
    }
  }

  setParametros(params: ServicioFirmaRequestModel): void {
    this.urlServicioFirma = params.urlServicioFirma;
    this.rutaOrigen = params.rutaOrigen;
    this.rutaDestino = params.rutaDestino;
    this.nombreArchivos = params.nombreArchivos;

    if (params.activarDescripcion) { this.activarDescripcion = params.activarDescripcion; }
    if (params.posicionFirma) { this.posicionFirma = params.posicionFirma; }
    if (params.ubicacionPagina) { this.ubicacionPagina = params.ubicacionPagina; }
    if (params.numeroPagina) { this.numeroPagina = params.numeroPagina; }
    if (params.estiloFirma) { this.estiloFirma = params.estiloFirma; }
    if (params.altoRubrica) { this.altoRubrica = params.altoRubrica; }
    if (params.anchoRubrica) { this.anchoRubrica = params.anchoRubrica; }
    if (params.aplicarImagen) { this.aplicarImagen = params.aplicarImagen; }
    if (params.rutaImagen) { this.rutaImagen = params.rutaImagen; }
    if (params.imagen) { this.imagen = params.imagen; }
    if (params.alias) { this.alias = params.alias; }
    if (params.usarPersonalizado) { this.usarPersonalizado = params.usarPersonalizado; }
    if (params.cargo) { this.cargo = params.cargo; }
    if (params.ubicacion) { this.ubicacion = params.ubicacion; }
    if (params.razon) { this.razon = params.razon; }
    if (params.comentario) { this.comentario = params.comentario; }
    if (params.invisible) { this.invisible = params.invisible; }
    if (params.nombreTag) { this.nombreTag = params.nombreTag; }
    if (params.tipoFirma) { this.tipoFirma = params.tipoFirma; }
    if (params.visor) { this.visor = params.visor; }
    if (params.listarArchivos) { this.listarArchivos = params.listarArchivos; }
    if (params.tipoCades) { this.tipoCades = params.tipoCades; }
    if (params.nomarch) { this.nomarch = params.nomarch; }
    if (params.tamanoFuente) { this.tamanoFuente = params.tamanoFuente; }
    if (params.coordenadas) { this.coordenadas = params.coordenadas; }
    if (params.extra1) { this.extra1 = params.extra1; }
  }

  firmarDocumento(): void {
    if (!this.urlServicioFirma || !this.rutaOrigen || !this.rutaDestino || !this.nombreArchivos) {
      throw new Error('Primero configure los parámetros, llamando al método setParametros()');
    }

    // create a form for the post request
    const form = window.document.createElement('form');
    form.setAttribute('id', 'ssoForm');
    form.setAttribute('name', 'ssoForm');
    form.setAttribute('method', 'post');
    form.setAttribute('type', 'POST');
    form.setAttribute('action', this.urlServicioFirma);
    form.setAttribute('accept-charset', 'ISO-8859-1');
    // use _self to redirect in same tab, _blank to open in new tab
    // form.setAttribute('target', '_blank');
    form.setAttribute('target', 'iframeFirma');

    this.rutaOrigen = this.rutaOrigen.replace(/\\/g, '@');
    this.rutaDestino = this.rutaDestino.replace(/\\/g, '@');

    // Add all the data to be posted as Hidden elements
    form.appendChild(this.createHiddenElement('alias', this.alias));
    form.appendChild(this.createHiddenElement('usarPersonalizado', this.usarPersonalizado));
    form.appendChild(this.createHiddenElement('cargo', this.cargo));
    form.appendChild(this.createHiddenElement('ubicacion', this.ubicacion));
    form.appendChild(this.createHiddenElement('razon', this.razon));
    form.appendChild(this.createHiddenElement('comentario', this.comentario));
    form.appendChild(this.createHiddenElement('rutaOrigen', this.rutaOrigen));
    form.appendChild(this.createHiddenElement('rutaDestino', this.rutaDestino));
    form.appendChild(this.createHiddenElement('nombreArchivos', this.nombreArchivos));
    form.appendChild(this.createHiddenElement('rutaImagen', this.rutaImagen));
    form.appendChild(this.createHiddenElement('imagen', this.imagen));
    form.appendChild(this.createHiddenElement('invisible', this.invisible));
    form.appendChild(this.createHiddenElement('activarDescripcion', this.activarDescripcion));
    form.appendChild(this.createHiddenElement('posicionFirma', this.posicionFirma));
    form.appendChild(this.createHiddenElement('nombreTag', this.nombreTag));
    form.appendChild(this.createHiddenElement('ubicacionPagina', this.ubicacionPagina));
    form.appendChild(this.createHiddenElement('numeroPagina', this.numeroPagina));
    form.appendChild(this.createHiddenElement('estiloFirma', this.estiloFirma));
    form.appendChild(this.createHiddenElement('altoRubrica', this.altoRubrica));
    form.appendChild(this.createHiddenElement('anchoRubrica', this.anchoRubrica));
    form.appendChild(this.createHiddenElement('aplicarImagen', this.aplicarImagen));
    form.appendChild(this.createHiddenElement('tipoFirma', this.tipoFirma));
    form.appendChild(this.createHiddenElement('visor', this.visor));

    form.appendChild(this.createHiddenElement('listarArchivos', this.listarArchivos));
    form.appendChild(this.createHiddenElement('tipoCades', this.tipoCades));
    form.appendChild(this.createHiddenElement('nomarch', this.nomarch));
    form.appendChild(this.createHiddenElement('tamanoFuente', this.tamanoFuente));
    form.appendChild(this.createHiddenElement('coordenadas', this.coordenadas));
    form.appendChild(this.createHiddenElement('extra1', this.extra1));

    console.log('form: ', form);
    window.document.body.appendChild(form);

    this.modalService.open(this.dvIframe, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    form.submit();
  }

  // create the form
  private createHiddenElement(name: string, value: string): HTMLInputElement {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('id', name);
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    hiddenField.setAttribute('type', 'hidden');
    return hiddenField;
  }
}
