import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Response } from "../../../core/models/Mapas/response.interface";
import { catchError, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {
    
    private http = inject(HttpClient);
    private readonly baseUrl:string = environment.baseUrServicioExternoAPI;

    public getAreaType(areaType: number){
        return this.http.get<Response>(`${this.baseUrl}/dgaamw/diaw/tipo-area/${areaType}`)
        .pipe(
            catchError(err => throwError(() => err.error.message))
        );

    }

    public getLocationNearbyTown(study: number){
        return this.http.get<Response>(`${this.baseUrl}/dgaamw/diaw/ubicacion-pob-cercano/${study}`)
            .pipe(
                catchError( err => throwError(() => err.error.message  ) )
            );

    }

    
}