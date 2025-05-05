document.addEventListener('DOMContentLoaded', init);

function init(idCreador) {
    fetch(`/fotos/creador/${idCreador}`)
        .then(res => {
            if (!res.ok) throw new Error("No se pudieron obtener las fotos");
            return res.json();
        })
        .then(fotos => {
            const container = document.getElementById('fotoContainer');
            container.innerHTML = '';
            fotos.forEach(foto => {
                const card = document.createElement('div');
                card.className = 'foto-card';
                card.innerHTML = `
                    <img src="${foto.contenido}" alt="${foto.nombre}">
                    <h3>${foto.nombre}</h3>
                    <p class="descripcion">${foto.descripcion}</p>
                    <p><strong>Fecha:</strong> ${foto.fecha}</p>
                    <p><strong>Puntuación:</strong> ${foto.puntuacion}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            document.getElementById('fotoContainer').innerHTML = `<p>${err.message}</p>`;
        });
}
