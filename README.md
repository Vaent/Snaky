# SNAKY

A clone of Snake created to test my ability to manipulate an HTML page using raw JavaScript.

The game has been hosted at cardpeegee.com/sides/snaky, and you can get a copy on your computer by simply downloading and saving all the HTML, CSS and JS files in a convenient folder. To play the game using downloaded files, open index.html in your favourite browser.

**The game is usually only tested in Chrome (current version).**
- It was recently tested in Firefox and working well, although screen orientation was not always detected correctly so the layout may not update.
- Functionality may be reduced in Edge, e.g. lack of touchscreen controls and speed settings; elements are not always displayed correctly.
- The game is NOT SUPPORTED in Internet Explorer.

## How it works

The HTML page contains a table, with all the cells empty except the ones representing the snake or food. When the snake 'moves' in the game, each part of its body is actually being deleted from the cell it was in, and recreated in an adjacent cell. The scripts are loaded as the last element of the HTML `<body>`.

The gameController script sets up a function called `move()`. Originally, this function contained most of the game logic, but as the program grew in complexity it was divided into more reasonable portions; the job of `move()` now is to manage the timing of the snake's movements, and delegate the actual business of moving to other parts of the code.

An IIFE (anonymous function which runs automatically without being called) in the gameController sets up an eventListener which is triggered when the browser has finished loading the page. It then sets the game style to 'Snaky' and sets up a new event listener which detects key presses while the game is active, updating the direction of movement if an arrow key is pressed.

Whenever the game style is set to 'Snaky' or 'Comet', the game is reset. This includes clearing any leftover details of previous games, creating the snake/comet, and setting up a new HTML table* (doing it this way allows the number of rows & columns in the table to be changed easily - in future the settings may include options for resizing the table). An 'avatar' is created from the snakeManager or cometManager scripts, both of which have equivalent functions to handle tasks like displaying body parts and food, so that they can be given distinct characteristics while sharing the general mechanics managed by the gameController script.

#### Controls/user input

Originally the game only used the 4 arrow keys (you can press any key to start, but it's easiest to start by pressing an 'action' key and these are hard-coded as the arrows, which are the only keys that have any effect on the game once begun).

Touch screen input is now also supported: the snake will turn through a right angle toward the location that was tapped. The game is also started by tapping within the 'play area' - so the menu buttons can be used without accidentally starting the game. While the game is in progress, all buttons and settings are disabled so that any part of the screen can be tapped to change direction.

Previously the game could not be started when the instructions or settings were visible, as the page had a fixed portrait layout and was intended to be viewed on a laptop/desktop computer, so space was at a premium. The layout is now flexible and the play area resizes itself to fit the available space, so there is no longer any requirement to close the instructions/settings.

#### Moving the snake

Each part of the snake's body has its position updated in turn, beginning with the head which is printed to a new position determined by the row/column change variables. Each subsequent body part takes its new position from the body part that went before it, using `[a,b]=[b,a]` syntax to swap the old and new values (in the `updateIndices(bodyPart)` function).

When the game is set up, the snake is declared to be alive. There is a check within `tryToMove(bodyPart)` for the snake colliding with the edge of the box (trying to move into a space that doesn't exist in the game) or with its tail. When one of these happens, the head is changed from an 'o' to an 'x' and the snake is 'killed' so that the other body parts won't try to update their position.

At the end of each `move()`, if the snake is still alive, a timer is set up to call `move()` again after a short delay. This allows the snake to keep moving without any input from the player. If the snake dies, the timer is not set, so that no further `move()` calls will be made.

The timer is assigned to a variable so that it can be deleted if `move()` is called again earlier than expected - otherwise we could end up with multiple, overlapping chains of moves, which mean the position is updated more frequently and the snake moves too fast.

#### Food

Food, represented by a semicolon, is spawned by the `makeFood()` function. Random row and column numbers are generated to determine where the food will spawn. If the randomly chosen cell is not empty, new random values are generated until an empty cell is found. The semicolon is then inserted in the cell and remains there until it is overwritten i.e. by the snake's head moving onto it.

Food is spawned at the start of the game - after the snake is created, to ensure it doesn't accidentally get overwritten. `tryToMove()` identifies when a body part will move into a cell with a semicolon and calls `snakeEatsSemicolon()`, which in turn calls `makeFood()` to ensure there will still be food somewhere after the existing food is overwritten.

`snakeEatsSemicolon()` also adds a new body part on the end of the snake, initialised in a nonexistent cell to ensure no conflicts with any elements already in play; later it will take the position of the previous final body part, after that one has moved on. Initialising the new body part in a nonexistent cell requires an additional check (`if(!!findCellInTable(oldRowIndex, oldColIndex)) {...}` - in the `deleteAndRemake(bodyPart)` function) to ensure the function doesn't try to clear that cell after the new body part has moved into play.

---

**\* Footnote about building a table through JS:**

HTML is lenient. You don't always need to specify closing tags - if they're not present, the browser will add them wherever it deems appropriate. This caused issues when I tried to do something like
```
.innerHTML += '<tr>'
...
.innerHTML += '<td>foo</td>'
...
.innerHTML += '</tr>'
```

Each time I added a tag, the browser would immediately add any extra tags necessary to make it complete in isolation. The above example would result in `<tr></tr><tr><td>foo</td></tr><tr></tr>` - empty rows at the start and end, with the cell creating yet another new row just to wrap itself.

I tried creating complete rows with their own ID so that I could insert the cells directly into the row rather than the table, but ran into issues with getElementById - and the code started to look messy. That's why in the end I opted for constructing a string which is stored in a local variable and only added to the table when it forms a fully-enclosed element that can be inserted into the table with no undesired adjustments by the browser.
