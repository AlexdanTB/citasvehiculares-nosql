document.addEventListener('DOMContentLoaded', function() {
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', hoy);
  }

  console.log('Sistema de Agendamiento Vehicular cargado');
});