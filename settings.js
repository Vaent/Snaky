'use strict'

var speedSelector = document.getElementById("speedSelector");

function changeGameSpeed(delayValue) {
  delayBetweenMoves = delayValue;
}

function selectComet() {
  if(!gameIsInProgress || !alive) {
    avatar = new Comet;
    resetGame();
  }
}

function selectSnaky() {
  if(!gameIsInProgress || !alive) {
    avatar = new Snaky;
    resetGame();
  }
}

(function() {
  speedSelector.addEventListener("change", function() {
    let valueSelected = new FormData(speedSelector).get("speed");
    changeGameSpeed(Number(valueSelected));
  });
})();
