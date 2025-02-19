import { Anexo } from '../../../../core/models/Anexos/AnexoMain';

export class Anexo006_B17_3Request extends Anexo {
	metaData: MetaData;

	constructor() {
		super();
		this.metaData = new MetaData();
	}
}

export class MetaData {
	seccion1: Seccion1;
	tipoDocumentoSolicitante: string;
	nombreTipoDocumentoSolicitante: string;
	numeroDocumentoSolicitante: string;
	nombresApellidosSolicitante: string;
	constructor() {
		this.seccion1 = new Seccion1()
	}
}

export class Seccion1 {
	codigoProcedimiento: string;
	pathNameDocumentos: string;
   fileDocumentos: File;
	declaracion_1: boolean;
	declaracion_2: boolean;
	declaracion_3: boolean;
	declaracion_4: boolean;
	declaracion_5: boolean;
	declaracion_6: boolean;
	declaracion_7: boolean;
	declaracion_8: boolean;
	declaracion_9: boolean;
	declaracion_10: boolean;
	declaracion_11: boolean;
	declaracion_12: boolean;
	declaracion_13: boolean;
	declaracion_14: boolean;
	declaracion_15: boolean;
	declaracion_16: boolean;
	declaracion_17: boolean;
}