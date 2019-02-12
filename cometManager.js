'use strict'

function Comet() {
  this.body = [];
  this.instructions = "<p>Press any key to start.<br>Control the comet's direction using the arrow keys.<br>Absorb asteroids to increase your score and grow the comet.</p><p>If the comet runs into itself, a section of its tail will be lost and your score will be severely reduced.</p><p>The game ends when the comet hits a wall.</p>";
}

Comet.prototype.addToCometBody = function(row, col) {
  this.body.push({row:row, col:col});
  this.updateHues();
}

Comet.prototype.cellIsOccupied = function(rowIndex, colIndex) {
  return (
    findCellInTable(rowIndex, colIndex).style.backgroundColor !== '' &&
    findCellInTable(rowIndex, colIndex).style.backgroundColor !== 'brown'
  );
}

Comet.prototype.checkForFoodAt = function(rowIndex, colIndex) {
  if(findCellInTable(rowIndex, colIndex).style.backgroundColor === 'brown') {
    foodWasEaten = true;
  }
}

Comet.prototype.clearCell = function(rowIndex, colIndex) {
  this.colourCell(rowIndex, colIndex, '');
}

Comet.prototype.colourCell = function(rowIndex, colIndex, colour) {
  findCellInTable(rowIndex, colIndex).style.backgroundColor = colour;
}

Comet.prototype.createDefaultBody = function() {
  this.addToCometBody(Math.floor(numberOfRows/2), 4);
  this.addToCometBody(Math.floor(numberOfRows/2), 3);
  this.addToCometBody(Math.floor(numberOfRows/2), 2);
  this.addToCometBody(Math.floor(numberOfRows/2), 1);
}

Comet.prototype.digestFood = function() {
  this.addToCometBody(oldRowIndex, oldColIndex);
  this.display( this.body[this.body.length - 1] );
  increaseScore(1);
  makeFood();
}

Comet.prototype.die = function() {
  this.colourCell(oldRowIndex, oldColIndex, 'red');
  gameOver();
  this.disintegrate( this.body.splice(1) );
}

Comet.prototype.disintegrate = function(chunkOfTail) {
  let bodyPart = chunkOfTail.shift();
  // if the comet recently ate, a bodyPart may not have been displayed yet
  if(!!findCellInTable(bodyPart.row, bodyPart.col)) {
    this.colourCell(bodyPart.row, bodyPart.col, 'red');
    setTimeout(
      () => {this.clearCell(bodyPart.row, bodyPart.col)},
      delayBetweenMoves / 1.5
    );
  }
  if(alive) {decreaseScore(2)}
  if(chunkOfTail.length > 0) {
    setTimeout(
      () => {this.disintegrate(chunkOfTail)},
      delayBetweenMoves / 2
    )
  }
}

Comet.prototype.display = function(bodyPart) {
  this.colourCell(bodyPart.row, bodyPart.col, bodyPart.hue);
}

Comet.prototype.hitBodyPartAt = function(rowIndex, colIndex) {
  let cutPosition = this.body.indexOf(
    this.body.slice(1).find(bodyPart => (
      bodyPart.row === rowIndex && bodyPart.col === colIndex
    ))
  );
  // For a long tail, the head may hit the 'dead' part before it disintegrates
  // Hitting an already-dead section of tail would give cutPosition = -1 as that
  // cell is no longer referenced in the 'live' body
  if(cutPosition > 0) {
    this.disintegrate( this.body.splice(cutPosition) );
    this.updateHues();
  }
  deleteAndRemake(this.body[0]);
}

Comet.prototype.hitWall = function() {
  this.die();
}

Comet.prototype.putFoodInCell = function(rowIndex, colIndex) {
  this.colourCell(rowIndex, colIndex, 'brown');
}

Comet.prototype.updateHues = function() {
  this.body.forEach(bodyPart => {
    let strength = 180 * this.body.indexOf(bodyPart) / this.body.length;
    bodyPart.hue = `rgb(${strength},${strength},160)`;
  });
}
