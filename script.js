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

const image = document.querySelector('.full-screen-image');
const overlayText = document.getElementById('overlay-text');

document.addEventListener('click', () => {
    // Audio
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const audio = new Audio(audioFiles[randomIndex]);
    audio.play();

    // Text
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    overlayText.textContent = randomPhrase;

    // Reset animation for text
    overlayText.classList.remove('visible');
    void overlayText.offsetWidth; // Trigger reflow
    overlayText.classList.add('visible');

    // Shake animation for image
    image.classList.remove('shake');
    void image.offsetWidth; // Trigger reflow
    image.classList.add('shake');
});
