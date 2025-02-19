import { A001_H17_DeclaracionJurada } from './Secciones';

export class MetaData {    
    declaracionJurada: A001_H17_DeclaracionJurada;
    pathName: string;
    archivo: File;
    constructor() {
        this.declaracionJurada = new A001_H17_DeclaracionJurada();
    }
}