const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Hello test 123</title>
  <style>
    body { background: #111; color: #fff; font-family: sans-serif; text-align: center; }
    canvas { border: 2px solid #0f0; margin-top: 20px; }
    #score { font-size: 1.5em; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>Hello test 123</h1>
  <div id="score">Score: 0</div>
  <canvas id="c" width="400" height="400"></canvas>
  <p>Arrow keys to move. Press any arrow key to start.</p>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const SIZE = 20, COLS = 20, ROWS = 20;
    let snake, dir, food, score, running, loop;

    function init() {
      snake = [{x:10, y:10}];
      dir = null;
      score = 0;
      document.getElementById('score').textContent = 'Score: 0';
      placeFood();
      running = false;
      draw();
    }

    function placeFood() {
      do {
        food = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
      } while (snake.some(s => s.x===food.x && s.y===food.y));
    }

    function step() {
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(s=>s.x===head.x&&s.y===head.y)) {
        clearInterval(loop);
        running = false;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0,0,400,400);
        ctx.fillStyle = '#f00';
        ctx.font = '40px sans-serif';
        ctx.fillText('Game Over!', 80, 200);
        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.fillText('Press arrow key to restart', 70, 240);
        return;
      }
      snake.unshift(head);
      if (head.x===food.x && head.y===food.y) {
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function draw() {
      ctx.fillStyle = '#111';
      ctx.fillRect(0,0,400,400);
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x*SIZE, food.y*SIZE, SIZE-1, SIZE-1);
      snake.forEach((s,i) => {
        ctx.fillStyle = i===0 ? '#0f0' : '#090';
        ctx.fillRect(s.x*SIZE, s.y*SIZE, SIZE-1, SIZE-1);
      });
    }

    document.addEventListener('keydown', e => {
      const moves = {ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
      const newDir = moves[e.key];
      if (!newDir) return;
      e.preventDefault();
      if (!running) {
        if (!dir) { dir = newDir; } else { init(); dir = newDir; }
        running = true;
        loop = setInterval(step, 120);
        return;
      }
      if (newDir.x !== -dir.x || newDir.y !== -dir.y) dir = newDir;
    });

    init();
  </script>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
