import { validationResult, matchedData } from 'express-validator';
import controllersRouter from './router.js';
import { render } from '../utils/render.js';
import { config } from '../config.js';
import { Foto } from '../imagenes/imagenes.js';
import session from 'express-session';
import { promises as fs } from 'fs';
import { ShopProduct } from '../shop/shop.js';

export async function normal(req, res) {
    //let contenido = 'paginas/Usuarios/noRegistrado';
    let contenido = 'paginas/Usuarios/normal';
    let data = {};
    let imagen = null;
    //if (req.session.login) {
        //contenido = 'paginas/Usuarios/normal';

            //Para elegir la imagen aleatoriamente usamos ChatGpt
        try {
            const archivos = await fs.readdir(config.uploads);

            if (archivos.length > 0) {
                const randomIndex = Math.floor(Math.random() * archivos.length);
                imagen = archivos[randomIndex];
                const foto = await Foto.getFotoByContenido(imagen);
                data.nombre = foto.nombre;
                data.descripcion = foto.descripcion;
                data.puntuacion = foto.puntuacion;
            }
            render(req, res, contenido, {
                data,
                imagen,
                error: null
            });
        } catch (e) {
            let error = 'Error con las imágenes: ' + e.message;
            render(req, res, contenido, {
                error,
                data: {},
                imagen: null
            });
        }
    //}
}

export async function gestionPuntuacion(req, res){
    const contenido = req.body.contenido;
    const puntuacion = req.body.puntuacion;
    try {
        const foto = await Foto.getFotoByContenido(contenido);

        if (foto) {
            foto.puntuacion = puntuacion;
            await Foto.actualizarFoto(foto);
        }

    } catch (e) {
        const datos = matchedData(req);
        let error = 'Error al aumentar la puntuación ' + e;
        render(req, res, 'paginas/Usuarios/normal', {
            error,
            datos,
            errores: {}
        });
    }
}

export function viewDesafios(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/desafios/desafios';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}

export async function viewShop(req, res) {
    try {
        const products = await ShopProduct.getAllProducts(); // Obtén los productos desde la base de datos

        console.log("Productos obtenidos:", products);  // Esto imprimirá los productos en la consola

        res.render('pagina', {
            contenido: 'paginas/tienda/shop', // El contenido de la tienda
            products: products,  // Pasamos los productos
            error: null,  // No hay error si los productos se cargan bien
            session: req.session  // Pasamos la sesión
        });
    } catch (err) {
        console.error("Error al obtener los productos:", err);  // Imprime cualquier error en la consola
        res.render('pagina', {
            contenido: 'paginas/tienda/shop',
            products: [],  // Pasamos un array vacío si ocurre un error
            error: 'No se pudieron cargar los productos.',  // Pasamos un mensaje de error
            session: req.session
        });
    }
}



/*
export function viewProfile(req, res) {
    let contenido = 'paginas/Usuarios/viewLogin';
    if (req.session.login) {
        contenido = 'paginas/Usuarios/profile';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        error: null
    });
}
*/

export function viewAdmin(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewCoordinador(req, res) {
    let contenido = 'paginas/Usuarios/noPermisos';
    if (req.session.esAdmin) {
        contenido = 'paginas/Usuarios/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}