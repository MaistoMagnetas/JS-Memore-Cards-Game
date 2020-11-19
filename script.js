const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const frontCards = document.querySelectorAll(".card");
const backCards = document.querySelectorAll(".back");

let isRunning = false;
let movesCount = 0;
let waitMore = 0;
let matched = false;
let flippedItem = [];
let interval;
let startTime;
let images = ["angular", "bootstrap", "css",
            "jquery", "js", "node", "react", "vue"];
images = images.concat(images);

frontCards.forEach(frontCard => {
    frontCard.addEventListener("click", (event) => {
        if (!isRunning){
            startGame();    
        }
        if (flippedItem.length === 1){
            if (flippedItem[0] !== event.currentTarget){
                flip(event);
            }
        }
        else if(flippedItem.length < 2){
            flip(event);
        }
    });
});

function flip(event){
    const element = event.currentTarget;
    if (!element.classList.contains("matched"))
    {
        element.style.transform = "rotateY(180deg)";
        flippedItem.push(element);
        updateMovesCount();
        matched = isMatch();
        if (matched){
            markAsMatched();
            if (allMatched()){
                clearInterval(interval);
            }
            else{
                waitMore = 0;
                flippedItem = [];
            }   
        }
    }
}

function allMatched(){
    const cards = document.querySelectorAll(".card");
    if (cards.length > 0){
        for (i = 0; i < cards.length; i++){
            if (!cards[i].classList.contains("matched"))
            {
                return false;
            }
        }
        return true;
    }
   return false;
}

function startGame(){
    startBtn.innerText = "Restart";
    clearInterval(interval);
    unflipItems();
    images = shuffleImages(images);
    isRunning = true;
    flippedItem = [];
    startTime = new Date();
    timeEl.innerHTML = `Time Elapsed: 00:00`;
    movesCount = 0;  
    movesEl.innerText = "Moves: " + movesCount;
    setImagesToCards();
    interval = setInterval(function () {
        if (flippedItem.length == 2){
            if (matched){
                flippedItem = [];
                matched = false;
            }
            else{
                waitMore++;
                if (waitMore > 1){
                    unflipItems();
                    flippedItem = [];
                    waitMore = 0;
                }
            }
        }
        const millis = new Date() - startTime;
        timeEl.innerHTML = `Time Elapsed: ${getTime(millis)}`;
    }, 1000); 
}

function isMatch(){
    if (flippedItem.length == 2){
        const image1 = flippedItem[0].querySelector("#image").alt;
        const image2 = flippedItem[1].querySelector("#image").alt;
        if (image1 === image2){
            return true;
        }
    }
    return false;
}

function markAsMatched(){
    flippedItem.forEach(item => {
       item.classList.add("matched");
    });
}

function unflipItems(){
    flippedItem.forEach(item => {
        unflipElement(item);
    });
}

function unflipElement(element){
    element.style.transform = "rotateY(0deg)";
}

startBtn.addEventListener("click", () => {
    frontCards.forEach(card => {
        card.style.transform = "rotateY(0deg)";
    });
    startGame();
});

function getTime(millis){
    var mins = ~~(millis / 60000);
    var secs = ((millis % 60000) / 1000).toFixed(0);
    var ret = "";
    ret += mins + ":" + (secs < 10 ? "0" : "");
    ret += secs;
    return ret;
}

function updateMovesCount(){
    movesCount++;
    movesEl.innerText = "Moves: " + movesCount;
}

function setImagesToCards(){
    for(i = 0; i < backCards.length; i++){
        backCards[i].innerHTML = `
        <img id="image" src="images/${images[i]}.png" alt="${images[i]}">
    `;
    }
}

function shuffleImages(images){
    return images.sort(() => Math.random() - 0.5);
}
