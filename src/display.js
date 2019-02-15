'use strict'

var instructionsDiv = document.getElementById("instructions"),
  instructionsHideButton = document.getElementById("hideInstructions"),
  instructionsShowButton = document.getElementById("showInstructions"),
  settingsDiv = document.getElementById("settings"),
  settingsHideButton = document.getElementById("hideSettings"),
  settingsShowButton = document.getElementById("showSettings");

function hideInstructions() {
  instructionsDiv.hidden = true;
  instructionsHideButton.hidden = true;
  instructionsShowButton.hidden = false;
}

function hidePlayArea() {
  gameViewTable.hidden = true;
  playButton.hidden = true;
  resetButton.hidden = true;
}

function hideSettings() {
  settingsDiv.hidden = true;
  settingsHideButton.hidden = true;
  settingsShowButton.hidden = false;
}

function showInstructions() {
  instructionsDiv.innerHTML = avatar.instructions;
  instructionsDiv.hidden = false;
  instructionsHideButton.hidden = false;
  instructionsShowButton.hidden = true;
  hideSettings();
  hidePlayArea();
}

function showPlayArea() {
  gameViewTable.hidden = false;
  if(alive) {
    prepareGame();
  } else {
    resetButton.hidden = false;
    positionResetButton();
  }
}

function showSettings() {
  settingsDiv.hidden = false;
  settingsHideButton.hidden = false;
  settingsShowButton.hidden = true;
  hideInstructions();
  hidePlayArea();
}

function viewDefault() {
  hideInstructions();
  hideSettings();
  showPlayArea();
}
