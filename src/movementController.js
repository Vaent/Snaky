'use strict'

var movementController;

function MovementController() {
  this.move = this.move.bind(this);
  this.updateBodyPosition = this.updateBodyPosition.bind(this);
  this.updateIndices = this.updateIndices.bind(this);
};

MovementController.prototype.changeDirectionToDown = function() {
  newRowChangeAmount = 1;
  newColChangeAmount = 0;
};

MovementController.prototype.changeDirectionToLeft = function() {
  newRowChangeAmount = 0;
  newColChangeAmount = -1;
};

MovementController.prototype.changeDirectionToRight = function() {
  newRowChangeAmount = 0;
  newColChangeAmount = 1;
};

MovementController.prototype.changeDirectionToUp = function() {
  newRowChangeAmount = -1;
  newColChangeAmount = 0;
};

MovementController.prototype.checkForDirectionChange = function() {
  // update direction only if not reversing
  if(newRowChangeAmount !== -rowChangeAmount &&
  newColChangeAmount !== -colChangeAmount) {
    rowChangeAmount = newRowChangeAmount;
    colChangeAmount = newColChangeAmount;
  }
};

MovementController.prototype.deleteAndRemake = function(bodyPart) {
  if(game.isCellValid(oldRowIndex, oldColIndex)) {
    game.avatar.clearCell(oldRowIndex, oldColIndex);
  }
  game.avatar.display(bodyPart);
};

MovementController.prototype.move = function() {
  clearTimeout(this.pendingMove); // ensure there are no overlapping timeouts
  this.checkForDirectionChange();
  this.updateBodyPosition();
  if(game.avatar.isEatingFood()) {
    game.avatar.digestFood();
  }
  if(game.avatar.isAlive()) {
    this.pendingMove = setTimeout(this.move, delayBetweenMoves);
  }
};

MovementController.prototype.tryToMove = function(bodyPart) {
  // check whether the intended space exists and is unoccupied
  if(!game.isCellValid(bodyPart.row, bodyPart.col)) {
    game.avatar.hitWall(bodyPart);
  } else if(game.avatar.isOccupyingCell(bodyPart.row, bodyPart.col)) {
    game.avatar.hitBodyPartAt(bodyPart.row, bodyPart.col);
  } else {
    game.avatar.checkForFoodAt(bodyPart.row, bodyPart.col);
    this.deleteAndRemake(bodyPart);
  }
};

MovementController.prototype.updateBodyPosition = function() {
  game.avatar.body.forEach(bodyPart => {
    if(game.avatar.isAlive()) { // after the head dies, the rest of the body doesn't move
      this.updateIndices(bodyPart);
      this.tryToMove(bodyPart);
    }
  });
};

MovementController.prototype.updateIndices = function(bodyPart) {
  if(bodyPart === game.avatar.body[0]) {
    [oldRowIndex, bodyPart.row] = [bodyPart.row, (bodyPart.row + rowChangeAmount)];
    [oldColIndex, bodyPart.col] = [bodyPart.col, (bodyPart.col + colChangeAmount)];
  } else {
    [oldRowIndex, bodyPart.row] = [bodyPart.row, oldRowIndex];
    [oldColIndex, bodyPart.col] = [bodyPart.col, oldColIndex];
  }
};
