let dotsCont = document.querySelector(".dots-cont");
let counter = 0;

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

export { loadDots };
