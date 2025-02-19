export interface AreaType{
    idTipoArea: number,
    nombreActividad: string
}

export interface NearbyTown{
    idDistrito: string,
    idDepartamento: string,
    idProvincia: string,
    departamento: string,
    provincia: string,
    distrito:string,
    porcentaje: number
}

export interface Legend{
    capa: string |  null,
    color: string |  null,
    contornoColor: string |  null,
    geometry: string |  null
}

export interface AreaTypeSelection{
    areas: AreaType[],
    idTipoArea: number,
    descripcionTipoArea: string
}