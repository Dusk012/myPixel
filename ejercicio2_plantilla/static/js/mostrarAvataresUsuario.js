document.addEventListener('DOMContentLoaded', init);

function init() {
    const username = document.getElementById('username-input')?.value; // Obtener el username desde un campo oculto

    if (username) {
        // Obtener la foto de perfil desde la base de datos
        fetch(`/usuarios/fotoPerfil?username=${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener la foto de perfil');
                }
                return response.json();
            })
            .then((data) => {
                const fotoPerfilInput = document.getElementById('foto-perfil-input');
                const fotoSeleccionada = document.querySelector('#foto-perfil-seleccionada img');

                if (fotoPerfilInput && fotoSeleccionada) {
                    // Actualizar el valor del input y la imagen
                    fotoPerfilInput.value = data.foto_perfil;
                    const fotoSrc = `../img/Perfil${data.foto_perfil}.png?timestamp=${Date.now()}`;
                    fotoSeleccionada.src = fotoSrc;
                }
            })
            .catch((error) => {
                console.error('Error al cargar la foto de perfil:', error);
            });
    }

    // Asignar la función darseDeBaja al botón
    const btnDarseDeBaja = document.querySelector('button[onclick="darseDeBaja()"]');
    if (btnDarseDeBaja) {
        btnDarseDeBaja.addEventListener('click', () => darseDeBaja(username));
    }

    // Asignar la función seleccionarFoto a los botones de selección de foto
    const botonesSeleccionarFoto = document.querySelectorAll('button[onclick^="seleccionarFoto"]');
    botonesSeleccionarFoto.forEach((button) => {
        button.addEventListener('click', () => {
            const foto = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            seleccionarFoto(foto);
        });
    });
}

// Función para darse de baja
function darseDeBaja(username) {
    if (!username) {
        console.error('No se encontró el username.');
        return;
    }

    if (confirm('¿Estás seguro de que deseas darte de baja? Esta acción no se puede deshacer.')) {
        fetch('/usuarios/darseDeBaja', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }), // Enviar el username
        })
            .then((response) => {
                if (response.ok) {
                    alert('Tu cuenta ha sido eliminada.');
                    window.location.href = '/usuarios/logout'; // Redirigir al logout
                } else {
                    alert('Hubo un problema al intentar darte de baja.');
                }
            })
            .catch((error) => console.error('Error:', error));
    }
}

// Función para seleccionar una foto de perfil
function seleccionarFoto(foto) {
    const numeroPerfil = foto.match(/\d+/)[0]; // Extraer el número de la foto
    const inputFotoPerfil = document.getElementById('foto-perfil-input');
    const mensajeSeleccionada = document.getElementById('foto-seleccionada');

    if (inputFotoPerfil && mensajeSeleccionada) {
        inputFotoPerfil.value = numeroPerfil; // Actualizar el campo oculto
        mensajeSeleccionada.innerText = `Has seleccionado Perfil ${numeroPerfil}`; // Mostrar mensaje
    } else {
        console.error('No se encontraron los elementos necesarios para cambiar el avatar.');
    }
}