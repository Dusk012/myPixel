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
            const desafioId = boton.getAttribute('data-id');

            if (confirm('¿Estás segur@ de que deseas borrar este desafío?')) {
                try {
                    const response = await fetch(`/contenido/desafios/${desafioId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        alert('¡Desafío borrado con éxito!');
                        location.reload();
                    } else {
                        alert('Hubo un error al borrar el desafío.');
                    }
                } catch (error) {
                    console.error('Error al borrar el desafío:', error);
                    alert('Error al borrar el desafío.');
                }
            }
        });
    });

    // Manejar la modificación de desafíos
    const botonesModificar = document.querySelectorAll('.botonmodificardesafio');
    const popup = document.getElementById('popupModificar');
    const formModificar = document.getElementById('formModificarDesafio');
    const cerrarPopup = document.getElementById('cerrarPopup');

    botonesModificar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const descripcion = boton.getAttribute('data-descripcion');
            const puntuacion = boton.getAttribute('data-puntuacion');
            const tipo = boton.getAttribute('data-tipo');

            // Rellenar los campos del formulario "Modificar Desafío"
            document.getElementById('modificarDesafioId').value = id;
            document.getElementById('modificarDescripcion').value = descripcion;
            document.getElementById('modificarPuntuacionObjetivo').value = puntuacion;
            document.getElementById('modificarTipo').value = tipo;

            popup.style.display = 'block';
        });
    });

    if (cerrarPopup) {
        cerrarPopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

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