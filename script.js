const audioFiles = [
    'cat31.mp3',
    'cat32.mp3',
    'cat35.mp3'
];

const phrases = [
    "見事な角刈り",
    "もはや豆腐",
    "直角の美学",
    "四角い...!",
    "圧倒的直角",
    "匠の技",
    "Kaku-Gari",
    "Nice Square!",
    "Edgeが効いてる"
];

// Elements
const image = document.querySelector('.full-screen-image');
const overlayText = document.getElementById('overlay-text');
const scoreDisplay = document.getElementById('score');
const rankDisplay = document.getElementById('rank');
const hpBar = document.getElementById('hp-bar');
const gameOverScreen = document.getElementById('game-over-screen');
const finalStats = document.getElementById('final-stats');
const retryBtn = document.getElementById('retry-btn');

// Game State
let score = 0;
let hp = 100; // 0-100
let isGameOver = false;
let gameLoopId = null;

const ranks = [
    { threshold: 0, title: "見習い" },
    { threshold: 10, title: "理髪師" },
    { threshold: 30, title: "職人" },
    { threshold: 50, title: "角刈り神" },
    { threshold: 100, title: "T O F U" },
    { threshold: 200, title: "宇宙豆腐" }
];

function startGame() {
    isGameOver = false;
    score = 0;
    hp = 100;
    scoreDisplay.textContent = `角刈り力: ${score}`;
    rankDisplay.textContent = `称号: ${ranks[0].title}`;
    hpBar.style.width = '100%';
    hpBar.style.backgroundColor = '#00ff00';
    image.style.borderRadius = '0';
    image.style.transform = 'scale(1)';
    gameOverScreen.classList.add('hidden');

    // Start Decay Loop
    if (gameLoopId) clearInterval(gameLoopId);
    gameLoopId = setInterval(gameLoop, 100);
}

function gameLoop() {
    if (isGameOver) return;

    // Difficulty creates exponential decay sensation
    // Base decay + (Score * 0.05)
    let decay = 0.5 + (score * 0.02);
    if (decay > 5) decay = 5; // Cap max decay speed

    hp -= decay;

    if (hp <= 0) {
        gameOver();
    } else {
        updateVisuals();
    }
}

function updateVisuals() {
    hpBar.style.width = `${hp}%`;

    // Changing Colors based on HP
    if (hp > 50) {
        hpBar.style.backgroundColor = '#00ff00'; // Green
    } else if (hp > 20) {
        hpBar.style.backgroundColor = '#ffff00'; // Yellow
    } else {
        hpBar.style.backgroundColor = '#ff0000'; // Red
    }

    // Visual Roundness sensation
    // As HP drops, round corners. 
    // 100 HP = 0% radius. 0 HP = 50% radius.
    const radius = (100 - hp) / 2;
    // Need to scale image slightly down so corners are visible if it is full screen
    const scale = 1 - ((100 - hp) * 0.002); // slight shrink

    image.style.borderRadius = `${radius}%`;
    image.style.transform = `scale(${scale})`;
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoopId);
    hp = 0;
    updateVisuals();

    // Show Screen
    const currentRank = ranks.slice().reverse().find(r => score >= r.threshold);
    finalStats.textContent = `Score: ${score} - Rank: ${currentRank ? currentRank.title : 'None'}`;
    gameOverScreen.classList.remove('hidden');
}

// Click Handler
document.addEventListener('click', (e) => {
    // If clicking retry button or on game over screen, ignore distinct game clicks
    if (isGameOver && e.target.id !== 'retry-btn') return;
    if (e.target.id === 'retry-btn') {
        startGame();
        return;
    }

    // 1. Audio
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const audio = new Audio(audioFiles[randomIndex]);
    audio.play();

    // 2. Score & Healing
    score++;
    scoreDisplay.textContent = `角刈り力: ${score}`;

    // Heal HP on click
    hp += 5;
    if (hp > 100) hp = 100;
    updateVisuals();

    // Rank Update
    const currentRank = ranks.slice().reverse().find(r => score >= r.threshold);
    if (currentRank) {
        rankDisplay.textContent = `称号: ${currentRank.title}`;
    }

    // 3. Text Gimmick
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    overlayText.textContent = randomPhrase;
    overlayText.classList.remove('visible');
    void overlayText.offsetWidth;
    overlayText.classList.add('visible');

    // 4. Image Animation (Shake)
    image.classList.remove('shake');
    void image.offsetWidth;
    image.classList.add('shake');

    // 5. Particles
    spawnParticles(e.clientX, e.clientY);
});

function spawnParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const rotation = Math.random() * 360;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rot', `${rotation}deg`);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Init
startGame();
