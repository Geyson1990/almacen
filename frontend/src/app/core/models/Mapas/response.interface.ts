
import { GeometryGeneral, Polygon, PolygonArea } from "./map-geometry.interface"
import { AreaType, NearbyTown } from "./data.interface"

export interface Response{
    succes: boolean,
    message: string,
    data: Polygon | PolygonArea[] | AreaType[] | NearbyTown[] | GeometryGeneral[]
}