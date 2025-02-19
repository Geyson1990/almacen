import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo001_D28/MetaData';

export class Anexo001_D28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }