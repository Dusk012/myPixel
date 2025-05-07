import { validationResult, matchedData } from 'express-validator';
import { Foto } from './imagenes.js';
import imagenesRouter from './router.js';
import { render } from '../utils/render.js';
import fs from 'fs-extra';
import path from 'path';

export function viewSubmit(req, res) {
    let contenido = 'paginas/Usuarios/noRegistrado';
    if (req.session.login) {
        contenido = 'paginas/imagenes/submit';
    }
    render(req, res, contenido, {
        datos: {},
        errores: {}
    });
}

export async function doSubmit(req, res) {

    const result = validationResult(req);
    const errores = result.array();

    
    // Verificar si no hay archivo subido
    if (!req.file) {
        errores.push({
            path: 'foto',
            msg: 'Debes seleccionar una imagen'
        });
    }

    if (!result.isEmpty() || errores.length > 0) {
        const erroresMapped = errores.reduce((acc, err) => {
            acc[err.path] = err;
            return acc;
        }, {});
        

   
        const datos = matchedData(req);
        return render(req, res, 'paginas/imagenes/submit', {
            error: {},
            errores: erroresMapped,
            datos
        });
    }

    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const imagen = req.file.filename;
    
    try {
        const foto = await Foto.registrar(nombre, descripcion, imagen, req.session.username, null);
        res.setFlash(`Imagen subida con éxito: ${nombre}`);
        return res.redirect('../contenido/normal');
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
export async function viewFoto(req, res) {
    let contenido = 'paginas/Usuarios/noRegistrado';
    if (req.session.login) {
        contenido = 'paginas/imagenes/foto';
    }
    const id = req.body.id;
    try {
        const foto = await Foto.getFotoById(id);
        let error = null;
        if (!foto) {
            error = 'No existe la foto a enseñar';
        }

        render(req, res, contenido, {
            error,
            foto: foto,
            errores: {}
        });

    } catch (e) {
        const datos = matchedData(req);
        let error = 'Error en la imagen: ' + e;
        if (e.name === '') {
            error = 'No se encuentra la imagen';
        }
        render(req, res, contenido, {
            error,
            datos,
            errores: {}
        });
    }
}

export async function updateFoto(req, res) {
    try {
        const { id, nombre, descripcion, puntuacion, estado, fecha, contenido } = req.body; 
        
        if (!nombre || !descripcion) {
            let error = 'Completa todos los campos, estos no pueden estar en blanco';
            return render(req, res, 'paginas/imagenes/foto', {
                error,
                foto: { nombre, descripcion, puntuacion, estado, fecha, contenido },
                errores: {}
            });
        }

        let foto = await Foto.getFotoById(id);

        if (!foto) {
            let error = 'No existe la foto';
            return render(req, res, 'paginas/imagenes/foto', {
                error,
                foto: { nombre, descripcion, puntuacion, estado, fecha, contenido },
                errores: {}
            });
        }

        foto.nombre = nombre;
        foto.descripcion = descripcion;
        foto.estado = estado;

        await foto.persist();

        return res.redirect('/usuarios/perfil');
    } catch (e) {
        console.error(e);
        let error = 'Error al actualizar la imagen: ' + e.message || e;
        return render(req, res, 'paginas/imagenes/foto', {
            error,
            foto: req.body, 
            errores: {}
        });
    }
}

export async function deleteFoto(req, res) {
    try {
        const { id, contenido } = req.body;
        console.log(req.body);
        Foto.delete(id);
        const filePath = path.join(process.cwd(), 'uploads', contenido);
        await fs.remove(filePath);
        return res.redirect('/usuarios/perfil');
    } catch (e) {
        console.error(e);
        let error = 'Error al eliminar la imagen: ' + e.message;
        console.log(error);
        return render(req, res, 'paginas/imagenes/foto', {
            error,
            foto: req.body, 
            errores: {}
        });
    }
