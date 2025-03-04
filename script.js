
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
    drawAsteroids();
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

    if (endPosition[0] < -10 || endPosition[0] > canvasSize[0] + 10 || endPosition[1] < -10 || endPosition[1] > canvasSize[1] + 10) {
        gameOver();
    }

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

    for (let j = 0; j < asteroids.length; j++) {
        
        if (asteroids[j][5] && isPointInPolygon(startPosition, asteroids[j][5]))
        {
            missiles.splice(i, 1);
            if (asteroids[j][2] > 15) {
                splitAsteroid(asteroids[j]);
            }
            asteroids.splice(j, 1);
            score++;
            scoreSpan.innerHTML = score;
            break;
        }
    }

    missile[0] = endPosition;

    if (endPosition[0] < 0 || endPosition[0] > canvasSize[0] || endPosition[1] < 0 || endPosition[1] > canvasSize[1]) {
        missiles.splice(i, 1);
    }
}

function isPointInPolygon(point, polygon) {
    let [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let [xi, yi] = polygon[i];
        let [xj, yj] = polygon[j];

        let intersect = ((yi > y) !== (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function fireMissile() {
    if (missileTimerCount || missiles.length > 4) return;
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

    const point0 = [asteroid[0], asteroid[1]];
    const point1 = [asteroid[0] + asteroid[2], asteroid[1] - asteroid[2] * 0.3];
    const point2 = [asteroid[0] + asteroid[2] * 1.3, asteroid[1] + asteroid[2] * 0.3];
    const point3 = [asteroid[0] + asteroid[2] * 0.7, asteroid[1] + asteroid[2] * 1.3];
    const point4 = [asteroid[0], asteroid[1] + asteroid[2]];
    
    ctx.beginPath();
    ctx.moveTo(point0[0],point0[1]);
    ctx.lineTo(point1[0],point1[1]);
    ctx.lineTo(point2[0],point2[1]);
    ctx.lineTo(point3[0],point3[1]);
    ctx.lineTo(point4[0],point4[1]);
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = shipColour;
    ctx.stroke();

    // move the astroid towards the location of the ship
    const direction = asteroid[3];
    const speed = asteroid[4];
    asteroid[0] += Math.cos(direction) * speed;
    asteroid[1] += Math.sin(direction) * speed;
    asteroid[5] = [point2, point3, point4, point0, point1];

}

function splitAsteroid(asteroid) {

    const size = 15;
    const x = asteroid[0];
    const y = asteroid[1];
    const direction = asteroid[3];
    const speed = asteroid[4];   
 
    asteroids.push([x, y, size, direction*1.2, speed]);
    asteroids.push([x, y, size, direction*0.8, speed]);
}

function addAsteroid() {
    const y = Math.floor(Math.random() * canvasSize[1]);
    const x = y > canvasSize[1]/2 ? 0 : canvasSize[0];
    
    const size = 30;
    const direction = Math.atan2(shipPosition[1] - y, shipPosition[0] - x);
    const speed = Math.floor(Math.random() * 6) + 3;

    asteroids.push([x, y, size, direction, speed]);
}

function startGame() {
    resetCanvas();
    startTimers();
    addAsteroid();
}

function startTimers() {
    mainTimer = setInterval(gameLoop, 100);
    asteroidTimer = setInterval(asteroidLoop, 5000);
    keyPressTimer = setInterval(inputLoop, 50);
}

function stopGame() {
    clearInterval(keyPressTimer);
    clearInterval(mainTimer);
    clearInterval(asteroidTimer);
}

function gameOver() {
    stopGame();
    alert("Game Over");
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