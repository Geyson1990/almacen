import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeguridadService } from '../../../core/services/seguridad.service';

declare function startSignature(port: string, param: string): void;

@Component({
  selector: 'app-firma-peru',
  templateUrl: './firma-peru.component.html',
  styleUrls: ['./firma-peru.component.css'],
})
export class FirmaPeruComponent implements OnInit {
  @Output() firmaInicia = new EventEmitter();
  @Output() firmaCompleta = new EventEmitter();
  @Output() firmaCancela = new EventEmitter();

  localPort: string;
  paramsFirmaProfesional: string;

  constructor(private _seguridadService: SeguridadService) {
    this.localPort = `${environment.endPoint.firmaPeru.puertoServidorLocal}`;
    this.paramsFirmaProfesional = `${environment.baseUrlAPI}${environment.endPoint.firmaPeru.obtenerParamFirmaProfesional}`;
  }

  ngOnInit(): void {
    window.addEventListener('signatureInit', (e) => this.firmaIniciada());
    window.addEventListener('signatureOk', (e) => this.firmaCompletada());
    window.addEventListener('signatureCancel', (e) => this.firmaCancelada());
  }

  private firmaIniciada(): void {
    this.firmaInicia.emit(null);
  }

  private firmaCompletada(): void {
    this.firmaCompleta.emit(null);
  }

  private firmaCancelada(): void {
    this.firmaCancela.emit(null);
  }

  // Iniciar el proceso de firma electrónica para profesionales asignados
  iniciarFirmaProfesional(idEncodeEncrypt: string): void {
    const paramObj = {
      param_url: `${this.paramsFirmaProfesional}?idencrypt=${idEncodeEncrypt}`,
      param_token: this._seguridadService.getToken(),
      document_extension: 'pdf',
    };

    console.log(paramObj);

    const param = btoa(JSON.stringify(paramObj));
    const port = this.localPort;

    // FUNCIÓN DE INICIO DE FIRMA DIGITAL
    startSignature(port, param);
  }
}
