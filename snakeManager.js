'use strict'

function Snake() {
  this.body = [];
  this.instructions = "<p>Press any key to start.<br>Control the snake's direction using the arrow keys.<br>Eat the semicolons to increase your score and grow the snake.</p><p>The game ends when the snake hits a wall or its own tail.</p>";
}

Snake.prototype.addToSnakeBody = function(char, row, col) {
  this.body.push({char:char, row:row, col:col});
}

Snake.prototype.cellIsOccupied = function(rowIndex, colIndex) {
  return (
    findCellInTable(rowIndex, colIndex).innerHTML === 'o' ||
    findCellInTable(rowIndex, colIndex).innerHTML === '+'
  );
}

Snake.prototype.checkForFoodAt = function(rowIndex, colIndex) {
  if(findCellInTable(rowIndex, colIndex).innerHTML === ';') {
    this.snakeEatsSemicolon();
  }
}

Snake.prototype.clearCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).innerHTML = '';
}

Snake.prototype.createDefaultBody = function() {
  this.addToSnakeBody('o', Math.floor(numberOfRows/2), 4);
  this.addToSnakeBody('+', Math.floor(numberOfRows/2), 3);
  this.addToSnakeBody('+', Math.floor(numberOfRows/2), 2);
  this.addToSnakeBody('+', Math.floor(numberOfRows/2), 1);
}

Snake.prototype.die = function() {
  alive = false;
  findCellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
}

Snake.prototype.display = function(bodyPart) {
  findCellInTable(bodyPart['row'], bodyPart['col']).innerHTML = bodyPart['char'];
}

Snake.prototype.hitBodyPartAt = function(rowIndex, colIndex) {
  this.die();
}

Snake.prototype.hitWall = function() {
  this.die();
}

Snake.prototype.putFoodInCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).innerHTML = ';';
}

Snake.prototype.snakeEatsSemicolon = function() {
  this.addToSnakeBody('+', -1, -1);
  increaseScore(1);
  makeFood();
}
