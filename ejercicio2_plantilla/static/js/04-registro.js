/*
 * Inicializamos el JS cuando se ha terminado de procesar todo el HTML de la página.
 *
 * Al incluir <script> al final de la página podríamos invocar simplemente a init().
 */
document.addEventListener('DOMContentLoaded', init);

/**
 * Inicializa la página
 */
function init() {
    const formRegistro = document.forms.namedItem('registro');
    formRegistro.addEventListener('submit', registroSubmit);

    const username = formRegistro.elements.namedItem('username');

    // username.addEventListener('change', usernameDisponible);
    username.addEventListener('input', usernameDisponible);
}

/**
 * 
 * @param {SubmitEvent} e 
 */
async function registroSubmit(e){
   
        e.preventDefault();
        const formRegistro = e.target;
        const formData = new FormData(formRegistro);
        const data = Object.fromEntries(formData.entries());
    
        // Validaciones frontend equivalentes a las del backend
        const errors = {};
    
        // 1. Validación de username (solo letras y números)
        if (!/^[A-Z0-9]*$/i.test(data.username)) {
            errors.username = 'Sólo puede contener números y letras';
        }
    
        // 2. Validación de campos vacíos
        if (!data.username.trim()) {
            errors.username = 'No puede ser vacío';
        }
    
        if (!data.nombre.trim()) {
            errors.nombre = 'No puede ser vacío';
        }
    
        // 3. Validación de longitud de contraseña
        if (data.password.length < 6 || data.password.length > 10) {
            errors.password = 'La contraseña debe tener entre 6 y 10 caracteres';
        }
    
        // 4. Validación de coincidencia de contraseñas
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }
    
        // Si hay errores, mostrarlos y detener el envío
        if (Object.keys(errors).length > 0) {
            displayFrontendErrors(errors);
            return;
        }
    
        // Si pasa las validaciones frontend, enviar al servidor
        try {
            const response = await postData('/usuarios/register', data);
            
           if (response.redirected) {
            // Si el servidor respondió con una redirección
            window.location.href = response.url;
        } else if (response.ok) {
            // Esto no debería ocurrir si el servidor hace redirect
            console.log('Registro exitoso pero no hubo redirección');
        } else {
            const backendErrors = await response.json();
            displayBackendErrors(backendErrors);
        }
        } catch (err) {
            console.error('Error:', err);
        }
    
}

function displayFrontendErrors(errors) {
    // Limpiar errores previos
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // Mostrar nuevos errores
    for (const [field, message] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'red';
            errorDiv.style.marginTop = '5px';
            input.insertAdjacentElement('afterend', errorDiv);
        }
    }
}

async function displayErrores(response) {
    const { errores } = await response.json();
    const formRegistro = document.forms.namedItem('registro');
    for(const input of formRegistro.elements) {
        if (input.name == undefined || input.name === '') continue;
        const feedback = formRegistro.querySelector(`*[name="${input.name}"] ~ span.error`);
        if (feedback == undefined) continue;

        feedback.textContent = '';

        const error = errores[input.name];
        if (error) {
            feedback.textContent = error.msg;
        }
    }
}

function compruebaEmail(e) {
    const email = e.target;
    const formRegistro = email.form;
    if (correoValidoUCM(email.value)) {
        email.setCustomValidity('');
    } else {
        email.setCustomValidity("El correo debe ser válido y acabar por @ucm.es");
    }

    // validación html5, porque el campo es <input type="email" ...>
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
    // se asigna la pseudoclase :invalid
    const esCorreoValido = email.checkValidity();
    const feedback = formRegistro.querySelector(`*[name="${email.name}"] ~ span.error`);
    if (esCorreoValido) {
        // el correo es válido y acaba por @ucm.es

        feedback.textContent = '✔';
        feedback.style.color = 'green';
      
        // <-- aquí pongo la marca apropiada, y quito (si la hay) la otra
        // ✔
    } else {			
        // correo invalido: ponemos una marca e indicamos al usuario que no es valido

        feedback.textContent = '⚠';
        feedback.style.color = 'red';
        // <-- aquí pongo la marca apropiada, y quito (si la hay) la otra
        // ⚠
    }
    // Muestra el mensaje de validación
    email.reportValidity();
}

function correoValidoUCM(correo) {
    return correo.endsWith("@ucm.es");
}

async function usernameDisponible(e) {
    const username = e.target;
    try {
        username.setCustomValidity('');
        const feedback = username.form.querySelector(`*[name="${username.name}"] ~ .feedback`);
        feedback.textContent = '';
        if (username.value === '') return;

        const response = await postJson('/api/usuarios/disponible', {
            username: username.value
        });
        const jsonData = await response.json();
        const estaDisponible = JSON.parse(jsonData);
        
        if(estaDisponible){
            feedback.textContent = '✔';
            feedback.style.color = 'green';
            username.setCustomValidity('');
        }
        else {
            feedback.textContent = '⚠';
            feedback.style.color = 'red';
            username.setCustomValidity("El nombre de usuario ya está utilizado");
        }

        username.reportValidity();
    } catch (err) {
        console.error(`Error: `, err);
    }
}