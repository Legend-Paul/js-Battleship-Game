import { Ship } from "./createShips.js";

export class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.ships = [];
        this.attacks = new Set(); // All attack attempts
        this.isHits = new Set(); // Successful isHits
        this.misses = new Set(); // Missed shots
        this.occupied = new Set(); // All coordinates occupied by ships
    }

    placeShip(startRow, startCol, length, isHorizontal = true) {
        const positions = [];

        for (let i = 0; i < length; i++) {
            const row = isHorizontal ? startRow : startRow + i;
            const col = isHorizontal ? startCol + i : startCol;
            const key = `${row},${col}`;

            if (
                row >= this.size ||
                col >= this.size ||
                this.occupied.has(key)
            ) {
                return false; // Invalid position
            }

            positions.push(key);
        }

        const ship = new Ship(length);
        ship.place(positions);
        positions.forEach((pos) => this.occupied.add(pos));
        this.ships.push(ship);
        return true;
    }

    receiveAttack(row, col) {
        const key = `${row},${col}`;
        if (this.attacks.has(key)) {
            return { valid: false, alreadyAttacked: true };
        }

        this.attacks.add(key);

        for (const ship of this.ships) {
            if (ship.isHit(key)) {
                this.isHits.add(key);
                return { valid: true, isHit: true, sunk: ship.isSunk() };
            }
        }

        this.misses.add(key);
        return { valid: true, isHit: false };
    }

    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
