import express from 'express'; 
import asyncHandler from 'express-async-handler';
import { addProduct, getProductById, sellProduct, deleteProduct, getAllProducts } from './controller.js';
import { config } from '../config.js';
import { autenticado, tieneRol } from '../middleware/auth.js'; // Importar los middlewares
import multer from 'multer';

const upload = multer({ dest: config.uploads });
const shopRouter = express.Router();

// Ver todos los productos (público o privado, según lo que prefieras)
shopRouter.get('/', asyncHandler(getAllProducts));

// Ver un producto específico (también puede ser público)
shopRouter.get('/:id', asyncHandler(getProductById));

// Añadir producto – solo usuarios logueados
shopRouter.post('/add',
    autenticado(),
    upload.single('image'),
    asyncHandler(addProduct)
);

// Vender producto – solo usuarios logueados
shopRouter.post('/:id/sell',
    autenticado(),
    asyncHandler(sellProduct)
);

// Eliminar producto – solo usuarios logueados
shopRouter.post('/:id',
    autenticado(),
    asyncHandler(deleteProduct)
);
export default shopRouter;