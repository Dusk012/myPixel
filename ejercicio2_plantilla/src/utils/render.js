import { error } from "./helpers.js";

export function render(req, res, contenido, params) {
    const publicPaths = [
        'paginas/Usuarios/viewLogin',
        'paginas/Usuarios/viewRegister',
    ];
    
    // Check if the requested content requires authentication
    const notRequiresAuth = !publicPaths.includes(contenido);
    
    if (notRequiresAuth && (!req.session || !req.session.login)) {
        contenido = 'paginas/Usuarios/noRegistrado';
        params = {};
    }

    res.render('pagina', {
        contenido,
        session: req.session,
        helpers: {
            error
        },
        ...params
    });
}