export const TypeMessage = Object.freeze({
    ORIGINAL: 'O',
    RESPUESTA: 'R'
});

export class Mensaje {
    #id 
	#id_foro	
	#contenido  
	#fecha 
	#id_usuario
    tipo 

    constructor(id, id_foro, contenido, fecha, id_usuario, tipo = TypeMessage.ORIGINAL){
        this.#id = id;
        this.#id_foro = id_foro;
        this.#contenido = contenido;
        this.#fecha = fecha;
        this.#id_usuario = id_usuario;
    }

    get contenido() {
        return this.#contenido;
    }
}