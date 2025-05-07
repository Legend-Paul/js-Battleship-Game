function addPlayers(firstPlayer, secondPlayer) {
    let players = {};
    let player1 = firstPlayer;
    let player2 = secondPlayer;

    if (player1.toLowerCase() !== player2.toLowerCase()) {
        players.player1 = player1;
        players.player2 = player2;
    }
    return players;
}

export { addPlayers };
