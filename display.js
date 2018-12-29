'use strict'

function hideInstructions() {
  document.getElementById("instructions").setAttribute("hidden","");
  createKeyListener();
}

function showInstructions() {
  document.getElementById("instructions").removeAttribute("hidden");
  deleteKeyListener();
}
