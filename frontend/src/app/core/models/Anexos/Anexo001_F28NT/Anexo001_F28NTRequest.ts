import { Anexo } from '../AnexoMain';
import { MetaData } from './MetaData';

export class Anexo001_F28NTRequest extends Anexo {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}
