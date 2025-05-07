import { validationResult, matchedData } from 'express-validator';
import { Foto } from '../imagenes/imagenes.js';
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
        
        req.session.nombre = usuario.nombre;
        req.session.rol = usuario.rol;
        req.session.username = usuario.username;
        req.session.userId = usuario.id;

        res.setFlash(`Encantado de verte de nuevo: ${usuario.nombre}`);
        req.session.login = true;
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

        
        req.session.nombre = usuario.nombre;
        req.session.rol = usuario.rol;
        req.session.username = usuario.username;
        req.session.userId = usuario.id;

        res.setFlash(`Bienvenido a MyPixel, ${usuario.nombre}`);
        req.session.login = true;
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

export function perfilGet(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    let fotos = [];
    if (req.session.login) {
        contenido = 'paginas/Usuarios/profile';
        fotos = Foto.getFotosByCreador(req.session.username);
    }
    const usuario = matchedData(req);
    render(req, res, contenido, {
        fotos,
        usuario,
        error: null
    });
}

export async function actualizarFotoPerfil(req, res) {
    const result = validationResult(req);
    if(!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/Usuarios/profile', {
            errores,
            datos
        });
    }

    const foto_perfil = req.body.foto_perfil; // Recibimos el número de la foto (1-5)
    const username = req.session.username; // Obtenemos el username del usuario desde la sesión
    
    try {
        // Obtenemos el usuario actual desde la base de datos
        const usuario = Usuario.getUsuarioByUsername(username);
        // Actualizamos la foto de perfil
        usuario.foto_perfil = foto_perfil;
        usuario.persist(); // Guardamos los cambios en la base de datos
        // Actualizamos la sesión para reflejar el cambio en tiempo real
        req.session.foto_perfil = usuario.foto_perfil;
        return res.redirect('/usuarios/perfil');
    } catch (e) {
        console.error('Error al actualizar la foto de perfil:', e);
        return res.status(500).render('pagina', {
            contenido: 'paginas/Usuarios/profile',
            session: req.session,
            error: 'Error al actualizar la foto de perfil'
        });
    }
}

export async function darseDeBaja(req, res) {
    const username = req.session.username; // Obtenemos el username del usuario desde la sesión

    if (!username) {
        console.error('Error: No se encontró el username en la sesión.');
        return res.status(400).json({ success: false, error: 'Usuario no autenticado.' });
    }

    try {
        //console.log(`El usuario ${username} ha solicitado darse de baja.`);
        Usuario.eliminarUsuario(username); // Eliminar al usuario de la base de datos
        res.redirect('/usuarios/logout'); // Redirigir al logout

        // req.session.destroy(err => {
        //     if (err) {
        //         console.error('Error al destruir la sesión:', err);
        //         return res.status(500).json({ success: false, error: 'Error al cerrar la sesión.' });
        //     }

        //     //console.log('Sesión destruida correctamente. Redirigiendo a logout...');
        //     res.redirect('/usuarios/logout'); // Redirigir al logout
        // });
    } catch (e) {
        console.error('Error al dar de baja:', e);
        return res.status(500).render('pagina', {
            contenido: 'paginas/Usuarios/profile',
            session: req.session,
            error: 'Error al darse de baja'
        });
    }
}
