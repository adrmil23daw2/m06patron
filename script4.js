import { verificar } from "./funciones.js";
import { Timer } from "./timer.js";

/**
 * Evento que se dispara cuando el DOM está completamente cargado.
 * @callback DOMContentLoadedCallback
 */
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Elemento HTML que muestra el cronómetro.
     * @type {HTMLElement}
     */
    const cronometroDisplay = document.getElementById("cronometro");
    /**
    * Elemento HTML que muestra la puntuación.
    * @type {HTMLElement}
    */
    const puntuacionDisplay = document.getElementById("puntuacion");/**
    * Nombre de la base de datos IndexedDB.
    * @type {string}
    */
    const dbName = "puntuacionDB";
    /**
     * Versión de la base de datos IndexedDB.
     * @type {number}
     */
    const dbVersion = 1;
    /**
     * Solicitud de apertura de la base de datos IndexedDB.
     * @type {IDBOpenDBRequest}
     */
    const dbRequest = window.indexedDB.open(dbName, dbVersion);
    if(dbRequest) console.log("Petición a Base de datos correcta");
    /**
     * Objeto del cronómetro.
     * @type {Timer}
     */
    const timer = new Timer(cronometroDisplay, puntuacionDisplay, dbRequest);

    document.getElementById("reiniciar").addEventListener("click", () => {
        timer.reiniciarCronometroYPuntuacion();
    });
    /**
     * Lista de elementos HTML que representan figuras arrastrables.
     * @type {NodeList}
     */
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
                timer.guardarUltimaImagen(timer.figuraArrastrada.getAttribute("src"));
                timer.figuraArrastrada = null;
            }
        });
    });
    /**
     * Llama a la funcion que verifica el patrón
     * @param {RegExp} regex - Expresión regular para verificar si la imagen es correcta.
     * @param {string} redirectTo - HTML al que redirigir.
     * @param {Timer} timerInstance - Objeto timer actual.
     */
    verificar(/circulo\.png$/, "segundo.html", timer);
});