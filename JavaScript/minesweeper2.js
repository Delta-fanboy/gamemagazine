var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
    startGame();
};

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;

    generateRandomMines();

    // populate our board
    for (let r = 1; r <= rows; r++) {
        let row = [];
        for (let c = 1; c <= columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener('click', handleTileClick);
            tile.addEventListener('contextmenu', handleRightClick);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function generateRandomMines() {
    minesLocation = [];

    for (let i = 0; i < minesCount; i++) {
        let randomRow = Math.floor(Math.random() * rows) + 1;
        let randomCol = Math.floor(Math.random() * columns) + 1;

        let minePosition = `${randomRow}-${randomCol}`;

        // Check if the mine is already placed at this position
        if (!minesLocation.includes(minePosition)) {
            minesLocation.push(minePosition);
        } else {
            i--; // Try placing the mine again
        }
    }
}

function handleTileClick(event) {
    if (gameOver) {
        return;
    }

    let tileId = event.target.id;

    // Check if the clicked tile has a mine
    if (minesLocation.includes(tileId)) {
        // Handle game over logic
        gameOver = true;
        console.log("Game Over!");
        revealAllMines();
    } else {
        // Implement logic for revealing tiles
        event.target.classList.add('tile-clicked');
        tilesClicked++;

        // Check for win condition
        if (tilesClicked === rows * columns - minesCount) {
            console.log("You win!");
        }
    }
}

function handleRightClick(event) {
    event.preventDefault(); // Prevent context menu from appearing

    if (gameOver) {
        return;
    }

    let tileId = event.target.id;

    // Implement logic for flagging tiles
    if (flagEnabled) {
        // Toggle flag on/off
        if (event.target.classList.contains('flagged')) {
            event.target.classList.remove('flagged');
        } else {
            event.target.classList.add('flagged');
        }
    }
}

function revealAllMines() {
    // Implement logic to reveal all mines when the game is over
    for (let mine of minesLocation) {
        document.getElementById(mine).classList.add('mine');
    }
}
