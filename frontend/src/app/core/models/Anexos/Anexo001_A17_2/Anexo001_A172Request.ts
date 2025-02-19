import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo001_A17_2/MetaData';

export class Anexo001_A172Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }