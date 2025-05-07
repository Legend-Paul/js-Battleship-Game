import { Gameboard } from "../scripts/gameboard.js";

describe("left limit", () => {
    test("ship over grid left limit", () => {
        let shipPos = { x: 10, y: 15, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(false);
    });
    test("ship within grid left limit", () => {
        let shipPos = { x: 20, y: 15, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(true);
    });
});

describe("top limit", () => {
    test("ship above grid top limit", () => {
        let shipPos = { x: 20, y: 10, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(false);
    });
    test("ship within grid top limit", () => {
        let shipPos = { x: 20, y: 150, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(true);
    });
});

describe("right limit", () => {
    test("Horizontal ship over grid right limit", () => {
        let shipPos = { x: 250, y: 150, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(false);
    });
    test("Horizontal ship within grid right limit", () => {
        let shipPos = { x: 20, y: 15, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(true);
    });
    test("Vertical ship over grid right limit", () => {
        let shipPos = { x: 390, y: 10, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();

        expect(
            gameboard.checkShipPlacement(shipPos, 5, "vertical", boardPos)
        ).toEqual(false);
    });
    test("Vertical ship within grid right limit", () => {
        let shipPos = { x: 250, y: 20, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "vertical", boardPos)
        ).toBe(true);
    });
});

describe("bottom limit", () => {
    test("Horizontal ship below grid bottom limit", () => {
        let shipPos = { x: 30, y: 390, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(false);
    });
    test("Horizontal ship within grid bottom limit", () => {
        let shipPos = { x: 20, y: 15, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "horizontal", boardPos)
        ).toBe(true);
    });
    test("Vertical ship below grid bottom limit", () => {
        let shipPos = { x: 20, y: 250, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "vertical", boardPos)
        ).toBe(false);
    });
    test("Vertical ship within grid bottom limit", () => {
        let shipPos = { x: 20, y: 15, width: 40, height: 40 };
        let boardPos = { x: 15, y: 15, width: 400, height: 400 };
        let gameboard = new Gameboard();
        expect(
            gameboard.checkShipPlacement(shipPos, 5, "vertical", boardPos)
        ).toBe(true);
    });
});
