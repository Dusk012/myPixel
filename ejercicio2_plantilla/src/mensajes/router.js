import express from 'express';
import { verForo, obtenerForos, crearForo} from './controller.js';

const router = express.Router();

// Ruta para obtener la lista de foros
router.get('/foros', obtenerForos);

// Ruta para crear un foro
router.post('/foros', crearForo);

// Ruta para ver un foro en /contenido/foro/:id
router.get('contenido/foro/:id', verForo);

// Ruta para obtener comentarios de un foro específico


// Ruta para agregar un comentario en un foro específico


export default router;
