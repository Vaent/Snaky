# SNAKY

A clone of Snake created to test my ability to manipulate an HTML page using raw JavaScript.

The game is loaded by opening index.html (which loads the snaky.js script from the same directory).

### How it works

The HTML page contains a 9x9 table, with all the cells empty except the one which contains the character. When the character 'moves' in the game, it is actually being deleted from the cell it was in, and recreated in an adjacent cell.

The JavaScript is loaded as the last element of the HTML <body>. Variables are declared to track the direction of movement of the character, represented as changes in the row/column where it is displayed - the default is no change in the row, column change by +1 i.e. one space to the right. An IIFE (anonymous function which is run straight away) in the script sets up an eventListener which will detect key presses, updating the direction of movement if an arrow key is pressed.

The script then sets up a function called `move()`. This function changes the position of the character based on the current value of the variables determining row/column change amount. It then sets up a timer to call itself again after 500 milliseconds. This allows the character to keep moving, one step every half-second, without any input from the player.

`move()` also has a guard condition for when the character reaches an edge and tries to move outside the box. If this happens, the character is changed from an 'o' to an 'x' and no timer is created. The chain is therefore broken, 'killing' the character and ending the game.

Finally, the script calls `move()` to begin the cycle.
