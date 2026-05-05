
import { player } from './character.js';
import { attaquer, attaquerDistance, deplacer, combatState } from './combat.js';

const updateEnemyAI = () => {
    const enemy = combatState.enemy;
    if (!enemy || combatState.over || !enemy.isAlive || !player.isAlive) return;

    const dx = player.positionx - enemy.positionx;
    const distance = Math.abs(dx);

    // Si l'ennemi peut tirer ET que le joueur est dans sa portée distance mais hors CaC
    if (enemy.canShoot && enemy.attackRangeD > 0 &&
        distance > enemy.attackRangeC && distance <= enemy.attackRangeD) {
        if (!enemy.isOnCooldownRanged()) {
            attaquerDistance(enemy, player);
            return;
        }
        // sinon attendre le cooldown sans bouger
        return;
    }

    // Sinon : se rapprocher pour le CaC
    if (distance > enemy.attackRangeC) {
        deplacer(enemy, dx > 0 ? "droite" : "gauche");
    } else {
        // En portée -> attaquer
        if (!enemy.isOnCooldownMelee()) {
            attaquer(enemy, player);
        }
    }
};

export { updateEnemyAI };
