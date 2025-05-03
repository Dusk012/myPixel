import { ShopProduct } from './shop.js';
import { render } from '../utils/render.js';


// Añadir producto
export async function addProduct(req, res) {
    const { name, description, price } = req.body;
    const imageFile = req.file;
    const userId = req.session?.userId;

    const imagePath = '/uploads/' + imageFile.filename;

    const product = new ShopProduct(null, name, description, parseFloat(price), imagePath, 'P', userId);
    await product.persist();

    res.setFlash('Producto añadido correctamente.');

    const userProducts = await fetchUserProducts(userId);
    const products = (await fetchAllProducts()).filter(p => p.usuario_id !== userId);

    return render(req, res, 'paginas/tienda/shop', {
        products,
        userProducts
    }); 
}

// Mostrar productos del usuario
export async function getMyProducts(req, res) {
    const userId = req.session?.userId;
    const userProducts = await fetchUserProducts(userId);

    return render(req, res, 'paginas/tienda/my-products', { userProducts });
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
    const userId = req.session.userId;

    const product = await ShopProduct.getProductById(id);

    if (!product) {
        throw { statusCode: 404, message: 'Producto no encontrado.' };
    }

    if (product.userId !== userId) {
        throw { statusCode: 403, message: 'No estás autorizado para vender este producto.' };
    }

    try {
        await product.sell();
        res.setFlash('Producto vendido correctamente.');
    } catch {
        res.setFlash('Este producto ya fue vendido.');
    }

    const userProducts = await fetchUserProducts(userId);
    const products = (await fetchAllProducts()).filter(p => p.usuario_id !== userId);

    return render(req, res, 'paginas/tienda/shop', {
        products,
        userProducts
    });
}



// Eliminar producto
export async function deleteProduct(req, res) {
    const { id } = req.params;
    const userId = req.session.userId;

    const product = await ShopProduct.getProductById(id);

    if (!product) {
        throw { statusCode: 404, message: 'Producto no encontrado.' };
    }

    if (product.userId !== userId) {
        throw { statusCode: 403, message: 'No estás autorizado para eliminar este producto.' };
    }

    await product.delete();
    res.setFlash('Producto eliminado correctamente.');

    const userProducts = await fetchUserProducts(userId);
    const products = (await fetchAllProducts()).filter(p => p.usuario_id !== userId);

    return render(req, res, 'paginas/tienda/shop', {
        products,
        userProducts
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
