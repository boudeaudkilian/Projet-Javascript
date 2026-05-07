// ===== LOGIQUE DE COMBAT =====
import {
    playerElement, enemyElement,
    playerHealthBar, enemyHealthBar,
    playerHPText, enemyHPText,
    updatePosition, updateHealthBar,
    logToConsole, flashDamage, playAttackAnim, knockback,
    spawnProjectileElement, updateProjectileElement, removeProjectileElement,
    getArenaBounds, showEndScreen,
} from './visuel.js';
import { player } from './Character.js';

const combatState = {
    over: false,
    projectiles: [],
    enemy: null,
};

const setEnemy = (enemy) => { combatState.enemy = enemy; };

const getVisualFor = (personnage) => {
    if (personnage === player) {
        return { element: playerElement, healthBar: playerHealthBar, hpText: playerHPText };
    }
    return { element: enemyElement, healthBar: enemyHealthBar, hpText: enemyHPText };
};

const peutToucher = (attaquant, cible) => {
    const dx = cible.positionx - attaquant.positionx;
    const distance = Math.abs(dx);
    if (distance > attaquant.attackRangeC) return false;
    if (attaquant.facingR && dx < 0) return false;
    if (!attaquant.facingR && dx > 0) return false;
    return true;
};

const recevoirDegats = (cible, degats) => {
    if (combatState.over || !cible.isAlive) return;
    if (cible.isDefending) {
        degats = Math.round(degats * 0.5);
        logToConsole(`${cible.name} bloque une partie des dégâts ! 🛡️`);
    }
    cible.currentHealth -= degats;
    logToConsole(`${cible.name} perd ${degats} PV`);

    const { element, healthBar, hpText } = getVisualFor(cible);
    flashDamage(element);
    updateHealthBar(cible, healthBar, hpText);

    if (cible.currentHealth <= 0) {
        cible.currentHealth = 0;
        cible.isAlive = false;
        updateHealthBar(cible, healthBar, hpText);
        endCombat(cible);
    }
};

const endCombat = (loser) => {
    if (combatState.over) return;
    combatState.over = true;
    const winner = loser === player ? combatState.enemy : player;
    logToConsole(`${loser.name} est K.O. ! 🏁`);
    logToConsole(`${winner.name} remporte le combat !`);
    window.dispatchEvent(new CustomEvent('combatEnd', {
        detail: { winner, loser, isPlayerWin: winner === player }
    }));
};

const faceTarget = (perso, cible) => {
    perso.facingR = cible.positionx >= perso.positionx;
};

// ---------- ATTAQUES ----------
const attaquer = (attaquant, cible) => {
    if (combatState.over || !attaquant.isAlive || !cible.isAlive) return;
    if (attaquant.isOnCooldownMelee()) {
        logToConsole(`${attaquant.name} : attaque CaC en recharge…`);
        return;
    }
    attaquant.lastMeleeAt = performance.now();
    faceTarget(attaquant, cible);

    const { element: attackerEl } = getVisualFor(attaquant);
    playAttackAnim(attackerEl);
    logToConsole(`${attaquant.name} attaque ${cible.name} !`);

    if (peutToucher(attaquant, cible)) {
        logToConsole(`L'attaque touche !`);
        const direction = attaquant.positionx < cible.positionx ? "droite" : "gauche";
        const { element: targetEl } = getVisualFor(cible);
        knockback(cible, targetEl, direction);
        recevoirDegats(cible, attaquant.strength);
    } else {
        logToConsole(`L'attaque rate ! Trop loin ou mauvaise direction.`);
    }
};

const deplacer = (personnage, direction) => {
    if (combatState.over || !personnage.isAlive) return;
    const { min, max } = getArenaBounds();

    if (direction === "droite") {
        personnage.positionx = Math.min(max, personnage.positionx + personnage.speed);
        personnage.facingR = true;
    } else if (direction === "gauche") {
        personnage.positionx = Math.max(min, personnage.positionx - personnage.speed);
        personnage.facingR = false;
    }
    const { element } = getVisualFor(personnage);
    updatePosition(personnage, element);
};

// ---------- PROJECTILES ----------
const tirerProjectile = (attaquant, cible) => {
    faceTarget(attaquant, cible);
    const projectile = {
        positionx: attaquant.positionx + (attaquant.facingR ? 50 : 10),
        positiony: 0,
        vitesse: 14,
        direction: attaquant.facingR ? "droite" : "gauche",
        degats: attaquant.strength,
        taille: 30,
        tireur: attaquant,
        cible,
        element: null,
        alive: true,
    };
    spawnProjectileElement(projectile);
    combatState.projectiles.push(projectile);
    logToConsole(`${attaquant.name} tire un projectile !`);
    return projectile;
};

const projectileTouche = (projectile, cible) =>
    Math.abs(cible.positionx + 30 - projectile.positionx) <= projectile.taille;

const attaquerDistance = (attaquant, cible) => {
    if (combatState.over || !attaquant.isAlive || !cible.isAlive) return;
    if (!attaquant.canShoot || attaquant.attackRangeD <= 0) {
        logToConsole(`${attaquant.name} ne peut pas tirer à distance !`);
        return;
    }
    if (attaquant.isOnCooldownRanged()) {
        logToConsole(`${attaquant.name} : tir en recharge…`);
        return;
    }
    attaquant.lastRangedAt = performance.now();
    tirerProjectile(attaquant, cible);
};

const updateProjectiles = () => {
    const { min, max } = getArenaBounds();
    for (let i = combatState.projectiles.length - 1; i >= 0; i--) {
        const p = combatState.projectiles[i];
        if (!p.alive) continue;

        p.positionx += p.direction === "droite" ? p.vitesse : -p.vitesse;
        updateProjectileElement(p);

        if (p.positionx < min - 50 || p.positionx > max + 50) {
            p.alive = false;
            removeProjectileElement(p);
            combatState.projectiles.splice(i, 1);
            logToConsole(`Le projectile n'a touché personne…`);
            continue;
        }

        const cibles = [player, combatState.enemy].filter(c => c && c !== p.tireur && c.isAlive);
        for (const c of cibles) {
            if (projectileTouche(p, c)) {
                logToConsole(`💥 Le projectile touche ${c.name} !`);
                recevoirDegats(c, p.degats);
                p.alive = false;
                removeProjectileElement(p);
                combatState.projectiles.splice(i, 1);
                break;
            }
        }
    }
};

const clearProjectiles = () => {
    for (const p of combatState.projectiles) removeProjectileElement(p);
    combatState.projectiles = [];
};

// ---------- DÉFENSE ----------
const activerDefense = (personnage) => {
    if (combatState.over) return;
    personnage.isDefending = true;
    logToConsole(`${personnage.name} se met en position de défense ! 🛡️`);
};
const desactiverDefense = (personnage) => {
    personnage.isDefending = false;
    logToConsole(`${personnage.name} arrête de se défendre.`);
};

const resetCombat = () => {
    combatState.over = false;
    clearProjectiles();
};

export {
    combatState, setEnemy,
    peutToucher, recevoirDegats,
    attaquer, deplacer,
    tirerProjectile, attaquerDistance, updateProjectiles, clearProjectiles,
    activerDefense, desactiverDefense,
    endCombat, resetCombat,
};
