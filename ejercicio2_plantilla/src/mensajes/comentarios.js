export class ForumMessage {
    static #insertStmt = null;
    static #deleteStmt = null;
    static #getCommentsById = null;
    static #editStmt = null;

    static initStatements(db) {
        this.#insertStmt = db.prepare('INSERT INTO Comentarios(id_foro, contenido, fecha, id_usuario, username) VALUES (@forumId, @content, @date, @userId, @username)');
        this.#deleteStmt = db.prepare('DELETE FROM Comentarios WHERE id = @id');
        this.#getCommentsById = db.prepare('SELECT * FROM Comentarios WHERE id_foro = @id_foro ORDER BY id DESC'); 
        this.#editStmt = db.prepare('UPDATE Comentarios SET contenido = @comentario, editado = \'S\' WHERE id = @id');
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

    static #edit(idComment, comment) {
        let result = null;
        try {
            const id = idComment;
            const comentario = comment;
            const datos = {id, comentario};
            result = this.#editStmt.run(datos);
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            throw new Error('No se ha podido editar el comentario', { cause: e });
        }
    }

    #id;
    #forumId;
    #content;
    #date;
    #userId;
    #username;
    #editado;

    constructor(forumId, content, date, userId, username, id = null, editado = 'N') {
        if (id !== null) {
            this.#id = id;  // Comentario existente
        } else {
            this.#id = null;  // Comentario nuevo
        }
        this.#forumId = forumId;
        this.#content = content;
        this.#date = date;
        this.#userId = userId;
        this.#username = username;
        this.#editado = editado;
    }

    // Getters (solo lectura)
    get id() { return this.#id; }
    get forumId() { return this.#forumId; }
    get content() { return this.#content; }
    get date() { return this.#date; }
    get userId() { return this.#userId; }
    get username() { return this.#username; }
    get editado() { return this.#editado; }

    /**
     * Añade una respuesta a este mensaje
     * @returns {ForumMessage} - Retorna this para persistir los datos
     */

    addReply() {
        return this.persist();
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
        return rows.map(comment => new ForumMessage(comment.id_foro, comment.contenido, comment.fecha, comment.id_usuario, comment.username, comment.id, comment.editado));
    }

    dame_comentarios( id_foro ){
        return ForumMessage.getComments( id_foro );
    }


    static editComment(idComment, comment) {
        ForumMessage.#edit(idComment, comment);
    }
    
    static deleteComment(idComment) {
        ForumMessage.#delete(idComment);
    }
    // Métodos de fábrica estáticos para creación controlada de mensajes

    static createComment(forumId, content, data, userId, username){
        return new ForumMessage(forumId, content, data, userId, username);
    }

    static deleteCommentsByForumId(forumId) {
        const comentarios = this.getComments(forumId);
        for (const comentario of comentarios) {
            this.#delete(comentario.id);
        }
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


    static initStatements(db) {
        if (this.#getByTituloStmt !== null) return;

        this.#getAllStmt = db.prepare('SELECT * FROM Foros ORDER BY id DESC');
        this.#getByTituloStmt = db.prepare('SELECT * FROM Foros WHERE titulo LIKE @titulo ORDER BY id DESC');
        this.#getByIdStmt = db.prepare('SELECT * FROM Foros F WHERE id = @id ORDER BY id DESC');
        this.#insertStmt = db.prepare('INSERT INTO Foros(titulo, descripcion, estado, username) VALUES (@titulo, @descripcion, @estado, @username)');
        this.#deleteStmt = db.prepare('DELETE FROM Foros WHERE id = @id');
    }

    static getForosByTitulo(foro) {
        // Ejecutamos la consulta que obtiene todos los foros
        const titulo = foro + '%';
        const rows = this.#getByTituloStmt.all({titulo});
            
        // Si no se encuentran foros, retornamos un arreglo vacío
        if (!rows || rows.length === 0) {
            return [];
        }

        // Mapeamos las filas obtenidas de la base de datos y las convertimos en instancias de Forum
        return rows.map(forum => new Forum(forum.titulo, forum.descripcion, forum.estado, forum.username, forum.id));
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
                throw new Error('No se ha podido crear el foro', { cause: e });
            }
            return forum;
        }

        static #delete(id_foro) {
            let result = null;
            try {
                result = this.#deleteStmt.run({id: id_foro});
    
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                throw new Error('No se ha podido eliminar el foro', { cause: e });
            }
            return;
        }

        static getForumById(id) {
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

        dame_foros_por_titulo(titulo){
            return Forum.getForosByTitulo(titulo);
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
        return post.addReply();
    }


    createForum(titulo, descripcion, estado, username) {
        // Validación básica de los parámetros
        if (!titulo || !descripcion || !estado) {
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
        // Elimina todos los comentarios asociados al foro
        ForumMessage.deleteCommentsByForumId(this.#id);
    
        // Elimina el foro de la base de datos
        Forum.#delete(this.#id);
        return true;
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
