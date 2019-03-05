'use strict'

function GameSetUp() {};

GameSetUp.loadGame = function() {
  game = new Game();
  layoutController = new LayoutController();
  movementController = new MovementController();
  keyController = new KeyController();
  tapController = new TapController();
  Settings.selectGameStyle(Snaky);
  Display.viewDefault();
  if(!FormData.prototype.get) {speedSelector.innerHTML = "";}
};

GameSetUp.prepareGame = function() {
  pageElements.banner.innerHTML = game.avatar.constructor.name;
  document.title = game.avatar.constructor.name;
  document.getElementById("menu").hidden = false;
  layoutController.createGameView();
  game.avatar.createDefaultBody();
  game.avatar.body.forEach(bodyPart => {game.avatar.display(bodyPart)});
};

GameSetUp.resetGame = function() {
  clearTimeout(movementController.pendingMove);
  pageElements.scoreDisplay.hidden = true;
  pageElements.banner.style.fontSize = "";
  GameSetUp.setPreGameValues();
  GameSetUp.prepareGame();
};

GameSetUp.setPreGameValues = function() {
  game.avatar.alive = true;
  rowChangeAmount = undefined;
  colChangeAmount = undefined;
};

(function() {
  document.addEventListener('DOMContentLoaded', GameSetUp.loadGame);
})();
