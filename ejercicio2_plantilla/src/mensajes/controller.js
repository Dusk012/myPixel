//import { validationResult } from 'express-validator';
import { Forum, ForumMessage } from './comentarios.js';
import { render } from '../utils/render.js';

// Instancia única del foro (podría ser una conexión a BD en producción)
const forum = new Forum();
const thread = new ForumMessage();

export function viewForum(req, res) {
    const query = req.query.foro?.trim().toLowerCase();
    let foros;

    if (query) {
        foros = forum.dame_foros_por_titulo(query);
    } else {
        foros = forum.dame_foros();
    }

    return render(req, res, 'paginas/foro/foro', {
        foros,
        error: null,
        session: req.session,
        search: query
    });
}

export function viewThread(req, res) {
    const forumId = parseInt(req.params.id);  // Obtiene el ID del foro desde la URL
    const my_forum = forum.dame_id(forumId);
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
}

export function createPost(req, res) {
    const username = req.session.username;
    const { title, desc } = req.body;
                
    // Crear un nuevo foro y obtener la referencia a ese foro
    const newForum = forum.createForum(
        title,
        desc,
        'Activo',
        username
    );

    res.redirect(`/mensajes/thread/${newForum.id}`);
}

export function deleteForum(req, res) {
    const foro = Forum.getForumById(parseInt(req.params.id));
    foro.deleteForum(); // Esto elimina el foro y sus comentarios
    res.redirect('/mensajes/foro');
}

export async function createReply(req, res) {
    const { content } = req.body; //Comentario 
    const parentId = parseInt(req.params.id); //ID del foro donde estamos comentando
    const userId = req.session.userId;
    const username = req.session.username;

    // Generar fecha
    const date = new Date().toISOString(); //Fecha del comentario
        
    forum.createPost( //Crea comentario en el foro
        parentId,
        content,
        date,
        userId,
        username
    );

    res.redirect(`/mensajes/thread/${parentId}`);
}

export function editMessage(req, res) {
    const { content } = req.body;
    ForumMessage.editComment(req.params.id, content);
    res.redirect(`/mensajes/thread/${req.query.idForo}`);
}

export function deleteMessage(req, res) {
    ForumMessage.deleteComment(req.params.id);
    res.redirect(`/mensajes/thread/${req.query.idForo}`);
}