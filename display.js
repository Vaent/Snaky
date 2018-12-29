'use strict'

function hideInstructions() {
  document.getElementById("instructions").setAttribute("hidden","");
  createKeyListener();
}

function showInstructions() {
  document.getElementById("instructions").removeAttribute("hidden");
  deleteKeyListener();
}

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

createKeyListener();
