import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo001_A28/MetaData';

export class Anexo001_A28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }