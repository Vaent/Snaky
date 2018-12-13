'use strict'

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

function move() {
  let oPositionInHtml = tableElement.innerHTML.indexOf('o');
  let rowIndex = getIndex(oPositionInHtml - 5, oPositionInHtml - 4);
  let colIndex = getIndex(oPositionInHtml - 3, oPositionInHtml - 2);
  let newRow = rowIndex + rowChangeAmount;
  let newCol = colIndex + colChangeAmount;

  if(!!cellInTable(newRow, newCol)) {
    cellInTable(rowIndex, colIndex).innerHTML = '';
    cellInTable(newRow, newCol).innerHTML = 'o';
    setTimeout(function(){ move() }, 500);
  } else {
    cellInTable(rowIndex, colIndex).innerHTML = 'x';
  }
}

function getIndex(start, end) {
  return Number(tableElement.innerHTML.slice(start, end));
}

function cellInTable(row, col) {
  return document.getElementById(`r${row}c${col}`);
}

move();
