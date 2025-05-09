document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', initBusqueda);

function initBusqueda() {
    var form = document.getElementById('form-busqueda');
    var input = document.getElementById('input-busqueda');

    if (form && input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.submit();
            }
        });
    }
}