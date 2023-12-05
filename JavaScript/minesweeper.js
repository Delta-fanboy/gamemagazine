// Initialize variables for the Minesweeper game
var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = []; // Stores the location of mines, e.g., "2-2", "5-2"

var tilesClicked = 0; // Keeps track of the number of tiles clicked without hitting mines
var flagEnabled = false;

var gameOver = false;

// Trigger the startGame function when the window is loaded
window.onload = function() {
    startGame();
}

// Set the initial locations of the mines
function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

// Start the Minesweeper game
function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag)
    setMines();

    // Populate the game board with tiles
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// Enable or disable flag mode
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgrey";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

// Handle clicks on the game tiles
function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled){
        if (tile.innerText == "") {
            tile.innerText = "🚩"; // Place or remove a flag on right-click
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = ""; // Remove the flag if already placed
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); // Extract row and column coordinates from tile ID
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

// Reveal the locations of mines on game over
function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c =0; c < columns; c++) {
            let tile = board [r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

// Check the surrounding tiles for mines and update the game state
function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")) {
        return
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // Check surrounding tiles for mines
    minesFound += checkTile(r-1, c-1);      // top left
    minesFound += checkTile(r-1, c);        // top
    minesFound += checkTile(r-1, c+1);      // top right
    minesFound += checkTile(r, c-1);        // left
    minesFound += checkTile(r, c+1);        // right
    minesFound += checkTile(r+1, c-1);      // bottom left
    minesFound += checkTile(r+1, c);        // bottom
    minesFound += checkTile(r+1, c+1);      // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // Recursive check for surrounding tiles
        checkMine(r-1, c-1); // top left
        checkMine(r-1, c);   // top
        checkMine(r-1, c+1); // top right

        checkMine(r, c-1);   // left
        checkMine(r, c+1);   // right

        checkMine(r+1, c-1); // bottom left
        checkMine(r+1, c);   // bottom
        checkMine(r+1, c+1); // bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "cleared";
        gameOver = true;
    }
}

// Check if a tile contains a mine
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    } 
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
