'use strict'

var avatar,
  score,
  gameIsInProgress,
  alive,
  foodWasEaten = false,
  pendingMove,
  numberOfRows = 20,
  numberOfColumns = 20,
  rowChangeAmount,
  colChangeAmount,
  newRowChangeAmount,
  newColChangeAmount,
  oldRowIndex,
  oldColIndex,
  delayBetweenMoves = 100,
  buttons = document.getElementsByTagName("button"),
  documentBanner = document.getElementById("banner");

function cellExists(rowIndex, colIndex) {
  return !!findCellInTable(rowIndex, colIndex);
}

function changeDirectionToDown() {
  newRowChangeAmount = 1;
  newColChangeAmount = 0;
}

function changeDirectionToLeft() {
  newRowChangeAmount = 0;
  newColChangeAmount = -1;
}

function changeDirectionToRight() {
  newRowChangeAmount = 0;
  newColChangeAmount = 1;
}

function changeDirectionToUp() {
  newRowChangeAmount = -1;
  newColChangeAmount = 0;
}

function checkForDirectionChange() {
  // update direction only if not reversing
  if(newRowChangeAmount !== -rowChangeAmount &&
  newColChangeAmount !== -colChangeAmount) {
    rowChangeAmount = newRowChangeAmount;
    colChangeAmount = newColChangeAmount;
  }
}

function decreaseScore(amount) {
  score -= amount;
  documentBanner.innerHTML = `Score: ${score}`;
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
  alive = false;
  for(let i=0; i<buttons.length; i++) {
    buttons[i].disabled=false;
  }
  for(let s=0; s<speedSelector.children.length; s++) {
    speedSelector.children[s].disabled = false;
  }
  document.querySelector('meta[name="viewport"]').content = "user-scalable=yes";
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

function increaseScore(amount) {
  score += amount;
  documentBanner.innerHTML = `Score: ${score}`;
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
  if(alive) {
    pendingMove = setTimeout(function(){ move() }, delayBetweenMoves);
  }
}

function startGame() {
  document.querySelector('meta[name="viewport"]').content = "user-scalable=no";
  if(rowChangeAmount === colChangeAmount) {changeDirectionToRight()}
  documentBanner.innerHTML = `Score: ${score}`;
  for(let i=0; i<buttons.length; i++) {
    buttons[i].disabled=true;
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
    avatar.hitWall();
  } else if(avatar.cellIsOccupied(bodyPart.row, bodyPart.col)) {
    avatar.hitBodyPartAt(bodyPart.row, bodyPart.col);
  } else {
    avatar.checkForFoodAt(bodyPart.row, bodyPart.col);
    deleteAndRemake(bodyPart);
  }
}

function updateBodyPosition() {
  avatar.body.forEach(function(bodyPart) {
    if(alive) { // after the head dies, the rest of the body doesn't move
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


// functions relating to keyboard/touchscreen controls:

function createKeyListener() {
  document.addEventListener("keydown", keyAction);
}

function createScreenTapListener() {
  document.addEventListener("touchstart", tapAction);
}

function keyAction(event) {
  switch(event.key) {
    case "ArrowDown":
      changeDirectionToDown();
      break;
    case "ArrowLeft":
      changeDirectionToLeft();
      break;
    case "ArrowRight":
      changeDirectionToRight();
      break;
    case "ArrowUp":
      changeDirectionToUp();
      break;
  }
  if(!gameIsInProgress) {
    startGame();
  } else if(Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    move(); // if direction has changed, don't wait for timeout
  }
}

function tapAction(event) {
  let gameViewDimensions = gameViewTable.getBoundingClientRect();

  if(rowChangeAmount === 0) {
    let snakeHeadPosition = cellSize * (avatar.body[0].row - 0.5) + gameViewDimensions.top;
    let distanceFromHead = (event.changedTouches[0].clientY - snakeHeadPosition);
    distanceFromHead > 0 ? changeDirectionToDown() : changeDirectionToUp();
  } else {
    let snakeHeadPosition = cellSize * (avatar.body[0].col - 0.5) + gameViewDimensions.left;
    let distanceFromHead = (event.changedTouches[0].clientX - snakeHeadPosition);
    distanceFromHead > 0 ? changeDirectionToRight() : changeDirectionToLeft();
  }

  if(!gameIsInProgress) {
    let userTappedGameBoard = event.changedTouches[0].clientY > gameViewDimensions.top
      && event.changedTouches[0].clientY < gameViewDimensions.bottom
      && event.changedTouches[0].clientX > gameViewDimensions.left
      && event.changedTouches[0].clientX < gameViewDimensions.right;
    if(userTappedGameBoard) {
      startGame();
    }
  } else if(Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    move(); // if direction has changed, don't wait for timeout
  }
}


// functions to set up the game:

function prepareGame() {
  documentBanner.innerHTML = avatar.constructor.name;
  document.title = avatar.constructor.name;
  createGameView();
  avatar.createDefaultBody();
  avatar.body.forEach(function(bodyPart){ avatar.display(bodyPart) });
}

function resetGame() {
  clearTimeout(pendingMove);
  score = 0;
  gameIsInProgress = false;
  alive = true;
  avatar.body = [];
  prepareGame();
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    affixCellCSS();
    selectSnaky();
    createKeyListener();
    createScreenTapListener();
    createResizeListener();
  });
})();
