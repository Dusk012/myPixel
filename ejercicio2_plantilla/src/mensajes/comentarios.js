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

    static initStatements(db) {
        this.#insertStmt = db.prepare('INSERT INTO Comentarios(id, forumId, content, date, userId) VALUES (@id, @forumId, @content, @date, @userId)');
        this.#deleteStmt = db.prepare('DELETE FROM Comentarios WHERE id = @id');
    }

    static #insert(comentario) {
            let result = null;
            try {
                const forumId = comentario.#forumId;
                const content = comentario.#content;
                const date = comentario.#date;
                const userId = comentario.#userId;
                const datos = {forumId, content, date, userId};
    
                result = this.#insertStmt.run(datos);
    
                comentario.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                throw new ErrorDatos('No se ha podido comentar', { cause: e });
            }
            return comentario;
    }

    static #delete(comentario) {
        console.log("delete entrado")
        let result = null;
        try {
            const id = comentario.#id;
            const forumId = comentario.#forumId;
            const content = comentario.#content;
            const date = comentario.#date;
            const userId = comentario.#userId;
            const datos = {id, forumId, content, date, userId};

            result = this.#deleteStmt.run(datos);
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            throw new ErrorDatos('No se ha podido eliminar el comentario', { cause: e });
        }
        return comentario;
}

    #id;
    #forumId;
    #content;
    #date;
    #userId;
    #type;
    #replies;
    #parentId;

    constructor(forumId, content, date, userId, type, parentId = null) {
        // Validaciones básicas
        if (!forumId || !content || !date || !userId || !type) {
            throw new Error("Todos los campos obligatorios deben ser proporcionados");
        }
        
        if (!Object.values(MessageType).includes(type)) {
            throw new Error(`Tipo de mensaje inválido: ${type}`);
        }
        
        if (type === MessageType.REPLY && !parentId) {
            throw new Error("Los mensajes de respuesta deben tener un parentId");
        }

        this.#id = null;
        this.#forumId = forumId;
        this.#content = content;
        this.#date = date;
        this.#userId = userId;
        this.#type = type;
        this.#parentId = parentId;
        this.#replies = []; // Array para almacenar respuestas directas
    }

    // Getters (solo lectura)
    get id() { return this.#id; }
    get forumId() { return this.#forumId; }
    get content() { return this.#content; }
    get date() { return this.#date; }
    get userId() { return this.#userId; }
    get type() { return this.#type; }
    get parentId() { return this.#parentId; }
    get replies() { return [...this.#replies]; } // Devuelve copia para evitar modificaciones externas
    get replyCount() { return this.#replies.length; }

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
    addReply(reply) {
        if (!(reply instanceof ForumMessage)) {
            throw new Error("Solo se pueden agregar instancias de ForumMessage como respuestas");
        }
        if (reply.type !== MessageType.REPLY) {
            throw new Error("Solo se pueden agregar mensajes de tipo RESPUESTA");
        }
        if (reply.parentId !== this.id) {
            throw new Error("La respuesta debe referenciar a este mensaje como padre");
        }
        
        this.#replies.push(reply);
        reply.persist();
        return this.persist();
    }

    /**
     * Elimina una respuesta por su ID
     * @param {number} replyId - ID de la respuesta a eliminar
     * @returns {boolean} - True si se eliminó, false si no se encontró
     */
    removeReply(replyId) {
        const reply = this.#replies.find(reply => reply.id === replyId);
        if (reply) {
            this.#replies = this.#replies.filter(r => r.id !== replyId);
            ForumMessage.#delete(reply); // Eliminar de la base de datos
            return true;
        }
        return false;
    }

    /**
     * Busca una respuesta específica por ID
     * @param {number} replyId - ID de la respuesta a buscar
     * @returns {ForumMessage|null} - La respuesta encontrada o null
     */
    findReply(replyId) {
        return this.#replies.find(reply => reply.id === replyId) || null;
    }

    /**
     * Verifica si el mensaje tiene respuestas
     * @returns {boolean}
     */
    hasReplies() {
        return this.#replies.length > 0;
    }

    persist() {
        if(this.#id === null) return ForumMessage.#insert(this);
    }

    

    // Métodos de fábrica estáticos para creación controlada de mensajes
    
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

    
    static #getByTituloStmt = null;
    static #insertStmt = null;
    static #deleteStmt = null;
    #messages = new Map(); // Almacena todos los mensajes por ID


    static initStatements(db) {
        if (this.#getByTituloStmt !== null) return;

        this.#getByTituloStmt = db.prepare('SELECT * FROM Foros WHERE titulo = @titulo');
        this.#insertStmt = db.prepare('INSERT INTO Foros(id, titulo, descripcion, estado) VALUES (@id, @titulo, @descripcion, @estado)');
        this.#deleteStmt = db.prepare('DELETE FROM Foros WHERE id = @id');
    }


    static getForoByTitulo(titulo) {
            const forum = this.#getByTituloStmt.get({ titulo });
            if (forum === undefined) throw new ForoNoEncontrado(titulo);
    
            const { id, descripcion, estado } = forum;
    
            return new Forum(id, titulo, descripcion, estado);
        }
    
        static #insert(forum) {
            let result = null;
            try {
                const titulo = forum.#titulo;
                const descripcion = forum.#descripcion;
                const estado = forum.#estado;
                const datos = {titulo, descripcion, estado};
    
                result = this.#insertStmt.run(datos);
    
                forum.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                throw new ErrorDatos('No se ha podido crear el foro', { cause: e });
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
                throw new ErrorDatos('No se ha podido eliminar el foro', { cause: e });
            }
            return forum;
        }

    /**
     * Crea y añade un mensaje original al foro
     */
    createPost(id, forumId, content, date, userId) {
        const post = ForumMessage.createOriginal(id, forumId, content, date, userId);
        this.#messages.set(id, post);
        return post;
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

    constructor(titulo, descripcion, estado) {
            this.#id = null;
            this.#titulo = titulo;
            this.#descripcion = descripcion;
            this.#estado = estado;
    }

    get id() {
        return this.#id;
    }

    get titulo() {
        return this.#titulo;
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