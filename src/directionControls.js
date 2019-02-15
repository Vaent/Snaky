'use strict'

var keyController, tapController,
  rowChangeAmount, colChangeAmount,
  newRowChangeAmount, newColChangeAmount;

// general functions relating to controlling movement direction in-game:

function bindKeyFor(direction) {
  keyController.changeControl(direction);
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

// constructors for key controls and touchscreen controls:

function KeyController() {
  this.controlToBeChanged = '';
  this.down = 'ArrowDown';
  this.left = 'ArrowLeft';
  this.right = 'ArrowRight';
  this.up = 'ArrowUp';

  this.keyAction = this.keyAction.bind(this);
  document.addEventListener("keydown", this.keyAction);
}

KeyController.prototype.changeControl = function(direction) {
  if(!!this.controlToBeChanged) {return}

  this.controlToBeChanged = direction;
  document.getElementById(
    this.controlToBeChanged + 'ControlDisplay'
  ).style.color = 'red';
  controlsSelectorInstructions.innerHTML = "Press the new key to bind.";
}

KeyController.prototype.changeControlKeyBinding = function(newKey) {
  if(!Object.values(this).find(control => control === newKey)) {
    this[this.controlToBeChanged] = newKey;
  }

  let keyDisplay = document.getElementById(this.controlToBeChanged + 'ControlDisplay');
  keyDisplay.innerHTML = `<label for="${this.controlToBeChanged}Control">${this[this.controlToBeChanged]}</label>`;
  keyDisplay.style.color = 'black';
  controlsSelectorInstructions.innerHTML = "Click/tap a control to change it.";
  this.controlToBeChanged = '';
}

KeyController.prototype.keyAction = function(event) {
  let keyPress = event.key;

  if(!!keyPress.match(/^[a-z]$/)) {
    keyPress = keyPress.toLocaleUpperCase();
  }

  if(!!this.controlToBeChanged) {
    this.changeControlKeyBinding(keyPress);
    return;
  }

  if(!gameIsInProgress) {return}

  switch(keyPress) {
    case this.down:
      changeDirectionToDown();
      break;
    case this.left:
      changeDirectionToLeft();
      break;
    case this.right:
      changeDirectionToRight();
      break;
    case this.up:
      changeDirectionToUp();
      break;
  }

  if(Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    move(); // if direction has changed, don't wait for timeout
  }
}



function TapController() {
  document.addEventListener("touchstart", this.tapAction);
}

TapController.prototype.tapAction = function(event) {
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

  if(gameIsInProgress && Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    move(); // if direction has changed, don't wait for timeout
  }
}
