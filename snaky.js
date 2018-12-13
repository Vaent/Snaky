'use strict'

var snake = [];
var rowChangeAmount = 0;
var colChangeAmount = 1;
var delayBetweenMoves = 100;
const tableElement = document.getElementById('gameView');

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

      if(!cellInTable(bodyPart['row'], bodyPart['col']) ||
      cellInTable(bodyPart['row'], bodyPart['col']).innerHTML !== '') {
        alive = false;
        cellInTable(oldRowIndex, oldColIndex).innerHTML = 'x';
      } else {
        cellInTable(oldRowIndex, oldColIndex).innerHTML = '';
        cellInTable(bodyPart['row'], bodyPart['col']).innerHTML =
        bodyPart['char'];
      }
    }
  });
  if(alive){ setTimeout(function(){ move() }, delayBetweenMoves); }
}

function cellInTable(row, col) {
  return document.getElementById(
    `r${String(row).padStart(2,'0')}c${String(col).padStart(2,'0')}`
  );
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
  });

  document.addEventListener('DOMContentLoaded', function() {
    let numberOfRows = 12, numberOfColumns = 16;
    for(let r=1; r<=numberOfRows; r++) {
      let htmlToAdd = ''
      htmlToAdd += '<tr>';
      for(let c=1; c<=numberOfColumns; c++) {
        htmlToAdd += `<td id='r${String(r).padStart(2,'0')}c${String(c).padStart(2,'0')}'></td>`;
      }
      htmlToAdd += '</tr>';
      tableElement.innerHTML += htmlToAdd;
    }

    addToSnakeBody('o', 1, 4);
    addToSnakeBody('+', 1, 3);
    addToSnakeBody('+', 1, 2);
    addToSnakeBody('+', 1, 1);
    move();
  });
})();
