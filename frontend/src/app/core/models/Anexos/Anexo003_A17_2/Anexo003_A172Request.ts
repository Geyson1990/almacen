import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo003_A17_2/MetaData';

export class Anexo003_A172Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }