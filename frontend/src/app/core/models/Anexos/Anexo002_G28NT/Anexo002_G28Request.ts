import { Anexo } from '../AnexoMain';
import { MetaData } from '../Anexo002_G28NT/MetaData';

export class Anexo002_G28Request extends Anexo {
    metaData: MetaData;
    
    constructor() {
      super();
      this.metaData = new MetaData();
    }
  }