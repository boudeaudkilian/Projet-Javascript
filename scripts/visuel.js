// ===== GESTION VISUELLE DU COMBAT =====

// Éléments HTML
const playerElement = document.getElementById('player-character');
const enemyElement = document.getElementById('enemy-character');
const playerHealthBar = document.getElementById('player-health-bar');
const enemyHealthBar = document.getElementById('enemy-health-bar');
const playerHPText = document.getElementById('player-hp-text');
const enemyHPText = document.getElementById('enemy-hp-text');
const consoleOutput = document.getElementById('console-output');

// Met à jour la position visuelle d'un personnage
const updatePosition = (personnage, element) => {
    element.style.left = personnage.positionx + 'px';
}

// Met à jour la barre de vie
const updateHealthBar = (personnage, healthBar, hpText) => {
    const percentage = (personnage.currentHealth / personnage.maxHealth) * 100;
    healthBar.style.width = percentage + '%';
    hpText.textContent = personnage.currentHealth + ' / ' + personnage.maxHealth + ' HP';
}

// Affiche un message dans la console de debug
const logToConsole = (message) => {
    consoleOutput.textContent += message + '\n';
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Effet visuel de coup reçu (flash rouge)
const flashDamage = (element) => {
    element.style.filter = 'brightness(2) saturate(2)';
    setTimeout(() => {
        element.style.filter = 'brightness(1) saturate(1)';
    }, 200);
}

// Effet de knockback (recul)
const knockback = (personnage, element, direction) => {
    const originalPos = personnage.positionx;
    const knockbackDistance = direction === 'droite' ? 20 : -20;
    
    personnage.positionx += knockbackDistance;
    updatePosition(personnage, element);
    
    setTimeout(() => {
        personnage.positionx = originalPos;
        updatePosition(personnage, element);
    }, 150);
}

export {
    playerElement,
    enemyElement,
    updatePosition,
    updateHealthBar,
    logToConsole,
    flashDamage,
    knockback,
    playerHealthBar,
    enemyHealthBar,
    playerHPText,
    enemyHPText
};