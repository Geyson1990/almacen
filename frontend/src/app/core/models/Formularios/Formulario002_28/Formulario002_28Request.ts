import { Formulario } from '../FormularioMain';
import { MetaData } from './MetaData';

export class Formulario002_28Request extends Formulario {
  metaData: MetaData;

  constructor() {
    super()
    this.metaData = new MetaData();
  }
}
