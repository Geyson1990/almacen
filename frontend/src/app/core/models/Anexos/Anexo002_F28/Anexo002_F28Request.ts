import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_F28/MetaData';

export class Anexo002_F28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }