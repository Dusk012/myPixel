import 'dotenv/config';
import { join, dirname } from 'node:path';

const isProduction = process.env.NODE_ENV === 'production';

const PORT = 3000;
const SESSION_SECRET = "no muy secreto";

const port = parseInt(process.env.APP_PORT, 10);
const sessionSecret = process.env.APP_SESSION_SECRET ?? SESSION_SECRET;

export const config = {
    port: !isNaN(port) ? port : PORT,
    recursos: join(dirname(import.meta.dirname), 'static'),
    vistas: join(dirname(import.meta.dirname), 'vistas'),
    uploads: join(dirname(import.meta.dirname), 'uploads'),
    uploadsTienda: join(dirname(import.meta.dirname), 'uploadsTienda'),
    session: {
        resave: false,
        saveUninitialized: true,
        secret: sessionSecret
    },
    isProduction,
    logs: join(dirname(import.meta.dirname), 'logs'),
    logger: {
        level: process.env.APP_LOG_LEVEL ?? (! isProduction ? 'debug' : 'info'),
        http: (pino) => {
            return {
                logger: pino,
                autoLogging: ! isProduction,
                useLevel: 'trace'
            }
        }
    }
}