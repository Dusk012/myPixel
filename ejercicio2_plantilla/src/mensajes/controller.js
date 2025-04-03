import { validationResult, matchedData } from 'express-validator';
import { Forum, ForumMessage, MessageType } from './comentarios.js';
import { render } from '../utils/render.js';

// Instancia única del foro (podría ser una conexión a BD en producción)
const forum = new Forum();
const thread = new ForumMessage();

export function viewForum(req, res) {
    try {
        console.log(render);
        const foros = forum.dame_foros();
        return render(req, res, 'paginas/foro/foro', {
            foros,
            error: null,
            session: req.session
        });
    } catch (e) {
        return render(req, res, 'paginas/foro/foro', {
            error: 'Error al cargar el foro',
            session: req.session
        });
    }
}

export async function viewThread(req, res) {
    try {
        console.log(render);
        const forumId = parseInt(req.params.id);  // Obtiene el ID del foro desde la URL
        const my_forum = await forum.dame_id(forumId);
        const my_thread = thread.dame_comentarios(forumId);
        if (!my_forum) {
            throw new Error('Foro no encontrado');
        }

        render(req, res, 'paginas/foro/hilo', {
            forum: my_forum,
            replies: my_thread,
            error: null,
            session: req.session
        });
    } catch (e) {
        render(req, res, 'paginas/foro/hilo', {
            error: e.message,
            session: req.session
        });
    }
}


export function viewCreatePost(req, res) {
    return render(req, res, 'paginas/foro/crearPost', {
        error: null,
        datos: {},
        errores: {},
        session: req.session
    });
}

export function viewStats(req, res) {
    try {
        const posts = forum.getOriginalPosts();
        const stats = {
            totalPosts: posts.length,
            totalReplies: posts.reduce((sum, post) => sum + post.replyCount, 0),
            latestPost: posts.length > 0 ? posts[0] : null
        };

        return render(req, res, 'paginas/foro/estadisticas', {
            stats,
            error: null,
            session: req.session
        });
    } catch (e) {
        return render(req, res, 'paginas/foro/estadisticas', {
            error: 'Error al calcular estadísticas',
            session: req.session
        });
    }
}

export async function createPost(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/foro/crearPost', {
            errores,
            datos,
            error: 'Por favor corrija los errores',
            session: req.session
        });
    }

    try {
        const { title, desc, content } = req.body;
        const userId = req.session.usuarioId; // Asumimos que el usuario está en sesión
        
        // Generar ID (en producción usaría la BD)
        const id = Date.now(); 
        const date = new Date().toISOString();
        
        // Crear un nuevo foro y obtener la referencia a ese foro
        const newForum = forum.createForum(
            title,
            desc,
            'Activo'
        );

        res.setFlash('Post creado exitosamente');
        res.redirect(`/mensajes/thread/${newForum.id}`);
    } catch (e) {
        return render(req, res, 'paginas/foro/crearPost', {
            error: e.message,
            datos: req.body,
            errores: {},
            session: req.session
        });
    }
}

export async function createReply(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.setFlash('Error en el formulario');
        return res.redirect('back');
    }

    try {
        const { content } = req.body; //Comentario 
        const parentId = parseInt(req.params.id); //ID del foro donde estamos comentando
        const userId = req.session.usuarioId; //ID del usuario que ha comentado

        // Generar ID y fecha
        const date = new Date().toISOString(); //Fecha del comentario
        
        forum.createPost( //Crea comentario en el foro
            parentId,
            content,
            date,
            userId
        );

        res.redirect(`/mensajes/thread/${parentId}`);
    } catch (e) {
        res.setFlash(e.message);
        res.redirect('/mensajes/thread/${parentId}');
    }
}

export async function editMessage(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.setFlash('Error en el formulario');
        return res.redirect('back');
    }

    try {
        const messageId = parseInt(req.params.id);
        const { content } = req.body;
        const userId = req.session.usuarioId;
        
        const message = forum.getMessage(messageId);
        if (!message) {
            throw new Error('Mensaje no encontrado');
        }

        // Verificar que el usuario es el autor
        if (message.userId !== userId) {
            throw new Error('No tienes permiso para editar este mensaje');
        }

        message.content = content;
        res.setFlash('Mensaje actualizado exitosamente');

        // Redirigir al hilo correspondiente
        const redirectId = message.type === MessageType.ORIGINAL 
            ? message.id 
            : message.parentId;
        res.redirect(`/foro/thread/${redirectId}`);
    } catch (e) {
        res.setFlash(e.message);
        res.redirect('back');
    }
}

export async function deleteMessage(req, res) {
    try {
        const messageId = parseInt(req.params.id);
        const userId = req.session.usuarioId;
        
        const message = forum.getMessage(messageId);
        if (!message) {
            throw new Error('Mensaje no encontrado');
        }

        // Verificar permisos (autor o admin)
        if (message.userId !== userId && req.session.rol !== 'admin') {
            throw new Error('No tienes permiso para eliminar este mensaje');
        }

        const isOriginal = message.type === MessageType.ORIGINAL;
        forum.deleteMessage(messageId);

        res.setFlash('Mensaje eliminado exitosamente');
        
        // Redirigir según el tipo de mensaje
        if (isOriginal) {
            res.redirect('/foro');
        } else {
            res.redirect(`/foro/thread/${message.parentId}`);
        }
    } catch (e) {
        res.setFlash(e.message);
        res.redirect('back');
    }
}

export function sendComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return render(req, res, 'paginas/foro/foro', {
            errors: errorMessages,
            error: "Por favor, corrija los errores.",
            session: req.session
        });
    }

    try {
        // Implementación similar a createReply pero para comentarios rápidos
        res.setFlash('Comentario enviado exitosamente');
        res.redirect('back');
    } catch (e) {
        return render(req, res, 'paginas/foro/foro', {
            error: e.message,
            session: req.session
        });
    }
}
