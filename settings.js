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

function setGameSpeed() {
  let valueSelected;
  if(FormData.prototype.get) {
    valueSelected = new FormData(speedSelector).get("speed");
  } else {
    valueSelected = 200;
  }
  changeGameSpeed(Number(valueSelected));
}
