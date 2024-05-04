import { verificar } from "./funciones.js";
import { Timer } from "./timer.js";

  
  document.addEventListener("DOMContentLoaded", () => {
    const cronometroDisplay = document.getElementById("cronometro");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const dbName = "puntuacionDB";
    const dbVersion = 1;
    const dbRequest = window.indexedDB.open(dbName, dbVersion);
  
    const timer = new Timer(cronometroDisplay, puntuacionDisplay, dbRequest);
  
    // Manejador para el botón "Reiniciar"
    document.getElementById("reiniciar").addEventListener("click", () => {
      timer.reiniciarCronometroYPuntuacion(); // Llama a la función que reinicia el cronómetro y la puntuación
    });
  
    const figuras = document.querySelectorAll("#tabla2 img");
    const zonasDeSoltar = document.querySelectorAll(".espacio-vacio");
  
    figuras.forEach(figure => {
      figure.addEventListener("dragstart", event => {
        timer.figuraArrastrada = event.target;
      });
    });
  
    zonasDeSoltar.forEach(zonaDeSoltar => {
      zonaDeSoltar.addEventListener("dragover", event => {
        event.preventDefault();
      });
  
      zonaDeSoltar.addEventListener("drop", event => {
        event.preventDefault();
        if (timer.figuraArrastrada) {
          zonaDeSoltar.innerHTML = "";
          zonaDeSoltar.appendChild(timer.figuraArrastrada.cloneNode(true));
          timer.guardarUltimaImagen(timer.figuraArrastrada.getAttribute("src")); // Guardar la última imagen colocada
          timer.figuraArrastrada = null; // Restablecer la variable figuraArrastrada después de soltarla
        }
      });
    });
    verificar(/circulo\.png$/, "final.html", timer);
  });

