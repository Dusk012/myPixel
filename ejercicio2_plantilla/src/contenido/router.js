import express from 'express';
import { body} from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { config } from '../config.js';
import asyncHandler from 'express-async-handler';

import { normal, gestionPuntuacion, viewDesafios, crearDesafio, modificarDesafio, eliminarDesafio } from './controllers.js';

import { Foto } from '../imagenes/imagenes.js';
import { Desafio } from './desafios.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', autenticado(null), asyncHandler(normal));
contenidoRouter.post('/normal', express.json(), autenticado(null), asyncHandler(gestionPuntuacion));
contenidoRouter.get('/desafios', autenticado(null), asyncHandler(viewDesafios));

contenidoRouter.get('/likes/global', (req, res) => {const globalLikes = Foto.obtenerGlobalLikes();
    res.json({ globalLikes });
});

contenidoRouter.post('/desafios/crear', express.json(), autenticado('A'), asyncHandler(crearDesafio));
contenidoRouter.post('/desafios/modificar', express.json(), autenticado('A'), asyncHandler(modificarDesafio));
contenidoRouter.delete('/desafios/:id',autenticado('A') , asyncHandler(eliminarDesafio));
contenidoRouter.post('/desafios/eliminar', express.json(), autenticado('A'), asyncHandler(eliminarDesafio));

export default contenidoRouter;
