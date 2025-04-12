import { ShopProduct } from './shop.js';
import { render } from '../utils/render.js';
import { validationResult, matchedData } from 'express-validator';
export class ShopController {
    // Añadir un nuevo producto
    static async addProduct(req, res) {
        // Validación de los datos recibidos
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // Si hay errores de validación, renderizamos la vista de la tienda con los errores
            const errores = result.mapped();
            return render(req, res, 'paginas/tienda/shop', {
                error: 'Por favor, corrija los errores.',
                errores, // Pasamos los errores al renderizado
                datos: req.body,
                session: req.session
            });
        }
    
        try {
            const { name, description, price } = req.body;  // Extraemos los datos del producto
            const imageFile = req.file; // Extraemos la imagen cargada
    
            // Validamos que todos los campos necesarios estén presentes
            if (!name || !description || !price || !imageFile) {
                const products = await ShopProduct.getAllProducts();
                return render(req, res, 'paginas/tienda/shop', {
                    error: { msg: 'Todos los campos son obligatorios' },
                    products,
                    session: req.session
                });
            }
    
            // Ruta pública para la imagen cargada
            const imagePath = '/uploads/' + imageFile.filename;
    
            // Creamos una instancia de ShopProduct con los datos del formulario
            const product = new ShopProduct(null, name, description, parseFloat(price), imagePath, 'P');
            // Guardamos el producto en la base de datos
            await product.persist();
    
            // Después de añadir el producto, redirigimos al cliente para evitar que se reenvíe la solicitud POST
            return res.redirect('/contenido/tienda');  // Redirige a la ruta que muestra todos los productos
    
        } catch (e) {
            console.error('Error al añadir el producto:', e);
    
            // En caso de error, mostramos un mensaje de error en la vista
            const products = await ShopProduct.getAllProducts();
            return render(req, res, 'paginas/tienda/shop', {
                error: { msg: 'No se pudo añadir el producto' },
                products,
                session: req.session
            });
        }
    }
    

    // Obtener todos los productos de la tienda
    static async getAllProducts(req, res) {
        try {
            const products = await ShopProduct.getAllProducts();
            
            // Verifica si hay productos y pasa correctamente los datos a la vista
            if (products && products.length > 0) {
                res.render('tienda/shop', { products });
            } else {
                // Si no hay productos, pasamos un array vacío a la vista
                res.render('tienda/shop', { products: [] });
            }
        } catch (err) {
            console.error("Error al obtener los productos:", err);
            // En caso de error, también pasamos un array vacío para evitar que la vista falle
            res.render('tienda/shop', { products: [], error: 'No se pudieron cargar los productos.' });
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
