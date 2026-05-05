// ===== POINT D'ENTRÉE - du jeu =====
import { player, enemy1 } from './character.js';
import {
    attaquer, deplacer, attaquerDistance,
    activerDefense, desactiverDefense,
    setEnemy, updateProjectiles, combatState,
} from './combat.js';
import { updateEnemyAI } from './ia.js';
import {
    playerElement, enemyElement,
    playerHealthBar, enemyHealthBar,
    playerHPText, enemyHPText,
    updatePosition, updateHealthBar, setNames,
    logToConsole, getArenaBounds,
} from './visuel.js';

// --- Choix de l'ennemi (modifiable plus tard par la partie "niveaux") ---
const currentEnemy = enemy1;
setEnemy(currentEnemy);

// --- Positions initiales (en fonction de la largeur d'arène) ---
const { max } = getArenaBounds();
player.positionx = 100;
currentEnemy.positionx = Math.max(300, max - 150);
player.facingR = true;
currentEnemy.facingR = false;

// --- Initialisation visuelle ---
setNames(player, currentEnemy);
updatePosition(player, playerElement);
updatePosition(currentEnemy, enemyElement);
updateHealthBar(player, playerHealthBar, playerHPText);
updateHealthBar(currentEnemy, enemyHealthBar, enemyHPText);

logToConsole(`Combat lancé : ${player.name} vs ${currentEnemy.name}`);

// --- Boutons HTML existants (compat) ---
window.testDeplacer = (direction) => deplacer(player, direction);
window.testAttaquer = () => attaquer(player, currentEnemy);
window.testAttaqueDistance = () => attaquerDistance(player, currentEnemy);
window.testDefense = () => {
    if (player.isDefending) desactiverDefense(player);
    else activerDefense(player);
};

// --- Contrôles clavier ---
const keysHeld = new Set();
window.addEventListener('keydown', (e) => {
    if (combatState.over) return;
    keysHeld.add(e.key);
    switch (e.key) {
        case ' ':
        case 'a':
        case 'A':
            attaquer(player, currentEnemy); break;
        case 'e':
        case 'E':
            attaquerDistance(player, currentEnemy); break;
        case 's':
        case 'S':
            activerDefense(player); break;
    }
});
window.addEventListener('keyup', (e) => {
    keysHeld.delete(e.key);
    if ((e.key === 's' || e.key === 'S') && player.isDefending) {
        desactiverDefense(player);
    }
});

// --- GAME LOOP (60 FPS) ---
let lastAITick = 0;
const AI_TICK_MS = 100; // l'IA prend une décision toutes les 100ms

const gameLoop = (now) => {
    if (!combatState.over) {
        // Déplacements continus du joueur
        if (keysHeld.has('ArrowLeft') || keysHeld.has('q') || keysHeld.has('Q')) {
            deplacer(player, "gauche");
        }
        if (keysHeld.has('ArrowRight') || keysHeld.has('d') || keysHeld.has('D')) {
            deplacer(player, "droite");
        }

        // IA ennemie (à intervalle régulier)
        if (now - lastAITick > AI_TICK_MS) {
            updateEnemyAI();
            lastAITick = now;
        }

        // Projectiles
        updateProjectiles();
    }

    requestAnimationFrame(gameLoop);
};
requestAnimationFrame(gameLoop);

// --- Hook fin de combat (pour la partie XP/progression de tes coéquipiers) ---
window.addEventListener('combatEnd', (e) => {
    console.log('[combatEnd]', e.detail);
});
