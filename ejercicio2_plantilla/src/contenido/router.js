import express from 'express';
import { body} from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { config } from '../config.js';
import asyncHandler from 'express-async-handler';

import { normal, gestionPuntuacion, viewDesafios, viewShop, viewCoordinador, viewAdmin } from './controllers.js';

import { Foto } from '../imagenes/imagenes.js';

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

export default contenidoRouter;