// script.js - Fixed with Tap to Begin (sound works on every reload)
const lines = [
    "Status: Initializing...",
    "User detected: Anupam",
    "Age update: +1",
    "Loading Mamba Mentality...",
    "Ready"
];

let typingAudio, whooshAudio, cheerAudio, partyAudio;
let confettiCanvas, ctx;
let particles = [];
let animationFrame;

function initAudio() {
    typingAudio = new Audio('typing.mp3');
    whooshAudio = new Audio('whoosh.mp3');
    cheerAudio = new Audio('cheer.mp3');
    partyAudio = new Audio('party.mp3');

    typingAudio.volume = 0.35;
    whooshAudio.volume = 0.75;
    cheerAudio.volume = 0.9;
    partyAudio.volume = 0;
    partyAudio.loop = true;
}

async function typeText(element, text, speed = 38) {
    for (let char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

function createLine() {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    return line;
}

async function runTerminal() {
    const output = document.getElementById('terminal-output');
    output.innerHTML = '';

    typingAudio.loop = true;
    typingAudio.play().catch(() => {});

    for (let i = 0; i < lines.length; i++) {
        const lineEl = createLine();
        output.appendChild(lineEl);

        const textSpan = document.createElement('span');
        const cursor = document.createElement('span');
        cursor.className = 'cursor';

        lineEl.appendChild(textSpan);
        lineEl.appendChild(cursor);

        await typeText(textSpan, lines[i]);
        cursor.remove();

        await new Promise(r => setTimeout(r, 420));
    }

    typingAudio.pause();
    typingAudio.currentTime = 0;

    triggerTransition();
}

function triggerTransition() {
    whooshAudio.play().catch(() => {});

    setTimeout(() => {
        const bgLayer = document.getElementById('bg-layer');
        bgLayer.classList.add('kobe-bg');
    }, 280);

    setTimeout(() => {
        const terminalScreen = document.getElementById('terminal-screen');
        terminalScreen.style.opacity = '0';

        setTimeout(() => {
            terminalScreen.classList.add('hidden');

            const mainContent = document.getElementById('main-content');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');

            triggerCelebration();
        }, 1600);
    }, 2200);
}

function triggerCelebration() {
    cheerAudio.play().catch(() => {});
    launchConfetti();

    setTimeout(() => {
        startPartyMusic();
    }, 19000);
}

function launchConfetti() {
    confettiCanvas = document.getElementById('confetti');
    ctx = confettiCanvas.getContext('2d');
    
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    particles = [];
    const colors = ['#FDB927', '#552583', '#ffffff', '#a0a0ff', '#FDB927'];

    for (let i = 0; i < 320; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 15 + 7,
            speedX: Math.random() * 3.5 - 1.75,
            speedY: Math.random() * 8 + 5,
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 14 - 7,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }

    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.13;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        if (p.y < confettiCanvas.height) alive = true;
    }

    if (alive) requestAnimationFrame(animateConfetti);
}

function startPartyMusic() {
    partyAudio.play().catch(() => {});
    let vol = 0;
    const fade = setInterval(() => {
        vol += 0.035;
        if (vol >= 0.28) {
            vol = 0.28;
            clearInterval(fade);
        }
        partyAudio.volume = vol;
    }, 80);
}

// START BUTTON - This fixes the sound on reload
document.getElementById('start-btn').addEventListener('click', () => {
    const startScreen = document.getElementById('start-screen');
    startScreen.style.opacity = '0';

    setTimeout(() => {
        startScreen.style.display = 'none';
        
        // Now start everything after user gesture
        const terminalScreen = document.getElementById('terminal-screen');
        terminalScreen.classList.remove('hidden');
        
        initAudio();
        runTerminal();
    }, 800);
});

window.addEventListener('resize', () => {
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

function init() {
    // Nothing runs until user taps "Tap to Begin"
}

window.onload = init;