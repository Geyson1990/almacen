import { Anexo } from '../AnexoMain';
import { MetaData } from './MetaData';

export class Anexo003_D17Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super()
    this.metaData = new MetaData();
  }
}
