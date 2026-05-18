// ===== IA ENNEMIE =====
import { player } from './Character.js';
import { attaquer, attaquerDistance, deplacer, combatState } from './Fight.js';

const updateEnemyAI = () => {
    const enemy = combatState.enemy;
    if (!enemy || combatState.over || !enemy.isAlive || !player.isAlive) return;

    const dx = player.positionx - enemy.positionx;
    const distance = Math.abs(dx);

    // Tireur : utilise sa portée distance si le joueur est trop loin pour le CaC
    if (enemy.canShoot && enemy.attackRangeD > 0 &&
        distance > enemy.attackRangeC && distance <= enemy.attackRangeD) {
        if (!enemy.isOnCooldownRanged()) {
            attaquerDistance(enemy, player);
        }
        return;
    }

    if (distance > enemy.attackRangeC) {
        deplacer(enemy, dx > 0 ? "droite" : "gauche");
    } else if (!enemy.isOnCooldownMelee()) {
        attaquer(enemy, player);
    }
};

export { updateEnemyAI };
