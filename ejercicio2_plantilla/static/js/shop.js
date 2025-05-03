// Obtener los elementos del DOM
const addProductBtn = document.getElementById('addProductBtn');
const modal = document.getElementById('addProductModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Mostrar el modal cuando el botón sea presionado
addProductBtn.addEventListener('click', function() {
    modal.style.display = 'block';
});

// Cerrar el modal cuando el usuario haga clic en el botón de cerrar
closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Cerrar el modal si el usuario hace clic fuera del contenido del modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }

    });

    document.addEventListener("DOMContentLoaded", () => {
        // Obtener el botón "Ver Mis Productos"
        const viewMyProductsBtn = document.getElementById('viewMyProductsBtn');
    
        // Verificar si el botón existe
        if (viewMyProductsBtn) {
            // Añadir evento de clic al botón
            viewMyProductsBtn.addEventListener('click', () => {
                // Redirigir a la ruta de "Mis Productos"
                window.location.href = "/shop/my-products";  // Esta es la URL donde se deben mostrar los productos del usuario
            });
        }
    });
