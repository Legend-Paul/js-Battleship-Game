import { Gameboard } from "./gameboard.js";
import { Ship } from "./createShips.js";

const userGameboard = document.querySelector(".gameboard");
const cellSize = 40;
const gridSize = 10;
const shipSizes = [5, 4, 3, 2, 1];
const occupiedCells = new Set();
const playerBoard = new Gameboard(gridSize); // Gameboard logic instance

// Entry point
window.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("main-grid");
    createGrid(board);
    const ships = createShips(shipSizes);
    enableDragAndDrop(ships, board);
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

function createShips(sizes) {
    return sizes.map((size, index) => {
        const ship = document.createElement("div");
        ship.className = "ship";
        ship.dataset.size = size;
        ship.dataset.id = `ship-${index}`;
        ship.style.width = `${cellSize * size}px`;
        ship.style.top = `${480 + index * 50}px`;
        ship.style.left = `50% -200px`;
        userGameboard.appendChild(ship);

        // Set names
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
            ship.innerHTML = `<p>Yamato</p>`;
        }

        return ship;
    });
}

function enableDragAndDrop(ships, board) {
    ships.forEach((ship) => {
        let offsetX = 0,
            offsetY = 0;
        let lastValidLeft = ship.style.left;
        let lastValidTop = ship.style.top;

        ship.addEventListener("mousedown", (e) => {
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            ship.style.cursor = "grabbing";

            const onMouseMove = (ev) =>
                moveShip(ship, ev.clientX - offsetX, ev.clientY - offsetY);
            const onMouseUp = (ev) => {
                ship.style.cursor = "grab";
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                const snapped = snapToGrid(
                    ev.clientX - offsetX,
                    ev.clientY - offsetY,
                    board,
                    parseInt(ship.dataset.size)
                );

                if (!snapped) {
                    resetShipPosition(ship, lastValidLeft, lastValidTop);
                    return;
                }

                const { row, col, left, top, keys } = snapped;

                if (checkOverlap(keys)) {
                    alert("Invalid move! Overlapping another ship.");
                    resetShipPosition(ship, lastValidLeft, lastValidTop);
                    return;
                }

                const placed = playerBoard.placeShip(
                    row,
                    col,
                    parseInt(ship.dataset.size),
                    true
                );
                if (!placed) {
                    alert("Invalid placement on Gameboard.");
                    resetShipPosition(ship, lastValidLeft, lastValidTop);
                    return;
                }

                updateOccupiedCells(ship, keys);
                moveShip(ship, left, top);

                lastValidLeft = `${left}px`;
                lastValidTop = `${top}px`;

                console.log(`Ship ${ship.dataset.id} placed at:`, keys);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
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

    if (
        relX < 0 ||
        relY < 0 ||
        col < 0 ||
        row < 0 ||
        col + size > gridSize ||
        row >= gridSize
    ) {
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

function checkOverlap(keys) {
    return keys.some((key) => occupiedCells.has(key));
}

function updateOccupiedCells(ship, newKeys) {
    const oldKeys = JSON.parse(ship.dataset.occupied || "[]");
    oldKeys.forEach((key) => occupiedCells.delete(key));
    newKeys.forEach((key) => occupiedCells.add(key));
    ship.dataset.occupied = JSON.stringify(newKeys);
}
