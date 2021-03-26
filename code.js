// Categories.
var animals = ["AMPHIBIANS","ANTEATER","BEAR","CAT","DINOSAUR","DOG","FISH","FROG","HIPPOPOTAMUS","HORSE","GIRAFFE","KANGAROO","KOALA","KOMODO DRAGON","LION","MAGPIE","MEERKAT","MONKEY","MOUSE","PANDA","POLAR BEAR","RAT","REPTILE","SHARK","SNAIL","SQUIRREL","TIGER","TURTLE","WOLF","ZEBRA",];
var food = ["APPLE","BACON","BANANA","BREAD","BURGER","CHEESE","EGGS","ICE CREAM","PASTA","PEANUTS","PEANUT BUTTER","PIZZA","RICE","SALAD","SANDWICH","SOUP","VEGEMITE",];
var sports = ["ARCHERY","BASEBALL","BASKETBALL","BOXING","CYCLING","CRICKET","DIVING","FENCING","FOOTBALL","GLADIATOR FIGHTING","HANDBALL","HOCKEY","JUDO","KARATE","ROWING","RUGBY","SAILING","SHOOTING","SKATEBOARDING","SURFING","SWIMMING","TENNIS","VOLLEYBALL","WEIGHTLIFTING",];

// Images
var currentImage = ["./Images/0.png","./Images/1.png","./Images/2.png","./Images/3.png","./Images/4.png","./Images/5.png","./Images/6.png","./Images/7.png","./Images/8.png","./Images/9.png","./Images/10.png",];
var imageValue = 0;

// Stores lines and letters to be displayed.
var linesList = [ ];

// Stores lives and incorrect guesses.
var failure = 1;
var lives = 10;

// Stores stuff related to winning.
var guessCounter = 0;
var spaces = 0;
var streak = 0;

// High score stuff.
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const highScoresList = document.getElementById("highScoresList");

// This shows a prompt so we can get the username for the leaderboard.
let firstUsername = prompt("Please enter a name");
if (firstUsername == 0) {
    firstUsername = "Username";
}
console.log(firstUsername);
localStorage.setItem("highScores", JSON.stringify(highScores));
document.getElementById("nameArea").value = firstUsername;
var username = document.getElementById("nameArea").value;

function updateName() {
    username = document.getElementById("nameArea").value;
}

function saveHighScore() {
    const score = {
        score: streak,
        username: username.toUpperCase(),
    }

    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    
    loadHighScores();
}

function loadHighScores() {
    const highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = highScores.map(score => {
        return `<li class="high-score">${score.username} - ${score.score}</li>`;
    })
    .join("");
}

// This section here is designed to create a button for each letter in the alphabet.
// The way this is done is by creating a dictionary (var alphabet) that stores each letter.
// Then for each letter in the dictionary a button is created and then appended into the document.
// This is easier then creating a button manually for each letter and doesn't clutter the HTML code.
var alphabet = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
];

const buttons = document.querySelector("#buttons");

function createButtons() {
    for (let x of alphabet) {
        let button = document.createElement("button");
        button.textContent = x[0];
        button.setAttribute("id", x[0]);
        buttons.appendChild(button);
    }
}

// This is the part where the category is chosen.
// This is done by picking a random string from the categories dictionary.
// From this we can yoink the result and insert it into the HTML code to be shown when the page is loaded.

var categories = [
    "Animals",
    "Food",
    "Sports",
];

let category = document.querySelector("#category");
var chosenCategory = categories[Math.floor(Math.random()*categories.length)];

function chooseCategory() {
    chosenCategory = categories[Math.floor(Math.random()*categories.length)];
    category.innerHTML = chosenCategory;
}

// In this area a word is randomly chosen based on the category selected in the part above.
// From this we call upon a function (located next section) to draw a line for each character in the string.

var chosenWord = 0;

function chooseWord() {
    if (chosenCategory == "Animals") {
        chosenWord = animals[Math.floor(Math.random()*animals.length)];
        console.log(chosenWord);
        drawLines();
    }
    else if (chosenCategory == "Food") {
        chosenWord = food[Math.floor(Math.random()*food.length)];
        console.log(chosenWord);
        drawLines();
    }
    else if (chosenCategory == "Sports") {
        chosenWord = sports[Math.floor(Math.random()*sports.length)];
        console.log(chosenWord);
        drawLines();
    }
}

// The goal of this function is to get the length of the word and turn it into lines.
// If there is a space then we just skip it and create a space.

function drawLines() {
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === " "){
            linesList.push(" ");
            spaces = spaces + 1;
        }
        else {
            linesList.push("ˍ");

        }
    }
    var connectedLines = linesList.join("");
    document.getElementById("word").innerHTML = connectedLines;
    guessCounter = chosenWord.length - spaces;
    spaces = 0;
    console.log(guessCounter);
}

// This was a pain to make.
// However, it finally works.
// It does this by creating an onlick function for each button created earlier.
// From this we extract a letter based on what the button clicked represents.
// Then we create a loop that checks to see if there are any matches between the guessed letter and the word.
// If there is we replace the line with the actual letter in the HTML.
// Otherwise we take a life away and update the image.
// Now if we win we increase the plyer win streak.

buttons.onclick = function(event) {
    var letter = event.target.innerHTML;
    if (event.target.nodeName == "BUTTON") {
        event.target.disabled = true;
        event.target.setAttribute("class", "disabled");
        if (lives > 0) {
            if (guessCounter > 0) {
                for (let i = 0; i < chosenWord.length; i++) {
                    if (chosenWord.charAt([i]) === letter) {
                        linesList[i] = letter;
                        var connectedLines = linesList.join("");
                        document.getElementById("word").innerHTML = connectedLines;
                        guessCounter = guessCounter - 1;
                        failure = 0;
                    }
                }
                if (guessCounter === 0) {
                    streak = streak + 1;
                    document.getElementById("score").innerHTML = "🔥 " + streak;
                    document.getElementById("word").innerHTML = "";
                    let word = document.querySelector("#word") 
                    let button = document.createElement("button");
                    button.textContent = "New Word";
                    button.className = "buttonRestart";
                    button.onclick = function() {restart()};
                    word.appendChild(button);
                }
                else if (failure === 1) {
                    lives = lives - 1;
                    document.getElementById("lives").innerHTML = "❤️ " + lives;
                    imageValue = imageValue + 1;
                    document.getElementById("hangmanImage").src = currentImage[imageValue];
                }
                failure = 1;
            }
        }
    }
    if (lives === 0) {
        document.getElementById("lives").innerHTML = "💀 " + lives;
        saveHighScore();
        streak = 0;
        document.getElementById("score").innerHTML = "🔥 " + streak;
        document.getElementById("word").innerHTML = "";
        let button = document.createElement("button");
        button.textContent = "Retry";
        button.className = "buttonRestart";
        button.onclick = function() {restart()};
        word.appendChild(button);
    }
}

// This function here restarts the game by resetting the lives back to 10.
// Then it removes the buttons and letters.
// Finally it runs all the functions again.

function restart() {
    lives = 10;
    document.getElementById("lives").innerHTML = "❤️ " + lives;
    buttons.innerHTML = "";
    linesList.length = 0;
    imageValue = 0;
    document.getElementById("hangmanImage").src = currentImage[imageValue];
    createButtons();
    chooseCategory();
    chooseWord();
}

// We chuck the functions at the end so all the code runs through fully when you first start.
// I just did this so it is cleaner then being randomly chucked in.
// But it is just to run it when the page is first loaded.

createButtons();
chooseCategory();
chooseWord();
loadHighScores();
