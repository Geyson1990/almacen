import { Seccion1,  Seccion3, Seccion4, Seccion5, Seccion6, Seccion7 } from './Secciones';

export class MetaData {

    seccion1: Seccion1;
    seccion3: Seccion3;
    seccion4: Seccion4;
    seccion5: Seccion5;
    seccion6: Seccion6;
    seccion7: Seccion7;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion3 = new Seccion3();
        this.seccion4 = new Seccion4();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
        this.seccion7 = new Seccion7()
    }
}

// export class DatosSolicitante {
//   ruc:          string;
//   razonSocial:        string;
//   domicilio:          string;
//   distrito:           string;
//   provincia:          string;
//   departamento:       string;
//   //tipoDocumento: string;
//   //dni:                string;
//   telefonoFax:        string;
//   celular:            string;
//   correoElectronico:  string;
//   marcadoObligatorio: number;
//   poderRegistrado: string;
//   oficinaRegistral: number;
// }
