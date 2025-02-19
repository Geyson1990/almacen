import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo005_B17_3Request extends Anexo {
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
	declaracion_81: boolean;
	declaracion_82: boolean;
	declaracion_83: boolean;
	declaracion_84: boolean;
	declaracion_85: boolean;
	declaracion_86: boolean;
	declaracion_87: boolean;
	declaracion_88: boolean;
	declaracion_89: boolean;
	declaracion_810: boolean;
	declaracion_811: boolean;
	declaracion_812: boolean;
	declaracion_813: boolean;
	declaracion_814: boolean;
	declaracion_815: boolean;
	declaracion_816: boolean;
	declaracion_817: boolean;
	declaracion_818: boolean;
	declaracion_819: boolean;
	declaracion_9: boolean;
	declaracion_10: boolean;
	declaracion_111: boolean;
	declaracion_112: boolean;
	declaracion_113: boolean;
	declaracion_114: boolean;
	declaracion_115: boolean;
	declaracion_12: boolean;
	declaracion_13: boolean;
	resolucionGases:string;
	fechaResolucionGases: string;
	certificado: string;
	fechaCertificado: string;
}