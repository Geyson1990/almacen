import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  constructor(private http: HttpClient) {}
    getTipoClaseA() {
      return [
        { valor: '1', desc: 'Física' },
        { valor: '2', desc: 'Electrónica' },
      ];
    }
  
    getTipoCanjeMilitar() {
      return [
        { valor: '1', desc: 'I' },
        { valor: '2', desc: 'IIa' },
        { valor: '3', desc: 'IIb' },
        { valor: '4', desc: 'IIIa' },
        { valor: '5', desc: 'IIIb' },
        { valor: '6', desc: 'IIIc' }
      ];
    }

    getTiposCanjeExtranjero() {
      return [
        { valor: '1', desc: 'I' },
        { valor: '2', desc: 'IIa' },
        { valor: '3', desc: 'IIb' },
        { valor: '4', desc: 'IIIa' },
        { valor: '5', desc: 'IIIb' },
        { valor: '6', desc: 'IIIc' }
      ];
    }

    getTipoCanjeDiplomatico() {
      return [
        { valor: '1', desc: 'Obtención Diplomático' },
      ];
    }

    getTiposModificacion() {
      return [
        { valor: '1', desc: 'I' },
        { valor: '2', desc: 'IIa' },
        { valor: '3', desc: 'IIb' },
        { valor: '4', desc: 'IIIa' },
        { valor: '5', desc: 'IIIb' },
        { valor: '6', desc: 'IIIc' }
      ];
    }
}