let dotsCont = document.querySelector(".dots-cont");

function waitPrevt(count, time) {
    return new Promise((resolve, reject) => {
        setTimeout((count) => {
            resolve((count = 0) => {
                let childrenNumber = dotsCont.childElementCount;
                let currentSibling = dotsCont.children[count];
                let previousSibling = currentSibling.previousElementSibling;
                if (!previousSibling) {
                    previousSibling = dotsCont.children[childrenNumber - 1];
                }
                let previousPedding = document.querySelector(".pedding-dot");

                if (previousPedding) {
                    previousPedding.classList.remove("pedding-dot");
                }
                previousSibling.classList.add("pedding-dot");
            });
        }, time);
    });
}
function waitNext(count, time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve((count = 0) => {
                let currentSibling = dotsCont.children[count];
                let nextSibling = currentSibling.nextElementSibling;
                if (!nextSibling) {
                    nextSibling = dotsCont[0];
                }

                let previousActive = document.querySelector(".active-dot");
                if (previousActive) {
                    previousActive.classList.remove("active-dot");
                }

                currentSibling.classList.add("active-dot");
            });
        }, time);
    });
}

function createLoadingDots() {
    let childrenNumber = dotsCont.childElementCount;
    let currentSibling = dotsCont.children[count];
    let nextSibling = currentSibling.nextElementSibling;
    let previousSibling = currentSibling.previousElementSibling;
    if (!nextSibling) {
        nextSibling = dotsCont[0];
    }
    if (!previousSibling) {
        previousSibling = dotsCont.children[childrenNumber - 1];
    }
    let previousActive = document.querySelector(".active-dot");
    let previousPedding = document.querySelector(".pedding-dot");
    console.log(previousActive, previousPedding);
    if (previousActive) {
        previousActive.classList.remove("active-dot");
    }
    if (previousPedding) {
        previousPedding.classList.remove("pedding-dot");
    }
    currentSibling.classList.add("active-dot");
    previousSibling.classList.add("pedding-dot");
}

async function loadDots() {
    let childrenNumber = dotsCont.childElementCount;
    let count = 0;

    while (count < childrenNumber) {
        // let dots = await waitPromise(count);
        // dots();
        console.log(count);
        count++;
    }
    let dots2 = await waitPrevt(1, 1000);
    dots2();
    let dots1 = await waitNext(0, 500);
    dots1();
}
loadDots();
