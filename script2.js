document.addEventListener("DOMContentLoaded", function() {
    var timerDisplay = document.getElementById("timer");
    var scoreDisplay = document.getElementById("score");
    var timerInterval;
  
    // Función para iniciar el temporizador
    function startTimer() {
      var seconds = 0;
      timerInterval = setInterval(function() {
        seconds++;
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var secs = seconds % 60;
        timerDisplay.textContent = 
          (hours < 10 ? "0" : "") + hours + ":" +
          (minutes < 10 ? "0" : "") + minutes + ":" +
          (secs < 10 ? "0" : "") + secs;
      }, 1000);
    }
  
    // Función para detener el temporizador
    function stopTimer() {
      clearInterval(timerInterval);
    }
  
    // Función para reiniciar el temporizador
    function resetTimer() {
      clearInterval(timerInterval);
      timerDisplay.textContent = "00:00:00";
      startTimer();
    }
  
    // Función para obtener la puntuación del sessionStorage
    function getScore() {
      return sessionStorage.getItem("score") || "0";
    }
  
    // Función para actualizar la puntuación en el sessionStorage
    function updateScore(newScore) {
      sessionStorage.setItem("score", newScore);
      scoreDisplay.textContent = newScore;
    }
  
    // Función para iniciar el temporizador cuando se carga la página
    startTimer();
  
    // Manejador para el botón "Reiniciar"
    document.getElementById("reiniciar").addEventListener("click", function() {
      resetTimer();
    });
  
    const figures = document.querySelectorAll("#table2 img");
    const dropZones = document.querySelectorAll(".toni");
  
    let draggedFigure = null;
  
    figures.forEach(figure => {
      figure.addEventListener("dragstart", function() {
        draggedFigure = figure;
      });
  
      figure.addEventListener("dragend", function() {
        draggedFigure = null;
      });
    });
  
    dropZones.forEach(dropZone => {
      dropZone.addEventListener("dragover", function(event) {
        event.preventDefault();
      });
  
      dropZone.addEventListener("drop", function() {
        if (draggedFigure) {
          this.innerHTML = "";
          this.appendChild(draggedFigure.cloneNode(true));
        }
      });
    });
  
    // Manejador para el botón "Verificar"
    document.getElementById("verificar").addEventListener("click", function() {
      const dropZoneContent = document.querySelector(".toni img");
      if (dropZoneContent) {
        const imageName = dropZoneContent.getAttribute("src");
        const regex = /([^\/]+)\.png$/;
        const match = regex.exec(imageName);
        if (match && match[1] === "triangulo") {
          // Aumentar la puntuación en 10
          const currentScore = parseInt(getScore());
          const newScore = currentScore + 10;
          updateScore(newScore);
          // Redirigir a la página "primero.html"
          window.location.href = "tercero.html";
        } else {
          // Restar 5 a la puntuación
          const currentScore = parseInt(getScore());
          const newScore = Math.max(currentScore - 5, 0);
          updateScore(newScore);
          alert("Incorrecto.");
        }
      } else {
        alert("No hay ninguna imagen en el espacio en blanco.");
      }
    });
  
    // Actualizar la puntuación al cargar la página
    scoreDisplay.textContent = getScore();
  });
  