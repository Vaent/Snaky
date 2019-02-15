'use strict'

function Settings() {}

Settings.changeGameSpeed = function(delayValue) {
  delayBetweenMoves = delayValue;
}

Settings.selectGameStyle = function(option) {
  if(!gameIsInProgress || !avatar.alive) {
    avatar = new option;
    pageElements.banner.innerHTML = avatar.constructor.name;
    document.title = avatar.constructor.name;
  }
}

Settings.setGameSpeed = function() {
  let valueSelected;
  if(FormData.prototype.get) {
    valueSelected = new FormData(pageElements.speedSelector).get("speed");
  } else {
    valueSelected = 200;
  }
  Settings.changeGameSpeed(Number(valueSelected));
}
