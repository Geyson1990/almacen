import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_C28/MetaData';

export class Anexo002_C28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }