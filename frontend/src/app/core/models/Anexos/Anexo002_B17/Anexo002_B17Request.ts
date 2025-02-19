import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_B17/MetaData';

export class Anexo002_B17Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }