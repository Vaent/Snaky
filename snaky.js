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
  let oldRowIndex = snake[0]['row'];
  let oldColIndex = snake[0]['col'];
  snake[0]['row'] = oldRowIndex + rowChangeAmount;
  snake[0]['col'] = oldColIndex + colChangeAmount;

  if(!!cellInTable(snake[0]['row'], snake[0]['col'])) {
    cellInTable(oldRowIndex, oldColIndex).innerHTML = '';
    cellInTable(snake[0]['row'], snake[0]['col']).innerHTML = snake[0]['char'];
    setTimeout(function(){ move() }, 250);
  } else {
    cellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
  }
}

function getIndex(start, end) {
  return Number(tableElement.innerHTML.slice(start, end));
}

function cellInTable(row, col) {
  return document.getElementById(`r${row}c${col}`);
}

addToSnakeBody('o', 1, 1);
move();
