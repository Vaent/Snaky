'use strict'

function GameSetUp() {}

GameSetUp.prepareGame = function() {
  pageElements.banner.innerHTML = avatar.constructor.name;
  document.title = avatar.constructor.name;
  document.getElementById("menu").hidden = false;
  layoutController.createGameView();
  avatar.createDefaultBody();
  avatar.body.forEach(bodyPart => {avatar.display(bodyPart)});
}

GameSetUp.resetGame = function() {
  clearTimeout(pendingMove);
  pageElements.scoreDisplay.hidden = true;
  pageElements.banner.style.fontSize = "";
  setInitialValues();
  GameSetUp.prepareGame();
};

function loadGame() {
  layoutController = new LayoutController();
  keyController = new KeyController();
  tapController = new TapController();
  Settings.selectGameStyle(Snaky);
  Display.viewDefault();
  if(!FormData.prototype.get) {speedSelector.innerHTML = "";}
}

function setInitialValues() {
  gameIsInProgress = false;
  avatar.alive = true;
  rowChangeAmount = undefined;
  colChangeAmount = undefined;
}

(function() {
  document.addEventListener('DOMContentLoaded', loadGame);
})();
