import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from '../../../../environments/environment';
import { Response } from "../../../core/models/Mapas/response.interface";
import { PolygonMiningLawSend } from "../../../core/models/Mapas/map-geometry.interface";

@Injectable({providedIn: 'root'})
export class MapGeometryService{

    private http = inject(HttpClient);
    private readonly baseUrl:string = environment.baseUrServicioExternoAPI;

    constructor(){}

    public uploadCsvCoordinates(csv: FormData): Observable<Response>{
        return this.http.post<Response>(`${ this.baseUrl }/dgaamw/diaw/upload-coordenadas-csv`, csv )
        .pipe(
            catchError(err => throwError(() => err.error.message))
        );
    }

    public uploadCoordinatesManual(coordinatesManual: FormData): Observable<Response>{

        return this.http.post<Response>(`${ this.baseUrl }/dgaamw/diaw/upload-coordenadas-manual`, coordinatesManual )
        .pipe(
            catchError(err => throwError(() => err.error.message))
        );
        
    }

    public getPolygonsAreaProyect(study: number, areaTypeClassification: number): Observable<Response>{
        return this.http.get<Response>(`${this.baseUrl}/dgaamw/diaw/area-proyecto/${study}/${areaTypeClassification}`)
        .pipe(
            catchError( err => throwError(()=> err.error.message ))
        );
    }

    public getPolygonsMiningLaw(polygonMininLaw: PolygonMiningLawSend): Observable<Response> {
        return this.http.post<Response>(`${this.baseUrl}/dgaamw/diaw/wkt-derecho-minero`, polygonMininLaw)
        .pipe(
            catchError( err=> throwError(() => err.error.message))
        );
    }

}