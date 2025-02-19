import { Injectable } from '@angular/core';
//Agregado para consumir el Api (Gustavo Villarroel)
import {HttpClient, HttpHeaders} from '@angular/common/http'
///////////////////////////////////////////////////////7
@Injectable({
  providedIn: 'root'
})
export class PersonaService {
//Agregado para consumir el Api (Gustavo Villarroel)
_url="http://localhost:1768/api/User"
///////////////////////////////////////////////////////7
  constructor(
    //Agregado para consumir api (Gustavo Villarroel)
    private http: HttpClient
    //////////////////////////////////////////////
  ) {

    console.log("Servicio Persona");
   }
//Agregado para el consumir el Api (Gustavo Villarroel)
   getPersonas(){
      let header=new HttpHeaders()
      .set('Type-content','aplication/json')

      return this.http.get(this._url,{
        headers:header
      });

   }
////////////////////////////////////////////////////////
}
