import { addPlayers } from "../utils/addPlayers.js";

let dotsCont = document.querySelector(".dots-cont");
let dialog = document.querySelector(".dialog");
let startGameBtn = document.querySelector(".start-game-btn");
let gamePlayOption = document.querySelector(".game-play-option");
let firstPlayer = document.querySelector(".first-player-name");
let secondPlayerLabel = document.querySelector(".second-player-label");
let secondPlayer = document.querySelector(".second-player-name");
let playersName = document.querySelectorAll(".players-name");
let errorMsg = document.querySelector(".error-msg");
let gameboardPage = document.querySelector(".gameboard-page");

let counter = 0;
let playOption = null;
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
    firstPlayer.value = "";
    firstPlayer.focus();
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
            let player1 = firstPlayer.value;
            let player2 = "AI";
            if (twoPlayers) {
                player2 = secondPlayer.value;
            }
            let players = addPlayers(player1, player2);
            if (!Object.keys(players).length) {
                errorMsg.innerHTML = "Enter different names";
            } else {
                gameboardPage.href = "pages/gameboard.html";
            }
        }
    });
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
