import { validationResult, matchedData } from 'express-validator';

export function validar(redireccion = 'back') {
    return (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            const detalles = errores.mapped();
            const datos = matchedData(req);

            // Usamos setFlash para guardar errores y campos rellenados
            res.setFlash({
                tipo: 'error',
                mensaje: 'Errores en el formulario',
                errores: detalles,
                datos
            });

            // Redirige a la misma página o a una ruta personalizada
            return res.redirect(redireccion === 'back' ? req.get('referer') || '/' : redireccion);
        }

        next();
    };
}


export function validarIdParametro(req, res, next) {
    const { id } = req.params;
  
    // Validar que sea un número entero positivo
    if (!/^\d+$/.test(id)) {
      return res.status(400).send('ID de producto inválido');
    }
  
    // Convertir a número por seguridad si lo necesitas
    req.params.id = parseInt(id, 10);
  
    next();
  }
  