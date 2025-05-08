import { Gameboard } from "../scripts/gameboard.js";

let gameboard;

beforeEach(() => {
    gameboard = new Gameboard(10);
});

describe("Gameboard class", () => {
    test("placeShip places a ship successfully", () => {
        const result = gameboard.placeShip(0, 0, 3, true);
        expect(result).toBe(true);
        expect(gameboard.ships.length).toBe(1);
        expect(gameboard.occupied.has("0,0")).toBe(true);
        expect(gameboard.occupied.has("0,1")).toBe(true);
        expect(gameboard.occupied.has("0,2")).toBe(true);
    });

    test("placeShip fails if the ship is out of bounds", () => {
        const result = gameboard.placeShip(0, 8, 3, true);
        expect(result).toBe(false);
        expect(gameboard.ships.length).toBe(0);
    });

    test("placeShip fails if the ship overlaps with another ship", () => {
        gameboard.placeShip(0, 0, 3, true);
        const result = gameboard.placeShip(0, 1, 3, true);
        expect(result).toBe(false);
        expect(gameboard.ships.length).toBe(1);
    });

    test("receiveAttack hits a ship", () => {
        gameboard.placeShip(0, 0, 3, true);
        const result = gameboard.receiveAttack(0, 1);
        expect(result).toEqual({ valid: true, isHit: true, sunk: false });
        expect(gameboard.isHits.has("0,1")).toBe(true);
    });

    test("receiveAttack misses when no ship is present", () => {
        gameboard.placeShip(0, 0, 3, true);
        const result = gameboard.receiveAttack(5, 5);
        expect(result).toEqual({ valid: true, isHit: false });
        expect(gameboard.misses.has("5,5")).toBe(true);
    });

    test("receiveAttack fails if the position was already attacked", () => {
        gameboard.placeShip(0, 0, 3, true);
        gameboard.receiveAttack(0, 1);
        const result = gameboard.receiveAttack(0, 1);
        expect(result).toEqual({ valid: false, alreadyAttacked: true });
    });

    test("allShipsSunk returns false if not all ships are sunk", () => {
        gameboard.placeShip(0, 0, 3, true);
        gameboard.receiveAttack(0, 0);
        expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("allShipsSunk returns true if all ships are sunk", () => {
        gameboard.placeShip(0, 0, 3, true);
        gameboard.receiveAttack(0, 0);
        gameboard.receiveAttack(0, 1);
        gameboard.receiveAttack(0, 2);
        expect(gameboard.allShipsSunk()).toBe(true);
    });
});
