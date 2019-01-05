'use strict'

var gameViewTable = document.getElementById("gameView"),
  instructionsDiv = document.getElementById("instructions"),
  instructionsHideButton = document.getElementById("hideInstructions"),
  instructionsShowButton = document.getElementById("showInstructions"),
  settingsDiv = document.getElementById("settings"),
  settingsHideButton = document.getElementById("hideSettings"),
  settingsShowButton = document.getElementById("showSettings");

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
  instructionsDiv.setAttribute("hidden","");
  instructionsHideButton.setAttribute("hidden","");
  instructionsShowButton.removeAttribute("hidden");
  createKeyListener();
}

function showInstructions() {
  instructionsDiv.innerHTML = avatar.instructions;
  instructionsDiv.removeAttribute("hidden");
  instructionsHideButton.removeAttribute("hidden");
  instructionsShowButton.setAttribute("hidden","");
  hideSettings();
  deleteKeyListener();
}

function hideSettings() {
  settingsDiv.setAttribute("hidden","");
  settingsHideButton.setAttribute("hidden","");
  settingsShowButton.removeAttribute("hidden");
  createKeyListener();
}

function showSettings() {
  settingsDiv.removeAttribute("hidden");
  settingsHideButton.removeAttribute("hidden");
  settingsShowButton.setAttribute("hidden","");
  hideInstructions();
  deleteKeyListener();
}
