
var mainTimer;
var asteroidTimer;
var keyPressTimer;

var keyMap = [];

var shipColour = "#FFF";
const backgroundColour = "#000";
const canvasSize = [800,600];
const startDirection = 150;
const angleOffset = 120;

var shipDirection = startDirection;
var shipHeading = shipDirection
var shipSpeed = 0;
var shipPosition = [canvasSize[0]/2, canvasSize[1]/2];

var missiles = [];
const missleDelay = 5;
var missileTimerCount = 0;

var asteroids = [];

var score = 0;
var doc = document.getElementById("main");              // canvas to draw on
var options = document.getElementById("options");       // options section
var scoreSpan = document.getElementById("score");       // score span to update current score
var ctx = doc.getContext("2d");                         // canvas context

function gameLoop() {
    drawShip();
    drawMissiles();
}

function drawShip() {
    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvasSize[0], canvasSize[1]);
    updateShip(shipPosition, shipDirection, shipHeading, shipColour);
}

function updateShip(position, direction, heading, color) {
    
    const endPosition = [
        position[0] + Math.cos((heading + angleOffset) * Math.PI / 180) * shipSpeed,
        position[1] + Math.sin((heading + angleOffset) * Math.PI / 180) * shipSpeed
    ];

    ctx.beginPath();

    ctx.moveTo(position[0], position[1]);
    ctx.lineTo(
        position[0] + Math.cos(direction * Math.PI / 180) * 20,
        position[1] + Math.sin(direction * Math.PI / 180) * 20
    )
    ctx.lineTo(
        position[0] + Math.cos((direction + angleOffset) * Math.PI / 180) * 20,
        position[1] + Math.sin((direction + angleOffset) * Math.PI / 180) * 20
    )
    ctx.lineTo(
        position[0] + Math.cos((direction - angleOffset) * Math.PI / 180) * 20,
        position[1] + Math.sin((direction - angleOffset) * Math.PI / 180) * 20
    )
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    shipPosition = endPosition;

}

function drawMissiles() {
    if (missileTimerCount > 0) {
        missileTimerCount--;
    }

    for (let i = 0; i < missiles.length; i++) {
        updateMissiles(missiles[i], i);
    }
}

function updateMissiles(missile, i) {

    const position = missile[0];
    const direction = missile[1];
    const color = missile[2];

    const startPosition = [
        position[0] + Math.cos((direction + angleOffset) * Math.PI / 180) * 20,
        position[1] + Math.sin((direction + angleOffset) * Math.PI / 180) * 20
    ];

    const endPosition = [
        startPosition[0] + Math.cos((direction + angleOffset) * Math.PI / 180) * 10,
        startPosition[1] + Math.sin((direction + angleOffset) * Math.PI / 180) * 10
    ];

    ctx.beginPath();
    ctx.moveTo(startPosition[0], startPosition[1]);
    ctx.lineTo(endPosition[0], endPosition[1])
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    missile[0] = endPosition;

    if (endPosition[0] < 0 || endPosition[0] > canvasSize[0] || endPosition[1] < 0 || endPosition[1] > canvasSize[1]) {
        missiles.splice(i, 1);
    }
}

function fireMissile() {
    if (missileTimerCount || missiles.length > 2) return;
    missiles.push([shipPosition, shipDirection, shipColour]);
    missileTimerCount = missleDelay;
}

function asteroidLoop() {
    console.log(asteroids);
    addAsteroid();
}

function drawAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        updateAsteroids(asteroids[i], i);
    }
}
function updateAsteroids(asteroid, i) {

    if (asteroid[0] < -10 || asteroid[0] > canvasSize[0] + 10 || asteroid[1] < -10 || asteroid[1] > canvasSize[1] + 10) {
        asteroids.splice(i, 1);
    }
    
    // const sides = Math.floor(Math.random() * 5) + 8;
    // const radius = Math.floor(Math.random() * 10) + 5;
    // ctx.beginPath();
    // ctx.moveTo(asteroid[0] + Math.cos(0 * Math.PI / 180) * radius, asteroid[1] + Math.sin(0 * Math.PI / 180) * radius);
    // for (let i = 1; i < sides; i++) {
    //     ctx.lineTo(asteroid[0] + Math.cos(i * 360 / sides * Math.PI / 180) * radius, asteroid[1] + Math.sin(i * 360 / sides * Math.PI / 180) * radius);
    // }
    // ctx.closePath();

    // ctx.lineWidth = 1;
    // ctx.strokeStyle = shipColour;
    // ctx.stroke();

}

function addAsteroid() {
    var x = Math.floor(Math.random() * canvasSize[0]);
    var y = Math.floor(Math.random() * canvasSize[1]);

    if (x > canvasSize[0] / 2) {
        x = -10;
    }
    if (y > canvasSize[1] / 2) {
        y = -10;
    }

    asteroids.push([x, y]);
}

function startGame() {
    resetCanvas();
    startTimers();
    addAsteroid();
}

function startTimers() {
    mainTimer = setInterval(gameLoop, 100);
    asteroidTimer = setInterval(asteroidLoop, 10000);
    keyPressTimer = setInterval(inputLoop, 50);
}

function stopGame() {
    clearInterval(keyPressTimer);
    clearInterval(mainTimer);
    clearInterval(asteroidTimer);
}

function inputLoop() {
    for (let i = 0; i < keyMap.length; i++) {
        keyPress(keyMap[i]);
    }
}

function keyPress(key) {

    switch (key) {
        case " ": fireMissile(); break
        case "ArrowUp": {
            shipSpeed++; 
            shipHeading = shipDirection;
            break;
        }
        case "ArrowDown": shipSpeed--; break;
        case "ArrowLeft": shipDirection -= 4; break;
        case "ArrowRight": shipDirection += 4; break;
    }

    if (shipSpeed > 5) {   
        shipSpeed = 5;
    } else if (shipSpeed < 0) {
        shipSpeed = 0;
    }

    if (shipDirection < 0) {
        shipDirection += 360;
    } else if (shipDirection > 360) {
        shipDirection -= 360;
    }
}


window.addEventListener("keydown", function (event) {   // keyboard event listner
    if (event.defaultPrevented) {
        return;
    }
    if (!keyMap.includes(event.key)) {
        keyMap.push(event.key);
    }
    event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {   // keyboard event listner
    if (event.defaultPrevented) {
        return;
    }
    if (keyMap.includes(event.key)) {
        keyMap.splice(keyMap.indexOf(event.key), 1);
    }
    event.preventDefault();
}, true);

function resetCanvas() {
    shipDirection = startDirection;
    shipHeading = startDirection;
    shipSpeed = 0;
    scoreSpan.innerHTML = score = 0;

    doc.width = canvasSize[0];
    doc.height = canvasSize[1];
    options.style.width = canvasSize[0];

    shipPosition[0] = canvasSize[0]/2;
    shipPosition[1] = canvasSize[1]/2;

    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvasSize[0], canvasSize[1]);
}