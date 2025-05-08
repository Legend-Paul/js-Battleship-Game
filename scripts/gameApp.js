import { Ship } from "./createShips.js";

let grid = document.querySelector(".grid");
let shipsArray = document.querySelectorAll(".ship");
let currentShip = null;
let offsetX = 0;
let offsetY = 0;
let drag = false;
let placedShips = [];

function createGridCells() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            grid.appendChild(cell);
        }
    }
}
createGridCells();

function createShips() {
    shipsArray.forEach((ship) => {
        let cells = parseInt(ship.classList[1]);
        for (let i = 0; i < cells; i++) {
            let shipCell = document.createElement("div");
            shipCell.classList.add("ship-cell");
            ship.appendChild(shipCell);
        }
    });
}
createShips();

const moveAt = (pageX, pageY) => {
    if (currentShip) {
        currentShip.style.left = pageX - offsetX + "px";
        currentShip.style.top = pageY - offsetY + "px";
    }
};

const onMouseMove = (e) => {
    if (drag && currentShip) {
        moveAt(e.pageX, e.pageY);
    }
};

shipsArray.forEach((ship) => {
    ship.onmousedown = (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        currentShip = ship;
        drag = true;

        // Style ship for dragging
        currentShip.style.position = "absolute";
        currentShip.style.zIndex = 1000;
        document.body.appendChild(currentShip);

        moveAt(e.pageX, e.pageY);
        document.addEventListener("mousemove", onMouseMove);
    };

    ship.onmouseup = (e) => {
        document.removeEventListener("mousemove", onMouseMove);
        drag = false;

        const gridRect = grid.getBoundingClientRect();
        const cellSize = gridRect.width / 10;
        const relativeX = e.pageX - gridRect.left;
        const relativeY = e.pageY - gridRect.top;
        const col = Math.floor(relativeX / cellSize);
        const row = Math.floor(relativeY / cellSize);
        const length = parseInt(currentShip.classList[1]);

        // Check if within grid bounds
        if (col + length <= 10 && row >= 0 && row < 10 && col >= 0) {
            // Snap position
            currentShip.style.left = gridRect.left + col * cellSize + "px";
            currentShip.style.top = gridRect.top + row * cellSize + "px";

            // Highlight grid cells
            const cells = grid.querySelectorAll(".cell");
            for (let i = 0; i < length; i++) {
                const index = row * 10 + (col + i);
                const cell = cells[index];
                if (cell) {
                    cell.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                }
            }

            // Record ship position
            placedShips.push({
                shipId: currentShip.classList[1],
                startRow: row,
                startCol: col,
                orientation: "horizontal",
                length: length,
            });

            // Lock ship
            ship.onmousedown = null;
        } else {
            // Return to original position
            currentShip.style.left = "";
            currentShip.style.top = "";
            currentShip.style.position = "";
            currentShip.style.zIndex = "";
        }

        currentShip = null;
    };
});
