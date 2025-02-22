export const environment = {
  production: false,
  baseUrlAPI: 'https://localhost:7241/api', //'http://192.168.251.156:7777/api',
  baseUrlLocal: 'https://localhost:7241/api',
  
  baseUrlTramiteAPI: 'https://localhost:7241/api',
  baseUrlSeguridadAPI: 'http://172.25.3.108:8081/ms-seguridad',
  baseUrlPersonaAPI: 'http://172.25.3.108:8081/ms-persona',
  baseUrlAdministradoAPI: 'https://localhost:7241/api',
  baseUrlLaserFicheAPI: 'http://172.25.3.108/ws-laserfiche/api',
  baseUrServicioExternoAPI: 'https://localhost:7244/api',

  baseUrlExternalApp: 'http://localhost:4200',
  //baseUrlPloneExtranet:'http://172.25.0.33:8091',

  endPoint: {
    listarInventario: '/Inventario/listar-inventario',



    anexo: '/Anexo',
    anexoTramite: '/Anexo/tramite',
    formularioTramite: '/Formulario/tramite',
    visorPdf: '/Pdf/archivo',
    plantilla: '/Pdf/plantilla',
    archivoExcel: '/Pdf/excel',
    leerExcel: '/Excel/enviarExcel',
    uriArchivoUpdate: '/Anexo/UpdateMovimientoAnexo',
    uriDownloadTemplateDia: '/Formulario/plantilla-dia',
    uriReturnPago: '/%23/recepcion-pago',
    urlPasarelaPago: 'https://pagosonline.mtc.gob.pe/ValidacionDatosPago.aspx',
    urlOauthSunat: 'https://api-seguridad-desa.sunat.gob.pe:444/v1/clientessol',
    urlOauthSunatClientId: '33804df8-6c20-4dc7-b502-5f439c0f74b4',
    casilla: {
      baseUrl: 'http://localhost:4201',
      integracion: '/casilla/#/token',
      registro: '/#/RegistrarUsuarioCasilla',
      //recuperarpass: '/#/recuperar-password',
      recuperarpass: '/#/recuperar-password',
    },
    autenticacion: {
      autenticacion: '/Autenticacion/jwt',
      login: '/Autenticacion/login',
      registrar: '/Autenticacion/registrar',
      logout: '/Autenticacion/logout',
      recuperarpass: '/Autenticacion/recuperarpass',
      cambiarpass: '/Autenticacion/cambiarpass',
      actualizar: '/Autenticacion/actualizar',
      loginsunat: '/Autenticacion/loginsunat',
      captchaSiteKey: '6LdLPYYaAAAAABLCDNM2W98Bya28GnqGf5tykJP9',
    },
    anexos: {
      anexo2_a27NT: '/Anexo/002_A27NT',
      anexo2_b27NT: '/Anexo/002_B27NT',
      anexo4_a27: '/Anexo/004_A27NT',
      anexo4_b27: '/Anexo/004_B27NT',
      anexo4_c27: '/Anexo/004_C27NT',
      anexo4_d27: '/Anexo/004_D27NT',
      anexo1_a27: '/Anexo/001_A27',
      anexo1_a27NT: '/Anexo/001_A27NT',
      anexo1_b27: '/Anexo/001_B27',
      anexo1_b27NT: '/Anexo/001_B27NT',
      anexo1_c27: '/Anexo/001_C27',
      anexo1_c27NT: '/Anexo/001_C27NT',
      anexo1_d27: '/Anexo/001_D27',
      anexo1_d27NT: '/Anexo/001_D27NT',
      anexo1_e27NT: '/Anexo/001_E27NT',
      anexo1_a17: '/Anexo/001_A17',
      anexo1_b17: '/Anexo/001_B17',
      anexo1_c17: '/Anexo/001_C17',
      anexo1_d17: '/Anexo/001_D17',
      anexo1_e17: '/Anexo/001_E17',
      anexo1_f17: '/Anexo/001_F17',
      anexo1_g17: '/Anexo/001_G17',
      anexo1_H17: '/Anexo/001_H17',
      anexo3_e17: '/Anexo/003_E17',
      anexo2_e17: '/Anexo/002_E17',
      anexo2_f17: '/Anexo/002_F17',
      anexo2_g17: '/Anexo/002_G17',
      anexo2_i17: '/Anexo/002_I17',
      anexo3_b17: '/Anexo/003_B17',
      anexo3_a17: '/Anexo/003_A17',
      anexo3_c17: '/Anexo/003_C17',
      anexo3_d17: '/Anexo/003_D17',
      anexo3_f17: '/Anexo/003_F17',
      anexo6_c17: '/Anexo/006_C17',
      anexo6_A17: '/Anexo/006_A17',
      anexo6_B17: '/Anexo/006_B17',
      anexo2_a17: '/Anexo/002_A17',
      anexo2_a172: '/Anexo/002_A17_2',
      anexo2_b17: '/Anexo/002_B17',
      anexo2_b172: '/Anexo/002_B17_2',
      anexo2_d17: '/Anexo/002_D17',
      anexo1_a28: '/Anexo/001_A28',
      anexo1_b28: '/Anexo/001_B28',
      anexo1_c28: '/Anexo/001_C28',
      anexo1_d28: '/Anexo/001_D28',
      anexo2_a28: '/Anexo/002_A28',
      anexo2_b28: '/Anexo/002_B28',
      anexo2_c28: '/Anexo/002_C28',
      anexo2_d28: '/Anexo/002_D28',
      anexo2_e28: '/Anexo/002_E28',
      anexo2_f28: '/Anexo/002_F28',
      anexo2_f28NT: '/Anexo/002_F28NT',
      anexo2_g28: '/Anexo/002_G28',
      anexo2_g28NT: '/Anexo/002_G28NT',
      anexo2_h28: '/Anexo/002_H28',
      anexo2_h17: '/Anexo/002_H17',
      anexo3_a172: '/Anexo/003_A17_2',
      anexo3_b172: '/Anexo/003_B17_2',
      anexo12_a173: '/Anexo/012_A17_3',
      anexo1_a28NT: '/Anexo/001_A28NT',
      anexo1_b28NT: '/Anexo/001_B28NT',
      anexo1_c28NT: '/Anexo/001_C28NT',
      anexo1_d28NT: '/Anexo/001_D28NT',
      anexo1_e28NT: '/Anexo/001_E28NT',
      anexo1_f28NT: '/Anexo/001_F28NT',
      anexo1_g28NT: '/Anexo/001_G28NT',
      anexo3_a28NT: '/Anexo/003_A28NT',
      anexo3_b28NT: '/Anexo/003_B28NT',
      anexo1_a1703: '/Anexo/001_A17_03',
      anexo1_a172: '/Anexo/001_A17_2',
      datos_formulario: '/Anexo/Formulario/datos',
      anexo2_c27: '/Anexo/002_C27',
      anexo2_d27: '/Anexo/002_D27',
      anexo2_e27: '/Anexo/002_E27',
      anexo3_a27: '/Anexo/003_A27',
      anexo2_a173: '/Anexo/002_A17_3',
      anexo4_a173: '/Anexo/004_A17_3',
      anexo7_a173: '/Anexo/007_A17_3',
      anexo7_b173: '/Anexo/007_B17_3',
      anexo7_c173: '/Anexo/007_C17_3',
      anexo9_a173: '/Anexo/009_A17_3',
      anexo9_b173: '/Anexo/009_B17_3',
      anexo3_a173: '/Anexo/003_A17_3',
      anexo5_a173: '/Anexo/005_A17_3',
      anexo5_b173: '/Anexo/005_B17_3',
      anexo6_a173: '/Anexo/006_A17_3',
      anexo6_b173: '/Anexo/006_B17_3',
      anexo8_a173: '/Anexo/008_A17_3',
      anexo10_a173: '/Anexo/010_A17_3',
    },
    formulario2_17: '/Formulario',
    formulario3_12: '/Formulario',
    formulario6_17: '/Formulario',
    formulario3_17: '/Formulario',
    formulario4_12: '/Formulario',
    formulario: {
      formulario2_17: '/Formulario/002_17',
      formulario1_27: '/Formulario/001_27',
      formulario1_27NT: '/Formulario/001_27NT',
      formulario2_12: '/Formulario/002_12',
      formulario3_12NT: '/Formulario/003_12NT',
      formulario4_27: '/Formulario/004_27NT',
      formulario3_12: '/Formulario/003_12',
      formulario6_17: '/Formulario/006_17',
      formulario3_17: '/Formulario/003_17',
      formulario4_12: '/Formulario/004_12',
      formulario1_17: '/Formulario/001_17',
      formulario1_a12: '/Formulario/001_A_12',
      formulario1_b12: '/Formulario/001_B_12',
      formulario2_a12: '/Formulario/002_A_12',
      formulario2_b12: '/Formulario/002_B_12',
      formulario1_28: '/Formulario/001_28',
      formulario2_28: '/Formulario/002_28',
      formulario3_17_2: '/Formulario/003_17_2',
      formulario2_17_2: '/Formulario/002_17_2',
      formulario7_12: '/Formulario/007_12',
      formulario4_12NT: '/Formulario/004_12NT',
      formulario5_12: '/Formulario/005_12',
      formulario6_12: '/Formulario/006_12',
      formulario1_12: '/Formulario/001_12',
      formulario1_12_4: '/Formulario/001_12_4',
      formulario12_17_3: '/Formulario/012_17_3',
      formulario1_28NT: '/Formulario/001_28NT',
      formulario3_28NT: '/Formulario/003_28NT',
      formulario1_16: '/Formulario/001_16',
      formulario2_28NT: '/Formulario/002_28NT',
      formulario1_03: '/Formulario/001_03',
      formulario1_17_03: '/Formulario/001_17_03',
      formulario1_17_2: '/Formulario/001_17_2',
      formulario2_27: '/Formulario/002_27',
      formulario3_27: '/Formulario/003_27',
      formulario1_19_1: '/Formulario/001_19_1',
      formulario2_17_3: '/Formulario/002_17_3',
      formulario1_04_2: '/Formulario/001_04_2',
      formulario4_17_3: '/Formulario/004_17_3',
      formulario7_17_3: '/Formulario/007_17_3',
      formulario9_17_3: '/Formulario/009_17_3',
      formulario1_PVI: '/Formulario/001_PVI',
      formulario3_17_3: '/Formulario/003_17_3',
      formulario5_17_3: '/Formulario/005_17_3',
      formulario6_17_3: '/Formulario/006_17_3',
      formulario8_17_3: '/Formulario/008_17_3',
      formulario10_17_3: '/Formulario/010_17_3',
    },
    maestros: {
      pais: '/Maestros/pais',
      departamentos: '/Maestros/departamentos/',
      provincias: '/Maestros/provincias',
      distritos: '/Maestros/distritos',
      oficinaRegistral: '/Maestros/oficinaRegistral',
      tipoDocumentoPersonaExtranjera:
        '/maestro-documento/listar-tipo-documento-persona-extranjera',
      materias: '/Maestros/materias', //RC
    },
    servicios: {
      vehiculo: '/Services/Vehiculo/',
      reniec: '/Services/Reniec/',
      snc: '/Services/Snc/',
      extranjeria: '/Services/Extranjeria/',
      renat: '/Services/renat/',
      sunat: '/Services/Sunat/',
      aeronave: '/Services/Sunarp/BuscarNaveAeronave/',
      mtc: '/Services/Mtc/',
      ellipse: '/Services/Ellipse/',
      snip: '/Services/Snip/',
    },
    tupas: {
      lista: '/ListaTupas/tupas',
      listatotal: '/ListaTupas/listatupas',
      detalle: '/ListaTupas/detalle',
      tipossolicitud: '/ListaTupas/tipossolicitud',
      tupa: '/ListaTupas/tupa',
      tipopersona: '/tipo-persona/listar-por-codigo-filtrado',
      grupos: '/ListaTupas/grupos',
      tupabuscar: '/ListaTupas/tupabuscar',
      tupasporgrupo: '/Tupa/tupa-por-sector',
      buscarTupasPorFiltros: '/ListaTupas/buscarPorFiltros', // RC
      listarProcedPortal: '/ListaTupas/listarProcedPortal',
      obtenerProcedPortal: '/ListaTupas/obtenerProcedPortal',
    },
    tramite: {
      tramite: '/Tramite/tramite',
      generar: '/Tramite/generar',
      completarReq: '/Tramite/completarreq',
      enviar: '/Tramite/enviar',
      subsanar: '/Tramite/subsanar',
      adjuntar: '/Tramite/adjuntar',
      adjuntarAdicional: '/Tramite/adjuntaradicional',
      eliminarAdicional: '/Tramite/eliminar-documento-adicional',
      eliminarPagoAdd: '/Tramite/eliminarpagoadd',
      adjuntarUrl: '/Tramite/adjuntarurlreq',
      bandeja: '/Tramite/bandeja',
      comprobarPago: '/Tramite/comprobarpago',
      comprobarVoucher: '/Tramite/comprobarvoucher',
      comprobarVoucherAdd: '/Tramite/comprobarvoucheradd',
      verificarVoucher: '/Tramite/verificarvoucher',
      incidencia: '/Tramite/incidencia',
      incidenciaOtro: '/Tramite/incidenciaotro',
      obtenerVoucherAdd: '/Tramite/obtenervoucheradd',
      obtenerPago: '/Tramite/obtenerpago',
      obtenerPagosAdd: '/Tramite/pagosadicionales',
      verificarPago: '/Tramite/verificarpago',
      anular: '/Tramite/anular',
      eliminarDoc: '/Tramite/eliminardoc',
      procedimientoNotas: '/Tramite/obtenernotas',
      obtenerDocumentos: '/Tramite/obtenerdocs',
      acuseObservado: '/Tramite/acuseobservado',
      acuseAtendido: '/Tramite/acuseatendido',
      adjuntarArchivo:'/Archivo/adjuntar-requisito-dia',
      tramiteIniciado: '/Tramite/tramiteIniciado',
      obtenerDocumentosAdicionales: '/Tramite/obtener-docs-adicionales',
      actualizarIdEstudio:'/Tramite/actualizar-id-estudio',
      tipoComunicacion:'/Tramite/tipo-comunicacion',
      tipoDocumento:'/Tramite/tipo-documento',      
      validarNombreProyecto: '/tramite/validar-nombre-proyecto',
      registrarNombreProyecto: '/tramite/registrar-nombre-proyecto',
      enviarSolicitudes: '/Tramite/enviar-tramite-adicional',      
    },
    profesional: {
      obtenerValidador: 'Profesional/obtenervalidadordoc',
      validarDocumento: 'Profesional/validardocumento',
      obtenerProfesiones: '/Profesional/obtenerprofesiones',
      obtenerProfesional: '/Profesional/obtenerprofesional',
      asignarProfesional: '/Profesional/asignarprofesional',
      obtenerRequisitoParaFirma: '/Profesional/obtenerreqparafirma',
      obtenerDocumentoParaFirma: '/Profesional/obtenerdocparafirma',
      documentoFirmado: '/Profesional/documentofirmado',
      limpiardocumentos: '/Profesional/limpiardocumentos',
    },
    siidgac: {
      obtenerPais: '/SIIDgac/obtenerPais',
      obtenerMotivoPermiso: '/SIIDgac/obtenerMotivoPermiso',
      listarTipoTripulante: '/SIIDgac/listarTipoTripulante',
      listarNacionalidad: '/SIIDgac/listarNacionalidad',
      listarDesignadorOACI: '/SIIDgac/listarDesignadorOACI',
      obtenerPVI: '/SIIDgac/obtenerPVI',
    },
    encuestas: {
      // RC
      encuestaPlantilla: 'Encuestas/encuestaPlantilla',
      finalizar: 'Encuestas/finalizar',
      generar: 'Encuestas/generarEncuesta',
      buscarPorProcedYDestino: 'Encuestas/buscarEncuestaPorProcedYDestino',
    },
    firmaPeru: {
      puertoServidorLocal: '48596',
      obtenerParamFirmaProfesional: '/FirmaPeru/params/profesional',
    },
    administrado: {
      sector: '/Sector/sector',
      requisito: '/Requisito/requisito-por-tupa',
      tupaByCode: '/Tupa/tupa-por-codigo'
    },
    laserfiche:{
      upload:'/laserfiche/upload-document',
      download:'/laserfiche/download-document'
    },
    formularios:{
      guardar:'/Formulario/Guardar',
      obtener:'/Formulario/formulario-dia'
    },
    package_ftaw:{
      comboGenerico: '/dgaamw/ftaw/combo-generico',
      tipoViaExistente: '/dgaamw/ftaw/via-acceso-existentes/tipo-via',
      tipoViaNueva: '/dgaamw/ftaw/via-acceso-nuevas/tipo-via',
      origenTipoManoObra: '/dgaamw/ftaw/tipo-mano-obra/origen'
    },
    package_eamw:{
      ParametrosMonitoreo: '/dgaamw/eamw/parametros-monitoreo',
      EmpresaConsultora:'/dgaamw/eamw/empresa-consultora',
      ProfesionalesConsultora:'/dgaamw/eamw/profesional-consultora',
      OtroProfesionalConsultora:'/dgaamw/eamw/otro-profesional-consultora',
      TipoDocumento:'/dgaamw/eamw/tipo-documento',
      TipoMineral:'/dgaamw/eamw/mineral/tipo',
      RecursoExplorar:'/dgaamw/eamw/mineral/recurso-a-explorar',
      Fase: '/dgaamw/eamw/fase',
      EtapaAbastecimiento: '/dgaamw/eamw/etapa-abastecimiento',
      FuenteAbastecimiento: '/dgaamw/eamw/fuente-abastecimiento',
      Insumo: '/dgaamw/eamw/insumo',
      UnidadMedidaInsumo: '/dgaamw/eamw/insumo/unidad-medida',
      FuenteAgua:'/dgaamw/eamw/fuente-agua',
      TipoComponente:'/dgaamw/eamw/tipo-componente',
      ClasificacionResiduo:'/dgaamw/eamw/clasificacion-residuo',
      TipoResiduo:'/dgaamw/eamw/tipo-residuo',
      Residuo:'/dgaamw/eamw/residuo',
      UnidadesPeso:'/dgaamw/eamw/residuo/unidad-medida-peso',
      FrecuenciaPeso:'/dgaamw/eamw/residuo/frecuencia-peso',
      SubTipo:'/dgaamw/eamw/sub-tipo',
      AreasProtegidas:'/dgaamw/eamw/areas-protegidas',
      UbicacionGeografica:'/dgaamw/eamw/ubicacion-geografica'
    },
    package_simen:{
      Zona: '/simen/simen/zona',
      Datum: '/simen/simen/datum',
      DatosTitularRepresentanteEmpresa: '/simen/simen/empresa/datos-titular',
      RepresentantesPorcliente:'/simen/simen/representante-por-cliente',
      TipoPasivo:'/simen/simen/tipo-pasivo'
    },
    package_diaw:{
      ComboGenerico: '/dgaamw/diaw/combo-generico',
      ComboGenericoString: '/dgaamw/diaw/combo-generico-string',
      Estudio: '/dgaamw/diaw/generar-estudio'
    },
    package_solicitud:{
      Solicitud:'/solicitud/insertar-expediente-tramite'
    },
    package_eiaw:{
      ComboGenerico: '/dgaamw/eiaw/combo-generico'
    },
    package_eam:{
      UnidadMinera: '/dgaam/eam/unidad-minera'
    },
    package_general_seal:{
      DerechosMinerosSolicitante: '/dgaamw/general-seal/derechos-mineros-solicitante',
      DerechosMinerosTercero: '/dgaamw/general-seal/derechos-mineros-terceros'
    },
    package_csp:{
      MecanismosParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/mecanismo',
      FaseParticipacionCuidadana: '/oggsw/csp/participacion-ciudadana/fase',
      RegionParticipacionCiudadana:'/oggsw/csp/participacion-ciudadana/lugar/region',
      ProvinciaParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/lugar/provincia',
      DistritoParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/lugar/distrito',
      LocalidadParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/lugar/localidad',
      HoraParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/fechas/horas',
      MinutoParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/fechas/minutos',
      TipoAdjuntoParticipacionCiudadana: '/oggsw/csp/participacion-ciudadana/tipos-adjunto',
    },
    plantillas:{
      Plataformas: '/Archivo/download'
    },
    observacion: {
      insertar: '/Observacion/insertar-observacion',
      obtener: '/Observacion/consulta-observacion', 
      actualizar: '/Observacion/update-observacion',
      eliminar: '/Observacion/delete-observacion',  
      solictudObservacion: '/Observacion/observacion-solicitud', 
    }
  },
};



