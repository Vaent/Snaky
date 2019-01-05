'use strict'

var speedSelector = document.getElementById("speedSelector");

function changeGameSpeed(delayValue) {
  delayBetweenMoves = delayValue;
}

(function() {
  speedSelector.addEventListener("change", function() {
    let valueSelected = new FormData(speedSelector).get("speed");
    changeGameSpeed(Number(valueSelected));
  });
})();
