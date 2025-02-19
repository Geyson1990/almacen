


export interface GeometryGeneral{
    capa: string,
    idObjeto: string,
    nombreObjeto: string,
    color: string,
    opacidad: string,
    contornoColor: string,
    contornoWidth: string,
    contornoEstilo: string,
    geometryWKT: string
}

export interface Polygon{
    capa: string,
    idObjeto: string,
    nombreObjeto: string,
    color: string,
    opacidad: string,
    contornoColor: string,
    contornoWidth: string,
    contornoEstilo: string,
    geometryWKT: string,
    coordenadas?: [number, number][]
}

export interface PolygonArea{
    idArea: number,
    idZona: number,
    nombreZona: string,
    nombreDatum: string,
    idDatum: number,
    nombreActividad: string,
    descripcionArea: null,
    idTipoArea: number,
    geometry: number,
    coordenadas: string,
    geometryWKT: string
}

export interface PolygonMiningLawSend{
    idCliente: number,
    idEstudio: number,
    idPoligono: number,
    flgArea: number,
    geometryWKT: string,
    idZona: number,
    idDatum: number
}

