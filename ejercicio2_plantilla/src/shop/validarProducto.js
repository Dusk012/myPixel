import { body } from 'express-validator';

export const validacionesProducto = [
    body('name', 'El nombre no puede estar vacío').trim().notEmpty(),
    body('description', 'La descripción no puede estar vacía').trim().notEmpty(),
    body('price', 'El precio debe ser un número válido').trim().isFloat({ min: 0 }),
];
