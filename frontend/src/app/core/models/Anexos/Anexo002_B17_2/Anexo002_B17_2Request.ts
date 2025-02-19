import { Anexo } from '../AnexoMain';
import { MetaData } from './MetaData';

export class Anexo002_B17_2Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}
