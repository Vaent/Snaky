'use strict'

function Comet() {
  this.body = [];
  this.instructions = "<p>Press any key to start.<br>Control the comet's direction using the arrow keys.<br>Absorb asteroids to increase your score and grow the comet.</p><p>The game ends when the comet hits a wall or its own tail.</p>";
}

Comet.prototype.addToCometBody = function(row, col) {
  this.body.push({row:row, col:col});
  this.body.forEach(bodyPart => {
    let strength = 180 * this.body.indexOf(bodyPart) / this.body.length;
    bodyPart.hue = `rgb(${strength},${strength},160)`;
  });
}

Comet.prototype.cellIsOccupied = function(rowIndex, colIndex) {
  return (
    findCellInTable(rowIndex, colIndex).style.backgroundColor !== '' &&
    findCellInTable(rowIndex, colIndex).style.backgroundColor !== 'brown'
  );
}

Comet.prototype.checkForFoodAt = function(rowIndex, colIndex) {
  if(findCellInTable(rowIndex, colIndex).style.backgroundColor === 'brown') {
    this.cometEatsAsteroid();
  }
}

Comet.prototype.clearCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).style.backgroundColor = '';
}

Comet.prototype.cometEatsAsteroid = function() {
  this.addToCometBody(-1, -1);
  increaseScore(1);
  makeFood();
}

Comet.prototype.createDefaultBody = function() {
  this.addToCometBody(Math.floor(numberOfRows/2), 4);
  this.addToCometBody(Math.floor(numberOfRows/2), 3);
  this.addToCometBody(Math.floor(numberOfRows/2), 2);
  this.addToCometBody(Math.floor(numberOfRows/2), 1);
}

Comet.prototype.die = function() {
  alive = false;
  findCellInTable(oldRowIndex, oldColIndex).style.backgroundColor = 'red';
}

Comet.prototype.display = function(bodyPart) {
  findCellInTable(bodyPart.row, bodyPart.col).style.backgroundColor = bodyPart.hue;
}

Comet.prototype.hitBodyPartAt = function(rowIndex, colIndex) {
  let cutPosition = this.body.indexOf(
    this.body.find(bodyPart => (
      bodyPart.row === rowIndex && bodyPart.col === colIndex && bodyPart.hue !== "rgb(0,0,160)"
    ))
  );
  while (this.body.length > cutPosition) {
    let bodyPart = this.body[cutPosition];
    findCellInTable(bodyPart.row, bodyPart.col).style.backgroundColor = '';
    this.body.splice(cutPosition,1);
  }
  deleteAndRemake(this.body[0]);
}

Comet.prototype.hitWall = function() {
  this.die();
}

Comet.prototype.putFoodInCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).style.backgroundColor = 'brown';
}
