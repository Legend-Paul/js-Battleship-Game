class Ship {
    constructor(length) {
        this.length = length;
        this.hit = 0;
    }
    isHit() {
        return this.hit++;
    }
    isSunk() {
        return this.hit >= this.length;
    }
}

export { Ship };
