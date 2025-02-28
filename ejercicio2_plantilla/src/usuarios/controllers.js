import { body } from 'express-validator';

export function viewLogin(req, res) {
    let contenido = 'paginas/usuarios/viewLogin';
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export function doLogin(req, res) {
    body('username').escape(); // Se asegura que eliminar caracteres problemáticos
    body('password').escape(); // Se asegura que eliminar caracteres problemáticos
  
    let contenido = 'paginas/usuarios/viewLogin', error = null;

    const { username, password } = req.body;

    const users = {
        Usuario: { password: 'userpass', nombre: 'Usuario' },
        Administrador: { password: 'adminpass', nombre: 'Administrador', esAdmin: true }
    };

    const user = users[username];

    if (user && user.password === password) {
        req.session.login = true;
        req.session.nombre = user.nombre;
        if (user.esAdmin) {
            req.session.esAdmin = true;
        }
        contenido = 'paginas/index';
    }
    else{
        error = 'Usuario o contraseña incorrectos';
    }

    res.render('pagina', {
        contenido,
        session: req.session,
        error 
    });
}

export function doLogout(req, res, next) {
    let contenido = 'paginas/index';

    delete req.session.login;
    delete req.session.nombre;
    delete req.session.esAdmin;

    res.render('pagina', {

        contenido: 'paginas/Usuarios/logout',

        session: {}
    });
    
}


export function viewSubmit(req, res) {
    let contenido = 'paginas/submit';
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export function doSubmit(req, res) {
    let contenido = 'paginas/imagenes', error = null;

    const { imagen } = req.body;

    const users = {
        Usuario: { password: 'userpass', nombre: 'Usuario' },
        Administrador: { password: 'adminpass', nombre: 'Administrador', esAdmin: true }
    };

    const user = users[username];

    if (user && user.password === password) {
        req.session.login = true;
        req.session.nombre = user.nombre;
        if (user.esAdmin) {
            req.session.esAdmin = true;
        }
        contenido = 'paginas/index';
    }
    else{
        error = 'Usuario o contraseña incorrectos';
    }

    res.render('pagina', {
        contenido,
        session: req.session,
        error 
    });
}


