import { validationResult, matchedData } from 'express-validator';
import controllersRouter from './router.js';
import { render } from '../utils/render.js';
import { config } from '../config.js';
import { Foto } from '../imagenes/imagenes.js';
import session from 'express-session';
import { promises as fs } from 'fs';
import { Desafio } from '../contenido/desafios.js';
import { Usuario } from '../usuarios/usuarios.js';


export async function normal(req, res) {
    let contenido = 'paginas/Usuarios/noRegistrado';
    let data = {};
    let imagen = null;
    if (req.session.login) {
        contenido = 'paginas/Usuarios/normal';

            //Para elegir la imagen aleatoriamente usamos ChatGpt
        try {
            const archivos = await fs.readdir(config.uploads)

             let foto = null;
            if (archivos.length > 0) {
                do {
                    const randomIndex = Math.floor(Math.random() * archivos.length);
                    imagen = archivos[randomIndex];
                    foto = await Foto.getFotoByContenido(imagen);
                    data.nombre = foto.nombre;
                    data.descripcion = foto.descripcion;
                    data.puntuacion = foto.puntuacion;
                } while (foto.estado !== 'Visible');
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
    }
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

export async function crearDesafio(req, res) {
    const { puntuacionObjetivo, descripcion, tipo } = req.body;

    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = Usuario.getAll(); // Asegúrate de tener un método `getAll` en el modelo `Usuario`

        // Crear el desafío para cada usuario
        const fecha = new Date().toISOString();
        usuarios.forEach(usuario => {
            const nuevoDesafio = new Desafio(
                puntuacionObjetivo,
                descripcion,
                tipo,
                fecha,
                usuario.id // Asociar el desafío al usuario
            );
            nuevoDesafio.persist();
        });

        res.redirect('/contenido/desafios?mensaje=Desafío creado con éxito para todos los usuarios');
    } catch (error) {
        console.error('Error al crear el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al crear el desafío' });
    }
}

export async function modificarDesafio(req, res) {
    const { puntuacionObjetivo, descripcion, tipo, descripcionNueva, tipoNuevo } = req.body;

    console.log(`Datos recibidos para modificar desafío:
        puntuacionObjetivo=${puntuacionObjetivo},
        descripcion=${descripcion},
        tipo=${tipo},
        descripcionNueva=${descripcionNueva},
        tipoNuevo=${tipoNuevo}`);

    try {
        // Actualizar todos los desafíos con la misma descripción y tipo
        Desafio.modificarDesafiosPorDescripcionYTipo(
            descripcion,
            tipo,
            puntuacionObjetivo,
            descripcionNueva,
            tipoNuevo
        );

        res.status(200).json({ success: true, message: 'Desafíos modificados para todos los usuarios' });
    } catch (error) {
        console.error('Error al modificar el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al modificar el desafío' });
    }
}

export async function eliminarDesafio(req, res) {
    const { descripcion, tipo } = req.body;

    console.log(`Datos recibidos para borrar desafío: descripcion=${descripcion}, tipo=${tipo}`);

    try {
        Desafio.eliminarDesafiosPorDescripcionYTipo(descripcion, tipo);

        res.status(200).json({ success: true, message: 'Desafíos eliminados para todos los usuarios' });
    } catch (error) {
        console.error('Error al borrar el desafío:', error);
        res.status(500).json({ success: false, error: 'Error al borrar el desafío' });
    }
}
