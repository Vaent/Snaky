'use strict'

var cellCSS = document.createElement('style'),
  cellSize,
  documentMenu = document.getElementById("menu"),
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
  scaleGameView();
}

function createResizeListener() {
  window.addEventListener('resize', scaleGameView);
}

function hideInstructions() {
  instructionsDiv.hidden = true;
  instructionsHideButton.hidden = true;
  instructionsShowButton.hidden = false;
}

function hideSettings() {
  settingsDiv.hidden = true;
  settingsHideButton.hidden = true;
  settingsShowButton.hidden = false;
}

function scaleGameView() {
  // let maxHeightOfTable = (
  //   window.innerHeight
  //   - documentBanner.clientHeight
  //   - parseInt(getComputedStyle(documentBanner).getPropertyValue('margin-top'), 10)
  //   - parseInt(getComputedStyle(documentBanner).getPropertyValue('margin-bottom'), 10)
  //   - documentMenu.clientHeight
  //   - parseInt(getComputedStyle(documentMenu).getPropertyValue('margin-bottom'), 10)
  // );
  // let maxRowHeight = Math.floor(maxHeightOfTable / numberOfRows);
  let maxRowHeight = Math.floor(window.innerHeight / numberOfRows);
  let maxColWidth = Math.floor(window.innerWidth / numberOfColumns);
  cellSize = Math.min(maxRowHeight, maxColWidth) - 3; // target cell size reduced to allow for borders
  scaleTableCells();
}

function scaleTableCells() {
  cellCSS.innerHTML = `td { width: ${cellSize}px; height: ${cellSize}px; font-size: ${0.8 * cellSize}px }`
}

function showInstructions() {
  instructionsDiv.innerHTML = avatar.instructions;
  instructionsDiv.hidden = false;
  instructionsHideButton.hidden = false;
  instructionsShowButton.hidden = true;
  hideSettings();
}

function showSettings() {
  settingsDiv.hidden = false;
  settingsHideButton.hidden = false;
  settingsShowButton.hidden = true;
  hideInstructions();
}
