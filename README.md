# SNAKY

A clone of Snake created to test my ability to manipulate an HTML page using raw JavaScript.

The game is loaded by opening index.html (which pulls in the snaky.js script and styles.css sheet from the same directory).

## How it works

The HTML page contains a table, with all the cells empty except the ones representing the snake or food. When the snake 'moves' in the game, each part of its body is actually being deleted from the cell it was in, and recreated in an adjacent cell. The JavaScript is loaded as the last element of the HTML `<body>`.

The script sets up a function called `move()`. This function will update the position of each part of the snake's body, beginning with the head which is printed to a new position determined by the row/column change variables. Each subsequent body part takes its new position from the body part that went before it, using `[a,b]=[b,a]` syntax to swap the old and new values.

Finally, an IIFE (anonymous function which is run straight away) in the script sets up an eventListener which will detect key presses, updating the direction of movement if an arrow key is pressed. It sets up a second event listener which detects when the browser has finished loading the page, then loads some additional HTML to set up the table* (doing it this way allows the table dimensions to be changed easily), creates the snake, and calls `move()` to get things going.

#### Moving the snake

When the game is loaded, the snake is declared to be alive. There is a check within `move()` for the snake colliding with the edge of the box (trying to move into a space that doesn't exist in the game) or with its tail. When one of these happens, the head is changed from an 'o' to an 'x' and the snake is 'killed' so that the other body parts won't try to update their position.

At the end of `move()`, if the snake is still alive, a timer is set up to call `move()` again after a short delay. This allows the snake to keep moving without any input from the player. If the snake dies, the timer is not set, so that no further `move()` calls will be made.

The timer is assigned to a variable so that it can be deleted if `move()` is called again earlier than expected - otherwise we could end up with multiple, overlapping chains of moves, which mean the position is updated more frequently and the snake moves too fast.

#### Food

Food, represented by a semicolon, is spawned by the `makeFood()` function. Random row and column numbers are generated to determine where the food will spawn. If the randomly chosen cell is not empty, new random values are generated until an empty cell is found. The semicolon is then inserted in the cell and remains there until it is overwritten i.e. by the snake's head moving onto it.

Food is spawned at the start of the game - after the snake is created, to ensure it doesn't accidentally get overwritten. `move()` identifies when a body part will move into a cell with a semicolon, and immediately calls `makeFood()` to ensure there will still be food somewhere after the existing food is overwritten. It also adds a new body part on the end of the snake, initialised in a nonexistent cell to ensure no conflicts with any elements already in play; since it is at the end of the body, in the last iteration of the `snake.forEach()` loop it will take the position of the previous final body part.

Initialising the new body part in a nonexistent cell required an additional check within `move()` (`if(!!cellInTable(oldRowIndex, oldColIndex)) {...}`) to ensure the function doesn't try to clear that cell after the new body part has moved into play.

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
