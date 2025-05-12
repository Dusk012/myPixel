import express from 'express';

import { viewForum, viewThread, viewCreatePost, viewStats, createPost, createReply, editMessage, deleteMessage, deleteForum } from './controller.js';

const mensajesRouter = express.Router(); // Colocamos esto primero

mensajesRouter.get('/foro', viewForum);
mensajesRouter.get('/thread/:id', viewThread);
mensajesRouter.get('/post', viewCreatePost);
mensajesRouter.get('/stats', viewStats);

mensajesRouter.post('/post', createPost);
mensajesRouter.post('/forum/:id', deleteForum);
mensajesRouter.post('/reply/:id', createReply);
mensajesRouter.post('/edit/:id', editMessage);
mensajesRouter.post('/message/:id', deleteMessage);

export default mensajesRouter; //router.js
