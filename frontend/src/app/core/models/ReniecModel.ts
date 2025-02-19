export class DatosPersona {
    apPrimer: string;
    apSegundo: string;
    direccion: string;
    estadoCivil: string;
    foto: string;
    prenombres: string;
    restriccion: string;
    ubigeo: string;
}

export class ListaConsulta {
    coResultado: string;
    datosPersona: DatosPersona;
    deResultado: string;
}
export class ConsultaDniResponse {
    listaConsulta: ListaConsulta;
}

export class ReniecModel {
    reniecConsultDniResponse: ConsultaDniResponse;
}