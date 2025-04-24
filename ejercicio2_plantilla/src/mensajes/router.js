import express from 'express';
//import { body } from 'express-validator';
//import asyncHandler from 'express-async-handler';

import { viewForum, viewThread, viewCreatePost, viewStats, createPost, createReply, viewEditMessage, editMessage, deleteMessage, sendComment } from './controller.js';

const mensajesRouter = express.Router(); // Colocamos esto primero

mensajesRouter.get('/foro', viewForum);
mensajesRouter.get('/thread/:id', viewThread);
mensajesRouter.get('/post', viewCreatePost);
mensajesRouter.get('/stats', viewStats);

mensajesRouter.post('/post', createPost);
mensajesRouter.post('/reply/:id', createReply);
mensajesRouter.get('/editmessage/:id', viewEditMessage);
mensajesRouter.get('/editmessage/:id', editMessage);
mensajesRouter.post('/message/:id', deleteMessage);
mensajesRouter.post('/comment', sendComment);

export default mensajesRouter; //router.js
