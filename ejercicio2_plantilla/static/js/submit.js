document.addEventListener('DOMContentLoaded', init);

/*--El scrip para mostrar como es la imagen antes de subirla ha sido apoyada en chatgpt*/
function init() {
    var inputImagen = document.getElementById('imagen');
    var preview = document.getElementById('preview');

    if (inputImagen && preview) {
        inputImagen.addEventListener('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

  