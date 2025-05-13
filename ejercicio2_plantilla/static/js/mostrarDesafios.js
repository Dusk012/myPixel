document.addEventListener('DOMContentLoaded', () => {
    // Actualizar las barras de progreso dinámicamente
    const desafios = JSON.parse(document.getElementById('desafios-data').textContent);

    desafios.forEach(desafio => {
        const progressBar = document.getElementById(`progress-${desafio.id}`);
        const progressPercentage = Math.min((desafio.puntos / desafio.puntuacionObjetivo) * 100, 100);
        progressBar.style.width = progressPercentage + '%';
        progressBar.innerText = Math.round(progressPercentage) + '%';
    });

    // Manejar el envío del formulario para crear desafíos
    const formCrear = document.getElementById('crearDesafioForm');
    if (formCrear) {
        formCrear.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(formCrear);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(formCrear.action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('¡Desafío creado con éxito!');
                    location.reload();
                } else {
                    alert('Hubo un error al crear el desafío.');
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Error al enviar el formulario.');
            }
        });
    }

    // Manejar la eliminación de desafíos
    const botonesBorrar = document.querySelectorAll('.botonborrardesafio');

    botonesBorrar.forEach(boton => {
        boton.addEventListener('click', async () => {
            const descripcion = boton.getAttribute('data-descripcion');
            const tipo = boton.getAttribute('data-tipo');

            console.log(`Datos obtenidos del botón: descripcion=${descripcion}, tipo=${tipo}`);

            if (confirm(`¿Estás segur@ de que deseas borrar el desafío "${descripcion}"?`)) {
                try {
                    const response = await fetch(`/contenido/desafios/eliminar`, {
                        method: 'POST', // Cambiado a POST
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ descripcion, tipo }),
                    });

                    if (response.ok) {
                        alert('¡Desafío eliminado con éxito!');
                        location.reload();
                    } else {
                        alert('Hubo un error al eliminar el desafío.');
                    }
                } catch (error) {
                    console.error('Error al eliminar el desafío:', error);
                    alert('Error al eliminar el desafío.');
                }
            }
        });
    });

    // Manejar la modificación de desafíos
    const botonesModificar = document.querySelectorAll('.botonmodificardesafio');
    const popupModificar = document.getElementById('popupModificar');
    const formModificar = document.getElementById('formModificarDesafio');

    const descripcionActualInput = document.getElementById('modificarDescripcionActual');
    const tipoActualInput = document.getElementById('modificarTipoActual');
    const descripcionNuevaInput = document.getElementById('modificarDescripcionNueva');
    const puntuacionObjetivoInput = document.getElementById('modificarPuntuacionObjetivo');
    const tipoNuevoInput = document.getElementById('modificarTipoNuevo');

    botonesModificar.forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtener los datos del desafío desde los atributos del botón
            const descripcion = boton.getAttribute('data-descripcion');
            const puntuacionObjetivo = boton.getAttribute('data-puntuacion');
            const tipo = boton.getAttribute('data-tipo');

            // Rellenar los campos del formulario
            descripcionActualInput.value = descripcion;
            tipoActualInput.value = tipo;
            descripcionNuevaInput.value = descripcion; // Inicialmente igual a la actual
            puntuacionObjetivoInput.value = puntuacionObjetivo;
            tipoNuevoInput.value = tipo; // Inicialmente igual al actual

            // Mostrar el popup
            popupModificar.style.display = 'block';
        });
    });

    // Cerrar el popup
    document.getElementById('cerrarPopup').addEventListener('click', () => {
        popupModificar.style.display = 'none';
    });

    if (formModificar) {
        formModificar.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(formModificar);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`/contenido/desafios/modificar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('¡Desafío modificado con éxito!');
                    location.reload();
                } else {
                    alert('Hubo un error al modificar el desafío.');
                }
            } catch (error) {
                console.error('Error al modificar el desafío:', error);
                alert('Error al modificar el desafío.');
            }
        });
    }
});
