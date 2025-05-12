import { Gameboard } from "./gameboard.js";
import { Ship } from "./createShips.js";
import { addPlayers } from "../utils/addPlayers.js";

let dialog = document.querySelector(".dialog");
let doneBtn = document.querySelector(".done-btn");
let gamePlayOption = document.querySelector(".game-play-option");
let firstPlayer = document.querySelector(".first-player-name");
let secondPlayerLabel = document.querySelector(".second-player-label");
let secondPlayer = document.querySelector(".second-player-name");
let playersName = document.querySelectorAll(".players-name");
let errorMsg = document.querySelector(".error-msg");
let players = null;
let playOption = null;
let twoPlayers = false;

const player1Cont = document.querySelector(".player1-board-cont .gameboard");
const player2Cont = document.querySelector(".player2-board-cont .gameboard");
let placementErrorMsg = document.querySelector(".error");
let boardHeading = document.querySelectorAll(".board-heading");
const player2BoardCont = document.querySelector(".player2-board-cont");
const player1BoardCont = document.querySelector(".player1-board-cont");
let playersBoardBtn = document.querySelector(".player2-board-btn");
let player1BoardBtn = document.querySelector(".player1-board-btn");
let startGameBtn = document.querySelector(".start-game-btn");
let resetBtn = document.querySelector(".reset-btn");
let randomBtn = document.querySelector(".random-btn");
let enemyBoards = document.querySelectorAll(".enemy-board");
let currentGameboardCont = player1BoardCont;
let enemyGameboardCont = player2BoardCont;
let player1Gameboard = null;
let player2Gameboard = null;
let currentGameboard = player1Gameboard;

const cellSize = 40;
const gridSize = 10;
const shipSizes = [5, 4, 3, 2, 1];
let shipNames = ["Yamato", "Bismarck", "Musashi", "Iowa-clas", "HMS"];
let occupiedCells = new Set();
let previousShip = null;
let player1Turn = true;
let planning = true;
let enemyGamebaord = player2Gameboard;

// Entry point
window.addEventListener("DOMContentLoaded", () => {
    toggleElemetsDisplay(player2BoardCont, "none", player1BoardCont, "block");
});

function openPlayer1Board() {
    const board = player1BoardCont.querySelector("#main-grid");
    createGrid(board);
    createGrid(enemyBoards[0]);

    player1Gameboard = new Gameboard(gridSize);
    currentGameboard = player1Gameboard;
    const ships = createShips(shipSizes, player1BoardCont);
    enableDragAndDrop(ships, board, player1Gameboard);
}
openPlayer1Board();
function openPlayer2Board() {
    const board = player2BoardCont.querySelector("#main-grid");

    playersBoardBtn.classList.add("start-game-btn");
    createGrid(board);
    createGrid(enemyBoards[1]);

    player2Gameboard = new Gameboard(gridSize);
    const ships = createShips(shipSizes, player2Cont);
    enableDragAndDrop(ships, board, player2Gameboard);
}

openPlayer2Board();
function toggleElemetsDisplay(item1, display1, item2, display2) {
    item1.style.display = display1;
    item2.style.display = display2;
}

function createGrid(board) {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;
            board.appendChild(cell);
        }
    }
}

function createShips(sizes, cont) {
    let container = cont;
    return sizes.map((size, index) => {
        const ship = document.createElement("div");
        ship.className = "ship";
        ship.dataset.size = size;
        ship.dataset.id = `ship-${index}`;
        ship.style.width = `${cellSize * size}px`;

        container.appendChild(ship);
        ship.dataset.shipName = shipNames[index];
        // Set names
        positionShip(ship, size, index);
        return ship;
    });
}

