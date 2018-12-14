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
  newRowChangeAmount,
  newColChangeAmount,
  delayBetweenMoves = 100;

function addToSnakeBody(char, row, col) {
  snake.push({char:char, row:row, col:col});
}

function display(bodyPart) {
  cellInTable(bodyPart['row'], bodyPart['col']).innerHTML = bodyPart['char'];
}

function move() {
  clearTimeout(pendingMove); // ensure there are no overlapping timeouts
  let oldRowIndex = -1, oldColIndex;
  snake.forEach(function(bodyPart) {
    if(alive) { // after the head dies, the rest of the body doesn't move
      if(newRowChangeAmount !== -rowChangeAmount &&
      newColChangeAmount !== -colChangeAmount) {
        // update direction only if not reversing direction
        rowChangeAmount = newRowChangeAmount;
        colChangeAmount = newColChangeAmount;
      }
      [oldRowIndex, bodyPart['row']] = [bodyPart['row'], oldRowIndex];
      [oldColIndex, bodyPart['col']] = [bodyPart['col'], oldColIndex];
      if(bodyPart['row'] < 0) {
        bodyPart['row'] = oldRowIndex + rowChangeAmount;
        bodyPart['col'] = oldColIndex + colChangeAmount;
      }
      if(!cellInTable(bodyPart['row'], bodyPart['col']) ||
      cellInTable(bodyPart['row'], bodyPart['col']).innerHTML === '+') {
        alive = false;
        cellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
      } else {
        if(cellInTable(bodyPart['row'], bodyPart['col']).innerHTML === ';') {
          addToSnakeBody('+', -1, -1);
          score ++;
          document.getElementById('banner').innerHTML = `Score: ${score}`;
          makeFood();
        }
        if(!!cellInTable(oldRowIndex, oldColIndex)) {
          cellInTable(oldRowIndex, oldColIndex).innerHTML = '';
        }
        display(bodyPart);
      }
    }
  });
  if(alive) {
    pendingMove = setTimeout(function(){ move() }, delayBetweenMoves);
  }
}

function makeFood() {
  let rowIndex = Math.floor(Math.random() * numberOfRows) + 1;
  let colIndex = Math.floor(Math.random() * numberOfColumns) + 1;
  while(cellInTable(rowIndex, colIndex).innerHTML !== '') {
    rowIndex = Math.floor(Math.random() * numberOfRows) + 1;
    colIndex = Math.floor(Math.random() * numberOfColumns) + 1;
  }
  cellInTable(rowIndex, colIndex).innerHTML = ';';
}

function cellInTable(row, col) {
  return document.getElementById(
    `r${String(row).padStart(2,'0')}c${String(col).padStart(2,'0')}`
  );
}

function startGame() {
  document.getElementById('banner').innerHTML = `Score: ${score}`;
  move();
  makeFood();
  gameIsInProgress = true;
}

(function() {
  document.addEventListener('keydown', function(event) {
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
    } else if(newRowChangeAmount !== Math.abs(rowChangeAmount)) {
      move(); // if direction has changed, don't wait for timeout
    }
  });

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
