'use strict'

var avatar,
  score = 0,
  gameIsInProgress = false,
  alive = true,
  pendingMove,
  numberOfRows = 12,
  numberOfColumns = 16,
  rowChangeAmount = 0,
  colChangeAmount = 1,
  newRowChangeAmount = 0,
  newColChangeAmount = 1,
  oldRowIndex,
  oldColIndex,
  delayBetweenMoves = 100;

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
  document.getElementById('banner').innerHTML = `Score: ${score}`;
}

function makeFood() {
  let spawnPoint = getRandomEmptyCell();
  avatar.putFoodInCell(spawnPoint[0], spawnPoint[1]);
}

function move() {
  clearTimeout(pendingMove); // ensure there are no overlapping timeouts
  checkForDirectionChange();
  updateBodyPosition();
  if(alive) {
    pendingMove = setTimeout(function(){ move() }, delayBetweenMoves);
  }
}

function startGame() {
  document.getElementById('banner').innerHTML = `Score: ${score}`;
  move();
  makeFood();
  gameIsInProgress = true;
}

function tryToMove(bodyPart) {
  // check whether the intended space exists and is unoccupied
  if(!cellExists(bodyPart['row'], bodyPart['col'])) {
    avatar.hitWall();
  } else if(avatar.cellIsOccupied(bodyPart['row'], bodyPart['col'])) {
    avatar.hitBodyPartAt(bodyPart['row'], bodyPart['col']);
  } else {
    avatar.checkForFoodAt(bodyPart['row'], bodyPart['col']);
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
    [oldRowIndex, bodyPart['row']] = [bodyPart['row'], (bodyPart['row'] + rowChangeAmount)];
    [oldColIndex, bodyPart['col']] = [bodyPart['col'], (bodyPart['col'] + colChangeAmount)];
  } else {
    [oldRowIndex, bodyPart['row']] = [bodyPart['row'], oldRowIndex];
    [oldColIndex, bodyPart['col']] = [bodyPart['col'], oldColIndex];
  }
}


// functions relating to keyboard controls:

function createKeyListener() {
  document.addEventListener("keydown", keyAction);
}

function deleteKeyListener() {
  document.removeEventListener("keydown", keyAction);
}

function keyAction(event) {
  switch(event.key) {
    case "ArrowRight":
      newRowChangeAmount = 0;
      newColChangeAmount = 1;
      break;
    case "ArrowDown":
      newRowChangeAmount = 1;
      newColChangeAmount = 0;
      break;
    case "ArrowLeft":
      newRowChangeAmount = 0;
      newColChangeAmount = -1;
      break;
    case "ArrowUp":
      newRowChangeAmount = -1;
      newColChangeAmount = 0;
      break;
  }
  if(!gameIsInProgress) {
    startGame();
  } else if(Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    move(); // if direction has changed, don't wait for timeout
  }
}


// functions to set up the game:

function createGameView() {
  for(let r=1; r<=numberOfRows; r++) {
    let htmlToAdd = ''
    htmlToAdd += '<tr>';
    for(let c=1; c<=numberOfColumns; c++) {
      let row2digit = String(r).padStart(2,'0');
      let col2digit = String(c).padStart(2,'0');
      htmlToAdd += `<td id='r${row2digit}c${col2digit}'></td>`;
    }
    htmlToAdd += '</tr>';
    document.getElementById('gameView').innerHTML += htmlToAdd;
  }
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    createGameView();
    avatar = new Snake();
    avatar.createDefaultBody();
    avatar.body.forEach(function(bodyPart){ avatar.display(bodyPart) });
    createKeyListener();
  });
})();
