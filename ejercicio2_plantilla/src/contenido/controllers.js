import { validationResult, matchedData } from 'express-validator';
import controllersRouter from './router.js';
import { render } from '../utils/render.js';
import { config } from '../config.js';
import { Foto } from '../imagenes/imagenes.js';
import session from 'express-session';
import { promises as fs } from 'fs';
import { Desafio } from '../contenido/desafios.js';


export async function normal(req, res) {
    //let contenido = 'paginas/Usuarios/noRegistrado';
    let contenido = 'paginas/Usuarios/normal';
    let data = {};
    let imagen = null;
    //if (req.session.login) {
        //contenido = 'paginas/Usuarios/normal';

            //Para elegir la imagen aleatoriamente usamos ChatGpt
        try {
            const archivos = await fs.readdir(config.uploads);

            if (archivos.length > 0) {
                const randomIndex = Math.floor(Math.random() * archivos.length);
                imagen = archivos[randomIndex];
                const foto = await Foto.getFotoByContenido(imagen);
                data.nombre = foto.nombre;
                data.descripcion = foto.descripcion;
                data.puntuacion = foto.puntuacion;
            }
            render(req, res, contenido, {
                data,
                imagen,
                error: null
            });
        } catch (e) {
            let error = 'Error con las imágenes: ' + e.message;
            render(req, res, contenido, {
                error,
                data: {},
                imagen: null
            });
        }
    //}
}

export async function gestionPuntuacion(req, res) {
    const contenido = req.body.contenido;
    const puntuacion = req.body.puntuacion;
    const userId = req.session?.userId; // Obtener el ID del usuario desde la sesión

    try {
        const foto = await Foto.getFotoByContenido(contenido);

        if (foto) {
            foto.puntuacion = puntuacion;
            await Foto.actualizarFoto(foto);

            // Incrementar los puntos del desafío de "likes"
            if (userId) {
                Desafio.incrementarPuntos(userId, 0); // Tipo 0 es para "likes"
            }

            // Incrementar likes globales
            const globalLikes = Foto.incrementarGlobalLikes();
            res.json({ success: true, globalLikes });
        } else {
            res.status(404).json({ success: false, error: 'Foto no encontrada' });
        }
    } catch (e) {
        console.error('Error en gestionPuntuacion:', e);
        res.status(500).json({ success: false, error: e.message });
    }
}

export async function viewDesafios(req, res) {
    const userId = req.session?.userId; // Obtener el ID del usuario desde la sesión
    let contenido = 'paginas/desafios/desafios'
    if (!userId) {
        return res.status(403).send('No tienes permiso para ver esta página.');
    }

    try {
        // Obtener los desafíos del usuario desde la base de datos
        const desafios = await Desafio.getByUserId(userId);

        // Renderizar la vista con los desafíos
        res.render('pagina', {
            contenido,
            desafios,
            session: req.session,
            error: null
        });
    } catch (error) {
        console.error('Error al obtener los desafíos:', error);
        res.status(500).send('Error al cargar los desafíos.');
    }
}

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
}
/*
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
}
*/

export function viewAdmin(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewCoordinador(req, res) {
    let contenido = 'paginas/Usuarios/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/Usuarios/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export async function crearDesafio(req, res) {
    const { puntuacionObjetivo, descripcion, tipo } = req.body;

    try {
        // Obtener el ID del usuario desde la sesión
        const id_usuario = req.session?.userId;

        if (!id_usuario) {
            return res.status(400).json({ success: false, error: 'ID de usuario no encontrado en la sesión' });
        }

        // Crear el nuevo desafío
        const nuevoDesafio = new Desafio(
            puntuacionObjetivo,
            descripcion,
            tipo,
            new Date().toISOString(),
            id_usuario // Asociar el desafío al usuario de la sesión
        );
        nuevoDesafio.persist();

        // Redirigir con un mensaje de éxito
        res.redirect('/contenido/desafios?mensaje=Desafío creado con éxito');
    } catch (error) {
        console.error('Error al crear el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al crear el desafío' });
    }
}

export async function modificarDesafio(req, res) {
    const { id, puntuacionObjetivo, descripcion, tipo } = req.body;

    try {
        Desafio.modificarDesafio(parseInt(id), parseInt(puntuacionObjetivo), descripcion, parseInt(tipo));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error al modificar el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al modificar el desafío' });
    }
}

export async function eliminarDesafio(req, res) {
    const { id } = req.params;

    try {
        // Llama al método para eliminar el desafío de la base de datos
        await Desafio.deleteById(id);
        res.status(200).json({ success: true, message: 'Desafío eliminado' });
    } catch (error) {
        console.error('Error al borrar el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al borrar el desafío' });
    }
}