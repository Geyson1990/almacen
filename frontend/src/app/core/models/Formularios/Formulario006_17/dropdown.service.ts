import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  constructor(private http: HttpClient) {}
    getTiposServicio() {
      return [
        { valor: '1', desc: 'Obtención' },
        { valor: '2', desc: 'Revalidación' },
        { valor: '3', desc: 'Expedición' },
        { valor: '4', desc: 'Duplicado' }
      ];
    }
  
    getTipoasCanje() {
      return [
        { valor: '1', desc: 'Diplomático' },
        { valor: '2', desc: 'Expedida en otro país' },
        { valor: '3', desc: 'Modificación de la Información' },
        { valor: '4', desc: 'Militar o Policial' },
        { valor: '5', desc: 'Extranjero Especial' }
      ];
    }

    getTiposLicencia() {
      return [
        { valor: '1', desc: 'A-I' },
        { valor: '2', desc: 'A-IIa' },
        { valor: '3', desc: 'A-IIb' },
        { valor: '4', desc: 'A-IIIa' },
        { valor: '5', desc: 'A-IIIb' },
        { valor: '6', desc: 'A-IIIc' },
        { valor: '7', desc: 'Licencia de Categoría Especial' }
      ];
    }
}