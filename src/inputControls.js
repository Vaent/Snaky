'use strict'

var keyController, tapController,
  rowChangeAmount, colChangeAmount,
  newRowChangeAmount, newColChangeAmount;

// constructors for key controls and touchscreen controls:

function KeyController() {
  this.controlToBeChanged = '';
  this.down = 'ArrowDown';
  this.left = 'ArrowLeft';
  this.right = 'ArrowRight';
  this.up = 'ArrowUp';

  this.keyAction = this.keyAction.bind(this);
  document.addEventListener("keydown", this.keyAction);
};

KeyController.bindKeyFor = function(direction) {
  keyController.changeControl(direction);
};

KeyController.prototype.changeControl = function(direction) {
  if(!!this.controlToBeChanged) {return}

  this.controlToBeChanged = direction;
  document.getElementById(
    this.controlToBeChanged + 'ControlDisplay'
  ).style.color = 'red';
  pageElements.controlsSelectorInstructions.innerHTML = "Press the new key to bind.";
};

KeyController.prototype.changeControlKeyBinding = function(newKey) {
  if(!Object.values(this).find(control => control === newKey)) {
    this[this.controlToBeChanged] = newKey;
  }

  let keyDisplay = document.getElementById(this.controlToBeChanged + 'ControlDisplay');
  keyDisplay.innerHTML = `<label for="${this.controlToBeChanged}Control">${this[this.controlToBeChanged]}</label>`;
  keyDisplay.style.color = 'black';
  pageElements.controlsSelectorInstructions.innerHTML = "Click/tap a control to change it.";
  this.controlToBeChanged = '';
};

KeyController.prototype.keyAction = function(event) {
  let keyPress = event.key;

  if(!!keyPress.match(/^[a-z]$/)) {
    keyPress = keyPress.toLocaleUpperCase();
  }

  if(!!this.controlToBeChanged) {
    this.changeControlKeyBinding(keyPress);
    return;
  }

  if(!game.isInProgress()) {return}

  switch(keyPress) {
    case this.down:
      movementController.changeDirectionToDown();
      break;
    case this.left:
      movementController.changeDirectionToLeft();
      break;
    case this.right:
      movementController.changeDirectionToRight();
      break;
    case this.up:
      movementController.changeDirectionToUp();
      break;
  }

  if(Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    movementController.move(); // if direction has changed, don't wait for timeout
  }
};



function TapController() {
  document.addEventListener("touchstart", this.tapAction);
};

TapController.prototype.tapAction = function(event) {
  if(pageElements.gameView.hidden || !game.isInProgress() || !game.avatar.isAlive()) {
    return;
  }

  let gameViewDimensions = pageElements.gameView.getBoundingClientRect();
  if(rowChangeAmount === 0) {
    let snakeHeadPosition = cellSize * (game.avatar.body[0].row - 0.5) + gameViewDimensions.top;
    let distanceFromHead = (event.changedTouches[0].clientY - snakeHeadPosition);
    distanceFromHead > 0 ? movementController.changeDirectionToDown() : movementController.changeDirectionToUp();
  } else {
    let snakeHeadPosition = cellSize * (game.avatar.body[0].col - 0.5) + gameViewDimensions.left;
    let distanceFromHead = (event.changedTouches[0].clientX - snakeHeadPosition);
    distanceFromHead > 0 ? movementController.changeDirectionToRight() : movementController.changeDirectionToLeft();
  }

  if(Math.abs(newRowChangeAmount) !== Math.abs(rowChangeAmount)) {
    movementController.move(); // if direction has changed, don't wait for timeout
  }
};
