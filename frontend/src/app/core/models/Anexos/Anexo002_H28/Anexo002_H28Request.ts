import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_H28/MetaData';

export class Anexo002_H28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }