export class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.positions = []; // Array of cell coordinates (e.g., ["3,2", "3,3", ...])
    }

    place(positions) {
        this.positions = positions;
        console.log(this.positions);
        console.log(this.positions.length);
    }

    isHit(position) {
        if (this.positions.includes(position)) {
            this.hits++;
            return true;
        }
        return false;
    }

    isSunk() {
        return this.hits >= this.length;
    }
}
