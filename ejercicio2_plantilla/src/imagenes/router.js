import express from 'express';
import { body} from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { viewSubmit, doSubmit } from './controllers.js';
import asyncHandler from 'express-async-handler';

const imagenesRouter = express.Router();

imagenesRouter.get('/submit', autenticado(null), asyncHandler(viewSubmit));
imagenesRouter.post('/submit', autenticado(null),
    body('nombre', 'No puede ser vacío').trim().notEmpty(), 
    body('descripcion', 'No puede ser vacío').trim().notEmpty(), 
    body('imagen', 'No puede ser vacío').trim().notEmpty(), 
    asyncHandler(doSubmit));

export default imagenesRouter;