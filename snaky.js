'use strict'

var score = 0,
  gameIsInProgress = false,
  numberOfRows = 12,
  numberOfColumns = 16,
  snake = [],
  rowChangeAmount = 0,
  colChangeAmount = 1,
  delayBetweenMoves = 100;

function addToSnakeBody(char, row, col) {
  snake.push({char:char, row:row, col:col});
}

function display(bodyPart) {
  cellInTable(bodyPart['row'], bodyPart['col']).innerHTML = bodyPart['char'];
}

function move() {
  let alive = true, oldRowIndex = -1, oldColIndex;
  snake.forEach(function(bodyPart) {
    if(alive) {
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
  if(alive){ setTimeout(function(){ move() }, delayBetweenMoves); }
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
    switch(event.key){
      case "ArrowRight":
        rowChangeAmount = 0;
        colChangeAmount = 1;
        break;
      case "ArrowDown":
        rowChangeAmount = 1;
        colChangeAmount = 0;
        break;
      case "ArrowLeft":
        rowChangeAmount = 0;
        colChangeAmount = -1;
        break;
      case "ArrowUp":
        rowChangeAmount = -1;
        colChangeAmount = 0;
        break;
    }
    if(!gameIsInProgress){ startGame() }
  });

  document.addEventListener('DOMContentLoaded', function() {
    for(let r=1; r<=numberOfRows; r++) {
      let htmlToAdd = ''
      htmlToAdd += '<tr>';
      for(let c=1; c<=numberOfColumns; c++) {
        htmlToAdd += `<td id='r${String(r).padStart(2,'0')}c${String(c).padStart(2,'0')}'></td>`;
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
