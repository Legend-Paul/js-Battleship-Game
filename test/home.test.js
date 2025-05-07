const { addPlayers } = require("../utils/addPlayers");

describe("addPlayers function", () => {
    test("Adds 2 players with diffrent name", () => {
        let players = addPlayers("p1", "p2");
        expect(players).toEqual({ player1: "p1", player2: "p2" });
    });
    test("Does not add 2 players with same name", () => {
        let players = addPlayers("p1", "p1");
        console.log(players);
        expect(players).toEqual({});
    });
    test("Adds player with AI", () => {
        let players = addPlayers("p1", "AI");
        expect(players).toEqual({ player1: "p1", player2: "AI" });
    });
    test("Does not add player with same name as AI", () => {
        let players = addPlayers("ai", "AI");
        console.log(players);
        expect(players).toEqual({});
    });
});
