'use strict'

var avatar,
  score,
  gameIsInProgress = false,
  foodWasEaten = false,
  pendingMove,
  numberOfRows = 20,
  numberOfColumns = 20,
  oldRowIndex,
  oldColIndex,
  delayBetweenMoves;

function cellExists(rowIndex, colIndex) {
  return !!findCellInTable(rowIndex, colIndex);
}

function checkForDirectionChange() {
  // update direction only if not reversing
  if(newRowChangeAmount !== -rowChangeAmount &&
  newColChangeAmount !== -colChangeAmount) {
    rowChangeAmount = newRowChangeAmount;
    colChangeAmount = newColChangeAmount;
  }
}

function deleteAndRemake(bodyPart) {
  if(!!findCellInTable(oldRowIndex, oldColIndex)) {
    avatar.clearCell(oldRowIndex, oldColIndex);
  }
  avatar.display(bodyPart);
}

function findCellInTable(rowIndex, colIndex) {
  return document.getElementById(
    `r${String(rowIndex).padStart(2,'0')}c${String(colIndex).padStart(2,'0')}`
  );
}

function gameOver() {
  avatar.alive = false;
  for(let i=0; i<pageElements.buttons.length; i++) {
    pageElements.buttons[i].disabled=false;
  }
  for(let s=0; s<speedSelector.children.length; s++) {
    speedSelector.children[s].disabled = false;
  }
  document.querySelector('meta[name="viewport"]').content = "user-scalable=yes";
  pageElements.resetButton.hidden = false;
  layoutController.positionResetButton();
}

function getRandomEmptyCell() {
  let rowIndex = Math.floor(Math.random() * numberOfRows) + 1;
  let colIndex = Math.floor(Math.random() * numberOfColumns) + 1;
  while(avatar.cellIsOccupied(rowIndex, colIndex)) {
    rowIndex = Math.floor(Math.random() * numberOfRows) + 1;
    colIndex = Math.floor(Math.random() * numberOfColumns) + 1;
  }
  return [rowIndex, colIndex];
}

function makeFood() {
  let spawnPoint = getRandomEmptyCell();
  avatar.putFoodInCell(spawnPoint[0], spawnPoint[1]);
}

function move() {
  clearTimeout(pendingMove); // ensure there are no overlapping timeouts
  checkForDirectionChange();
  updateBodyPosition();
  if(foodWasEaten) {
    avatar.digestFood();
    foodWasEaten = false;
  }
  if(avatar.alive) {
    pendingMove = setTimeout(function(){ move() }, delayBetweenMoves);
  }
}

function startGame() {
  pageElements.playButton.hidden = true;
  document.getElementById("menu").hidden = true;
  score = new Score();
  pageElements.scoreDisplay.hidden = false;
  document.querySelector('meta[name="viewport"]').content = "user-scalable=no";
  document.activeElement.blur();
  changeDirectionToRight();
  Settings.setGameSpeed();
  pageElements.banner.style.fontSize = "2em";
  for(let i=0; i<pageElements.buttons.length; i++) {
    pageElements.buttons[i].disabled=true;
  }
  for(let s=0; s<speedSelector.children.length; s++) {
    speedSelector.children[s].disabled = true;
  }
  move();
  makeFood();
  gameIsInProgress = true;
}

function tryToMove(bodyPart) {
  // check whether the intended space exists and is unoccupied
  if(!cellExists(bodyPart.row, bodyPart.col)) {
    avatar.hitWall(bodyPart);
  } else if(avatar.cellIsOccupied(bodyPart.row, bodyPart.col)) {
    avatar.hitBodyPartAt(bodyPart.row, bodyPart.col);
  } else {
    avatar.checkForFoodAt(bodyPart.row, bodyPart.col);
    deleteAndRemake(bodyPart);
  }
}

function updateBodyPosition() {
  avatar.body.forEach(function(bodyPart) {
    if(avatar.alive) { // after the head dies, the rest of the body doesn't move
      updateIndices(bodyPart);
      tryToMove(bodyPart);
    }
  });
}

function updateIndices(bodyPart) {
  if(bodyPart === avatar.body[0]) {
    [oldRowIndex, bodyPart.row] = [bodyPart.row, (bodyPart.row + rowChangeAmount)];
    [oldColIndex, bodyPart.col] = [bodyPart.col, (bodyPart.col + colChangeAmount)];
  } else {
    [oldRowIndex, bodyPart.row] = [bodyPart.row, oldRowIndex];
    [oldColIndex, bodyPart.col] = [bodyPart.col, oldColIndex];
  }
}
