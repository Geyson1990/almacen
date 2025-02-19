import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo001_H17/MetaData';

export class Anexo001_H17Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }