/**
 * Clase que representa un temporizador
 */
export class Timer {
  /**
   * Crea una instancia de Timer.
   * @param {HTMLElement} cronometroDisplay
   * @param {HTMLElement} puntuacionDisplay
   * @param {IDBOpenDBRequest} dbRequest 
   */
  constructor(cronometroDisplay, puntuacionDisplay, dbRequest) {
    /**
     * Elemento donde se muestra el cronómetro.
     * @type {HTMLElement}
     */
    this.cronometroDisplay = cronometroDisplay;

    /**
     * Elemento donde se muestra la puntuación.
     * @type {HTMLElement}
     */
    this.puntuacionDisplay = puntuacionDisplay;

    /**
     * Solicitud de apertura de base de datos.
     * @type {IDBOpenDBRequest}
     */
    this.dbRequest = dbRequest;

    /**
     * Identificador del intervalo del cronómetro.
     * @type {number}
     */
    this.intervaloCronometro;

    /**
     * Segundos transcurridos en el cronómetro.
     * @type {number}
     */
    this.segundos = 0;

    /**
     * Figura que está siendo arrastrada.
     * @type {any}
     */
    this.figuraArrastrada = null;

    // Inicia el temporizador automáticamente al crear una instancia.
    this.iniciar();
  }

  /**
   * Inicia el temporizador obteniendo datos de la base de datos y comenzando el cronómetro.
   */
  iniciar() {
    this.dbRequest.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(["puntuacion"], "readwrite");
      if (!(transaction instanceof IDBTransaction)) console.log("Error en la base de datos");
      const objectStore = transaction.objectStore("puntuacion");
      if (!(objectStore instanceof IDBObjectStore)) console.log("Error en la base de datos");
      const getRequest = objectStore.get(1);

      getRequest.onsuccess = event => {
        const data = event.target.result;
        this.puntuacionDisplay.textContent = data.puntuacion;
        this.segundos = data.tiempo;
        this.iniciarCronometro();
      };
    };
  }

  /**
   * Inicia el cronómetro.
   */
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

  /**
   * Reinicia el cronómetro y la puntuación.
   */
  reiniciarCronometroYPuntuacion() {
    clearInterval(this.intervaloCronometro);
    this.segundos = 0;
    this.cronometroDisplay.textContent = "00:00:00";
    this.actualizarPuntuacion(0, 0);
    this.iniciarCronometro();
  }

  /**
   * Actualiza la puntuación en la base de datos y en la interfaz.
   * @param {number} nuevaPuntuacion
   * @param {number} nuevoTiempo
   */
  actualizarPuntuacion(nuevaPuntuacion, nuevoTiempo) {
    const transaction = this.dbRequest.result.transaction(["puntuacion"], "readwrite");
    if (!(transaction instanceof IDBTransaction)) console.log("Error en la base de datos");
    const objectStore = transaction.objectStore("puntuacion");
    if (!(objectStore instanceof IDBObjectStore)) console.log("Error en la base de datos");
    const updateRequest = objectStore.put({ id: 1, puntuacion: nuevaPuntuacion, tiempo: nuevoTiempo });

    updateRequest.onerror = event => {
      console.error("Error al actualizar la puntuación:", event.target.error);
    };

    updateRequest.onsuccess = event => {
      this.puntuacionDisplay.textContent = nuevaPuntuacion;
    };
  }
}

/**
 * Detiene el cronómetro.
 */
Timer.prototype.detenerCronometro = function() {
  clearInterval(this.intervaloCronometro);
};

/**
 * Guarda la última imagen arrastrada en el almacenamiento local.
 * @param {string} src
 */
Timer.prototype.guardarUltimaImagen = function(src) {
  localStorage.setItem("ultimaImagen", src);
};
