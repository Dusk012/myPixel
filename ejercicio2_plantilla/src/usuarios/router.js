import express from 'express';
import { body} from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister, perfilGet, actualizarFotoPerfil, darseDeBaja, viewChangePassword, doChangePassword } from './controllers.js';
import asyncHandler from 'express-async-handler';

const usuariosRouter = express.Router();

// Rutas de autenticación
usuariosRouter.get('/login', autenticado(null), asyncHandler(viewLogin));
usuariosRouter.post('/login', 
    autenticado(null, 'paginas/contenido/index'), 
    body('username', 'No puede ser vacío').trim().notEmpty(), 
    body('password', 'No puede ser vacío').trim().notEmpty(), 
    asyncHandler(doLogin)
);
usuariosRouter.get('/logout', asyncHandler(doLogout));

// Rutas de registro
usuariosRouter.get('/register', autenticado(null, '/paginas/contenido/index'), asyncHandler(viewRegister));
usuariosRouter.post('/register',
    body('username', 'Sólo puede contener números y letras').trim().matches(/^[A-Z0-9]*$/i), 
    body('username', 'No puede ser vacío').trim().notEmpty(), 
    body('nombre', 'No puede ser vacío').trim().notEmpty(), 
    body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 }), 
    body('confirmPassword', 'La contraseña no coincide').custom((value, { req }) => {
        return value === req.body.password;
    }), 
    asyncHandler(doRegister)
);

// Rutas de perfil
usuariosRouter.get('/perfil', asyncHandler(perfilGet));
usuariosRouter.post('/perfil', asyncHandler(actualizarFotoPerfil));

// Ruta para darse de baja
usuariosRouter.post('/darseDeBaja', asyncHandler(darseDeBaja));


usuariosRouter.get('/cambiar-password', autenticado(), asyncHandler(viewChangePassword));
usuariosRouter.post('/cambiar-password',
    body('currentPassword', 'La contraseña actual no puede estar vacía').trim().notEmpty(),
    body('newPassword', 'La nueva contraseña debe tener entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 }),
    body('confirmPassword', 'La confirmación no coincide').custom((value, { req }) => {
        return value === req.body.newPassword;
    }),
    asyncHandler(doChangePassword)
);

export default usuariosRouter;