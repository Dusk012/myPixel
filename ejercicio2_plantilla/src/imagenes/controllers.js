import { validationResult, matchedData } from 'express-validator';
import { Foto } from './imagenes.js';
import imagenesRouter from './router.js';
import { render } from '../utils/render.js';
import { config } from '../config.js';
import session from 'express-session';

export function viewSubmit(req, res) {
    let contenido = 'paginas/Imagenes/submit';
    render(req, res, contenido, {
        datos: {},
        errores: {}
    });
}

export async function doSubmit(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
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
    const imagen = req.body.imagen;

    try {
        const foto = await Foto.registrar(nombre, descripcion, imagen, req.session.id, null);
        /*req.session.login = true;
        req.session.nombre = usuario.nombre;
        req.session.rol = usuario.rol;*/

        res.setFlash(`Imagen subida con éxito: ${foto.nombre}`);
        
        return res.redirect('../contenido/index');

    } catch (e) {
        const datos = matchedData(req);
        let error = 'Error al subir la imagen';
        if (e.name === '') {
            error = 'El nombre de la imagen ya está en uso';
        }
        render(req, res, 'paginas/imagenes/submit', {
            error: 'Existe un problema con la subida de tu imagen',
            datos,
            errores: {}
        });
    }

    res.sendFile(join(config.uploads, req.params.id));
}

