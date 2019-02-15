'use strict'

function Display() {}

Display.hideInstructions = function() {
  pageElements.instructionsDiv.hidden = true;
  pageElements.instructionsHideButton.hidden = true;
  pageElements.instructionsShowButton.hidden = false;
}

Display.hidePlayArea = function() {
  pageElements.gameView.hidden = true;
  pageElements.playButton.hidden = true;
  pageElements.resetButton.hidden = true;
}

Display.hideSettings = function() {
  pageElements.settingsDiv.hidden = true;
  pageElements.settingsHideButton.hidden = true;
  pageElements.settingsShowButton.hidden = false;
}

Display.showInstructions = function() {
  pageElements.instructionsDiv.innerHTML = avatar.instructions;
  pageElements.instructionsDiv.hidden = false;
  pageElements.instructionsHideButton.hidden = false;
  pageElements.instructionsShowButton.hidden = true;
  Display.hideSettings();
  Display.hidePlayArea();
}

Display.showPlayArea = function() {
  pageElements.gameView.hidden = false;
  if(avatar.alive) {
    GameSetUp.prepareGame();
  } else {
    pageElements.resetButton.hidden = false;
    layoutController.positionResetButton();
  }
}

Display.showSettings = function() {
  pageElements.settingsDiv.hidden = false;
  pageElements.settingsHideButton.hidden = false;
  pageElements.settingsShowButton.hidden = true;
  Display.hideInstructions();
  Display.hidePlayArea();
}

Display.viewDefault = function() {
  Display.hideInstructions();
  Display.hideSettings();
  Display.showPlayArea();
}
