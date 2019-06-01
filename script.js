var play = document.getElementById("play");
var sc = document.getElementById('scorecard');
var hs = document.getElementById('highScore');
var name;
var hSc;
var hS;
var score = 0;
if (localStorage.hscore && localStorage.name && localStorage.hsc) {
    hS = localStorage.hscore;
    name = prompt("Please enter your name to start a new game :)", localStorage.name);
    localStorage.name = name;
    hSc = localStorage.hsc;
} else {
    hS = "0";
    name = prompt("Please enter your name to start a new game :)");
    localStorage.name = name;
    hSc = name;
}
var speed = parseInt(prompt("Enter snake speed from 1 to 10(more speed means increasing difficulty) ;)",
    "5"));
while (speed > 10 || speed < 1) {
    speed = parseInt(prompt(":( You did not enter correct speed. Please enter snake speed from 1 to 10(more speed means increasing difficulty)",
        "5"));
}
var welcome = document.getElementById('welcome');
welcome.innerHTML = "WELCOME " + name;
canvas = document.getElementById('board');
pen = canvas.getContext('2d');
w = canvas.width;
h = canvas.height;
var gameover = false;
food = {
    colors: ["tan", "bisque", "violet", "brown", "green", "salmon", "red", "blue"],
    createFood: function () {
        foodx = Math.round(Math.random() * (w - 5) / 10);
        foody = Math.round(Math.random() * (h - 5) / 10);
    },
    drawFood: function () {
        pen.fillStyle = this.colors[Math.round((this.colors.length) * Math.random())];
        pen.fillRect(foodx * 10, foody * 10, 5, 5);
    }
}
food.createFood();
snake = {
    initial_length: 4,
    color: "yellow",
    cells: [],
    direction: "Right",
    createSnake: function () {
        for (let i = 0; i < this.initial_length; i++) {
            this.cells.push({x: i, y: 0});
        }
    },
    drawSnake: function () {
        for (let i = 0; i < this.cells.length; i++) {
            pen.fillStyle = this.color;
            pen.strokeStyle = "darkslateblue";
            pen.lineWidth = "2";
            pen.strokeRect(this.cells[i].x * 5, this.cells[i].y * 5, 5, 5);
            pen.fillRect(this.cells[i].x * 5, this.cells[i].y * 5, 5, 5);
        }
    },
    updateSnake: function () {
        Headx = this.cells[this.cells.length - 1].x;
        Heady = this.cells[this.cells.length - 1].y;
        if (Headx == foodx * 2 && Heady == foody * 2) {
            food.createFood();
            score++;
        } else {
            this.cells.shift();
        }
        if (this.direction == "Down") {
            nexty = Heady + 1;
        } else if (this.direction == "Right") {
            nextx = Headx + 1;
            nexty = Heady;
        } else if (this.direction == "Left") {
            nextx = Headx - 1;
        } else {
            nexty = Heady - 1;
        }
        this.cells.push({x: nextx, y: nexty});
        var last_x = Math.round(w / 5);
        var last_y = Math.round(h / 5);
        if (Heady < 0 || Headx < 0 || Heady > last_y || Headx > last_x) {
            alert("Game over :(, the snake has touched the boundary. Hard Refresh the page to start a new game :).");
            gameover = true;
        }
        for (i = 0; i < this.cells.length - 2; i++) {
            if ((Headx == this.cells[i].x && Heady == this.cells[i].y)) {
                alert("Game over :(, the snake has eaten itself. Hard Refresh the page to start a new game :).");
                gameover = true;
            }
        }
    }
}
snake.createSnake();

function keydown(event) {
    if (event.key == 'ArrowDown' || event.key == 's' || event.key == 'S') {
        snake.direction = "Down";
    } else if (event.key == 'ArrowRight' || event.key == 'd' || event.key == 'D') {
        snake.direction = "Right";
    } else if (event.key == 'ArrowLeft' || event.key == 'a' || event.key == 'A') {
        snake.direction = 'Left';
    } else if (event.key == 'ArrowUp' || event.key == 'w' || event.key == 'W') {
        snake.direction = "Up";
    } else {
        //do nothing
    }
}

document.addEventListener('keydown', keydown);

function draw() {
    pen.clearRect(0, 0, w, h);
    snake.drawSnake();
    food.drawFood();

}

function update() {
    snake.updateSnake();
    if (score > parseInt(hS)) {
        localStorage.hscore = score;
        localStorage.hsc = name;
    }
    sc.style.fontFamily = "Cooper Black";
    sc.style.fontSize = "20pt";
    hs.style.fontFamily = "Cooper Black";
    hs.style.fontSize = "20pt";
    sc.innerHTML = "<b>Your Score : </b>" + score;
    hs.innerHTML = "<b>High Score : </b>" + hS + " by " + hSc;
}

function gameLoop() {
    draw();
    update();
    if (gameover) {
        clearInterval(cI);
    }
}

var restart = document.getElementById('restart');
restart.onclick = () => {
    location.reload();
}

var cI = setInterval(gameLoop, 300 / speed);