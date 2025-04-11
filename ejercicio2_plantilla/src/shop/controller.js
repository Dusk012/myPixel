import { ShopProduct } from './shop.js';
import { render } from '../utils/render.js';

export class ShopController {
    // Añadir un nuevo producto
    static async addProduct(req, res) {
        try {
            const { name, description, price, image } = req.body;

            if (!name || !description || !price || !image) {
                return render(req, res, 'paginas/tienda/shop', {
                    error: 'Todos los campos son obligatorios',
                });
            }

            const product = new ShopProduct(null, name, description, price, image, 'P');
            await product.persist();

            return render(req, res, 'paginas/tienda/shop', {
                success: 'Producto añadido correctamente',
            });
        } catch (err) {
            return render(req, res, 'paginas/tienda/shop', {
                error: 'No se pudo añadir el producto',
                details: err.message
            });
        }
    }

    // Obtener todos los productos de la tienda
    static async getAllProducts(req, res) {
        try {
            const products = await ShopProduct.getAllProducts();
            if (products && products.length > 0) {
                res.render('tienda/shop', { products });
            } else {
                res.render('tienda/shop', { error: 'No hay productos disponibles en este momento.' });
            }
        } catch (err) {
            console.error("Error al obtener los productos:", err);
            res.render('tienda/shop', { error: 'No se pudieron cargsar los productos.' });
        }
    }
    
    // Obtener un producto específico por su ID
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ShopProduct.getProductById(id);
            return render(req, res, 'paginas/tienda/producto', {
                product
            });
        } catch (err) {
            return render(req, res, 'paginas/tienda/shop', {
                error: 'Producto no encontrado',
                details: err.message
            });
        }
    }

    // Vender un producto
    static async sellProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await ShopProduct.getProductById(id);
            product.sell();

            return render(req, res, 'paginas/tienda/shop', {
                success: 'Producto vendido correctamente',
            });
        } catch (err) {
            return render(req, res, 'paginas/tienda/shop', {
                error: 'No se pudo vender el producto',
                details: err.message
            });
        }
    }

    // Eliminar un producto
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await ShopProduct.getProductById(id);
            await product.delete();

            return render(req, res, 'paginas/tienda/shop', {
                success: 'Producto eliminado correctamente',
            });
        } catch (err) {
            return render(req, res, 'paginas/tienda/shop', {
                error: 'No se pudo eliminar el producto',
                details: err.message
            });
        }
    }
}
