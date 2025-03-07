export class Foto {
    static #getByIdStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteStmt = null;

    static initStatements(db) {
        if (this.#getByIdStmt !== null) return;

        this.#getByIdStmt = db.prepare('SELECT * FROM Fotos WHERE id = @id');
        this.#insertStmt = db.prepare('INSERT INTO Fotos(nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido) VALUES (@nombre, @descripcion, @fecha, @puntuacion, @estado, @id_usuario, @id_foro, @contenido)');
        this.#updateStmt = db.prepare('UPDATE Fotos SET nombre = @nombre, descripcion = @descripcion, puntuacion = @puntuacion, estado = @estado, contenido = @contenido WHERE id = @id');
        this.#deleteStmt = db.prepare('DELETE FROM Fotos WHERE id = @id');
    }

    static getFotoById(id) {
        const foto = this.#getByIdStmt.get({ id });
        if (!foto) throw new FotoNoEncontrada(id);

        return new Foto(foto.id, foto.nombre, foto.descripcion, foto.fecha, foto.puntuacion, foto.estado, foto.id_usuario, foto.id_foro, foto.contenido);
    }

    static #insert(foto) {
        let result = null;
        try {
            const { nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido } = foto;
            const datos = { nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido };
            result = this.#insertStmt.run(datos);
            foto.id = result.lastInsertRowid;
        } catch (e) {
            throw new ErrorDatos('No se ha insertado la foto', { cause: e });
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

    constructor(id, nombre, descripcion, fecha, puntuacion = 0, estado = 'Visible', id_usuario, id_foro, contenido) {
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
}

export class FotoNoEncontrada extends Error {
    constructor(id, options) {
        super(`Foto no encontrada: ${id}`, options);
        this.name = 'FotoNoEncontrada';
    }
}

export class ErrorDatos extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'ErrorDatos';
    }
}