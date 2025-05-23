export function autenticado(urlNoAutenticado = '/usuarios/viewLogin', urlAutenticado) {
    return (req, res, next) => {
        if (req.session != null && req.session.login) {
            if (urlAutenticado != undefined) return res.redirect(urlAutenticado);
            return next();
        }
        
        if (urlNoAutenticado != undefined) {
            res.setFlash('Accion no disponible para usuarios no registrados')
            return res.redirect(urlNoAutenticado);
        }
        next();
    }
}

export function tieneRol(rol = RolesEnum.ADMIN){
    return (req, res, next) => {
        if (req.session != null && req.session.rol === rol) return next();
        res.render('pagina', {
            contenido: 'paginas/index',
            session: req.session
        });
    }
}