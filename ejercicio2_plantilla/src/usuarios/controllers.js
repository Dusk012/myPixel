import { body, validationResult } from 'express-validator';
import { Usuario, RolesEnum } from './usuarios.js';
import usuariosRouter from './router.js';

export function viewLogin(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export function doLogin(req, res) {
    body('username').escape(); // Se asegura que eliminar caracteres problemáticos
    body('password').escape(); // Se asegura que eliminar caracteres problemáticos
  
    let contenido = 'paginas/Usuarios/viewLogin', error = null;

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

export function viewRegister(req, res) {
    let contenido = 'paginas/Usuarios/viewRegister';
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export function doRegister(req, res) {
    //TODO
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
    let contenido = 'paginas/Imagenes/submit';
    res.render('pagina', {
        contenido,
        session: req.session,
        mensaje: null
    });
}

export function doSubmit(req, res) {
    let contenido = 'paginas/Imagenes/submit', mensaje = null;

    const { imagen } = req.body;

    res.render('pagina', {
        contenido,
        session: req.session,
        mensaje: "La imagen ha sido subida con éxito."
    });
}

export function viewRegister(req, res) {
    let contenido = 'paginas/usuarios/viewRegister';
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export const validateRegister = [
    body('username')
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
];

export function doRegister(req, res) {
    console.log("Estoy en doRegister")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg); // Crear un array con todos los mensajes de error

        return res.render('pagina', {
            contenido: 'paginas/usuarios/viewRegister',
            session: req.session,
            errors: errorMessages, // Pasar todos los errores como un array
            error // Mensaje general
        });
    }

    const { username, password, confirmPassword, nombre } = req.body;

    try {
        console.log("Pre-registrar")
        const usuario = Usuario.registrar(username, password, confirmPassword, nombre);
        console.log("No hay error")
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