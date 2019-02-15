'use strict'

function Score() {
  this.score = 0;
  this.updateDisplay();
}

Score.prototype.decreaseScore = function(amount) {
  this.score -= amount;
  this.updateDisplay();
}

Score.prototype.increaseScore = function(amount) {
  this.score += amount;
  this.updateDisplay();
}

Score.prototype.updateDisplay = function() {
  scoreDisplay.innerHTML = `Score: ${this.score}`;
}
