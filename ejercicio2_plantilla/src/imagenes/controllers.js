import { validationResult, matchedData } from 'express-validator';
import { Foto } from './imagenes.js';
import imagenesRouter from './router.js';
import { render } from '../utils/render.js';
import { config } from '../config.js';
import session from 'express-session';

export function viewSubmit(req, res) {
    let contenido = 'paginas/Usuarios/noRegistrado';
    if (req.session.login) {
        contenido = 'paginas/Usuarios/submit';
    }
    render(req, res, contenido, {
        datos: {},
        errores: {}
    });
}

export async function doSubmit(req, res) {
    const result = validationResult(req);
    const errores = result.array();
    if (!result.isEmpty() && !errores.some(err => err.path === 'foto')) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/imagenes/submit', {
            error: {},
            errores,
            datos
        });
    }

    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const imagen = req.file.filename;
    try {
        const foto = await Foto.registrar(nombre, descripcion, imagen, req.session.username, null);

        res.setFlash(`Imagen subida con éxito: ${nombre}`);
        
        return res.redirect('../contenido/index');

    } catch (e) {
        const datos = matchedData(req);
        let error = 'Error al subir la imagen: ' + e;
        if (e.name === '') {
            error = 'El nombre de la imagen ya está en uso';
        }
        render(req, res, 'paginas/imagenes/submit', {
            error,
            datos,
            errores: {}
        });
    }

    
}