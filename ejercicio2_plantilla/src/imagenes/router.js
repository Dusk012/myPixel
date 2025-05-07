import express from 'express';
import { config } from '../config.js';
import { body } from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import { viewSubmit, doSubmit } from './controllers.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';

const upload = multer({ dest: config.uploads });

const imagenesRouter = express.Router();

imagenesRouter.get('/submit', autenticado(null), asyncHandler(viewSubmit));
imagenesRouter.post('/submit', upload.single("foto"), autenticado(null),
    body('nombre', 'No puede ser vacío').trim().notEmpty(), 
    body('descripcion', 'No puede ser vacío').trim().notEmpty(),
    asyncHandler(doSubmit));
export default imagenesRouter;