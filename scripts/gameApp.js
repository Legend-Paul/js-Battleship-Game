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
let errrorMsg = document.querySelector(".error");
let boardHeading = document.querySelectorAll(".board-heading");
const player2BoardCont = document.querySelector(".player2-board-cont");
const player1BoardCont = document.querySelector(".player1-board-cont");
let player2BoardBtn = document.querySelector(".player2-board-btn");
let resetBtn = document.querySelector(".reset-btn");
let randomBtn = document.querySelector(".random-btn");
let enemyBoard = document.querySelector(".enemy-board");
let currentGameboard = null;

const cellSize = 40;
const gridSize = 10;
const shipSizes = [5, 4, 3, 2, 1];
let shipToRotate = null;
let shipNames = ["Yamato", "Bismarck", "Musashi", "Iowa-clas", "HMS"];
let occupiedCells = new Set();
let previousShip = null;
let oponentSettingBoard = false;

// Entry point
window.addEventListener("DOMContentLoaded", () => {
    togglePlayers("block", "none");
});

function openPlayer1Board() {
    const board = player1BoardCont.querySelector("#main-grid");
    createGrid(board);
    createGrid(enemyBoard);

    const playerBoard = new Gameboard(gridSize);
    const ships = createShips(shipSizes, player1BoardCont);
    enableDragAndDrop(ships, board, playerBoard);
    currentGameboard = playerBoard;
}
openPlayer1Board();
function openPlayer2Board() {
    const board = document.querySelector(".player2-grid");

    player2BoardBtn.classList.add("stsrt-game-btn");
    createGrid(board);
    createGrid(enemyBoard);
    const playerBoard = new Gameboard(gridSize);
    const ships = createShips(shipSizes, player2Cont);
    enableDragAndDrop(ships, board, playerBoard);
    oponentSettingBoard = true;
}
openPlayer2Board();
let togglePlayers = (display1, display2) => {
    player1BoardCont.style.display = display1;
    player2BoardCont.style.display = display2;
};

player2BoardBtn.addEventListener("click", () => {
    togglePlayers("none", "block");
    boardHeading[1].innerHTML = `Hello ${players.player2}! Place Your Ships`;
});
resetBtn.addEventListener("click", () => {
    togglePlayers("block", "none");
});
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
        ship.innerHTML = `<p>Bismarck</p>`;
    } else if (size === 3) {
        ship.style.top = `${490 + 1 * 40}px`;
        ship.innerHTML = `<p>Musashi</p>`;
    } else if (size === 2) {
        ship.style.top = `${490 + 1 * 40}px`;
        ship.style.left = `calc(50% - 40px)`;
        ship.innerHTML = `<p>Iowa-class</p>`;
    } else if (size === 1) {
        ship.style.top = `${490 + 1 * 40}px`;
        ship.style.left = `calc(50% + 80px)`;
        ship.innerHTML = `<p>HMS</p>`;
    } else {
        ship.style.top = `${480 + index * 50}px`;
        ship.style.left = `50% -200px`;
        ship.innerHTML = `<p>Yamato</p>`;
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
            errrorMsg.innerHTML = "";
            console.log(e.offsetY, offsetY);

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
                console.log();
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                const snapped = snapToGrid(
                    ev.clientX - offsetX,
                    ev.clientY - offsetY,
                    board,
                    parseInt(ship.dataset.size)
                );
                checkShipPlacement(snapped, ship, playerBoard);
                // console.log(`Ship ${ship.dataset.id} placed at:`, keys);
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
        // errrorMsg.innerHTML = "Invalid placement on Gameboard!";
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
        // errrorMsg.innerHTML = "Invalid placement on Gameboard!";
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

function startGame() {
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
                player2BoardBtn.innerHTML = `${players.player2} board`;
            } else {
                player2BoardBtn.classList.add("done-btn");
            }
            boardHeading[0].innerHTML = `Hello ${players.player1}! Place Your Ships`;
        }
    }
}
doneBtn.addEventListener("click", startGame);
let stratGameByEnterKey = (e) => {
    if (e.key === "Enter") startGame();
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
    const boardRect = board.getBoundingClientRect();

    // Clear previously occupied cells
    occupiedCells = new Set();
    playerBoard.occupied = new Set();

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

randomBtn.addEventListener("click", () => {
    const board = player1BoardCont.querySelector("#main-grid");
    const ships = document.querySelectorAll(".ship");
    placeShipsRandomly(currentGameboard, ships, board);
});
