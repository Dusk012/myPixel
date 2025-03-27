import express from 'express';
import { body} from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { viewLogin, doLogin, doLogout, viewSubmit, doSubmit, viewRegister, doRegister, sendComment/*, validateComment*/ } from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', autenticado(null), viewLogin);
usuariosRouter.post('/login', autenticado(null, 'paginas/contenido/index'), 
    body('username', 'No puede ser vacío').trim().notEmpty(), 
    body('password', 'No puede ser vacío').trim().notEmpty(), 
    doLogin);
usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/submit', viewSubmit);
usuariosRouter.post('/submit', doSubmit);

usuariosRouter.post('/comentar'/*, validateComment*/, sendComment);

usuariosRouter.get('/register', autenticado(null, '/paginas/contenido/index'), viewRegister);
usuariosRouter.post('/register', 
    body('username', 'Sólo puede contener números y letras').trim().matches(/^[A-Z0-9]*$/i), 
    body('username', 'No puede ser vacío').trim().notEmpty(), 
    body('nombre', 'No puede ser vacío').trim().notEmpty(), 
    body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 }), 
    body('confirmPassword', 'La contraseña no coincide').custom((value, { req }) => {
    return value === req.body.password;
})
, doRegister);

export default usuariosRouter;