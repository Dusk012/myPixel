import { ShopProduct } from './shop.js';
import { render } from '../utils/render.js';
import { validationResult } from 'express-validator';

// Añadir producto
export async function addProduct(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        throw { statusCode: 400, message: 'Datos inválidos', detalles: errores };
    }

    const { name, description, price } = req.body;
    const imageFile = req.file;
    const userId = req.session?.userId;

    if (!userId) throw { statusCode: 401, message: 'No autenticado' };

    if (!name || !description || !price || !imageFile) {
        throw { statusCode: 400, message: 'Todos los campos son obligatorios' };
    }

    const imagePath = '/uploads/' + imageFile.filename;
    const product = new ShopProduct(null, name, description, parseFloat(price), imagePath, 'P', userId);
    await product.persist();

    // Establecer el mensaje flash usando el método de respuesta
    res.setFlash('Producto añadido correctamente.');

    // Obtener productos para mostrarlos después de agregar
    const userProducts = await fetchUserProducts(userId);
    const products = await fetchAllProducts();

    // Renderizar la página de tienda con los productos y el mensaje flash
    return render(req, res, 'paginas/tienda/shop', {
        products,
        userProducts,
        session: req.session
    });
}



// Obtener productos
export async function getAllProducts(req, res) {
    try {
        const userId = req.session?.userId;
        const globalProducts = await fetchAllProducts();
        const userProducts = await fetchUserProducts(userId);

        const products = globalProducts.filter(p => p.usuario_id !== userId);

        return render(req, res, 'paginas/tienda/shop', {
            products,
            userProducts
        });
    } catch (err) {
        throw { statusCode: 500, message: 'No se pudieron cargar los productos', detalles: err.message };
    }
}

// Obtener por ID
export async function getProductById(req, res) {
    const { id } = req.params;
    const product = await ShopProduct.getProductById(id);

    if (!product) throw { statusCode: 404, message: 'Producto no encontrado' };

    return render(req, res, 'paginas/tienda/producto', { product });
}

// Vender producto
export async function sellProduct(req, res) {
    const { id } = req.params;
    const userId = req.session?.userId;

    if (!userId) throw { statusCode: 401, message: 'No autenticado' };

    const product = await ShopProduct.getProductById(id);
    if (!product) throw { statusCode: 404, message: 'Producto no encontrado' };

    if (product.userId !== userId) throw { statusCode: 403, message: 'No autorizado para vender este producto' };

    try {
        await product.sell();
    } catch (err) {
        throw { statusCode: 409, message: 'El producto ya ha sido vendido' };
    }

    // Establecer el mensaje flash de éxito
    res.setFlash('Producto vendido correctamente.');

    // Obtener productos después de vender
    const userProducts = await fetchUserProducts(userId);
    const products = await fetchAllProducts();

    return render(req, res, 'paginas/tienda/shop', {
        products,
        userProducts,
        session: req.session
    });
}


// Eliminar producto
export async function deleteProduct(req, res) {
    const { id } = req.params;
    const userId = req.session?.userId;

    if (!userId) throw { statusCode: 401, message: 'No autenticado' };

    const product = await ShopProduct.getProductById(id);
    if (!product) throw { statusCode: 404, message: 'Producto no encontrado' };

    if (product.userId !== userId) throw { statusCode: 403, message: 'No autorizado para eliminar este producto' };

    await product.delete();

    // Establecer el mensaje flash de éxito
    res.setFlash('Producto eliminado correctamente.');

    // Obtener productos después de eliminar
    const userProducts = await fetchUserProducts(userId);
    const products = await fetchAllProducts();

    return render(req, res, 'paginas/tienda/shop', {
        products,
        userProducts,
        session: req.session
    });
}


// Utilidades
export async function fetchAllProducts() {
    return await ShopProduct.getAllProducts();
}

export async function fetchUserProducts(userId) {
    if (!userId) return [];
    return await ShopProduct.getProductsByUserId(userId);
}
