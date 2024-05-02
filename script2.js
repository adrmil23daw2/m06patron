document.addEventListener("DOMContentLoaded", function() {
  const cronometroDisplay = document.getElementById("cronometro");
  const puntuacionDisplay = document.getElementById("puntuacion");
  let intervaloCronometro;

  // Función para iniciar el cronómetro
  function iniciarCronometro() {
    let segundos = 0;
    intervaloCronometro = setInterval(function() {
      segundos++;
      const horas = Math.floor(segundos / 3600);
      const minutos = Math.floor((segundos % 3600) / 60);
      const secs = segundos % 60;
      cronometroDisplay.textContent = 
        (horas < 10 ? "0" : "") + horas + ":" +
        (minutos < 10 ? "0" : "") + minutos + ":" +
        (secs < 10 ? "0" : "") + secs;
    }, 1000);
  }

  // Función para detener el cronómetro
  function detenerCronometro() {
    clearInterval(intervaloCronometro);
  }

  // Función para reiniciar el cronómetro y la puntuación
  function reiniciarCronometroYPuntuacion() {
    clearInterval(intervaloCronometro);
    cronometroDisplay.textContent = "00:00:00";
    actualizarPuntuacion(0); // Reinicia la puntuación a 0
    iniciarCronometro();
  }

  // Función para obtener la puntuación del sessionStorage
  function obtenerPuntuacion() {
    return sessionStorage.getItem("puntuacion") || "0";
  }

  // Función para actualizar la puntuación en el sessionStorage
  function actualizarPuntuacion(nuevaPuntuacion) {
    sessionStorage.setItem("puntuacion", nuevaPuntuacion);
    puntuacionDisplay.textContent = nuevaPuntuacion;
  }

  // Función para iniciar el cronómetro cuando se carga la página
  iniciarCronometro();

  // Manejador para el botón "Reiniciar"
  document.getElementById("reiniciar").addEventListener("click", function() {
    reiniciarCronometroYPuntuacion(); // Llama a la función que reinicia el cronómetro y la puntuación
  });

  const figuras = document.querySelectorAll("#tabla2 img");
  const zonasDeSoltar = document.querySelectorAll(".espacio-vacio");

  let figuraArrastrada = null;

  figuras.forEach(figure => {
    figure.addEventListener("dragstart", function() {
      figuraArrastrada = figure;
    });

    figure.addEventListener("dragend", function() {
      figuraArrastrada = null;
    });
  });

  zonasDeSoltar.forEach(zonaDeSoltar => {
    zonaDeSoltar.addEventListener("dragover", function(event) {
      event.preventDefault();
    });

    zonaDeSoltar.addEventListener("drop", function() {
      if (figuraArrastrada) {
        this.innerHTML = "";
        this.appendChild(figuraArrastrada.cloneNode(true));
      }
    });
  });

  // Manejador para el botón "Verificar"
  document.getElementById("verificar").addEventListener("click", function() {
    const contenidoZonaDeSoltar = document.querySelector(".espacio-vacio img");
    if (contenidoZonaDeSoltar) {
      const nombreImagen = contenidoZonaDeSoltar.getAttribute("src");
      const regex = /([^\/]+)\.png$/;
      const coincidencia = regex.exec(nombreImagen);
      if (coincidencia && coincidencia[1] === "triangulo") {
        // Aumentar la puntuación en 10
        const puntuacionActual = parseInt(obtenerPuntuacion());
        const nuevaPuntuacion = puntuacionActual + 10;
        actualizarPuntuacion(nuevaPuntuacion);
        // Redirigir a la página "primero.html"
        window.location.href = "tercero.html";
      } else {
        // Restar 5 a la puntuación
        const puntuacionActual = parseInt(obtenerPuntuacion());
        const nuevaPuntuacion = Math.max(puntuacionActual - 5, 0);
        actualizarPuntuacion(nuevaPuntuacion);
        alert("Incorrecto.");
      }
    } else {
      alert("No hay ninguna imagen en el espacio en blanco.");
    }
  });

  // Actualizar la puntuación al cargar la página
  puntuacionDisplay.textContent = obtenerPuntuacion();
});