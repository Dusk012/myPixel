import express from 'express';
import { viewContenidoAdmin, viewContenidoNormal } from './controllers.js';
import { autenticado, tieneRol } from '../middleware/auth.js';
import { RolesEnum } from '../usuarios/Usuario.js';

const contenidoRouter = express.Router();

contenidoRouter.use(autenticado('/usuarios/login'));

contenidoRouter.get('/normal', viewContenidoNormal);

contenidoRouter.get('/admin', tieneRol(RolesEnum.ADMIN), viewContenidoAdmin);

export default contenidoRouter;