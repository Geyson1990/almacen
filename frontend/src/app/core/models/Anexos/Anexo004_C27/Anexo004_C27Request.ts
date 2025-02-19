import { Anexo } from '../AnexoMain';
import { MetaData } from './MetaData';

export class Anexo004_C27Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super()
    this.metaData = new MetaData();
  }
}
