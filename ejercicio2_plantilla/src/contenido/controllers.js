import { validationResult, matchedData } from 'express-validator';
import { Usuario, RolesEnum } from './usuarios.js';
import usuariosRouter from './router.js';
import { render } from '../utils/render.js';


export function noRegistrado(req, res) {
    let contenido = 'paginas/Usuarios/noRegistrado';
    if (req.session.login) {
        contenido = 'paginas/Usuarios/normal';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
};

export function viewForo(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/foro/foro';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
};

export function viewDesafios(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/desafios/desafios';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
};

export function viewShop(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/tienda/shop';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
};

export function viewProfile(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/Usuarios/profile';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
};

export function viewSubmit(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/imagenes/submit';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
};

export function viewAdmin(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
};

export function viewNoPermisos(req, res) {
    let contenido = 'paginas/Usuarios/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/Usuarios/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
};

export default contenidoRouter;