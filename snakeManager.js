'use strict'

function Snaky() {
  this.body = [];
  this.instructions = "<p>Click 'Play' to start the game.</p><p>The snake will start moving to the right. To change direction, use the keys defined in the Settings, or tap your touchscreen.</p><p>Eat the semicolons to increase your score and grow the snake.</p><p>The game ends when the snake hits a wall or its own tail.</p>";
  this.teleport = false;
}

Snaky.prototype.addToSnakeBody = function(char, row, col) {
  this.body.push({char:char, row:row, col:col});
}

Snaky.prototype.cellIsOccupied = function(rowIndex, colIndex) {
  let cellContents = findCellInTable(rowIndex, colIndex).innerHTML;
  return !!(
    ['o','&lt;','&gt;','v','^'].find(char => cellContents === char)
  );
}

Snaky.prototype.checkForFoodAt = function(rowIndex, colIndex) {
  if(findCellInTable(rowIndex, colIndex).innerHTML === ';') {
    foodWasEaten = true;
  }
}

Snaky.prototype.clearCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).innerHTML = '';
}

Snaky.prototype.createDefaultBody = function() {
  this.addToSnakeBody('o', Math.floor(numberOfRows/2), 4);
  this.addToSnakeBody('<', Math.floor(numberOfRows/2), 3);
  this.addToSnakeBody('<', Math.floor(numberOfRows/2), 2);
  this.addToSnakeBody('<', Math.floor(numberOfRows/2), 1);
}

Snaky.prototype.digestFood = function() {
  this.addToSnakeBody('<', oldRowIndex, oldColIndex);
  this.display( this.body[this.body.length - 1] );
  increaseScore(1);
  makeFood();
}

Snaky.prototype.die = function() {
  findCellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
  gameOver();
}

Snaky.prototype.display = function(bodyPart) {
  if(bodyPart.char !== 'o') {
    this.updateBodyPartDirection(bodyPart);
  }
  findCellInTable(bodyPart.row, bodyPart.col).innerHTML = bodyPart.char;
}

Snaky.prototype.hitBodyPartAt = function(rowIndex, colIndex) {
  this.die();
}

Snaky.prototype.hitWall = function(bodyPart) {
  if(this.teleport) {
    bodyPart.row = ((bodyPart.row + numberOfRows - 1) % numberOfRows) + 1;
    bodyPart.col = ((bodyPart.col + numberOfColumns - 1) % numberOfColumns) + 1;
    tryToMove(bodyPart);
  } else {
    this.die();
  }
}

Snaky.prototype.putFoodInCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).innerHTML = ';';
}

Snaky.prototype.updateBodyPartDirection = function(bodyPart) {
  let prevBodyPart = this.body[this.body.indexOf(bodyPart) - 1];
  if(prevBodyPart.row < bodyPart.row){
    bodyPart.char = 'v';
  } else if(prevBodyPart.row > bodyPart.row){
    bodyPart.char = '^';
  } else if(prevBodyPart.col < bodyPart.col){
    bodyPart.char = '>';
  } else if(prevBodyPart.col > bodyPart.col){
    bodyPart.char = '<';
  }
}
