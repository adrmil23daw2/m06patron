export const verificar = (regex,location,timer) =>{

    document.getElementById("verificar").addEventListener("click", () => {
        const contenidoZonaDeSoltar = document.querySelector(".espacio-vacio img");
        if (contenidoZonaDeSoltar) {
          const nombreImagen = contenidoZonaDeSoltar.getAttribute("src");
          if (regex.test(nombreImagen)) {
            // Aumentar la puntuación en 10
            const puntuacionActual = parseInt(timer.puntuacionDisplay.textContent);
            const nuevaPuntuacion = puntuacionActual + 10;
            timer.actualizarPuntuacion(nuevaPuntuacion, timer.segundos);
            // Redirigir a la página "primero.html"
            window.location.href = location;
          } else {
            // Restar 5 a la puntuación
            const puntuacionActual = parseInt(timer.puntuacionDisplay.textContent);
            const nuevaPuntuacion = Math.max(puntuacionActual - 5, 0);
            timer.actualizarPuntuacion(nuevaPuntuacion, timer.segundos);
            alert("Incorrecto.");
          }
        } else {
          alert("No hay ninguna imagen en el espacio en blanco.");
        }
    });

}