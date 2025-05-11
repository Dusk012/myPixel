import { ShopProduct } from './shop.js';
import { render } from '../utils/render.js';
import fs from 'fs';
import path from 'path';


// Añadir producto
export async function addProduct(req, res) {
    const { name, description, price } = req.body;
    const imageFile = req.file;
    const userId = req.session?.userId;
    

    const imagePath = imageFile.filename;

    const product = new ShopProduct(null, name, description, parseFloat(price), imagePath, 'P', userId);
    await product.persist();

    res.setFlash('Producto añadido correctamente.');

    res.redirect('/shop');
}



// Actualizar producto existente
export async function updateProduct(req, res) {
    const { name, description, price } = req.body;
    const imageFile = req.file;
    const productId = req.params.id;

    // Obtener el producto por ID (await porque es una promesa)
    const product = await ShopProduct.getProductById(productId);

    // Actualizar los datos del producto
    product.name = name;
    product.description = description;
    product.price = parseFloat(price);

    if (imageFile) {
        product.image = imageFile.filename;  // Actualizamos la imagen si se proporcionó una nueva
    }

    // Persistir el producto (actualizar en la base de datos)
    await product.persist();

    res.setFlash('Producto actualizado correctamente.');
    res.redirect('/shop/my-products');
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

        const products = globalProducts.filter(p => p.usuario_id !== userId && p.status === 'P');

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

    return render(req, res, 'paginas/tienda/my-products', {
        products,
        userProducts
    });
}


export async function buyProduct(req, res) {
    const { id } = req.params;
    const userId = req.session.userId;

    const product = await ShopProduct.getProductById(id);

    if (!product) {
        throw { statusCode: 404, message: 'Producto no encontrado.' };
    }

    if (product.userId === userId) {
        throw { statusCode: 403, message: 'No estás autorizado para comprar este producto.' };
    }

    try {
        await product.sell();
        res.setFlash('Producto comprado correctamente.');
    } catch {
        res.setFlash('Este producto ya fue comprado.');
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
    
    const isAdmin = req.session.rol === 'A';

    const product = await ShopProduct.getProductById(id);

    if (!product) {
        throw { statusCode: 404, message: 'Producto no encontrado.' };
    }

    if (product.userId !== userId && !isAdmin ) {
        throw { statusCode: 403, message: 'No estás autorizado para eliminar este producto.' };
    }

    const imagePath = path.join(process.cwd(),'uploadsTienda', product.image); 

    // Eliminar la imagen del sistema de archivos
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error al eliminar imagen:', err);
        }
    });

    await product.delete();
    res.setFlash('Producto eliminado correctamente.');

    const userProducts = await fetchUserProducts(userId);
    const products = (await fetchAllProducts()).filter(p => p.usuario_id !== userId);
    
    res.redirect('/shop');
}

export async function undoBuyProduct(req, res) {
    const { id } = req.params;
    const userId = req.session.userId;

    const product = await ShopProduct.getProductById(id);

    if (!product) {
        throw { statusCode: 404, message: 'Producto no encontrado.' };
    }

    if (product.userId !== userId) {
        throw { statusCode: 403, message: 'No estás autorizado para modificar este producto.' };
    }

    try {
        product.undo_sell();
        res.setFlash('La compra ha sido revertida. El producto está de nuevo en venta.');
    } catch (error) {
        res.setFlash(error.message || 'No se pudo deshacer la compra.');
    }

    const userProducts = await fetchUserProducts(userId);
    const products = (await fetchAllProducts()).filter(p => p.usuario_id !== userId);

   return res.redirect('/shop/my-products');
}


// Utilidades
export async function fetchAllProducts() {
    return await ShopProduct.getAllProducts();
}

export async function fetchUserProducts(userId) {
    if (!userId) return [];
    return await ShopProduct.getProductsByUserId(userId);
}
