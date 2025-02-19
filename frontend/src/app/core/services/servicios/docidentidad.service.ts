/*import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import {HttpClient, HttpHeaders} from '@angular/common/http'
*/

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

export const getDocIdentidad=[
      { value: '01', text: 'DNI' },
      { value: '02', text: 'CID' },
      { value: '03', text: 'CI/TI' },
      { value: '04', text: 'CE' },
      { value: '05', text: 'CSTR' },
      { value: '06', text: 'RUC' },
      { value: '07', text: 'Otros' }
];

/*
@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: '01', text: 'DNI' },
      { id: '02', text: 'CID' },
      { id: '03', text: 'CI/TI' },
      { id: '04', text: 'CE' },
      { id: '05', text: 'CSTR' },
      { id: '06', text: 'Otros' }
    ];
    return {heroes};
  };
*/
