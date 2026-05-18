// ===== GESTION VISUELLE DU COMBAT =====

const playerElement   = document.getElementById('player-character');
const enemyElement    = document.getElementById('enemy-character');
const playerHealthBar = document.getElementById('player-health-bar');
const enemyHealthBar  = document.getElementById('enemy-health-bar');
const playerHPText    = document.getElementById('player-hp-text');
const enemyHPText     = document.getElementById('enemy-hp-text');
const playerNameEl    = document.getElementById('player-name');
const enemyNameEl     = document.getElementById('enemy-name');
const projectilesContainer = document.getElementById('projectiles-container');
const consoleOutput   = document.getElementById('console-output');
const arenaEl         = document.getElementById('arena');

// On pilote la position uniquement via style.left + transform
const initElement = (el) => {
    el.style.right = 'auto';
    el.style.left = '0px';
};
initElement(playerElement);
initElement(enemyElement);

const updatePosition = (personnage, element) => {
    element.style.left = personnage.positionx + 'px';
    const baseScale = personnage.facingR ? 1 : -1;
    element.dataset.scaleX = String(baseScale);
    if (!element.classList.contains('attacking')) {
        element.style.transform = `scaleX(${baseScale})`;
    }
};

const updateHealthBar = (personnage, healthBar, hpText) => {
    const pct = Math.max(0, (personnage.currentHealth / personnage.maxHealth) * 100);
    healthBar.style.width = pct + '%';
    hpText.textContent = Math.max(0, personnage.currentHealth) + ' / ' + personnage.maxHealth + ' HP';
    if (pct < 25) healthBar.classList.add('low-health');
    else healthBar.classList.remove('low-health');
};

const setNames = (player, enemy) => {
    playerNameEl.textContent = player.name;
    enemyNameEl.textContent  = enemy.name;
};

// Personnalise visuellement l'ennemi selon son type (boss/ultra/normal)
const applyEnemyVisual = (enemy) => {
    enemyElement.classList.remove('boss', 'ultra', 'normal');
    enemyElement.classList.add(enemy.kind || 'normal');
    if (enemy.color) enemyElement.style.setProperty('--enemy-color', enemy.color);
    // Appliquer un scale visuel via dataset (consommé par CSS)
    enemyElement.dataset.kind = enemy.kind || 'normal';
};

// Affiche une bannière temporaire en haut de l'arène
const showBanner = (text) => {
    let banner = document.getElementById('arena-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'arena-banner';
        arenaEl.appendChild(banner);
    }
    banner.textContent = text;
    banner.classList.remove('show');
    void banner.offsetWidth; // restart animation
    banner.classList.add('show');
};

const logToConsole = (message) => {
    const time = new Date().toLocaleTimeString();
    consoleOutput.textContent += `[${time}] ${message}\n`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
};

const flashDamage = (element) => {
    element.classList.add('damaged');
    setTimeout(() => element.classList.remove('damaged'), 300);
};

const playAttackAnim = (element) => {
    element.classList.add('attacking');
    setTimeout(() => element.classList.remove('attacking'), 400);
};

const knockback = (personnage, element, direction) => {
    const original = personnage.positionx;
    const dist = direction === 'droite' ? 20 : -20;
    personnage.positionx += dist;
    updatePosition(personnage, element);
    setTimeout(() => {
        personnage.positionx = original;
        updatePosition(personnage, element);
    }, 150);
};

// ----- Projectiles DOM -----
const spawnProjectileElement = (projectile) => {
    const el = document.createElement('div');
    el.className = 'projectile';
    el.style.left = projectile.positionx + 'px';
    el.style.bottom = '60px';
    if (projectile.direction === 'gauche') el.classList.add('reverse');
    projectilesContainer.appendChild(el);
    projectile.element = el;
};
const updateProjectileElement = (projectile) => {
    if (projectile.element) projectile.element.style.left = projectile.positionx + 'px';
};
const removeProjectileElement = (projectile) => {
    if (projectile.element && projectile.element.parentNode) {
        projectile.element.parentNode.removeChild(projectile.element);
    }
};

const getArenaBounds = () => {
    const w = arenaEl.clientWidth;
    return { min: 0, max: Math.max(0, w - 60) };
};