function positionShip(ship, size, index) {
    if (size === 4) {
        ship.style.top = `${480 + 0 * 50}px`;
        ship.style.left = `calc(50% + 40px)`;
        ship.style.backgroundColor = `#4caf50`;
        ship.dataset.bgc = `#4caf50`;
    } else if (size === 3) {
        ship.style.top = `${490 + 1 * 40}px`;
        ship.style.backgroundColor = `#ff851b`;
        ship.dataset.bgc = `#ff851b`;
    } else if (size === 2) {
        ship.style.top = `${490 + 1 * 40}px`;
        ship.style.left = `calc(50% - 40px)`;
        ship.style.backgroundColor = `#0074d9`;
        ship.dataset.bgc = `#0074d9`;
    } else if (size === 1) {
        ship.style.top = `${490 + 1 * 40}px`;
        ship.style.left = `calc(50% + 80px)`;
        ship.dataset.bgc = `#ffd700`;
        ship.style.backgroundColor = `#ffd700`;
    } else {
        ship.style.top = `${480 + index * 50}px`;
        ship.style.left = `50% -200px`;
        ship.dataset.bgc = `#7fdbff`;
    }
}

function enableDragAndDrop(ships, board, playerBoard) {
    ships.forEach((ship) => {
        let offsetX = 0,
            offsetY = 0;

        ship.addEventListener("mousedown", (e) => {
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            ship.style.cursor = "grabbing";
            placementErrorMsg.innerHTML = "";

            const onMouseMove = (ev) =>
                moveShip(ship, ev.clientX - offsetX, ev.clientY - offsetY);
            const onMouseUp = (ev) => {
                ship.style.cursor = "grab";
                if (previousShip) {
                    let shipName = previousShip.dataset.shipName;
                    let idx = shipNames.indexOf(shipNames);
                    playerBoard.occupied = new Set(
                        [...playerBoard.occupied].slice(0, length - idx)
                    );
                }
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                const snapped = snapToGrid(
                    ev.clientX - offsetX,
                    ev.clientY - offsetY,
                    board,
                    parseInt(ship.dataset.size)
                );
                checkShipPlacement(snapped, ship, playerBoard);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            previousShip = e.target;
        });
    });
}

function moveShip(ship, x, y) {
    ship.style.left = `${x}px`;
    ship.style.top = `${y}px`;
}

function resetShipPosition(ship, left, top) {
    ship.style.left = left;
    ship.style.top = top;
}

function snapToGrid(x, y, board, size) {
    const boardRect = board.getBoundingClientRect();
    const relX = x - boardRect.left;
    const relY = y - boardRect.top;

    let col = Math.round(relX / cellSize);
    let row = Math.round(relY / cellSize);
    col = Math.min(Math.max(col, 0), gridSize - size);
    row = Math.min(Math.max(row, 0), gridSize - 1);

    return getPlacementPos(col, row, size, boardRect);
}

function getPlacementPos(col, row, size, boardRect) {
    if (col < 0 || row < 0 || col + size > gridSize || row >= gridSize) {
        return null;
    }

    const keys = [];
    for (let i = 0; i < size; i++) {
        keys.push(`${row},${col + i}`);
    }

    return {
        row,
        col,
        left: boardRect.left + col * cellSize,
        top: boardRect.top + row * cellSize,
        keys,
    };
}

let getRandomCordinadets = () => {
    let col = Math.round(Math.random() * 9);
    let row = Math.round(Math.random() * 9);
    return { col, row };
};

function checkShipPlacement(snapped, ship, playerBoard) {
    let lastValidLeft = ship.style.left;
    let lastValidTop = ship.style.top;
    if (!snapped) {
        resetShipPosition(ship, lastValidLeft, lastValidTop);
        return false;
    }

    const { row, col, left, top, keys } = snapped;

    if (checkOverlap(keys)) {
        // placementErrorMsg.innerHTML = "Invalid placement on Gameboard!";
        resetShipPosition(ship, lastValidLeft, lastValidTop);
        return false;
    }
    const placed = playerBoard.placeShip(
        row,
        col,
        parseInt(ship.dataset.size),
        true
    );
    if (!placed) {
        // placementErrorMsg.innerHTML = "Invalid placement on Gameboard!";
        resetShipPosition(ship, lastValidLeft, lastValidTop);
        return false;
    }

    updateOccupiedCells(ship, keys);
    moveShip(ship, left, top);

    lastValidLeft = `${left}px`;
    lastValidTop = `${top}px`;
}

function checkOverlap(keys) {
    return keys.some((key) => occupiedCells.has(key));
}

function updateOccupiedCells(ship, newKeys) {
    const oldKeys = JSON.parse(ship.dataset.occupied || "[]");
    oldKeys.forEach((key) => occupiedCells.delete(key));
    newKeys.forEach((key) => occupiedCells.add(key));
    ship.dataset.occupied = JSON.stringify(newKeys);
}

// Dialog

let showDialog = () => {
    dialog.showModal();
    firstPlayer.value = "";
    firstPlayer.focus();
};
showDialog();

function getPlayers() {
    gamePlayOption.addEventListener("change", (e) => {
        let firstPlayerTitle = document.querySelector(".first-player-label p");
        playOption = gamePlayOption.value;
        errorMsg.innerHTML = "";
        if (playOption === "2 players") {
            secondPlayerLabel.style.display = "grid";
            firstPlayerTitle.innerHTML = "First player name:";
            twoPlayers = true;
        } else {
            secondPlayerLabel.style.display = "none";
            firstPlayerTitle.innerHTML = "Player name:";
            twoPlayers = false;
        }
    });
}
getPlayers();

function createPlayers() {
    if (!firstPlayer.value || (twoPlayers && !secondPlayer.value)) {
        if (playOption === "2 players") {
            errorMsg.innerHTML = "Provide all players name";
        } else {
            errorMsg.innerHTML = "Provide player name";
        }
    } else {
        let player1 = firstPlayer.value;
        let player2 = "AI";
        if (twoPlayers) {
            player2 = secondPlayer.value;
        }
        players = addPlayers(player1, player2);
        if (!Object.keys(players).length) {
            errorMsg.innerHTML = "Enter different names";
        } else {
            dialog.close();
            if (players.player2 !== "AI") {
                toggleElemetsDisplay(
                    startGameBtn,
                    "none",
                    playersBoardBtn,
                    "block"
                );
                playersBoardBtn.innerHTML = `Move to ${players.player2} board`;
            } else {
                playersBoardBtn.classList.add("satrt-game-btn");
            }
            boardHeading[0].innerHTML = `Hello ${players.player1}! Place Your Ships`;
        }
    }
}
doneBtn.addEventListener("click", createPlayers);
let stratGameByEnterKey = (e) => {
    if (e.key === "Enter") createPlayers();
};
document.addEventListener("keyup", stratGameByEnterKey);

function removeRedOutline() {
    playersName.forEach((player) => {
        player.addEventListener("focus", () => {
            errorMsg.innerHTML = "";
        });
    });
}
removeRedOutline();

function placeShipsRandomly(playerBoard, ships, board) {
    placementErrorMsg.innerHTML = "";
    const boardRect = board.getBoundingClientRect();

    // Clear previously occupied cells
    occupiedCells = new Set();
    playerBoard.occupied = new Set();
    let i = 0;
    ships.forEach((ship) => {
        let placed = false;

        while (!placed) {
            // Generate random coordinates
            const { col, row } = getRandomCordinadets();

            // Randomly decide orientation (horizontal or vertical)
            const horizontal = Math.random() > 0.5;

            // Get placement position
            const snapped = getPlacementPos(
                col,
                row,
                parseInt(ship.dataset.size),
                boardRect,
                horizontal
            );

            if (snapped && !checkOverlap(snapped.keys)) {
                const { left, top, keys } = snapped;

                const placedSuccessfully = playerBoard.placeShip(
                    row,
                    col,
                    parseInt(ship.dataset.size),
                    horizontal
                );

                if (placedSuccessfully) {
                    updateOccupiedCells(ship, keys);
                    moveShip(ship, left, top);
                    placed = true;
                }
            }
        }
    });
}
function resetShipPlacement() {
    const ships = currentGameboardCont.querySelectorAll(".ship");

    // Clear occupied cells
    occupiedCells = new Set();
    currentGameboard.occupied = new Set();

    // Reset each ship to its initial position
    ships.forEach((ship, index) => {
        const size = parseInt(ship.dataset.size);

        // Reset ship's position based on its size and index
        positionShip(ship, size, index);
    });
}

randomBtn.addEventListener("click", () => {
    const board = currentGameboardCont.querySelector("#main-grid");
    const ships = currentGameboardCont.querySelectorAll(".ship");
    placeShipsRandomly(currentGameboard, ships, board);
});
resetBtn.addEventListener("click", resetShipPlacement);

function createAiBoard() {
    if (players.player2 === "AI") {
        const board = player2BoardCont.querySelector("#main-grid");
        const ships = player2BoardCont.querySelectorAll(".ship");
        placeShipsRandomly(player2Gameboard, ships, board);
    }
}

let moveToPlayer2PlaningBoard = () => {
    if (currentGameboard.ships.length >= 5) {
        // playersBoardBtn.removeEventListener("click", changePlayingPlayer);
        currentGameboard = player2Gameboard;
        // player2BoardCont = player2BoardCont;
        toggleElemetsDisplay(
            player1BoardCont,
            "none",
            player2BoardCont,
            "block"
        );
        toggleElemetsDisplay(
            startGameBtn,
            "inline-block",
            playersBoardBtn,
            "none"
        );
        boardHeading[1].innerHTML = `Hello ${players.player2}! Place Your Ships`;
        playersBoardBtn.addEventListener("click", changePlayingPlayer);
        currentGameboardCont = player2BoardCont;
    } else {
        placementErrorMsg.innerHTML = "Place all the the ships";
    }
};
playersBoardBtn.addEventListener("click", moveToPlayer2PlaningBoard);

function navigatePlayersBoard() {
    let player1BoardTitle = currentGameboardCont.querySelector(
        ".player1-board-title"
    );
    let player2BoardTitle = currentGameboardCont.querySelector(
        ".player2-board-title"
    );
    boardHeading[0].innerHTML = `${players.player1} turn`;
    player1BoardTitle.innerHTML = `${players.player1} board`;
    player2BoardTitle.innerHTML = `${players.player2} board`;

    let enemyBoard = currentGameboardCont.querySelectorAll(".enemy-board");

    updateShipPos();
}

let changePlayingPlayer = () => {
    if (player1Turn) {
        getPlayerPlaying(
            player2BoardCont,
            player1BoardCont,
            [players.player1, players.player2],
            player2Gameboard
        );
        enemyGamebaord = player1Gameboard;
        enemyGameboardCont = player1BoardCont;
    } else {
        getPlayerPlaying(
            player1BoardCont,
            player2BoardCont,
            [players.player2, players.player1],
            player1Gameboard
        );
        enemyGamebaord = player2Gameboard;
        enemyGameboardCont = player2BoardCont;
    }
};

function getPlayerPlaying(
    openBoardCont,
    closeBoardCont,
    boardsName,
    gameboard
) {
    currentGameboardCont = openBoardCont;
    currentGameboard = gameboard;
    let enemyBoard = currentGameboardCont.querySelector(".enemy-board");
    let boardHeading = currentGameboardCont.querySelector(".board-heading");
    let [player1, player2] = boardsName;
    let player1BoardTitle = currentGameboardCont.querySelector(
        ".player1-board-title"
    );
    let player2BoardTitle = currentGameboardCont.querySelector(
        ".player2-board-title"
    );
    toggleElemetsDisplay(currentGameboardCont, "block", closeBoardCont, "none");
    toggleElemetsDisplay(enemyBoard, "grid", closeBoardCont, "none");
    updateShipPos();
    playersBoardBtn.innerHTML = `Move to ${player1} board`;

    boardHeading.innerHTML = `${player2} turn`;
    player1BoardTitle.innerHTML = `${player2} board`;
    player2BoardTitle.innerHTML = `${player1} board`;
    enemyBoard.addEventListener("click", getClickedCell);

    player1Turn = !player1Turn;
}
function startGame() {
    if (currentGameboard.ships.length >= 5) {
        currentGameboardCont = player1BoardCont;
        if (players.player2 !== "AI") {
            toggleElemetsDisplay(
                startGameBtn,
                "none",
                playersBoardBtn,
                "inline-block"
            );
            playersBoardBtn.removeEventListener(
                "click",
                moveToPlayer2PlaningBoard
            );
        } else {
            createAiBoard();
        }
        toggleElemetsDisplay(enemyBoards[0], "grid", player2BoardCont, "none");
        navigatePlayersBoard();
        toggleElemetsDisplay(resetBtn, "none", randomBtn, "none");
        toggleElemetsDisplay(startGameBtn, "none", player1BoardCont, "block");

        enemyGamebaord = player2Gameboard;
        enemyBoard.addEventListener("click", getClickedCell);
        playersBoardBtn.addEventListener("click", changePlayingPlayer);
    } else {
        let error = currentGameboardCont.querySelector(".error");
        error.innerHTML = "Place all the the ships";
    }
}

startGameBtn.addEventListener("click", startGame);

function updateShipPos() {
    const ships = currentGameboardCont.querySelectorAll(".ship");
    ships.forEach((ship, i) => {
        let occupiedCells = JSON.parse(ship.dataset.occupied);
        colorOccupiedCells(occupiedCells, ship.dataset.bgc);
        ship.style.display = "none";
    });
}

function colorOccupiedCells(occupiedCells, bgc) {
    const board = currentGameboardCont.querySelector("#main-grid");
    let cells = board.querySelectorAll(".cell");
    cells.forEach((cell) => {
        let coordinates = cell.dataset.row + "," + cell.dataset.col;
        if (occupiedCells.includes(coordinates)) {
            cell.style.backgroundColor = `${bgc}`;
            cell.style.opacity = ".75";
            cell.style.borderColor = "var(--navy-blue)";
        }
    });
}

let getClickedCell = (e) => {
    let clickedCell = e.target.closest(".cell");
    let playerBoard = currentGameboardCont.querySelector("#main-grid");

    if (clickedCell) {
        let ships = playerBoard.querySelector(".ship");
        checkClickedCell(clickedCell);
    }
};

function checkClickedCell(clickedCell) {
    const row = clickedCell.dataset.row;
    const col = clickedCell.dataset.col;

    displayAttacks(row, col, clickedCell);
}

function displayAttacks(row, col, clickedCell) {
    let attack = enemyGamebaord.receiveAttack(row, col);

    switch (attack.isHit) {
        case true:
            console.log("Hit");
            createAttackDisplayCircle(clickedCell, "--red");
            getAttackedCell(row, col, "--red");
            break;
        case false:
            console.log("miss");
            createAttackDisplayCircle(clickedCell, "--slate-grey");
            getAttackedCell(row, col, "--slate-grey");
            break;
    }
    switch (attack.sunk) {
        case true:
            circle.style.opacity = "1";
            break;
    }

    switch (enemyGamebaord.allShipsSunk()) {
        case true:
            switch (player1Turn) {
                case true:
                    alert(`${players.player1} WON!!`);
                    break;
                case false:
                    alert(`${players.player2} WON!!`);
                    break;
            }
            break;
    }
}

function createAttackDisplayCircle(cell, cellBgc) {
    let circle = document.createElement("div");
    circle.classList.add("circle");

    circle.style.backgroundColor = `var(${cellBgc})`;
    console.log(cell);
    return cell.appendChild(circle);
}

function getAttackedCell(row, col, cellBgc) {
    let board = enemyGameboardCont.querySelector("#main-grid");
    let cells = board.querySelectorAll(".cell");
    cells.forEach((cell) => {
        let cellRow = cell.dataset.row;
        let cellCol = cell.dataset.col;
        if (cellRow === row && cellCol === col) {
            createAttackDisplayCircle(cell, cellBgc);
        }
    });
}
let enemyBoard = currentGameboardCont.querySelector(".enemy-board");

function createAiAttack() {
    let coordinates = getRandomCordinadets();
}
