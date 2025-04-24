// Definición de tipos de mensaje
export const MessageType = Object.freeze({
    ORIGINAL: 'O', // Mensaje original (post principal)
    REPLY: 'R'     // Respuesta a otro mensaje
});

/**
 * Clase que representa un mensaje en el foro (puede ser original o respuesta)
 * Usa campos privados (#) para encapsulamiento
 */
export class ForumMessage {
    static #insertStmt = null;
    static #deleteStmt = null;
    static #getCommentsById = null;

    static initStatements(db) {
        this.#insertStmt = db.prepare('INSERT INTO Comentarios(id_foro, contenido, fecha, id_usuario, username) VALUES (@forumId, @content, @date, @userId, @username)');
        this.#deleteStmt = db.prepare('DELETE FROM Comentarios WHERE id = @id');
        this.#getCommentsById = db.prepare('SELECT * FROM Comentarios WHERE id_foro = @id_foro');   
    }

    static #insert(comentario) {
            let result = null;
            try {
                const forumId = comentario.#forumId;
                const content = comentario.#content;
                const date = comentario.#date;
                const userId = comentario.#userId;
                const username = comentario.#username;
                const datos = {forumId, content, date, userId, username};
    
                result = this.#insertStmt.run(datos);
    
                comentario.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                throw new Error('No se ha podido comentar', { cause: e });
            }
            return comentario;
    }

    static #delete(idComment) {
        let result = null;
        try {
            const id = idComment;
            result = this.#deleteStmt.run({ id: idComment });
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            throw new Error('No se ha podido eliminar el comentario', { cause: e });
        }
    }

    #id;
    #forumId;
    #content;
    #date;
    #userId;
    #username;
    //#type;
    //#replies;
    //#parentId;

    constructor(forumId, content, date, userId, username, id = null) {
        if (id !== null) {
            this.#id = id;  // Comentario existente
        } else {
            this.#id = null;  // Comentario nuevo
        }
        /*
        if (!Object.values(MessageType).includes(type)) {
            throw new Error(`Tipo de mensaje inválido: ${type}`);
        }
        
        if (type === MessageType.REPLY && !parentId) {
            throw new Error("Los mensajes de respuesta deben tener un parentId");
        }
        */
        this.#forumId = forumId;
        this.#content = content;
        this.#date = date;
        this.#userId = userId;
        this.#username = username;
        //this.#type = type;
        //this.#parentId = parentId;
        //this.#replies = []; // Array para almacenar respuestas directas
    }

    // Getters (solo lectura)
    get id() { return this.#id; }
    get forumId() { return this.#forumId; }
    get content() { return this.#content; }
    get date() { return this.#date; }
    get userId() { return this.#userId; }
    get username() { return this.#username; }
    //get type() { return this.#type; }
    //get parentId() { return this.#parentId; }
    //get replies() { return [...this.#replies]; } // Devuelve copia para evitar modificaciones externas
    //get replyCount() { return this.#replies.length; }

    // Setters con validación
    set content(newContent) { 
        if (typeof newContent === 'string' && newContent.trim().length > 0) {
            this.#content = newContent.trim(); 
        } else {
            throw new Error("El contenido no puede estar vacío");
        }
    }

    /**
     * Añade una respuesta a este mensaje
     * @param {ForumMessage} reply - La respuesta a añadir
     * @returns {ForumMessage} - Retorna this para encadenamiento
     */
    addReply() {
        /*
        if (!(reply instanceof ForumMessage)) {
            throw new Error("Solo se pueden agregar instancias de ForumMessage como respuestas");
        }
        if (reply.type !== MessageType.REPLY) {
            throw new Error("Solo se pueden agregar mensajes de tipo RESPUESTA");
        }
        if (reply.parentId !== this.id) {
            throw new Error("La respuesta debe referenciar a este mensaje como padre");
        }
        */
        
        //this.#replies.push(reply);
        return this.persist();
    }

    /**
     * Elimina una respuesta por su ID
     * @param {number} replyId - ID de la respuesta a eliminar
     * @returns {boolean} - True si se eliminó, false si no se encontró
     */
    removeReply(replyId) {
        /*
        const reply = this.#replies.find(reply => reply.id === replyId);
        if (reply) {
            this.#replies = this.#replies.filter(r => r.id !== replyId);
            ForumMessage.#delete(reply); // Eliminar de la base de datos
            return true;
        }
        return false;
        */
    }

    /**
     * Busca una respuesta específica por ID
     * @param {number} replyId - ID de la respuesta a buscar
     * @returns {ForumMessage|null} - La respuesta encontrada o null
     */
    findReply(replyId) {
        //return this.#replies.find(reply => reply.id === replyId) || null;
        console.log("FUNCION POR REFACTORIZAR");

    }

    /**
     * Verifica si el mensaje tiene respuestas
     * @returns {boolean}
     */
    hasReplies() {
        //return this.#replies.length > 0;
        console.log("FUNCION POR REFACTORIZAR"); //Refactorizar usando la funcion de getCommentsById
        return false;
    }

    persist() {
        if(this.#id === null) return ForumMessage.#insert(this);
    }

    static getComments( id_foro ) {
        // Ejecutamos la consulta que obtiene todos los foros
        const rows = this.#getCommentsById.all( {id_foro} );
        
        // Si no se encuentran foros, retornamos un arreglo vacío
        if (!rows || rows.length === 0) {
            return [];
        }

        // Mapeamos las filas obtenidas de la base de datos y las convertimos en instancias de Forum
        return rows.map(comment => new ForumMessage(comment.id_foro, comment.contenido, comment.fecha, comment.id_usuario, comment.username, comment.id));
    }

    dame_comentarios( id_foro ){
        return ForumMessage.getComments( id_foro );
    }

    
    static deleteComment(idComment) {
        ForumMessage.#delete(idComment);
    }
    // Métodos de fábrica estáticos para creación controlada de mensajes

    static createComment(forumId, content, data, userId, username){
        return new ForumMessage(forumId, content, data, userId, username);
    }
    
    /**
     * Crea un mensaje original (post principal)
     */
    static createOriginal(id, forumId, content, date, userId) {
        return new ForumMessage(id, forumId, content, date, userId, MessageType.ORIGINAL);
    }

    /**
     * Crea una respuesta a otro mensaje
     */
    static createReply(id, forumId, content, date, userId, parentId) {
        return new ForumMessage(id, forumId, content, date, userId, MessageType.REPLY, parentId);
    }
}








/**
 * Clase que maneja la colección completa de mensajes en un foro
 * Usa un Map para almacenar mensajes por ID y optimizar búsquedas
 */
export class Forum {

    static #getAllStmt = null;
    static #getByTituloStmt = null;
    static #getByIdStmt = null;
    static #insertStmt = null;
    static #deleteStmt = null;
    #messages = new Map(); // Almacena todos los mensajes por ID


    static initStatements(db) {
        if (this.#getByTituloStmt !== null) return;

        this.#getAllStmt = db.prepare('SELECT * FROM Foros');
        this.#getByTituloStmt = db.prepare('SELECT * FROM Foros WHERE titulo = @titulo');
        this.#getByIdStmt = db.prepare('SELECT * FROM Foros F WHERE id = @id');
        this.#insertStmt = db.prepare('INSERT INTO Foros(titulo, descripcion, estado, username) VALUES (@titulo, @descripcion, @estado, @username)');
        this.#deleteStmt = db.prepare('DELETE FROM Foros WHERE id = @id');
    }


    static getForoByTitulo(titulo) {
            //REFACTORIZAR
    }
    
        static #insert(forum) {
            let result = null;
            try {
                const titulo = forum.#titulo;
                const descripcion = forum.#descripcion;
                const estado = forum.#estado;
                const username = forum.#username;
                const datos = {titulo, descripcion, estado, username};
    
                result = this.#insertStmt.run(datos);
    
                forum.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                console.log(e);
                throw new Error('No se ha podido crear el foro', { cause: e });
            }
            return forum;
        }

        static #delete(forum) {
            let result = null;
            try {
                const titulo = forum.#titulo;
                const descripcion = forum.#descripcion;
                const estado = forum.#estado;
                const datos = {titulo, descripcion, estado};
    
                result = this.#deleteStmt.run(datos);
    
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                throw new Error('No se ha podido eliminar el foro', { cause: e });
            }
            return forum;
        }

        static getForumById(id) {
            console.log("Entro en getForumById")
            const forum = this.#getByIdStmt.get({ id });
            if (!forum) throw new Error('Foro no encontrado');
            return new Forum(forum.titulo, forum.descripcion, forum.estado, forum.username, forum.id);
        }

        static getForums() {
            // Ejecutamos la consulta que obtiene todos los foros
            const rows = this.#getAllStmt.all();
            
            // Si no se encuentran foros, retornamos un arreglo vacío
            if (!rows || rows.length === 0) {
                return [];
            }
    
            // Mapeamos las filas obtenidas de la base de datos y las convertimos en instancias de Forum
            return rows.map(forum => new Forum(forum.titulo, forum.descripcion, forum.estado, forum.username, forum.id));
        }

        dame_foros(){
            return Forum.getForums();
        }

        dame_id(id){
            return Forum.getForumById(id);
        }

    /**
     * Crea y añade un mensaje original al foro
     */
    createPost(forumId, content, date, userId, username) {
        const post = ForumMessage.createComment(forumId, content, date, userId, username);
        //this.#messages.set(id, post);
        return post.addReply();
    }

    /**
     * Crea y añade una respuesta a un mensaje existente
     */
    createReply(id, forumId, content, date, userId, parentId) {
        const parent = this.#messages.get(parentId);
        if (!parent) throw new Error("Mensaje padre no encontrado");

        const reply = ForumMessage.createReply(id, forumId, content, date, userId, parentId);
        this.#messages.set(id, reply);
        parent.addReply(reply);
        return reply;
    }

    /**
     * Añade un mensaje ya creado (útil para importar datos)
     */
    addMessage(message) {
        if (!(message instanceof ForumMessage)) {
            throw new Error("Solo se pueden agregar instancias de ForumMessage");
        }

        this.#messages.set(message.id, message);

        // Si es respuesta, la añadimos al padre
        if (message.type === MessageType.REPLY) {
            const parent = this.#messages.get(message.parentId);
            if (parent) {
                parent.addReply(message);
            }
        }
        
        return this;
    }

    /**
     * Elimina un mensaje y todas sus respuestas (si es original)
     */
    deleteMessage(id) {
        const message = this.#messages.get(id);
        if (!message) return false;
        
        // Si es original, eliminamos sus respuestas recursivamente
        if (message.type === MessageType.ORIGINAL) {
            for (const reply of message.replies) {
                this.deleteMessage(reply.id);  // Eliminar respuestas
            }
        }
        
        // Si es respuesta, la eliminamos del array de replies del padre
        if (message.type === MessageType.REPLY) {
            const parent = this.#messages.get(message.parentId);
            if (parent) {
                parent.removeReply(id);  // Eliminar respuesta del padre
            }
        }
        
        // Elimina el mensaje de la base de datos
        message.delete();  // Llamar al método delete de ForumMessage
        
        // Después de eliminar el mensaje, lo eliminamos del mapa de mensajes
        this.#messages.delete(id);
        
        return true;
    }


    createForum(titulo, descripcion, estado, username) {
        // Validación básica de los parámetros
        if (!titulo || !descripcion || !estado) {
            if(!estado && titulo && descripcion) console.log("Me falta estado, pero todo lo demas esta OK.")
            throw new Error("Todos los campos son obligatorios");
        }

        // Crear una nueva instancia de Forum
        const foro = new Forum(titulo, descripcion, estado, username);

        // Llamar al método persist() para guardar el foro en la base de datos
        foro.persist();

        // Retornar el foro creado
        return foro;
    }

    
    

    /**
    * Elimina un foro y todos sus mensajes (originales y respuestas)
    */
    deleteForum() {
        // Elimina todos los mensajes asociados al foro
        for (const message of this.#messages.values()) {
            this.deleteMessage(message.id);  // Eliminar el mensaje y sus respuestas
        }

        // Eliminar el foro de la base de datos
        Forum.#delete(this);
        return true;
    }   

    

    /**
     * Obtiene un mensaje por su ID
     */
    getMessage(id) {
        return this.#messages.get(id);
    }

    /**
     * Obtiene todos los mensajes originales (posts principales)
     */
    getOriginalPosts() {
        return Array.from(this.#messages.values())
            .filter(msg => msg.type === MessageType.ORIGINAL);
    }

    #id;
    #titulo;
    #descripcion;
    #estado;
    #username;

    constructor(titulo, descripcion, estado, username, id = null) {
        if (id !== null) {
            this.#id = id;  // Foro existente
        } else {
            this.#id = null;  // Foro nuevo
        }

        this.#titulo = titulo;
        this.#descripcion = descripcion;
        this.#estado = estado;
        this.#username = username;
    }

    get id() {
        return this.#id;
    }

    get titulo() {
        return this.#titulo;
    }

    get descripcion() {
        return this.#descripcion;
    }

    get estado() {
        return this.#estado;
    }

    get username() {
        return this.#username;
    }

    persist() {
        if (this.#id === null) return Forum.#insert(this);
    }

}

export class ForoNoEncontrado extends Error {
    /**
     * 
     * @param {string} titulo 
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Foro no encontrado: ${titulo}`, options);
        this.name = 'ForoNoEncontrado';
    }
}

export class ForoNoEncontradoPorID extends Error {
    constructor(id, options) {
        super(`La ID no corresponde con ningun foro: ${id}`, options);
        this.name = 'ForoNoEncontradoID';
    }
}