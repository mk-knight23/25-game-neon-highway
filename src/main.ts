import './style.css';

const Score = document.querySelector('.Score') as HTMLElement;
const HighScoreDisplay = document.querySelector('.highscore') as HTMLElement;
const StartScreen = document.querySelector('.StartScreen') as HTMLElement;
const GameArea = document.querySelector('.GameArea') as HTMLElement;

let highScore = parseInt(localStorage.getItem('mk_car_highscore') || '0');
HighScoreDisplay.innerHTML = `Highscore: ${highScore}`;

StartScreen.addEventListener('click', Start);

let Player: any = { speed: 8, Score: 0 };
let keys: any = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(e: KeyboardEvent) {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
}

function keyup(e: KeyboardEvent) {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = false;
    }
}

// Mobile Controls
const setupMobile = () => {
    const mobileUI = document.createElement('div');
    mobileUI.className = 'controls-mobile';
    mobileUI.innerHTML = `
        <div class="btn-ctrl" id="left-btn">←</div>
        <div class="btn-ctrl" id="right-btn">→</div>
    `;
    document.body.appendChild(mobileUI);

    const left = document.getElementById('left-btn')!;
    const right = document.getElementById('right-btn')!;

    const handleTouch = (key: string, val: boolean) => (e: TouchEvent) => {
        e.preventDefault();
        keys[key] = val;
    };

    left.addEventListener('touchstart', handleTouch('ArrowLeft', true));
    left.addEventListener('touchend', handleTouch('ArrowLeft', false));
    right.addEventListener('touchstart', handleTouch('ArrowRight', true));
    right.addEventListener('touchend', handleTouch('ArrowRight', false));
};
setupMobile();

function iscollide(a: HTMLElement, b: HTMLElement) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

function movelines() {
    let lines = document.querySelectorAll('.lines') as NodeListOf<HTMLElement>;
    lines.forEach(function (item: any) {
        if (item.y >= 750) {
            item.y -= 750;
        }
        item.y += Player.speed;
        item.style.top = item.y + "px";
    });
}

function endgame() {
    Player.Start = false;
    StartScreen.classList.remove('hide');

    if (Player.Score > highScore) {
        highScore = Player.Score;
        localStorage.setItem('mk_car_highscore', highScore.toString());
        HighScoreDisplay.innerHTML = `Highscore: ${highScore}`;
    }

    StartScreen.innerHTML = `
        <p>
            🔥 GAME OVER 🔥<br>
            SCORE: ${Player.Score}<br>
            HIGHSCORE: ${highScore}<br><br>
            <span style="font-size: 1rem; opacity: 0.8">Click to restart</span>
        </p>
    `;
}

function moveenemy(car: HTMLElement) {
    let enemy = document.querySelectorAll('.enemy') as NodeListOf<HTMLElement>;

    enemy.forEach(function (item: any) {
        if (iscollide(car, item)) {
            endgame();
        }
        if (item.y >= 750) {
            item.y -= 800;
            item.style.left = Math.floor(Math.random() * (GameArea.offsetWidth - 60)) + "px";
        }
        item.y += Player.speed;
        item.style.top = item.y + "px";
    });
}

function GamePlay() {
    let car = document.querySelector('.car') as HTMLElement;
    let road = GameArea.getBoundingClientRect();

    if (Player.Start) {
        movelines();
        moveenemy(car);

        if (keys.ArrowUp && Player.y > 100) { Player.y -= Player.speed; }
        if (keys.ArrowDown && Player.y < (road.height - 150)) { Player.y += Player.speed; }
        if (keys.ArrowLeft && Player.x > 0) { Player.x -= Player.speed; }
        if (keys.ArrowRight && Player.x < (road.width - 60)) { Player.x += Player.speed; }

        car.style.top = Player.y + "px";
        car.style.left = Player.x + "px";
        window.requestAnimationFrame(GamePlay);

        Player.Score++;
        Score.innerHTML = "Score: " + Player.Score;

        // Dynamic difficulty
        if (Player.Score % 500 === 0) Player.speed += 0.5;
    }
}

function Start() {
    StartScreen.classList.add('hide');
    GameArea.innerHTML = "";

    Player.Start = true;
    Player.Score = 0;
    Player.speed = 8;
    window.requestAnimationFrame(GamePlay);

    for (let x = 0; x < 5; x++) {
        let roadline = document.createElement('div') as any;
        roadline.setAttribute('class', 'lines');
        roadline.y = (x * 150);
        roadline.style.top = roadline.y + "px";
        GameArea.appendChild(roadline);
    }

    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    GameArea.appendChild(car);

    Player.x = car.offsetLeft;
    Player.y = car.offsetTop;

    for (let x = 0; x < 3; x++) {
        let enemycar = document.createElement('div') as any;
        enemycar.setAttribute('class', 'enemy');
        enemycar.y = ((x + 1) * 350) * -1;
        enemycar.style.top = enemycar.y + "px";
        enemycar.style.backgroundColor = randomColor();
        enemycar.style.left = Math.floor(Math.random() * (GameArea.offsetWidth - 60)) + "px";
        GameArea.appendChild(enemycar);
    }
}

function randomColor() {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}
