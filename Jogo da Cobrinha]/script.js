    const canvas = document.getElementById('canvasJogo');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const highScoreElement = document.getElementById('highScore');
        const gameOverElement = document.getElementById('gameOver');
        const startMessageElement = document.getElementById('startMessage');
        const finalScoreElement = document.getElementById('finalScore');

        const gridSize = 15;
        const tileCount = canvas.width / gridSize;

        let snake = [{x: 10, y: 10}];
        let food = {x: 15, y: 15};
        let dx = 0;
        let dy = 0;
        let score = 0;
        let highScore = 0;
        let gameRunning = false;
        let gameStarted = false;
        let gameLoop;

        function drawGame() {
            // Limpa o canvas
            ctx.fillStyle = '#c7d67f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Desenha a comida
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

            // Desenha a cobra
            ctx.fillStyle = '#1a1a1a';
            snake.forEach((segment, index) => {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            });
        }

        function moveSnake() {
            if (!gameRunning) return;

            const head = {x: snake[0].x + dx, y: snake[0].y + dy};

            // Verifica colisão com paredes
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                endGame();
                return;
            }

            // Verifica colisão com o próprio corpo
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                endGame();
                return;
            }

            snake.unshift(head);

            // Verifica se comeu a comida
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreElement.textContent = score;
                generateFood();
            } else {
                snake.pop();
            }

            drawGame();
        }

        function generateFood() {
            let newFood;
            do {
                newFood = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
            
            food = newFood;
        }

        function endGame() {
            gameRunning = false;
            clearInterval(gameLoop);
            
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
            }
            
            finalScoreElement.textContent = score;
            gameOverElement.style.display = 'block';
        }

        function startGame() {
            snake = [{x: 10, y: 10}];
            dx = 0;
            dy = 0;
            score = 0;
            scoreElement.textContent = score;
            gameRunning = true;
            gameStarted = true;
            gameOverElement.style.display = 'none';
            startMessageElement.style.display = 'none';
            
            generateFood();
            drawGame();
            
            clearInterval(gameLoop);
            gameLoop = setInterval(moveSnake, 250);
        }

        document.addEventListener('keydown', (e) => {
            if (!gameStarted && (e.key.startsWith('Arrow'))) {
                startGame();
            }

            if (e.key === ' ' && !gameRunning && gameStarted) {
                e.preventDefault();
                startGame();
            }

            if (!gameRunning) return;

            switch(e.key) {
                case 'ArrowUp':
                    if (dy === 0) {
                        dx = 0;
                        dy = -1;
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (dy === 0) {
                        dx = 0;
                        dy = 1;
                    }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (dx === 0) {
                        dx = -1;
                        dy = 0;
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (dx === 0) {
                        dx = 1;
                        dy = 0;
                    }
                    e.preventDefault();
                    break;
            }
        });

        // Desenha a tela inicial
        drawGame();