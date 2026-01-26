import './style.css';

// DOM Elements
const ScoreEl = document.querySelector('.Score') as HTMLElement;
const HighScoreEl = document.querySelector('.highscore') as HTMLElement;
const StartScreen = document.querySelector('.StartScreen') as HTMLElement;
const GameArea = document.querySelector('.GameArea') as HTMLElement;

// Extended HTMLElement with game properties
interface GameElement extends HTMLElement {
    y?: number;
}

// Game State
interface PlayerState {
    Start: boolean;
    Score: number;
    speed: number;
    x: number;
    y: number;
}

let player: PlayerState = { Start: false, Score: 0, speed: 8, x: 0, y: 0 };
let keys: Record<string, boolean> = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let animationId: number = 0;
let highScore = parseInt(localStorage.getItem('car_racing_highscore') || '0', 10);

// Initialize display
HighScoreEl.textContent = `Highscore: ${highScore}`;
StartScreen.addEventListener('click', Start);

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = false;
    }
});

// Mobile Controls
const setupMobileControls = (): void => {
    const mobileUI = document.createElement('div');
    mobileUI.className = 'controls-mobile';
    mobileUI.innerHTML = `
        <div class="btn-ctrl up" id="up-btn">↑</div>
        <div class="btn-ctrl down" id="down-btn">↓</div>
        <div class="btn-ctrl left" id="left-btn">←</div>
        <div class="btn-ctrl right" id="right-btn">→</div>
    `;
    document.body.appendChild(mobileUI);

    const setupBtn = (id: string, key: string): void => {
        const btn = document.getElementById(id)!;
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys[key] = true;
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys[key] = false;
        });
    };

    setupBtn('left-btn', 'ArrowLeft');
    setupBtn('right-btn', 'ArrowRight');
    setupBtn('up-btn', 'ArrowUp');
    setupBtn('down-btn', 'ArrowDown');
};
setupMobileControls();

// Collision Detection
function isCollide(a: HTMLElement, b: HTMLElement): boolean {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

// Animate Road Lines
function moveLines(): void {
    const lines = document.querySelectorAll('.lines');
    lines.forEach((line) => {
        const elem = line as GameElement;
        if ((elem.y || 0) >= 800) {
            elem.y = (elem.y || 0) - 800;
        }
        elem.y = (elem.y || 0) + player.speed;
        elem.style.top = `${elem.y}px`;
    });
}

// Move Enemy Cars
function moveEnemies(car: HTMLElement): void {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
        const elem = enemy as GameElement;

        if (isCollide(car, elem)) {
            endGame();
            return;
        }

        if ((elem.y || 0) >= GameArea.offsetHeight) {
            elem.y = -300;
            elem.style.left = `${Math.floor(Math.random() * (GameArea.offsetWidth - 60))}px`;
            elem.style.backgroundColor = getRandomColor();
        }

        elem.y = (elem.y || 0) + player.speed;
        elem.style.top = `${elem.y}px`;
    });
}

// Game Loop
function gameLoop(): void {
    if (!player.Start) return;

    const car = document.querySelector('.car') as HTMLElement;
    const road = GameArea.getBoundingClientRect();

    moveLines();
    moveEnemies(car);

    // Player movement
    if (keys.ArrowUp && player.y > 80) player.y -= player.speed;
    if (keys.ArrowDown && player.y < road.height - 130) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < road.width - 55) player.x += player.speed;

    car.style.top = `${player.y}px`;
    car.style.left = `${player.x}px`;

    // Score and difficulty
    player.Score++;
    ScoreEl.textContent = `Score: ${player.Score}`;

    // Speed up every 500 points
    if (player.Score % 500 === 0) {
        player.speed += 0.5;
    }

    animationId = requestAnimationFrame(gameLoop);
}

// Game Over
function endGame(): void {
    player.Start = false;
    cancelAnimationFrame(animationId);

    const car = document.querySelector('.car');
    if (car) car.classList.add('collision');

    if (player.Score > highScore) {
        highScore = player.Score;
        localStorage.setItem('car_racing_highscore', highScore.toString());
        HighScoreEl.textContent = `Highscore: ${highScore}`;
    }

    StartScreen.innerHTML = `
        <div class="max-w-md p-10 rounded-[3rem] bg-gradient-to-br from-red-600 to-orange-600 shadow-2xl shadow-red-500/20 border border-white/10">
            <h2 class="text-4xl font-black mb-6 tracking-tighter uppercase">Game Over</h2>
            <p class="text-lg font-medium leading-relaxed opacity-90 mb-4">
                Score: <span class="font-bold text-white">${player.Score}</span>
            </p>
            <p class="text-lg font-medium leading-relaxed opacity-90 mb-8">
                Best: <span class="font-bold text-yellow-300">${highScore}</span>
            </p>
            <div class="px-8 py-4 bg-white/10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all cursor-pointer">
                Race Again
            </div>
        </div>
    `;

    StartScreen.classList.remove('hide');
}

// Start Game
function Start(): void {
    StartScreen.classList.add('hide');
    GameArea.innerHTML = '';

    // Reset state
    player = { Start: true, Score: 0, speed: 8, x: 0, y: 0 };
    keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

    // Create road lines
    for (let i = 0; i < 6; i++) {
        const line = document.createElement('div');
        line.className = 'lines';
        (line as GameElement).y = i * 150;
        line.style.top = `${(line as GameElement).y}px`;
        GameArea.appendChild(line);
    }

    // Create player car
    const car = document.createElement('div');
    car.className = 'car';
    GameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // Create enemy cars
    for (let i = 0; i < 3; i++) {
        createEnemy(i * 300 * -1);
    }

    // Start game loop
    animationId = requestAnimationFrame(gameLoop);
}

// Create Enemy Car
function createEnemy(yPos: number): void {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    (enemy as GameElement).y = yPos;
    enemy.style.top = `${yPos}px`;
    enemy.style.backgroundColor = getRandomColor();
    enemy.style.left = `${Math.floor(Math.random() * (GameArea.offsetWidth - 60))}px`;
    GameArea.appendChild(enemy);
}

// Get Random Color
function getRandomColor(): string {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
}
