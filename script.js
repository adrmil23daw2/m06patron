document.addEventListener("DOMContentLoaded", function() {
  var timerDisplay = document.getElementById("timer");
  var timerInterval;

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

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00:00";
    startTimer();
  }

  startTimer();

  document.getElementById("reiniciar").addEventListener("click", function() {
    resetTimer();
  });
});