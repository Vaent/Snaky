'use strict'

var game,
  score,
  oldRowIndex,
  oldColIndex,
  delayBetweenMoves;

function Game() {
  this.inProgress = false;
};

Game.prototype.isInProgress = function() {
  return this.inProgress;
}

Game.prototype.isCellValid = function(rowIndex, colIndex) {
  return (
    rowIndex > 0
    && colIndex > 0
    && rowIndex <= layoutController.numberOfRows
    && colIndex <= layoutController.numberOfColumns
  );
};

Game.prototype.gameOver = function() {
  this.inProgress = false;
  Game.setHtmlInputsDisabled(false);
  document.querySelector('meta[name="viewport"]').content = "user-scalable=yes";
  pageElements.resetButton.hidden = false;
  layoutController.positionResetButton();
};

Game.prototype.getCellByIndices = function(rowIndex, colIndex) {
  return document.getElementById(
    `r${String(rowIndex).padStart(2,'0')}c${String(colIndex).padStart(2,'0')}`
  );
};

Game.prototype.getRandomEmptyCell = function() {
  let rowIndex = Math.floor(Math.random() * layoutController.numberOfRows) + 1;
  let colIndex = Math.floor(Math.random() * layoutController.numberOfColumns) + 1;
  while(this.avatar.isOccupyingCell(rowIndex, colIndex)) {
    rowIndex = Math.floor(Math.random() * layoutController.numberOfRows) + 1;
    colIndex = Math.floor(Math.random() * layoutController.numberOfColumns) + 1;
  }
  return [rowIndex, colIndex];
};

Game.prototype.makeFood = function() {
  let spawnPoint = this.getRandomEmptyCell();
  this.avatar.putFoodInCell(spawnPoint[0], spawnPoint[1]);
};

Game.setHtmlInputsDisabled = function(bool) {
  for(let i=0; i<pageElements.buttons.length; i++) {
    pageElements.buttons[i].disabled = bool;
  }
  for(let s=0; s<speedSelector.children.length; s++) {
    speedSelector.children[s].disabled = bool;
  }
}

Game.start = function() {
  score = new Score();
  Settings.setGameSpeed();
  Display.gameInProgressView();
  game.takeControlOfPage();
  movementController.changeDirectionToRight();
  movementController.move();
  game.makeFood();
  game.inProgress = true;
};

Game.prototype.takeControlOfPage = function() {
  document.querySelector('meta[name="viewport"]').content = "user-scalable=no";
  document.activeElement.blur();
  Game.setHtmlInputsDisabled(true);
}
