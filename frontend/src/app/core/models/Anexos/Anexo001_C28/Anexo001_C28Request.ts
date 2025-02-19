import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo001_C28/MetaData';

export class Anexo001_C28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }