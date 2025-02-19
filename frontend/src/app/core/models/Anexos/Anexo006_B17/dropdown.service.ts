import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  constructor(private http: HttpClient) {}
    getNewsletter() {
        return [
          { valor: 's', desc: 'Obtención' },
          { valor: 'n', desc: 'Canje' }
        ];
      }
    
      getNewsletter1() {
        return [
          { valor: '1', desc: 'AI' },
          { valor: '2', desc: 'AIIa' },
          { valor: '3', desc: 'AIIb' },
          { valor: '4', desc: 'AIIIa' },
          { valor: '5', desc: 'AIIIb' },
          { valor: '6', desc: 'AIIIc' }
        ];
      }

      getNewsletter2() {
        return [
          { valor: 's', desc: 'Si' },
          { valor: 'n', desc: 'No' }
        ];
      }


      getNewsletter3() {
        return [
          { valor: '0', desc: 'Seleccione' },
          { valor: '1', desc: 'O negativo' },
          { valor: '2', desc: 'O positivo' },
          { valor: '3', desc: 'A negativo' },
          { valor: '4', desc: 'A positivo' },
          { valor: '5', desc: 'B negativo' },
          { valor: '6', desc: 'B positivo' },
          { valor: '7', desc: 'AB negativo' },
          { valor: '8', desc: 'AB positivo' }
        ];
      }

    
}