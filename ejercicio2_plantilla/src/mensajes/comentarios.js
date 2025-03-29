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
    #id;
    #forumId;
    #content;
    #date;
    #userId;
    #type;
    #replies;
    #parentId;

    constructor(id, forumId, content, date, userId, type, parentId = null) {
        // Validaciones básicas
        if (!id || !forumId || !content || !date || !userId || !type) {
            throw new Error("Todos los campos obligatorios deben ser proporcionados");
        }
        
        if (!Object.values(MessageType).includes(type)) {
            throw new Error(`Tipo de mensaje inválido: ${type}`);
        }
        
        if (type === MessageType.REPLY && !parentId) {
            throw new Error("Los mensajes de respuesta deben tener un parentId");
        }

        this.#id = id;
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
        return this;
    }

    /**
     * Elimina una respuesta por su ID
     * @param {number} replyId - ID de la respuesta a eliminar
     * @returns {boolean} - True si se eliminó, false si no se encontró
     */
    removeReply(replyId) {
        const initialLength = this.#replies.length;
        this.#replies = this.#replies.filter(reply => reply.id !== replyId);
        return initialLength !== this.#replies.length;
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
    #messages = new Map(); // Almacena todos los mensajes por ID

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
                this.deleteMessage(reply.id);
            }
        }
        
        // Si es respuesta, la eliminamos del array de replies del padre
        if (message.type === MessageType.REPLY) {
            const parent = this.#messages.get(message.parentId);
            if (parent) {
                parent.removeReply(id);
            }
        }

        return this.#messages.delete(id);
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

}