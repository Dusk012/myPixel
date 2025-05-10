import express from 'express'; 
import asyncHandler from 'express-async-handler';
import { validacionesProducto } from './validarProducto.js';
import { addProduct, getProductById, sellProduct, deleteProduct, getAllProducts , getMyProducts, buyProduct,undoBuyProduct,updateProduct} from './controller.js';
import { config } from '../config.js';
import { autenticado, tieneRol } from '../middleware/auth.js'; // Importar los middlewares
import multer from 'multer';
import {validar, validarIdParametro} from '../middleware/validar.js';
const upload = multer({ dest: config.uploadsTienda });
const shopRouter = express.Router();

// Ruta para ver mis productos
shopRouter.get('/my-products', asyncHandler(getMyProducts));

// Añadir producto – solo usuarios logueados
shopRouter.post(
    '/add',
    autenticado(),
    upload.single('image'),
    ...validacionesProducto,
    validar(),
    asyncHandler(addProduct)
);


// Actualizar producto – solo usuarios logueados
shopRouter.post(
    '/:id/edit',
    autenticado(),validarIdParametro,           // Asegura que el usuario esté autenticado
    upload.single('image'),   // Permite subir una nueva imagen (si la hay)
    ...validacionesProducto,  // Validaciones del producto
    validar(),               // Validación final
    asyncHandler(updateProduct)  // Llama a la función para actualizar el producto
);


shopRouter.post('/:id/undo-sell', 
    autenticado(),validarIdParametro,  
    asyncHandler(undoBuyProduct)  
);
// Vender producto – solo usuarios logueados
shopRouter.post('/:id/sell',
    autenticado(),validarIdParametro,
    asyncHandler(sellProduct)
);

shopRouter.post('/:id/buy',
    autenticado(),validarIdParametro,
    asyncHandler(buyProduct)
);
// Eliminar producto – solo usuarios logueados
shopRouter.post('/:id',
    autenticado(),validarIdParametro,
    asyncHandler(deleteProduct)
);

shopRouter.get('/', asyncHandler(getAllProducts));

// Ver un producto específico
shopRouter.get('/:id',validarIdParametro, asyncHandler(getProductById));

export default shopRouter;