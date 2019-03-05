'use strict'

function Snaky() {
  this.alive = true;
  this.body = [];
  this.eatingFood = false;
  this.instructions = "<p>Click 'Play' to start the game.</p><p>The snake will start moving to the right. To change direction, use the keys defined in the Settings, or tap your touchscreen.</p><p>Eat the semicolons to increase your score and grow the snake.</p><p>The game ends when the snake hits a wall or its own tail.</p>";
  this.teleport = false;
}

Snaky.prototype.addToSnakeBody = function(char, row, col) {
  this.body.push({char:char, row:row, col:col});
};

Snaky.prototype.checkForFoodAt = function(rowIndex, colIndex) {
  if(game.getCellByIndices(rowIndex, colIndex).innerHTML === ';') {
    this.eatingFood = true;
  }
};

Snaky.prototype.clearCell = function(rowIndex, colIndex) {
  game.getCellByIndices(rowIndex, colIndex).innerHTML = '';
};

Snaky.prototype.createDefaultBody = function() {
  this.body = [];
  this.addToSnakeBody('o', Math.floor(layoutController.numberOfRows/2), 4);
  this.addToSnakeBody('', Math.floor(layoutController.numberOfRows/2), 3);
  this.addToSnakeBody('', Math.floor(layoutController.numberOfRows/2), 2);
  this.addToSnakeBody('', Math.floor(layoutController.numberOfRows/2), 1);
};

Snaky.prototype.digestFood = function() {
  this.eatingFood = false;
  this.addToSnakeBody('', oldRowIndex, oldColIndex);
  this.display( this.body[this.body.length - 1] );
  score.increaseScore(1);
  game.makeFood();
};

Snaky.prototype.die = function() {
  this.alive = false;
  game.getCellByIndices(oldRowIndex, oldColIndex).innerHTML = 'x';
  game.gameOver();
};

Snaky.prototype.display = function(bodyPart) {
  if(bodyPart.char !== 'o') {
    this.updateBodyPartDirection(bodyPart);
  }
  game.getCellByIndices(bodyPart.row, bodyPart.col).innerHTML = bodyPart.char;
};

Snaky.prototype.hitBodyPartAt = function(rowIndex, colIndex) {
  this.die();
};

Snaky.prototype.hitWall = function(bodyPart) {
  if(this.teleport) {
    bodyPart.row =
      ((bodyPart.row + layoutController.numberOfRows - 1)
      % layoutController.numberOfRows)
      + 1;
    bodyPart.col =
      ((bodyPart.col + layoutController.numberOfColumns - 1)
      % layoutController.numberOfColumns)
      + 1;
    movementController.tryToMove(bodyPart);
  } else {
    this.die();
  }
};

Snaky.prototype.isAlive = function() {
  return this.alive;
}

Snaky.prototype.isEatingFood = function() {
  return this.eatingFood;
}

Snaky.prototype.isOccupyingCell = function(rowIndex, colIndex) {
  let cellContents = game.getCellByIndices(rowIndex, colIndex).innerHTML;
  return !(cellContents === '' || cellContents === ';');
};

Snaky.prototype.putFoodInCell = function(rowIndex, colIndex) {
  game.getCellByIndices(rowIndex, colIndex).innerHTML = ';';
};

Snaky.prototype.updateBodyPartDirection = function(bodyPart) {
  let prevBodyPart = this.body[this.body.indexOf(bodyPart) - 1];
  if(prevBodyPart.row < bodyPart.row){
    bodyPart.char = 'v';
  } else if(prevBodyPart.row > bodyPart.row){
    bodyPart.char = '^';
  } else if(prevBodyPart.col < bodyPart.col){
    bodyPart.char = '&gt;';
  } else if(prevBodyPart.col > bodyPart.col){
    bodyPart.char = '&lt;';
  }
};
