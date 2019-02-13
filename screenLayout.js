'use strict'

var cellCSS = document.createElement('style'),
  controlPanelAlignCSS = document.createElement('style'),
  playButtonCSS = document.createElement('style'),
  cellSize,
  controlPanel = document.getElementById("controlPanel"),
  gameViewTable = document.getElementById("gameView"),
  playButton = document.getElementById('playButton');

function attachCSSEditors() {
  document.body.appendChild(cellCSS);
  document.body.appendChild(controlPanelAlignCSS);
  document.body.appendChild(playButtonCSS);
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
  playButton.hidden = false;
  updateScreenLayout();
}

function createScreenChangeListeners() {
  window.matchMedia("(min-height: 100vw)").addListener(updateScreenLayout);
  window.addEventListener('resize', updateScreenLayout);
}

function detectOrientation() {
  return (
    window.matchMedia("(min-height: 100vw)").matches ? 'portrait' : 'landscape'
  );
}

function getCellSizeLimit(windowSize, otherContentSize, numberOfDivisions) {
  return Math.floor(
    (windowSize - otherContentSize) / numberOfDivisions
  );
}

function getLayoutValues(orientation) {
  let wide = {
    windowSize: window.innerWidth,
    controlPanelSize: controlPanel.clientWidth,
    margins: ['margin-left', 'margin-right'],
    numberOfDivisions: numberOfColumns
  };
  let tall = {
    windowSize: window.innerHeight,
    controlPanelSize: controlPanel.clientHeight,
    margins: ['margin-top', 'margin-bottom'],
    numberOfDivisions: numberOfRows
  };

  if(orientation === 'portrait') {
    return { primary: tall, secondary: wide }
  } else {
    return { primary: wide, secondary: tall }
  }
}

function optimiseCellSize(maxRowHeight, maxColWidth) {
  // target cell size is reduced from calculated values to allow for borders
  cellSize = Math.min(maxRowHeight, maxColWidth) - 3;
}

function positionPlayButton() {
  let gameViewDimensions = gameViewTable.getBoundingClientRect();
  let posX = (gameViewDimensions.right + gameViewDimensions.left - playButton.clientWidth) / 2;
  let posY = (gameViewDimensions.top + gameViewDimensions.bottom - playButton.clientHeight) / 2;
  playButtonCSS.innerHTML = `#playButton { position: absolute; left: ${posX}px; top: ${posY}px; }`;
}

function scaleTableCells() {
  cellCSS.innerHTML = `#gameView td { width: ${cellSize}px; height: ${cellSize}px; font-size: ${0.8 * cellSize}px }`;
}

function updateControlPanelAlignment(orientation) {
  if(orientation === 'landscape') {
    controlPanelAlignCSS.innerHTML = "#controlPanel { float: right; width: 40vw; }"
  } else {
    controlPanelAlignCSS.innerHTML = "#controlPanel { margin: auto; }"
  }
}

function updateScreenLayout() {
  let or = detectOrientation();
  updateControlPanelAlignment(or);
  // control panel alignment must be set before determining the layout values
  let major = getLayoutValues(or).primary,
    minor = getLayoutValues(or).secondary;

  let unavailableSpace = (
    major.controlPanelSize
    + parseInt(getComputedStyle(controlPanel).getPropertyValue(major.margins[0]), 10)
    + parseInt(getComputedStyle(controlPanel).getPropertyValue(major.margins[1]), 10)
  );

  let mainCellSize =
    getCellSizeLimit(major.windowSize, unavailableSpace, major.numberOfDivisions);
  let altCellSize =
    getCellSizeLimit(minor.windowSize, 0, minor.numberOfDivisions);

  optimiseCellSize(mainCellSize, altCellSize);
  scaleTableCells();
  positionPlayButton();
}
