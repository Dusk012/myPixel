import express from 'express';

import { viewLogin, doLogin, doLogout, viewSubmit, doSubmit, viewRegister, doRegister, validateRegister, sendComment, validateComment } from './controllers.js';


const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/submit', viewSubmit);
usuariosRouter.post('/submit', doSubmit);

usuariosRouter.post('/comentar', validateComment, sendComment);

usuariosRouter.get('/register', viewRegister);
usuariosRouter.post('/register', validateRegister, doRegister);

export default usuariosRouter;