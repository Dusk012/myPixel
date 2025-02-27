import express from 'express';
import { viewLogin, doLogin, doLogout, viewSubmit, doSubmit } from './controllers.js';


const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/submit', viewSubmit);
usuariosRouter.post('/submit', doSubmit);


export default usuariosRouter;