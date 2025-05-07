import { Ship } from "./createShips.js";
class Gameboard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
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
    placeShip(ship, length, orientation, board) {
        let shipPos = ship.getBoundingClientRect();
        let boardPos = board.getBoundingClientRect();
        if (this.checkShipPlacement(shipPos, length, orientation, boardPos)) {
            this.ships.push({ ship, coordinates });
        }
    }
}

export { Gameboard };
