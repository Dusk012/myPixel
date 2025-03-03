import express from 'express';
import { viewLogin, doLogin, doLogout, viewSubmit, doSubmit, viewRegister, doRegister } from './controllers.js';


const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/register', viewRegister);
usuariosRouter.post('/register', doRegister);

usuariosRouter.get('/submit', viewSubmit);
usuariosRouter.post('/submit', doSubmit);


export default usuariosRouter;