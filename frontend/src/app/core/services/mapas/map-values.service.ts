import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
//import { Legend } from "../interfaces/data.interface";
import { AreaTypeSelection, Legend } from "../../../core/models/Mapas/data.interface";


@Injectable({ providedIn: 'root' })
export class MapValueService {

    // Poligono
    private _polygonLatLngs = new BehaviorSubject<[number, number][]>([]);
    private _polygonLatLngs$ = this._polygonLatLngs.asObservable();

    // csv Poligono
    private _CsvPolygonLatLngs = new BehaviorSubject<[number, number][]>([]);
    private _CsvPolygonLatLngs$ = this._CsvPolygonLatLngs.asObservable();

    // cartografia de mapa visible
    private _mapVisible = new BehaviorSubject<boolean>(true);
    private _mapVisible$ = this._mapVisible.asObservable();

    // vertices visible
    private _verticesVisible = new BehaviorSubject<boolean>(false);
    private _verticesVisible$ = this._verticesVisible.asObservable();

    // etiquetas visibles
    private _labelsVisible = new BehaviorSubject<boolean>(false);
    private _labelsVisible$ = this._labelsVisible.asObservable();

    // legendas
    private _legendGroup = new BehaviorSubject<Legend[]>([]);
    private _legendGroup$ = this._legendGroup.asObservable();

    private _areaTypeSelection = new BehaviorSubject<AreaTypeSelection>(null);
    private _areaTypeSelection$ = this._areaTypeSelection.asObservable();

    private _UTMzone = new BehaviorSubject<string>("");
    private _UTMzone$ = this._UTMzone.asObservable();

    private _isLoading = new BehaviorSubject<boolean>(false);
    private _isLoading$ = this._isLoading.asObservable();

    // COORDENADAS ESTE NORTE AL PASAR CURSOR POR EL MAPA
    private _coordinateEastNorth = new BehaviorSubject<string>('');
    private _coordinateEastNorth$ = this._coordinateEastNorth.asObservable();

    private _DescriptionArea = new BehaviorSubject<string>("");
    private _DescriptionArea$ = this._DescriptionArea.asObservable();

    private _IdActivityType = new BehaviorSubject<number>(0);
    private _IdActivityType$ = this._IdActivityType.asObservable();

    private _ActivityType = new BehaviorSubject<string>("");
    private _ActivityType$ = this._ActivityType.asObservable();   

    getPolygonLatLngs(): Observable<[number, number][]> {
        return this._polygonLatLngs$;
    }

    setPolygonLatLngs(polygonLatLngs: [number, number][]) {
        return this._polygonLatLngs.next(polygonLatLngs);
    }

    getCsvPolygonLatLngs(): Observable<[number, number][]> {
        return this._CsvPolygonLatLngs$;
    }

    setCsvPolygonLatLngs(CsvPolygonLatLngs: [number, number][]) {
        return this._CsvPolygonLatLngs.next(CsvPolygonLatLngs);
    }

    getMapVisible(): Observable<boolean> {
        return this._mapVisible$;
    }

    setMapVisible(mapVisible: boolean) {
        return this._mapVisible.next(mapVisible);
    }

    setVerticesVisible(verticesVisible: boolean) {
        return this._verticesVisible.next(verticesVisible);
    }
    getVerticesVisible(): Observable<boolean> {
        return this._verticesVisible$;
    }

    setLabelsVisible(labelsVisible: boolean) {
        return this._labelsVisible.next(labelsVisible);
    }
    getLabelsVisible(): Observable<boolean> {
        return this._labelsVisible$;
    }

    setLegendGroup(legendGroup: Legend[]) {
        return this._legendGroup.next(legendGroup);
    }
    getLegendGroup(): Observable<Legend[]> {
        return this._legendGroup$;
    }

    getUTMZone(): Observable<string> {
        return this._UTMzone$;
    }

    setUTMZone(UTMZone: string) {
        return this._UTMzone.next(UTMZone);
    }

    getIsLoading(): Observable<boolean>{
        return this._isLoading$;
    }

    setisLoading(isLoading: boolean){
        return this._isLoading.next(isLoading);
    }

    getCoordinateEastNorth(): Observable<string>{
        return this._coordinateEastNorth$;
    }

    setCoordinateEastNorth(coordinateEastNorth: string){
        return this._coordinateEastNorth.next(coordinateEastNorth);
    }

    getDescriptionArea(): Observable<string> {
        return this._DescriptionArea$;
    }

    setDescriptionArea(DescriptionArea: string) {
        return this._DescriptionArea.next(DescriptionArea);
    }

    getActivityType(): Observable<string> {
        return this._ActivityType$;
    }

    setActivityType(ActivityType: string) {
        return this._ActivityType.next(ActivityType);
    }

    getIdActivityType(): Observable<number> {
        return this._IdActivityType$;
    }

    setIdActivityType(IdActivityType: number) {
        return this._IdActivityType.next(IdActivityType);
    }

    setAreaTypeSelection(areaTypeSelection: AreaTypeSelection) {
        return this._areaTypeSelection.next(areaTypeSelection);
    }
    getAreaTypeSelection(): Observable<AreaTypeSelection> {
        return this._areaTypeSelection$;
    }

}