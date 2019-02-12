'use strict'

function Snaky() {
  this.body = [];
  this.instructions = "<p>Press any key to start, or tap the play area.<br>The snake will start moving to the right. Use the arrow keys on your keyboard, or tap your touchscreen, to change direction.<br>Eat the semicolons to increase your score and grow the snake.</p><p>The game ends when the snake hits a wall or its own tail.</p>";
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

Snaky.prototype.hitWall = function() {
  this.die();
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
