import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo007_B17_3Request extends Anexo {
	metaData: MetaData;

	constructor() {
		super();
		this.metaData = new MetaData();
	}
}

export class MetaData {
	seccion1: Seccion1;
	seccion2: Seccion2;
	tipoDocumentoSolicitante: string;
	nombreTipoDocumentoSolicitante: string;
	numeroDocumentoSolicitante: string;
	nombresApellidosSolicitante: string;
	constructor() {
		this.seccion1 = new Seccion1();
		this.seccion2 = new Seccion2();
	}
}

export class Seccion1 {
	codigoProcedimiento: string;
	citvFijo: boolean;
	citvMovil: boolean;
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
}

export class Seccion2 {
	declaracion_1: boolean;
	declaracion_2: boolean;
	declaracion_3: boolean;
	declaracion_4: boolean;
	declaracion_5: boolean;
	declaracion_6: boolean;
}