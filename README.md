# SNAKY

A clone of Snake created to test my ability to manipulate an HTML page using raw JavaScript.

The game is loaded by opening index.html (which loads the snaky.js script from the same directory).

### How it works

The HTML page contains a 9x9 table, with all the cells empty except the one which contains the character. When the character 'moves' in the game, it is actually being deleted from the cell it was in, and recreated in an adjacent cell.

The JavaScript is loaded as the last element of the HTML <body>. Variables are declared to track the direction of movement of the snake, represented as changes in the row/column where it is displayed; the default is no change in the row, column change by +1 - i.e. one space to the right.

An IIFE (anonymous function which is run straight away) in the script sets up an eventListener which will detect key presses, updating the direction of movement if an arrow key is pressed.

The script then sets up a function called `move()`. This function changes the position of each part of the snake's body, beginning with the head which is printed to a new position determined by the row/column change variables. Each subsequent body part takes its new position from the body part that went before it, using `[a,b]=[b,a]` syntax to swap the old and new values.

Finally, the script calls `move()` to get things going.

At the start of each `move()` call, the snake is declared to be still alive. There is a check within `move()` for the snake reaching an edge and trying to move outside the box. When this happens, the head is changed from an 'o' to an 'x' and the snake is 'killed' so that the other body parts won't try to update its position.

At the end of `move()`, if the snake is still alive, a timer is set up to call `move()` again after 250 milliseconds. This allows the snake to keep moving, one space every quarter-second, without any input from the player. If the snake dies, the timer is not set so that no further `move()` calls will be made.

N.B. in the current implementation, the snake can run across its own body, in which case the head will be temporarily hidden by other body parts which update later in the sequence and overwrite anything which went in the same space before them.
