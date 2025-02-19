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
         
         { valor: '0', desc: 'Seleccione' },
         
         { valor: '27', desc: 'Alférez' },
         { valor: '18', desc: 'Alférez de Fragata' },
         { valor: '10', desc: 'Almirante' },
         
         { valor: '7', desc: 'Capitán' },
         { valor: '15', desc: 'Capitán de Corbeta' },
         { valor: '14', desc: 'Capitán de Fragata' },
         { valor: '13', desc: 'Capitán de Navío' },
          
         { valor: '4', desc: 'Coronel' },
         { valor: '23', desc: 'Comandante' },
         { valor: '12', desc: 'Contraalmirante' },
         // { valor: '22', desc: 'Coronel' },         
         // { valor: '25', desc: 'Capitán' },
         { valor: '19', desc: 'General del Aire' },  
         { valor: '3', desc: 'General de Brigada' },
         { valor: '2', desc: 'General de División' },
         { valor: '1', desc: 'General del Ejército' },
         { valor: '6', desc: 'Mayor' }, 
         { valor: '21', desc: 'Mayor General' },        
        //  { valor: '24', desc: 'Mayor' },   
         { valor: '9', desc: 'Sub-Teniente o Alférez' },
         { valor: '8', desc: 'Teniente' },
         { valor: '5', desc: 'Teniente Coronel' },          
         { valor: '20', desc: 'Teniente General' },
         { valor: '16', desc: 'Teniente Primero' },
         { valor: '17', desc: 'Teniente Segundo' },
          //{ valor: '26', desc: 'Teniente' },
         // { valor: '28', desc: 'Teniente General' }, 
         { valor: '11', desc: 'Vicealmirante' }
                
         
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