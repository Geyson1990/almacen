export class Comment {
    public idobshistjson: number = 0;
    public iddetobshistjson: number = 0;
    public capitulo: string = '';
    public codMovComentario: number = 0;
    public codMaeSolicitud: number = 0;
    public codMovSolicitud: number = 0;
    public codMovPersona: number = 0;
    public nombresPersona: string = '';
    public comentario: string = '';
    public codMovComentPadre: number = 0;
    public respuestas: number = 0;
    public listaRespuestas: Comment[] = [];
    public regUsuaRegistra: number = 0;
    public estado: number = 1;
    public fechRegistra: string = '';
    public orden: number = 0;
    public iddetobshistjsonpadre: number = 0;
    public numRespuestas: number = 0;
    public estadoobservacion: number;
    public descripcionCapitulo: string = '';
}