function darseDeBaja() {
    // Confirmar la acción
    if (confirm('¿Estás seguro de que deseas darte de baja? Esta acción no se puede deshacer.')) {
        // Enviar una solicitud POST al backend
        fetch('/usuarios/darseDeBaja', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: sessionUsername }) // Usar la variable global `sessionUsername`
        })
        .then(response => {
            if (response.ok) {
                alert('Tu cuenta ha sido eliminada.');
                window.location.href = '/usuarios/logout'; // Redirigir al logout
            } else {
                alert('Hubo un problema al intentar darte de baja.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function seleccionarFoto(foto) {
    // Extraer el número de la foto del nombre del archivo ("Perfil1.png" -> "1")
    const numeroPerfil = foto.match(/\d+/)[0];

    // Actualizar el campo oculto con el número de la foto seleccionada
    document.getElementById('foto-perfil-input').value = numeroPerfil;

    // Mostrar un mensaje indicando la selección
    document.getElementById('foto-seleccionada').innerText = `Has seleccionado Perfil ${numeroPerfil}`;
}