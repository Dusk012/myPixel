import { getConnection } from '../data/db.js'; // Importar la conexión

// Obtener comentarios de un foro
export function obtenerComentarios(id_foro) {
    try {
        const db = getConnection(); // Obtener conexión
        const comentarios = db.prepare('SELECT * FROM Comentarios WHERE id_foro = ?').all(id_foro);
        return comentarios;
    } catch (error) {
        throw new Error('Error al obtener comentarios');
    }
}

// Agregar un comentario a un foro
export function agregarComentario(id_foro, contenido, id_usuario) {
    try {
        const db = getConnection(); // Obtener conexión
        db.prepare('INSERT INTO Comentarios (id_foro, contenido, fecha, id_usuario) VALUES (?, ?, datetime("now"), ?)').run(id_foro, contenido, id_usuario);
    } catch (error) {
        throw new Error('Error al agregar comentario');
    }
}
