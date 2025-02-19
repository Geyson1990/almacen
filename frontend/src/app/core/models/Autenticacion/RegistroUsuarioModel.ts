import { UsuarioModel } from './UsuarioModel';
import { PersonaNaturalModel } from './PersonaNaturalModel';
import { PersonaJuridicaModel } from './PersonaJuridicaModel';
import { RepresentanteLegalModel } from './RepresentanteLegalModel';

export class RegistroUsuarioModel {
    usuario: UsuarioModel;
    persona: PersonaNaturalModel;
    empresa: PersonaJuridicaModel;
    repLegal: Array<RepresentanteLegalModel>;
}
