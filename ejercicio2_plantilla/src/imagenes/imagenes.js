import { ErrorDatos } from "../db.js";

export class Foto {
    static #getByIdStmt = null;
    static #getByContenidoStmt = null;
    static #getByCreadorStmt = null;
    static #getByTitleStmt = null;
    static #getByTitleAndCreatorStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt = null;

    static initStatements(db) {
        if (this.#getByIdStmt !== null) return;

        this.#getByIdStmt = db.prepare('SELECT * FROM Fotos WHERE id = @id');
        this.#getByContenidoStmt = db.prepare('SELECT * FROM Fotos WHERE contenido = @contenido');
        this.#getByCreadorStmt = db.prepare("SELECT * FROM fotos WHERE id_usuario = @id_usuario");
        this.#getByTitleStmt = db.prepare("SELECT * FROM fotos WHERE nombre LIKE ?");
        this.#getByTitleAndCreatorStmt = db.prepare("SELECT * FROM fotos WHERE nombre LIKE ? AND id_usuario = @id_usuario");
        this.#insertStmt = db.prepare('INSERT INTO Fotos(nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido) VALUES (@nombre, @descripcion, @fecha, @puntuacion, @estado, @id_usuario, @id_foro, @contenido)');
        this.#updateStmt = db.prepare('UPDATE Fotos SET nombre = @nombre, descripcion = @descripcion, puntuacion = @puntuacion, estado = @estado, contenido = @contenido WHERE id = @id');
        this.#deleteStmt = db.prepare('DELETE FROM Fotos WHERE id = @id');
    }

    static getFotoById(id) {
        const foto = this.#getByIdStmt.get({ id });
        if (!foto) throw new FotoNoEncontrada(id);

        return new Foto(foto.id, foto.nombre, foto.descripcion, foto.fecha, foto.puntuacion, foto.estado, foto.id_usuario, foto.id_foro, foto.contenido);
    }

    static getFotoByContenido(contenido) {
        const foto = this.#getByContenidoStmt.get({ contenido });
        if (!foto) throw new FotoNoEncontrada(contenido);
        return new Foto(foto.id, foto.nombre, foto.descripcion, foto.fecha, foto.puntuacion, foto.estado, foto.id_usuario, foto.id_foro, foto.contenido);
    }

    static getFotosByCreador(id_usuario) {
        const fotos = this.#getByCreadorStmt.all({ id_usuario });
        console.log(fotos);
        if (!fotos || fotos.length === 0) return [];
        return fotos.map(foto => new Foto(foto.id, foto.nombre, foto.descripcion, foto.fecha, foto.puntuacion, foto.estado, foto.id_usuario, foto.id_foro, foto.contenido));
    }

    static getFotosByTitle(fotoPart) {
        const fotos = this.#getByTitleStmt.all([`%${fotoPart}%`]);
        console.log(fotos);
        if (!fotos || fotos.length === 0) return [];
        return fotos.map(foto => new Foto(foto.id, foto.nombre, foto.descripcion, foto.fecha, foto.puntuacion, foto.estado, foto.id_usuario, foto.id_foro, foto.contenido));
    }

    static getFotosByTitleAndCreator(fotoPart, id_usuario) {
        const fotos = this.#getByTitleAndCreatorStmt.all([`%${fotoPart}%`, id_usuario]);
        console.log(fotos);
        if (!fotos || fotos.length === 0) return [];
        return fotos.map(foto => new Foto(foto.id, foto.nombre, foto.descripcion, foto.fecha, foto.puntuacion, foto.estado, foto.id_usuario, foto.id_foro, foto.contenido));
    }

    static #insert(foto) {
        console.log("insert entrado");
        let result = null;
        try {
            const { nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido } = foto;
            const datos = { nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido };
            result = this.#insertStmt.run(datos);
            console.log("insert salido");
            foto.id = result.lastInsertRowid;
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new FotoYaExiste(foto.#nombre);
            }
            throw new ErrorDatosFoto('No se ha insertado la foto: ' + e, { cause: e });
        }
        return foto;
    }

    static #update(foto) {
        const { id, nombre, descripcion, puntuacion, estado, contenido } = foto;
        const datos = { id, nombre, descripcion, puntuacion, estado, contenido };
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new FotoNoEncontrada(id);
        return foto;
    }

    static delete(id) {
        const result = this.#deleteStmt.run({ id });
        if (result.changes === 0) throw new FotoNoEncontrada(id);
    }

    #nombre;

    constructor(id, nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.puntuacion = puntuacion;
        this.estado = estado;
        this.id_usuario = id_usuario;
        this.id_foro = id_foro;
        this.contenido = contenido;
    }

    persist() {
        if (this.id === null) return Foto.#insert(this);
        return Foto.#update(this);
    }

    static registrar(nombre, descripcion, imagen, username, id_foro) {
        
            const nuevaFoto = new Foto(null, nombre, descripcion, new Date().toISOString(), 0, 'Visible', username, id_foro, imagen);
            return nuevaFoto.persist();
    }

    static async actualizarFoto(foto) {
        return this.#update(foto);
    }
}

export class FotoNoEncontrada extends Error {
    constructor(id, options) {
        super(`Foto no encontrada: ${id}`, options);
        this.name = 'FotoNoEncontrada';
    }
}

export class ErrorDatosFoto extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'Error en los datos: ' + message + "; " + options;
    }
}

export class FotoYaExiste extends Error {
    
    constructor(nombre, options) {
        super(`Foto ya existe: ${nombre}`, options);
        this.name = 'FotoYaExiste';
    }
}