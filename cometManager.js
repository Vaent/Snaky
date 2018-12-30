'use strict'

function Comet() {
  this.body = [];
  this.instructions = "Press any key to start.<br>Control the comet's direction using the arrow keys.<br>Absorb asteroids to increase your score and grow the comet.<p>The game ends when the comet hits a wall or its own tail.</p>";
}

Comet.prototype.addToCometBody = function(row, col) {
  this.body.push({strength:this.body.length, row:row, col:col});
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
  let shade = `${Math.min(99, 10 * bodyPart['strength'])}`.padStart(2,'0');
  let hue = `#${shade}${shade}90`;
  findCellInTable(bodyPart['row'], bodyPart['col']).style.backgroundColor = hue;
}

Comet.prototype.hitBodyPartAt = function(rowIndex, colIndex) {
  this.die();
}

Comet.prototype.hitWall = function() {
  this.die();
}

Comet.prototype.putFoodInCell = function(rowIndex, colIndex) {
  findCellInTable(rowIndex, colIndex).style.backgroundColor = 'brown';
}
