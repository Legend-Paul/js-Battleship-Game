import { Ship } from "../scripts/createShips.js";
let ship = new Ship(3);

test("Is ship hit", () => {
    ship.isHit();
    let hit = ship.hit;
    expect(hit).toBe(1);
});

test("Is ship not sunk", () => {
    ship.isHit();
    console.log(ship.isSunk());

    expect(ship.isSunk()).toBe(false);
});

test("Is ship sunk", () => {
    ship.isHit();
    ship.isHit();
    ship.isHit();
    ship.isHit();
    console.log(ship.isSunk());
    expect(ship.isSunk()).toBe(true);
});
