
var timer;
let canvasSize = [800,600];                             // size of playing field
var shipDirection = 359;
var shipSpeed = 0;
var shipPosition = [canvasSize[0]/2, canvasSize[1]/2];

var bullets = [];

var offset = 120;

var score = 0;
var doc = document.getElementById("main");              // canvas to draw on
var options = document.getElementById("options");       // options section
var scoreSpan = document.getElementById("score");       // score span to update current score
var ctx = doc.getContext("2d");                         // canvas context

var shipColour = "#FFF";
const backgroundColour = "#000";

function drawShip() {
    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvasSize[0], canvasSize[1]);
    updateShip(shipPosition, shipDirection, shipColour);
}

function updateShip(position, direction, color) {
    
    const endPosition = [
        position[0] + Math.cos((direction + offset) * Math.PI / 180) * shipSpeed,
        position[1] + Math.sin((direction + offset) * Math.PI / 180) * shipSpeed
    ];

    ctx.beginPath();

    ctx.moveTo(position[0], position[1]);
    ctx.lineTo(
        position[0] + Math.cos(direction * Math.PI / 180) * 20,
        position[1] + Math.sin(direction * Math.PI / 180) * 20
    )
    ctx.lineTo(
        position[0] + Math.cos((direction + offset) * Math.PI / 180) * 20,
        position[1] + Math.sin((direction + offset) * Math.PI / 180) * 20
    )
    ctx.lineTo(
        position[0] + Math.cos((direction - offset) * Math.PI / 180) * 20,
        position[1] + Math.sin((direction - offset) * Math.PI / 180) * 20
    )
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    shipPosition = endPosition;

}

function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        updateBullet(bullets[i], i);
    }
}

function updateBullet(bullet, i) {

    const position = bullet[0];
    const direction = bullet[1];
    const color = bullet[2];

    const startPosition = [
        position[0] + Math.cos((direction + offset) * Math.PI / 180) * 20,
        position[1] + Math.sin((direction + offset) * Math.PI / 180) * 20
    ];

    const endPosition = [
        startPosition[0] + Math.cos((direction + offset) * Math.PI / 180) * 10,
        startPosition[1] + Math.sin((direction + offset) * Math.PI / 180) * 10
    ];

    ctx.beginPath();
    ctx.moveTo(startPosition[0], startPosition[1]);
    ctx.lineTo(endPosition[0], endPosition[1])
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    bullet[0] = endPosition;

    if (endPosition[0] < 0 || endPosition[0] > canvasSize[0] || endPosition[1] < 0 || endPosition[1] > canvasSize[1]) {
        bullets.splice(i, 1);
    }
}

function fireBullet() {
    bullets.push([shipPosition, shipDirection, shipColour]);
}

function gameLoop() {
    drawShip();
    drawBullets();
}

function startGame() {
    resetCanvas();
    timer = setInterval(gameLoop, 100);
}

function stopGame() {
    clearInterval(timer);
}

function resetCanvas() {
    shipDirection = 0;
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

function checkKeyMap() {
    console.log(keyMap);
    for (let i = 0; i < keyMap.length; i++) {
        keyPress(keyMap[i]);
    }
}

function keyPress(key) {

    switch (key) {
        case " ": fireBullet(); break
        case "ArrowUp": shipSpeed++; break;
        case "ArrowDown": shipSpeed--; break;
        case "ArrowLeft": shipDirection -= 4; break;
        case "ArrowRight": shipDirection += 4; break;
    }

    if (shipDirection < 0) {
        shipDirection += 360;
    } else if (shipDirection > 360) {
        shipDirection -= 360;
    }
}

var keyMap = [];

window.addEventListener("keydown", function (event) {   // keyboard event listner
    if (event.defaultPrevented) {
        return;
    }
    if (!keyMap.includes(event.key)) {
        keyMap.push(event.key);
    }
    checkKeyMap();
    event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {   // keyboard event listner
    if (event.defaultPrevented) {
        return;
    }
    if (keyMap.includes(event.key)) {
        keyMap.splice(keyMap.indexOf(event.key), 1);
    }
    checkKeyMap();
    event.preventDefault();
}, true);


// window.addEventListener("keydown", function (event) {   // keyboard event listner
//     if (event.defaultPrevented) {
//         return;
//     }
//     switch (event.key) {
//         case " ": keyPress(5); break
//         case "ArrowUp": keyPress(1); break;
//         case "ArrowDown": keyPress(2); break;
//         case "ArrowLeft": keyPress(3); break;
//         case "ArrowRight": keyPress(4); break;
//         default: return;
//     }
//     event.preventDefault();
// }, true);