let dotsCont = document.querySelector(".dots-cont");
let dialog = document.querySelector(".dialog");
let startGameBtn = document.querySelector(".start-game-btn");
let gamePlayOption = document.querySelector(".game-play-option");
let firstPlayer = document.querySelector(".first-player-name");
let secondPlayerLabel = document.querySelector(".second-player-label");
let secondPlayer = document.querySelector(".second-player-name");
let playersName = document.querySelectorAll(".players-name");
let errorMsg = document.querySelector(".error-msg");

let counter = 0;
let playOption = null;
let players = {};
let twoPlayers = false;

function displayCurrentDot(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(addColorToCurrentDot());
        }, time);
    });
}

function displayNextDot(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(addColorToNextDot());
        }, time);
    });
}

function addColorToCurrentDot() {
    let currentSibling = dotsCont.children[counter];
    let previousPedding = document.querySelector(".pedding-dot");

    if (previousPedding) {
        previousPedding.classList.remove("pedding-dot");
    }
    currentSibling.classList.add("pedding-dot");
}

function addColorToNextDot() {
    let currentSibling = dotsCont.children[counter];
    let nextSibling = currentSibling.nextElementSibling;
    if (!nextSibling) {
        nextSibling = dotsCont.children[0];
    }
    let previousActive = document.querySelector(".active-dot");
    if (previousActive) {
        previousActive.classList.remove("active-dot");
    }

    nextSibling.classList.add("active-dot");
}

async function loadDots() {
    let childrenNumber = dotsCont.childElementCount * 3;
    let count = 0;

    while (count <= childrenNumber) {
        counter = count % 3;
        await displayCurrentDot(500);
        await displayNextDot(0);

        count++;
    }
}

let showDialog = () => {
    dialog.showModal();
};
setTimeout(showDialog, 6000);

function getPlayers() {
    gamePlayOption.addEventListener("change", (e) => {
        let firstPlayerTitle = document.querySelector(".first-player-label p");
        playOption = gamePlayOption.value;
        errorMsg.innerHTML = "";
        if (playOption === "2 players") {
            secondPlayerLabel.style.display = "grid";
            firstPlayerTitle.innerHTML = "First player name:";
            twoPlayers = true;
        } else {
            secondPlayerLabel.style.display = "none";
            firstPlayerTitle.innerHTML = "Player name:";
            twoPlayers = false;
        }
    });
}
getPlayers();
function startGame() {
    startGameBtn.addEventListener("click", (e) => {
        if (!firstPlayer.value || (twoPlayers && !secondPlayer.value)) {
            if (playOption === "2 players") {
                errorMsg.innerHTML = "Provide all players name";
            } else if (playOption === "AI") {
                errorMsg.innerHTML = "Provide player name";
            } else {
                errorMsg.innerHTML =
                    "Select play option or provide player name";
            }
        } else {
            addPlayers(firstPlayer, secondPlayer);
        }
    });
}
function addPlayers(firstPlayer, secondPlayer) {
    let player1 = firstPlayer.value.toLowerCase();
    let player2 = null;
    if (playOption == "2 players") {
        player2 = secondPlayer.value;
    } else {
        player2 = "AI";
    }

    if (player1.toLowerCase() !== player2.toLowerCase()) {
        players.player1 = player1;
        players.player2 = player2;
        return players;
    }
    errorMsg.innerHTML = "Enter different names";
}
function removeRedOutline() {
    playersName.forEach((player) => {
        player.addEventListener("focus", () => {
            errorMsg.innerHTML = "";
        });
    });
}
removeRedOutline();
startGame();

export { loadDots };
