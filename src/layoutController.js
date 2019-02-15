'use strict'

var layoutController;
let cellCSS = document.createElement('style'),
  cellSize;

function LayoutController() {
  document.body.appendChild(cellCSS);
  window.matchMedia("(min-height: 100vw)").addListener(this.updateScreenLayout);
  window.addEventListener('resize', this.updateScreenLayout);
}

LayoutController.prototype.createGameView = function() {
  let htmlToAdd = '<tbody>';
  for(let r=1; r<=numberOfRows; r++) {
    htmlToAdd += '<tr>';
    for(let c=1; c<=numberOfColumns; c++) {
      let row2digit = String(r).padStart(2,'0');
      let col2digit = String(c).padStart(2,'0');
      htmlToAdd += `<td id='r${row2digit}c${col2digit}'></td>`;
    }
    htmlToAdd += '</tr>';
  }
  htmlToAdd += '</tbody>';
  pageElements.gameView.innerHTML = htmlToAdd;
  pageElements.resetButton.hidden = true;
  pageElements.playButton.hidden = false;
  this.updateScreenLayout();
}

LayoutController.prototype.detectOrientation = function() {
  return (
    window.matchMedia("(min-height: 100vw)").matches ? 'portrait' : 'landscape'
  );
}

LayoutController.prototype.getCellSizeLimit = function(windowSize, otherContentSize, numberOfDivisions) {
  return Math.floor(
    (windowSize - otherContentSize) / numberOfDivisions
  );
}

LayoutController.prototype.getLayoutValues = function(orientation) {
  let wide = {
    windowSize: window.innerWidth,
    controlPanelSize: pageElements.controlPanel.clientWidth,
    margins: ['margin-left', 'margin-right'],
    numberOfDivisions: numberOfColumns
  };
  let tall = {
    windowSize: window.innerHeight,
    controlPanelSize: pageElements.controlPanel.clientHeight,
    margins: ['margin-top', 'margin-bottom'],
    numberOfDivisions: numberOfRows
  };

  if(orientation === 'portrait') {
    return { primary: tall, secondary: wide }
  } else {
    return { primary: wide, secondary: tall }
  }
}

LayoutController.prototype.optimiseCellSize = function(maxRowHeight, maxColWidth) {
  // target cell size is reduced from calculated values to allow for borders
  cellSize = Math.min(maxRowHeight, maxColWidth) - 3;
}

LayoutController.prototype.positionPlayButton = function() {
  let gameViewDimensions = pageElements.gameView.getBoundingClientRect();
  let posX = (gameViewDimensions.right + gameViewDimensions.left - pageElements.playButton.clientWidth) / 2;
  let posY = (gameViewDimensions.top + gameViewDimensions.bottom - pageElements.playButton.clientHeight) / 2;
  pageElements.playButton.style.left = `${posX}px`;
  pageElements.playButton.style.top = `${posY}px`;
}

LayoutController.prototype.positionResetButton = function() {
  let gameViewDimensions = pageElements.gameView.getBoundingClientRect();
  let posX = (gameViewDimensions.right + gameViewDimensions.left - pageElements.resetButton.clientWidth) / 2;
  let posY = (gameViewDimensions.top + gameViewDimensions.bottom - pageElements.resetButton.clientHeight) / 2;
  pageElements.resetButton.style.left = `${posX}px`;
  pageElements.resetButton.style.top = `${posY}px`;
}

LayoutController.prototype.scaleTableCells = function() {
  cellCSS.innerHTML = `#gameView td { width: ${cellSize}px; height: ${cellSize}px; font-size: ${0.8 * cellSize}px }`;
}

LayoutController.prototype.updateFlexAlignment = function(orientation) {
  document.body.style.height = `${window.innerHeight}px`;
  if(orientation === 'landscape') {
    document.body.style.flexDirection = "row-reverse";
  } else {
    document.body.style.flexDirection = "column";
  }
}

LayoutController.prototype.updateScreenLayout = function() {
  let or = layoutController.detectOrientation();
  layoutController.updateFlexAlignment(or);
  // control panel alignment must be set before determining the layout values
  let major = layoutController.getLayoutValues(or).primary,
    minor = layoutController.getLayoutValues(or).secondary;

  let unavailableSpace = (
    major.controlPanelSize
    + parseInt(getComputedStyle(pageElements.controlPanel).getPropertyValue(major.margins[0]), 10)
    + parseInt(getComputedStyle(pageElements.controlPanel).getPropertyValue(major.margins[1]), 10)
  );

  let mainCellSize =
    layoutController.getCellSizeLimit(major.windowSize, unavailableSpace, major.numberOfDivisions);
  let altCellSize =
    layoutController.getCellSizeLimit(minor.windowSize, 0, minor.numberOfDivisions);

  layoutController.optimiseCellSize(mainCellSize, altCellSize);
  layoutController.scaleTableCells();
  layoutController.positionPlayButton();
  layoutController.positionResetButton();
}
