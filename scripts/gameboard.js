const { Ship } = require("./createShips.js");

class Gameboard {
    constructor() {
        this.ships = [];
    }
    checkShipPlacement(shipPos, shipLength, orientation, boardPos) {
        let shipLeft = shipPos.x;
        let shipTop = shipPos.y;
        let shipRight = shipPos.x + shipPos.width;
        let shipBottom = shipPos.y + shipPos.height;
        if (orientation === "vertical") {
            shipBottom = Math.floor(shipPos.height * shipLength + shipPos.y);
        } else {
            shipRight = Math.floor(shipPos.width * shipLength + shipPos.x);
        }
        let boardLeft = boardPos.x;
        let boardTop = boardPos.y;
        let boardRight = Math.floor(boardPos.x + boardPos.width);
        let boardBottom = Math.floor(boardPos.y + boardPos.height);

        if (
            shipLeft < boardLeft ||
            shipTop < boardTop ||
            shipBottom > boardBottom ||
            shipRight > boardRight
        ) {
            return false;
        }
        return true;
    }
}

module.exports = { Gameboard };
