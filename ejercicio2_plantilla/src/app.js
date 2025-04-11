import express from 'express';
import session from 'express-session';
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import imagenesRouter from './imagenes/router.js';
import contenidoRouter from './contenido/router.js';
import mensajesRouter from './mensajes/router.js';
import shopRouter from './shop/router.js';
import bodyParser from 'body-parser';
import { logger } from './logger.js';
import pinoHttp  from 'pino-http';
const pinoMiddleware = pinoHttp(config.logger.http(logger));
import { flashMessages } from './middleware/flash.js';
import { errorHandler } from './middleware/error.js';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', config.vistas);

app.use(pinoMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

app.use('/', express.static(config.recursos));
app.get('/', (req, res) => {
    // Parámetros que estarán disponibles en la plantilla
    req.session.login = false;
    const params = {
        contenido: 'paginas/index', // fichero ejs que tiene el contenido específico para esta vista
        session: req.session // Necesario para (entre otras cosas) utilizarlo en mostrarSaludo de cabecera.ejs
    }
    res.render('pagina', params);
})
app.use('/uploads', express.static('uploads'));
app.use('/usuarios', usuariosRouter);
app.use('/imagenes', imagenesRouter);
app.use('/contenido', contenidoRouter);
app.use('/mensajes', mensajesRouter);
app.use('/shop', shopRouter);
app.use(errorHandler);