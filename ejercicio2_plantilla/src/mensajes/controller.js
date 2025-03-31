import { Foro } from '../models/Foro.js';
import { getConnection } from '../db.js';

// Obtener lista de foros
export const obtenerForos = (req, res) => {
    try {
        const foros = Foro.getAll();
        res.json(foros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los foros' });
    }
};

// Obtener un foro por ID
export const verForo = (req, res) => {
    const { id } = req.params;
    const db = getConnection();

    try {
        // Intentar obtener el foro por su ID
        const foro = db.prepare('SELECT * FROM Foros WHERE id = ?').get(id);

        // Si no se encuentra el foro, se renderiza la vista pasando foro como null
        if (!foro) {
            return res.render('paginas/foro/foro', { foro: null, comentarios: [] });
        }

        // Si se encuentra el foro, obtener también sus comentarios
        const comentarios = db.prepare('SELECT * FROM Comentarios WHERE id_foro = ?').all(id);

        // Renderizar la vista pasando foro y comentarios
        res.render('paginas/foro/foro', { foro, comentarios });
    } catch (error) {
        console.error('Error al obtener el foro:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Crear un nuevo foro
export const crearForo = (req, res) => {
    const { titulo, descripcion, id_usuario } = req.body;

    if (!titulo || !id_usuario) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        const foro = new Foro(null, titulo, descripcion, 'activo', id_usuario);
        foro.save();
        res.redirect(`/contenido/foro/${foro.id}`);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el foro' });
    }
};

export const crearForoView = (req, res) => {
    // Renderiza la vista para crear un nuevo foro
    res.render('paginas/foro/foro', { foro: null, comentarios: [] });
};

