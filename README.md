# SNAKY

A clone of Snake created to test my ability to manipulate an HTML page using raw JavaScript.

The game is loaded by opening index.html (which pulls in the snaky.js script and styles.css sheet from the same directory).

### How it works

The HTML page contains a table, with all the cells empty except the one which contains the character. When the character 'moves' in the game, it is actually being deleted from the cell it was in, and recreated in an adjacent cell.

The JavaScript is loaded as the last element of the HTML <body>. Variables are declared to track the direction of movement of the snake, represented as changes in the row/column where it is displayed; the default is no change in the row, column change by +1 - i.e. one space to the right.

The script sets up a function called `move()`. This function changes the position of each part of the snake's body, beginning with the head which is printed to a new position determined by the row/column change variables. Each subsequent body part takes its new position from the body part that went before it, using `[a,b]=[b,a]` syntax to swap the old and new values.

Finally, an IIFE (anonymous function which is run straight away) in the script sets up an eventListener which will detect key presses, updating the direction of movement if an arrow key is pressed. It sets up a second event listener which detects when the browser has finished loading the page, then loads some additional HTML to set up the table (doing it this way allows the table dimensions to be changed easily), creates the snake, and calls `move()` to get things going.

At the start of each `move()` call, the snake is declared to be still alive. There is a check within `move()` for the snake colliding with the edge of the box (trying to move into a space that doesn't exist in the game) or with its tail (trying to move into an occupied space including moving back on itself). When one of these happens, the head is changed from an 'o' to an 'x' and the snake is 'killed' so that the other body parts won't try to update their position.

At the end of `move()`, if the snake is still alive, a timer is set up to call `move()` again after a short delay. This allows the snake to keep moving without any input from the player. If the snake dies, the timer is not set so that no further `move()` calls will be made.
