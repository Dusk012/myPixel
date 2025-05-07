document.addEventListener('DOMContentLoaded', init);

function init() {
    mostrarFlashDialog();
    const btnPuntuar = document.getElementById('btnPuntuar');
    if (btnPuntuar) {
        btnPuntuar.addEventListener('click', manejarPuntuar);
    }
}

function mostrarFlashDialog() {
    const flashDialogEl = document.getElementById("flashModal");
    if (flashDialogEl) {
        flashDialogEl.showModal();
    }
}

function manejarPuntuar() {
    const puntuacionElement = document.getElementById('puntuacion');
    const contenido = document.getElementById('contenido').textContent;
    let puntuacion = parseInt(puntuacionElement.textContent, 10);
    puntuacion++;
    puntuacionElement.textContent = puntuacion;

    fetch('/contenido/normal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido, puntuacion })
    });
}


