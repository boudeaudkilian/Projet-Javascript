import { player, enemy1, enemy2 } from './character.js';
import { 
    attaquer, 
    deplacer, 
    attaquerDistance, 
    activerDefense, 
    desactiverDefense 
} from './combat.js';
import {
    playerElement,
    enemyElement,
    updatePosition,
    updateHealthBar,
    playerHealthBar,
    enemyHealthBar,
    playerHPText,
    enemyHPText
} from './visuel.js';

// Initialisation des positions
player.positionx = 100;
enemy1.positionx = 600;

// Initialisation visuelle
updatePosition(player, playerElement);
updatePosition(enemy1, enemyElement);
updateHealthBar(player, playerHealthBar, playerHPText);
updateHealthBar(enemy1, enemyHealthBar, enemyHPText);

// Fonctions globales pour les boutons HTML
window.testDeplacer = (direction) => {
    deplacer(player, direction);
}

window.testAttaquer = () => {
    attaquer(player, enemy1);
}

window.testAttaqueDistance = () => {
    player.canshoot = true;
    attaquerDistance(player, enemy1);
}

window.testDefense = () => {
    if (player.isDefending) {
        desactiverDefense(player);
    } else {
        activerDefense(player);
    }
}