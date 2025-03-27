import { validationResult, matchedData } from 'express-validator';
import { Usuario, RolesEnum } from './usuarios.js';
import usuariosRouter from './router.js';
import { render } from '../utils/render.js';

export function viewLogin(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
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

        res.setFlash(`Encantado de verte de nuevo: ${usuario.nombre}`);
        
        return res.redirect('../contenido/index');

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
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export function doLogout(req, res, next) {

    delete req.session.login;
    delete req.session.nombre;
    delete req.session.esAdmin;

    res.render('pagina', {

        contenido: 'paginas/Usuarios/logout',
        session: {}
    });
    
}


export function viewSubmit(req, res) {
    let contenido = 'paginas/Imagenes/submit';
    res.render('pagina', {
        contenido,
        session: req.session,
        mensaje: null
    });
}

export function doSubmit(req, res) {
    let contenido = 'paginas/index', mensaje = null;

    const { imagen } = req.body;
    
    res.render('pagina', {
        contenido,
        session: req.session,
        mensaje: "La imagen ha sido subida con éxito."
    });
}

export function doRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg); // Crear un array con todos los mensajes de error

        return res.render('pagina', {
            contenido: 'paginas/usuarios/viewRegister',
            session: req.session,
            errors: errorMessages, // Pasar todos los errores como un array
            error: "Por favor corrija los errores." // Mensaje general
        });
    }

    const { username, password, confirmPassword, nombre } = req.body;

    try {
        const usuario = Usuario.registrar(username, password, confirmPassword, nombre);
        const error = null;
        res.render('pagina', {
            contenido: 'paginas/usuarios/viewLogin',
            session: req.session,
            error});
            
    } catch (e) {
        let error = 'Error al registrar el usuario';
        if (e.name === 'UsuarioYaExiste') {
            error = 'El nombre de usuario ya está en uso';
        }
        res.render('pagina', {
            contenido: 'paginas/usuarios/viewRegister',
            session: req.session,
            error
        });
    }
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