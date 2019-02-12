'use strict'

var cellCSS = document.createElement('style'),
  controlPanelAlignCSS = document.createElement('style'),
  cellSize,
  controlPanel = document.getElementById("control-panel"),
  gameViewTable = document.getElementById("gameView");

function attachCSSEditors() {
  document.body.appendChild(cellCSS);
  document.body.appendChild(controlPanelAlignCSS);
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

function createScreenChangeListeners() {
  window.addEventListener('resize', updateScreenLayout);
  if(!!screen) {
    if(!!screen.orientation) {
      screen.orientation.addEventListener('change', updateScreenLayout);
    } else if(!!screen.msOrientation) {
      screen.addEventListener('MSOrientationChange', updateScreenLayout);
    }
  }
}

function detectOrientation() {
  if(!!screen) {
    if(!!screen.orientation) {return screen.orientation.type.split("-")[0]}
    if(!!screen.msOrientation) {return screen.msOrientation.split("-")[0]}
  }

  if(window.innerWidth > window.innerHeight) {
    return 'landscape';
  } else {
    return 'portrait';
  }
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

function scaleTableCells() {
  cellCSS.innerHTML = `td { width: ${cellSize}px; height: ${cellSize}px; font-size: ${0.8 * cellSize}px }`;
}

function updateControlPanelAlignment(orientation) {
  if(orientation === 'landscape') {
    controlPanelAlignCSS.innerHTML = "#control-panel { float: right; width: 40vw; }"
  } else {
    controlPanelAlignCSS.innerHTML = "#control-panel { margin: auto; }"
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
}
