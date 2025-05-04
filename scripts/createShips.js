class Ship {
    constructor(length) {
        this.length = length;
        this.hit = 0;
        this.sunk = false;
    }
    isHit() {
        this.hit++;
    }
    isSunk() {
        if (this.hit >= this.length) {
            this.sunk = true;
        }
    }
}

export { Ship };
