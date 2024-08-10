import { stdin } from 'process';

const width = 80;
const height = 30;

let playerY = Math.floor(height / 2);
let score = 0;
let obstacles = [];
let shouldFlap = false;

const gapSize = 8;
const maxGapStart = height - gapSize - 1;

function generateObstacle() {
    const gap = Math.floor(Math.random() * maxGapStart) + 1;
    obstacles.push({ x: width + 8, gap, gapSize});
}

function drawGame() {
    let screen = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (y === playerY && x === 2) {
                screen += '>';
            } else if (obstacles.some(o => o.x === x && (y < o.gap || y > o.gap + o.gapSize))) {
                screen += '#';
            } else {
                screen += ' ';
            }
        }
        screen += '\n';
    }
    console.clear();
    console.log(screen);
    console.log(`Score: ${score}`);
}

function updateGame() {
    playerY += 1;
    if (shouldFlap) {
        playerY -= 3;
        shouldFlap = false;
    }
    obstacles = obstacles.map(o => ({ ...o, x: o.x - 1 })).filter(o => o.x >= 0);
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < width - 5) {
        generateObstacle();
    }
    score++;
}

function checkCollisions() {
    return obstacles.some(o => 
        o.x === 2 && (playerY < o.gap || playerY > o.gap + o.gapSize)
    ) || playerY < 0 || playerY >= height;
}

async function gameLoop() {
    while (true) {
        drawGame();
        updateGame();

        if (checkCollisions()) {
            console.log('Game over!');
            break;
        }

        await new Promise(r => setTimeout(r, 100));
    }
}

console.log('Press Enter to flap!');

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', (key) => {
    if (key === '\u0003') {
        process.exit();
    } 
    else {
        shouldFlap = true;
    }
});

await gameLoop();
