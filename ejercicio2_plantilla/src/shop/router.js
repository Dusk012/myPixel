import express from 'express'; 
import asyncHandler from 'express-async-handler';
import { validacionesProducto } from './validarProducto.js';
import { addProduct, getProductById, sellProduct, deleteProduct, getAllProducts , getMyProducts, buyProduct} from './controller.js';
import { config } from '../config.js';
import { autenticado, tieneRol } from '../middleware/auth.js'; // Importar los middlewares
import multer from 'multer';
import {validar} from '../middleware/validar.js';
const upload = multer({ dest: config.uploads });
const shopRouter = express.Router();

// Ver todos los productos (público o privado, según lo que prefieras)

// Ruta para ver mis productos
shopRouter.get('/my-products', asyncHandler(getMyProducts));


shopRouter.get('/', asyncHandler(getAllProducts));

// Ver un producto específico (también puede ser público)
shopRouter.get('/:id', asyncHandler(getProductById));

// Añadir producto – solo usuarios logueados
shopRouter.post(
    '/add',
    autenticado(),
    upload.single('image'),
    ...validacionesProducto,
    validar(),
    asyncHandler(addProduct)
);

// Vender producto – solo usuarios logueados
shopRouter.post('/:id/sell',
    autenticado(),
    asyncHandler(sellProduct)
);

shopRouter.post('/:id/buy',
    autenticado(),
    asyncHandler(buyProduct)
);
// Eliminar producto – solo usuarios logueados
shopRouter.post('/:id',
    autenticado(),
    asyncHandler(deleteProduct)
);
export default shopRouter;