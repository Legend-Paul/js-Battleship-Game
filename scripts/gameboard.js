class Gameboard {
    placeShip(shipPos, shipLength, boardPos) {
        let shipLeft = shipPos.x;
        let shipTop = shipPos.y;
        let shipRight = shipPos.x + shipPos.width * shipLength;
        let shipBottom = shipPos.y + shipPos.height;

        let boardLeft = boardPos.x;
        let boardTop = boardPos.y;
        let boardRight = boardPos.x + boardPos.width;
        let boardBottom = boardPos.y + boardPos.height;
        if (
            shipLeft < boardLeft ||
            shipTop < boardTop ||
            shipBottom > boardBottom ||
            shipRight > boardRight
        ) {
            return false;
        }
        return true;
    }
}

export { Gameboard };
