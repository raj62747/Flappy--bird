const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');

// Load assets
const birdImg = new Image();
birdImg.src = 'assets/bird.png';
const pipeTopImg = new Image();
pipeTopImg.src = 'assets/pipe-top.png';
const pipeBottomImg = new Image();
pipeBottomImg.src = 'assets/pipe-bottom.png';

const flapSound = new Audio('assets/flap.wav');
const hitSound = new Audio('assets/hit.wav');

let birdY = 250, birdVelocity = 0;
let pipes = [];
let gravity = 0.5;
let flapStrength = -8;
let pipeSpeed = 2;
let score = 0;
let gameOver = false;

function resetGame() {
  birdY = 250;
  birdVelocity = 0;
  pipes = [{ x: 400, height: randomHeight() }];
  score = 0;
  gameOver = false;
  restartBtn.style.display = "none";
}

function randomHeight() {
  return Math.random() * 200 + 100;
}

function flap() {
  if (!gameOver) {
    birdVelocity = flapStrength;
    flapSound.play();
  } else {
    resetGame();
  }
}

document.addEventListener('keydown', e => e.code === 'Space' && flap());
canvas.addEventListener('click', flap);
restartBtn.addEventListener('click', resetGame);

function update() {
  birdVelocity += gravity;
  birdY += birdVelocity;

  if (birdY > canvas.height - 30 || birdY < 0) {
    hitSound.play();
    gameOver = true;
  }

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    if (
      pipe.x < 60 &&
      pipe.x + 50 > 40 &&
      (birdY < pipe.height || birdY > pipe.height + 150)
    ) {
      if (!gameOver) hitSound.play();
      gameOver = true;
    }
  });

  if (pipes[pipes.length - 1].x < 200) {
    pipes.push({ x: 400, height: randomHeight() });
  }

  if (pipes[0].x + 50 < 0) {
    pipes.shift();
    score++;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(birdImg, 30, birdY, 34, 24);

  pipes.forEach(pipe => {
    ctx.drawImage(pipeTopImg, pipe.x, pipe.height - pipeTopImg.height);
    ctx.drawImage(pipeBottomImg, pipe.x, pipe.height + 150);
  });

  ctx.fillStyle = "#fff";
  ctx.font = "32px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", 90, canvas.height / 2);
    restartBtn.style.display = "inline-block";
  }
}

function loop() {
  if (!gameOver) update();
  draw();
  requestAnimationFrame(loop);
}

resetGame();
loop();
