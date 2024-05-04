export class Timer {
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
  

}

Timer.prototype.detenerCronometro = () =>{
    clearInterval(this.intervaloCronometro);
}

Timer.prototype.guardarUltimaImagen = (src) => {
    localStorage.setItem("ultimaImagen", src);
}