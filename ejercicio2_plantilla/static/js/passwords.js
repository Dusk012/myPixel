/*
 * Inicializamos el JS cuando se ha terminado de procesar todo el HTML de la página.
 */
document.addEventListener('DOMContentLoaded', initPasswordChange);

/**
 * Inicializa la página de cambio de contraseña
 */
function initPasswordChange() {
    const formCambioPassword = document.forms.namedItem('cambioPassword');
    if (formCambioPassword) {
        formCambioPassword.addEventListener('submit', cambioPasswordSubmit);
        
        // Validación en tiempo real para coincidencia de contraseñas
        const newPassword = formCambioPassword.elements.namedItem('newPassword');
        const confirmPassword = formCambioPassword.elements.namedItem('confirmPassword');
        
        newPassword.addEventListener('input', () => validatePasswordMatch(newPassword, confirmPassword));
        confirmPassword.addEventListener('input', () => validatePasswordMatch(newPassword, confirmPassword));
    }
}

/**
 * Maneja el envío del formulario de cambio de contraseña
 * @param {SubmitEvent} e 
 */
async function cambioPasswordSubmit(e) {
    e.preventDefault();
    const formCambioPassword = e.target;
    const formData = new FormData(formCambioPassword);
    const data = Object.fromEntries(formData.entries());

    // Validaciones frontend equivalentes a las del backend
    const errors = {};

    // 1. Validación de contraseña actual (no vacía)
    if (!data.currentPassword.trim()) {
        errors.currentPassword = 'La contraseña actual no puede estar vacía';
    }

    // 2. Validación de longitud de nueva contraseña
    if (data.newPassword.length < 6 || data.newPassword.length > 10) {
        errors.newPassword = 'La contraseña debe tener entre 6 y 10 caracteres';
    }

    // 3. Validación de coincidencia de contraseñas
    if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Si hay errores, mostrarlos y detener el envío
    if (Object.keys(errors).length > 0) {
        displayFrontendErrors(errors);
        return;
    }

    // Si pasa las validaciones frontend, enviar al servidor
    try {
        const response = await postData('/usuarios/cambiar-password', data);
        
        if (response.redirected) {
            // Si el servidor respondió con una redirección
            window.location.href = response.url;
        } else if (response.ok) {
            // Esto no debería ocurrir si el servidor hace redirect
            console.log('Cambio de contraseña exitoso pero no hubo redirección');
        } else {
            const backendErrors = await response.json();
            displayBackendErrors(backendErrors);
        }
    } catch (err) {
        console.error('Error:', err);
        displayFrontendErrors({
            general: 'Error al comunicarse con el servidor'
        });
    }
}

/**
 * Valida que las contraseñas coincidan en tiempo real
 */
function validatePasswordMatch(newPasswordField, confirmPasswordField) {
    const feedback = confirmPasswordField.parentElement.querySelector('.feedback');
    if (!feedback) return;

    if (newPasswordField.value !== confirmPasswordField.value && confirmPasswordField.value !== '') {
        feedback.textContent = '⚠ Las contraseñas no coinciden';
        feedback.style.color = 'red';
    } else if (confirmPasswordField.value !== '') {
        feedback.textContent = '✔ Las contraseñas coinciden';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = '';
    }
}