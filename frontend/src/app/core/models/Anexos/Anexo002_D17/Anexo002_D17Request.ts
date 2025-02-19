import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_D17/MetaData';

export class Anexo002_D17Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }