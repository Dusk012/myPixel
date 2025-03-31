import express from 'express';
import session from 'express-session';
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import contenidoRouter from './contenido/router.js';
import foroRouter from './mensajes/router.js';  // Importamos las rutas del foro
import { logger } from './logger.js';
import pinoHttp from 'pino-http';
import { flashMessages } from './middleware/flash.js';
import { errorHandler } from './middleware/error.js';

const pinoMiddleware = pinoHttp(config.logger.http(logger));

export const app = express();

app.set('view engine', 'ejs');
app.set('views', config.vistas);

app.use(pinoMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

// Registrar rutas correctamente con prefijo
app.use('/mensajes', foroRouter); // Ahora las rutas del foro están en /mensajes

app.use('/', express.static(config.recursos));

app.get('/', (req, res) => {
    const params = {
        contenido: 'paginas/index',
        session: req.session
    };
    res.render('pagina', params);
});

app.use('/usuarios', usuariosRouter);
app.use('/contenido', contenidoRouter);
app.use(errorHandler);
