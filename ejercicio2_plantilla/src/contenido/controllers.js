export class Desafio {
    static #insertStmt = null;
    static #deleteStmt = null;
    static #updateStmt = null;
    static #getByIdStmt = null;
    static #getAllStmt = null;
    static #deleteByIdStmt = null;
    static #insertDefaultDesafiosStmt = null;
    static #updatePuntosStmt = null;
    static #deleteByUserStmt = null;
    static #deleteByDescripcionYTipoStmt = null;

    static initStatements(db) {
        this.#insertStmt = db.prepare(
            'INSERT INTO Desafío (puntuacionObjetivo, descripcion, tipo, fecha, id_usuario) VALUES (@puntuacionObjetivo, @descripcion, @tipo, @fecha, @id_usuario)'
        );
        this.#deleteStmt = db.prepare('DELETE FROM Desafío WHERE id = @id');
        this.#updateStmt = db.prepare(`
            UPDATE Desafío
            SET puntuacionObjetivo = @puntuacionObjetivo,
                descripcion = @descripcionNueva,
                tipo = @tipoNuevo
            WHERE descripcion = @descripcion AND tipo = @tipo
        `);
        this.#getByIdStmt = db.prepare('SELECT * FROM Desafío WHERE id = @id');
        this.#getAllStmt = db.prepare('SELECT * FROM Desafío');
        this.#deleteByIdStmt = db.prepare('DELETE FROM Desafío WHERE id = ?');
        this.#insertDefaultDesafiosStmt = db.prepare(`
            INSERT INTO "Desafío" ("puntos", "puntuacionObjetivo", "id_usuario", "descripcion", "tipo", "fecha")
            VALUES (?, ?, ?, ?, ?, ?)`
        );
        this.#updatePuntosStmt = db.prepare(`
            UPDATE "Desafío"
            SET puntos = puntos + 1
            WHERE id_usuario = ? AND tipo = ? AND puntos < puntuacionObjetivo`
        );
        this.#deleteByUserStmt = db.prepare(`
            DELETE FROM "Desafío"
            WHERE id_usuario = ?
        `);
        this.#deleteByDescripcionYTipoStmt = db.prepare(`
            DELETE FROM Desafío
            WHERE descripcion = @descripcion AND tipo = @tipo
        `);
    }

    static #insert(desafio) {
        try {
            const datos = {
                puntuacionObjetivo: desafio.#puntuacionObjetivo,
                descripcion: desafio.#descripcion,
                tipo: desafio.#tipo,
                fecha: desafio.#fecha,
                id_usuario: desafio.#id_usuario,
            };
            const result = this.#insertStmt.run(datos);
            desafio.#id = result.lastInsertRowid;
            return desafio;
        } catch (e) {
            throw new Error('No se pudo crear el desafío', { cause: e });
        }
    }

    static #delete(desafio) {
        try {
            const datos = { id: desafio.#id };
            this.#deleteStmt.run(datos);
            return true;
        } catch (e) {
            throw new Error('No se pudo eliminar el desafío', { cause: e });
        }
    }

    static #update(desafio) {
        try {
            const datos = {
                id: desafio.#id,
                puntuacionObjetivo: desafio.#puntuacionObjetivo,
                descripcion: desafio.#descripcion,
                tipo: desafio.#tipo,
            };
            this.#updateStmt.run(datos);
            return desafio;
        } catch (e) {
            throw new Error('No se pudo actualizar el desafío', { cause: e });
        }
    }

    static getById(id) {
        const row = this.#getByIdStmt.get({ id });
        if (!row) throw new Error('Desafío no encontrado');
        return new Desafio(row.puntuacionObjetivo, row.descripcion, row.tipo, row.fecha, row.id_usuario, row.id);
    }

    static getAll() {
        const rows = this.#getAllStmt.all();
        return rows.map(
            (row) => new Desafio(row.puntuacionObjetivo, row.descripcion, row.tipo, row.fecha, row.id_usuario, row.id)
        );
    }

    #id;
    #puntuacionObjetivo;
    #descripcion;
    #tipo;
    #fecha;
    #id_usuario;

    constructor(puntuacionObjetivo, descripcion, tipo, fecha, id_usuario = null, id = null) {
        this.#id = id;
        this.#puntuacionObjetivo = puntuacionObjetivo;
        this.#descripcion = descripcion;
        this.#tipo = tipo;
        this.#fecha = fecha || new Date().toISOString();
        this.#id_usuario = id_usuario;
    }

    get id() {
        return this.#id;
    }

    get puntuacionObjetivo() {
        return this.#puntuacionObjetivo;
    }

    get descripcion() {
        return this.#descripcion;
    }

    get tipo() {
        return this.#tipo;
    }

    get fecha() {
        return this.#fecha;
    }

    get id_usuario() {
        return this.#id_usuario;
    }

    set puntuacionObjetivo(value) {
        if (value > 0) this.#puntuacionObjetivo = value;
        else throw new Error('La puntuación objetivo debe ser mayor a 0');
    }

    set descripcion(value) {
        if (value.trim().length > 0) this.#descripcion = value.trim();
        else throw new Error('La descripción no puede estar vacía');
    }

    set tipo(value) {
        if ([0, 1, 2].includes(value)) this.#tipo = value;
        else throw new Error('Tipo inválido');
    }

    persist() {
        if (this.#id === null) return Desafio.#insert(this);
        else return Desafio.#update(this);
    }

    delete() {
        return Desafio.#delete(this);
    }

    static async getByUserId(userId) {
        try {
            const rows = this.#getAllStmt.all(); // Asegúrate de que initStatements esté configurado
            return rows.filter(row => row.id_usuario === userId);
        } catch (error) {
            console.error('Error al obtener los desafíos del usuario:', error);
            throw error;
        }
    }

    static deleteById(id) {
        try {
          return this.#deleteByIdStmt.run(id);
        } catch (error) {
          console.error('Error al borrar el desafío:', error);
          throw error;
        }
    }

    static insertDefaultDesafios(userId) {
        const defaultDesafios = [
            { puntuacionObjetivo: 10, descripcion: '¡Da 10 likes!', tipo: 0 },
            { puntuacionObjetivo: 50, descripcion: '¡Da 50 likes!', tipo: 0 },
            { puntuacionObjetivo: 100, descripcion: '¡Da 100 likes!', tipo: 0 },
            { puntuacionObjetivo: 5, descripcion: '¡Sube 5 fotos!', tipo: 1 },
            { puntuacionObjetivo: 10, descripcion: '¡Sube 10 fotos!', tipo: 1 },
            { puntuacionObjetivo: 25, descripcion: '¡Sube 25 fotos!', tipo: 1 },
            { puntuacionObjetivo: 5, descripcion: '¡Escribe 5 comentarios!', tipo: 2 },
            { puntuacionObjetivo: 25, descripcion: '¡Escribe 25 comentarios!', tipo: 2 },
            { puntuacionObjetivo: 50, descripcion: '¡Escribe 50 comentarios!', tipo: 2 },
        ];

        const fecha = new Date().toISOString();

        try {
            defaultDesafios.forEach(desafio => {
                this.#insertDefaultDesafiosStmt.run(0, desafio.puntuacionObjetivo, userId, desafio.descripcion, desafio.tipo, fecha);
            });
        } catch (error) {
            console.error('Error al insertar los desafíos predeterminados:', error);
            throw error;
        }
    }

    static incrementarPuntosLikes(userId) {
        try {
            const result = this.#updatePuntosStmt.run(userId);
            if (result.changes === 0) {
                console.log('No se actualizó ningún desafío de likes (puede que ya se haya completado).');
            }
        } catch (error) {
            console.error('Error al incrementar los puntos del desafío de likes:', error);
            throw error;
        }
    }

    static incrementarPuntos(userId, tipo) {
        try {
            const result = this.#updatePuntosStmt.run(userId, tipo);
            if (result.changes === 0) {
                console.log(`No se actualizó ningún desafío del tipo ${tipo} (puede que ya se haya completado).`);
            }
        } catch (error) {
            console.error(`Error al incrementar los puntos del desafío del tipo ${tipo}:`, error);
            throw error;
        }
    }

    static eliminarDesafiosPorUsuario(userId) {
        try {
            const result = this.#deleteByUserStmt.run(userId);
            console.log(`Se eliminaron ${result.changes} desafíos del usuario con ID ${userId}`);
        } catch (error) {
            console.error('Error al eliminar los desafíos del usuario:', error);
            throw error;
        }
    }

    static modificarDesafio(id, puntuacionObjetivo, descripcion, tipo) {
        try {
            const datos = { id, puntuacionObjetivo, descripcion, tipo };
            this.#updateStmt.run(datos);
            console.log(`Desafío con ID ${id} modificado correctamente.`);
        } catch (error) {
            console.error('Error al modificar el desafío:', error);
            throw error;
        }
    }

    static modificarDesafiosPorDescripcionYTipo(descripcion, tipo, puntuacionObjetivo, descripcionNueva, tipoNuevo) {
        try {
            const datos = { descripcion, tipo, puntuacionObjetivo, descripcionNueva, tipoNuevo };
            this.#updateStmt.run(datos);
            console.log(`Desafíos con descripción "${descripcion}" y tipo ${tipo} modificados correctamente.`);
        } catch (error) {
            console.error('Error al modificar los desafíos:', error);
            throw error;
        }
    }

    static modificarDesafiosPorDescripcionYTipo(descripcion, tipo, puntuacionObjetivo, descripcionNueva, tipoNuevo) {
        try {
            const datos = {
                descripcion,
                tipo,
                puntuacionObjetivo,
                descripcionNueva,
                tipoNuevo,
            };
            this.#updateStmt.run(datos);
            console.log(`Desafíos con descripción "${descripcion}" y tipo ${tipo} modificados correctamente.`);
        } catch (error) {
            console.error('Error al modificar los desafíos:', error);
            throw error;
        }
    }

    static eliminarDesafiosPorDescripcionYTipo(descripcion, tipo) {
        try {
            const datos = { descripcion, tipo };
            this.#deleteByDescripcionYTipoStmt.run(datos);
            console.log(`Desafíos con descripción "${descripcion}" y tipo ${tipo} eliminados correctamente.`);
        } catch (error) {
            console.error('Error al eliminar los desafíos:', error);
            throw error;
        }
    }
}

export async function modificarDesafio(req, res) {
    const { puntuacionObjetivo, descripcion, tipo, descripcionNueva, tipoNuevo } = req.body;

    console.log(`Datos recibidos para modificar desafío:
        puntuacionObjetivo=${puntuacionObjetivo},
        descripcion=${descripcion},
        tipo=${tipo},
        descripcionNueva=${descripcionNueva},
        tipoNuevo=${tipoNuevo}`);

    try {
        // Actualizar todos los desafíos con la misma descripción y tipo
        Desafio.modificarDesafiosPorDescripcionYTipo(
            descripcion,
            tipo,
            puntuacionObjetivo,
            descripcionNueva,
            tipoNuevo
        );

        res.status(200).json({ success: true, message: 'Desafíos modificados para todos los usuarios' });
    } catch (error) {
        console.error('Error al modificar el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al modificar el desafío' });
    }
}
