var directions = [[0,1],[1,0],[0,-1],[-1,0]]; // right, down, left, up
var directionsIndex = 0;
(function() {
  document.addEventListener('click', function(){
    directionsIndex = (directionsIndex + 1)%4
  })
})();
function move() {
  rowIndex = Number(
    document.getElementById('gameView').innerHTML.slice(
      document.getElementById('gameView').innerHTML.indexOf('o') - 5,
      document.getElementById('gameView').innerHTML.indexOf('o') - 4
    )
  );
  colIndex = Number(
    document.getElementById('gameView').innerHTML.slice(
      document.getElementById('gameView').innerHTML.indexOf('o') - 3,
      document.getElementById('gameView').innerHTML.indexOf('o') - 2
    )
  );
  newRow = rowIndex + directions[directionsIndex][0];
  newCol = colIndex + directions[directionsIndex][1];
  if(!!document.getElementById(`r${newRow}c${newCol}`)) {
    document.getElementById(`r${rowIndex}c${colIndex}`).innerHTML = '&emsp;';
    document.getElementById(`r${newRow}c${newCol}`).innerHTML = 'o';
    setTimeout(function(){move();}, 500);
  } else {
    document.getElementById(`r${rowIndex}c${colIndex}`).innerHTML = 'x';
  }
};
move();
