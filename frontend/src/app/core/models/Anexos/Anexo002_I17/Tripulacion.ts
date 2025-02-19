import { SelectionModel } from '../../SelectionModel';
import { TripulacionModel } from '../../TripulacionModel';

export class Tripulacion extends TripulacionModel{
    cargo: SelectionModel;
}

export class A002_I17_Seccion2 {
  restriccion1: boolean;
  restriccion2: boolean;
  restriccion3: boolean;
  pathNameR1: string;
  pathNameR2: string;
  pathNameR3: string;
  fileRestriccion1: File;
  fileRestriccion2: File;
  fileRestriccion3: File;
}
