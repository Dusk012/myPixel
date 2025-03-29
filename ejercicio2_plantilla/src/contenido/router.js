/*import express from 'express';
import { body} from 'express-validator';

import { noRegistrado, viewForo, viewDesafios, viewShop, viewProfile, viewSubmit, viewNoPermisos, viewAdmin } from './controllers.js';


const contenidoRouter = express.Router();

contenidoRouter.get('/index', noRegistrado());

contenidoRouter.get('/foro', viewForo());

contenidoRouter.get('/desafios', viewDesafios());

contenidoRouter.get('/tienda', viewShop());

contenidoRouter.get('/perfil', viewProfile());

contenidoRouter.get('/panel', viewSubmit());

contenidoRouter.get('/coordinador', viewNoPermisos());

contenidoRouter.get('/admin', viewAdmin());

export default contenidoRouter;*/
import express from 'express';

const contenidoRouter = express.Router();

contenidoRouter.get('/index', (req, res) => {
    let contenido = 'paginas/Usuarios/noRegistrado';
    if (req.session.login) {
        contenido = 'paginas/index';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
});

contenidoRouter.get('/foro', (req, res) => {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/foro/foro';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
});

contenidoRouter.get('/desafios', (req, res) => {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/desafios/desafios';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
});

contenidoRouter.get('/tienda', (req, res) => {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/tienda/shop';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
});

contenidoRouter.get('/perfil', (req, res) => {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/Usuarios/profile';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
});

contenidoRouter.get('/panel', (req, res) => {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/imagenes/submit';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
});

contenidoRouter.get('/coordinador', (req, res) => {
    let contenido = 'paginas/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
});

contenidoRouter.get('/admin', (req, res) => {
    let contenido = 'paginas/Usuarios/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/Usuarios/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
});

export default contenidoRouter;