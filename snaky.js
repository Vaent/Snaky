'use strict'

var snake = [];
var rowChangeAmount = 0;
var colChangeAmount = 1;
const tableElement = document.getElementById('gameView');

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
  })
})();

function addToSnakeBody(char, row, col) {
  snake.push({char:char, row:row, col:col});
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

      if(!!cellInTable(bodyPart['row'], bodyPart['col'])) {
        cellInTable(oldRowIndex, oldColIndex).innerHTML = '';
        cellInTable(bodyPart['row'], bodyPart['col']).innerHTML = bodyPart['char'];
      } else {
        alive = false;
        cellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
      }
    }
  });
  if(alive){ setTimeout(function(){ move() }, 250); }
}

function getIndex(start, end) {
  return Number(tableElement.innerHTML.slice(start, end));
}

function cellInTable(row, col) {
  return document.getElementById(`r${row}c${col}`);
}

addToSnakeBody('o', 1, 4);
addToSnakeBody('+', 1, 3);
addToSnakeBody('+', 1, 2);
addToSnakeBody('+', 1, 1);
move();
