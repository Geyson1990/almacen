import { Formulario } from '../../../core/models/Formularios/FormularioMain';
import { MetaData } from './MetaData';

export class Formulario002_PVIRequest extends Formulario {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}
