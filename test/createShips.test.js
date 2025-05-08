import { Ship } from "../scripts/createShips.js";

let ship;

beforeEach(() => {
    ship = new Ship(3);
    ship.place(["1,1", "1,2", "1,3"]);
});

test("Is ship hit", () => {
    const hit = ship.isHit("1,2");
    console.log(hit);
    expect(hit).toBe(true);
    expect(ship.hits).toBe(1);
});

test("Is ship not sunk", () => {
    ship.isHit("1,1");
    console.log(ship.isSunk());
    expect(ship.isSunk()).toBe(false);
});

test("Is ship sunk", () => {
    ship.isHit("1,1");
    ship.isHit("1,2");
    ship.isHit("1,3");
    console.log(ship.isSunk());
    expect(ship.isSunk()).toBe(true);
});
