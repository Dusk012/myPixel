import { getConnection } from '../db.js';

export class Foro {
    constructor(id, titulo, descripcion, estado, id_usuario) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado || 'activo';
        this.id_usuario = id_usuario;
    }

    // Obtener todos los foros
    static getAll() {
        const db = getConnection();
        return db.prepare('SELECT * FROM Foros').all();
    }

    // Obtener un foro por ID
    static getById(id) {
        const db = getConnection();
        return db.prepare('SELECT * FROM Foros WHERE id = ?').get(id);
    }

    // Crear un nuevo foro
    save() {
        const db = getConnection();
        const stmt = db.prepare('INSERT INTO Foros (titulo, descripcion, estado, id_usuario) VALUES (?, ?, ?, ?)');
        const result = stmt.run(this.titulo, this.descripcion, this.estado, this.id_usuario);
        this.id = result.lastInsertRowid;
    }
}
