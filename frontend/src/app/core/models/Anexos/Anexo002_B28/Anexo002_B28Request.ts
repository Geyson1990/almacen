import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_B28/MetaData';

export class Anexo002_B28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }