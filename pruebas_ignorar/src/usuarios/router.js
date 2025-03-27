import { body } from 'express-validator';
import express from 'express';
import { viewLogin, doLogin, doLogout, viewHome, viewRegistro, doRegistro } from './controllers.js';
import { autenticado } from '../middleware/auth.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', autenticado(null), viewLogin);
usuariosRouter.post('/login', autenticado(null, '/usuarios/home'), doLogin);
usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/home', autenticado('/usuarios/home'), viewHome);
usuariosRouter.get('/registro', autenticado(null, '/usuarios/home'), viewRegistro);
usuariosRouter.post('/registro'
    , body('username', 'Sólo puede contener números y letras').trim().matches(/^[A-Z0-9]*$/i)
    , body('username', 'No puede ser vacío').trim().notEmpty()
    , body('nombre', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 })
    , body('passwordConfirmacion', 'La contraseña no coincide').custom((value, { req }) => {
        return value === req.body.password;
    })
    , doRegistro);


export default usuariosRouter;