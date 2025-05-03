// shop.js

export const ProductType = Object.freeze({
    PRODUCT: 'P', // Producto en venta
    SOLD: 'S'     // Producto vendido
});

export class ShopProduct {
    static #db = null;
    static #insertStmt = null;
    static #deleteStmt = null;
    static #getProductsById = null;
    static #getProductsByUserId = null;
    static #updateStmt = null;

    static initStatements(db) {
        this.#db = db;
        this.#insertStmt = db.prepare('INSERT INTO Productos(nombre, descripcion, precio, imagen, estado, usuario_id) VALUES (@nombre, @descripcion, @precio, @imagen, @estado, @usuario_id)');
        this.#deleteStmt = db.prepare('DELETE FROM Productos WHERE id = @id');
        this.#updateStmt = db.prepare('UPDATE Productos SET nombre = @nombre, descripcion = @descripcion, precio = @precio, imagen = @imagen, estado = @estado, usuario_id = @usuario_id WHERE id = @id');
        this.#getProductsById = db.prepare('SELECT * FROM Productos WHERE id = @id');
        this.#getProductsByUserId = db.prepare('SELECT * FROM Productos WHERE usuario_id = @usuario_id'); // Método para productos del usuario
    }

    static getAllProducts() {
        return new Promise((resolve, reject) => {
            try {
                // Asegúrate de que 'P' esté entre comillas simples para que sea interpretado correctamente
                const rows = this.#db.prepare('SELECT * FROM Productos').all();
                
                if (!rows || rows.length === 0) {
                    resolve([]);  // Si no hay productos, resolvemos con un array vacío
                } else {
                    // Mapeamos los resultados a instancias de ShopProduct
                    const products = rows.map(row =>
                        new ShopProduct(row.id, row.nombre, row.descripcion, row.precio, row.imagen, row.estado, row.usuario_id)
                    );
                    resolve(products);  // Resolvemos con los productos obtenidos
                }
            } catch (e) {
                console.error("Error al recuperar productos:", e);
                reject(e);  // Rechazamos la promesa en caso de error
            }
        });
    }
    
    
    
    static getProductsByUserId(userId) {
        return new Promise((resolve, reject) => {
            try {
                const rows = this.#getProductsByUserId.all({ usuario_id: userId });
                if (!rows || rows.length === 0) {
                    resolve([]);
                } else {
                    const userProducts = rows.map(row => new ShopProduct(row.id, row.nombre, row.descripcion, row.precio, row.imagen, row.estado, row.usuario_id));
                    resolve(userProducts);
                }
            } catch (e) {
                console.error("Error al recuperar productos del usuario:", e);
                reject(e);
            }
        });
    }


    static #insert(product) {
        let result = null;
        try {
            // Asignar valores a las variables desde el producto
            const name = product.#name;
            const description = product.#description;
            const price = product.#price;
            const image = product.#image;
            const status = product.#status;
            const userId = product.#userId;
    
            // Asegúrate de que los parámetros estén correctamente nombrados
            const datos = { 
                nombre: name,          // Nombre en minúsculas como espera la consulta SQL
                descripcion: description,
                precio: price,
                imagen: image,
                estado: status,
                usuario_id: userId
            };
    
            // Ejecutar la consulta con los datos proporcionados
            result = this.#insertStmt.run(datos);
            product.#id = result.lastInsertRowid;
        } catch (e) {
            throw new Error('No se ha podido añadir el producto', { cause: e });
        }
        return product;
    }

    static #delete(product) {
        let result = null;
        try {
            const id = product.#id;
            result = this.#deleteStmt.run({ id });
        } catch (e) {
            throw new Error('No se ha podido eliminar el producto', { cause: e });
        }
        return product;
    }

    static #update(product) {
        const datos = {
            id: product.#id,
            nombre: product.#name,
            descripcion: product.#description,
            precio: product.#price,
            imagen: product.#image,
            estado: product.#status,
            usuario_id: product.#userId
        };
    
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) {
            throw new Error(`No se pudo actualizar el producto con id ${product.#id}`);
        }
    
        return product;
    }
    

    static getProductById(id) {
        const row = this.#getProductsById.get({ id });
        if (!row) throw new Error('Producto no encontrado');
        return new ShopProduct(row.id, row.nombre, row.descripcion, row.precio, row.imagen, row.estado, row.usuario_id);
    }
    

    #id;
    #name;
    #description;
    #price;
    #image;
    #status;
    #userId;

    constructor(id, name, description, price, image, status, userId) {
        this.#id = id || null;
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#image = image;
        this.#status = status; // 'P' para productos en venta, 'S' para productos vendidos
        this.#userId = userId;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get price() {
        return this.#price;
    }

    get image() {
        return this.#image;
    }

    get status() {
        return this.#status;
    }
    get userId() {
        return this.#userId; // Obtener el ID del usuario
    }

    // Método para cambiar el estado del producto (venderlo, por ejemplo)
    sell() {
        if (this.#status === ProductType.SOLD) {
            throw new Error("El producto ya ha sido vendido");
        }
        this.#status = ProductType.SOLD;
        this.persist();
    }

    persist() {
        if (this.#id === null) return ShopProduct.#insert(this);
        return ShopProduct.#update(this);
    }
    

    delete() {
        return ShopProduct.#delete(this);
    }
}
