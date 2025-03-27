import { join, dirname } from 'node:path';

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
    port: 3000,
    recursos: join(dirname(import.meta.dirname), 'static'),
    vistas: join(dirname(import.meta.dirname), 'vistas'),
    session: {
        resave: false,
        saveUninitialized: true,
        secret: 'no muy secreto'
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