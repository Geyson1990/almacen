export class requestExcel{
    pathName:string;
    fileExcel:File;
    nombrePlantilla : string;
    codigoProcedimiento : string;
    codigoTipoSolicitud : string;
    constructor(){
        
    }
}

export class responseExcel{
    clase:string;
    banda:string;
    ubicacion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    lonOeste_grados: string;
    lonOeste_minutos: string;
    lonOeste_segundos: string;
    latSur_grados: string;
    latSur_minutos: string;
    latSur_segundos: string;
    marca: string;
    modelo: string;
    codHomologa: string;
    potencia: string;
    bandaFrec: string;
    nroSerie: string;
    antena_marca: string;
    antena_modelo: string;
    antena_ganancia: string;
    antena_alturaTorre: string;
    antena_alturaRadia: string;
    direccionFB:string;
    placaRodajeML: string;
    zonaOperacionML: string;
    /* Microondas*/
    canal:string;
    velocidad:string;
    /* Satelital */
    proveedor:string;
    satelite: string;
    frecuenciaSubida:string;
    frecuenciaBajada:string;
    anchoBanda:string;
    antena_diametro :string;
    antena_alturaSuelo :string;
    antena_codHomologa:string;
    /* MovilAeronautico*/
    ma_Matricula:string;
    ma_ZonaOperacion:string;
    ma_Departamento:string;
    ma_Provincia:string;
    ma_Distrito:string;
    ma_Marca :string;
    ma_Modelo:string;
    ma_CodHomologa:string;
    ma_Cantidad :string;
    ma_Potencia:string;
    ma_Rango :string;
    ma_TipoEmision :string;
    ma_Serie :string;
    ma_AntenaMarca:string;
    ma_AntenaModelo:string;
    ma_AntenaGanancia :string;
    /* MovilMaritimo*/
    ms_Matricula:string;
    ms_ZonaOperacion :string;
    ms_Departamento :string;
    ms_Provincia :string;
    ms_Distrito:string;
    ms_Marca :string;
    ms_Modelo :string;
    ms_CodHomologa:string;
    ms_Cantidad :string;
    ms_Potencia :string;
    ms_Rango :string;
    ms_TipoEmision :string;
    ms_Serie :string;
    ms_AntenaMarca:string;
    ms_AntenaModelo :string;
    ms_AntenaGanancia :string;
    
    resultado: boolean;
    message:string;
}
