import { validationResult, matchedData } from 'express-validator';
import { Usuario, RolesEnum } from './usuarios.js';
import usuariosRouter from './router.js';
import { render } from '../utils/render.js';

export function viewLogin(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    render(req, res, contenido, {
        datos: {},
        errores: {}
    });
}

export async function doLogin(req, res) {
    const result = validationResult(req);
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/Usuarios/viewLogin', {
            errores,
            datos
        });
    }
    // Capturamos las variables username y password
    const username = req.body.username;
    const password = req.body.password;

    try {
        const usuario = await Usuario.login(username, password);
        req.session.login = true;
        req.session.nombre = usuario.nombre;
        req.session.rol = usuario.rol;
        req.session.username = usuario.username;

        res.setFlash(`Encantado de verte de nuevo: ${usuario.nombre}`);
        
        return res.redirect('../contenido/normal');

    } catch (e) {
        const datos = matchedData(req);
        req.log.warn("Problemas al hacer login del usuario '%s'", username);
        req.log.debug('El usuario %s, no ha podido logarse: %s', username, e.message);
        render(req, res, 'paginas/Usuarios/viewLogin', {
            error: 'El usuario o contraseña no son válidos',
            datos,
            errores: {}
        });
    }
}


export function viewRegister(req, res) {
    let contenido = 'paginas/Usuarios/viewRegister';
    render(req, res, contenido, {
        datos: {},
        errores: {}
    });
}

export async function doRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg); // Crear un array con todos los mensajes de error
        const datos = matchedData(req);
        let contenido = 'paginas/usuarios/viewRegister';
        render(req, res, contenido, {
            errors: errorMessages, // Pasar todos los errores como un array
            error: "Por favor corrija los errores.", // Mensaje general
            errores: {},
            datos
        });
    }

    const { username, password, confirmPassword, nombre } = req.body;

    try {
        const usuario = Usuario.registrar(username, password, confirmPassword, nombre);
        req.session.login = true;
        req.session.nombre = usuario.nombre;
        req.session.rol = usuario.rol;
        req.session.username = usuario.username;

        res.setFlash(`Bienvenido a MyPixel, ${usuario.nombre}`);
        
        return res.redirect('../contenido/normal');
            
    } catch (e) {
        const datos = matchedData(req);
        let error = 'Error al registrar el usuario';
        if (e.name === 'UsuarioYaExiste') {
            error = 'El nombre de usuario ya está en uso';
        }
        render(req, res, 'paginas/usuarios/viewRegister', {
            datos,
            error,
            errores: {}
        });
    }
}


export function doLogout(req, res, next) {

    delete req.session.login;
    delete req.session.nombre;
    delete req.session.esAdmin;
    delete req.session.username;

    res.render('pagina', {

        contenido: 'paginas/Usuarios/logout',
        session: {}
    });
    
}


/*
export const validateComment = [
    body('comentario')
        .notEmpty()
        .isLength({ max: 140 }).withMessage('El comentario no puede exceder los 140 caracteres.'),
];
*/
export function sendComment(req, res){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg); // Crear un array con todos los mensajes de error

        return res.render('pagina', {
            contenido: 'paginas/foro/foro',
            session: req.session,
            errors: errorMessages, // Pasar todos los errores como un array
            error: "Por favor. corrija los errores." // Mensaje general
        });
    }


}