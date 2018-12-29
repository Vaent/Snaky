'use strict'

var score = 0,
  gameIsInProgress = false,
  alive = true,
  pendingMove,
  numberOfRows = 12,
  numberOfColumns = 16,
  snake = [],
  rowChangeAmount = 0,
  colChangeAmount = 1,
  newRowChangeAmount = 0,
  newColChangeAmount = 1,
  oldRowIndex,
  oldColIndex,
  delayBetweenMoves = 100;

function addToSnakeBody(char, row, col) {
  snake.push({char:char, row:row, col:col});
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
    findCellInTable(oldRowIndex, oldColIndex).innerHTML = '';
  }
  display(bodyPart);
}

function display(bodyPart) {
  findCellInTable(bodyPart['row'], bodyPart['col']).innerHTML = bodyPart['char'];
}

function findCellInTable(row, column) {
  return document.getElementById(
    `r${String(row).padStart(2,'0')}c${String(column).padStart(2,'0')}`
  );
}

function increaseScore(amount) {
  score += amount;
  document.getElementById('banner').innerHTML = `Score: ${score}`;
}

function makeFood() {
  let rowIndex = Math.floor(Math.random() * numberOfRows) + 1;
  let colIndex = Math.floor(Math.random() * numberOfColumns) + 1;
  while(findCellInTable(rowIndex, colIndex).innerHTML !== '') {
    rowIndex = Math.floor(Math.random() * numberOfRows) + 1;
    colIndex = Math.floor(Math.random() * numberOfColumns) + 1;
  }
  findCellInTable(rowIndex, colIndex).innerHTML = ';';
}

function move() {
  clearTimeout(pendingMove); // ensure there are no overlapping timeouts
  checkForDirectionChange();
  snake.forEach(function(bodyPart) {
    if(alive) { // after the head dies, the rest of the body doesn't move
      updateIndices(bodyPart);
      tryToMove(bodyPart);
    }
  });
  if(alive) {
    pendingMove = setTimeout(function(){ move() }, delayBetweenMoves);
  }
}

function snakeEatsSemicolon() {
  addToSnakeBody('+', -1, -1);
  increaseScore(1);
  makeFood();
}

function startGame() {
  document.getElementById('banner').innerHTML = `Score: ${score}`;
  move();
  makeFood();
  gameIsInProgress = true;
}

function tryToMove(bodyPart) {
  // check whether the intended space exists and is unoccupied
  if(!findCellInTable(bodyPart['row'], bodyPart['col']) ||
  findCellInTable(bodyPart['row'], bodyPart['col']).innerHTML === '+') {
    alive = false;
    findCellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
  } else {
    if(findCellInTable(bodyPart['row'], bodyPart['col']).innerHTML === ';') {
      snakeEatsSemicolon();
    }
    deleteAndRemake(bodyPart);
  }
}

function updateIndices(bodyPart) {
  if(bodyPart === snake[0]) {
    [oldRowIndex, bodyPart['row']] = [bodyPart['row'], (bodyPart['row'] + rowChangeAmount)];
    [oldColIndex, bodyPart['col']] = [bodyPart['col'], (bodyPart['col'] + colChangeAmount)];
  } else {
    [oldRowIndex, bodyPart['row']] = [bodyPart['row'], oldRowIndex];
    [oldColIndex, bodyPart['col']] = [bodyPart['col'], oldColIndex];
  }
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
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

    addToSnakeBody('o', 6, 4);
    addToSnakeBody('+', 6, 3);
    addToSnakeBody('+', 6, 2);
    addToSnakeBody('+', 6, 1);
    snake.forEach(function(bodyPart){ display(bodyPart) });
  });
})();
