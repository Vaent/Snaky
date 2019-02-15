'use strict'

var speedSelector = document.getElementById("speedSelector");

function changeGameSpeed(delayValue) {
  delayBetweenMoves = delayValue;
}

function selectGameStyle(option) {
  if(!gameIsInProgress || !alive) {
    avatar = new option;
    documentBanner.innerHTML = avatar.constructor.name;
    document.title = avatar.constructor.name;
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
