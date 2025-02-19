import { Anexo } from '../AnexoMain';
import { MetaData } from './MetaData';

export class Anexo001_C28NTRequest extends Anexo {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}
