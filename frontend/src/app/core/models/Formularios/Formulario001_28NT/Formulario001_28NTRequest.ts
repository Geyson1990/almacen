import { Formulario } from '../FormularioMain';
import { MetaData } from './MetaData';

export class Formulario001_28NTRequest extends Formulario {
  metaData: MetaData;

  constructor() {
    super()
    this.metaData = new MetaData();
  }
}
