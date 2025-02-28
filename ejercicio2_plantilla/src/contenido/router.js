import express from 'express';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', (req, res) => {
    let contenido = 'paginas/usuarios/noRegistrado';
    if (req.session.login) {
        contenido = 'paginas/usuarios/normal';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
});

contenidoRouter.get('/admin', (req, res) => {
    let contenido = 'paginas/usuarios/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/usuarios/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
});

export default contenidoRouter;