import express from 'express';
import { body } from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { viewLogin, perfilGet, actualizarFotoPerfil, darseDeBaja, doLogin, doLogout, viewSubmit, doSubmit, viewRegister, doRegister, sendComment } from './controllers.js';
import asyncHandler from 'express-async-handler';

const usuariosRouter = express.Router();



usuariosRouter.get('/login', autenticado(null), asyncHandler(viewLogin));
usuariosRouter.post('/login', autenticado(null, 'paginas/contenido/index'), 
    body('username', 'No puede ser vacío').trim().notEmpty(), 
    body('password', 'No puede ser vacío').trim().notEmpty(), 
    asyncHandler(doLogin));
usuariosRouter.get('/logout', asyncHandler(doLogout));

usuariosRouter.get('/submit', asyncHandler(viewSubmit));
usuariosRouter.post('/submit', asyncHandler(doSubmit));

usuariosRouter.post('/comentar'/*, validateComment*/, asyncHandler(sendComment));

usuariosRouter.get('/register', autenticado(null, '/paginas/contenido/index'), asyncHandler(viewRegister));
usuariosRouter.post('/register', 
    body('username', 'Sólo puede contener números y letras').trim().matches(/^[A-Z0-9]*$/i), 
    body('username', 'No puede ser vacío').trim().notEmpty(), 
    body('nombre', 'No puede ser vacío').trim().notEmpty(), 
    body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 }), 
    body('confirmPassword', 'La contraseña no coincide').custom((value, { req }) => {
    return value === req.body.password;
})
, asyncHandler(doRegister));

// Ruta para actualizar la foto de perfil
usuariosRouter.get('/perfil', asyncHandler(perfilGet));
usuariosRouter.post('/perfil', asyncHandler(actualizarFotoPerfil));
usuariosRouter.post('/darseDeBaja', asyncHandler(darseDeBaja));

export default usuariosRouter;
