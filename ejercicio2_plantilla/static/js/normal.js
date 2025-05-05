document.addEventListener('DOMContentLoaded', init);

function init() {
    mostrarFlashDialog();
    const btnPuntuar = document.getElementById('btnPuntuar');
    if (btnPuntuar) {
        btnPuntuar.addEventListener('click', manejarPuntuar);
    }
}

// Función para mostrar el modal de flash si existe
function mostrarFlashDialog() {
    const flashDialogEl = document.getElementById("flashModal");
    if (flashDialogEl) {
        flashDialogEl.showModal();
    }
}

// Función para manejar el evento de puntuación
function manejarPuntuar() {
    const puntuacionElement = document.getElementById('puntuacion');
    let puntuacion = parseInt(puntuacionElement.textContent, 10);
    puntuacion++;
    puntuacionElement.textContent = puntuacion;

    fetch('/contenido/normal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: '<%= imagen %>', puntuacion })
    });
}


