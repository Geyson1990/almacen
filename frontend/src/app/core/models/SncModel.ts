export class DatosPersona {
    CodFichaPos: string;
    ConductorApeMaterno: string;
    ConductorApePaterno: string;
    ConductorNombres: string;
}

export class ListaConsulta {
    datosPersona: DatosPersona;  
}

export class ConsultaDniResponse {
    listaConsulta: ListaConsulta;
}

export class SncModel {
    sncConsultDniResponse: ConsultaDniResponse;
}

