import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_D28/MetaData';

export class Anexo002_D28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }