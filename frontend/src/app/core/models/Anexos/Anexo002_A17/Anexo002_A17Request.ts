import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_A17/MetaData';

export class Anexo002_A17Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }