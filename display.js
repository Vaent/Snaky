'use strict'

var cellCSS = document.createElement('style'),
  gameViewTable = document.getElementById("gameView"),
  instructionsDiv = document.getElementById("instructions"),
  instructionsHideButton = document.getElementById("hideInstructions"),
  instructionsShowButton = document.getElementById("showInstructions"),
  settingsDiv = document.getElementById("settings"),
  settingsHideButton = document.getElementById("hideSettings"),
  settingsShowButton = document.getElementById("showSettings");

function affixCellCSS() {
  document.body.appendChild(cellCSS);
}

function createGameView() {
  gameViewTable.innerHTML = '';
  for(let r=1; r<=numberOfRows; r++) {
    let htmlToAdd = '';
    htmlToAdd += '<tr>';
    for(let c=1; c<=numberOfColumns; c++) {
      let row2digit = String(r).padStart(2,'0');
      let col2digit = String(c).padStart(2,'0');
      htmlToAdd += `<td id='r${row2digit}c${col2digit}'></td>`;
    }
    htmlToAdd += '</tr>';
    gameViewTable.innerHTML += htmlToAdd;
  }
}

function hideInstructions() {
  instructionsDiv.hidden = true;
  instructionsHideButton.hidden = true;
  instructionsShowButton.hidden = false;
  createKeyListener();
}

function hideSettings() {
  settingsDiv.hidden = true;
  settingsHideButton.hidden = true;
  settingsShowButton.hidden = false;
  createKeyListener();
}

function setCellSize(newSize) {
  if(newSize < 1) {newSize = 1}
  cellCSS.innerHTML = `td { width: ${newSize}em; height: ${newSize}em }`
}

function showInstructions() {
  instructionsDiv.innerHTML = avatar.instructions;
  instructionsDiv.hidden = false;
  instructionsHideButton.hidden = false;
  instructionsShowButton.hidden = true;
  hideSettings();
  deleteKeyListener();
}

function showSettings() {
  settingsDiv.hidden = false;
  settingsHideButton.hidden = false;
  settingsShowButton.hidden = true;
  hideInstructions();
  deleteKeyListener();
}
