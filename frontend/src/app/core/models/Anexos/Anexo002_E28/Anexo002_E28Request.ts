import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_E28/MetaData';

export class Anexo002_E28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }