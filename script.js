// Obtener el elemento del contador de tiempo
var timerElement = document.getElementById('timer');

// Función para iniciar el contador de tiempo
function startTimer() {
  // Inicializar el tiempo en segundos
  var seconds = 0;

  // Actualizar el contador de tiempo cada segundo
  var intervalId = setInterval(function() {
    // Convertir los segundos a horas, minutos y segundos
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    // Formatear el tiempo como HH:MM:SS
    var timeString = pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(remainingSeconds, 2);

    // Actualizar el texto del contador de tiempo
    timerElement.textContent = timeString;

    // Incrementar los segundos
    seconds++;
  }, 1000);

  // Función para detener el contador de tiempo
  function stopTimer() {
    clearInterval(intervalId);
  }
}

// Función para rellenar un número con ceros a la izquierda
function pad(number, length) {
  return String(number).padStart(length, '0');
}

// Llamar a la función startTimer al cargar la página
window.onload = startTimer;
