'use strict'

function Comet() {
  this.alive = true;
  this.body = [];
  this.eatingFood = false;
  this.instructions = "<p>Click 'Play' to start the game.</p><p>The comet will start moving to the right. To change direction, use the keys defined in the Settings, or tap your touchscreen.</p><p>Absorb asteroids to increase your score and grow the comet.</p><p>If the comet runs into itself, a section of its tail will be lost and your score will be severely reduced.</p><p>The game ends when the comet hits a wall.</p>";
};

Comet.prototype.addToCometBody = function(row, col) {
  this.body.push({row:row, col:col});
  this.updateHues();
};

Comet.prototype.checkForFoodAt = function(rowIndex, colIndex) {
  if(game.getCellByIndices(rowIndex, colIndex).style.backgroundColor === 'brown') {
    this.eatingFood = true;
  }
};

Comet.prototype.clearCell = function(rowIndex, colIndex) {
  this.colourCell(rowIndex, colIndex, '');
};

Comet.prototype.colourCell = function(rowIndex, colIndex, colour) {
  game.getCellByIndices(rowIndex, colIndex).style.backgroundColor = colour;
};

Comet.prototype.createDefaultBody = function() {
  this.body = [];
  this.addToCometBody(Math.floor(layoutController.numberOfRows/2), 4);
  this.addToCometBody(Math.floor(layoutController.numberOfRows/2), 3);
  this.addToCometBody(Math.floor(layoutController.numberOfRows/2), 2);
  this.addToCometBody(Math.floor(layoutController.numberOfRows/2), 1);
};

Comet.prototype.digestFood = function() {
  this.eatingFood = false;
  this.addToCometBody(oldRowIndex, oldColIndex);
  this.display( this.body[this.body.length - 1] );
  score.increaseScore(1);
  game.makeFood();
};

Comet.prototype.die = function() {
  this.alive = false;
  this.colourCell(oldRowIndex, oldColIndex, 'red');
  game.gameOver();
  this.disintegrate(this.body.splice(1));
};

Comet.prototype.disintegrate = function(chunkOfTail) {
  let bodyPart = chunkOfTail.shift();
  // if the comet recently ate, a bodyPart may not have been displayed yet
  if(!!game.getCellByIndices(bodyPart.row, bodyPart.col)) {
    this.colourCell(bodyPart.row, bodyPart.col, 'red');
    setTimeout(() => {this.clearCell(bodyPart.row, bodyPart.col)}, 80);
  }
  if(this.isAlive()) {score.decreaseScore(2)}
  if(chunkOfTail.length > 0) {
    setTimeout(() => {this.disintegrate(chunkOfTail)}, 50);
  }
};

Comet.prototype.display = function(bodyPart) {
  this.colourCell(bodyPart.row, bodyPart.col, bodyPart.hue);
};

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
  movementController.deleteAndRemake(this.body[0]);
};

Comet.prototype.hitWall = function() {
  this.die();
};

Comet.prototype.isAlive = function() {
  return this.alive;
}

Comet.prototype.isEatingFood = function() {
  return this.eatingFood;
}

Comet.prototype.isOccupyingCell = function(rowIndex, colIndex) {
  return (
    game.getCellByIndices(rowIndex, colIndex).style.backgroundColor !== '' &&
    game.getCellByIndices(rowIndex, colIndex).style.backgroundColor !== 'brown'
  );
};

Comet.prototype.putFoodInCell = function(rowIndex, colIndex) {
  this.colourCell(rowIndex, colIndex, 'brown');
};

Comet.prototype.updateHues = function() {
  this.body.forEach(bodyPart => {
    let strength = 180 * this.body.indexOf(bodyPart) / this.body.length;
    bodyPart.hue = `rgb(${strength},${strength},160)`;
  });
};
