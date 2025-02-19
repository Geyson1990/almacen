import { Anexo } from '../AnexoMain';
import { MetaData } from './MetaData';

export class Anexo002_A17_3Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}
