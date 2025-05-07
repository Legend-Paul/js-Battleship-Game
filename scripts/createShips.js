class Ship {
    constructor(length) {
        this.length = length;
        this.hit = 0;
        this.sunk = false;
    }
    isHit() {
        return this.hit++;
    }
    isSunk() {
        if (this.hit >= this.length) {
            this.sunk = true;
        }
        return this.sunk;
    }
}
export { Ship };
