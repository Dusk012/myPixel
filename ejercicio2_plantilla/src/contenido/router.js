import express from 'express';
import { body } from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { config } from '../config.js';
import asyncHandler from 'express-async-handler';

import { normal, gestionPuntuacion, viewDesafios, viewShop, viewCoordinador, viewAdmin } from './controllers.js';

import { Foto } from '../imagenes/imagenes.js';
import { Desafio } from './desafios.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', autenticado(null), asyncHandler(normal));
contenidoRouter.post('/normal', express.json(), autenticado(null), asyncHandler(gestionPuntuacion));
contenidoRouter.get('/desafios', autenticado(null), asyncHandler(viewDesafios));

contenidoRouter.get('/tienda', autenticado(null), asyncHandler(viewShop));

contenidoRouter.get('/coordinador', autenticado(null), asyncHandler(viewCoordinador));

contenidoRouter.get('/admin', autenticado(null), asyncHandler(viewAdmin));

contenidoRouter.get('/likes/global', (req, res) => {
    const globalLikes = Foto.obtenerGlobalLikes();
    res.json({ globalLikes });
});

// Nueva ruta para crear desafíos
contenidoRouter.post(
    '/desafios/crear',
    express.json(),
    autenticado('A'), // Solo administradores pueden crear desafíos
    asyncHandler(async (req, res) => {
        const { puntuacionObjetivo, descripcion, tipo } = req.body;

        try {
            // Obtener el ID del usuario desde la sesión
            const id_usuario = req.session?.userId;

            if (!id_usuario) {
                return res.status(400).json({ success: false, error: 'ID de usuario no encontrado en la sesión' });
            }

            // Crear el nuevo desafío
            const nuevoDesafio = new Desafio(
                puntuacionObjetivo,
                descripcion,
                tipo,
                new Date().toISOString(),
                id_usuario // Asociar el desafío al usuario de la sesión
            );
            nuevoDesafio.persist();

            // Redirigir con un mensaje de éxito
            res.redirect('/contenido/desafios?mensaje=Desafío creado con éxito');
        } catch (error) {
            console.error('Error al crear el desafío:', error);
            res.status(500).json({ success: false, error: 'Error al crear el desafío' });
        }
    })
);

contenidoRouter.delete('/desafios/:id', autenticado('A'), async (req, res) => {
  const { id } = req.params;

  try {
    // Llama al método para eliminar el desafío de la base de datos
    await Desafio.deleteById(id);
    res.status(200).send('Desafío eliminado');
  } catch (error) {
    console.error('Error al borrar el desafío:', error);
    res.status(500).send('Error al borrar el desafío');
  }
});

export default contenidoRouter;