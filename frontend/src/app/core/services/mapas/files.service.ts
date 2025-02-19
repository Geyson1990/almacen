import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";


@Injectable({providedIn: 'root'})
export class FilesService{

    // Poligono
    private _csvFile = new BehaviorSubject<File | undefined>(undefined);
    private _csvFile$ = this._csvFile.asObservable();

    getCsvFile(): Observable<File | undefined>{
        return this._csvFile$;
    }

    setCsvFile(csvFile: File | undefined){
        return this._csvFile.next(csvFile );
    }

}