class Timer {
    constructor(cronometroDisplay, puntuacionDisplay, dbRequest) {
      this.cronometroDisplay = cronometroDisplay;
      this.puntuacionDisplay = puntuacionDisplay;
      this.dbRequest = dbRequest;
      this.intervaloCronometro;
      this.segundos = 0;
      this.figuraArrastrada = null;
      this.iniciar();
    }
  
    iniciar() {
      this.dbRequest.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction(["puntuacion"], "readwrite");
        const objectStore = transaction.objectStore("puntuacion");
        const getRequest = objectStore.get(1);
  
        getRequest.onsuccess = event => {
          const data = event.target.result;
          this.puntuacionDisplay.textContent = data.puntuacion;
          this.segundos = data.tiempo;
          this.iniciarCronometro();
        };
      };
    }
  
    iniciarCronometro() {
      this.intervaloCronometro = setInterval(() => {
        this.segundos++;
        const horas = Math.floor(this.segundos / 3600);
        const minutos = Math.floor((this.segundos % 3600) / 60);
        const secs = this.segundos % 60;
        this.cronometroDisplay.textContent = 
          (horas < 10 ? "0" : "") + horas + ":" +
          (minutos < 10 ? "0" : "") + minutos + ":" +
          (secs < 10 ? "0" : "") + secs;
      }, 1000);
    }
  
    detenerCronometro() {
      clearInterval(this.intervaloCronometro);
    }
  
    reiniciarCronometroYPuntuacion() {
      clearInterval(this.intervaloCronometro);
      this.segundos = 0;
      this.cronometroDisplay.textContent = "00:00:00";
      this.actualizarPuntuacion(0, 0);
      this.iniciarCronometro();
    }
  
    actualizarPuntuacion(nuevaPuntuacion, nuevoTiempo) {
      const transaction = this.dbRequest.result.transaction(["puntuacion"], "readwrite");
      const objectStore = transaction.objectStore("puntuacion");
      const updateRequest = objectStore.put({ id: 1, puntuacion: nuevaPuntuacion, tiempo: nuevoTiempo });
  
      updateRequest.onerror = event => {
        console.error("Error al actualizar la puntuación:", event.target.error);
      };
  
      updateRequest.onsuccess = event => {
        this.puntuacionDisplay.textContent = nuevaPuntuacion;
      };
    }
  
    guardarUltimaImagen(src) {
      localStorage.setItem("ultimaImagen", src);
    }
  }
  
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
  
    // Manejador para el botón "Verificar"
    document.getElementById("verificar").addEventListener("click", () => {
      const contenidoZonaDeSoltar = document.querySelector(".espacio-vacio img");
      if (contenidoZonaDeSoltar) {
        const nombreImagen = contenidoZonaDeSoltar.getAttribute("src");
        const regex = /cuadrado\.png$/;
        if (regex.test(nombreImagen)) {
          // Aumentar la puntuación en 10
          const puntuacionActual = parseInt(puntuacionDisplay.textContent);
          const nuevaPuntuacion = puntuacionActual + 10;
          timer.actualizarPuntuacion(nuevaPuntuacion, timer.segundos);
          // Redirigir a la página "primero.html"
          window.location.href = "cuarto.html";
        } else {
          // Restar 5 a la puntuación
          const puntuacionActual = parseInt(puntuacionDisplay.textContent);
          const nuevaPuntuacion = Math.max(puntuacionActual - 5, 0);
          timer.actualizarPuntuacion(nuevaPuntuacion, timer.segundos);
          alert("Incorrecto.");
        }
      } else {
        alert("No hay ninguna imagen en el espacio en blanco.");
      }
    });
  });
  