// ===== Écran de fin enrichi =====
// info: { winnerName, isVictory, levelName, progressText, xpGained, playerLevel, playerPts }
// actions: { onReplay, onHome, onLevels, onSkills, onNext, nextLabel, victoryFinal }
const showEndScreen = (info, actions = {}) => {
    let overlay = document.getElementById('end-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'end-overlay';
        overlay.innerHTML = `
            <div class="end-card">
                <h1 id="end-title"></h1>
                <p id="end-sub"></p>
                <div id="end-stats" class="end-stats"></div>
                <div id="end-buttons" class="end-buttons"></div>
            </div>`;
        document.body.appendChild(overlay);
    }

    const isVictory = info.isVictory;
    const titleEl = overlay.querySelector('#end-title');
    const subEl   = overlay.querySelector('#end-sub');
    const statsEl = overlay.querySelector('#end-stats');
    const btnsEl  = overlay.querySelector('#end-buttons');

    if (actions.victoryFinal) {
        titleEl.textContent = '👑 CHAMPION ULTIME';
        titleEl.style.color = '#FFD700';
    } else {
        titleEl.textContent = isVictory ? '🏆 VICTOIRE' : '💀 DÉFAITE';
        titleEl.style.color = isVictory ? '#4CAF50' : '#F44336';
    }
    subEl.textContent = actions.victoryFinal
        ? `Tu as terrassé toutes les légendes du monde Stickman !`
        : `${info.winnerName} remporte le combat`;

    // Stats résumé
    const parts = [];
    if (info.levelName)     parts.push(`<span>📜 ${info.levelName}</span>`);
    if (info.progressText)  parts.push(`<span>⚔️ ${info.progressText}</span>`);
    if (isVictory && info.xpGained) parts.push(`<span>✨ +${info.xpGained} XP</span>`);
    if (info.playerLevel)   parts.push(`<span>🎖️ Niv ${info.playerLevel}</span>`);
    if (info.playerPts != null) parts.push(`<span>🧠 ${info.playerPts} pts</span>`);
    statsEl.innerHTML = parts.join('');

    // Boutons
    btnsEl.innerHTML = '';
    const addBtn = (label, handler, cls = '') => {
        const b = document.createElement('button');
        b.textContent = label;
        if (cls) b.className = cls;
        b.onclick = handler;
        btnsEl.appendChild(b);
    };

    if (actions.onNext) addBtn(actions.nextLabel || '➡️ Suivant', actions.onNext, 'primary');
    addBtn('🔁 Rejouer ce combat', actions.onReplay || (() => window.location.reload()));
    if (actions.onSkills) addBtn('🌳 Compétences', actions.onSkills);
    if (actions.onLevels) addBtn('🗺️ Niveaux', actions.onLevels);
    addBtn('🏠 Accueil', actions.onHome || (() => (window.location.href = 'Index.html')));

    overlay.classList.add('visible');
};

const hideEndScreen = () => {
    const overlay = document.getElementById('end-overlay');
    if (overlay) overlay.classList.remove('visible');
};

// ===== AFFICHAGE BARRE D'XP & NIVEAU (HUD RPG) =====
// On lit la fonction xpForNextLevel depuis Skills.js pour rester DRY
// (Don't Repeat Yourself : la règle de calcul existe à un seul endroit).
import { xpForNextLevel } from './Skills.js';

const updateXPBar = (player) => {
    const need   = xpForNextLevel(player.level);
    const pct    = Math.max(0, Math.min(100, (player.exp / need) * 100));
    const barEl  = document.getElementById('rpg-xp-bar');
    const txtEl  = document.getElementById('rpg-xp-text');
    const lvlEl  = document.getElementById('rpg-level-num');
    const ptsEl  = document.getElementById('rpg-points-num');
    if (barEl) barEl.style.width = pct + '%';
    if (txtEl) txtEl.textContent = `${player.exp} / ${need} XP`;
    if (lvlEl) lvlEl.textContent = player.level;
    if (ptsEl) ptsEl.textContent = player.ptc;
};

// Petite animation "+XP" qui flotte au-dessus du joueur
const showXPGain = (amount) => {
    const el = document.createElement('div');
    el.className = 'xp-floating';
    el.textContent = `+${amount} XP`;
    arenaEl.appendChild(el);
    setTimeout(() => el.remove(), 1400);
};

// Toast plein écran "LEVEL UP !"
const showLevelUpToast = (newLevel) => {
    const el = document.createElement('div');
    el.className = 'level-up-toast';
    el.innerHTML = `<div class="lu-title">⭐ LEVEL UP ⭐</div>
                    <div class="lu-sub">Niveau ${newLevel} — +1 point — clique dans l&#39;arbre pour t&#39;améliorer !</div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
};

export {
    playerElement, enemyElement,
    playerHealthBar, enemyHealthBar,
    playerHPText, enemyHPText,
    projectilesContainer, arenaEl,
    updatePosition, updateHealthBar, setNames,
    applyEnemyVisual, showBanner,
    logToConsole, flashDamage, playAttackAnim, knockback,
    spawnProjectileElement, updateProjectileElement, removeProjectileElement,
    getArenaBounds, showEndScreen, hideEndScreen,
    updateXPBar, showXPGain, showLevelUpToast,
};
