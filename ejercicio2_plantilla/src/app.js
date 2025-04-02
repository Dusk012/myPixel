
import express from 'express';
import session from 'express-session';
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import contenidoRouter from './contenido/router.js';
import { logger } from './logger.js';
import pinoHttp  from 'pino-http';
const pinoMiddleware = pinoHttp(config.logger.http(logger));
import { flashMessages } from './middleware/flash.js';
import { errorHandler } from './middleware/error.js';
import mensajesRouter from './mensajes/router.js';

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
    const params = {
        contenido: 'paginas/index', // fichero ejs que tiene el contenido específico para esta vista
        session: req.session // Neesario para (entre otras cosas) utilizarlo en mostrarSaludo de cabecera.ejs
    }
    res.render('pagina', params);
    res.render('pagina', {
        contenido: 'paginas/index',
        session: req.session
    });
})
app.use('/usuarios', usuariosRouter);
app.use('/contenido', contenidoRouter);
app.use('/mensajes', mensajesRouter);
app.use(errorHandler);