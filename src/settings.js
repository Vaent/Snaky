'use strict'

function Settings() {}

Settings.changeGameSpeed = function(delayValue) {
  delayBetweenMoves = delayValue;
};

Settings.selectGameStyle = function(option) {
  if(!game.isInProgress() || !game.avatar.isAlive()) {
    game.avatar = new option;
    pageElements.banner.innerHTML = game.avatar.constructor.name;
    document.title = game.avatar.constructor.name;
  }
};

Settings.setGameSpeed = function() {
  let valueSelected;
  if(FormData.prototype.get) {
    valueSelected = new FormData(pageElements.speedSelector).get("speed");
  } else {
    valueSelected = 200;
  }
  Settings.changeGameSpeed(Number(valueSelected));
};
