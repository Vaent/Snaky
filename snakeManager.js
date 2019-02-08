'use strict'

function Snaky() {
  this.body = [];
  this.instructions = "<p>Press any key to start.<br>Control the snake's direction using the arrow keys.<br>Eat the semicolons to increase your score and grow the snake.</p><p>The game ends when the snake hits a wall or its own tail.</p>";
}

Snaky.prototype.addToSnakeBody = function(char, row, col) {
  this.body.push({char:char, row:row, col:col});
}

Snaky.prototype.cellIsOccupied = function(rowIndex, colIndex) {
  return (
    findCellInTable(rowIndex, colIndex).innerHTML === 'o' ||
    findCellInTable(rowIndex, colIndex).innerHTML === '+'
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
  this.addToSnakeBody('+', Math.floor(numberOfRows/2), 3);
  this.addToSnakeBody('+', Math.floor(numberOfRows/2), 2);
  this.addToSnakeBody('+', Math.floor(numberOfRows/2), 1);
}

Snaky.prototype.digestFood = function() {
  this.addToSnakeBody('+', -1, -1);
  increaseScore(1);
  makeFood();
}

Snaky.prototype.die = function() {
  findCellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
  gameOver();
}

Snaky.prototype.display = function(bodyPart) {
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
