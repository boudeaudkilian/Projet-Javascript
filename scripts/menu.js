// ===== GESTION DES ÉCRANS DU MENU =====
import { LEVELS } from './Character.js';

const screens = {
    home: document.getElementById('homeScreen'),
    mainMenu: document.getElementById('mainMenu'),
    instructions: document.getElementById('instructionsScreen'),
    levels: document.getElementById('levelsScreen'),
};

function showScreen(screenName) {
    Object.values(screens).forEach(s => s && s.classList.remove('active'));
    if (screens[screenName]) screens[screenName].classList.add('active');
}

const getMaxUnlocked = () => parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);

function renderLevels() {
    const grid = document.getElementById('levels-grid');
    if (!grid) return;
    const maxUnlocked = getMaxUnlocked();
    grid.innerHTML = '';
    LEVELS.forEach(lvl => {
        const unlocked = lvl.id <= maxUnlocked;
        const card = document.createElement('div');
        card.className = 'level-card' + (unlocked ? '' : ' locked');
        const badges = lvl.enemies.map(() => '👤').join('') + ' ' +
            (lvl.boss.kind === 'ultra' ? '👑' : '★');
        card.innerHTML = `
            <div class="level-id">N°${lvl.id}</div>
            <h3>${lvl.name}</h3>
            <p class="level-desc">${lvl.description}</p>
            <div class="level-badges">${badges}</div>
            <button class="btn btn-primary" ${unlocked ? '' : 'disabled'}>
                ${unlocked ? '⚔️ Jouer' : '🔒 Verrouillé'}
            </button>`;
        if (unlocked) {
            card.querySelector('button').addEventListener('click', () => {
                localStorage.setItem('gameMode', 'campaign');
                localStorage.setItem('selectedLevel', String(lvl.id));
                window.location.href = './Fight.html';
            });
        }
        grid.appendChild(card);
    });
}

document.getElementById('startBtn').addEventListener('click',           () => showScreen('mainMenu'));
document.getElementById('instructionsBtn').addEventListener('click',    () => showScreen('instructions'));
document.getElementById('backToHomeBtn').addEventListener('click',      () => showScreen('home'));
document.getElementById('backFromInstructionsBtn').addEventListener('click', () => showScreen('home'));
document.getElementById('backFromLevelsBtn').addEventListener('click',  () => showScreen('mainMenu'));

document.getElementById('campaignBtn').addEventListener('click', () => {
    renderLevels();
    showScreen('levels');
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    if (!confirm('Nouvelle partie ? Toute la progression sera effacée.')) return;
    localStorage.removeItem('playerProgress');
    localStorage.removeItem('selectedEnemy');
    localStorage.removeItem('campaignProgress');
    localStorage.setItem('maxUnlockedLevel', '1');
    localStorage.setItem('selectedLevel', '1');
    localStorage.setItem('gameMode', 'campaign');
    window.location.href = './Fight.html';
});

document.getElementById('resumeBtn').addEventListener('click', () => {
    // Reprendre la campagne au dernier niveau atteint
    const lvl = localStorage.getItem('selectedLevel') || '1';
    localStorage.setItem('gameMode', 'campaign');
    localStorage.setItem('selectedLevel', lvl);
    window.location.href = './Fight.html';
});

document.getElementById('skillsBtn').addEventListener('click', () => {
    window.location.href = './Skills.html';
});

window.addEventListener('load', () => {
    if (location.hash === '#levels') {
        renderLevels();
        showScreen('levels');
    } else {
        showScreen('home');
    }
});
