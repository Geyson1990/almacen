import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
/* import { InMemoryDbService } from 'angular-in-memory-web-api'; */


///////////////////////////////////////////////////////7
/*

@Injectable({
  providedIn: 'root'
})
export class DocIdentidadService {
_url="http://localhost:1768/api/User"

  constructor(
    private http: HttpClient
  ) {
    console.log("Servicio DocIdentidad");
   }
   getDocIdentidad(){
      let header=new HttpHeaders()
      .set('Type-content','aplication/json')

      return this.http.get(this._url,{
        headers:header
      });

   }   
//Fin 
}
*/

export enum getDocIdentidad{
  'DNI'=1,
  'CID'=2,
  'CI/TI'=3,
  'CE'=4,
  'CSTR'=5,
  'Otros'=6
}


/*
export const getDocIdentidad=[
  {item:'01', text:'DNI'},
  {item:'02', text:'CID'},
  {item:'03', text:'CI/TI'},
  {item:'04', text:'CE'},
  {item:'05', text:'CSTR'},
  {item:'06', text:'Otros'},
];
*/

/*
@Injectable({
  providedIn: 'root',
})
export class getDocIdentidad implements InMemoryDbService {
  createDb() {
    const DocIdentidad = [
      { item: '01', text: 'DNI' },
      { item: '02', text: 'CID' },
      { item: '03', text: 'CI/TI' },
      { item: '04', text: 'CE' },
      { item: '05', text: 'CSTR' },
      { item: '06', text: 'Otros' }
    ];
    return {DocIdentidad};
  }
}
*/
