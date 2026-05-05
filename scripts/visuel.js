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

// IMPORTANT : on supprime tout positionnement CSS résiduel (right/left)
// et on pilote la position uniquement via style.left + transform.
const initElement = (el) => {
    el.style.right = 'auto';
    el.style.left = '0px';
};
initElement(playerElement);
initElement(enemyElement);

// Met à jour la position visuelle d'un personnage
const updatePosition = (personnage, element) => {
    element.style.left = personnage.positionx + 'px';
    // Retourne le sprite selon l'orientation
    const baseScale = personnage.facingR ? 1 : -1;
    // Ne pas écraser une animation en cours : on stocke l'échelle dans un dataset
    element.dataset.scaleX = String(baseScale);
    if (!element.classList.contains('attacking')) {
        element.style.transform = `scaleX(${baseScale})`;
    }
};

// Met à jour la barre de vie + état low-health
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

// Console de debug
const logToConsole = (message) => {
    const time = new Date().toLocaleTimeString();
    consoleOutput.textContent += `[${time}] ${message}\n`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
};

// Flash de dégâts
const flashDamage = (element) => {
    element.classList.add('damaged');
    setTimeout(() => element.classList.remove('damaged'), 300);
};

// Animation d'attaque
const playAttackAnim = (element) => {
    element.classList.add('attacking');
    setTimeout(() => element.classList.remove('attacking'), 400);
};

// Knockback (recul temporaire)
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
// Crée un élément projectile et le place à la position de départ
const spawnProjectileElement = (projectile) => {
    const el = document.createElement('div');
    el.className = 'projectile';
    el.style.left = projectile.positionx + 'px';
    // Hauteur ~ centre du stickman
    el.style.bottom = '60px';
    if (projectile.direction === 'gauche') el.classList.add('reverse');
    projectilesContainer.appendChild(el);
    projectile.element = el;
};

const updateProjectileElement = (projectile) => {
    if (projectile.element) {
        projectile.element.style.left = projectile.positionx + 'px';
    }
};

const removeProjectileElement = (projectile) => {
    if (projectile.element && projectile.element.parentNode) {
        projectile.element.parentNode.removeChild(projectile.element);
    }
};

// Bornes horizontales de l'arène
const getArenaBounds = () => {
    const w = arenaEl.clientWidth;
    return { min: 0, max: Math.max(0, w - 60) }; // 60 = largeur stickman
};

// Écran de fin
const showEndScreen = (winnerName, isVictory) => {
    let overlay = document.getElementById('end-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'end-overlay';
        overlay.innerHTML = `
            <div class="end-card">
                <h1 id="end-title"></h1>
                <p id="end-sub"></p>
                <button id="end-btn">Rejouer</button>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#end-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
    overlay.querySelector('#end-title').textContent = isVictory ? '🏆 VICTOIRE' : '💀 DÉFAITE';
    overlay.querySelector('#end-title').style.color = isVictory ? '#4CAF50' : '#F44336';
    overlay.querySelector('#end-sub').textContent  = `${winnerName} remporte le combat`;
    overlay.classList.add('visible');
};

export {
    playerElement, enemyElement,
    playerHealthBar, enemyHealthBar,
    playerHPText, enemyHPText,
    projectilesContainer, arenaEl,
    updatePosition, updateHealthBar, setNames,
    logToConsole, flashDamage, playAttackAnim, knockback,
    spawnProjectileElement, updateProjectileElement, removeProjectileElement,
    getArenaBounds, showEndScreen,
};
