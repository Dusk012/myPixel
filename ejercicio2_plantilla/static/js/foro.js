function mostrarFormulario(id) {
  const formulario = document.getElementById(`formulario-${id}`);
  if (formulario) {
    formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
  }
}