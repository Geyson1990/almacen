import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_A28/MetaData';

export class Anexo002_A28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }